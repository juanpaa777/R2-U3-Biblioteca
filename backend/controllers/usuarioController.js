const Usuario = require('../models/Usuario');

// Obtener todos los usuarios
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    const savedUsuario = await usuario.save();
    res.status(201).json(savedUsuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Buscar usuarios con préstamos activos
exports.getUsuariosConPrestamos = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ prestamosActivos: { $gt: 0 } });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Actualizar un usuario
exports.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUsuario = await Usuario.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUsuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(updatedUsuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un usuario
exports.deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUsuario = await Usuario.findByIdAndDelete(id);
    if (!deletedUsuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
