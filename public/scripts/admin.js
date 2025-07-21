async function fetchFiles() {
  try {
    const res = await fetch('/api/files');
    const files = await res.json();

    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    if (!Array.isArray(files)) {
      console.error("Respuesta inesperada:", files);
      return;
    }

    files.forEach(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      let icon = 'fa-file';
      if (['pdf'].includes(ext)) icon = 'fa-file-pdf';
      else if (['doc', 'docx'].includes(ext)) icon = 'fa-file-word';
      else if (['xls', 'xlsx'].includes(ext)) icon = 'fa-file-excel';
      else if (['jpg', 'jpeg', 'png'].includes(ext)) icon = 'fa-file-image';
      else if (['mp4', 'avi'].includes(ext)) icon = 'fa-file-video';
      else if (['mp3', 'wav'].includes(ext)) icon = 'fa-file-audio';
      else if (['zip', 'rar'].includes(ext)) icon = 'fa-file-archive';
      else if (['txt'].includes(ext)) icon = 'fa-file-lines';

      const fileCard = document.createElement('div');
      fileCard.className = 'file-card';
      fileCard.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="file-name">${file.name}</div>
        <div class="file-actions">
          <a href="${file.url}" download title="Descargar">
            <button><i class="fas fa-download"></i></button>
          </a>
          <button onclick="renameItem('${file.name}')" title="Renombrar">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="moveFilePrompt('${file.name}')" title="Mover">
            <i class="fas fa-folder-open"></i>
          </button>
          <button onclick="deleteFile('${file.name}')" title="Eliminar">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
      fileList.appendChild(fileCard);
    });
  } catch (err) {
    console.error('Error cargando archivos:', err);
  }
}

async function deleteFile(filename) {
  if (!confirm(`¿Eliminar archivo "${filename}"?`)) return;
  try {
    const res = await fetch(`/api/files/${filename}`, { method: 'DELETE' });
    const result = await res.json();
    alert(result.message || 'Archivo eliminado');
    fetchFiles();
  } catch (err) {
    alert('Error al eliminar');
    console.error(err);
  }
}

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById('fileInput');
  if (!fileInput.files.length) return alert('Selecciona un archivo');

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const res = await fetch('/api/files/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await res.json();
    alert(result.message || 'Archivo subido');
    fileInput.value = '';
    fetchFiles();
  } catch (err) {
    alert('Error al subir archivo');
    console.error(err);
  }
});

// Crear carpeta
async function createFolder() {
  const name = prompt("Nombre de la nueva carpeta:");
  if (!name) return;
  try {
    const res = await fetch('/api/folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const result = await res.json();
    alert(result.message);
    fetchFiles();
  } catch (err) {
    alert("Error al crear carpeta");
    console.error(err);
  }
}

// Eliminar carpeta
async function deleteFolder() {
  const name = prompt("Nombre de la carpeta a eliminar:");
  if (!name) return;
  if (!confirm(`¿Eliminar la carpeta "${name}" y todo su contenido?`)) return;
  try {
    const res = await fetch(`/api/folder/${name}`, { method: 'DELETE' });
    const result = await res.json();
    alert(result.message);
    fetchFiles();
  } catch (err) {
    alert("Error al eliminar carpeta");
    console.error(err);
  }
}

// Renombrar archivo o carpeta
async function renameItem(oldName) {
  const newName = prompt(`Nuevo nombre para "${oldName}":`);
  if (!newName || newName === oldName) return;
  try {
    const res = await fetch('/api/rename', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldName, newName }),
    });
    const result = await res.json();
    alert(result.message);
    fetchFiles();
  } catch (err) {
    alert("Error al renombrar");
    console.error(err);
  }
}

// Mover archivo
async function moveFilePrompt(fileName) {
  const newFolder = prompt(`¿A qué carpeta mover "${fileName}"?`);
  if (!newFolder) return;
  try {
    const res = await fetch('/api/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, newFolder }),
    });
    const result = await res.json();
    alert(result.message);
    fetchFiles();
  } catch (err) {
    alert("Error al mover archivo");
    console.error(err);
  }
}

// Cargar archivos al iniciar
fetchFiles();


