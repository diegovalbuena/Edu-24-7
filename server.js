console.log("Iniciando backend...");

const express = require('express');
const app = express();

app.use(express.static('public'));
const PORT = 3000;

const filesRouter = require('./routes/files');
app.use('/api/files', filesRouter);

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente.');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
