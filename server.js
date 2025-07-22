// server.js
// Backend principal para Edu 24/7 Web Admin. Controla rutas API y autenticación admin.

const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Leer variables de entorno desde .env si existe
require('dotenv').config();

console.log("Iniciando backend...");

// Configuración de contraseñas de administrador (puedes poner varias, separadas por coma en ADMIN_PASS)
const adminPasswords = (process.env.ADMIN_PASS || 'admin123').split(',').map(x => x.trim());

// Middleware: servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Endpoint de login admin
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (adminPasswords.includes(password)) {
    return res.status(200).json({ success: true });
  }
  res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
});

// Montar rutas de archivos (API REST para archivos y carpetas)
const filesRouter = require('./routes/files');
app.use('/api/files', filesRouter);

// Iniciar servidor web
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
