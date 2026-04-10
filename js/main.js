document.addEventListener("DOMContentLoaded", function () {

    const inputJogador1 = document.getElementById("jogador1");
    const inputJogador2 = document.getElementById("jogador2");
    const btnIniciar = document.getElementById("btnIniciar");

    const mensagemErro = document.createElement("p");
    mensagemErro.classList.add("erro");

    const formContainer = document.querySelector(".form-container");
    formContainer.appendChild(mensagemErro);

    btnIniciar.addEventListener("click", function () {

        const nome1 = inputJogador1.value.trim();
        const nome2 = inputJogador2.value.trim();

        if (nome1 === "" || nome2 === "") {
            mensagemErro.textContent = "Por favor, preencha os nomes dos dois jogadores.";
            return;
        }

        mensagemErro.textContent = "";
        localStorage.setItem("jogador1", nome1);
        localStorage.setItem("jogador2", nome2);

        window.location.href = "jogo.html";
    });

});