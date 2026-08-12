const router = require("express").Router();
const ctrl = require("../controllers/categoryController");
const { protect, requireRole } = require("../middleware/auth");

router.get("/", ctrl.listCategories);
router.post("/", protect, requireRole("ADMIN"), ctrl.createCategory);
router.put("/:id", protect, requireRole("ADMIN"), ctrl.updateCategory);
router.patch("/:id/disable", protect, requireRole("ADMIN"), ctrl.disableCategory);

module.exports = router;
