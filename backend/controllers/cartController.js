const mongoose = require("mongoose");
const Cart = require("../models/Cart")(mongoose);

exports.findCart = async (req, res) => {
  try {
    const userId = req.params.id;

    const cart = await Cart.findOne({ userId }).populate("items.product");

    if (!cart) {
      // Kembalikan struktur cart kosong, biar frontend tidak perlu handle 404 khusus
      return res.send({ userId, items: [] });
    }

    res.send(cart);
  } catch (err) {
    console.error("Error in findCart:", err);
    res.status(500).send({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId, qty = 1 } = req.body;

    if (!productId) {
      return res.status(400).send({ message: "productId wajib diisi" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find((i) => i.product.toString() === productId);
    if (existingItem) {
      existingItem.qty += Number(qty);
    } else {
      cart.items.push({ product: productId, qty: Number(qty) });
    }

    await cart.save();
    await cart.populate("items.product");

    res.send(cart);
  } catch (err) {
    console.error("Error in addToCart:", err);
    res.status(500).send({ message: err.message });
  }
};

// PATCH /api/cart/:id/:productId  { qty }
exports.updateQty = async (req, res) => {
  try {
    const userId = req.params.id;
    const productId = req.params.productId;
    const { qty } = req.body;

    if (!qty || qty < 1) {
      return res.status(400).send({ message: "Qty minimal 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).send({ message: "Cart tidak ditemukan" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).send({ message: "Item tidak ada di cart" });

    item.qty = Number(qty);
    await cart.save();
    await cart.populate("items.product");

    res.send(cart);
  } catch (err) {
    console.error("Error in updateQty:", err);
    res.status(500).send({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const productId = req.params.productId;

    const result = await Cart.updateOne({ userId }, { $pull: { items: { product: productId } } });

    res.send(result);
  } catch (err) {
    console.error("Error in removeFromCart:", err);
    res.status(500).send({ message: err.message });
  }
};

// Helper internal dipakai orderController setelah pembayaran sukses
exports.clearCart = async (userId) => {
  await Cart.updateOne({ userId }, { $set: { items: [] } });
};
