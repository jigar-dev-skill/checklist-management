#!/bin/bash
set -e

# Create .env from .env.example if it doesn't exist
if [ ! -f /app/.env ]; then
    cp /app/.env.example /app/.env
    echo "Created .env from .env.example"
fi

# Ensure APP_KEY is set
if ! grep -q "^APP_KEY=" /app/.env; then
    php -r 'echo "APP_KEY=base64:" . base64_encode(random_bytes(32)) . PHP_EOL;' >> /app/.env
    echo "Generated APP_KEY"
fi

# Create public directory if it doesn't exist
mkdir -p /app/public

# Set permissions
chmod -R 755 /app/storage
chmod -R 755 /app/bootstrap/cache
chmod -R 755 /app/public

# Ensure Nginx sites-enabled has the config
mkdir -p /etc/nginx/sites-enabled
ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default || true

# Database migrations are run manually via Railway Shell
# To run migrations, execute: cd /app && php artisan migrate --seed --force
# This prevents startup failures due to file permissions and ensures proper sequencing

echo "Starting application..."
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf
