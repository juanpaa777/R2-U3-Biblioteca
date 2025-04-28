const Libro = require('../models/Libro');

// Obtener todos los libros
exports.getLibros = async (req, res) => {
  try {
    const libros = await Libro.find();
    res.json(libros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo libro
exports.createLibro = async (req, res) => {
  try {
    const libro = new Libro(req.body);
    const savedLibro = await libro.save();
    res.status(201).json(savedLibro);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Buscar libros disponibles para préstamo
exports.getLibrosDisponibles = async (req, res) => {
  try {
    const disponibles = await Libro.find({ tipo: 'Libro', ejemplaresDisponibles: { $gt: 0 } });
    res.json(disponibles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
