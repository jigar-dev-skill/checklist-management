FROM php:8.1-fpm

WORKDIR /app

# Install system dependencies
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
    && docker-php-ext-install pdo pdo_mysql gd zip \
    && docker-php-ext-enable pdo pdo_mysql gd zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy application files
COPY . .

# Install PHP dependencies (skip scripts to avoid artisan not found error)
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts

# Generate application key
RUN php artisan key:generate --env=production

# Now run composer scripts
RUN composer run-script post-autoload-dump

# Expose port
EXPOSE 8080

# Start PHP server
CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]
