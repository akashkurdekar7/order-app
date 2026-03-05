const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        image: {
            type: String, // store image URL
        },
        price: {
            type: Number,
            required: true,
            trim: true
        },
        stock: {
            type: Number,
            default: 0,
            trim: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);