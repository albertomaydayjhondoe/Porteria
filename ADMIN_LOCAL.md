# 📝 Administración Local - Porteria sin Supabase

## ¿Qué cambió?

El proyecto ahora funciona **100% sin Supabase**. Todos los datos se almacenan en archivos estáticos en GitHub:

- **Datos**: `public/data/strips.json` (JSON con metadata de las tiras)
- **Archivos**: `public/strips/` (imágenes, videos, audio)
- **Admin**: Script CLI local (`admin.mjs`) para gestionar contenido

## 🚀 Cómo usar el Admin Local

### 1. Ver todas las tiras

```bash
node admin.mjs list
```

### 2. Agregar una tira nueva (imagen)

```bash
# 1. Agregar metadata
node admin.mjs add --title "Mi Nueva Tira" --image "strip-002.png" --date "2025-12-10"

# 2. Copiar la imagen a la carpeta
cp /ruta/a/tu/imagen.png public/strips/strip-002.png

# 3. Commit y push
git add .
git commit -m "Agregar nueva tira"
git push
```

### 3. Agregar una tira con video

```bash
# Con thumbnail
node admin.mjs add --title "Tira Animada" --video "video-001.mp4" --image "thumb-001.png"

# Solo video (sin thumbnail)
node admin.mjs add --title "Tira Animada" --video "video-001.mp4"

# Copiar archivos
cp tu-video.mp4 public/strips/video-001.mp4
cp tu-thumbnail.png public/strips/thumb-001.png  # si aplica

# Commit
git add .
git commit -m "Agregar tira con video"
git push
```

### 4. Agregar tira con audio

```bash
node admin.mjs add --title "Podcast Porteria" --audio "audio-001.mp3" --image "cover-001.png"

cp tu-audio.mp3 public/strips/audio-001.mp3
cp tu-cover.png public/strips/cover-001.png

git add . && git commit -m "Agregar episodio audio" && git push
```

### 5. Eliminar una tira

```bash
# Primero, lista para ver el ID
node admin.mjs list

# Elimina por ID
node admin.mjs remove --id "abc123def456"

# Opcionalmente, borra el archivo físico
rm public/strips/strip-002.png

# Commit
git add .
git commit -m "Eliminar tira antigua"
git push
```

## 📁 Estructura de Archivos

```
Porteria/
├── admin.mjs                    # ← Script de administración CLI
├── public/
│   ├── data/
│   │   └── strips.json         # ← Base de datos de tiras (JSON)
│   └── strips/                 # ← Carpeta de medios
│       ├── strip-001.png
│       ├── strip-002.png
│       ├── video-001.mp4
│       └── audio-001.mp3
└── src/
    └── pages/
        ├── Index.tsx           # ← Lee desde strips.json
        └── Archive.tsx         # ← Lee desde strips.json
```

## 🔧 Formato del JSON

El archivo `public/data/strips.json` tiene esta estructura:

```json
{
  "strips": [
    {
      "id": "abc123",
      "title": "Título de la Tira",
      "image_url": "/Porteria/strips/strip-001.png",
      "publish_date": "2025-12-10",
      "media_type": "image"
    },
    {
      "id": "def456",
      "title": "Tira con Video",
      "image_url": "/Porteria/strips/thumb-001.png",
      "video_url": "/Porteria/strips/video-001.mp4",
      "publish_date": "2025-12-09",
      "media_type": "video"
    }
  ]
}
```

### Campos:

- `id`: Identificador único (auto-generado)
- `title`: Título de la tira
- `image_url`: Ruta a la imagen (o thumbnail si es video/audio)
- `video_url`: (Opcional) Ruta al video
- `audio_url`: (Opcional) Ruta al audio
- `publish_date`: Fecha en formato YYYY-MM-DD
- `media_type`: `"image"`, `"video"` o `"audio"`

## 🎯 Workflow Completo

### Workflow diario para publicar una tira:

```bash
# 1. Agrega la tira al JSON
node admin.mjs add --title "La Reunión de Vecinos" --image "strip-025.png"

# 2. Copia tu archivo
cp ~/Desktop/mi-tira.png public/strips/strip-025.png

# 3. Verifica que se agregó
node admin.mjs list

# 4. Commit y push (deployment automático vía GitHub Actions)
git add .
git commit -m "Nueva tira: La Reunión de Vecinos"
git push

# ¡Listo! En unos minutos estará en https://albertomaydayjhondoe.github.io/Porteria/
```

## ⚡ Ventajas de este sistema

✅ **Sin backend** - Todo está en archivos estáticos  
✅ **Sin costos** - GitHub Pages es gratis  
✅ **Sin configuración** - No necesitas keys ni tokens  
✅ **Control total** - Todo en Git, versionado automático  
✅ **Simple** - Un comando para agregar, otro para listar  
✅ **Rápido** - No hay base de datos que consultar  

## 🔄 Deployment Automático

Cada vez que hagas `git push`:

1. GitHub Actions detecta el cambio
2. Construye la app con `npm run build`
3. Copia todo a la rama `gh-pages`
4. GitHub Pages publica automáticamente

**No necesitas hacer nada más** - El deployment es 100% automático.

## 🆘 Ayuda del Script

Para ver todas las opciones:

```bash
node admin.mjs help
```

## 📸 Convenciones de Nombres

Para mantener orden:

- **Imágenes**: `strip-001.png`, `strip-002.png`, etc.
- **Videos**: `video-001.mp4`, `video-002.mp4`, etc.
- **Thumbnails**: `thumb-001.png`, `thumb-002.png`, etc.
- **Audio**: `audio-001.mp3`, `audio-002.mp3`, etc.

(Pero puedes usar cualquier nombre - el script no valida nombres)

## 🐛 Troubleshooting

**Q: No veo mi tira nueva en la web**  
A: Espera 2-3 minutos para que GitHub Pages actualice. Revisa el tab "Actions" en GitHub.

**Q: Sale "Error loading strips"**  
A: Revisa que el JSON esté bien formateado (usa `node admin.mjs list` para verificar).

**Q: La imagen/video no carga**  
A: Verifica que el archivo esté en `public/strips/` y que el nombre coincida con el JSON.

**Q: ¿Puedo editar el JSON manualmente?**  
A: Sí, pero es más fácil y seguro usar el script `admin.mjs`.

## 🎨 Tips

- **IDs**: Son auto-generados, no los cambies manualmente
- **Orden**: Las tiras más nuevas van primero (el script ya lo hace)
- **Fechas**: Usa formato YYYY-MM-DD siempre
- **Rutas**: Todas las URLs deben empezar con `/Porteria/` (el script lo hace)

---

**¿Preguntas?** El script tiene ayuda integrada: `node admin.mjs help`
