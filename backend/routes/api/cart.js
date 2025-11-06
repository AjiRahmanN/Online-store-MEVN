const express = require("express");
const router = express.Router();
const cart = require("../../controllers/cartController");

router.get("/:id", cart.findCart);
router.post("/:id", cart.addToCart);
router.delete("/:id/:productId", cart.removeFromCart);

module.exports = router;
