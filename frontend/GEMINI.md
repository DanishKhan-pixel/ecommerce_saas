# GEMINI.md

## Project Context

This directory contains the frontend for a **minimalistic multi-vendor ecommerce platform**.

Frontend stack:

- React
- Vite
- Tailwind CSS
- shadcn/ui

The frontend UI has already been generated and should be preserved.

The backend exists in the sibling `../backend` directory.

During frontend integration tasks, you may inspect the backend code to understand:

- endpoint URLs
- request payloads
- response shapes
- authentication requirements
- permissions
- validation rules

However, the backend is **reference only** unless explicitly stated otherwise.

---

# Primary Role

Your job in this frontend directory is to **integrate backend API endpoints into the existing frontend app**.

You are not here to rebuild the frontend from scratch.

You are not here to redesign the UI unnecessarily.

You are not here to modify backend implementation unless explicitly instructed.

---

# Critical Scope Rule

For frontend integration tasks:

- You may read files in `../backend`
- You may inspect backend views, serializers, urls, permissions, and models
- You may use backend code to infer payload and response structure

But:

- Do not edit backend files
- Do not refactor backend code
- Do not add backend endpoints
- Do not modify serializers, views, models, or urls in the backend
- Do not switch tasks from frontend integration to backend development unless explicitly asked

All actual code changes should happen in the **frontend** codebase unless the prompt explicitly says otherwise.

---

# UI Preservation Rule

The UI was already generated and should be preserved.

Do not redesign pages unnecessarily.

Do not replace the visual direction.

Do not make sweeping changes to:

- layout
- spacing
- typography
- color usage
- card styling
- navbar structure
- dashboard structure
- overall sleek ecommerce feel

You may make small adjustments only when required for proper integration or usability.

Preserve the existing polished ecommerce design.

---

# Integration Philosophy

Work in **small, controlled steps**.

Do not integrate the whole app at once.

Only work on the exact module requested in the prompt.

Examples of valid modules:

- authentication
- public products
- categories
- vendors
- search and filters
- cart
- shipping addresses
- orders
- payments
- reviews
- vendor dashboard
- admin dashboard

Do not jump ahead into unrelated modules.

---

# Backend Contract Rule

Before wiring a frontend page to an API:

1. Inspect the backend endpoint
2. Confirm the request method
3. Confirm required payload fields
4. Confirm response structure
5. Confirm auth requirements
6. Confirm error cases if visible in backend code

Base frontend integration on the real backend implementation, not assumptions.

If backend structure is unclear, infer carefully from the actual code and keep integration minimal and safe.

---

# File Modification Rule

When integrating a frontend module:

- change only the necessary frontend files
- keep modifications scoped
- avoid unrelated refactors
- preserve existing component structure where possible

Do not make broad codebase changes unless explicitly asked.

---

# Technical Rules

Use the existing frontend stack:

- React
- Vite
- Tailwind CSS
- shadcn/ui
- React Router

Prefer:

- reusable components
- small utility helpers
- clean service/API files
- readable hooks where useful
- explicit, maintainable state handling

Avoid:

- unnecessary architecture changes
- bloated abstractions
- scattered API logic
- large rewrites

---

# Suggested Frontend Organization

Keep the code organized and predictable.

Prefer structures such as:

- `src/pages`
- `src/components`
- `src/layouts`
- `src/services`
- `src/hooks`
- `src/lib`
- `src/types`

If API utilities are introduced, keep them centralized and reusable.

Do not scatter fetch logic randomly across pages if it can be kept cleanly organized.

---

# API Integration Rules

When integrating endpoints:

- use the real backend route names
- use the real backend payload shape
- use the real backend response data where possible
- handle auth headers correctly
- keep async logic easy to follow

Do not invent alternate endpoint contracts when the backend already defines them.

---

# Loading and Error State Rule

Every integrated page should handle:

- loading states
- empty states
- success states
- error states

These states should fit naturally into the current UI.

Do not expose ugly raw errors directly to users.

Use clean and simple user-facing messages.

---

# Authentication Rules

Authentication integration should support the actual backend auth flow.

Expected tasks may include:

- register
- login
- logout
- current user
- token storage
- token refresh
- protected routes

When integrating auth:

- inspect the backend auth endpoints first
- preserve the existing auth page UI
- do not redesign login/register pages
- handle auth errors cleanly
- keep token handling explicit and understandable

---

# Product Integration Rules

Product integration may include:

- homepage product sections
- shop/product listing
- product details
- search results
- filtering and sorting

When integrating products:

- inspect backend product endpoints first
- preserve the existing product card design
- preserve product details page layout
- preserve filters UI
- use real query params supported by the backend

---

# Category and Vendor Rules

When integrating categories and vendors:

- inspect backend category and vendor endpoints
- use real backend data structures
- preserve current listing layouts
- preserve vendor store page design
- do not redesign public pages unnecessarily

---

# Cart Rules

Cart integration may include:

- add to cart
- get cart
- update cart item quantity
- remove cart item
- clear cart

Before integration:

- inspect backend cart endpoints
- confirm whether auth is required
- confirm required payload fields

Preserve cart page design and summary structure.

---

# Address Rules

Address integration may include:

- list addresses
- create address
- update address
- delete address
- default address behavior

Preserve account page structure and forms.

---

# Order Rules

Order integration may include:

- create order
- get user orders
- get order details

Before integration:

- inspect backend checkout/order creation payload
- confirm how address selection is expected
- confirm response shape

Preserve checkout and order pages.

---

# Payment Rules

Payments are handled through the backend.

Frontend payment integration should follow the backend flow exactly.

Before integration:

- inspect backend payment initialize endpoint
- inspect backend payment verify endpoint
- understand what frontend should send and receive

Do not fake payment success.

Do not assume payment is complete without backend confirmation.

Preserve existing checkout and payment-success UI.

---

# Review Rules

Review integration may include:

- fetch reviews
- create review
- update review
- delete review

Inspect backend review rules first, especially purchase/auth restrictions.

Preserve product review UI.

---

# Vendor Dashboard Rules

Vendor dashboard integration may include:

- vendor summary data
- my store
- edit store
- vendor products
- add/edit/delete product
- vendor orders
- update order status

Inspect backend vendor endpoints first.

Preserve dashboard structure and forms.

---

# Admin Rules

Admin integration may include:

- vendor moderation
- category management
- product management
- order management

Use only existing backend admin endpoints.

Do not redesign admin pages unless explicitly instructed.

---

# Prompt Execution Rules

For every task:

- work only on the requested module
- inspect backend only as needed
- modify frontend only
- do not edit backend files
- preserve UI
- keep code clean and scoped

If the prompt says “integrate authentication only,” then only integrate authentication.

If the prompt says “integrate cart only,” then only integrate cart.

Do not combine unrelated work.

---

# Quality Standard

The final frontend should remain:

- sleek
- modern
- polished
- responsive
- ecommerce-focused
- maintainable

Every integration should increase functionality without reducing visual quality.

Priority order:

1. preserve UI
2. match real backend contract
3. keep code clean
4. keep changes scoped

---

# Safe Behavior Rule

If backend code reveals that the frontend assumptions are wrong:

- follow the backend contract
- adjust frontend integration carefully
- do not rewrite large parts of the UI unless absolutely necessary

Prefer minimal, safe corrections.

---

# Response Style

When implementing a task:

- focus on the exact requested feature
- make only necessary frontend changes
- keep explanations concise if needed
- avoid unrelated improvements
- do not perform broad redesigns