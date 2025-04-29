const express = require('express');
const router = express.Router();
const multasController = require('../controllers/multas.controller');

// Rutas para multas
router.get('/', multasController.obtenerMultas);
router.post('/', multasController.crearMulta);
router.put('/:id/pagar', multasController.pagarMulta);

module.exports = router;
