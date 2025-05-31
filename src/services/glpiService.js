// Importa o Axios para realizar requisições HTTP
const axios = require('axios');

// Carregar variáveis.
require('dotenv').config(); 

// Instância do Axios configurada com base na URL da API
const api = axios.create({
  baseURL: `${process.env.GLPI_API_URL}/apirest.php`,
  headers: {
    'App-Token': process.env.GLPI_APP_TOKEN
  }
});

let sessionToken = null;  // Armazena o token da sessão atual

// Inicializa uma sessão na API do GLPI
async function initSession() {
  const response = await api.get('/initSession', {
    headers: {
      'Authorization': `user_token ${process.env.GLPI_USER_TOKEN}`
    }
  });
  sessionToken = response.data.session_token;
}

//  Finaliza a sessão no GLPI
async function killSession() {
  if (!sessionToken) return; //Se não houver sessão, não faz nada
  await api.get('/killSession', {
    headers: { 'Session-Token': sessionToken }
  });
  sessionToken = null;
}

//Função para obter todos os tickets
async function getTickets() {
  await initSession();
  const response = await api.get('/Ticket', {
    headers: { 'Session-Token': sessionToken }
  });
  await killSession();
  return response.data;
}

// Função para criar um novo ticket
async function createTicket(ticketData) {
  await initSession();
  const response = await api.post('/Ticket', ticketData, {
    headers: { 'Session-Token': sessionToken }
  });
  await killSession();
  return response.data;
}

// Exporta as funções para uso externo
module.exports = {
  getTickets,
  createTicket
};

