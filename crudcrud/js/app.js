import { Cliente, ClienteAPI } from './classes.js';
import { validarEmail, calcularTotalClientes, buscarClienteNaMemoria } from './utils.js';

const API_URL = "https://crudcrud.com/api/fcf69716a6ca4cd6890586b51597ecca/clientes";
const api = new ClienteAPI(API_URL);

// Estado local da aplicação (mantém os dados em memória para evitar requisições desnecessárias)
let estadoClientes = [];

// Elementos do DOM
const formCliente = document.getElementById('form-cliente');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const listaClientes = document.getElementById('lista-clientes');
const spanTotalClientes = document.getElementById('total-clientes');

// Função de Renderização 
const renderizarTela = () => {
    listaClientes.innerHTML = ""; // Limpa a lista

    if (estadoClientes.length === 0) {
        listaClientes.innerHTML = "<p class='instrucoes'>Nenhum cliente cadastrado.</p>";
        spanTotalClientes.innerText = "Total: 0";
        return;
    }

    // Uso do reduce()
    const total = calcularTotalClientes(estadoClientes);
    spanTotalClientes.innerText = `Total: ${total}`;

    // Uso do map(): Transforma os objetos de dados em elementos HTML visuais
    const htmlCards = estadoClientes.map(cliente => `
        <div class="cliente-card">
            <div class="cliente-info">
                <strong>${cliente.nome}</strong>
                <span>${cliente.email}</span>
            </div>
            <button class="btn-excluir" data-id="${cliente._id}">Excluir</button>
        </div>
    `).join(''); // Une o array gerado pelo map em uma única string HTML

    listaClientes.innerHTML = htmlCards;
};

// Carregar dados iniciais
const carregarDados = async () => {
    try {
        estadoClientes = await api.listarTodos();
        renderizarTela();
    } catch (erro) {
        console.error(erro);
        listaClientes.innerHTML = "<p class='erro'>Erro ao carregar a API.</p>";
    }
};

// Captura do Evento de Submissão do Formulário
formCliente.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();

    // Validação de entrada usando função pura
    if (!validarEmail(email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    const novoCliente = new Cliente(nome, email);

    try {
        // Envia para a API
        const clienteSalvo = await api.cadastrar(novoCliente);
        
        // Atualiza o estado local e re-renderiza (Interface dinâmica sem reload)
        estadoClientes.push(clienteSalvo);
        renderizarTela();

        // Limpa formulário
        formCliente.reset();
        inputNome.focus();
    } catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar cliente.");
    }
});

// Captura do Evento de Exclusão
listaClientes.addEventListener('click', async (evento) => {
    if (evento.target.classList.contains('btn-excluir')) {
        const idCliente = evento.target.getAttribute('data-id');

        // Uso do find()
        const clienteParaDeletar = buscarClienteNaMemoria(estadoClientes, idCliente);
        
        if (clienteParaDeletar && confirm(`Tem certeza que deseja excluir ${clienteParaDeletar.nome}?`)) {
            try {
                // Deleta na API
                await api.deletar(idCliente);
                
                // Filtra o estado local removendo o deletado e re-renderiza
                estadoClientes = estadoClientes.filter(c => c._id !== idCliente);
                renderizarTela();
            } catch (erro) {
                console.error(erro);
                alert("Erro ao excluir cliente.");
            }
        }
    }
});

// Inicialização
carregarDados();