const router = require("express").Router();
const ctrl = require("../controllers/adminController");
const { protect, requireRole } = require("../middleware/auth");

router.use(protect, requireRole("ADMIN"));

router.get("/analytics", ctrl.getAnalytics);

router.get("/users", ctrl.listUsers);
router.patch("/users/:id/status", ctrl.setUserStatus);
router.patch("/users/:id/verification", ctrl.setSellerVerification);

router.get("/products", ctrl.listAllProducts);
router.patch("/products/:id/status", ctrl.setProductStatus);

module.exports = router;