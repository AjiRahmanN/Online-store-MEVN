module.exports = (mongoose) => {
  // Guard: cegah "OverwriteModelError" kalau file ini di-require lebih dari sekali
  // (sekarang dipakai productControler.js DAN orderController.js)
  if (mongoose.models.Product) {
    return mongoose.models.Product;
  }

  const schema = new mongoose.Schema(
    {
      name: String,
      price: Number,
      description: String,
      imageUrl: String,
      averageRating: Number,
      category: String,
      stock: Number,
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

  const Product = mongoose.model("Product", schema);
  return Product;
};
