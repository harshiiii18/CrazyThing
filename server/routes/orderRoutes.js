const router = require("express").Router();
const ctrl = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/", ctrl.createOrder);
router.get("/", ctrl.myOrders);
router.get("/seller/mine", ctrl.sellerOrders);
router.get("/:id", ctrl.getOrder);
router.patch("/:id/cancel", ctrl.cancelOrder);

// Seller-side lifecycle
router.patch("/:id/seller-action", ctrl.sellerRespond);
router.patch("/:id/pack", ctrl.markPacked);
router.patch("/:id/ship", ctrl.markShipped);
router.patch("/:id/deliver", ctrl.markDelivered);

module.exports = router;
