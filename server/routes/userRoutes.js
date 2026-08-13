const router = require("express").Router();
const ctrl = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.put("/me", protect, ctrl.updateProfile);
router.put("/me/password", protect, ctrl.changePassword);
router.get("/:username", ctrl.getPublicProfile);

module.exports = router;