# Project Dashboard - Instrucciones para Codespaces

## 🚀 Instalación Rápida en Codespaces

### Paso 1: Ejecutar Setup Automático
```bash
./setup.sh
```

### Paso 2: Configurar Base de Datos
1. Ve a tu panel de [Supabase](https://supabase.com/dashboard)
2. Crea un nuevo proyecto o usa uno existente
3. Ve a SQL Editor
4. Ejecuta el contenido completo de `database-schema.sql`

### Paso 3: Iniciar Aplicación

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend  
npm run dev
```

### 🌐 URLs de Acceso

- **Frontend:** https://[codespace-name]-3000.app.github.dev
- **Backend API:** https://[codespace-name]-5000.app.github.dev
- **API Docs:** https://[codespace-name]-5000.app.github.dev/

### 🔧 Configuración de Puertos

Codespaces debería abrir automáticamente los puertos 3000 y 5000. Si no:

1. Ve a la pestaña "PORTS" en VS Code
2. Añade los puertos 3000 y 5000
3. Cambia la visibilidad a "Public"

### 📊 Funcionalidades Incluidas

- ✅ Dashboard interactivo con estadísticas
- ✅ Gestión completa de proyectos (CRUD)
- ✅ Sistema de colaboradores y roles  
- ✅ API REST documentada
- ✅ Base de datos configurada con datos de ejemplo
- ✅ Interfaz responsive con Tailwind CSS

### 🎯 Características de la Interfaz

**Dashboard Principal:**
- Tarjetas de estadísticas en tiempo real
- Grid de proyectos con filtros
- Buscador funcional
- Navegación SPA con React Router

**Gestión de Proyectos:**
- Estados: Planning, Active, In Development, Completed
- Stack tecnológico visual
- Enlaces a repositorios
- Métricas de equipo

**Sistema de Colaboradores:**
- Roles personalizables
- Gestión de equipos
- Integración con autenticación

### 🔐 Credenciales por Defecto

Las variables de Supabase ya están configuradas en los archivos .env de ejemplo.

### 📱 Responsive Design

La aplicación está optimizada para:
- Desktop (1200px+)
- Tablet (768px - 1199px)  
- Mobile (< 768px)

### ⚡ Performance

- Componentes optimizados con React 18
- Lazy loading de rutas
- Imágenes optimizadas
- CSS minificado en producción

¡La aplicación estará lista para usar en menos de 2 minutos! 🎉