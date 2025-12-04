# 🚀 Project Management Dashboard

Una plataforma moderna de gestión de proyectos inspirada en herramientas colaborativas populares, construida con React + Node.js y Supabase.

## 🌟 Características

- **📊 Dashboard Interactivo** - Estadísticas en tiempo real y visualización de proyectos
- **🎯 Gestión de Proyectos** - CRUD completo con estados y tecnologías
- **👥 Colaboradores** - Sistema de equipos y roles
- **📱 Responsive Design** - Interfaz moderna con Tailwind CSS
- **🔒 Autenticación** - Sistema seguro con Supabase Auth
- **⚡ API REST** - Backend escalable con Node.js + Express

## 🏗️ Arquitectura

```
project-dashboard/
├── frontend/          # React + Vite + Tailwind
├── backend/           # Node.js + Express API
├── database-schema.sql # Estructura de Supabase
└── docs/             # Documentación
```

## 🚀 Instalación Rápida

### 1. Configuración del Frontend

```bash
cd frontend
npm install
npm run dev
```
**URL:** http://localhost:3000

### 2. Configuración del Backend

```bash  
cd backend
npm install
npm run dev
```
**URL:** http://localhost:5000

### 3. Base de Datos (Supabase)

1. Ejecuta el contenido de `database-schema.sql` en tu panel de Supabase
2. Configura las variables de entorno:

```bash
# .env (backend)
SUPABASE_URL=https://sxjwoyxwgmmsaqczvjpd.supabase.co
SUPABASE_SERVICE_KEY=tu_service_key_aqui

# .env (frontend) 
VITE_SUPABASE_URL=https://sxjwoyxwgmmsaqczvjpd.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4andveXh3Z21tc2FxY3p2anBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODQ4OTIsImV4cCI6MjA4MDE2MDg5Mn0.C7E_sRLVn9Uzfv3w-AzwuUQC0xB4Mfuq0aFfxrXK3s0
```

## 📊 API Endpoints

```
GET    /api/projects          # Obtener todos los proyectos
GET    /api/projects/:id      # Obtener proyecto específico  
POST   /api/projects          # Crear nuevo proyecto
GET    /api/collaborators     # Obtener colaboradores
GET    /api/stats             # Estadísticas del dashboard
```

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router** - Navegación SPA
- **Lucide React** - Iconos modernos
- **Supabase Client** - Cliente de base de datos

### Backend  
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web minimalista
- **Supabase** - Base de datos y autenticación
- **Helmet** - Middleware de seguridad
- **CORS** - Habilitación de cross-origin

### Base de Datos
- **PostgreSQL** (via Supabase)
- **Row Level Security** (RLS)
- **Triggers automáticos**
- **Índices optimizados**

## 🎨 Componentes Principales

### Dashboard
- Tarjetas de estadísticas
- Grid de proyectos
- Buscador y filtros
- Navegación fluida

### Gestión de Proyectos  
- Estados del proyecto (Planning, Active, etc.)
- Stack tecnológico
- Enlaces a repositorios
- Métricas de colaboradores

### Sistema de Colaboradores
- Roles y permisos
- Avatares de usuario  
- Histórico de participación

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy carpeta 'dist'
```

### Backend (Railway/Render)
```bash
cd backend  
npm start
# Puerto: process.env.PORT || 5000
```

### Base de Datos
- Supabase maneja automáticamente el hosting
- Configurar RLS policies según necesidades
- Backups automáticos incluidos

## 🔧 Desarrollo

### Comandos Útiles
```bash
# Desarrollo completo
npm run dev        # Frontend
npm run dev        # Backend (en otra terminal)

# Construcción
npm run build      # Frontend
npm start          # Backend production

# Linting
npm run lint       # Verificar código
```

### Variables de Entorno
```bash
# Backend
PORT=5000
NODE_ENV=development
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...

# Frontend  
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_API_URL=http://localhost:5000
```

## 📈 Características Técnicas

- ✅ **TypeScript Ready** - Fácil migración a TS
- ✅ **PWA Compatible** - Service workers listos
- ✅ **SEO Optimizado** - Meta tags y estructura
- ✅ **Accesibilidad** - ARIA labels y navegación por teclado
- ✅ **Responsive** - Mobile-first design
- ✅ **Performance** - Code splitting y lazy loading

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- Inspirado en herramientas modernas de gestión de proyectos
- Construido con las mejores prácticas de React y Node.js
- Diseño UI/UX basado en principios de usabilidad

---

**Desarrollado con ❤️ usando tecnologías modernas**