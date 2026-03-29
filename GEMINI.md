# GEMINI.md

# Project Overview

This project is a **minimalistic multi-vendor ecommerce backend** built with **Django and Django Rest Framework**.

The platform supports:

* Customers browsing and purchasing products
* Vendors creating stores and selling products
* Admin managing vendors, products, and orders

The goal is **clean, understandable backend code**, not enterprise complexity.

---

# Tech Stack

Backend:

* Django
* Django Rest Framework
* PostgreSQL
* JWT Authentication
* Paystack payments

Architecture principles:

* Function Based Views
* Explicit logic
* Minimal abstraction
* Predictable APIs

---

# Critical Rule: Incremental Development

Do **not** generate the entire backend at once.

This project must be implemented **step-by-step**.

When responding to prompts:

* Only implement the **specific feature requested**
* Do not build unrelated modules
* Do not anticipate future features
* Do not generate the full system in one response

Always assume the developer is building the system **progressively**.

---

# Feature Implementation Order

Unless instructed otherwise, implement features in this order:

1. Project setup and app structure
2. Authentication
3. Vendor system
4. Categories
5. Products
6. Cart
7. Orders
8. Payments
9. Reviews

Only work on **one section at a time**.

---

# Prompt Execution Rules

When implementing a feature:

* Only modify files relevant to the requested feature
* Do not create extra endpoints
* Do not implement future modules
* Do not refactor the entire project
* Do not change architecture decisions

Focus strictly on the **current task**.

---

# Backend Coding Rules

## Views

Always use **Function Based Views**.

Example:

```python
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_product(request):
```

Avoid class-based views unless explicitly requested.

---

## Request Data Access

Always use:

```python
request.data.get("field_name")
```

Example:

```python
name = request.data.get("name")
price = request.data.get("price")
```

Never assume fields exist.

---

## Responses

Always return DRF `Response`.

Example:

```python
return Response(
    {"message": "Product created successfully"},
    status=status.HTTP_201_CREATED
)
```

---

## Error Handling

Validate required fields early.

Example:

```python
if not name or not price:
    return Response(
        {"error": "name and price are required"},
        status=status.HTTP_400_BAD_REQUEST
    )
```

---

# User Roles

The system supports three roles:

* customer
* vendor
* admin

Example:

```python
role = models.CharField(
    max_length=20,
    choices=[
        ("customer", "Customer"),
        ("vendor", "Vendor"),
        ("admin", "Admin"),
    ],
    default="customer"
)
```

---

# Core Django Apps

The backend should use the following apps:

```
accounts
vendors
categories
products
cart
orders
payments
reviews
```

Each app should remain small and focused.

---

# Authentication

Authentication uses **JWT**.

Endpoints:

```
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/refresh/
GET  /api/auth/me/
```

---

# Vendor System

Users can apply to become vendors.

Vendor fields:

```
user
store_name
slug
description
logo
is_approved
created_at
```

Endpoints:

```
POST /api/vendors/apply/
GET  /api/vendors/
GET  /api/vendors/{id}/
GET  /api/vendors/my-store/
PATCH /api/vendors/my-store/update/
```

---

# Categories

Categories organize products.

Endpoints:

```
GET  /api/categories/
GET  /api/categories/{id}/
POST /api/categories/create/
PATCH /api/categories/{id}/update/
DELETE /api/categories/{id}/delete/
```

---

# Products

Products belong to vendors.

Fields:

```
vendor
category
name
slug
description
price
stock
image
is_available
created_at
```

Public endpoints:

```
GET /api/products/
GET /api/products/{id}/
GET /api/products/search/
```

Vendor endpoints:

```
POST   /api/vendor/products/create/
GET    /api/vendor/products/
PATCH  /api/vendor/products/{id}/update/
DELETE /api/vendor/products/{id}/delete/
```

---

# Cart

For the first version of this project, users must **log in before adding to cart**.

Cart structure:

```
Cart
CartItem
```

CartItem fields:

```
cart
product
quantity
```

Endpoints:

```
GET    /api/cart/
POST   /api/cart/add/
PATCH  /api/cart/items/{id}/update/
DELETE /api/cart/items/{id}/delete/
DELETE /api/cart/clear/
```

---

# Orders

This is a **multi-vendor platform**.

When a customer checks out:

* the cart is split by vendor
* each vendor receives a separate order

Example:

Customer buys:

```
Phone from Vendor A
Shoes from Vendor B
```

System creates:

```
Order 1 → Vendor A
Order 2 → Vendor B
```

Models:

```
Order
OrderItem
```

Endpoints:

Customer:

```
POST /api/orders/create/
GET  /api/orders/
GET  /api/orders/{id}/
```

Vendor:

```
GET   /api/vendor/orders/
GET   /api/vendor/orders/{id}/
PATCH /api/vendor/orders/{id}/update-status/
```

---

# Payments

Payments use **Paystack**.

Keep payment implementation simple and reliable.

## Payment Rules

* Customer pays the platform
* Vendors are paid later
* Do not implement automatic vendor payout in V1

---

## Payment Flow

1. Customer clicks checkout
2. Backend initializes Paystack payment
3. Backend returns authorization URL
4. Frontend redirects user to Paystack
5. Payment completes
6. Backend verifies payment
7. Orders are marked as paid

---

## Payment Endpoints

```
POST /api/payments/initialize/
POST /api/payments/verify/
POST /api/payments/webhook/
GET  /api/payments/history/
```

---

## Payment Verification

Never trust frontend payment success.

Always verify payment using Paystack's verification endpoint.

Use webhook support for reliability.

---

# Reviews

Customers can review purchased products.

Endpoints:

```
GET  /api/products/{id}/reviews/
POST /api/products/{id}/reviews/create/
PATCH /api/reviews/{id}/update/
DELETE /api/reviews/{id}/delete/
```

---

# Coding Philosophy

This codebase should prioritize:

* clarity
* simplicity
* predictable APIs
* maintainable Django code

Prefer:

* small views
* explicit validation
* readable variable names

Avoid:

* unnecessary abstraction layers
* deep architectural patterns
* overly complex services

```
```
