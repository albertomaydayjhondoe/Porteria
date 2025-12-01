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
