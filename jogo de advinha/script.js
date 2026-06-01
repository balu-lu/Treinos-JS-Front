// 1. Gerar o número aleatório entre 1 e 100
const numeroSecreto = Math.floor(Math.random() * 100) + 1;

// 2. Definir e inicializar o número máximo de tentativas
const maxTentativas = 10;
let tentativasRestantes = maxTentativas;

// Selecionando os elementos do DOM
const inputPalpite = document.getElementById('input-palpite');
const btnChutar = document.getElementById('btn-chutar');
const mensagemJogo = document.getElementById('mensagem-jogo');
const contadorTentativas = document.getElementById('contador-tentativas');

// Exibindo as tentativas iniciais
contadorTentativas.innerText = tentativasRestantes;

// Função principal disparada ao clicar no botão
btnChutar.addEventListener('click', function() {
    const valorInserido = inputPalpite.value;

    let entradaValida = true;
    if (valorInserido.length === 0) {
        entradaValida = false;
    } else {
        for (let i = 0; i < valorInserido.length; i++) {
            // Se algum caractere não for número, invalida (apesar do input type=number ajudar)
            if (valorInserido[i] < '0' || valorInserido[i] > '9') {
                entradaValida = false;
                break; // Interrompe o loop
            }
        }
    }
    // ---------------------------------------------------------

    // Validação de intervalo (1 a 100) e uso do parseInt()
    const palpite = parseInt(valorInserido);

    if (!entradaValida || isNaN(palpite) || palpite < 1 || palpite > 100) {
        mensagemJogo.innerText = "Por favor, insira um número válido entre 1 e 100.";
        mensagemJogo.className = "texto-erro";
        inputPalpite.value = ""; // Limpa o campo
        return; // Interrompe a execução aqui, não desconta tentativa
    }

    // Decrementar o contador de tentativas
    tentativasRestantes--;
    contadorTentativas.innerText = tentativasRestantes;

    // Limpar o campo de input para a próxima tentativa
    inputPalpite.value = "";

    // Estruturas de controle if, else if e else para a lógica do jogo
    if (palpite === numeroSecreto) {
        mensagemJogo.innerText = "🎉 Você acertou! O número era " + numeroSecreto + "!";
        mensagemJogo.className = "texto-sucesso";
        finalizarJogo();
    } 
    else if (tentativasRestantes === 0) {
        mensagemJogo.innerText = "❌ Você perdeu! O número secreto era " + numeroSecreto + ".";
        mensagemJogo.className = "texto-erro";
        finalizarJogo();
    } 
    else if (palpite > numeroSecreto) {
        mensagemJogo.innerText = "⬇️ O número secreto é menor que " + palpite + ".";
        mensagemJogo.className = "texto-dica";
    } 
    else {
        mensagemJogo.innerText = "⬆️ O número secreto é maior que " + palpite + ".";
        mensagemJogo.className = "texto-dica";
    }
    
    // Devolve o foco para o input automaticamente para melhorar a UX
    inputPalpite.focus(); 
});

// Função auxiliar para travar o jogo quando acabar
function finalizarJogo() {
    inputPalpite.disabled = true;
    btnChutar.disabled = true;
}