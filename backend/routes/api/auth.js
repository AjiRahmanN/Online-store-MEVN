const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const authMidleware = require("../../middleware/auth");
const authentication = require("../../middleware/authentication");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refresh);

router.get("/user", authentication, authMidleware, authController.user);

module.exports = router;
