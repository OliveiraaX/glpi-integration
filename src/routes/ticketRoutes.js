// Rotas de tickets - Define as rotas HTTP relacionadas a tickets
const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/tickets.controller');

// GET /api/tickets/:id - Retorna um ticket pelo ID
router.get('/:id', ticketsController.getTicketById);

// POST /api/tickets - Cria um novo ticket
router.post('/', ticketsController.createTicket);

// PUT /api/tickets/:id/status - Atualiza o status de um ticket
router.put('/:id/status', ticketsController.updateTicketStatus);

// DELETE /api/tickets/:id - Remove um ticket
router.delete('/:id', ticketsController.deleteTicket);

// GET /api/tickets - Lista todos os tickets ativos
router.get('/', ticketsController.getAllTickets);

module.exports = router;
