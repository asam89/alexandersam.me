<?php
// Decap CMS GitHub OAuth proxy — step 1: redirect the CMS popup to GitHub.
declare(strict_types=1);

require __DIR__ . '/common.php';

$config = cms_oauth_config();

$state = bin2hex(random_bytes(16));
setcookie('cms_oauth_state', $state, [
    'expires' => time() + 600,
    'path' => '/auth/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax',
]);

$params = [
    'client_id' => $config['client_id'],
    'redirect_uri' => cms_oauth_callback_url(),
    'scope' => 'repo,user',
    'state' => $state,
];

header('Location: https://github.com/login/oauth/authorize?' . http_build_query($params), true, 302);
exit;
