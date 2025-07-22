// public/scripts/loginAdmin.js
// Controla el modal de login de administrador en la landing page

document.getElementById('adminLoginBtn').onclick = function() {
  document.getElementById('adminModal').style.display = 'flex';
  document.getElementById('adminPasswordInput').value = '';
  document.getElementById('adminLoginError').style.display = 'none';
  setTimeout(() => document.getElementById('adminPasswordInput').focus(), 200);
};

document.getElementById('closeModalBtn').onclick = function() {
  document.getElementById('adminModal').style.display = 'none';
};

document.getElementById('adminSubmitBtn').onclick = async function() {
  await doLogin();
};

document.getElementById('adminPasswordInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') doLogin();
});

async function doLogin() {
  const pass = document.getElementById('adminPasswordInput').value;
  if (!pass) return;
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: pass })
  });
  if (res.ok) {
    window.location.href = '/admin.html';
  } else {
    document.getElementById('adminLoginError').textContent = "Contraseña incorrecta";
    document.getElementById('adminLoginError').style.display = 'block';
  }
}

// Cierra el modal si se hace clic fuera de él
window.onclick = function(event) {
  const modal = document.getElementById('adminModal');
  if (event.target === modal) modal.style.display = 'none';
};

