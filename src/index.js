// Importa express
const express = require('express');

// Importar rota
const ticketRoutes = require('./routes/ticketRoutes');

// Carregar variavel de ambiente
require('dotenv').config();

// Criar instância e chamar varável de ambiente
const app = express();
const PORT = process.env.PORT;

// Middleware para parsear requisições com corpo em JSON
app.use(express.json());

// Registra as rotas de tickets com o prefixo '/api'
app.use('/api', ticketRoutes);

// Iniciar serviço e exibe uma mensagem
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
