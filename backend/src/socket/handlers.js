const roomManager = require('../managers/RoomManager');

const FLIP_DELAY_MS = 1000;

module.exports = function registrarHandlers(io, socket) {

  socket.on('criar_sala', ({ nome }) => {
    if (!nome || !nome.trim()) {
      return socket.emit('erro', { mensagem: 'Nome inválido.' });
    }
    const sala = roomManager.criarSala(nome.trim(), socket.id);
    socket.join(sala.id);
    socket.emit('sala_criada', { roomId: sala.id });
  });

  socket.on('entrar_sala', ({ roomId, nome }) => {
    if (!nome || !nome.trim() || !roomId) {
      return socket.emit('erro', { mensagem: 'Dados inválidos.' });
    }

    const resultado = roomManager.entrarSala(roomId.toUpperCase(), nome.trim(), socket.id);

    if (!resultado.ok) {
      const msgs = {
        SALA_NAO_ENCONTRADA: 'Sala não encontrada.',
        SALA_CHEIA: 'Sala já está cheia.',
        JOGO_JA_INICIADO: 'Jogo já em andamento.',
      };
      return socket.emit('erro', { mensagem: msgs[resultado.erro] || 'Erro ao entrar.' });
    }

    socket.join(roomId.toUpperCase());

    // Envia roomId junto para que o jogador 2 saiba em qual sala está
    io.to(resultado.sala.id).emit('jogo_iniciado', {
      roomId: resultado.sala.id,
      estado: resultado.sala.jogo.getEstado(),
    });
  });

  socket.on('virar_carta', ({ roomId, cardId }) => {
    const sala = roomManager.getSala(roomId);
    if (!sala || sala.status !== 'em_andamento') return;

    const { jogo } = sala;
    const resultado = jogo.virarCarta(cardId, socket.id);

    if (!resultado.ok) {
      return socket.emit('erro', { mensagem: resultado.erro });
    }

    if (jogo.cartasViradas.length === 1) {
      io.to(roomId).emit('estado_atualizado', { estado: jogo.getEstado() });
      return;
    }

    if (jogo.cartasViradas.length === 2) {
      const { resultado: acertou, historico } = jogo.verificarPar();

      if (acertou) {
        io.to(roomId).emit('par_verificado', {
          estado: jogo.getEstado(),
          resultado: true,
          historico,
        });

        if (jogo.verificarFimDeJogo()) {
          sala.status = 'encerrada';
          io.to(roomId).emit('jogo_encerrado', {
            estado: jogo.getEstado(),
            vencedor: jogo.obterVencedor(),
          });
        }
      } else {
        io.to(roomId).emit('par_verificado', {
          estado: jogo.getEstado(),
          resultado: false,
          historico,
        });

        setTimeout(() => {
          jogo.resetarCartasViradas();
          io.to(roomId).emit('estado_atualizado', { estado: jogo.getEstado() });
        }, FLIP_DELAY_MS);
      }
    }
  });

  socket.on('reiniciar_jogo', ({ roomId }) => {
    const sala = roomManager.getSala(roomId);
    if (!sala) return;

    const eJogadorDaSala = sala.jogadores.some(j => j.socketId === socket.id);
    if (!eJogadorDaSala) return;
    if (sala.status !== 'encerrada') return;

    sala.votosReinicio.add(socket.id);

    if (sala.votosReinicio.size >= 2) {
      sala.jogo.reiniciar();
      sala.status = 'em_andamento';
      sala.votosReinicio.clear();
      io.to(roomId).emit('jogo_reiniciado', {
        estado: sala.jogo.getEstado(),
      });
    } else {
      io.to(roomId).emit('voto_reinicio', { votos: sala.votosReinicio.size });
    }
  });

  socket.on('disconnect', () => {
    const sala = roomManager.removerJogador(socket.id);
    if (sala && sala.jogadores.length > 0) {
      io.to(sala.id).emit('oponente_desconectou', {
        mensagem: 'Seu oponente desconectou.',
      });
    }
  });
};
