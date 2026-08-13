const express = require("express");
const router = express.Router();
const address = require("../../controllers/addressController");
const authentication = require("../../middleware/authentication");
const authMiddleware = require("../../middleware/auth");

// Semua endpoint alamat wajib login
router.use(authentication, authMiddleware);

router.get("/", address.getAddresses);
router.post("/", address.createAddress);
router.patch("/:id", address.updateAddress);
router.delete("/:id", address.deleteAddress);
router.patch("/:id/default", address.setDefaultAddress);

module.exports = router;
