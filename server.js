require('dotenv').config();

console.log("Iniciando backend...");

const express = require('express');
const app = express();

app.use(express.static('public'));
const PORT = 3000;

const filesRouter = require('./routes/files');
app.use('/api/files', filesRouter);

const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
