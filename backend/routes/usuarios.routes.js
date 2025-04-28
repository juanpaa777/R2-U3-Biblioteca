const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Obtener todos los usuarios
router.get('/', usuarioController.getUsuarios);

// Crear un nuevo usuario
router.post('/', usuarioController.createUsuario);

// Buscar usuarios con préstamos activos
router.get('/prestamos', usuarioController.getUsuariosConPrestamos);

// 👉 Nueva ruta para actualizar usuario
router.put('/:id', usuarioController.updateUsuario);

// 👉 Nueva ruta para eliminar usuario
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;
