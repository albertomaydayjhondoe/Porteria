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

$db->exec("CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);");

$db->exec("CREATE TABLE IF NOT EXISTS tira_tags (
  tira_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (tira_id) REFERENCES tiras(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (tira_id, tag_id)
);");

// Sample tags
$sample_tags = ['diario', 'webcomic', 'humor', 'minimalista', 'tecnología'];
$stmt = $db->prepare("INSERT OR IGNORE INTO tags (name) VALUES (:name)");
foreach ($sample_tags as $tag) {
    $stmt->execute([':name' => $tag]);
}

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
            $tira_id = $db->lastInsertId();
            
            // Assign some random tags
            if ($tira_id) {
                $num_tags = rand(1, 3);
                shuffle($sample_tags);
                $tira_tags = array_slice($sample_tags, 0, $num_tags);
                
                $tag_stmt = $db->prepare("SELECT id FROM tags WHERE name = :name");
                $tira_tag_stmt = $db->prepare("INSERT OR IGNORE INTO tira_tags (tira_id, tag_id) VALUES (:tira_id, :tag_id)");

                foreach ($tira_tags as $tag_name) {
                    $tag_stmt->execute([':name' => $tag_name]);
                    $tag_row = $tag_stmt->fetch(PDO::FETCH_ASSOC);
                    if ($tag_row) {
                        $tira_tag_stmt->execute([':tira_id' => $tira_id, ':tag_id' => $tag_row['id']]);
                    }
                }
            }

            $count++;
        }
    }
}

echo "DB inicializada en: $dbFile\n";
echo "Archivos detectados: " . count($files) . "\n";
echo "Nuevas entradas añadidas: $count\n";
echo "OK.\n";
