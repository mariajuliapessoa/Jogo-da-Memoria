let jogo;

const historicoLista = document.getElementById("historicoJogadas");
const tabuleiro = document.getElementById("tabuleiro");
const nomeJogador1El = document.getElementById("nomeJogador1");
const nomeJogador2El = document.getElementById("nomeJogador2");
const pontosJogador1El = document.getElementById("pontosJogador1");
const pontosJogador2El = document.getElementById("pontosJogador2");
const jogadorAtualEl = document.getElementById("jogadorAtual");
const jogador1Info = document.getElementById("jogador1Info");
const jogador2Info = document.getElementById("jogador2Info");
const btnReiniciar = document.getElementById("btnReiniciar");

document.addEventListener("DOMContentLoaded", function () {
    const nome1 = localStorage.getItem("jogador1") || "Jogador 1";
    const nome2 = localStorage.getItem("jogador2") || "Jogador 2";

    nomeJogador1El.textContent = nome1;
    nomeJogador2El.textContent = nome2;

    jogo = new JogoMemoria(nome1, nome2);
    iniciarJogo();

    btnReiniciar.addEventListener("click", reiniciarJogo);
});

function adicionarHistorico(jogador, carta1, carta2, resultado) {

    const li = document.createElement("li");

    li.textContent = `${jogador.nome} virou [${carta1.valor}, ${carta2.valor}] → ${resultado ? "ACERTO" : "ERRO"}`;

    historicoLista.appendChild(li);

    historicoLista.scrollTop = historicoLista.scrollHeight;
}

function iniciarJogo() {
    jogo.criarCartas();
    jogo.embaralharCartas();
    renderizarTabuleiro();
    atualizarPlacar();
    atualizarTurno();
}

function renderizarTabuleiro() {
    tabuleiro.innerHTML = "";
    let index = 0;

    for (let i = 0; i < jogo.tamanho; i++) {
        const tr = document.createElement("tr");

        for (let j = 0; j < jogo.tamanho; j++) {
            const td = document.createElement("td");
            const carta = jogo.cartas[index];
            const cartaEl = criarElementoCarta(carta);

            td.appendChild(cartaEl);
            tr.appendChild(td);
            index++;
        }

        tabuleiro.appendChild(tr);
    }
}

function criarElementoCarta(carta) {
    const cartaDiv = document.createElement("div");
    cartaDiv.classList.add("carta");

    const inner = document.createElement("div");
    inner.classList.add("carta-inner");

    const front = document.createElement("div");
    front.classList.add("carta-front");
    front.textContent = carta.valor;

    const back = document.createElement("div");
    back.classList.add("carta-back");
    back.textContent = "?";

    inner.appendChild(front);
    inner.appendChild(back);
    cartaDiv.appendChild(inner);

    cartaDiv.addEventListener("click", () => manipularCliqueCarta(carta, cartaDiv));
    carta.elemento = cartaDiv;
    return cartaDiv;
}

function manipularCliqueCarta(carta, elemento) {

    if (carta.acertada) return;

    if (!jogo.virarCarta(carta)) return;

    elemento.classList.add("virada");

    if (jogo.cartasViradas.length === 2) {

        const [carta1, carta2] = jogo.cartasViradas;
        const jogador = jogo.getJogadorAtual();

        const resultado = jogo.verificarPar();

        // ✅ ACERTO
        if (resultado === true) {

            adicionarHistorico(jogador, carta1, carta2, true);

            carta1.elemento.classList.add("acertou");
            carta2.elemento.classList.add("acertou");

            setTimeout(() => {
                atualizarPlacar();
                verificarFim();
            }, 500);

        }
        // ❌ ERRO
        else if (resultado === false) {

            adicionarHistorico(jogador, carta1, carta2, false);

            setTimeout(() => {

                jogo.resetarCartasViradas();
                desvirarCartasDOM();
                jogo.alternarTurno();
                atualizarTurno();

            }, 1000);
        }
    }
}

function desvirarCartasDOM() {

    const cartasViradasDOM = document.querySelectorAll(".carta.virada");

    cartasViradasDOM.forEach(el => {
        // Só desvira se NÃO for carta acertada
        if (!el.classList.contains("acertou")) {
            el.classList.remove("virada");
        }
    });
}

function atualizarPlacar() {
    pontosJogador1El.textContent = jogo.jogadores[0].pontos;
    pontosJogador2El.textContent = jogo.jogadores[1].pontos;
}

function atualizarTurno() {
    const jogadorAtual = jogo.getJogadorAtual();
    jogadorAtualEl.textContent = jogadorAtual.nome;

    jogador1Info.classList.remove("ativo");
    jogador2Info.classList.remove("ativo");

    if (jogo.jogadorAtualIndex === 0) {
        jogador1Info.classList.add("ativo");
    } else {
        jogador2Info.classList.add("ativo");
    }
}

function verificarFim() {
    if (jogo.verificarFimDeJogo()) {
        const vencedor = jogo.obterVencedor();

        setTimeout(() => {
            if (vencedor) {
                alert(`🏆 ${vencedor.nome} venceu com ${vencedor.pontos} pontos!`);
            } else {
                alert("🤝 Empate!");
            }
        }, 300);
    }
}

function reiniciarJogo() {

    jogo.resetarJogo();

    renderizarTabuleiro();
    atualizarPlacar();
    atualizarTurno();

    // Limpar histórico
    historicoLista.innerHTML = "";
}