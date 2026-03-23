#!/bin/bash
set -e

# Create .env from .env.example if it doesn't exist
if [ ! -f /app/.env ]; then
    cp /app/.env.example /app/.env
    echo "Created .env from .env.example"
fi

# Generate APP_KEY if not set
if ! grep -q "^APP_KEY=base64:" /app/.env; then
    php /app/artisan key:generate --force 2>&1 || {
        # Fallback: generate key manually if artisan fails
        php -r 'echo "APP_KEY=base64:" . base64_encode(random_bytes(32)) . PHP_EOL;' >> /app/.env
    }
    echo "Generated APP_KEY"
fi

# Run package discovery (skipped during build with --no-scripts)
php /app/artisan package:discover --ansi 2>&1 || echo "Package discovery skipped"

# Create necessary directories
mkdir -p /app/storage/logs /app/storage/framework/cache/data /app/storage/framework/sessions /app/storage/framework/views /app/bootstrap/cache /app/public

# Set permissions
chmod -R 775 /app/storage /app/bootstrap/cache
chmod -R 755 /app/public

# Ensure Nginx sites-enabled has the config
mkdir -p /etc/nginx/sites-enabled
ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default || true

# Run database migrations if not already completed
if [ ! -f /app/.migrations-done ]; then
    echo "Running database migrations..."
    if php /app/artisan migrate --seed --force 2>&1; then
        touch /app/.migrations-done
        echo "✓ Database migrations completed successfully"
    else
        echo "✗ Database migrations failed"
    fi
else
    echo "Database migrations already completed (skipping)"
fi

echo "Starting application..."
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf
