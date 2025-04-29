const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');

router.post('/', prestamoController.createPrestamo);
router.put('/devolver/:prestamoId', prestamoController.devolverPrestamo);


router.get('/activos', prestamoController.getPrestamosActivos);
router.get('/', prestamoController.getAllPrestamos);

module.exports = router;
