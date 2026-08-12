const router = require("express").Router();
const ctrl = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/verify", ctrl.verifyPayment);
router.post("/:orderId/mark-failed", ctrl.markFailed);

module.exports = router;
