const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true,
    },
    personName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    aadhaar: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{12}$/, "Aadhaar must be 12 digits"],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Phone must be 10 digits"],
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);