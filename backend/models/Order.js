module.exports = (mongoose) => {
  // Guard: cegah "OverwriteModelError" kalau file ini di-require lebih dari sekali
  if (mongoose.models.Order) {
    return mongoose.models.Order;
  }

  const schema = new mongoose.Schema(
    {
      userId: { type: String, required: true, index: true },
      // orderId dikirim ke Midtrans sebagai order_id (harus unik)
      orderId: { type: String, required: true, unique: true },
      items: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          name: String,
          price: Number,
          qty: Number,
          imageUrl: String,
        },
      ],
      totalAmount: { type: Number, required: true },
      shippingAddress: {
        label: String,
        recipientName: String,
        phone: String,
        fullAddress: String,
        city: String,
        province: String,
        postalCode: String,
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "expired", "cancelled"],
        default: "pending",
      },
      paymentType: String,
      snapToken: String,
      transactionId: String,
      // flag supaya stok cuma dikurangi sekali walau status di-cek berkali-kali
      stockDeducted: { type: Boolean, default: false },
    },
    { timestamps: true },
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.virtual("id").get(function () {
    return this._id.toHexString();
  });

  schema.set("toJSON", { virtuals: true });
  schema.set("toObject", { virtuals: true });

  const Order = mongoose.model("Order", schema);
  return Order;
};
