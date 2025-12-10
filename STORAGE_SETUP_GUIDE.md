# 🔧 Script para configurar Supabase Storage

## Opción 1: Dashboard Manual (RECOMENDADO)
1. Ve a: https://supabase.com/dashboard/project/sxjwoyxwgmmsaqczvjpd/storage/buckets
2. Click "Create bucket"
3. Configuración:
   - Name: `comic-videos`
   - Public bucket: ✅ SÍ
   - File size limit: 157286400 (150MB)
4. Después de crear, ir a "Settings" → "Policies" 
5. Asegurar que hay políticas para acceso público de lectura

## Opción 2: SQL Manual
Si tienes acceso al SQL Editor, ejecuta:

```sql
-- Crear bucket público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'comic-videos', 
  'comic-videos', 
  true, 
  157286400,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
);
```

## Opción 3: Código de prueba
Usa el admin panel en la app para probar si el bucket ya existe:
1. Ve a: https://tu-usuario.github.io/Porteria/#admin
2. Login con: sampayo@gmail.com / administrador
3. Intenta subir un video - si da error de bucket, hay que crearlo

## Verificación
El bucket debe aparecer en: Storage → Buckets como "comic-videos" con estado público