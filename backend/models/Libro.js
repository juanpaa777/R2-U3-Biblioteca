const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  categoria: { type: String },
  tipo: { type: String, enum: ['Libro', 'Revista'], required: true },
  ejemplaresTotal: { type: Number, required: true },
  ejemplaresDisponibles: { type: Number, required: true },
  fechaPublicacion: { type: Date },
  editorial: { type: String },
  ubicacion: { type: String },
  estado: { type: String, enum: ['Disponible', 'No disponible'], default: 'Disponible' },
  imagenPortada: { type: String }
});

module.exports = mongoose.model('Libro', libroSchema);
