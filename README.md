# Lumi Beauty — Cửa hàng mỹ phẩm

Lumi Beauty is a standalone cosmetics shop with a React/Vite storefront and a
Spring Boot REST API. Customers can browse skincare, makeup, sunscreen, and hair
care products, manage their cart, and place or view orders. Administrators use
a separate login to manage the product catalogue, categories, and orders.

## Run locally with Docker

Requires Docker Compose v2. Copy `.env.example` to `.env`, then run in
PowerShell from the project root:

```powershell
Copy-Item .env.example .env
docker compose up -d --build
```

Open `http://localhost:8088`. The initial local database is seeded with beauty
products and these demo accounts:

- Admin: `admin` / `admin123`
- Customer: `customer` / `customer123`

These are demo credentials only. Do not expose a deployment using these
credentials; change/remove demo seeding and use unique secrets before
deployment. Customer self-registration is available at `/register`.

To stop containers without deleting the database or uploaded product images:

```powershell
docker compose down
```

Do not use `docker compose down -v` unless you intentionally want to delete
the shop database and uploaded product images. The shop uses its own
`webbanhang_data` volume.

## Run services separately

### Backend

Requires JDK 21+ and MySQL 8. The default local datasource is
`jdbc:mysql://localhost:3306/webbanhang`; override `DB_URL`, `DB_USERNAME`,
`DB_PASSWORD`, and `JWT_SECRET` as needed.

```powershell
Set-Location backend
.\gradlew.bat bootRun
```

The API listens on `http://localhost:8080`. Hibernate updates the local schema
on startup and `DataSeeder` inserts demo data into an empty database.

### Product image storage

Without Cloudinary credentials, uploaded images are stored in the persistent
`product_uploads` volume. To store them in Cloudinary, create an account and set
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in
`.env`, then rebuild the backend with `docker compose up -d --build backend`.
The Admin product form can upload an image and saves Cloudinary's secure URL
with the product. Keep the API secret private and never put it in frontend
configuration or source control. Uploaded files are limited to 5 MB.

### Frontend

Requires Node.js 20+:

```powershell
Set-Location frontend
npm ci
npm run dev
```

Vite runs on `http://localhost:5173` and the local `.env` directs API calls to
the backend at port 8080. Docker builds the frontend with a same-origin `/api/v1`
base URL and Nginx proxies API and uploaded-image requests to the backend.

## Test and build

```powershell
Set-Location backend
.\gradlew.bat clean test

Set-Location ..\frontend
npm test
npm run build
```

Check the Compose configuration with `docker compose config --quiet`.

## Main routes

- `/` — public product catalogue and search
- `/products/:id` — product detail
- `/login` and `/register` — customer account access
- `/admin/login` — separate Admin sign-in
- `/admin/products` and `/admin/orders` — Admin product/category/order management
- `/cart`, `/checkout`, `/orders` — customer-only shopping and order flows

The API contract is in [API_CONTRACT.md](./API_CONTRACT.md); an importable
Postman collection is in [Ecommerce_Postman_Collection.json](./Ecommerce_Postman_Collection.json).
