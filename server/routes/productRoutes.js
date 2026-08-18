const router = require("express").Router();
const ctrl = require("../controllers/productController");
const { protect, optionalAuth } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createProductValidator } = require("../validators/productValidators");

router.get("/", optionalAuth, ctrl.listProducts);
router.get("/mine", protect, ctrl.myProducts);
router.get("/:id", optionalAuth, ctrl.getProduct);
router.get("/:id/contact-seller", protect, ctrl.getSellerContact);
router.post("/", protect, createProductValidator, validate, ctrl.createProduct);
router.put("/:id", protect, ctrl.updateProduct);
router.patch("/:id/status", protect, ctrl.updateProductStatus);
router.delete("/:id", protect, ctrl.deleteProduct);

module.exports = router;
