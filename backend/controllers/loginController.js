const Administrador = require('../models/Administrador');
const bcrypt = require('bcryptjs'); // <- asegúrate que está importado

exports.login = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const admin = await Administrador.findOne({ usuario });

    if (!admin) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const passwordValido = await admin.compararPassword(password);

    if (!passwordValido) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso', adminId: admin._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// ✅ Función para crear administrador
exports.crearAdmin = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoAdmin = new Administrador({
      usuario,
      password: hashedPassword
    });

    await nuevoAdmin.save();

    res.status(201).json({ message: 'Administrador creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear administrador' });
  }
};
