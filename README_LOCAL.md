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

## 💾 Almacenamiento Permanente con IndexedDB

### ✨ Nueva Implementación: Persistencia Automática

Los videos ahora se guardan **permanentemente** usando **IndexedDB**:

#### LocalStorage (Metadatos)
- **Usuarios**: `porteria_users` - Credenciales de admin
- **Sesión**: `porteria_current_user` - Usuario actual

#### IndexedDB (Videos Permanentes)
- **Base de datos**: `PorteriaDB`
- **Store de videos**: Metadatos (título, fecha, tamaño)
- **Store de archivos**: Videos completos en binario (Blob)

### ✅ Ventajas del Nuevo Sistema

- ✅ **Permanente**: Los videos NO se pierden al recargar
- ✅ **Automático**: Gestión automática de archivos, sin copias manuales
- ✅ **Gran capacidad**: Hasta 250MB-1GB dependiendo del navegador
- ✅ **Sin servidor**: Todo funciona localmente en tu navegador
- ✅ **Rápido**: Acceso instantáneo a los videos

### 📊 Capacidad de Almacenamiento

| Navegador | Capacidad Típica |
|-----------|------------------|
| Chrome    | ~250MB - 1GB     |
| Firefox   | ~250MB - 1GB     |
| Safari    | ~50MB - 200MB    |
| Edge      | ~250MB - 1GB     |

**Límite por video**: 150MB (configurable)

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

## 🎯 Gestión de Almacenamiento

### Verificar Espacio Usado

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Ver cuántos videos tienes
navigator.storage.estimate().then(estimate => {
    console.log(`Usado: ${(estimate.usage / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Disponible: ${(estimate.quota / 1024 / 1024).toFixed(2)} MB`);
});
```

### Liberar Espacio

Si alcanzas el límite de almacenamiento:
1. Ve al panel **Admin**
2. Elimina videos que no necesites
3. El espacio se libera automáticamente

## 🚀 Deploy Local

Esta versión puede funcionar:
- ✅ Como archivo HTML local
- ✅ En GitHub Pages (con limitaciones)
- ✅ En cualquier hosting estático
- ✅ En servidores locales

---

**¡Disfruta tu video player local!** 🎬
