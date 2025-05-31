const glpiService = require('../services/glpi.service');

// Listar usuários
async function getUsersByIdController(req, res) {
  try {
    const users = await glpiService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
}

// Listar usuário por ID
async function getUserByIdController(req, res) {
  const id = req.params.id;
  try {
    const user = await glpiService.getUserById(id);
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}

module.exports = { getUsersByIdController, getUserByIdController };
