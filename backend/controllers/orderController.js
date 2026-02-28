const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// CREATE ORDER (User)
// exports.createOrder = async (req, res) => {
//     try {
//         const { items } = req.body;

//         if (!items || items.length === 0) {
//             return res.status(400).json({ message: "No items in order" });
//         }

//         let totalAmount = 0;

//         for (let item of items) {
//             const product = await Product.findById(item.product);

//             if (!product) {
//                 return res.status(404).json({ message: "Product not found" });
//             }

//             totalAmount += product.price * item.quantity;

//             item.price = product.price; // lock price
//         }

//         const order = await Order.create({
//             user: req.user._id,
//             items,
//             totalAmount,
//         });

//         res.status(201).json(order);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        let totalAmount = 0;

        for (let item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            // ✅ Prevent order if stock is less
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.title}`,
                });
            }

            totalAmount += product.price * item.quantity;

            item.price = product.price;

            // ✅ Reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// GET USER ORDERS
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN - GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user")
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN - UPDATE STATUS
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// ADMIN DASHBOARD
exports.getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalProducts = await Product.countDocuments();

        const totalSalesData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" },
                },
            },
        ]);

        const totalSales = totalSalesData[0]?.totalSales || 0;

        res.json({
            totalOrders,
            totalUsers,
            totalProducts,
            totalSales,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};