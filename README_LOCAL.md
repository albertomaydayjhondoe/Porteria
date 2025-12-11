# 🎬 Porteria - Video Player Local

## Sistema Completamente Local sin Supabase

Esta versión funciona 100% en el navegador sin necesidad de backend.

## 📁 Estructura de Carpetas

```
Porteria/
├── index_local.html          # Aplicación principal local
├── public/
│   ├── uploads/              # Videos subidos (generados al subir)
│   └── strips/               # Videos estáticos existentes
└── README_LOCAL.md           # Esta documentación
```

## 🚀 Cómo Usar

### 1. Abrir la Aplicación
```bash
# Opción 1: Abrir directamente
open index_local.html

# Opción 2: Con servidor local
python -m http.server 8080
# Luego abre: http://localhost:8080/index_local.html

# Opción 3: Con Node
npx serve .
# Luego abre: http://localhost:3000/index_local.html
```

### 2. Navegación
- **Inicio**: Ver el video más reciente
- **Archivo**: Ver todos los videos en cuadrícula
- **Admin**: Subir y gestionar videos

### 3. Admin Panel
**Credenciales:**
- Email: `sampayo@gmail.com`
- Password: `administrador`

**Funcionalidades:**
- ✅ Subir videos (hasta 150MB)
- ✅ Listar todos los videos
- ✅ Eliminar videos
- ✅ Persistencia en localStorage

## 💾 Almacenamiento

### LocalStorage
Los datos se guardan en el navegador:
- **Videos**: `porteria_videos` - Lista de videos con URLs
- **Usuarios**: `porteria_users` - Credenciales de admin
- **Sesión**: `porteria_current_user` - Usuario actual

### Archivos
Los videos se guardan como **Object URLs** en el navegador:
- No requieren servidor
- Persisten durante la sesión
- Se pierden al recargar (son referencias temporales)

## ⚠️ Limitaciones

### Videos Temporales
Los videos subidos usan `URL.createObjectURL()`:
- ✅ Funcionan inmediatamente
- ✅ No requieren servidor
- ❌ Se pierden al recargar la página
- ❌ No se comparten entre dispositivos

### Solución para Persistencia
Para videos permanentes, copia manualmente a `public/strips/`:

```bash
# 1. Subir video desde el admin
# 2. Copiar el archivo físico a:
cp video.mp4 public/strips/video.mp4

# 3. El video estará disponible permanentemente
```

## 🔧 Características

### ✅ Funciona sin Backend
- No requiere Supabase
- No requiere base de datos
- No requiere servidor
- Todo en el navegador

### ✅ Admin Completo
- Login/logout
- Upload de videos
- Gestión de biblioteca
- Interfaz intuitiva

### ✅ Reproducción
- Player HTML5 nativo
- Controles completos
- Responsive design
- Galería de videos

## 🛠️ Desarrollo

### Agregar Videos Manualmente
```javascript
// En la consola del navegador:
const videos = JSON.parse(localStorage.getItem('porteria_videos') || '[]');
videos.push({
    id: 'video_' + Date.now(),
    title: 'Mi Video',
    date: '2025-12-11',
    videoUrl: './public/strips/mi-video.mp4'
});
localStorage.setItem('porteria_videos', JSON.stringify(videos));
location.reload();
```

### Limpiar Datos
```javascript
// Borrar todos los videos
localStorage.removeItem('porteria_videos');

// Borrar sesión
localStorage.removeItem('porteria_current_user');

// Borrar todo
localStorage.clear();
```

## 📝 Notas

1. **Tamaño Máximo**: 150MB por video (configurable)
2. **Formatos**: MP4, WebM, MOV, AVI
3. **Navegadores**: Chrome, Firefox, Safari, Edge modernos
4. **Almacenamiento**: LocalStorage (5-10MB) + Object URLs (ilimitado durante sesión)

## 🎯 Próximos Pasos

Para hacer los videos permanentes:
1. Usar IndexedDB en lugar de Object URLs
2. O implementar un servidor simple para almacenamiento
3. O usar servicios de almacenamiento externo (Dropbox, Google Drive)

## 🚀 Deploy Local

Esta versión puede funcionar:
- ✅ Como archivo HTML local
- ✅ En GitHub Pages (con limitaciones)
- ✅ En cualquier hosting estático
- ✅ En servidores locales

---

**¡Disfruta tu video player local!** 🎬
