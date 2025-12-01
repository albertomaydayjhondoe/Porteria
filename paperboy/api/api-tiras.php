<?php
// api/api-tiras.php
header('Content-Type: application/json; charset=utf-8');

$dbFile = __DIR__ . '/../data/paperboy.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$action = $_GET['action'] ?? 'list';
$tag = $_GET['tag'] ?? null;

if ($action === 'list') {
    $page = max(1, (int)($_GET['page'] ?? 1));
    $per = max(10, (int)($_GET['per'] ?? 40));
    $offset = ($page - 1) * $per;

    if ($tag) {
        $stmt = $db->prepare("
            SELECT t.* FROM tiras t
            JOIN tira_tags tt ON t.id = tt.tira_id
            JOIN tags ta ON tt.tag_id = ta.id
            WHERE ta.name = :tag
            ORDER BY t.date DESC LIMIT :per OFFSET :offset
        ");
        $stmt->bindValue(':tag', $tag, PDO::PARAM_STR);
    } else {
        $stmt = $db->prepare("SELECT * FROM tiras ORDER BY date DESC LIMIT :per OFFSET :offset");
    }

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

    $base_query_next = "SELECT * FROM tiras WHERE date > :date";
    $base_query_prev = "SELECT * FROM tiras WHERE date < :date";

    if ($tag) {
        $base_query_next = "SELECT t.* FROM tiras t JOIN tira_tags tt ON t.id = tt.tira_id JOIN tags ta ON tt.tag_id = ta.id WHERE ta.name = :tag AND t.date > :date";
        $base_query_prev = "SELECT t.* FROM tiras t JOIN tira_tags tt ON t.id = tt.tira_id JOIN tags ta ON tt.tag_id = ta.id WHERE ta.name = :tag AND t.date < :date";
    }

    $stmt_next = $db->prepare("$base_query_next ORDER BY date ASC LIMIT 1");
    if ($tag) $stmt_next->bindValue(':tag', $tag, PDO::PARAM_STR);
    $stmt_next->execute([':date' => $date]);
    $next = $stmt_next->fetch(PDO::FETCH_ASSOC);

    $stmt_prev = $db->prepare("$base_query_prev ORDER BY date DESC LIMIT 1");
    if ($tag) $stmt_prev->bindValue(':tag', $tag, PDO::PARAM_STR);
    $stmt_prev->execute([':date' => $date]);
    $prev = $stmt_prev->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['ok' => true, 'next' => $next, 'prev' => $prev]);
    exit;
}

echo json_encode(['ok' => false, 'error' => 'invalid action']);
exit;
