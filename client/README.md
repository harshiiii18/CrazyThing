# CrazyThing — Client (Phase 1)

React + Vite + Tailwind + Redux Toolkit frontend for CrazyThing, an AI-powered
social C2C marketplace. This is the Phase 1 scaffold: auth screens, product
browsing/search, product details, cart, and wishlist — wired to a mock data
layer so the UI is fully clickable before the backend exists.

## Run it

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and point `VITE_API_URL` at your backend once
it's running — the API service layer in `src/services/` and `src/api/axios.js`
is already wired to swap from mock data (`src/constants/demoProducts.js`) to
real endpoints with no component changes.

## What's here

- `src/components/ui` — Button, Input, Badge, Price, Rating, Skeleton, EmptyState
- `src/components/layout` — Navbar (with AI search entry point), Footer
- `src/components/product` — ProductCard, FilterPanel
- `src/pages` — Home, Login, Signup, Products (search/filter/sort), ProductDetails,
  Cart, Wishlist, NotFound, ComingSoon (placeholder for later-phase routes)
- `src/redux` — auth, cart, wishlist slices (Redux Toolkit)
- `src/services` + `src/api` — Axios instance + typed service calls for auth/products,
  ready to point at the real Express API

## Design system

Dark marketplace palette (near-black `ink` / `surface`, `ember` orange accent),
Space Grotesk for display type, Inter for body, JetBrains Mono for prices and
figures. Tokens live in `tailwind.config.js`.

## Phase 2 — now wired to the real backend

- `src/pages/Checkout.jsx` — address selection/creation, order summary, and a
  full Razorpay checkout flow (loads `checkout.js`, opens the payment modal,
  verifies the result against `POST /api/payments/verify`). Falls back
  automatically to the backend's mock-payment mode if no Razorpay keys are
  configured server-side.
- `src/pages/Orders.jsx` / `OrderDetails.jsx` — buyer's order list and detail
  view with a live `OrderTimeline` component driven by the order's real status.
- `src/services/cartService.js`, `wishlistService.js`, `addressService.js`,
  `orderService.js` — typed calls to the matching Express routes.

Note: product listing/search/details still read from `demoProducts.js`
(mock data) — swap those calls for `productService.list()` /
`productService.getById()` once you're running the real backend with seeded
products, so the product IDs the cart/checkout use are real Mongo ObjectIds.

## Not yet built (later phases)

Seller dashboard, messaging, offers/negotiation, notifications, admin — these
routes render a "Coming soon" placeholder for now and will be filled in as
each phase from the master spec is implemented.
