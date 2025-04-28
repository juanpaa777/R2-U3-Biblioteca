const Prestamo = require('../models/Prestamo');
const Usuario = require('../models/Usuario');
const Libro = require('../models/Libro');

// Registrar un nuevo préstamo
exports.createPrestamo = async (req, res) => {
  try {
    const { matricula, isbn } = req.body;

    const usuario = await Usuario.findOne({ matricula });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (usuario.multasPendientes > 0) return res.status(400).json({ message: 'Usuario con multas pendientes' });

    if (usuario.prestamosActivos >= 2) return res.status(400).json({ message: 'Límite de préstamos alcanzado (2)' });

    const libro = await Libro.findOne({ isbn });
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });

    if (libro.tipo !== 'Libro') return res.status(400).json({ message: 'No se permiten préstamos de revistas' });

    if (libro.ejemplaresDisponibles <= 0) return res.status(400).json({ message: 'No hay ejemplares disponibles' });

    const fechaPrestamo = new Date();
    const fechaVencimiento = new Date(fechaPrestamo);
    fechaVencimiento.setDate(fechaPrestamo.getDate() + 2);

    const prestamo = new Prestamo({
      usuarioId: usuario._id,
      libroId: libro._id,
      fechaPrestamo,
      fechaVencimiento,
      estado: 'vigente'
    });

    await prestamo.save();

    usuario.prestamosActivos += 1;
    await usuario.save();

    libro.ejemplaresDisponibles -= 1;
    await libro.save();

    res.status(201).json({ message: 'Préstamo registrado exitosamente', prestamo });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Registrar devolución de préstamo
exports.devolverPrestamo = async (req, res) => {
  try {
    const { prestamoId } = req.params;
    const { condicion } = req.body;

    const prestamo = await Prestamo.findById(prestamoId).populate('usuarioId').populate('libroId');
    if (!prestamo) return res.status(404).json({ message: 'Préstamo no encontrado' });

    if (prestamo.estado !== 'vigente') return res.status(400).json({ message: 'Este préstamo ya fue devuelto' });

    const fechaActual = new Date();
    const diasRetraso = Math.ceil((fechaActual - prestamo.fechaVencimiento) / (1000 * 60 * 60 * 24));

    prestamo.fechaDevolucion = fechaActual;
    prestamo.estado = diasRetraso > 0 ? 'retrasado' : 'devuelto';
    prestamo.diasRetraso = diasRetraso > 0 ? diasRetraso : 0;
    prestamo.multa = diasRetraso > 0 ? diasRetraso * 50 : 0;
    prestamo.condicion = condicion || 'Bueno'; 
    await prestamo.save();

    // Actualizar usuario
    const usuario = await Usuario.findById(prestamo.usuarioId._id);
    usuario.prestamosActivos -= 1;
    if (diasRetraso > 0) usuario.multasPendientes += prestamo.multa;
    await usuario.save();

    // Actualizar libro
    const libro = await Libro.findById(prestamo.libroId._id);
    libro.ejemplaresDisponibles += 1;
    await libro.save();

    res.json({ message: 'Devolución registrada exitosamente', prestamo });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  
};

// Obtener préstamos vigentes
exports.getPrestamosActivos = async (req, res) => {
  try {
    const prestamos = await Prestamo.find({ estado: 'vigente' })
      .populate('usuarioId')
      .populate('libroId');
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};