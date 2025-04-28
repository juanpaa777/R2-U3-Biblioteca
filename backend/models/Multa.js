const mongoose = require('mongoose');

const multaSchema = new mongoose.Schema({
  prestamoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestamo', required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  monto: { type: Number, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  pagada: { type: Boolean, default: false },
  fechaPago: { type: Date, default: null }
});

module.exports = mongoose.model('Multa', multaSchema);
