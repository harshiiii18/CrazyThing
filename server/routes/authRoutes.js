const router = require("express").Router();
const ctrl = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/authValidators");

router.post("/signup", authLimiter, signupValidator, validate, ctrl.signup);
router.post("/login", authLimiter, loginValidator, validate, ctrl.login);
router.post("/logout", protect, ctrl.logout);
router.get("/me", protect, ctrl.me);
router.post("/forgot-password", authLimiter, forgotPasswordValidator, validate, ctrl.forgotPassword);
router.post("/reset-password", authLimiter, resetPasswordValidator, validate, ctrl.resetPassword);

module.exports = router;
