class Carta {
    constructor(id, valor) {
        this.id = id;
        this.valor = valor;
        this.virada = false;
        this.acertada = false;
        this.elemento = null;
    }

    virar() {
        this.virada = true;
    }

    desvirar() {
        this.virada = false;
    }

    marcarComoAcertada() {
        this.acertada = true;
    }
}

class Jogador {
    constructor(nome) {
        this.nome = nome;
        this.pontos = 0;
    }

    adicionarPonto() {
        this.pontos++;
    }

    resetarPontos() {
        this.pontos = 0;
    }
}

class JogoMemoria {
    constructor(nomeJogador1, nomeJogador2) {
        this.jogadores = [
            new Jogador(nomeJogador1),
            new Jogador(nomeJogador2)
        ];

        this.jogadorAtualIndex = 0;
        this.cartas = [];
        this.cartasViradas = [];
        this.bloqueado = false;
        this.tamanho = 4;
        this.valoresBase = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    }

    criarCartas() {
        let id = 0;
        const pares = [...this.valoresBase, ...this.valoresBase];
        this.cartas = pares.map(valor => new Carta(id++, valor));
    }

    embaralharCartas() {
        for (let i = this.cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]];
        }
    }

    getJogadorAtual() {
        return this.jogadores[this.jogadorAtualIndex];
    }

    alternarTurno() {
        if (this.jogadorAtualIndex === 0) {
            this.jogadorAtualIndex = 1;
        } else {
            this.jogadorAtualIndex = 0;
        }
    }

    virarCarta(carta) {
        if (this.bloqueado) return false;
        if (carta.virada || carta.acertada) return false;

        carta.virar();
        this.cartasViradas.push(carta);
        return true;
    }

verificarPar() {
    if (this.cartasViradas.length < 2) return null;

    this.bloqueado = true;
    const [carta1, carta2] = this.cartasViradas;

    if (carta1.valor === carta2.valor) {
        carta1.marcarComoAcertada();
        carta2.marcarComoAcertada();
        this.getJogadorAtual().adicionarPonto();
        this.cartasViradas = [];
        this.bloqueado = false;
        return true;
    } else {
        return false;
    }
}


    resetarCartasViradas() {
        this.cartasViradas.forEach(carta => carta.desvirar());
        this.cartasViradas = [];
        this.bloqueado = false;
    }

    verificarFimDeJogo() {
        return this.cartas.every(carta => carta.acertada);
    }

    obterVencedor() {
        const [j1, j2] = this.jogadores;
        if (j1.pontos > j2.pontos) return j1;
        if (j2.pontos > j1.pontos) return j2;
        return null;
    }

    resetarJogo() {
        this.jogadores.forEach(j => j.resetarPontos());
        this.jogadorAtualIndex = 0;
        this.cartasViradas = [];
        this.bloqueado = false;
        this.criarCartas();
        this.embaralharCartas();
    }
}