const mongoose = require('mongoose');


const prestamoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  libroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro', required: true },
  fechaPrestamo: { type: Date, default: Date.now },
  fechaVencimiento: { type: Date, required: true },
  fechaDevolucion: { type: Date, default: null },
  diasRetraso: { type: Number, default: null },
  estado: { type: String, enum: ['vigente', 'devuelto', 'retrasado'], default: 'vigente' },
  multa: { type: Number, default: 0 },
  condicion: { type: String, enum: ['Bueno', 'Dañado', 'No devuelto'], default: 'Bueno' }

});

module.exports = mongoose.model('Prestamo', prestamoSchema);