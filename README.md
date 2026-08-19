# CrazyThing

**Buy. Sell. Discover Everything.**

A full-stack C2C marketplace platform where anyone can buy and sell — built as a portfolio project demonstrating end-to-end MERN development, secure payment integration, and production-style architecture.

🔗 **Live demo:** [crazy-thing.vercel.app](https://crazy-thing.vercel.app)
🔗 **API:** [crazything-api.onrender.com/api/health](https://crazything-api.onrender.com/api/health)

---

## Screenshots

*(Add 2–3 screenshots here — homepage, product detail, and seller dashboard work well)*

---

## Features

**Buyers**
- Browse, search, and filter listings by category, price, condition, and location
- AI-assisted natural-language search
- Wishlist and cart with server-verified pricing
- Secure checkout via Razorpay, with server-side payment signature verification
- Order tracking with a live status timeline
- Product and seller reviews

**Sellers**
- AI listing assistant — describe an item in plain language, get a drafted title, description, category, condition, and price range (editable before publishing)
- Seller dashboard with revenue, order, and listing stats
- Order fulfillment flow: accept/reject → pack → ship with courier tracking
- Seller verification request flow

**Admin**
- Platform-wide analytics (users, listings, orders, revenue)
- User management (suspend/activate, approve seller verification)
- Listing moderation (reject/remove)

**Platform**
- JWT authentication with bcrypt password hashing and rate-limited auth endpoints
- Server-authoritative pricing — cart and checkout totals are always recalculated from the database, never trusted from the client
- Role-based access control (buyer/seller unified account + admin role)
- 13-state order lifecycle with full audit history
- Automated backend tests (Jest + Supertest) covering auth, listings, and pricing integrity

---

## Tech stack

**Frontend:** React, Vite, Redux Toolkit, React Router, Tailwind CSS, React Hook Form
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
**Payments:** Razorpay (test mode, with a mock-payment fallback when no API keys are configured)
**AI:** Listing assistant with an Anthropic API integration and a rule-based fallback for offline/demo use
**Testing:** Jest, Supertest, mongodb-memory-server
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

---

## Project structure

---

## Running locally

### Prerequisites
- Node.js 18+
- A MongoDB connection string (local or [Atlas](https://www.mongodb.com/cloud/atlas) free tier)

### Backend

```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET at minimum
npm run seed             # optional — creates demo admin/seller accounts and products
npm run dev
```

Runs on `http://localhost:5000`. Health check: `GET /api/health`.

### Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Runs on `http://localhost:5173`.

### Tests

```bash
cd server
npm test
```

---

## Environment variables

See `server/.env.example` and `client/.env.example` for the full list. At minimum, the backend needs `MONGO_URI` and `JWT_SECRET`. Razorpay and AI features work in a demo/mock mode without credentials — see the inline comments in `server/services/paymentService.js` and `server/services/aiService.js`.

---

## Design notes

- **Server-authoritative pricing**: the cart and checkout endpoints never trust a price sent from the client — every total is recalculated from the current `Product` price in the database at request time.
- **Payment verification**: Razorpay's client-side "payment succeeded" callback is never treated as ground truth. The backend independently verifies the HMAC-SHA256 signature before marking an order as paid.
- **Graceful AI/payment fallback**: both the AI listing assistant and Razorpay checkout detect missing API credentials and fall back to a clearly-labeled mock mode, so the app is fully testable without paid API access.

---

## Author

Built by **Harshita** — [GitHub](https://github.com/harshiiii18)