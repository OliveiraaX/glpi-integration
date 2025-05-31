const express = require('express');
const router = express.Router();

// Importa o controller de tickets que contém as funções de lógica de cada rota
const ticketsController = require('../controllers/tickets.controller');

// GET específico (por ID)
router.get('/:id', ticketsController.getTicketById);

// POST - Cria um novo ticket
router.post('/', ticketsController.createTicket);

// PUT - Atualiza status do ticket
router.put('/:id/status', ticketsController.updateTicketStatus);

// DELETE - Remove um ticket
router.delete('/:id', ticketsController.deleteTicket);

// GET geral - Lista todos os tickets
router.get('/', ticketsController.getAllTickets); 

module.exports = router;
