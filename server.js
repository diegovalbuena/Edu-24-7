const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Leer .env si existe
require('dotenv').config();

console.log("Iniciando backend...");

// Variables de entorno de contraseña admin (puedes poner varias, separadas por coma)
const adminPasswords = (process.env.ADMIN_PASS || 'admin123').split(',').map(x => x.trim());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ruta de login
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (adminPasswords.includes(password)) {
    // Si quieres podrías generar un token de sesión aquí (por ahora solo validación simple)
    return res.status(200).json({ success: true });
  }
  res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
});

// Rutas API archivos
const filesRouter = require('./routes/files');
app.use('/api/files', filesRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
