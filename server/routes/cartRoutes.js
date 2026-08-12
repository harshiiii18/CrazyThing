const router = require("express").Router();
const ctrl = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/", ctrl.getCart);
router.post("/items", ctrl.addToCart);
router.put("/items/:productId", ctrl.updateCartItem);
router.delete("/items/:productId", ctrl.removeCartItem);
router.delete("/", ctrl.clearCart);

module.exports = router;
