const mongoose = require("mongoose");
const crypto = require("crypto");
const Order = require("../models/Order")(mongoose);
const Cart = require("../models/Cart")(mongoose);
const Product = require("../models/Product")(mongoose);
const Address = require("../models/Address")(mongoose);
const { snap, core } = require("../config/midtrans");

// POST /api/orders  -> buat order dari isi cart user yang sedang login + generate Snap token
exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;

    if (!addressId) {
      return res.status(400).json({ message: "Alamat pengiriman wajib dipilih" });
    }

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(400).json({ message: "Alamat pengiriman tidak ditemukan" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart kamu masih kosong" });
    }

    // Validasi stok sebelum order dibuat
    for (const it of cart.items) {
      if (!it.product) continue;
      if (it.product.stock < it.qty) {
        return res.status(400).json({
          message: `Stok "${it.product.name}" tidak cukup (tersisa ${it.product.stock})`,
        });
      }
    }

    const orderItems = cart.items.map((it) => ({
      product: it.product._id,
      name: it.product.name,
      price: it.product.price,
      qty: it.qty,
      imageUrl: it.product.imageUrl,
    }));

    const totalAmount = orderItems.reduce((sum, it) => sum + it.price * it.qty, 0);
    const orderId = `ORDER-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

    const shippingAddress = {
      label: address.label,
      recipientName: address.recipientName,
      phone: address.phone,
      fullAddress: address.fullAddress,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
    };

    const order = await Order.create({
      userId,
      orderId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: "pending",
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      item_details: orderItems.map((it) => ({
        id: it.product.toString(),
        price: it.price,
        quantity: it.qty,
        name: it.name.substring(0, 50), // Midtrans membatasi max 50 karakter
      })),
      customer_details: {
        first_name: req.user.username || "Customer",
        email: req.user.email,
        phone: address.phone,
        shipping_address: {
          first_name: address.recipientName,
          phone: address.phone,
          address: address.fullAddress,
          city: address.city,
          postal_code: address.postalCode,
        },
      },
    };

    const transaction = await snap.createTransaction(parameter);

    order.snapToken = transaction.token;
    await order.save();

    res.json({
      orderId: order.orderId,
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url,
      order,
    });
  } catch (err) {
    console.error("Error in checkout:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/mine -> riwayat order milik user yang login
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error in getMyOrders:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:orderId -> detail 1 order (harus milik user yg login)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId, userId: req.user.id });
    if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });
    res.json(order);
  } catch (err) {
    console.error("Error in getOrderById:", err);
    res.status(500).json({ message: err.message });
  }
};

// Helper internal: terapkan status transaksi Midtrans ke Order,
// kurangi stok produk, dan kosongkan cart -- hanya sekali saat pertama kali "paid"
async function processTransactionStatus(orderId, statusResponse) {
  const order = await Order.findOne({ orderId });
  if (!order) return null;

  const transactionStatus = statusResponse.transaction_status;
  const fraudStatus = statusResponse.fraud_status;

  let newStatus = order.status;

  if (transactionStatus === "capture") {
    newStatus = fraudStatus === "accept" ? "paid" : "pending";
  } else if (transactionStatus === "settlement") {
    newStatus = "paid";
  } else if (transactionStatus === "expire") {
    newStatus = "expired";
  } else if (["cancel", "deny"].includes(transactionStatus)) {
    newStatus = "failed";
  } else if (transactionStatus === "pending") {
    newStatus = "pending";
  }

  order.status = newStatus;
  order.paymentType = statusResponse.payment_type;
  order.transactionId = statusResponse.transaction_id;

  if (newStatus === "paid" && !order.stockDeducted) {
    for (const it of order.items) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty } });
    }
    order.stockDeducted = true;
    await Cart.updateOne({ userId: order.userId }, { $set: { items: [] } });
  }

  await order.save();
  return order;
}

// POST /api/orders/:orderId/verify
// Dipanggil frontend setelah popup Snap sukses/pending, untuk cek status transaksi
// langsung ke Midtrans. Ini menghindari kebutuhan webhook publik saat development lokal.
exports.verifyOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const statusResponse = await core.transaction.status(orderId);
    const order = await processTransactionStatus(orderId, statusResponse);
    res.json(order);
  } catch (err) {
    console.error("Error in verifyOrder:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/orders/:orderId/cancel
// Hanya boleh untuk order milik user yang login, dan hanya kalau status masih "pending".
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId, userId: req.user.id });
    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: `Order dengan status "${order.status}" tidak bisa dibatalkan`,
      });
    }

    // Batalkan transaksi di Midtrans juga, supaya token/link pembayaran lama
    // tidak bisa dipakai lagi. Kalau transaksinya sudah tidak ada / sudah di
    // status akhir di sisi Midtrans, jangan gagalkan proses cancel -- cukup
    // catat di log dan tetap update status lokal.
    try {
      await core.transaction.cancel(orderId);
    } catch (midtransErr) {
      console.warn(`Gagal cancel transaksi Midtrans untuk ${orderId} (dilanjutkan tetap update status lokal):`, midtransErr.message);
    }

    order.status = "cancelled";
    await order.save();

    res.json(order);
  } catch (err) {
    console.error("Error in cancelOrder:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/orders/notification
// Webhook resmi dari server Midtrans (dipakai saat production / testing via ngrok).
// URL ini didaftarkan di Midtrans Dashboard > Settings > Configuration > Payment Notification URL
exports.handleNotification = async (req, res) => {
  try {
    const statusResponse = await core.transaction.notification(req.body);
    await processTransactionStatus(statusResponse.order_id, statusResponse);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Error in handleNotification:", err);
    res.status(500).json({ message: err.message });
  }
};
