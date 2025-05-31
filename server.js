// Importa a instância do app Express configurada no arquivo './src/app'
const app = require('./src/app');

// Define a porta onde o servidor vai escutar as requisições
const PORT = 3000;

// Inicia o servidor, fazendo-o escutar na porta definida
app.listen(PORT, () => {

  console.log(`Servidor rodando na porta ${PORT}`);
});
