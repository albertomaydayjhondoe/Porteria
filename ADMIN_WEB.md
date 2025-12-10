# 🌐 Admin Web - Upload de Videos y Gestión de Tiras

## 🎯 ¿Qué es esto?

Un panel de administración **web** para subir tiras cómicas (imágenes, videos, audio) directamente desde tu navegador. Los archivos se suben automáticamente a GitHub y la página se actualiza sola.

## 🔗 Acceso

**URL del Admin**: `https://albertomaydayjhondoe.github.io/Porteria/admin`

## 🔐 Autenticación

El admin usa un **Personal Access Token (PAT)** de GitHub para autenticarte.

### Crear tu token:

1. Ve a: https://github.com/settings/tokens
2. Click en **"Generate new token"** → **"Generate new token (classic)"**
3. Dale un nombre: `Porteria Admin`
4. Selecciona scope: ✅ **`repo`** (todos los permisos de repositorio)
5. Click en **"Generate token"**
6. **COPIA EL TOKEN** (empieza con `ghp_` o `github_pat_`)
7. ⚠️ **Guárdalo en un lugar seguro** - no podrás verlo de nuevo

### Iniciar sesión:

1. Ve a `/admin`
2. Pega tu token en el campo "GitHub Token"
3. Click en "Iniciar Sesión"

El token se guarda en tu sesión del navegador (no en el servidor).

## 📤 Subir una Tira

### Paso 1: Ir a la pestaña "Subir Tira"

### Paso 2: Llenar el formulario

- **Título**: Nombre de tu tira (ej: "El Nuevo Inquilino")
- **Fecha**: Fecha de publicación (default: hoy)
- **Tipo de Medio**: 
  - 🖼️ **Imagen** - Para tiras estáticas (PNG, JPG, GIF)
  - 🎬 **Video** - Para animaciones (MP4, WebM)
  - 🎵 **Audio** - Para podcasts o narración (MP3, WAV)

### Paso 3: Seleccionar archivo

- **Para Imagen**: Selecciona tu archivo PNG/JPG
- **Para Video**: 
  - Selecciona el video MP4
  - (Opcional) Sube una miniatura/thumbnail
- **Para Audio**: 
  - Selecciona el archivo MP3
  - (Opcional) Sube una imagen de portada

### Paso 4: Click en "Subir Tira"

El sistema hace automáticamente:
1. ✅ Sube el archivo a `public/strips/` en GitHub
2. ✅ Actualiza `public/data/strips.json`
3. ✅ Hace commit automático
4. ✅ Dispara el deployment automático
5. ✅ Tu tira estará online en ~2-3 minutos

## 🗑️ Gestionar Tiras

### Pestaña "Gestionar"

- Ve todas las tiras publicadas
- Click en el botón 🗑️ para eliminar
- Confirma la eliminación

**Nota**: Esto solo elimina la entrada del JSON, no el archivo físico del repo (para mantener el historial).

## 📊 Proceso Completo

```
1. Usuario sube video en /admin
   ↓
2. JavaScript convierte a Base64
   ↓
3. API de GitHub sube a public/strips/video-xxx.mp4
   ↓
4. Se actualiza public/data/strips.json
   ↓
5. GitHub Actions detecta el commit
   ↓
6. Construye y despliega automáticamente
   ↓
7. Tira visible en https://...github.io/Porteria/
```

## 🎬 Subir Videos - Ejemplo Completo

```
Título: La Reunión de Vecinos
Fecha: 2025-12-10
Tipo: Video
Archivo: mi-animacion.mp4 (25 MB)
Thumbnail: portada.png (opcional)

[Click "Subir Tira"]

✅ Subiendo archivo... 
✅ Video subido a public/strips/video-1702234567890.mp4
✅ Thumbnail subido a public/strips/thumb-1702234567891.png
✅ Actualizando strips.json...
✅ ¡Tira subida correctamente! 🎉

Espera 2-3 minutos y recarga la home page.
```

## ⚙️ Configuración Técnica

### Variables en el código (Admin.tsx):

```typescript
const GITHUB_REPO = "albertomaydayjhondoe/Porteria";
const GITHUB_BRANCH = "main";
```

Si cambias el nombre del repo, actualiza estas variables.

### API de GitHub utilizada:

- `PUT /repos/{owner}/{repo}/contents/{path}` - Subir archivos
- `GET /repos/{owner}/{repo}/contents/{path}` - Leer strips.json

### Límites:

- **Tamaño de archivo**: Validación del sistema hasta **150 MB** por archivo
- **GitHub API**: Límite real de 100 MB (archivos >100MB pueden fallar)
- **Recomendación**: Comprimir videos a menos de 100 MB para mejor experiencia
- **Videos grandes**: El sistema valida hasta 150 MB pero comprime antes de subir
- **Rate limit**: 5000 requests/hora (más que suficiente)

## 🔒 Seguridad

### ✅ Buenas prácticas:

- El token **NUNCA** se guarda permanentemente (solo en sessionStorage)
- Al cerrar el navegador, se borra el token
- Solo tú con el token puedes subir archivos
- GitHub valida permisos en cada request

### ⚠️ NO HAGAS ESTO:

- ❌ No compartas tu token con nadie
- ❌ No lo commits en el código
- ❌ No lo dejes en capturas de pantalla

### Si comprometes tu token:

1. Ve a https://github.com/settings/tokens
2. Click en "Delete" al lado de tu token
3. Genera uno nuevo

## 🆘 Troubleshooting

### "Token de GitHub inválido"
- Verifica que empiece con `ghp_` o `github_pat_`
- Verifica que tiene scope `repo`

### "Error uploading file to GitHub"
- El token puede haber expirado - genera uno nuevo
- Verifica que el repo existe y tienes permisos

### "Error updating strips.json"
- Puede haber conflicto si subes desde CLI y web al mismo tiempo
- Espera unos segundos y reintenta

### El video no se ve en la página
- Espera 2-3 minutos para el deployment
- Verifica que el formato sea MP4 (H.264)
- Abre la consola del navegador para ver errores

### Archivo muy grande
- El sistema valida hasta 150 MB
- GitHub API tiene límite real de 100 MB
- Si tu video es >100 MB, comprime con:
  ```bash
  # Comprimir a 720p con buena calidad
  ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output.mp4
  
  # Comprimir más agresivamente si aún es grande
  ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -preset medium -crf 28 -c:a aac -b:a 96k output.mp4
  ```

## 🎨 Mejores Prácticas

### Para Videos:
- **Resolución**: 1280x720 (720p) es ideal, 1920x1080 (1080p) para alta calidad
- **Formato**: MP4 (H.264 + AAC)
- **Duración**: 10-120 segundos para tiras cómicas
- **Tamaño ideal**: 20-80 MB para balance calidad/velocidad
- **Tamaño máximo**: 150 MB (pero comprimir a <100 MB para GitHub API)

### Para Thumbnails:
- **Resolución**: 1280x720 (mismo aspect ratio que el video)
- **Formato**: PNG o JPG
- **Tamaño**: < 500 KB

### Nombrado:
El sistema genera nombres automáticos:
- Videos: `video-1702234567890.mp4`
- Thumbnails: `thumb-1702234567890.png`
- Imágenes: `image-1702234567890.jpg`

## 🔄 Workflow Recomendado

### Opción 1: Solo Admin Web
```
1. Ve a /admin
2. Sube todo desde la interfaz web
3. Wait for auto-deployment
```

### Opción 2: Híbrido (CLI + Web)
```
CLI para ediciones rápidas de texto:
  node admin.mjs list
  node admin.mjs remove --id "xxx"

Web para uploads de archivos grandes:
  /admin → Upload video
```

### Opción 3: Solo CLI (si prefieres terminal)
```
node admin.mjs add --title "X" --video "file.mp4"
cp file.mp4 public/strips/
git add . && git commit -m "X" && git push
```

## 📱 Mobile Friendly

El admin funciona en móvil también:
- Puedes grabar video en tu teléfono
- Subirlo directamente desde el navegador móvil
- Sin necesidad de computadora

## 🚀 Tips Pro

### 1. Compression pipeline
```bash
# Comprimir video antes de subir
ffmpeg -i input.mov -vf scale=1280:720 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output.mp4
```

### 2. Batch upload
Para subir múltiples tiras:
1. Prepara todos los archivos
2. Sube uno por uno desde el admin
3. O usa el CLI para batch:
   ```bash
   for i in {1..10}; do
     node admin.mjs add --title "Tira $i" --image "strip-$i.png"
   done
   ```

### 3. Automated thumbnails
```bash
# Extraer frame del video como thumbnail
ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 thumbnail.png
```

## 📊 Monitoreo

Ver el progreso del deployment:
1. Ve a: https://github.com/albertomaydayjhondoe/Porteria/actions
2. Click en el workflow más reciente
3. Espera a que termine (círculo verde = éxito)

## 📹 Guía de Compresión de Videos

### ¿Por qué comprimir?

- GitHub API tiene límite de **100 MB** por archivo
- Videos más pequeños cargan más rápido para tus usuarios
- Mantener buena calidad con menor tamaño

### Comprimir con FFmpeg (Recomendado)

#### Instalación de FFmpeg:

**macOS**:
```bash
brew install ffmpeg
```

**Windows**:
Descarga desde: https://ffmpeg.org/download.html

**Linux**:
```bash
sudo apt install ffmpeg  # Ubuntu/Debian
sudo dnf install ffmpeg  # Fedora
```

#### Recetas de Compresión:

**1. Comprimir a 720p (Buena calidad, ~50 MB para 60 segundos)**
```bash
ffmpeg -i input.mp4 \
  -vf scale=1280:720 \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k \
  output.mp4
```

**2. Comprimir a 1080p (Alta calidad, ~80 MB para 60 segundos)**
```bash
ffmpeg -i input.mp4 \
  -vf scale=1920:1080 \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 192k \
  output.mp4
```

**3. Comprimir agresivamente (para videos muy grandes)**
```bash
ffmpeg -i input.mp4 \
  -vf scale=1280:720 \
  -c:v libx264 -preset fast -crf 28 \
  -c:a aac -b:a 96k \
  output.mp4
```

**4. Comprimir manteniendo calidad visual (2-pass encoding)**
```bash
# Pass 1
ffmpeg -i input.mp4 -c:v libx264 -b:v 2M -pass 1 -f mp4 /dev/null

# Pass 2
ffmpeg -i input.mp4 -c:v libx264 -b:v 2M -pass 2 output.mp4
```

### Comprimir sin FFmpeg (Herramientas Online)

- **HandBrake**: https://handbrake.fr (GUI, fácil de usar)
- **CloudConvert**: https://cloudconvert.com/mp4-converter (online)
- **Clipchamp**: https://clipchamp.com (online, gratis)

### Tips de Compresión:

- **CRF (Constant Rate Factor)**: 18-28 (menor = mejor calidad, mayor tamaño)
  - 18-23: Alta calidad (para animaciones complejas)
  - 23-28: Buena calidad (balance ideal)
  - 28+: Calidad reducida (solo para videos simples)

- **Preset**: ultrafast, fast, medium, slow
  - fast: Compresión rápida, archivo más grande
  - medium: Balance ideal (recomendado)
  - slow: Compresión lenta, archivo más pequeño

- **Bitrate de audio**:
  - 96k: Calidad básica
  - 128k: Buena calidad (recomendado)
  - 192k: Alta calidad

### Verificar tamaño del archivo:

```bash
# Linux/Mac
ls -lh output.mp4

# Ver duración y bitrate
ffprobe output.mp4
```

## 🎓 Tutorial Visual

1. **Login**:
   ```
   [🔐 Admin Panel]
   GitHub Token: ghp_xxxxxxxxxxxx
   [Iniciar Sesión]
   ```

2. **Upload**:
   ```
   [📤 Subir Tira]
   Título: Mi Video
   Fecha: 2025-12-10
   Tipo: Video ▼
   
   [Elegir archivo] video.mp4 ✓
   [Elegir miniatura] thumb.png ✓
   
   [Subir Tira]
   ```

3. **Success**:
   ```
   ✅ ¡Tira subida correctamente! 🎉
   ```

---

**¿Listo para empezar?** → [Ir al Admin Panel](/admin)
