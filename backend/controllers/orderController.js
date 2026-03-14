const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// CREATE ORDER (User)
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
                    message: `Insufficient stock for ${product.name}`,
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

        const flow = [
            "Processing",
            "Ready",
            "Out for Delivery",
            "Delivered"
        ];

        const currentIndex = flow.indexOf(order.status);
        const newIndex = flow.indexOf(status);

        // ❌ prevent moving backwards
        if (newIndex < currentIndex) {
            return res.status(400).json({
                message: "Cannot move order status backwards"
            });
        }

        order.status = status;

        await order.save();

        res.json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN - UPDATE PAYMENT STATUS
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.paymentStatus = paymentStatus;

        await order.save();

        res.json(order);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN - SALES REPORTS
exports.getSalesReports = async (req, res) => {
    try {
        const salesReports = await Order.aggregate([
            {
                $group: {
                    _id: {
                        user: "$user",
                        month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
                    },
                    totalSales: { $sum: "$totalAmount" },
                    totalOrders: { $count: {} },
                    totalBalance: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "Pending"] }, "$totalAmount", 0]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id.user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 1,
                    month: "$_id.month",
                    totalSales: 1,
                    totalOrders: 1,
                    totalBalance: 1,
                    shopName: "$user.shopName",
                    personName: "$user.personName",
                    phone: "$user.phone"
                }
            },
            { $sort: { month: -1, totalSales: -1 } }
        ]);

        res.json(salesReports);
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

        const totalUnitsSoldData = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: null,
                    totalUnitsSold: { $sum: "$items.quantity" },
                },
            },
        ]);

        const totalUnitsSold = totalUnitsSoldData[0]?.totalUnitsSold || 0;

        res.json({
            totalOrders,
            totalUsers,
            totalProducts,
            totalSales,
            totalUnitsSold,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};