# Lumi Beauty

Lumi Beauty is a cosmetics e-commerce application with a React storefront and
a Spring Boot REST API. Customers can browse products, manage a shopping cart,
and place and review orders. Administrators can manage the product catalogue,
categories, and orders.

## Features

- Product catalogue with search and category filters
- Customer registration, authentication, cart, and order history
- Role-protected administration for products and orders
- Product image uploads with local storage or optional Cloudinary integration
- Responsive storefront with product details and interactive image effects

## Technology

- **Frontend:** React, Vite, JavaScript
- **Backend:** Java 21, Spring Boot, Spring Security, Spring Data JPA
- **Database:** MySQL 8
- **Deployment:** Docker Compose and Nginx

## Local development with Docker

Requirements: Docker Desktop with Docker Compose v2.

From the project root, copy the example environment file and start the
services:

```powershell
Copy-Item .env.example .env
docker compose up -d --build
```

Open the storefront at [http://localhost:8088](http://localhost:8088). The
application creates sample cosmetics catalogue data when the database is
empty. Customer registration is available at `/register`.

The development seeder also provisions local sample accounts. Their
credentials are intentionally not documented here. This seeding behavior is
for local development only and must be disabled or replaced with a secure
administrator provisioning process before any public deployment.

To stop the services while retaining the database and uploaded images:

```powershell
docker compose down
```

Avoid `docker compose down -v` unless you intend to permanently delete the
database and uploaded images.

## Configuration

The `.env.example` file lists supported environment variables. Copy it to
`.env` for local use and replace development values before deploying:

- `DB_PASSWORD` and `MYSQL_ROOT_PASSWORD` — database credentials
- `JWT_SECRET` — a strong, unique signing secret
- `CORS_ALLOWED_ORIGINS` — allowed frontend origins
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
  `CLOUDINARY_API_SECRET` — optional Cloudinary image storage settings

Never commit `.env` or expose credentials in frontend configuration. Without
Cloudinary credentials, uploaded images are stored in the persistent
`product_uploads` volume. Product image uploads are limited to 5 MB.

## Run services separately

### Backend

Requirements: JDK 21+ and MySQL 8. Configure `DB_URL`, `DB_USERNAME`,
`DB_PASSWORD`, and `JWT_SECRET` as environment variables, then run:

```powershell
Set-Location backend
.\gradlew.bat bootRun
```

The API listens on `http://localhost:8080`. Hibernate updates the local schema
on startup; `DataSeeder` inserts sample data when the database is empty.

### Frontend

Requirements: Node.js 20+.

```powershell
Set-Location frontend
npm ci
npm run dev
```

Vite runs on `http://localhost:5173` and proxies API requests to the local
backend at port 8080.

## Tests and build

```powershell
Set-Location backend
.\gradlew.bat clean test

Set-Location ..\frontend
npm ci
npm test
npm run build
```

Validate the Docker Compose configuration from the project root:

```powershell
docker compose config --quiet
```

## Production deployment checklist

- Do not deploy the local demo seeder or its sample administrator account.
- Provision administrator access through a secure, deployment-specific process.
- Use unique database and JWT secrets; store secrets in the hosting provider's
  secret manager, not in source control.
- Configure HTTPS, CORS, database backups, and persistent image storage.
- Remove or rotate any development credentials that may already exist in a
  deployed database.

## Application routes

- `/` — product catalogue
- `/products/:id` — product details
- `/login` and `/register` — customer account access
- `/admin/login` — administrator sign-in
- `/admin/products` and `/admin/orders` — administration
- `/cart`, `/checkout`, and `/orders` — customer shopping and order history

See [API_CONTRACT.md](./API_CONTRACT.md) for the API specification and
[Ecommerce_Postman_Collection.json](./Ecommerce_Postman_Collection.json) for
the Postman collection.
