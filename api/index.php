<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($uri, PHP_URL_PATH) ?: '/';

// Support both /api/... and direct php built-in server routing
$path = preg_replace('#^/api#', '', $path) ?: '/';
$path = rtrim($path, '/') ?: '/';

try {
    route($method, $path);
} catch (Throwable $e) {
    json_error('خطأ في الخادم: ' . $e->getMessage(), 500);
}

function route(string $method, string $path): never
{
    if ($method === 'GET' && $path === '/health') {
        db();
        json_out(['ok' => true, 'db' => is_file(DB_PATH)]);
    }

    if ($method === 'POST' && $path === '/login') {
        handle_login();
    }

    if ($method === 'POST' && $path === '/logout') {
        handle_logout();
    }

    if ($method === 'GET' && $path === '/me') {
        $user = current_user();
        json_out(['ok' => true, 'user' => public_user($user)]);
    }

    if ($method === 'GET' && $path === '/settings') {
        json_out(['ok' => true, 'settings' => settings_response_value(get_settings_data())]);
    }

    if ($method === 'PUT' && $path === '/settings') {
        current_user();
        $body = read_json_body();
        $settings = $body['settings'] ?? $body;
        if (!is_array($settings) || array_is_list($settings)) {
            json_error('الإعدادات غير صالحة');
        }
        save_settings_data($settings);
        json_out(['ok' => true, 'settings' => settings_response_value(get_settings_data())]);
    }

    if ($method === 'POST' && $path === '/settings/reset') {
        current_user(true);
        $defaultsPath = __DIR__ . '/defaults.json';
        $defaults = is_file($defaultsPath) ? file_get_contents($defaultsPath) : '{}';
        $decoded = json_decode((string) $defaults, true);
        if (!is_array($decoded) || array_is_list($decoded)) {
            $decoded = [];
        }
        save_settings_data($decoded);
        json_out(['ok' => true, 'settings' => settings_response_value(get_settings_data())]);
    }

    if ($method === 'GET' && $path === '/users') {
        current_user(true);
        json_out(['ok' => true, 'users' => list_users()]);
    }

    if ($method === 'POST' && $path === '/users') {
        handle_create_user();
    }

    if ($method === 'PUT' && preg_match('#^/users/([^/]+)$#', $path, $m)) {
        handle_update_user($m[1]);
    }

    if ($method === 'DELETE' && preg_match('#^/users/([^/]+)$#', $path, $m)) {
        handle_delete_user($m[1]);
    }

    json_error('المسار غير موجود', 404);
}

function handle_login(): never
{
    $body = read_json_body();
    $username = normalize_username((string) ($body['username'] ?? ''));
    $password = (string) ($body['password'] ?? '');

    if ($username === '' || $password === '') {
        json_error('أدخل اسم المستخدم وكلمة المرور');
    }

    $stmt = db()->prepare('SELECT * FROM users WHERE username = :username COLLATE NOCASE LIMIT 1');
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch();

    if (!$user || !(int) $user['active'] || !password_verify($password, $user['password_hash'])) {
        json_error('اسم المستخدم أو كلمة المرور غير صحيحة', 401);
    }

    $token = create_session($user['id']);
    json_out([
        'ok' => true,
        'token' => $token,
        'user' => public_user($user),
    ]);
}

function handle_logout(): never
{
    $token = bearer_token();
    if ($token) {
        $stmt = db()->prepare('DELETE FROM sessions WHERE token = :token');
        $stmt->execute([':token' => $token]);
    }
    json_out(['ok' => true]);
}

function handle_create_user(): never
{
    current_user(true);
    $body = read_json_body();
    $username = normalize_username((string) ($body['username'] ?? ''));
    $name = trim((string) ($body['name'] ?? ''));
    $role = (string) ($body['role'] ?? 'editor');
    $password = (string) ($body['password'] ?? '');

    if (strlen($username) < 3) {
        json_error('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
    }
    if (!preg_match('/^[a-z0-9._-]+$/', $username)) {
        json_error('اسم المستخدم يقبل حروف إنجليزية وأرقام و . _ - فقط');
    }
    if (strlen($password) < 6) {
        json_error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    }
    if (!in_array($role, ['admin', 'editor'], true)) {
        json_error('الدور غير صالح');
    }

    $exists = db()->prepare('SELECT id FROM users WHERE username = :username COLLATE NOCASE');
    $exists->execute([':username' => $username]);
    if ($exists->fetch()) {
        json_error('اسم المستخدم مستخدم بالفعل');
    }

    $id = uid();
    $stmt = db()->prepare(
        'INSERT INTO users (id, username, name, role, password_hash, active, created_at)
         VALUES (:id, :username, :name, :role, :password_hash, 1, :created_at)'
    );
    $stmt->execute([
        ':id' => $id,
        ':username' => $username,
        ':name' => $name !== '' ? $name : $username,
        ':role' => $role,
        ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
        ':created_at' => gmdate('c'),
    ]);

    $row = db()->prepare('SELECT * FROM users WHERE id = :id');
    $row->execute([':id' => $id]);
    json_out(['ok' => true, 'user' => public_user($row->fetch())], 201);
}

function handle_update_user(string $id): never
{
    $me = current_user(true);
    $body = read_json_body();

    $stmt = db()->prepare('SELECT * FROM users WHERE id = :id');
    $stmt->execute([':id' => $id]);
    $target = $stmt->fetch();
    if (!$target) {
        json_error('المستخدم غير موجود', 404);
    }

    $username = array_key_exists('username', $body)
        ? normalize_username((string) $body['username'])
        : $target['username'];
    $name = array_key_exists('name', $body)
        ? trim((string) $body['name'])
        : $target['name'];
    $role = array_key_exists('role', $body)
        ? (string) $body['role']
        : $target['role'];
    $active = array_key_exists('active', $body)
        ? (!empty($body['active']) ? 1 : 0)
        : (int) $target['active'];
    $password = (string) ($body['password'] ?? '');

    if (strlen($username) < 3) {
        json_error('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
    }
    if (!preg_match('/^[a-z0-9._-]+$/', $username)) {
        json_error('اسم المستخدم يقبل حروف إنجليزية وأرقام و . _ - فقط');
    }
    if (!in_array($role, ['admin', 'editor'], true)) {
        json_error('الدور غير صالح');
    }
    if ($password !== '' && strlen($password) < 6) {
        json_error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    }

    $dup = db()->prepare('SELECT id FROM users WHERE username = :username COLLATE NOCASE AND id != :id');
    $dup->execute([':username' => $username, ':id' => $id]);
    if ($dup->fetch()) {
        json_error('اسم المستخدم مستخدم بالفعل');
    }

    // Keep at least one active admin
    if ($target['role'] === 'admin' && ($role !== 'admin' || $active === 0)) {
        $others = db()->prepare(
            "SELECT COUNT(*) FROM users WHERE id != :id AND active = 1 AND role = 'admin'"
        );
        $others->execute([':id' => $id]);
        if ((int) $others->fetchColumn() === 0) {
            json_error('يجب الإبقاء على مدير نشط واحد على الأقل');
        }
    }

    $hash = $password !== ''
        ? password_hash($password, PASSWORD_DEFAULT)
        : $target['password_hash'];

    $upd = db()->prepare(
        'UPDATE users SET username = :username, name = :name, role = :role,
         password_hash = :password_hash, active = :active WHERE id = :id'
    );
    $upd->execute([
        ':username' => $username,
        ':name' => $name !== '' ? $name : $username,
        ':role' => $role,
        ':password_hash' => $hash,
        ':active' => $active,
        ':id' => $id,
    ]);

    // If disabling self somehow blocked above; if password changed for self, sessions stay valid (ok)

    $row = db()->prepare('SELECT * FROM users WHERE id = :id');
    $row->execute([':id' => $id]);
    json_out(['ok' => true, 'user' => public_user($row->fetch()), 'me' => public_user($me)]);
}

function handle_delete_user(string $id): never
{
    $me = current_user(true);

    $stmt = db()->prepare('SELECT * FROM users WHERE id = :id');
    $stmt->execute([':id' => $id]);
    $target = $stmt->fetch();
    if (!$target) {
        json_error('المستخدم غير موجود', 404);
    }
    if ($me['id'] === $id) {
        json_error('لا يمكن حذف حسابك الحالي أثناء الجلسة');
    }
    if ($target['role'] === 'admin') {
        $others = db()->prepare(
            "SELECT COUNT(*) FROM users WHERE id != :id AND active = 1 AND role = 'admin'"
        );
        $others->execute([':id' => $id]);
        if ((int) $others->fetchColumn() === 0) {
            json_error('لا يمكن حذف آخر مدير');
        }
    }

    $del = db()->prepare('DELETE FROM users WHERE id = :id');
    $del->execute([':id' => $id]);
    json_out(['ok' => true]);
}
