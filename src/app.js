const express = require('express');
const app = express();

app.use(express.json());

const ticketsRoutes = require('./routes/ticketRoutes');  // Certifique-se que o caminho está correto
app.use('/api', ticketsRoutes);

module.exports = app;
