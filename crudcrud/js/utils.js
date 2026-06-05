// Validação básica usando Expressão Regular
export const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Uso do reduce(): Conta o total de clientes na lista
export const calcularTotalClientes = (clientes) => {
    return clientes.reduce((acumulador, clienteAtual) => acumulador + 1, 0);
};

// Uso do find(): Encontra um cliente específico pelo ID na lista carregada em memória
export const buscarClienteNaMemoria = (clientes, idDesejado) => {
    return clientes.find(cliente => cliente._id === idDesejado);
};