const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  matricula: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String },
  prestamosActivos: { type: Number, default: 0 },
  multasPendientes: { type: Number, default: 0 },
  estado: { type: String, enum: ['activo', 'bloqueado'], default: 'activo' },
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
