class Jogador {
  constructor(nome, socketId, index) {
    this.nome = nome;
    this.socketId = socketId;
    this.index = index;
    this.pontos = 0;
  }

  adicionarPonto() {
    this.pontos++;
  }

  resetarPontos() {
    this.pontos = 0;
  }
}

module.exports = Jogador;
