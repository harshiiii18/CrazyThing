# CrazyThing — Database Schema (Phase 1 + 2)

MongoDB via Mongoose. Every collection has `timestamps: true` unless noted.

## User
- `name, username (unique), email (unique), password (hashed, select:false)`
- `phone, avatar, bio, location`
- `role: USER | ADMIN`
- `isEmailVerified, emailVerifyToken, passwordResetToken, passwordResetExpires`
- `isActive`
- `sellerVerification: { status: NOT_VERIFIED|PENDING|VERIFIED|REJECTED, requestedAt, reviewedAt, rejectionReason }`
- `ratingAvg, ratingCount, completedSalesCount`
- `followers[User], following[User]`

## Category
- `name (unique), slug (unique), description, icon, isActive`

## Product
- `seller -> User`
- `title, description, price, category -> Category, condition (NEW|LIKE_NEW|GOOD|FAIR|USED)`
- `location, quantity, brand, model, color, size, tags[], specifications (Map), deliveryInfo`
- `images: [{ url, publicId }]`
- `status: DRAFT|PENDING_APPROVAL|ACTIVE|SOLD_OUT|PAUSED|REJECTED|DELETED (soft delete)`
- `views, aiGenerated: { title, description, priceRange }`
- Indexes: text index on `title/description/tags`, `{category,status}`, `{price}`, `{seller}`

## Address
- `user -> User, label, fullName, phone, line1, line2, city, state, pincode, isDefault`

## Cart
- `user -> User (unique)`
- `items: [{ product -> Product, quantity, priceAtAdd }]`
- `priceAtAdd` is informational only — checkout always re-reads `Product.price`.

## Wishlist
- `user -> User (unique), products: [Product]`

## Order
- `buyer -> User`
- `items: [{ product -> Product, seller -> User, title, image, price, quantity }]` — **snapshotted** at order time, so later product edits never change historical orders
- `shippingAddress` (copied from Address at order time)
- `subtotal, shippingFee, discount, tax, total`
- `status`: `PENDING_PAYMENT → PAID → SELLER_CONFIRMATION_PENDING → CONFIRMED → PACKED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED → COMPLETED`, or `CANCELLED / RETURN_REQUESTED / RETURNED / REFUNDED`
- `paymentStatus: PENDING|PAID|FAILED|REFUNDED|PARTIALLY_REFUNDED`
- `tracking: { courier, trackingNumber, shippedAt, estimatedDelivery, deliveredAt }`
- `statusHistory: [{ status, changedAt, note }]`
- Indexes: `{buyer, createdAt}`, `{"items.seller"}`

## Payment
- Kept separate from Order per spec.
- `order -> Order, buyer -> User, provider, razorpayOrderId, razorpayPaymentId, razorpaySignature`
- `amount, currency, status: PENDING|PAID|FAILED|REFUNDED|PARTIALLY_REFUNDED`
- `isMock` — true when created via the no-credentials Razorpay fallback; never treated as a real payment success signal.

## Not yet modeled (later phases)
`Offer, Conversation, Message, Review, Notification, Report, SellerVerification` — planned for Phases 3–5 per the master spec's MVP priority order.
