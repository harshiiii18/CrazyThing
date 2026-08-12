# CrazyThing — Server (Phase 1 + Phase 2)

Node/Express/MongoDB API for CrazyThing.

## Run it

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI at minimum
npm run seed            # optional: creates admin/seller demo accounts + categories
npm run dev
```

Health check: `GET /api/health`

## What's implemented

**Phase 1**
- Auth: signup, login, logout, `/me`, forgot/reset password (email is mocked
  to console unless `EMAIL_*` env vars are set — see `services/emailService.js`)
- JWT auth middleware + role middleware, rate-limited auth routes
- Categories: public list, admin CRUD
- Products: create/edit/delete (owner or admin only), search with text index,
  category/price/condition/location filters, sort, pagination
- Centralized error handling, consistent `{ success, message, data }` response shape

**Phase 2**
- Addresses: CRUD with a single default
- Cart: server-authoritative — prices are always re-read from `Product` at
  request time, never trusted from the client
- Checkout: `POST /api/orders` recalculates the cart total server-side, creates
  the `Order`, and opens a Razorpay order via `services/paymentService.js`
- Payments: `POST /api/payments/verify` is the only place a payment is marked
  successful — it verifies the Razorpay HMAC signature server-side
- Orders: full buyer + seller lifecycle (`PENDING_PAYMENT → PAID →
  SELLER_CONFIRMATION_PENDING → CONFIRMED → PACKED → SHIPPED → DELIVERED`),
  cancellation, seller accept/reject, manual courier/tracking entry

## Razorpay dev fallback

If `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` are not set, `paymentService`
returns a clearly-flagged mock order (`isMock: true`) so checkout is testable
without real credentials. Mock payments are never confused with verified
ones — `isMock` is persisted on the `Payment` record and signature
verification is skipped only in that mode. Add real keys before deploying.

## Demo accounts (after `npm run seed`)

- Admin: `admin@crazything.dev` / `AdminPass123`
- Seller: `seller@crazything.dev` / `SellerPass123`

## Not yet built (later phases)

Socket.io chat, offers/negotiation, notifications, admin reports/analytics
endpoints, seller verification review, AI listing assistant/search — these
follow in Phases 3–6 per the master spec.
