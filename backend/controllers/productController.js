const Product = require("../models/Product");

// Add Product (Admin)
exports.addProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: "Product already exists" });
        }
        const product = await Product.create({
            name,
            price,
            stock,
            image: req.file ? `/uploads/${req.file.filename}` : null
        });

        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const Order = require("../models/Order");

// Get All Products (Admin with Stats)
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "orders",
                    let: { productId: "$_id" },
                    pipeline: [
                        { $unwind: "$items" },
                        { $match: { $expr: { $eq: ["$items.product", "$$productId"] } } },
                        { $group: { _id: null, totalSold: { $sum: "$items.quantity" } } }
                    ],
                    as: "salesData"
                }
            },
            {
                $addFields: {
                    soldCount: { $ifNull: [{ $arrayElemAt: ["$salesData.totalSold", 0] }, 0] }
                }
            },
            {
                $project: { salesData: 0 }
            },
            { $sort: { createdAt: -1 } }
        ]);
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    const updateData = {
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock
    };
    if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
    }
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};