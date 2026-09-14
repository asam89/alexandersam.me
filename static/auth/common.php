<?php
declare(strict_types=1);

/**
 * Loads the GitHub OAuth App credentials.
 *
 * `config.php` is not committed; the deploy workflow writes it from repository
 * secrets (GH_OAUTH_CLIENT_ID / GH_OAUTH_CLIENT_SECRET). Environment variables
 * are honoured as a fallback for local testing.
 *
 * @return array{client_id: string, client_secret: string}
 */
function cms_oauth_config(): array
{
    $file = __DIR__ . '/config.php';
    $config = is_file($file) ? require $file : [];

    $clientId = $config['client_id'] ?? getenv('GH_OAUTH_CLIENT_ID') ?: '';
    $clientSecret = $config['client_secret'] ?? getenv('GH_OAUTH_CLIENT_SECRET') ?: '';

    if ($clientId === '' || $clientSecret === '') {
        http_response_code(500);
        header('Content-Type: text/plain; charset=utf-8');
        echo "CMS OAuth is not configured on this server.\n";
        exit;
    }

    return ['client_id' => $clientId, 'client_secret' => $clientSecret];
}

function cms_oauth_callback_url(): string
{
    $host = $_SERVER['HTTP_HOST'] ?? 'alexandersam.me';
    return 'https://' . $host . '/auth/callback.php';
}
