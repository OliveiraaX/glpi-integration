const axios = require('axios');
require('dotenv').config();

const api = axios.create({
  baseURL: `${process.env.GLPI_API_URL}/apirest.php`,
  headers: {
    'App-Token': process.env.GLPI_APP_TOKEN
  }
});

let sessionToken = null;

// Verifica e garante que há uma sessão válida
async function ensureSession() {
  if (!sessionToken) {
    const response = await api.get('/initSession', {
      headers: { Authorization: `user_token ${process.env.GLPI_USER_TOKEN}` }
    });
    sessionToken = response.data.session_token;
  }
}

// Encerra a sessão (pode ser chamado manualmente, mas não mais obrigatório em cada função)
async function killSession() {
  if (sessionToken) {
    await api.get('/killSession', {
      headers: { 'Session-Token': sessionToken }
    });
    sessionToken = null;
  }
}

// GET /Ticket/:id - Retorna dados completos do ticket com o agente
async function getTicketById(id) {
  // Garante que a sessão esteja ativa antes de continuar
  await ensureSession();

  try {
    // Faz uma requisição para obter os dados do ticket pelo ID
    const ticketRes = await api.get(`/Ticket/${id}`, {
      headers: { 'Session-Token': sessionToken } 
    });

    // Obtém o objeto ticket da resposta
    const ticket = ticketRes.data;

    // Inicializa o campo agent como null (ainda não atribuído)
    ticket.agent = null;

    // Busca os usuários relacionados ao ticket (usuários vinculados ao ticket)
    const usersRes = await api.get(`/Ticket/${id}/Ticket_User`, {
      headers: { 'Session-Token': sessionToken }
    });

    // Encontra o usuário responsável pelo ticket (tipo 2 representa o responsável/agente)
    const responsible = usersRes.data.find(u => u.type === 2);

    if (responsible) {
      // Se encontrar o responsável, busca os detalhes desse usuário pelo ID
      const userRes = await api.get(`/User/${responsible.users_id}`, {
        headers: { 'Session-Token': sessionToken }
      });

      // Atribui o nome do agente responsável ao campo agent do ticket
      ticket.agent = userRes.data.name;
    }

    // Retorna o ticket com os dados, incluindo o agente (se encontrado)
    return ticket;

  } catch (err) {
    // Em caso de erro, exibe uma mensagem no console e relança o erro para tratamento externo
    console.error('Erro ao buscar ticket:', err.message);
    throw err;
  }
}


// POST /Ticket - Cria um novo ticket
async function createTicket(data) {
  await ensureSession();
  const response = await api.post('/Ticket', data, {
    headers: { 'Session-Token': sessionToken }
  });
  return response.data;
}

// PUT /Ticket/:id - Atualiza o status de um ticket
async function updateTicketStatus(ticketData) {
  await ensureSession();
  const response = await api.put('/Ticket/' + ticketData.input.id, ticketData, {
    headers: { 'Session-Token': sessionToken }
  });
  return response.data;
}

// DELETE /Ticket/:id - Remove um ticket
async function deleteTicket(id) {
  await ensureSession();
  const response = await api.delete(`/Ticket/${id}`, {
    headers: { 'Session-Token': sessionToken }
  });
  return response.data;
}

// GET /Ticket - Lista todos os tickets
async function getTickets() {
  await ensureSession();
  const response = await api.get('/Ticket', {
    headers: { 'Session-Token': sessionToken }
  });
  return response.data;
}

// GET /User - Lista todos os usuários
async function getAllUsers() {
  await ensureSession();
  const response = await api.get('/User', {
    headers: { 'Session-Token': sessionToken }
  });
  return response.data;
}

// GET /User/:id - Retorna um usuário pelo ID
async function getUserById(id) {
  await ensureSession();
  const response = await api.get(`/User/${id}`, {
    headers: { 'Session-Token': sessionToken }
  });
  return response.data;
}

module.exports = {
  getTicketById,
  getTickets,
  createTicket,
  updateTicketStatus,
  deleteTicket,
  getAllUsers,
  getUserById,
  ensureSession, 
  killSession   
};
