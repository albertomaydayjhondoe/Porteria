# 📰 Paperboy — La Portería

![GitHub Pages](https://github.com/albertomaydayjhondoe/Porteria/workflows/Deploy%20Static%20Site%20to%20GitHub%20Pages/badge.svg)

Blog de tiras cómicas diarias con roller horizontal concatenado y tira del día vertical. Una aplicación moderna construida con React, Supabase y desplegada en GitHub Pages.

## 🌟 Características

- 🎨 **Tira del día destacada** - La última tira se muestra prominentemente
- 📚 **Slider de tiras recientes** - Navegación horizontal por tiras anteriores  
- 📄 **Descarga PDF** - Cada tira se puede descargar como PDF para RRSS
- 🔐 **Panel de administración** - Subida segura de nuevas tiras
- 📱 **Responsive design** - Optimizado para móviles y desktop
- ⚡ **Carga rápida** - CDN React sin build process
- 🔒 **Autenticación segura** - Supabase Auth con roles de usuario

## 🚀 Demo en Vivo

**Sitio principal**: [https://albertomaydayjhondoe.github.io/Porteria/](https://albertomaydayjhondoe.github.io/Porteria/)

### Páginas disponibles:
- `/` - Inicio con última tira y slider
- `/archivo` - Todas las tiras con descarga PDF  
- `/admin` - Panel de administración (requiere login)

## 🛠️ Tecnologías

- **Frontend**: React 18 (CDN), HTML5, CSS3
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **Deployment**: GitHub Pages + GitHub Actions
- **PDF Generation**: jsPDF
- **Routing**: React Router DOM
- **Fonts**: Google Fonts (Inter + Playfair Display)

## 📊 Base de Datos

### Tabla `comic_strips`
```sql
- id: SERIAL PRIMARY KEY
- title: VARCHAR(255) NOT NULL
- date: DATE NOT NULL  
- image_url: VARCHAR(500)
- description: TEXT
- tags: TEXT[]
- created_at: TIMESTAMP WITH TIME ZONE
- updated_at: TIMESTAMP WITH TIME ZONE
```

### Tabla `user_roles`
```sql
- user_id: UUID REFERENCES auth.users(id)
- role: VARCHAR(50) NOT NULL
- created_at: TIMESTAMP WITH TIME ZONE
```

## 🔧 Configuración Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/albertomaydayjhondoe/Porteria.git
   cd Porteria
   ```

2. **Configurar Supabase**
   - Crear proyecto en [supabase.com](https://supabase.com)
   - Ejecutar el script `supabase-setup.sql`
   - Configurar Storage bucket `comic-strips` como público

3. **Variables de entorno**
   Actualizar en `index.html`:
   ```javascript
   const SUPABASE_URL = 'tu-proyecto.supabase.co';
   const SUPABASE_PUBLISHABLE_KEY = 'tu-clave-publica';
   ```

4. **Abrir en navegador**
   ```bash
   # Servir localmente (opcional)
   python -m http.server 8000
   # O simplemente abrir index.html en el navegador
   ```

## 🚀 Despliegue en GitHub Pages

### Pasos para principiantes:

1. **Fork/Clonar este repo**
2. **Configurar GitHub Pages**:
   - Ve a Settings → Pages
   - Source: "GitHub Actions"
3. **Configurar Secrets** (Settings → Secrets and variables → Actions):
   ```
   VITE_SUPABASE_URL: https://sxjwoyxwgmmsaqczvjpd.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY: [tu-clave-anon]
   ```
4. **Push a main** - El deployment es automático

### Workflow incluido:
- ✅ Deployment automático en cada push
- ✅ Configurado para SPAs
- ✅ Optimizado para GitHub Pages

## 👤 Administración

### Acceso admin:
- **URL**: `/admin`
- **Email**: `sampayo@gmail.com`  
- **Contraseña**: `administrador`

### Funcionalidades admin:
- 📤 **Subir nuevas tiras** - Drag & drop de imágenes
- 📝 **Gestionar contenido** - Ver y eliminar tiras
- 🔐 **Autenticación segura** - Supabase Auth + RLS

## 🎨 Personalización

### Colores principales:
```css
--primary: #3b82f6;
--secondary: #6b7280;  
--success: #16a34a;
--error: #dc2626;
--background: #fafafa;
```

### Fuentes:
- **Títulos**: Playfair Display (serif)
- **Texto**: Inter (sans-serif)

## 📄 API Endpoints

La aplicación usa Supabase para:
- `GET /comic_strips` - Obtener tiras (público)
- `POST /comic_strips` - Crear tira (solo admin)
- `DELETE /comic_strips` - Eliminar tira (solo admin)
- `Storage /comic-strips` - Subir imágenes (solo admin)

## 🔒 Seguridad

- ✅ **RLS habilitado** - Solo admins pueden modificar datos
- ✅ **Autenticación real** - No más contraseñas hardcodeadas
- ✅ **Roles de usuario** - Sistema de permisos granular
- ✅ **HTTPS everywhere** - GitHub Pages + Supabase

## 📱 Características Mobile

- 📱 **Responsive design**
- 👆 **Touch-friendly navigation**
- 📄 **PDF generation** funciona en móviles
- ⚡ **Carga optimizada** para conexiones lentas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 📧 Contacto

- **Email**: sampayo@gmail.com
- **GitHub**: [@albertomaydayjhondoe](https://github.com/albertomaydayjhondoe)
- **Proyecto**: [Porteria](https://github.com/albertomaydayjhondoe/Porteria)

---

⭐ ¡Dale una estrella si te gusta el proyecto!
