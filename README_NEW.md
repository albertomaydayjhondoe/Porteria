# 🏢 Porteria - Daily Comic Strip Viewer

Visualizador de tiras cómicas diarias con soporte multimedia completo (imágenes, videos, audio). Desplegado en GitHub Pages.

## 🚀 Demo en Vivo

**[Ver Porteria →](https://albertomaydayjhondoe.github.io/Porteria/)**

## ✨ Características

- 📱 **Responsive**: Funciona perfectamente en móvil y desktop
- 🎬 **Multimedia**: Soporta imágenes, videos y audio
- 📚 **Archivo**: Navega por todas las tiras históricas
- 🎨 **Moderno**: UI con shadcn/ui y Tailwind CSS
- 🚀 **Rápido**: Static site, sin backend necesario
- 🔄 **Auto-deploy**: Cada push despliega automáticamente

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS
- **Data**: Static JSON files
- **Admin**: Local CLI script
- **Deploy**: GitHub Pages + GitHub Actions

## 📦 Instalación y Desarrollo

```bash
# Clonar
git clone https://github.com/albertomaydayjhondoe/Porteria.git
cd Porteria

# Instalar dependencias
npm install

# Desarrollo local
npm run dev
# Abre http://localhost:8080

# Build de producción
npm run build
npm run preview
```

## 📝 Gestión de Contenido

Usa el script CLI local para agregar/quitar tiras:

```bash
# Ver todas las tiras
node admin.mjs list

# Agregar nueva tira
node admin.mjs add --title "Mi Tira" --image "strip-003.png"

# Copiar el archivo
cp mi-tira.png public/strips/strip-003.png

# Commit y push (auto-deploy)
git add .
git commit -m "Nueva tira"
git push
```

**Ver documentación completa**: [ADMIN_LOCAL.md](./ADMIN_LOCAL.md)

## 🎬 Soporte Multimedia

### Imagen (default)
```bash
node admin.mjs add --title "Tira Estática" --image "strip-001.png"
```

### Video
```bash
node admin.mjs add --title "Animación" --video "video-001.mp4" --image "thumb-001.png"
```

### Audio
```bash
node admin.mjs add --title "Podcast" --audio "audio-001.mp3" --image "cover-001.png"
```

## 📁 Estructura de Datos

```json
// public/data/strips.json
{
  "strips": [
    {
      "id": "abc123",
      "title": "Título de la Tira",
      "image_url": "/Porteria/strips/strip-001.png",
      "publish_date": "2025-12-10",
      "media_type": "image"
    }
  ]
}
```

## 🚀 Deployment

El proyecto se despliega automáticamente con GitHub Actions:

1. Haz push a `main`
2. GitHub Actions construye el proyecto
3. Se publica en GitHub Pages automáticamente
4. Disponible en minutos

**Deployment manual**: Ver [scripts/force_deploy_to_porteria.sh](./scripts/force_deploy_to_porteria.sh)

## 🗂️ Estructura del Proyecto

```
Porteria/
├── admin.mjs                 # CLI para gestionar tiras
├── public/
│   ├── data/
│   │   └── strips.json      # Base de datos (JSON)
│   └── strips/              # Archivos multimedia
├── src/
│   ├── pages/               # Páginas de la app
│   ├── components/          # Componentes React
│   └── components/ui/       # shadcn/ui (NO editar manualmente)
└── vite.config.ts           # Configuración de build
```

## 🎨 Agregar Componentes UI

Este proyecto usa [shadcn/ui](https://ui.shadcn.com/). Para agregar componentes:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
```

**⚠️ NUNCA edites archivos en `src/components/ui/` manualmente**

## 🧪 Testing

No hay suite de tests formal. Checklist manual:

- ✅ Rutas funcionan con base path `/Porteria/`
- ✅ JSON carga correctamente
- ✅ Videos y audio se reproducen
- ✅ Navegación directa funciona (redirect 404)
- ✅ Admin CLI agrega/lista/elimina tiras

## 🐛 Troubleshooting

**"Error loading strips"**
- Verifica que `public/data/strips.json` existe y es válido JSON
- Usa `node admin.mjs list` para validar

**Las imágenes no cargan**
- Las rutas deben incluir `/Porteria/` prefix
- Verifica que los archivos estén en `public/strips/`

**404 en producción**
- Revisa que el `basename` en `App.tsx` sea `/Porteria`
- Verifica la config en `vite.config.ts`

## 📄 Licencia

Ver [LICENSE](./LICENSE)

## 🤝 Contribuir

1. Fork el repo
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m "Agregar nueva funcionalidad"`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📚 Documentación

- [ADMIN_LOCAL.md](./ADMIN_LOCAL.md) - Guía completa del admin CLI
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) - Guía para AI coding agents
- [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md) - Deployment manual

---

**Hecho con ❤️ usando React + TypeScript + Vite**
