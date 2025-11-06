const mongoose = require("mongoose");
const Product = require("../models/Product")(mongoose);

// Mendapatkan semua produk
exports.findAll = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (err) {
    console.error("Error in findAll:", err);
    res.status(500).send({ message: err.message });
  }
};

// Mendapatkan satu produk berdasarkan ID
exports.findOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send(product);
  } catch (err) {
    console.error("Error in findOne:", err);
    res.status(500).send({ message: err.message });
  }
};

// Menambah produk baru
exports.create = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      stock: req.body.stock,
      imageUrl: req.file ? `/public/img/${req.file.filename}` : null,
    });
    const savedProduct = await product.save();
    res.status(201).send(savedProduct);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Mengupdate produk berdasarkan ID
exports.update = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).send({ message: "Product not found" });
    res.status(200).send(updated);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Menghapus produk
exports.delete = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send({ message: "Product not found" });
    res.status(200).send({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
