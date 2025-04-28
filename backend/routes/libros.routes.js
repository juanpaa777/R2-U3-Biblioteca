const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');

// Obtener todos los libros
router.get('/', libroController.getLibros);

// Crear un nuevo libro
router.post('/', libroController.createLibro);

// Obtener libros disponibles para préstamo
router.get('/disponibles', libroController.getLibrosDisponibles);

module.exports = router;
