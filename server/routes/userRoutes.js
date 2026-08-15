const router = require("express").Router();
const ctrl = require("../controllers/userController");
const verificationCtrl = require("../controllers/verificationController");
const { protect } = require("../middleware/auth");

router.put("/me", protect, ctrl.updateProfile);
router.put("/me/password", protect, ctrl.changePassword);
router.post("/me/request-verification", protect, verificationCtrl.requestVerification);
router.get("/:username", ctrl.getPublicProfile);

module.exports = router;