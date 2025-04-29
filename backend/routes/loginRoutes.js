const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Ruta POST para login
router.post('/login', loginController.login);

// ✅ Ruta POST para crear administrador
router.post('/crear-admin', loginController.crearAdmin);

module.exports = router;
