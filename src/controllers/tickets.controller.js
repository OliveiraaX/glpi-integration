// Importa o serviço responsável por interações com o GLPI
const glpiService = require('../services/glpi.service');

// Importa funções utilitárias para traduzir status e prioridade
const { mapStatus, mapPriority } = require('../utils/mappings.js');

module.exports = {
  // Rota GET /tickets/:id - Busca um ticket específico pelo ID
  getTicketById: async (req, res) => {
    try {
      // Converte o parâmetro de rota para número inteiro
      const id = parseInt(req.params.id, 10);

      // Validação: Verifica se o ID é um número válido
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      // Obtém a lista de todos os tickets (função precisa existir no serviço)
      const tickets = await glpiService.getTickets();

      // Procura pelo ticket que corresponde ao ID fornecido
      const ticket = tickets.find(t => t.id === id);

      // Retorna erro caso o ticket não seja encontrado
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket não encontrado.' });
      }
      // Busca os dados completos do agente
      let agentInfo = null;
      if (ticket.users_id_assign) {
        agentInfo = await glpiService.getUserById(ticket.users_id_assign);
      }
      const filteredTicket = {
        id: ticket.id,
        name: ticket.name,
        description: ticket.content,
        status: mapStatus(ticket.status),
        priority: mapPriority(ticket.priority),
        agent: agentInfo  
      };
      console.log('Ticket completo:', ticket);
      
      res.json(filteredTicket);
    }
     catch (error) {
      console.error('Erro ao obter ticket por ID:', error);
      res.status(500).json({ error: error.message });
    }
  },
  
// LISTAR TODOS OS TICKETS
getAllTickets: async (req, res) => {
  try {
    // Busca todos os tickets usando o serviço
    const tickets = await glpiService.getTickets();

    // Filtra apenas tickets ativos (por exemplo, status === 1)
    const activeTickets = tickets.filter(ticket => ticket.status === 1);

    // Mapeia os tickets para retornar apenas os campos desejados
    const formattedTickets = activeTickets.map(ticket => ({
      id: ticket.id,
      name: ticket.name,
      description: ticket.content,
      status: mapStatus(ticket.status),
      priority: mapPriority(ticket.priority)
    }));

    res.json(formattedTickets);
  } catch (error) {
    console.error('Erro ao listar tickets:', error);
    res.status(500).json({ error: error.message });
  }
},

  // Rota POST /tickets - Cria um novo ticket
  createTicket: async (req, res) => {
    try {
      const { input } = req.body;

      // Validação: verifica se o campo "input.name" existe e não está vazio
      if (!input || typeof input.name !== 'string' || input.name.trim() === '') {
        return res.status(400).json({ error: 'Campo "input.name" é obrigatório.' });
      }

      // Chama o serviço para criar o ticket com os dados recebidos
      const ticket = await glpiService.createTicket(req.body);

      // Retorna resposta de sucesso com o ID do novo ticket
      res.status(201).json({
        message: 'Ticket criado com sucesso!',
        ticketId: ticket.id
      });

    } catch (error) {
      console.error('Erro na função createTicket:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Rota PUT /tickets/:id/status - Atualiza o status de um ticket específico
  updateTicketStatus: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;

      // Validação: Verifica se ID e status são números válidos
      if (isNaN(id) || isNaN(status)) {
        return res.status(400).json({ error: 'ID e Status devem ser números.' });
      }

      // Prepara o objeto de entrada para o serviço
      const data = { input: { id, status } };

      // Chama o serviço para atualizar o status do ticket
      const updatedTicket = await glpiService.updateTicketStatus(data);

      // Retorna mensagem de sucesso e o ticket atualizado
      res.json({
        message: 'Status atualizado com sucesso!',
        updatedTicket
      });

    } catch (error) {
      console.error('Erro na função updateTicketStatus:', error);
      res.status(500).json({ error: error.message });
    }
  },

 // Rota DELETE /tickets/:id - Remove um ticket pelo ID
  deleteTicket: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);

      // Validação: Verifica se o ID é válido
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      // Chama o serviço para deletar o ticket
      const result = await glpiService.deleteTicket(id);

      // Supondo que o serviço retorne "null" ou "false" se o ticket não existir
      if (!result) {
        return res.status(404).json({ error: 'Ticket não encontrado.' });
      }

      res.json({ message: 'Ticket deletado com sucesso.' });
    } catch (error) {
      console.error('EErro na função deleteTicket:', error);
      res.status(500).json({ error: error.message });
    }
  }
};