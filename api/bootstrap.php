<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
];
if ($origin && in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

const DB_DIR = __DIR__ . '/data';
const DB_PATH = DB_DIR . '/mandoob.sqlite';
const SESSION_DAYS = 30;
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

function json_out(mixed $data, int $code = 200): never
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error(string $message, int $code = 400): never
{
    json_out(['ok' => false, 'error' => $message], $code);
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_error('جسم الطلب غير صالح', 400);
    }
    return $data;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    if (!is_dir(DB_DIR)) {
        mkdir(DB_DIR, 0755, true);
    }

    $pdo = new PDO('sqlite:' . DB_PATH, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec('PRAGMA foreign_keys = ON');
    migrate($pdo);
    return $pdo;
}

function migrate(PDO $pdo): void
{
    $pdo->exec(<<<SQL
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL UNIQUE COLLATE NOCASE,
            name TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('admin','editor')),
            password_hash TEXT NOT NULL,
            active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY CHECK(id = 1),
            data TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
    SQL);

    $count = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    if ($count === 0) {
        $stmt = $pdo->prepare(
            'INSERT INTO users (id, username, name, role, password_hash, active, created_at)
             VALUES (:id, :username, :name, :role, :password_hash, 1, :created_at)'
        );
        $stmt->execute([
            ':id' => uid(),
            ':username' => DEFAULT_USERNAME,
            ':name' => 'المدير',
            ':role' => 'admin',
            ':password_hash' => password_hash(DEFAULT_PASSWORD, PASSWORD_DEFAULT),
            ':created_at' => gmdate('c'),
        ]);
    }

    $settingsCount = (int) $pdo->query('SELECT COUNT(*) FROM settings')->fetchColumn();
    if ($settingsCount === 0) {
        $defaultsPath = __DIR__ . '/defaults.json';
        $defaults = is_file($defaultsPath)
            ? file_get_contents($defaultsPath)
            : '{}';
        $stmt = $pdo->prepare('INSERT INTO settings (id, data, updated_at) VALUES (1, :data, :updated_at)');
        $stmt->execute([
            ':data' => $defaults,
            ':updated_at' => gmdate('c'),
        ]);
    }
}

function uid(): string
{
    return 'u_' . bin2hex(random_bytes(8));
}

function normalize_username(string $v): string
{
    return strtolower(trim($v));
}

function bearer_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Bearer\s+(\S+)$/i', $header, $m)) {
        return $m[1];
    }
    return null;
}

function public_user(array $row): array
{
    return [
        'id' => $row['id'],
        'username' => $row['username'],
        'name' => $row['name'],
        'role' => $row['role'],
        'active' => (bool) (int) $row['active'],
        'createdAt' => $row['created_at'],
    ];
}

function current_user(?bool $requireAdmin = false): array
{
    $token = bearer_token();
    if (!$token) {
        json_error('يجب تسجيل الدخول', 401);
    }

    $pdo = db();
    $pdo->prepare('DELETE FROM sessions WHERE expires_at < :now')->execute([':now' => gmdate('c')]);

    $stmt = $pdo->prepare(
        'SELECT u.* FROM sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.token = :token AND s.expires_at >= :now AND u.active = 1
         LIMIT 1'
    );
    $stmt->execute([':token' => $token, ':now' => gmdate('c')]);
    $user = $stmt->fetch();
    if (!$user) {
        json_error('الجلسة غير صالحة أو منتهية', 401);
    }
    if ($requireAdmin && $user['role'] !== 'admin') {
        json_error('صلاحيات المدير مطلوبة', 403);
    }
    return $user;
}

function create_session(string $userId): string
{
    $token = bin2hex(random_bytes(32));
    $expires = (new DateTimeImmutable('now', new DateTimeZone('UTC')))
        ->modify('+' . SESSION_DAYS . ' days')
        ->format('c');
    $stmt = db()->prepare(
        'INSERT INTO sessions (token, user_id, expires_at, created_at)
         VALUES (:token, :user_id, :expires_at, :created_at)'
    );
    $stmt->execute([
        ':token' => $token,
        ':user_id' => $userId,
        ':expires_at' => $expires,
        ':created_at' => gmdate('c'),
    ]);
    return $token;
}

/** @return array<string, mixed> */
function get_settings_data(): array
{
    $row = db()->query('SELECT data FROM settings WHERE id = 1')->fetch();
    if (!$row) {
        return [];
    }
    $data = json_decode((string) $row['data'], true);
    if (!is_array($data) || array_is_list($data)) {
        return [];
    }
    return $data;
}

function settings_response_value(array $data): object|array
{
    // Empty assoc array must encode as {} not []
    return $data === [] ? new stdClass() : $data;
}

function save_settings_data(array $data): void
{
    unset($data['admin']);
    $json = $data === []
        ? '{}'
        : json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $stmt = db()->prepare('UPDATE settings SET data = :data, updated_at = :updated_at WHERE id = 1');
    $stmt->execute([
        ':data' => $json,
        ':updated_at' => gmdate('c'),
    ]);
}

function list_users(): array
{
    $rows = db()->query('SELECT * FROM users ORDER BY created_at ASC')->fetchAll();
    return array_map('public_user', $rows);
}
