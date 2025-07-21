const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const router = express.Router();


// Inicializar Firebase Admin SDK con credenciales del servicio

const serviceAccount = require('../firebase-config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://contenido-offline.firebasestorage.app'
});

//storageBucket: 'contenido-offline.appspot.com'

// Obtener el bucket de almacenamiento
const bucket = admin.storage().bucket();

// Configurar Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Subida de archivos
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.error('No se recibió archivo en la solicitud');
      return res.status(400).json({ error: 'No se recibió archivo' });
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });

    blobStream.on('error', (err) => {
      console.error('Error en blobStream:', err); // 🐞
      res.status(500).json({ error: err.message });
    });

    blobStream.on('finish', () => {
      console.log('Archivo subido con éxito:', req.file.originalname); // ✅
      res.status(200).json({ message: 'Archivo subido con éxito' });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error('Error general al subir archivo:', error); // 🐞
    res.status(500).json({ error: error.message });
  }
});

// Eliminar archivos
router.delete('/:filename', async (req, res) => {
  const filename = req.params.filename;
  try {
    await bucket.file(filename).delete();
    console.log('Archivo eliminado:', filename); // ✅
    res.status(200).json({ message: 'Archivo eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar archivo:', error); // 🐞
    res.status(500).json({ error: 'No se pudo eliminar el archivo' });
  }
});

// Listar archivos
router.get('/', async (req, res) => {
  try {
    const [files] = await bucket.getFiles();
    const publicFiles = files.map(file => ({
      name: file.name,
      url: `https://storage.googleapis.com/${bucket.name}/${file.name}`
    }));
    console.log('Archivos listados correctamente'); // ✅
    res.status(200).json(publicFiles);
  } catch (error) {
    console.error('Error al listar archivos:', error); // 🐞
    res.status(500).json({ error: 'No se pudieron listar los archivos' });
  }
});

module.exports = router;
