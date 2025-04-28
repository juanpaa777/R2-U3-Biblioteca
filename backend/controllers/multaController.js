const Multa = require('../models/Multa');

// Obtener todas las multas
exports.getMultas = async (req, res) => {
  try {
    const multas = await Multa.find().populate('usuarioId').populate('prestamoId');
    res.json(multas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear nueva multa (opcional si quieres registrar manualmente)
exports.createMulta = async (req, res) => {
  try {
    const multa = new Multa(req.body);
    const savedMulta = await multa.save();
    res.status(201).json(savedMulta);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
