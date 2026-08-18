const router = require("express").Router();
const ctrl = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

router.post("/listing-assist", protect, ctrl.listingAssist);

module.exports = router;