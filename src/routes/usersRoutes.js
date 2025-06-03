// Rotas de usuários - Define as rotas HTTP relacionadas a usuários do GLPI
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// GET /api/users - Lista todos os usuários
router.get('/user', usersController.getAllUsersController);

// GET /api/users/:id - Retorna um usuário específico por ID
router.get('/user/:id', usersController.getUserByIdController);

module.exports = router;
