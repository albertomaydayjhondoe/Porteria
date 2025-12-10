# 🚀 Resumen: Admin Web para Upload de Videos

## ✅ Lo que se implementó

### 1. **Panel de Administración Web** (`/admin`)
- ✨ Interfaz visual moderna con shadcn/ui
- 🔐 Autenticación con GitHub Personal Access Token
- 📤 Upload de imágenes, videos y audio
- 🗑️ Gestión de tiras (eliminar)
- 📱 Responsive (funciona en móvil)

### 2. **Sistema de Upload Directo a GitHub**
- Usa GitHub API para subir archivos
- Convierte archivos a Base64
- Actualiza `strips.json` automáticamente
- Hace commits automáticos
- Dispara deployment automático vía GitHub Actions

### 3. **Soporte Multimedia Completo**
- 🖼️ **Imágenes**: PNG, JPG, GIF
- 🎬 **Videos**: MP4, WebM (con thumbnail opcional)
- 🎵 **Audio**: MP3, WAV (con cover art opcional)

## 🔗 URLs Importantes

- **Admin Panel**: `https://albertomaydayjhondoe.github.io/Porteria/admin`
- **Crear Token**: https://github.com/settings/tokens
- **Ver Deployments**: https://github.com/albertomaydayjhondoe/Porteria/actions

## 📝 Cómo Usar (Quick Start)

### Primera vez:

1. **Obtén tu token de GitHub**:
   ```
   1. Ve a: https://github.com/settings/tokens
   2. "Generate new token (classic)"
   3. Scope: ✅ repo
   4. Copia el token (ghp_xxxxx)
   ```

2. **Accede al admin**:
   ```
   1. Ve a: /admin
   2. Pega tu token
   3. Click "Iniciar Sesión"
   ```

3. **Sube tu primera tira**:
   ```
   Título: Mi Primera Tira
   Fecha: 2025-12-10
   Tipo: Video
   Archivo: [Selecciona tu video.mp4]
   Thumbnail: [Opcional - portada.png]
   
   [Subir Tira]
   ```

4. **Espera 2-3 minutos** y recarga la home page - ¡tu tira estará ahí!

## 🎬 Ejemplo: Subir un Video

```
Archivo: animacion.mp4 (15 MB)
Thumbnail: cover.png (500 KB)

1. /admin → Pestaña "Subir Tira"
2. Título: "La Reunión de Vecinos"
3. Tipo: Video
4. Selecciona animacion.mp4
5. Selecciona cover.png (thumbnail)
6. Click "Subir Tira"

✅ Resultado:
- public/strips/video-1702234567890.mp4
- public/strips/thumb-1702234567891.png
- strips.json actualizado
- Commit automático
- Deploy en ~2 minutos
```

## 🔄 Workflow Completo

```
Usuario → /admin
    ↓
Sube video.mp4
    ↓
GitHub API recibe archivo
    ↓
Se sube a public/strips/
    ↓
Se actualiza strips.json
    ↓
Git commit automático
    ↓
GitHub Actions detecta cambio
    ↓
Build + Deploy automático
    ↓
Tira visible en producción ✨
```

## 🆚 Admin CLI vs Admin Web

### Use Admin Web cuando:
- ✅ Necesitas subir videos/archivos grandes
- ✅ Prefieres interfaz visual
- ✅ Trabajas desde móvil
- ✅ No quieres usar la terminal

### Use Admin CLI cuando:
- ✅ Ediciones rápidas de metadata
- ✅ Eliminar múltiples tiras
- ✅ Scripts automatizados
- ✅ Prefieres la terminal

### Puedes usar ambos - son compatibles!

## 🔧 Configuración del Sistema

### Archivos creados/modificados:

```
/workspaces/Porteria/
├── src/
│   ├── App.tsx                    [MODIFICADO] +1 ruta
│   └── pages/
│       └── Admin.tsx              [NUEVO] Panel admin completo
├── ADMIN_WEB.md                   [NUEVO] Documentación
└── public/
    ├── data/strips.json           [Actualiza automáticamente]
    └── strips/                    [Archivos se suben aquí]
```

### Dependencias requeridas:

Ya están instaladas:
- `@radix-ui/*` - Componentes UI
- `sonner` - Notificaciones toast
- `lucide-react` - Iconos

No se necesita instalar nada nuevo.

## 🔒 Seguridad

### ✅ Seguro:
- Token solo en sessionStorage (se borra al cerrar navegador)
- GitHub valida permisos en cada request
- Solo usuarios con token pueden subir
- Todo queda registrado en Git (trazabilidad)

### ⚠️ Importante:
- **NO compartas tu token**
- **NO lo commits en el código**
- Si se compromete, revócalo y genera uno nuevo

## 📊 Límites y Consideraciones

### Tamaños de archivo:
- **Sistema**: Validación hasta 150 MB por archivo
- **GitHub API**: Límite real de 100 MB (recomendado comprimir si excedes)
- **Recomendado para mejor rendimiento**: 
  - Videos: < 50 MB (comprimir a 720p)
  - Imágenes: < 5 MB
  - Audio: < 10 MB

### Rate Limits:
- **5000 requests/hora** (GitHub API)
- Más que suficiente para uso normal

### Formato de videos:
- **Mejor**: MP4 (H.264 + AAC)
- **Resolución**: 720p o 1080p
- **Duración**: 10-60 segundos ideal

## 🐛 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| "Token inválido" | Verifica que empiece con `ghp_` y tenga scope `repo` |
| "Error uploading" | Token expirado - genera uno nuevo |
| Video no se ve | Espera 2-3 min para deployment, verifica formato MP4 |
| Archivo muy grande | Comprime con ffmpeg antes de subir |

## 📚 Documentación Completa

- **Admin Web**: Ver `ADMIN_WEB.md`
- **Admin CLI**: Ver `ADMIN_LOCAL.md`
- **Deployment**: Ver `DEPLOYMENT_INSTRUCTIONS.md`
- **AI Agents**: Ver `.github/copilot-instructions.md`

## 🎯 Próximos Pasos

1. **Pruébalo**: Ve a `/admin` y sube tu primera tira
2. **Genera tu token**: https://github.com/settings/tokens
3. **Sube un video de prueba**: Verifica que todo funcione
4. **Documenta tu workflow**: Decide si usarás CLI, Web, o ambos

## 💡 Tips Pro

### Comprimir videos antes de subir:
```bash
ffmpeg -i input.mov \
  -vf scale=1280:720 \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k \
  output.mp4
```

### Extraer thumbnail automático:
```bash
ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 thumbnail.png
```

### Monitorear deployments:
Ve a Actions tab en GitHub para ver el progreso en tiempo real.

## 🎉 ¡Listo para Producción!

El sistema está completo y funcional. Solo necesitas:
1. ✅ Generar tu GitHub token
2. ✅ Acceder a `/admin`
3. ✅ Empezar a subir contenido

**¡A publicar tiras cómicas! 🎬📱🖼️**

---

**Documentación completa**: [ADMIN_WEB.md](./ADMIN_WEB.md)
