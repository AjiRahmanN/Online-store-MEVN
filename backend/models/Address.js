module.exports = (mongoose) => {
  if (mongoose.models.Address) {
    return mongoose.models.Address;
  }

  const schema = new mongoose.Schema(
    {
      userId: { type: String, required: true, index: true },
      label: { type: String, default: "Rumah" }, // ex: "Rumah", "Kantor"
      recipientName: { type: String, required: true },
      phone: { type: String, required: true },
      fullAddress: { type: String, required: true }, // nama jalan, no rumah, RT/RW, kecamatan
      city: { type: String, required: true },
      province: { type: String, required: true },
      postalCode: { type: String, required: true },
      isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
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

  const Address = mongoose.model("Address", schema);
  return Address;
};
