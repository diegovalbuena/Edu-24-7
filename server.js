const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;


// Leer .env si existe
require('dotenv').config();

console.log("Iniciando backend...");

// Mostrar archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
const filesRouter = require('./routes/files');
app.use('/api/files', filesRouter);


// Página principal
//app.get('/', (req, res) => {
//  res.sendFile(path.join(__dirname, 'public', 'index.html'));
//});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
