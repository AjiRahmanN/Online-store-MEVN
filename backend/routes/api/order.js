const express = require("express");
const router = express.Router();
const order = require("../../controllers/orderController");
const authentication = require("../../middleware/authentication");
const authMiddleware = require("../../middleware/auth");

// Endpoint yang butuh login
router.post("/", authentication, authMiddleware, order.checkout);
router.get("/mine", authentication, authMiddleware, order.getMyOrders);
router.get("/:orderId", authentication, authMiddleware, order.getOrderById);
router.post("/:orderId/verify", authentication, authMiddleware, order.verifyOrder);
router.post("/:orderId/cancel", authentication, authMiddleware, order.cancelOrder);

// Webhook publik dari server Midtrans (TANPA authentication, karena
// yang memanggil adalah server Midtrans, bukan browser user)
router.post("/notification", order.handleNotification);

module.exports = router;
