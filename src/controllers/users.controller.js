// Controlador de usuários - Lida com requisições relacionadas a usuários GLPI
const glpiService = require('../services/glpi.service');

// GET /users - Lista todos os usuários
async function getAllUsersController(req, res) {
  try {
    const users = await glpiService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Erro na função getAllUsersController:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
}

// GET /users/:id - Retorna um usuário específico pelo ID
async function getUserByIdController(req, res) {
  const id = req.params.id;

  try {
    const user = await glpiService.getUserById(id);
    res.json(user);
  } catch (error) {
    console.error('Erro na função getUserByIdController :', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}

module.exports = {
  getAllUsersController,
  getUserByIdController
};
