const Multa = require('../models/Multa');
const Usuario = require('../models/Usuario');

// Obtener todas las multas
exports.obtenerMultas = async (req, res) => {
  try {
    const multas = await Multa.find()
      .populate('usuarioId', 'nombre apellido')
      .populate({
        path: 'prestamoId',
        populate: { path: 'libroId', select: 'titulo' }
      });
    res.json(multas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener multas', error: error.message });
  }
};

// Crear nueva multa
exports.crearMulta = async (req, res) => {
  try {
    const nuevaMulta = new Multa(req.body);
    await nuevaMulta.save();
    res.status(201).json(nuevaMulta);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la multa', error: error.message });
  }
};

// Pagar una multa
exports.pagarMulta = async (req, res) => {
  try {
    const multaId = req.params.id;
    const multa = await Multa.findById(multaId);

    if (!multa) return res.status(404).json({ message: 'Multa no encontrada' });
    if (multa.pagada) return res.status(400).json({ message: 'La multa ya fue pagada' });

    multa.pagada = true;
    multa.fechaPago = new Date();
    await multa.save();

    const usuario = await Usuario.findById(multa.usuarioId);
    if (usuario) {
      usuario.multasPendientes -= multa.monto;
      if (usuario.multasPendientes < 0) usuario.multasPendientes = 0;
      await usuario.save();
    }

    res.json({ message: 'Multa pagada exitosamente', multa });
  } catch (error) {
    res.status(500).json({ message: 'Error al pagar multa', error: error.message });
  }
};
