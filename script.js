// Função que recebe a resposta da API e desenha na tela
function exibirDadosNaPagina(dados) {
    const divLoading = document.getElementById('loading');
    const divResultado = document.getElementById('resultado');

    // Verifica se a API retornou erro (CNPJ inválido, muitas consultas, etc)
    if (dados.status === "ERROR") {
        divLoading.innerHTML = `<span style="color: red;">Erro: ${dados.message}</span>`;
        return;
    }

    // Esconde o "Carregando" e mostra o resultado
    divLoading.style.display = 'none';
    divResultado.style.display = 'block';

    const classeStatus = dados.situacao === "ATIVA" ? "ativa" : "inativa";
    const complemento = dados.complemento ? ` - ${dados.complemento}` : '';

    divResultado.innerHTML = `
        <div class="info-group"><span class="label">Razão Social:</span> ${dados.nome}</div>
        <div class="info-group"><span class="label">Nome Fantasia:</span> ${dados.fantasia || 'Não registrado'}</div>
        <div class="info-group"><span class="label">CNPJ:</span> ${dados.cnpj}</div>
        <div class="info-group">
            <span class="label">Situação:</span> 
            <span class="status ${classeStatus}">${dados.situacao}</span>
        </div>
        <div class="info-group"><span class="label">Data de Abertura:</span> ${dados.abertura}</div>
        <div class="info-group"><span class="label">Natureza Jurídica:</span> ${dados.natureza_juridica}</div>
        
        <hr>
        
        <div class="info-group"><span class="label">Atividade Princ.:</span> ${dados.atividade_principal[0].text}</div>
        
        <hr>
        
        <div class="info-group"><span class="label">Endereço:</span> ${dados.logradouro}, ${dados.numero}${complemento}</div>
        <div class="info-group"><span class="label">Bairro:</span> ${dados.bairro}</div>
        <div class="info-group"><span class="label">Cidade/UF:</span> ${dados.municipio} - ${dados.uf}</div>
        <div class="info-group"><span class="label">CEP:</span> ${dados.cep}</div>
        
        <hr>
        
        <div class="info-group"><span class="label">Telefone:</span> ${dados.telefone || 'Não informado'}</div>
        <div class="info-group"><span class="label">E-mail:</span> ${dados.email || 'Não informado'}</div>
    `;
}

// Nova função que é disparada ao clicar no botão buscar
function buscarCnpj() {
    const inputCnpj = document.getElementById('cnpjInput').value;
    
    // Remove tudo que não for número (tira os pontos, barras e traços)
    const cnpjLimpo = inputCnpj.replace(/\D/g, '');

    // Validação básica se tem 14 dígitos
    if (cnpjLimpo.length !== 14) {
        alert("Por favor, digite um CNPJ válido com 14 números.");
        return;
    }

    // Prepara a tela para carregar
    document.getElementById('resultado').style.display = 'none';
    const divLoading = document.getElementById('loading');
    divLoading.style.display = 'block';
    divLoading.innerHTML = 'Buscando dados na ReceitaWS...';

    // Remove o script anterior se existir, para evitar acúmulo no HTML
    const scriptAntigo = document.getElementById('scriptJsonp');
    if (scriptAntigo) {
        scriptAntigo.remove();
    }

    // Cria a requisição injetando o CNPJ digitado
    const script = document.createElement('script');
    script.id = 'scriptJsonp';
    script.src = `https://receitaws.com.br/v1/cnpj/${cnpjLimpo}?callback=exibirDadosNaPagina`;
    
    document.body.appendChild(script);
}

// Configura o botão de busca para rodar a função
document.getElementById('btnBuscar').addEventListener('click', buscarCnpj);

// Bônus: Fazer a busca ao apertar "Enter" no teclado
document.getElementById('cnpjInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarCnpj();
    }
});