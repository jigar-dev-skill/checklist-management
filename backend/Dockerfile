FROM php:8.1-fpm

WORKDIR /app

# Install system dependencies including Nginx
RUN apt-get update && apt-get install -y \
    libpq-dev \
    mariadb-client-compat \
    curl \
    git \
    unzip \
    libpng-dev \
    libjpeg-dev \
    zlib1g-dev \
    libzip-dev \
    nginx \
    supervisor \
    && docker-php-ext-install pdo pdo_mysql gd zip \
    && docker-php-ext-enable pdo pdo_mysql gd zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts

# Create necessary directories
RUN mkdir -p storage/logs bootstrap/cache public && chmod -R 775 storage bootstrap

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/sites-available/default

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 8080

# Start with entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
