const Product = require("../models/Product");

// Add Product (Admin)
exports.addProduct = async (req, res) => {
    try {
        const { title, image, price, stock } = req.body;

        const product = await Product.create({
            title,
            image,
            price,
            stock,
        });

        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Get All Products (Public)
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
exports.deleteProduct = async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
};

exports.updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(product);
};