const API_URL = "https://crudcrud.com/api/fcf69716a6ca4cd6890586b51597ecca/clientes";

// Capturando elementos do DOM
const formCliente = document.getElementById('form-cliente');
const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const listaClientes = document.getElementById('lista-clientes');

// READ: Função para buscar e listar os clientes (GET)
async function listarClientes() {
    try {
        const resposta = await fetch(API_URL);
        
        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status}`);
        }

        const clientes = await resposta.json();
        
        // Limpa a tela de carregamento
        listaClientes.innerHTML = "";

        if (clientes.length === 0) {
            listaClientes.innerHTML = "<p class='instrucoes'>Nenhum cliente cadastrado ainda.</p>";
            return;
        }

        // Renderiza cada cliente na tela
        clientes.forEach(cliente => {
            // O CrudCrud gera o ID automaticamente no campo _id
            const card = document.createElement('div');
            card.className = "cliente-card";
            card.innerHTML = `
                <div class="cliente-info">
                    <strong>${cliente.nome}</strong>
                    <span>${cliente.email}</span>
                </div>
                <button class="btn-excluir" onclick="excluirCliente('${cliente._id}')">Excluir</button>
            `;
            listaClientes.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao listar clientes:", erro);
        listaClientes.innerHTML = "<p class='erro'>Erro ao carregar a lista. Verifique o console ou se a URL do CrudCrud expirou.</p>";
    }
}

// CREATE: Evento para cadastrar um novo cliente (POST)
formCliente.addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede a página de recarregar

    const novoCliente = {
        nome: inputNome.value,
        email: inputEmail.value
    };

    try {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoCliente)
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao cadastrar: ${resposta.status}`);
        }

        // Limpa os campos após o sucesso
        inputNome.value = "";
        inputEmail.value = "";
        
        // Foca no primeiro campo para agilizar novos cadastros
        inputNome.focus();

        // Atualiza a lista na tela automaticamente
        listarClientes();

    } catch (erro) {
        console.error("Erro ao cadastrar cliente:", erro);
        alert("Falha ao cadastrar. Veja o console.");
    }
});

// DELETE: Função para excluir um cliente
async function excluirCliente(id) {
    // Confirmação para evitar exclusão acidental
    const confirmar = confirm("Tem certeza que deseja excluir este cliente?");
    if (!confirmar) return;

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            throw new Error(`Erro ao excluir: ${resposta.status}`);
        }

        // Após excluir no servidor, atualiza a lista na tela
        listarClientes();

    } catch (erro) {
        console.error("Erro ao excluir cliente:", erro);
        alert("Falha ao excluir. Veja o console.");
    }
}

// Inicializa a aplicação buscando a lista ao carregar a página
listarClientes();