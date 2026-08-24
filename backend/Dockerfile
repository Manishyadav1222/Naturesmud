# ── Nature's Mud — Laravel Backend Dockerfile ──────────────────

FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    nginx \
    supervisor \
    libzip-dev \
    zlib-dev \
    icu-dev \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    oniguruma-dev \
    $PHPIZE_DEPS \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install \
    pdo_mysql \
    mysqli \
    zip \
    intl \
    gd \
    bcmath \
    opcache \
    exif \
    pcntl \
   && pecl install redis \
   && docker-php-ext-enable redis \
   && rm -rf /var/cache/apk/*

# Tuned OPcache — critical for Windows Docker bind-mount performance
# (disables timestamp validation so FPM doesn't re-stat every vendor file)
COPY deploy/opcache.ini /usr/local/etc/php/conf.d/zz-opcache.ini

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction || composer install --no-interaction

# Permissions
RUN chown -R www-data:www-data /var/www/html \
  && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Nginx + PHP-FPM supervisor config
COPY deploy/supervisord.conf /etc/supervisord.conf
COPY deploy/nginx-backend.conf /etc/nginx/http.d/default.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]