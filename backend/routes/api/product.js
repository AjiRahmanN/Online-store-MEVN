const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const products = require("../../controllers/productControler");
const upload = require("../../middleware/upload");

// GET /api/products
router.get("/", products.findAll);
router.get("/:id", products.findOne);
router.post("/", upload.single("image"), products.create);
router.put("/:id", products.update);
router.delete("/:id", products.delete);

module.exports = router;
