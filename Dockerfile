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
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Configure nginx
COPY docker/nginx.conf /etc/nginx/sites-enabled/default

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Starting application..."\n\
echo "Current directory: $(pwd)"\n\
echo "Listing files in /var/www:"\n\
ls -la /var/www\n\
echo "Listing files in /var/www/public:"\n\
ls -la /var/www/public\n\
echo "Setting up environment..."\n\
php artisan storage:link\n\
php artisan config:clear\n\
php artisan cache:clear\n\
php artisan view:clear\n\
php artisan route:clear\n\
php artisan optimize:clear\n\
echo "Caching configuration..."\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
echo "Starting services..."\n\
service nginx start\n\
echo "Nginx started"\n\
php-fpm\n\
' > /var/www/start.sh \
    && chmod +x /var/www/start.sh

# Expose port
EXPOSE ${PORT:-80}

# Start services
CMD ["/var/www/start.sh"] 