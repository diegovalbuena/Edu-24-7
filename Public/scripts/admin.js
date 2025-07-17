function login() {
  const password = document.getElementById("admin-password").value;
  const errorMsg = document.getElementById("error-msg");

  if (password === "admin123") {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    loadFileList();
  } else {
    errorMsg.textContent = "Clave incorrecta. Intenta de nuevo.";
  }
}

// 🚀 Subir archivo a Firebase
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("fileInput");
  const formData = new FormData();
  formData.append("file", fileInput.files[0]); // 🔥 importante que el campo sea "file"

  const res = await fetch("/api/files/upload", {
    method: "POST",
    body: formData
  });

  if (res.ok) {
    alert("Archivo subido correctamente");
    fileInput.value = "";
    loadFileList();
  } else {
    alert("Error al subir archivo");
  }
});

// 📄 Cargar lista de archivos desde Firebase
async function loadFileList() {
  const res = await fetch("/api/files");
  const files = await res.json();

  const list = document.getElementById("fileList");
  list.innerHTML = "";

  files.forEach(file => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${file.name}
      <button onclick="downloadFile('${file.url}')">Descargar</button>
      <button onclick="deleteFile('${file.name}')">Eliminar</button>
    `;
    list.appendChild(li);
  });
}

// ⬇️ Descargar archivo desde Firebase
function downloadFile(url) {
  window.open(url, "_blank");
}

// ❌ Eliminar archivo en Firebase
async function deleteFile(filename) {
  if (!confirm(`¿Eliminar el archivo "${filename}"?`)) return;

  const res = await fetch(`/api/files/${filename}`, {
    method: "DELETE"
  });

  if (res.ok) {
    alert("Archivo eliminado");
    loadFileList();
  } else {
    alert("Error al eliminar archivo");
  }
}
