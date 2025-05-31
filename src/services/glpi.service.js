// Importa a biblioteca Axios para fazer requisições HTTP
const axios = require('axios');

// chamar variavies de ambiente do .env  
require('dotenv').config();

// Cria uma instância do Axios
const api = axios.create({
  baseURL: `${process.env.GLPI_API_URL}/apirest.php`,
  headers: {
    'App-Token': process.env.GLPI_APP_TOKEN
  }
});

// Variável global para armazenar o token de sessão do GLPI
let sessionToken = null;

// Inicia uma nova sessão GLPI e armazena o token de sessão
async function initSession() {
  const response = await api.get('/initSession', {
    headers: { Authorization: `user_token ${process.env.GLPI_USER_TOKEN}` }
  });
  sessionToken = response.data.session_token;
}

// Encerra a sessão GLPI ativa, se houver
async function killSession() {
  if (sessionToken) {
    await api.get('/killSession', {
      headers: { 'Session-Token': sessionToken }
    });
    sessionToken = null;
  }
}

// Recupera os dados de um ticket específico pelo ID
async function getTicketById(id) {
  await initSession();
  try {
    const response = await api.get(`/Ticket/${id}`, {
      headers: { 'Session-Token': sessionToken }
    });
    return response.data;
  } finally {
    await killSession(); // Garante que a sessão seja encerrada, mesmo que ocorra erro
  }
}

// Cria um novo ticket com os dados fornecidos
async function createTicket(data) {
  await initSession();
  try {
    const response = await api.post('/Ticket', data, {
      headers: { 'Session-Token': sessionToken }
    });
    return response.data;
  } finally {
    await killSession();
  }
}

// Atualiza o status 
async function updateTicketStatus(ticketData) {
  await initSession();
  try {
    const response = await api.put('/Ticket/' + ticketData.input.id, ticketData, {
      headers: { 'Session-Token': sessionToken }
    });
    return response.data;
  } finally {
    await killSession();
  }
}

// Exclui um ticket pelo ID
async function deleteTicket(id) {
  await initSession();
  try {
    const response = await api.delete(`/Ticket/${id}`, {
      headers: { 'Session-Token': sessionToken }
    });
    return response.data;
  } finally {
    await killSession();
  }
}

// Recupera a lista de todos os tickets disponíveis
async function getTickets() {
  await initSession();
  try {
    const response = await api.get('/Ticket', {
      headers: { 'Session-Token': sessionToken }
    });
    return response.data;
  } catch(error) {
    console.error('Erro ao listar usuários:', error.response?.data || error.message);
    throw error;
  } finally {
    await killSession();
  }
}

// função para buscar todos os usuários
async function getAllUsers(){
  await initSession();
  try {
    const response = await api.get('/User', {
      headers: { 'Session-Token': sessionToken }
    });
    return response.data;
  } catch(error) {
    console.error('Erro ao listar usuários:', error.response?.data || error.message);
    throw error;
  } finally {
    await killSession();
  }
}

async function getUserById(id) {
  await initSession();
  try {
    const response = await api.get(`/User/${id}`, {
      headers: { 'Session-Token': sessionToken }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.response?.data || error.message);
    throw error;
  } finally {
    await killSession();
  }
}
// Exporta as funções para serem usadas em outros módulos
module.exports = {
  getTicketById,
  getTickets, 
  createTicket,
  updateTicketStatus,
  deleteTicket,
  killSession,
  initSession,
  getAllUsers,
  getUserById,

};
