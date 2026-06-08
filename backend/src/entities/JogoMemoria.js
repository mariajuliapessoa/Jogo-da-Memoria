const Carta = require('./Carta');
const Jogador = require('./Jogador');

class JogoMemoria {
  constructor(nomeJ1, socketIdJ1, nomeJ2, socketIdJ2) {
    this.jogadores = [
      new Jogador(nomeJ1, socketIdJ1, 0),
      new Jogador(nomeJ2, socketIdJ2, 1),
    ];
    this.jogadorAtualIndex = 0;
    this.cartas = [];
    this.cartasViradas = [];
    this.bloqueado = false;
    this.historico = [];
    this.valoresBase = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    this.tamanho = 4;
  }

  _embaralhar(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  criarCartas() {
    const pares = this._embaralhar([...this.valoresBase, ...this.valoresBase]);
    this.cartas = pares.map((valor, id) => new Carta(id, valor));
  }

  getJogadorAtual() {
    return this.jogadores[this.jogadorAtualIndex];
  }

  alternarTurno() {
    this.jogadorAtualIndex = this.jogadorAtualIndex === 0 ? 1 : 0;
  }

  virarCarta(cardId, socketId) {
    if (this.bloqueado) return { ok: false, erro: 'BLOQUEADO' };

    const jogadorAtual = this.getJogadorAtual();
    if (jogadorAtual.socketId !== socketId) return { ok: false, erro: 'NAO_E_SUA_VEZ' };

    const carta = this.cartas.find(c => c.id === cardId);
    if (!carta || carta.virada || carta.acertada) return { ok: false, erro: 'CARTA_INVALIDA' };

    carta.virar();
    this.cartasViradas.push(carta);
    return { ok: true };
  }

  verificarPar() {
    if (this.cartasViradas.length < 2) return null;

    this.bloqueado = true;
    const [c1, c2] = this.cartasViradas;
    const jogador = this.getJogadorAtual();

    if (c1.valor === c2.valor) {
      c1.marcarComoAcertada();
      c2.marcarComoAcertada();
      jogador.adicionarPonto();
      this.cartasViradas = [];
      this.bloqueado = false;
      // Preserva o turno — quem acerta continua jogando (regra original)
      const entrada = { jogador: jogador.nome, valores: [c1.valor, c2.valor], resultado: true };
      this.historico.push(entrada);
      return { resultado: true, historico: entrada };
    } else {
      const entrada = { jogador: jogador.nome, valores: [c1.valor, c2.valor], resultado: false };
      this.historico.push(entrada);
      return { resultado: false, historico: entrada };
    }
  }

  resetarCartasViradas() {
    this.cartasViradas.forEach(c => c.desvirar());
    this.cartasViradas = [];
    this.bloqueado = false;
    this.alternarTurno(); // Só alterna no erro
  }

  verificarFimDeJogo() {
    return this.cartas.every(c => c.acertada);
  }

  obterVencedor() {
    const [j1, j2] = this.jogadores;
    if (j1.pontos > j2.pontos) return { nome: j1.nome, pontos: j1.pontos };
    if (j2.pontos > j1.pontos) return { nome: j2.nome, pontos: j2.pontos };
    return null; // empate
  }

  reiniciar() {
    this.jogadores.forEach(j => j.resetarPontos());
    this.jogadorAtualIndex = 0;
    this.cartasViradas = [];
    this.bloqueado = false;
    this.historico = [];
    this.criarCartas();
  }

  // Estado público enviado ao frontend
  // Cartas não viradas chegam com valor null (frontend não conhece o valor)
  getEstado() {
    return {
      cartas: this.cartas.map(c => ({
        id: c.id,
        valor: c.virada || c.acertada ? c.valor : null,
        virada: c.virada,
        acertada: c.acertada,
      })),
      jogadores: this.jogadores.map(j => ({
        nome: j.nome,
        pontos: j.pontos,
        socketId: j.socketId,
        index: j.index,
      })),
      jogadorAtualIndex: this.jogadorAtualIndex,
      jogadorAtualSocketId: this.getJogadorAtual().socketId,
      historico: this.historico,
      tamanho: this.tamanho,
    };
  }
}

module.exports = JogoMemoria;
