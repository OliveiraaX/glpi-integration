// Importa o módulo Expresss
const express = require('express');

// Importa as rotas relacionadas a "tickets" de um arquivo externo
const ticketsRoutes = require('./routes/ticketRoutes');

// Importa as rotas relacionadas a "users" de um arquivo externo
const usersRouter = require('./routes/usersRoutes'); 

// Cria uma instância do aplicativo Express
const app = express();

// Adiciona um middleware para interpretar requisições com corpo no formato JSON
app.use(express.json());

// Define o caminho base '/api/tickets' para todas as rotas relacionadas a tickets
app.use('/api/tickets', ticketsRoutes);
app.use('/api', usersRouter);

// Exporta a instância do aplicativo para ser usada em outro arquivo, como o servidor principal
module.exports = app;
