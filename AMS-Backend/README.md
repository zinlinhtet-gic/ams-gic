### Docker Setup 

#### create .env file
> DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ams_db
DB_USERNAME=root
DB_PASSWORD=root`

#### Build And Start Docker Containers
`docker compose up -d --build`
or
`docker compose build `
`docker compose up -d`

Enter container
`docker compose exec app bash`

Run Composer
`composer install` or
`composer update`

Laravel key generate
`key:generate`

Database Migration
`php artisan migrate`

### Start Docker Container
`docker compose up -d`

### Stop Docker Container
`docker compose down`

### Set Laravel permissions (if required)
`docker compose exec app sh`

Then inside app:
`chmod -R 775 storage`
`chmod -R 775 bootstrap/cache`
