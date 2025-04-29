// server.js

// 1. Importaciones
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 2. Inicializar aplicación
const app = express();

// 3. Middlewares
app.use(cors());
app.use(express.json());

// 4. Importar rutas
const libroRoutes = require('./routes/libros.routes');
const usuarioRoutes = require('./routes/usuarios.routes');
const prestamoRoutes = require('./routes/prestamos.routes');
const multaRoutes = require('./routes/multas.routes');
const loginRoutes = require('./routes/loginRoutes');

// 5. Usar rutas
app.use('/api/libros', libroRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/prestamos', prestamoRoutes);
app.use('/api/multas', multaRoutes);
app.use('/api', loginRoutes);

// 6. Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado correctamente a MongoDB Atlas'))
.catch((error) => console.error('❌ Error de conexión a MongoDB:', error));

// 7. Levantar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
