
const express = require('express');
const multer = require('multer');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const router = express.Router();

const serviceAccount = require('../firebase-config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'contenido-offline.appspot.com'
});

const bucket = admin.storage().bucket();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se recibió archivo' });

    const uploadPath = req.body.path || '';
    const dest = path.posix.join(uploadPath, req.file.originalname);

    const blob = bucket.file(dest);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: { firebaseStorageDownloadTokens: uuidv4() }
      }
    });

    blobStream.on('error', (err) => res.status(500).json({ error: err.message }));
    blobStream.on('finish', () => res.status(200).json({ message: 'Archivo subido con éxito' }));
    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:filename', async (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  try {
    await bucket.file(filename).delete();
    res.status(200).json({ message: 'Archivo eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo eliminar el archivo' });
  }
});

router.get('/', async (req, res) => {
  const prefix = req.query.prefix || '';
  try {
    const [files] = await bucket.getFiles({ prefix });
    const unique = new Set();
    const output = [];

    files.forEach(file => {
      const relative = file.name.slice(prefix.length);
      if (!relative) return;

      const folderMatch = relative.match(/^([^/]+)\//);
      if (folderMatch) {
        const folderName = prefix + folderMatch[1] + '/';
        if (!unique.has(folderName)) {
          unique.add(folderName);
          output.push({ name: folderName });
        }
      } else {
        output.push({
          name: file.name,
          url: `https://storage.googleapis.com/${bucket.name}/${file.name}`
        });
      }
    });

    res.status(200).json(output);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron listar los archivos' });
  }
});

router.post('/folder', async (req, res) => {
  const folderName = req.body.name;
  if (!folderName) return res.status(400).json({ message: 'Nombre de carpeta requerido' });
  try {
    const file = bucket.file(`${folderName}/.init`);
    await file.save('');
    res.status(200).json({ message: 'Carpeta creada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear carpeta' });
  }
});

router.delete('/folder/:name', async (req, res) => {
  const folderName = decodeURIComponent(req.params.name);
  try {
    const [files] = await bucket.getFiles({ prefix: folderName + '/' });
    await Promise.all(files.map(file => file.delete()));
    res.status(200).json({ message: 'Carpeta eliminada' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar carpeta' });
  }
});

router.post('/rename', async (req, res) => {
  const { oldName, newName } = req.body;
  if (!oldName || !newName) return res.status(400).json({ message: 'Nombres requeridos' });
  try {
    const oldFile = bucket.file(oldName);
    await oldFile.copy(bucket.file(newName));
    await oldFile.delete();
    res.status(200).json({ message: 'Renombrado con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error al renombrar' });
  }
});

router.post('/move', async (req, res) => {
  const { fileName, newFolder } = req.body;
  if (!fileName || !newFolder) return res.status(400).json({ message: 'Datos faltantes' });
  try {
    const baseName = path.basename(fileName);
    const newFileName = path.posix.join(newFolder, baseName);
    const oldFile = bucket.file(fileName);
    await oldFile.copy(bucket.file(newFileName));
    await oldFile.delete();
    res.status(200).json({ message: 'Archivo movido' });
  } catch (err) {
    res.status(500).json({ message: 'Error al mover archivo' });
  }
});

module.exports = router;
