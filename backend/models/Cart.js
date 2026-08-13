module.exports = (mongoose) => {
  // Kalau model "Cart" sudah pernah didaftarkan (karena file ini di-require
  // dari beberapa controller), pakai yang sudah ada, jangan daftar ulang.
  if (mongoose.models.Cart) {
    return mongoose.models.Cart;
  }

  const schema = new mongoose.Schema(
    {
      userId: { type: String, required: true, index: true },
      items: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
          qty: { type: Number, default: 1, min: 1 },
        },
      ],
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

  // Kalau ingin virtual ikut tampil saat JSON/objek dikirim
  schema.set("toJSON", { virtuals: true });
  schema.set("toObject", { virtuals: true });

  const Cart = mongoose.model("Cart", schema);
  return Cart;
};
