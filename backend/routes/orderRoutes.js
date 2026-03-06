const express = require("express");
const {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    getDashboardStats,
    updatePaymentStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// User routes
router.post("/createOrder", protect, createOrder);
router.get("/getMyOrders", protect, getUserOrders);

// Admin routes
router.get("/getAllOrders", protect, adminOnly, getAllOrders);
router.put("/updateOrderStatus/:id", protect, adminOnly, updateOrderStatus);
router.put("/updatePaymentStatus/:id", protect, adminOnly, updatePaymentStatus);
router.get("/getDashboardStats", protect, adminOnly, getDashboardStats);

module.exports = router;