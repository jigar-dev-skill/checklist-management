FROM php:8.1-fpm

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libpq-dev \
    mysql-client \
    && docker-php-ext-install pdo pdo_mysql

COPY composer.lock composer.json ./
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-scripts --no-autoloader

COPY . .

RUN composer dump-autoload --optimize
RUN chmod -R 755 storage bootstrap/cache

EXPOSE 8000

CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
