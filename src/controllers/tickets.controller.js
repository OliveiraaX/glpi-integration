// Controlador de tickets - Lida com as requisições HTTP relacionadas a tickets
const glpiService = require('../services/glpi.service');
const { mapStatus, mapPriority } = require('../utils/mappings.js');

module.exports = {
  // GET /tickets/:id - Retorna um ticket específico por ID
  getTicketById: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

      const ticket = await glpiService.getTicketById(id);
      if (!ticket) return res.status(404).json({ error: 'Ticket não encontrado.' });

      // Formata os dados do ticket com status e prioridade legíveis
      //const formattedTicket = {
      //   id: ticket.id,
      //   name: ticket.name,
      //   description: ticket.content,
      //   status: mapStatus(ticket.status),
      //   priority: mapPriority(ticket.priority),
      //   agent: ticket.agent || null
      // };
      res.json(ticket);
    } catch (error) {
      console.error('Erro na função getTicketById :', error);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /tickets - Retorna todos os tickets ativos (status === 1)
  getAllTickets: async (req, res) => {
    try {
      const tickets = await glpiService.getTickets();
      const activeTickets = tickets.filter(ticket => ticket.status === 1);

      const formatted = activeTickets.map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        description: ticket.content,
        status: mapStatus(ticket.status),
        priority: mapPriority(ticket.priority)
      }));

      res.json(formatted);
    } catch (error) {
      console.error('Erro na função getAllTickets:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // POST /tickets - Cria um novo ticket
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
      console.error('Erro na função createTicket:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // PUT /tickets/:id/status - Atualiza o status de um ticket
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
      console.error('Erro na função updateTicketStatus:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE /tickets/:id - Deleta um ticket
  deleteTicket: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

      const result = await glpiService.deleteTicket(id);
      if (!result) return res.status(404).json({ error: 'Ticket não encontrado.' });

      res.json({ message: 'Ticket deletado com sucesso.' });
    } catch (error) {
      console.error('Erro na função deleteTicket>', error);
      res.status(500).json({ error: error.message });
    }
  }
};
