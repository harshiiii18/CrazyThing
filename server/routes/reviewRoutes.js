const router = require("express").Router();
const ctrl = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

router.get("/product/:productId", ctrl.getProductReviews);
router.get("/order/:orderId", protect, ctrl.getOrderReviews);
router.post("/", protect, ctrl.createReview);

module.exports = router;