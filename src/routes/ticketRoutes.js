// Importa o framework Express e o serviço GLPI
const express = require('express');
const router = express.Router();
const glpiService = require('../services/glpiService');
const { error } = require('console');

// Rota para listar todos os tickets
router.get('/tickets/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const ticket = await glpiService.getTickets(id);
    res.json(id);
    console.error('Erro na listagem de ticket:', error)
  } catch (error) {
    console.error('Error ao obter ticket por ID:', error);
    res.status(500).json({ error: error.message });
    
  }} )

// Rota para criar um ticket
router.post('/tickets', async (req, res) => {
  try {
    // Validação básica do corpo da requisição
    if (!req.body || !req.body.input || !req.body.input.name) {
      return res.status(400).json({ error: 'Dados do ticket incompletos. O campo "input.name" é obrigatório.' });
    }

    const ticket = await glpiService.createTicket(req.body);
    
    if (ticket && ticket.id) {
      console.log(`Ticket criado com ID: ${ticket.id}`);
      res.status(201).json({
        message: 'Ticket criado com sucesso!',
        ticketId: ticket.id
      });
      console.error('Erro ao criar ticket:', error)
    } else {
      console.warn('Ticket pode não ter sido criado corretamente:', ticket);
      res.status(202).json({
        message: 'Ticket criado, mas sem ID retornado.',
        response: ticket
      });
    }
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
