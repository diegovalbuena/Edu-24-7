const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const router = express.Router();

// Configurar Firebase
let serviceAccount;

if (process.env.FIREBASE_CONFIG) {
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
} else {
  serviceAccount = require('../firebase-config.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'contenido-offline.appspot.com'
});


const bucket = admin.storage().bucket();

// Configurar Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Subida de archivos
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });

    blobStream.end(req.file.buffer);

    blobStream.on('finish', () => {
      res.status(200).json({ message: 'Archivo subido con éxito' });
    });

    blobStream.on('error', (err) => {
      res.status(500).json({ error: err.message });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar archivos
router.delete('/:filename', async (req, res) => {
  const filename = req.params.filename;
  try {
    await bucket.file(filename).delete();
    res.status(200).json({ message: 'Archivo eliminado con éxito' });
  } catch (error) {
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
    res.status(200).json(publicFiles);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron listar los archivos' });
  }
});

module.exports = router;
