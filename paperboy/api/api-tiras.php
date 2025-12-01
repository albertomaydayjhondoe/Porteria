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
