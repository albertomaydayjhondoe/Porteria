#!/bin/bash

# Auto-sync script for Lovable to GitHub
# Este script sincroniza automáticamente el README.md con datos de lovable.dev

echo "🚀 Iniciando sincronización automática con Lovable..."

# Paso 1: Instalar dependencias
echo "📦 Instalando dependencias..."
npm install axios cheerio

# Paso 2: Crear script de fetch
echo "📝 Creando script fetch-lovable.js..."
cat > fetch-lovable.js <<'EOF'
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const LOVABLE_URL = 'https://lovable.dev/projects/e480bda7-d68b-4555-b924-01f8fe2a77f7';

axios.get(LOVABLE_URL).then(res => {
  const $ = cheerio.load(res.data);
  const title = $('h1').first().text().trim() || 'Porteria';
  const description = $('meta[name="description"]').attr('content') || $('p').first().text().trim();
  let markdown = `# ${title}\n\n${description}\n\nFuente: [lovable.dev](${LOVABLE_URL})\n`;
  fs.writeFileSync('README.md', markdown, 'utf8');
  console.log("README.md actualizado con datos de lovable.dev");
}).catch(err => {
  console.error("Error obteniendo datos de lovable.dev:", err.message);
});
EOF

# Paso 3: Ejecutar el script
echo "⚡ Ejecutando sincronización..."
node fetch-lovable.js

# Paso 4: Configurar Git y hacer commit
echo "📤 Subiendo cambios a GitHub..."
git config --global user.name "codespace-agent"
git config --global user.email "codespace@github.com"
git add README.md
git commit -m "🔄 Sincroniza README.md automáticamente con datos de lovable.dev"
git push

echo "✅ Sincronización completada exitosamente!"
echo "🌐 Revisa los cambios en: https://github.com/albertomaydayjhondoe/Porteria"