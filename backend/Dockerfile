FROM php:8.1-fpm

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    mariadb-client-compat \
    curl \
    git \
    unzip \
    && docker-php-ext-install pdo pdo_mysql \
    && docker-php-ext-enable pdo pdo_mysql

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --no-interaction --prefer-dist

# Generate application key
RUN php artisan key:generate --env=production

# Expose port
EXPOSE 8080

# Start PHP server
CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]
