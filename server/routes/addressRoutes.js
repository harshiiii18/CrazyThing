const router = require("express").Router();
const ctrl = require("../controllers/addressController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.get("/", ctrl.listAddresses);
router.post("/", ctrl.createAddress);
router.put("/:id", ctrl.updateAddress);
router.delete("/:id", ctrl.deleteAddress);

module.exports = router;
