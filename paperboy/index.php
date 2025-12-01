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
