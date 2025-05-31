const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

// Rota para listar todos os usuários
router.get('/user', usersController.getUsersByIdController);
// Listar um unico usuário
router.get('/User/:id', usersController.getUserByIdController);

module.exports = router;
