const { refresh } = require("../controllers/authController");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (val) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    refresh_token: {
      type: String,
    },
    roles: {
      type: [String],
      default: ["user"],
    },
  },
  { timestamps: true }
);

// Virtual field
userSchema.virtual("fullName").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Kalau ingin virtual ikut tampil saat JSON/objek dikirim
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
