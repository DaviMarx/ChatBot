const wppconnect = require('@wppconnect-team/wppconnect'); 

    
const userStages = {}; 

wppconnect.create({ 
    session: 'whatsbot',
    autoClose: false,
    puppeteerOptions: { args: ['--no-sandbox'] }
})
    .then((client) => 
        client.onMessage((message) => { 
            console.log('Mensagem digitada pelo usuário: ' + message.body); 
            stages(client, message); 
        }))
    .catch((error) =>
        console.log(error)); 


function stages(client, message) {
    const stage = userStages[message.from] || 'Nome'; 

    switch (stage) {
        case 'Nome':
            sendWppMessage(client, message.from, 'Olá! Qual é o seu nome?');
            userStages[message.from] = 'NumPedido';
            break;
        case 'NumPedido':
            const numPedido = message.body;
            sendWppMessage(client, message.from, `Obrigado por informar o seu nome: ${numPedido}`);
            sendWppMessage(client, message.from, 'Quantos itens você comprou?');
            userStages[message.from] = 'ItensPedido';
            break;
        case 'ItensPedido':
            const qntItens = message.body;
            sendWppMessage(client, message.from, `Obrigado por informar a quantidade de itens do seu pedido: ${qntItens}`);
            sendWppMessage(client, message.from, 'Qual o valor total do seu pedido?');
            userStages[message.from] = 'ValorPedido';
            break;
        case 'ValorPedido':
            const valorTotal = message.body;
            sendWppMessage(client, message.from, `Obrigado por informar o valor total do seu pedido: ${valorTotal}`);
            sendWppMessage(client, message.from, 'Qual é o seu endereço de entrega?');
            userStages[message.from] = 'Endereco';
            break;
        case 'Endereco':
            const endereco = message.body;
            sendWppMessage(client, message.from, `Obrigado por informar o seu endereço de entrega: ${endereco}`);
            sendWppMessage(client, message.from, 'Obrigado por entrar em contato! Encerrando atendimento.');
            userStages[message.from] = 'Fim';
            break;
        case 'Fim':
            break;
    }
}


function sendWppMessage(client, sendTo, text) {
    client
        .sendText(sendTo, text)
        .then((result) => {
            // console.log('SUCESSO: ', result); 
        })
        .catch((erro) => {
            console.error('ERRO: ', erro);
        });
}
