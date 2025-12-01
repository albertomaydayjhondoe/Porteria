---
layout: home
title: Home
---

# Paperboy — La Portería

Bienvenido al blog de tiras cómicas diarias. Aquí encontrarás contenido fresco y divertido cada día.

## Características

- **Tiras diarias**: Nuevo contenido cada día
- **Archivo completo**: Navega por todas las tiras anteriores
- **Búsqueda por tags**: Encuentra tiras por temática
- **Diseño responsive**: Optimizado para todos los dispositivos
- **Feed RSS**: Mantente al día con las actualizaciones

## Navegación

- [Ver todas las tiras](/tiras/)
- [Feed RSS](/feed.xml)
- [Acerca de](/about/)

{% assign latest_tiras = site.tiras | sort: 'date' | reverse | limit: 3 %}

## Últimas tiras

{% for tira in latest_tiras %}
- [{{ tira.title }}]({{ tira.url }}) - {{ tira.date | date: "%B %d, %Y" }}
{% endfor %}
