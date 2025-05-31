const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/tickets.controller');

router.get('/tickets/:id', ticketsController.getTicketById);
router.post('/tickets', ticketsController.createTicket);
router.put('/tickets/:id/status', ticketsController.updateTicketStatus);

module.exports = router;
