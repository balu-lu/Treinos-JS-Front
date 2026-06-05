// Classe entidade que representa o modelo de dados do Cliente
export class Cliente {
    constructor(nome, email) {
        this.nome = nome;
        this.email = email;
    }
}

// Classe de serviço é responsável exclusivamente pela comunicação externa (Fetch API)
export class ClienteAPI {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async listarTodos() {
        const resposta = await fetch(this.baseUrl);
        if (!resposta.ok) throw new Error('Erro ao buscar clientes');
        return await resposta.json();
    }

    async cadastrar(cliente) {
        const resposta = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        if (!resposta.ok) throw new Error('Erro ao cadastrar cliente');
        return await resposta.json();
    }

    async deletar(id) {
        const resposta = await fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE'
        });
        if (!resposta.ok) throw new Error('Erro ao deletar cliente');
        return true;
    }
}