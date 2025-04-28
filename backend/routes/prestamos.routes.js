const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');

// Registrar un nuevo préstamo
router.post('/', prestamoController.createPrestamo);

// Registrar la devolución de un préstamo
router.put('/devolver/:prestamoId', prestamoController.devolverPrestamo);

// 👉 Nueva ruta para listar préstamos vigentes
router.get('/activos', prestamoController.getPrestamosActivos);

module.exports = router;
