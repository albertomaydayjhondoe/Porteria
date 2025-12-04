# Paperboy — La Portería

Blog de tiras cómicas diarias construido con Jekyll y desplegado en GitHub Pages.

## 🚀 Desarrollo Local

### Con Docker (Recomendado)

```bash
# Construir y ejecutar el contenedor
docker-compose up --build

# El sitio estará disponible en http://localhost:4000
```

### Sin Docker

```bash
# Instalar dependencias
bundle install

# Ejecutar Jekyll
bundle exec jekyll serve --livereload

# El sitio estará disponible en http://localhost:4000
```

## 📁 Estructura del Proyecto

```
├── _tiras/              # Colección de tiras cómicas
├── _layouts/            # Plantillas de Jekyll
├── assets/             # CSS, JS, imágenes
├── paperboy/           # Aplicación PHP original
├── _config.yml         # Configuración de Jekyll
├── Dockerfile          # Imagen Docker
└── docker-compose.yml  # Configuración de Docker Compose
```

## 🎨 Añadir Nueva Tira

1. Crea un archivo en `_tiras/` con el formato `YYYY-MM-DD-titulo.md`
2. Añade la imagen en `assets/tiras/`
3. Usa este formato:

```yaml
---
title: "Título de la tira"
date: 2025-12-01
tags: [humor, tecnología, diario]
image: "/assets/tiras/2025-12-01.svg"
---

Descripción opcional de la tira.
```

## 🌐 Despliegue

El sitio se despliega automáticamente en GitHub Pages cuando haces push a la rama `main`.

URL del sitio: https://albertomaydayjhondoe.github.io/Porteria/

## 🛠 Tecnologías

- **Jekyll**: Generador de sitios estáticos
- **GitHub Pages**: Hosting gratuito
- **Docker**: Desarrollo local
- **GitHub Actions**: CI/CD automático

## 📱 Características

- ✅ Diseño responsive
- ✅ Navegación entre tiras
- ✅ Sistema de tags
- ✅ Feed RSS automático
- ✅ SEO optimizado
- ✅ Modal de zoom para imágenes
- ✅ Archivo cronológico

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Añade nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## Legacy: Aplicación PHP Original

La carpeta `paperboy/` contiene la aplicación PHP original. Para usarla:

```bash
# Generar el proyecto PHP
./setup_paperboy_local.sh

# Ejecutar servidor PHP
cd paperboy
php -S localhost:8000
```
