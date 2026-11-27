# Lumi Beauty Ecommerce API Contract

Base path: `/api/v1`. Requests and responses use JSON unless an endpoint
returns a file. Authenticated requests use
`Authorization: Bearer <token>`. Login and registration return a JWT and the
account's role (`ADMIN` or `CUSTOMER`).

## Authentication

| Method | Path | Access | Request | Response |
|---|---|---|---|---|
| POST | `/auth/register` | Public | `{ "username": "buyer1", "email": "buyer@example.com", "password": "secret1" }` | `201` with `{ "token", "type", "id", "username", "email", "role" }`; role is `CUSTOMER` |
| POST | `/auth/login` | Public | `{ "username": "buyer1", "password": "secret1" }` | `200` with `{ "token", "type", "id", "username", "email", "role" }` |

Registration requires a username (4–50 characters), valid email, and password
of at least 6 characters. Admin accounts must be provisioned by an
administrator and cannot be self-registered.

## Catalogue

| Method | Path | Access | Request | Response |
|---|---|---|---|---|
| GET | `/products?keyword=&categoryId=&page=0&size=12` | Public | Optional search/filter/pagination query | Spring `Page` with `content` of product DTOs and page metadata |
| GET | `/products/{id}` | Public | — | Product DTO: `id`, `name`, `description`, `imageUrl`, `price`, `quantity`, `categoryId`, `categoryName` |
| GET | `/categories` | Public | — | Array of category DTOs |

## Customer cart and orders

All routes in this section require a `CUSTOMER` JWT and are scoped to that user.

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/cart` | — | Array of cart item DTOs |
| POST | `/cart` | `{ "productId": 1, "quantity": 2 }` | Cart item DTO |
| PUT | `/cart/{itemId}` | `{ "quantity": 3 }` | Updated cart item DTO |
| DELETE | `/cart/{itemId}` | — | `204` |
| POST | `/orders` | `{ "receiverName": "Buyer", "phoneNumber": "0900000000", "shippingAddress": "Address" }` | `201` order DTO; checks out the current cart |
| GET | `/orders` | — | Array of the current customer's orders |
| GET | `/orders/{id}` | — | Order DTO, only if owned by the current customer |
| PUT | `/orders/{id}/cancel` | — | Updated order DTO when cancellation is allowed |

Order DTOs contain `id`, `totalPrice`, `status`, shipping details,
`createdDate`, and `orderDetails`. Status values are `PENDING`, `CONFIRMED`,
`SHIPPING`, `DELIVERED`, and `CANCELLED`.

## Admin catalogue and orders

All routes in this section require an `ADMIN` JWT.

| Method | Path | Request | Response |
|---|---|---|---|
| POST | `/admin/products` | `{ "name": "Product", "description": "...", "imageUrl": "...", "price": 100, "quantity": 5, "categoryId": 1 }` | `201` product DTO |
| PUT | `/admin/products/{id}` | Product fields as above | Updated product DTO |
| DELETE | `/admin/products/{id}` | — | `204` |
| POST | `/admin/categories` | `{ "name": "Category" }` | `201` category DTO |
| DELETE | `/admin/categories/{id}` | — | `204` |
| GET | `/admin/orders` | — | Array of all order DTOs |
| PUT | `/admin/orders/{id}/status` | `{ "status": "CONFIRMED" }` | Updated order DTO |
| POST | `/admin/upload` | Multipart form field `file` | `{ "url": "/uploads/..." }` |

Uploaded images are served under `/uploads/`.

## Authorization and errors

Product and category reads are public. Cart, checkout, and customer order
endpoints require the owning customer's account. Product/category/order
management and image uploads require Admin privileges. Unauthenticated requests
return `401`; an authenticated account with the wrong role receives `403`.
Invalid input returns a client error with the backend's validation message.
