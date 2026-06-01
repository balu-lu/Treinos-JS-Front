const form = document.getElementById('form-cadastro');
const cepInput = document.getElementById('cep');
const cepErro = document.getElementById('cep-erro');
const btnLimpar = document.getElementById('btn-limpar');

// Objeto para facilitar o acesso aos campos de endereço
const camposEndereco = {
    rua: document.getElementById('rua'),
    bairro: document.getElementById('bairro'),
    cidade: document.getElementById('cidade'),
    uf: document.getElementById('uf')
};

function formatarCep(valor) {
    const cepNumeros = valor.replace(/\D/g, '').slice(0, 8);

    if (cepNumeros.length <= 5) {
        return cepNumeros;
    }

    return `${cepNumeros.slice(0, 5)}-${cepNumeros.slice(5)}`;
}

// ==========================================
// 1. FUNCIONALIDADE: VIA CEP (FETCH API)
// ==========================================

cepInput.addEventListener('input', (evento) => {
    evento.target.value = formatarCep(evento.target.value);
});

cepInput.addEventListener('blur', async (evento) => {
    // Remove caracteres não numéricos
    const cep = evento.target.value.replace(/\D/g, '');

    if (cep.length === 8) {
        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await resposta.json();

            if (dados.erro) {
                mostrarErroCep(true);
                limparCamposEndereco();
            } else {
                mostrarErroCep(false);
                preencherEndereco(dados);
                salvarDadosNoStorage(); // Salva logo após preencher automaticamente
            }
        } catch (erro) {
            console.error("Erro ao buscar o CEP:", erro);
            mostrarErroCep(true);
        }
    } else if (cep.length > 0) {
        // Se tem algo digitado, mas não tem 8 números
        mostrarErroCep(true);
    }
});

function preencherEndereco(dados) {
    camposEndereco.rua.value = dados.logradouro;
    camposEndereco.bairro.value = dados.bairro;
    camposEndereco.cidade.value = dados.localidade;
    camposEndereco.uf.value = dados.uf;
    document.getElementById('numero').focus(); // Joga o foco para o número
}

function limparCamposEndereco() {
    camposEndereco.rua.value = '';
    camposEndereco.bairro.value = '';
    camposEndereco.cidade.value = '';
    camposEndereco.uf.value = '';
}

function mostrarErroCep(mostrar) {
    if (mostrar) {
        cepErro.classList.remove('oculto');
        cepInput.style.borderColor = 'var(--danger)';
    } else {
        cepErro.classList.add('oculto');
        cepInput.style.borderColor = 'var(--border-color)';
    }
}

// ==========================================
// 2. FUNCIONALIDADE: WEB STORAGE API
// ==========================================
const STORAGE_KEY = 'cadastroUsuarioState';

// Dispara sempre que QUALQUER campo do formulário for alterado
form.addEventListener('input', salvarDadosNoStorage);

function salvarDadosNoStorage() {
    // Coleta os dados atuais do formulário
    const formData = new FormData(form);
    const dadosObj = Object.fromEntries(formData.entries());
    
    // Converte para string e salva no LocalStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosObj));
}

// Executa automaticamente quando a página termina de carregar
window.addEventListener('DOMContentLoaded', () => {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    
    if (dadosSalvos) {
        const dadosObj = JSON.parse(dadosSalvos);
        
        Object.keys(dadosObj).forEach(key => {
            const input = form.elements[key];
            if (input) {
                input.value = dadosObj[key];
            }
        });

        cepInput.value = formatarCep(cepInput.value);
    }
});

// ==========================================
// 3. LIMPEZA E SUBMIT
// ==========================================
btnLimpar.addEventListener('click', () => {
    form.reset();
    localStorage.removeItem(STORAGE_KEY);
    mostrarErroCep(false);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Cadastro finalizado com sucesso! Os dados foram enviados.');
    // Após o envio real limpa o form e o storage
    form.reset();
    localStorage.removeItem(STORAGE_KEY);
});
