module.exports = (mongoose) => {
  const schema = mongoose.Schema({
    userId: String,
    cartItem: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  });
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
