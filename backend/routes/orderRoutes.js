const express = require("express");
const {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    getDashboardStats,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// User routes
router.post("/", protect, createOrder);
router.get("/my", protect, getUserOrders);

// Admin routes
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id", protect, adminOnly, updateOrderStatus);
router.get("/dashboard", protect, adminOnly, getDashboardStats);

module.exports = router;