<?php
// Decap CMS GitHub OAuth proxy — step 2: exchange the code for a token and
// hand it back to the CMS window via postMessage (Netlify auth protocol).
declare(strict_types=1);

require __DIR__ . '/common.php';

function respond(string $status, array $payload): void
{
    $message = 'authorization:github:' . $status . ':' . json_encode($payload, JSON_UNESCAPED_SLASHES);
    $json = json_encode($message);

    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    echo <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Signing in…</title></head>
<body>
<p>Completing sign-in… you can close this window if it does not close automatically.</p>
<script>
(function () {
  var message = {$json};
  function receive(e) {
    window.removeEventListener('message', receive, false);
    window.opener.postMessage(message, e.origin);
    window.close();
  }
  if (!window.opener) {
    document.body.textContent = 'This page must be opened from the CMS login button.';
    return;
  }
  window.addEventListener('message', receive, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body>
</html>
HTML;
    exit;
}

$config = cms_oauth_config();

$code = $_GET['code'] ?? '';
$state = $_GET['state'] ?? '';
$expectedState = $_COOKIE['cms_oauth_state'] ?? '';
setcookie('cms_oauth_state', '', ['expires' => 1, 'path' => '/auth/', 'secure' => true, 'httponly' => true]);

if (isset($_GET['error'])) {
    respond('error', ['error' => $_GET['error_description'] ?? $_GET['error']]);
}
if ($code === '' || $state === '' || !hash_equals($expectedState, $state)) {
    respond('error', ['error' => 'Invalid OAuth state. Please try signing in again.']);
}

$ch = curl_init('https://github.com/login/oauth/access_token');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => ['Accept: application/json', 'User-Agent: alexandersam.me-cms'],
    CURLOPT_POSTFIELDS => http_build_query([
        'client_id' => $config['client_id'],
        'client_secret' => $config['client_secret'],
        'code' => $code,
        'redirect_uri' => cms_oauth_callback_url(),
        'state' => $state,
    ]),
]);
$body = curl_exec($ch);
$curlError = curl_error($ch);
curl_close($ch);

if ($body === false) {
    respond('error', ['error' => 'Could not reach GitHub: ' . $curlError]);
}

$data = json_decode((string) $body, true);
if (!is_array($data) || empty($data['access_token'])) {
    respond('error', ['error' => $data['error_description'] ?? 'GitHub did not return an access token.']);
}

respond('success', ['token' => $data['access_token'], 'provider' => 'github']);
