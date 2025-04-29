const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Para encriptar y comparar contraseñas

const administradorSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Método para comparar contraseñas
administradorSchema.methods.compararPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Administrador', administradorSchema);
