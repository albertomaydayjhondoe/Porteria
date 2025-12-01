#!/usr/bin/env bash
set -e

ROOT="paperboy"
echo "Creando proyecto en ./$ROOT ..."

rm -rf "$ROOT"
mkdir -p "$ROOT"
cd "$ROOT"

# carpetas
mkdir -p api admin assets/css assets/js uploads/tiras data

# README.md
cat > README.md <<'MD'
# Paperboy — La Portería (Proyecto Fullstack)

Blog de tiras cómicas diarias con roller horizontal concatenado y tira del día vertical.
Proyecto ligero: PHP + SQLite + Vanilla JS.

## Requisitos
- PHP 7.4+
- Navegador moderno

## Instalación rápida
1. Ejecuta: `./setup_paperboy_local.sh` (crea estructura y DB de ejemplo).
2. Arranca el servidor: `php -S localhost:8000`
3. Abre: http://localhost:8000

## Notas
- API disponible en `/api/api-tiras.php`
- Feed RSS: `/api/rss.php`
- Subir tiras (demo): `/admin/upload.php`
MD

# init_db.php
cat > init_db.php <<'PHP'
<?php
// init_db.php
// Ejecutar desde la raíz del proyecto: php init_db.php

$dbFile = __DIR__ . '/data/paperboy.sqlite';
$uploadDir = __DIR__ . '/uploads/tiras';

if (!is_dir(dirname($dbFile))) mkdir(dirname($dbFile), 0755, true);
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$db->exec("CREATE TABLE IF NOT EXISTS tiras (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  date TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);");

// Scan uploads/tiras for files named YYYY-MM-DD.ext and insert if missing
$files = glob($uploadDir . '/*.{png,jpg,jpeg,gif,webp,svg}', GLOB_BRACE);
$count = 0;
foreach ($files as $file) {
    $base = basename($file);
    // try to parse date at start YYYY-MM-DD
    if (preg_match('/^(\d{4}-\d{2}-\d{2})/', $base, $m)) {
        $date = $m[1];
        // insert if not exists
        $stmt = $db->prepare("SELECT id FROM tiras WHERE date = :date");
        $stmt->execute([':date' => $date]);
        if (!$stmt->fetch()) {
            $insert = $db->prepare("INSERT INTO tiras (filename, date, title) VALUES (:filename, :date, :title)");
            $insert->execute([
                ':filename' => 'uploads/tiras/' . $base,
                ':date' => $date,
                ':title' => 'Tira ' . $date
            ]);
            $count++;
        }
    }
}

echo "DB inicializada en: $dbFile\n";
echo "Archivos detectados: " . count($files) . "\n";
echo "Nuevas entradas añadidas: $count\n";
echo "OK.\n";
PHP

# index.php
cat > index.php <<'PHP'
<?php
// index.php
$dbFile = __DIR__ . '/data/paperboy.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// comprobar si se pidió ?date=YYYY-MM-DD
$qdate = $_GET['date'] ?? null;
if ($qdate) {
    $stmt2 = $db->prepare("SELECT * FROM tiras WHERE date = :date");
    $stmt2->execute([':date' => $qdate]);
    $today = $stmt2->fetch(PDO::FETCH_ASSOC);
} else {
    $stmt = $db->query("SELECT * FROM tiras ORDER BY date DESC LIMIT 1");
    $today = $stmt->fetch(PDO::FETCH_ASSOC);
}
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Paperboy — La Portería</title>
  <link rel="stylesheet" href="assets/css/main.css">
</head>
<body class="theme-paperboy">
  <header class="site-header">
    <div class="brand">
      <h1>Paperboy</h1>
      <p class="subtitle">La Portería</p>
    </div>
    <nav class="main-nav">
      <a href="/">Inicio</a>
      <a href="/sitemap.html">Mapa</a>
      <a href="/api/rss.php">RSS</a>
      <a href="/admin/upload.php">Subir (demo)</a>
    </nav>
  </header>

  <main class="container">
    <section class="tira-dia">
      <?php if ($today): ?>
        <article class="tira-card">
          <header class="tira-meta">
            <h2><?php echo htmlspecialchars($today['title'] ?: 'Tira del día'); ?></h2>
            <time datetime="<?php echo $today['date']; ?>"><?php echo $today['date']; ?></time>
          </header>
          <div class="tira-image-vertical">
            <img src="<?php echo htmlspecialchars($today['filename']); ?>" alt="Tira del día" loading="eager">
          </div>
          <div class="tira-nav">
            <button id="prevBtn" class="btn">Anterior</button>
            <button id="nextBtn" class="btn">Siguiente</button>
          </div>
        </article>
      <?php else: ?>
        <div class="empty">No hay tiras aún. Añade imágenes a <code>uploads/tiras/</code> y ejecuta <code>php init_db.php</code>.</div>
      <?php endif; ?>
    </section>

    <section class="roller-section">
      <h3>Archivo — Roller</h3>
      <div id="roller" class="roller" tabindex="0" aria-label="Roller de tiras">
        <!-- JS cargará los items -->
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-left">© <?php echo date('Y'); ?> Paperboy — La Portería</div>
    <div class="footer-right" id="tags">
      <!-- etiquetas dinámicas -->
    </div>
  </footer>

<script>
const API_TIRAS = '/api/api-tiras.php';
const TODAY = <?php echo json_encode($today ?: null); ?>;
</script>
<script src="assets/js/daily-loader.js"></script>
<script src="assets/js/roller.js"></script>
</body>
</html>
PHP

# api/api-tiras.php
cat > api/api-tiras.php <<'PHP'
<?php
// api/api-tiras.php
header('Content-Type: application/json; charset=utf-8');

$dbFile = __DIR__ . '/../data/paperboy.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    $page = max(1, (int)($_GET['page'] ?? 1));
    $per = max(10, (int)($_GET['per'] ?? 40));
    $offset = ($page - 1) * $per;
    $stmt = $db->prepare("SELECT * FROM tiras ORDER BY date DESC LIMIT :per OFFSET :offset");
    $stmt->bindValue(':per', $per, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['ok' => true, 'data' => $rows]);
    exit;
}

if ($action === 'item') {
    $date = $_GET['date'] ?? null;
    if (!$date) { echo json_encode(['ok' => false, 'error' => 'missing date']); exit; }
    $stmt = $db->prepare("SELECT * FROM tiras WHERE date = :date");
    $stmt->execute([':date' => $date]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(['ok' => (bool)$row, 'data' => $row]);
    exit;
}

if ($action === 'nextprev') {
    $date = $_GET['date'] ?? null;
    if (!$date) { echo json_encode(['ok' => false, 'error' => 'missing date']); exit; }

    $stmt = $db->prepare("SELECT * FROM tiras WHERE date > :date ORDER BY date ASC LIMIT 1");
    $stmt->execute([':date' => $date]);
    $next = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt = $db->prepare("SELECT * FROM tiras WHERE date < :date ORDER BY date DESC LIMIT 1");
    $stmt->execute([':date' => $date]);
    $prev = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['ok' => true, 'next' => $next, 'prev' => $prev]);
    exit;
}

echo json_encode(['ok' => false, 'error' => 'invalid action']);
exit;
PHP

# api/rss.php
cat > api/rss.php <<'PHP'
<?php
// api/rss.php
header('Content-Type: application/rss+xml; charset=utf-8');

$dbFile = __DIR__ . '/../data/paperboy.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$items = $db->query("SELECT * FROM tiras ORDER BY date DESC LIMIT 50")->fetchAll(PDO::FETCH_ASSOC);

$siteUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'];

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<rss version="2.0">
  <channel>
    <title>Paperboy — La Portería</title>
    <link><?php echo htmlspecialchars($siteUrl); ?></link>
    <description>Tiras cómicas diarias</description>
    <language>es-ES</language>
    <?php foreach ($items as $it): ?>
      <item>
        <title><?php echo htmlspecialchars($it['title'] ?: 'Tira ' . $it['date']); ?></title>
        <link><?php echo htmlspecialchars($siteUrl . '/' . $it['filename']); ?></link>
        <guid><?php echo htmlspecialchars($siteUrl . '/' . $it['filename']); ?></guid>
        <pubDate><?php echo date(DATE_RSS, strtotime($it['date'])); ?></pubDate>
        <description><![CDATA[<img src="<?php echo htmlspecialchars($siteUrl . '/' . $it['filename']); ?>" style="max-width:100%;">]]></description>
      </item>
    <?php endforeach; ?>
  </channel>
</rss>
PHP

# admin/upload.php
cat > admin/upload.php <<'PHP'
<?php
// admin/upload.php
$uploadDir = __DIR__ . '/../uploads/tiras/';
$dbFile = __DIR__ . '/../data/paperboy.sqlite';

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['tira'])) {
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
    $f = $_FILES['tira'];
    if ($f['error'] === 0) {
        $fecha = $_POST['date'] ?? date('Y-m-d');
        $ext = pathinfo($f['name'], PATHINFO_EXTENSION);
        $filename = $fecha . '.' . $ext;
        $dest = $uploadDir . $filename;
        if (move_uploaded_file($f['tmp_name'], $dest)) {
            $db = new PDO('sqlite:' . $dbFile);
            $stmt = $db->prepare("INSERT OR IGNORE INTO tiras (filename, date, title) VALUES (:fn, :date, :title)");
            $stmt->execute([':fn' => 'uploads/tiras/' . $filename, ':date' => $fecha, ':title' => $_POST['title'] ?? 'Tira ' . $fecha]);
            $message = "Subida OK: $dest";
        } else {
            $message = "Error moviendo archivo.";
        }
    } else {
        $message = "Error en subida: " . $f['error'];
    }
}
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Subir tira — Paperboy</title>
  <style>body{font-family:Arial;padding:20px}label{display:block;margin:8px 0}</style>
</head>
<body>
  <h1>Subir tira (demo)</h1>
  <?php if ($message): ?><p><?php echo htmlspecialchars($message); ?></p><?php endif; ?>
  <form method="post" enctype="multipart/form-data">
    <label>Fecha <input type="date" name="date" value="<?php echo date('Y-m-d'); ?>"></label>
    <label>Título <input type="text" name="title"></label>
    <label>Archivo <input type="file" name="tira" accept="image/*" required></label>
    <button>Subir</button>
  </form>
  <p><a href="/">&larr; Volver</a></p>
</body>
</html>
PHP

# sitemap.html
cat > sitemap.html <<'HTML'
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Mapa web — Paperboy</title>
  <style>body{font-family:Arial;margin:30px}pre{background:#f4f4f4;padding:15px;border-left:4px solid #333}</style>
</head>
<body>
  <h1>Mapa web — Paperboy</h1>
  <pre>
HOME (Portada tipo periódico)
├─ Tira del día (vertical)
├─ Roller archivo (horizontal infinito)
├─ Navegación: Inicio | Mapa | RSS | Subir
ARCHIVO
└─ /archivo/ (lista cronológica / filtro por mes)
SOBRE MÍ
└─ /sobre-mi/ (texto y avatar)
CONTACTO
└─ /contacto/ (formulario)
PÁGINA TIRA
└─ /tira/YYYY-MM-DD (imagen grande, prev/next)
API
└─ /api/api-tiras.php?action=list|item|nextprev
RSS
└─ /api/rss.php
  </pre>
</body>
</html>
HTML

# assets/css/main.css
cat > assets/css/main.css <<'CSS'
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
.tira-card{background:#fff;padding:18px;border:1px solid #e6e6e6;border-radius:6px}
.tira-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.tira-meta h2{font-family: "Playfair Display", serif;margin:0;font-size:20px}
.tira-image-vertical{display:flex;justify-content:center}
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

/* Responsive */
@media (max-width:720px){
  .roller-item{width:140px}
  .brand h1{font-size:20px}
}
CSS

# assets/js/daily-loader.js
cat > assets/js/daily-loader.js <<'JS'
// assets/js/daily-loader.js
document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const today = window.TODAY;

  function setButtons(nextExists, prevExists) {
    if (!prevBtn || !nextBtn) return;
    prevBtn.disabled = !prevExists;
    nextBtn.disabled = !nextExists;
  }

  async function loadAdj(date, dir) {
    const resp = await fetch(`/api/api-tiras.php?action=nextprev&date=${encodeURIComponent(date)}`);
    const json = await resp.json();
    const sel = json[dir];
    if (!sel) return null;
    return sel;
  }

  async function navigateTo(item) {
    if (!item) return;
    document.querySelector('.tira-meta h2').textContent = item.title || ('Tira ' + item.date);
    document.querySelector('.tira-meta time').textContent = item.date;
    const img = document.querySelector('.tira-image-vertical img');
    img.src = item.filename;
    img.alt = item.title || ('Tira ' + item.date);
    const np = await (await fetch(`/api/api-tiras.php?action=nextprev&date=${encodeURIComponent(item.date)}`)).json();
    setButtons(!!np.next, !!np.prev);
    history.replaceState(null, '', '?date=' + item.date);
  }

  if (today) {
    (async () => {
      const np = await (await fetch(`/api/api-tiras.php?action=nextprev&date=${encodeURIComponent(today.date)}`)).json();
      setButtons(!!np.next, !!np.prev);
    })();
  } else {
    setButtons(false, false);
  }

  prevBtn && prevBtn.addEventListener('click', async () => {
    const baseDate = (window.TODAY && window.TODAY.date) || document.querySelector('.tira-meta time').textContent;
    const item = await loadAdj(baseDate, 'prev');
    if (item) {
      window.TODAY = item;
      await navigateTo(item);
    }
  });

  nextBtn && nextBtn.addEventListener('click', async () => {
    const baseDate = (window.TODAY && window.TODAY.date) || document.querySelector('.tira-meta time').textContent;
    const item = await loadAdj(baseDate, 'next');
    if (item) {
      window.TODAY = item;
      await navigateTo(item);
    }
  });

  const tags = ['Periódico', 'Tiras diarias', 'Minimal', 'Paperboy'];
  const container = document.getElementById('tags');
  if (container) {
    tags.forEach(t => {
      const s = document.createElement('span');
      s.textContent = t;
      container.appendChild(s);
    });
  }
});
JS

# assets/js/roller.js
cat > assets/js/roller.js <<'JS'
// assets/js/roller.js
document.addEventListener('DOMContentLoaded', async () => {
  const roller = document.getElementById('roller');
  if (!roller) return;

  let page = 1, per = 40, loading = false, end = false;

  async function fetchPage() {
    if (loading || end) return;
    loading = true;
    const resp = await fetch(`/api/api-tiras.php?action=list&page=${page}&per=${per}`);
    const json = await resp.json();
    if (!json.ok) { loading = false; return; }
    const items = json.data;
    if (!items || items.length === 0) { end = true; loading = false; return; }
    items.reverse().forEach(addItemToRoller);
    page++;
    loading = false;
  }

  function addItemToRoller(item) {
    const div = document.createElement('div');
    div.className = 'roller-item';
    div.dataset.date = item.date;
    div.innerHTML = `
      <img data-src="${item.filename}" alt="${escapeHtml(item.title || item.date)}" loading="lazy">
      <div class="meta">${item.date}</div>
    `;
    div.addEventListener('click', () => {
      window.location.href = '/?date=' + item.date;
    });
    roller.appendChild(div);
    lazyObserve(div.querySelector('img'));
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        const img = ent.target;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
        io.unobserve(img);
      }
    });
  }, {root: roller, rootMargin: '200px'});

  function lazyObserve(img) {
    io.observe(img);
  }

  roller.addEventListener('scroll', () => {
    if (roller.scrollWidth - (roller.scrollLeft + roller.clientWidth) < 500) {
      fetchPage();
    }
  });

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

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  await fetchPage();

  const params = new URLSearchParams(location.search);
  const qdate = params.get('date');
  if (qdate) {
    setTimeout(() => {
      const el = document.querySelector(`.roller-item[data-date="${qdate}"]`);
      if (el) {
        roller.scrollLeft = el.offsetLeft - (roller.clientWidth/2) + (el.clientWidth/2);
      }
    }, 600);
  }
});
JS

# create sample SVG tiras
cat > uploads/tiras/2025-12-01.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200">
  <rect width="100%" height="100%" fill="#fff"/>
  <text x="50" y="80" font-size="36" font-family="Arial" fill="#000">2025-12-01 — Paperboy</text>
  <rect x="40" y="120" width="720" height="180" fill="#f4f4f4" stroke="#222"/>
  <text x="60" y="210" font-size="24" font-family="Arial" fill="#222">Tira de muestra 1</text>
</svg>
SVG

cat > uploads/tiras/2025-12-02.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200">
  <rect width="100%" height="100%" fill="#fff"/>
  <text x="50" y="80" font-size="36" font-family="Arial" fill="#000">2025-12-02 — Paperboy</text>
  <rect x="40" y="120" width="720" height="180" fill="#f4f4f4" stroke="#222"/>
  <text x="60" y="210" font-size="24" font-family="Arial" fill="#222">Tira de muestra 2</text>
</svg>
SVG

cat > uploads/tiras/2025-12-03.svg <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1200">
  <rect width="100%" height="100%" fill="#fff"/>
  <text x="50" y="80" font-size="36" font-family="Arial" fill="#000">2025-12-03 — Paperboy</text>
  <rect x="40" y="120" width="720" height="180" fill="#f4f4f4" stroke="#222"/>
  <text x="60" y="210" font-size="24" font-family="Arial" fill="#222">Tira de muestra 3</text>
</svg>
SVG

# ejecutar init_db.php automáticamente
php init_db.php || true

echo
echo "Proyecto creado en ./paperboy"
echo
echo "Para arrancar localmente haz:"
echo "  cd paperboy"
echo "  php -S localhost:8000"
echo
echo "Abre en tu navegador: http://localhost:8000"
echo
echo "Nota: admin/upload.php es demo sin autenticación — no exponer en producción."
