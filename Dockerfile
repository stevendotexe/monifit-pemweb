FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx \
    gnupg

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader
RUN npm install
RUN npm run build

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Configure nginx
COPY docker/nginx.conf /etc/nginx/sites-enabled/default

# Create startup script
RUN echo '#!/bin/bash\n\
envsubst "\$PORT" < /etc/nginx/sites-enabled/default > /etc/nginx/sites-enabled/default.tmp\n\
mv /etc/nginx/sites-enabled/default.tmp /etc/nginx/sites-enabled/default\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
service nginx start\n\
php-fpm' > /var/www/start.sh \
    && chmod +x /var/www/start.sh

# Expose port
EXPOSE ${PORT:-80}

# Start services
CMD ["/var/www/start.sh"] 