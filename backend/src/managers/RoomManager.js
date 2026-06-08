const { v4: uuidv4 } = require('uuid');
const JogoMemoria = require('../entities/JogoMemoria');

class RoomManager {
  constructor() {
    // roomId -> { id, jogadores, jogo, status, votosReinicio }
    this.salas = new Map();

    // socketId -> roomId
    this.socketParaSala = new Map();
  }

  criarSala(nome, socketId) {
    const id = uuidv4().slice(0, 6).toUpperCase();
    const sala = {
      id,
      jogadores: [{ nome, socketId }],
      jogo: null,
      status: 'aguardando', // aguardando | em_andamento | encerrada
      votosReinicio: new Set(),
    };
    this.salas.set(id, sala);
    this.socketParaSala.set(socketId, id);
    return sala;
  }

  entrarSala(roomId, nome, socketId) {
    const sala = this.salas.get(roomId);
    if (!sala) return { ok: false, erro: 'SALA_NAO_ENCONTRADA' };
    if (sala.jogadores.length >= 2) return { ok: false, erro: 'SALA_CHEIA' };
    if (sala.status !== 'aguardando') return { ok: false, erro: 'JOGO_JA_INICIADO' };

    sala.jogadores.push({ nome, socketId });
    this.socketParaSala.set(socketId, roomId);

    // Iniciar jogo com 2 jogadores
    const [j1, j2] = sala.jogadores;
    sala.jogo = new JogoMemoria(j1.nome, j1.socketId, j2.nome, j2.socketId);
    sala.jogo.criarCartas();
    sala.status = 'em_andamento';

    return { ok: true, sala };
  }

  getSala(roomId) {
    return this.salas.get(roomId) || null;
  }

  getSalaPorSocket(socketId) {
    const roomId = this.socketParaSala.get(socketId);
    return roomId ? this.salas.get(roomId) : null;
  }

  removerJogador(socketId) {
    const sala = this.getSalaPorSocket(socketId);
    if (!sala) return null;
    this.socketParaSala.delete(socketId);
    sala.jogadores = sala.jogadores.filter(j => j.socketId !== socketId);
    if (sala.jogadores.length === 0) {
      this.salas.delete(sala.id);
    }
    return sala;
  }
}

module.exports = new RoomManager();
