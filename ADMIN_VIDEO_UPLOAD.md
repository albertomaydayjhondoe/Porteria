# 📹 Configuración de Supabase Storage para Upload de Videos

## Pasos para configurar el bucket de Storage

### 1. Ejecutar el script SQL
1. Ve al [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto: `sxjwoyxwgmmsaqczvjpd`
3. Ve a **SQL Editor**
4. Ejecuta el contenido del archivo `supabase-storage-setup.sql`

### 2. Verificar configuración
Después de ejecutar el script, verifica en:
- **Storage** → Buckets: Debe aparecer `comic-videos` con acceso público
- **Authentication** → Policies: Deben aparecer las políticas RLS para el bucket

### 3. Configuración de CORS (si es necesario)
Si tienes problemas de CORS, ve a **Settings** → **API** y agrega:
```
https://yourusername.github.io
```

## Funcionalidades implementadas

### ✅ Admin Panel
- 🔐 Login de administrador (`sampayo@gmail.com`)
- 📤 Upload de videos (máx 100MB)
- 📝 Formulario de metadatos (título, fecha)
- 📊 Barra de progreso de upload
- 👁️ Vista previa de videos
- 🗑️ Borrar videos
- 🔄 Actualización automática de listas

### ✅ Storage Integration
- 📁 Bucket `comic-videos` configurado
- 🔗 URLs públicas automáticas
- 🛡️ Políticas RLS para seguridad
- 💾 Guardado de metadatos en `comic_strips`

### ✅ Video Management
- 📋 Lista de videos subidos
- 🎬 Reproductor HTML5 integrado
- 📱 Diseño responsive
- ⬇️ Funcionalidad de descarga

## Estructura de datos

### Tabla `comic_strips`
```sql
{
  id: uuid,
  title: string,
  publish_date: date,
  video_url: string,
  image_url: string, -- (same as video_url for fallback)
  media_type: 'video'
}
```

### Bucket `comic-videos`
```
videos/
├── video_1733123456789.mp4
├── video_1733123567890.webm
└── video_1733123678901.mov
```

## Uso

### Para subir un video:
1. Hacer login como admin
2. Scroll hacia abajo hasta "Admin Panel"
3. Llenar formulario (título automático con fecha actual)
4. Seleccionar archivo de video
5. Click en "📤 Subir Video"
6. Esperar confirmación y actualización automática

### Para gestionar videos:
- **Ver**: Click en 👁️ para vista previa modal
- **Borrar**: Click en 🗑️ (pide confirmación)
- **Actualizar**: Click en 🔄 para recargar lista

## Formatos soportados
- MP4 (recomendado)
- WebM
- MOV
- AVI
- Máximo: 100MB por archivo

## Deploy
El código está listo para producción. Solo falta:
1. ✅ Ejecutar el script SQL en Supabase
2. ✅ Verificar que las credenciales están correctas
3. ✅ Deploy a GitHub Pages

## URLs importantes
- **App**: https://yourusername.github.io/Porteria/
- **Supabase**: https://sxjwoyxwgmmsaqczvjpd.supabase.co
- **Admin**: https://yourusername.github.io/Porteria/#admin