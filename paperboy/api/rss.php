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
