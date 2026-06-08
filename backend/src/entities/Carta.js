class Carta {
  constructor(id, valor) {
    this.id = id;
    this.valor = valor;
    this.virada = false;
    this.acertada = false;
  }

  virar() {
    this.virada = true;
  }

  desvirar() {
    this.virada = false;
  }

  marcarComoAcertada() {
    this.acertada = true;
    this.virada = true;
  }
}

module.exports = Carta;
