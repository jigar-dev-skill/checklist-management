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

# Run database migrations if not already completed
if [ ! -f /app/.migrations-done ]; then
    echo "Running database migrations..."
    php /app/artisan migrate --seed --force 2>&1 && touch /app/.migrations-done || echo "Migrations failed or completed"
    echo "Database migrations status: done"
fi

echo "Starting application..."
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf
