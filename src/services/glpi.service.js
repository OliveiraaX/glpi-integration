const axios = require('axios');

require('dotenv').config();

const api = axios.create({
  baseURL: `${process.env.GLPI_API_URL}/apirest.php`,
  headers: {
    'App-Token': process.env.GLPI_APP_TOKEN
  }
});

let sessionToken = null;

async function initSession() {
  const response = await api.get('/initSession', {
    headers: { Authorization: `user_token ${process.env.GLPI_USER_TOKEN}` }
  });
  sessionToken = response.data.session_token;
}

async function killSession() {
  if (sessionToken) {
    await api.get('/killSession', {
      headers: { 'Session-Token': sessionToken }
    });
    sessionToken = null;
  }
}

async function getTicketById(id) {
  await initSession();
  try {
    const response = await api.get(`/Ticket/${id}`, {
      headers: { 'Session-Token': sessionToken }
    });
    return response.data;
  } finally {
    await killSession();
  }
}

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

async function getTickets() {
  await initSession();
  try {
    const response = await api.get('/Ticket', {
      headers: { 'Session-Token': sessionToken }
    });
    return response.data;
  } finally {
    await killSession();
  }
}

module.exports = {
  getTicketById,
  getTickets, 
  createTicket,
  updateTicketStatus,
  deleteTicket,
  killSession,
  initSession
};