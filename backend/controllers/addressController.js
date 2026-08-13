const mongoose = require("mongoose");
const Address = require("../models/Address")(mongoose);

// GET /api/addresses -> semua alamat milik user yang login, default di atas
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id }).sort({
      isDefault: -1,
      createdAt: -1,
    });
    res.json(addresses);
  } catch (err) {
    console.error("Error in getAddresses:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/addresses
exports.createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { label, recipientName, phone, fullAddress, city, province, postalCode, isDefault } =
      req.body;

    if (!recipientName || !phone || !fullAddress || !city || !province || !postalCode) {
      return res.status(400).json({ message: "Semua field alamat wajib diisi" });
    }

    const existingCount = await Address.countDocuments({ userId });
    // Alamat pertama otomatis jadi default, walau user tidak mencentang
    const shouldBeDefault = existingCount === 0 ? true : !!isDefault;

    if (shouldBeDefault) {
      await Address.updateMany({ userId }, { $set: { isDefault: false } });
    }

    const address = await Address.create({
      userId,
      label: label || "Rumah",
      recipientName,
      phone,
      fullAddress,
      city,
      province,
      postalCode,
      isDefault: shouldBeDefault,
    });

    res.status(201).json(address);
  } catch (err) {
    console.error("Error in createAddress:", err);
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/addresses/:id
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { label, recipientName, phone, fullAddress, city, province, postalCode, isDefault } =
      req.body;

    const address = await Address.findOne({ _id: id, userId });
    if (!address) return res.status(404).json({ message: "Alamat tidak ditemukan" });

    if (isDefault) {
      await Address.updateMany({ userId }, { $set: { isDefault: false } });
    }

    if (label !== undefined) address.label = label;
    if (recipientName !== undefined) address.recipientName = recipientName;
    if (phone !== undefined) address.phone = phone;
    if (fullAddress !== undefined) address.fullAddress = fullAddress;
    if (city !== undefined) address.city = city;
    if (province !== undefined) address.province = province;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();
    res.json(address);
  } catch (err) {
    console.error("Error in updateAddress:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/addresses/:id
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await Address.findOneAndDelete({ _id: id, userId });
    if (!address) return res.status(404).json({ message: "Alamat tidak ditemukan" });

    // Kalau yang dihapus adalah alamat default, jadikan alamat lain (kalau ada) sebagai default
    if (address.isDefault) {
      const another = await Address.findOne({ userId });
      if (another) {
        another.isDefault = true;
        await another.save();
      }
    }

    res.json({ message: "Alamat berhasil dihapus" });
  } catch (err) {
    console.error("Error in deleteAddress:", err);
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/addresses/:id/default
exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const address = await Address.findOne({ _id: id, userId });
    if (!address) return res.status(404).json({ message: "Alamat tidak ditemukan" });

    await Address.updateMany({ userId }, { $set: { isDefault: false } });
    address.isDefault = true;
    await address.save();

    res.json(address);
  } catch (err) {
    console.error("Error in setDefaultAddress:", err);
    res.status(500).json({ message: err.message });
  }
};
