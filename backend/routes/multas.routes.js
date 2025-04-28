const express = require('express');
const router = express.Router();
const multaController = require('../controllers/multaController');

// Obtener todas las multas
router.get('/', multaController.getMultas);

// Crear nueva multa (opcional)
router.post('/', multaController.createMulta);

module.exports = router;
