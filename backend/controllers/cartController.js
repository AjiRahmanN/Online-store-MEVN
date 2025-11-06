const mongoose = require("mongoose");
const Cart = require("../models/Cart")(mongoose);

exports.findCart = async (req, res) => {
  try {
    const userId = req.params.id;

    const cart = await Cart.findOne({ userId }).populate("cartItem");

    if (!cart) {
      return res.status(404).send({ message: "Cart not found for user" });
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
    const productId = req.body.productId; // ObjectId dari Product

    const result = await Cart.updateOne({ userId }, { $addToSet: { cartItem: productId } }, { upsert: true });

    res.send(result);
  } catch (err) {
    console.error("Error in addToCart:", err);
    res.status(500).send({ message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const productId = req.params.productId;

    const result = await Cart.updateOne({ userId }, { $pull: { cartItem: productId } });

    res.send(result);
  } catch (err) {
    console.error("Error in removeFromCart:", err);
    res.status(500).send({ message: err.message });
  }
};
