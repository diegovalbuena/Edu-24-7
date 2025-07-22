# Edu 24/7 Web - Plataforma de Gestión de Contenidos Educativos

**Edu 24/7 Web** es una plataforma desarrollada para permitir a administradores cargar, organizar y gestionar contenidos educativos en la nube, usando Firebase Storage, de forma intuitiva y segura. Además, provee una app de escritorio asociada para sincronización offline.

---

## 🚀 Características principales

- **Panel de administración web** seguro (con acceso por contraseña).
- Subida y organización de archivos y carpetas educativas en la nube (Firebase Storage).
- Interfaz moderna, con soporte para:
  - Crear, renombrar, mover y eliminar archivos/carpetas.
  - Navegación tipo explorador, breadcrumbs y previsualización de iconos.
- Descarga directa de la app de escritorio para sincronización offline.
- Diseño visual atractivo y responsive.
- Basado en Node.js, Express, Firebase Admin SDK y frontend vanilla JS + CSS.

---

## 📂 Estructura del proyecto

project-root/
│
├── public/
│ ├── img/ # Imágenes y logos
│ ├── scripts/
│ │ ├── admin.js # Lógica panel admin
│ │ └── loginAdmin.js # Lógica de login y modal admin
│ ├── style.css # Estilos generales
│ ├── admin.html # Panel de administración
│ └── index.html # Landing page (usuarios y admin)
│
├── routes/
│ └── files.js # API REST archivos/carpetas (Express + Firebase)
│
├── server.js # Backend principal (Express)
├── firebase-config.json # Credenciales Firebase Admin SDK (NO subir público)
├── .env # Variables de entorno (ADMIN_PASS, etc.)
└── README.md # Este archivo


---

## 🔧 Instalación y ejecución local

1. **Clona este repositorio:**
    ```bash
    git clone https://github.com/diegovalbuena/Edu-24-7
    cd Edu 24-7
    ```

2. **Instala las dependencias:**
    ```bash
    npm install
    ```

3. **Agrega tu archivo `firebase-config.json`**  
   (descárgalo desde la consola de Firebase, sección credenciales Admin SDK) en la raíz del proyecto.

4. **Crea un archivo `.env`** con tu contraseña de administrador:
    ```
    ADMIN_PASS=admin123
    ```
    *(Puedes separar varias contraseñas por coma si deseas)*

5. **Inicia el servidor:**
    ```bash
    node server.js
    ```
    Accede en tu navegador a: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Despliegue en producción

- **Puedes desplegar en servicios Node.js como Render, Railway, Heroku, etc.**
- Asegúrate de configurar correctamente las variables de entorno y subir el `firebase-config.json` sólo de forma privada.
- Configura reglas de seguridad en Firebase Storage (acceso público sólo lectura y escritura restringida al backend/admin).

---

## 💡 Buenas prácticas y seguridad

- **NO subas nunca tu `firebase-config.json` a GitHub público.**
- Cambia periódicamente la contraseña de administrador.
- Ajusta reglas de Firebase Storage para evitar escrituras no autorizadas.
- Los administradores tienen permisos para eliminar y modificar todo el contenido.

---

## 👨‍💻 Contribuir

¿Quieres mejorar la plataforma, corregir errores o aportar ideas?  
Haz un fork, abre un issue o pull request.  
¡Toda contribución es bienvenida para democratizar el acceso educativo!

---

## 📞 Contacto

¿Preguntas o soporte?  
Escríbeme a divalbuenam@unal.edu.co o abre un issue en el repositorio.

---

**¡Edu 24/7: Educación sin límites, todo el tiempo!**
