const glpiService = require('../services/glpi.service');
const { mapStatus, mapPriority } = require('../utils/mappings.js');


module.exports = {
  // GET /tickets/:id
  getTicketById: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const tickets = await glpiService.getTickets(); // esta função precisa existir
      const ticket = tickets.find(t => t.id === id);

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket não encontrado.' });
      }

    //  Filtra apenas os campos desejados
    const filteredTicket = {
      id: ticket.id,
      name: ticket.name,
      description: ticket.content,  
      status: mapStatus(ticket.status),
      priority: mapPriority(ticket.priority)
    };
      res.json(filteredTicket);

    } catch (error) {
      console.error('Erro ao obter ticket por ID:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // POST para criar tickets
  createTicket: async (req, res) => {
    try {
      const { input } = req.body;
      if (!input || typeof input.name !== 'string' || input.name.trim() === '') {
        return res.status(400).json({ error: 'Campo "input.name" é obrigatório.' });
      }

      const ticket = await glpiService.createTicket(req.body);

      res.status(201).json({
        message: 'Ticket criado com sucesso!',
        ticketId: ticket.id
      });
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // PUT /tickets/:id/status
  updateTicketStatus: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;

      if (isNaN(id) || isNaN(status)) {
        return res.status(400).json({ error: 'ID e Status devem ser números.' });
      }

      const data = { input: { id, status } };
      const updatedTicket = await glpiService.updateTicketStatus(data);

      res.json({
        message: 'Status atualizado com sucesso!',
        updatedTicket
      });

    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({ error: error.message });
    }
  }
};
