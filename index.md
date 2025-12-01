---
layout: default
---

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Paperboy — La Portería</title>
  <style>
    :root{
      --bg:#ffffff;
      --muted:#f4f4f4;
      --ink:#111;
      --dark:#222;
      --accent:#000;
      --max-width:1100px;
      --gap:18px;
      font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }

    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--ink);-webkit-font-smoothing:antialiased}
    .container{max-width:var(--max-width);margin:28px auto;padding:0 18px}
    .site-header{display:flex;justify-content:space-between;align-items:center;padding:20px 18px;border-bottom:1px solid #e6e6e6}
    .brand h1{margin:0;font-size:24px;letter-spacing:1px}
    .brand .subtitle{margin:0;font-size:13px;color:#666;font-style:italic}
    .main-nav a{margin-left:16px;color:var(--ink);text-decoration:none;font-weight:600}
    .tira-dia{margin-top:20px}
    .tira-card{background:#fff;padding:18px;border:1px solid #e6e6e6;border-radius:6px; position: relative;}
    .tira-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
    .tira-meta h2{font-family: "Playfair Display", serif;margin:0;font-size:20px}
    .tira-image-vertical{display:flex;justify-content:center; cursor: zoom-in;}
    .tira-image-vertical img{max-width:100%;height:auto;border:1px solid #ddd;box-shadow:0 1px 0 rgba(0,0,0,0.03)}
    .tira-nav{display:flex;justify-content:center;margin-top:12px}
    .btn{background:#000;color:#fff;border:none;padding:8px 14px;margin:0 6px;border-radius:4px;cursor:pointer}
    .btn:disabled{opacity:.5;cursor:not-allowed}
    .roller-section{margin-top:28px}
    .roller{display:flex;gap:10px;overflow-x:auto;padding:12px 6px;border-top:1px solid #eee;border-bottom:1px solid #eee;scroll-behavior:smooth}
    .roller-item{flex:0 0 auto;width:200px;border:1px solid #eee;background:#fff;padding:8px;border-radius:4px;cursor:pointer;display:flex;flex-direction:column}
    .roller-item img{width:100%;height:120px;object-fit:cover;border-bottom:1px solid #eee;margin-bottom:8px}
    .roller-item .meta{font-size:12px;color:#555}
    .site-footer{display:flex;justify-content:space-between;align-items:center;padding:18px;border-top:1px solid #eee;margin-top:30px}
    .footer-right span{display:inline-block;background:#222;color:#fff;padding:4px 8px;border-radius:3px;margin-left:6px;font-size:12px}
    .empty{padding:40px;text-align:center;color:#777}

    .tags-list {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .tag {
      display: inline-block;
      background: var(--muted);
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 13px;
      text-decoration: none;
      color: #555;
      transition: all 0.2s;
    }
    .tag:hover, .tag.active {
      background: var(--accent);
      color: var(--bg);
    }
    .tira-tags {
      margin-top: 15px;
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    /* Modal Zoom */
    .zoom-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: zoom-out;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s;
    }
    .zoom-modal.visible {
      opacity: 1;
      visibility: visible;
    }
    .zoom-modal img {
      max-width: 95%;
      max-height: 95%;
      object-fit: contain;
    }

    /* Responsive */
    @media (max-width:720px){
      .roller-item{width:140px}
      .brand h1{font-size:20px}
    }
  </style>
</head>
<body class="theme-paperboy">
  <header class="site-header">
    <div class="brand">
      <h1><a href="{{ '/' | relative_url }}" style="text-decoration:none; color:inherit;">Paperboy</a></h1>
      <p class="subtitle">La Portería</p>
    </div>
    <nav class="main-nav">
      <a href="{{ '/' | relative_url }}">Inicio</a>
      <a href="{{ '/tiras/' | relative_url }}">Tiras</a>
      <a href="{{ '/about/' | relative_url }}">Acerca de</a>
      <a href="{{ '/feed.xml' | relative_url }}">RSS</a>
    </nav>
  </header>

  <main class="container">
    {% assign all_tags = site.tiras | map: 'tags' | join: ',' | split: ',' | uniq | sort %}
    {% assign current_tag = page.tag %}
    
    <section class="tags-list">
      {% for tag_item in all_tags %}
        {% if tag_item != "" %}
          <a href="/?tag={{ tag_item | uri_escape }}" class="tag {% if tag_item == current_tag %}active{% endif %}">
            #{{ tag_item }}
          </a>
        {% endif %}
      {% endfor %}
    </section>

    <section class="tira-dia">
      {% assign latest_tira = site.tiras | sort: 'date' | reverse | first %}
      {% if latest_tira %}
        <article class="tira-card">
          <header class="tira-meta">
            <h2><a href="{{ latest_tira.url }}">{{ latest_tira.title | default: 'Tira del día' }}</a></h2>
            <time datetime="{{ latest_tira.date | date_to_xmlschema }}">{{ latest_tira.date | date: "%Y-%m-%d" }}</time>
          </header>
          <div class="tira-image-vertical">
            <img src="{{ latest_tira.image | relative_url }}" alt="Tira del día" loading="eager">
          </div>
          <div class="tira-tags">
            {% for tag in latest_tira.tags %}
              <a href="/?tag={{ tag | uri_escape }}" class="tag">#{{ tag }}</a>
            {% endfor %}
          </div>
          <div class="tira-nav">
            {% assign sorted_tiras = site.tiras | sort: 'date' %}
            {% assign current_index = 0 %}
            {% for tira in sorted_tiras %}
              {% if tira.url == latest_tira.url %}
                {% assign current_index = forloop.index0 %}
                {% break %}
              {% endif %}
            {% endfor %}
            
            {% assign prev_index = current_index | minus: 1 %}
            {% assign next_index = current_index | plus: 1 %}
            
            {% if prev_index >= 0 %}
              {% assign prev_tira = sorted_tiras[prev_index] %}
              <a href="{{ prev_tira.url }}" class="btn">Anterior</a>
            {% endif %}
            
            {% if next_index < sorted_tiras.size %}
              {% assign next_tira = sorted_tiras[next_index] %}
              <a href="{{ next_tira.url }}" class="btn">Siguiente</a>
            {% endif %}
          </div>
        </article>
      {% else %}
        <div class="empty">No hay tiras aún. <a href="{{ '/tiras/' | relative_url }}">Ver archivo</a>.</div>
      {% endif %}
    </section>

    <section class="roller-section">
      <h3>Archivo — Roller</h3>
      <div id="roller" class="roller" tabindex="0" aria-label="Roller de tiras">
        {% assign recent_tiras = site.tiras | sort: 'date' | reverse | limit: 20 %}
        {% for tira in recent_tiras %}
          <div class="roller-item" data-date="{{ tira.date | date: '%Y-%m-%d' }}">
            <img src="{{ tira.image | relative_url }}" alt="{{ tira.title }}" loading="lazy">
            <div class="meta">{{ tira.date | date: '%Y-%m-%d' }}</div>
          </div>
        {% endfor %}
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-left">© {{ 'now' | date: "%Y" }} Paperboy — La Portería</div>
    <div class="footer-right" id="tags">
      <span>Periódico</span>
      <span>Tiras diarias</span>
      <span>Minimal</span>
      <span>Paperboy</span>
    </div>
  </footer>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Modal zoom functionality
      const tiraImage = document.querySelector('.tira-image-vertical');
      if (tiraImage) {
        tiraImage.addEventListener('click', () => {
          const imgSrc = tiraImage.querySelector('img').src;
          const modal = document.createElement('div');
          modal.className = 'zoom-modal';
          modal.innerHTML = `<img src="${imgSrc}" alt="Zoomed image">`;
          modal.addEventListener('click', () => {
            modal.classList.remove('visible');
            setTimeout(() => modal.remove(), 300);
          });
          document.body.appendChild(modal);
          setTimeout(() => modal.classList.add('visible'), 10);
        });
      }

      // Roller click functionality
      const rollerItems = document.querySelectorAll('.roller-item');
      rollerItems.forEach(item => {
        item.addEventListener('click', () => {
          const date = item.dataset.date;
          window.location.href = `/?date=${date}`;
        });
      });

      // Roller drag functionality
      const roller = document.getElementById('roller');
      if (roller) {
        let isDown = false, startX, scrollLeft;
        
        roller.addEventListener('pointerdown', (e) => {
          isDown = true;
          roller.setPointerCapture(e.pointerId);
          startX = e.clientX;
          scrollLeft = roller.scrollLeft;
          roller.classList.add('dragging');
        });
        
        roller.addEventListener('pointermove', (e) => {
          if (!isDown) return;
          const dx = e.clientX - startX;
          roller.scrollLeft = scrollLeft - dx;
        });
        
        ['pointerup','pointercancel','pointerleave'].forEach(ev => {
          roller.addEventListener(ev, (e) => {
            isDown = false;
            roller.classList.remove('dragging');
          });
        });
      }
    });
  </script>
</body>
</html>
