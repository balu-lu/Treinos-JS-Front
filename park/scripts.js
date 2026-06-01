// Classe responsável pelas regras de negócio
class Parquimetro {
    constructor() {
        // Tabela de tarifas ordenada do maior para o menor valor
        this.tarifas = [
            { valor: 3.00, tempo: 120 },
            { valor: 2.00, tempo: 60 },
            { valor: 1.00, tempo: 30 }
        ];
    }

    processarPagamento(valorPago) {
        // regra: menor que 1 real
        if (valorPago < 1.00) {
            return {
                sucesso: false,
                mensagem: "Valor insuficiente. O mínimo é R$ 1,00."
            };
        }

        // Percorre as tarifas do maior para o menor
        for (let tarifa of this.tarifas) {
            if (valorPago >= tarifa.valor) {
                let troco = valorPago - tarifa.valor;
                return {
                    sucesso: true,
                    tempo: tarifa.tempo,
                    troco: troco
                };
            }
        }
    }
}

const meuParquimetro = new Parquimetro();

const btnCalcular = document.getElementById('btn-calcular');
const inputValor = document.getElementById('valor-pago');
const divResultado = document.getElementById('resultado');

btnCalcular.addEventListener('click', () => {
    // Coleta e converte o valor digitado
    const valorInserido = parseFloat(inputValor.value);

    // Validação do campo
    if (isNaN(valorInserido)) {
        exibirMensagem("Por favor, insira um valor numérico válido.", false);
        return;
    }

    // Chama o método
    const resultado = meuParquimetro.processarPagamento(valorInserido);

    // Exibe o resultado
    if (resultado.sucesso) {
        const trocoFormatado = resultado.troco.toFixed(2).replace('.', ',');
        const texto = `Tempo liberado: ${resultado.tempo} minutos.<br>Troco: R$ ${trocoFormatado}`;
        exibirMensagem(texto, true);
    } else {
        exibirMensagem(resultado.mensagem, false);
    }
});

function exibirMensagem(texto, ehSucesso) {
    divResultado.innerHTML = texto;
    divResultado.classList.remove('oculto', 'erro', 'sucesso');
    
    if (ehSucesso) {
        divResultado.classList.add('sucesso');
    } else {
        divResultado.classList.add('erro');
    }
}