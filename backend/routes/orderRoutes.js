const express = require("express");
const {
    createOrder,
    getMyOrders, // Changed from getUserOrders
    getAllOrders,
    updateOrderStatus,
    getDashboardStats,
    getSalesReports,
    updatePaymentStatus,
    uploadScreenshot // Added
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware"); // Added multer import

const router = express.Router();

// User routes
router.post("/createOrder", protect, createOrder);
router.get("/getMyOrders", protect, getMyOrders); // Updated to use getMyOrders
router.put("/uploadScreenshot/:id", protect, upload.single("screenshot"), uploadScreenshot); // Added new route

// Admin routes
router.get("/getAllOrders", protect, adminOnly, getAllOrders);
router.put("/updateOrderStatus/:id", protect, adminOnly, updateOrderStatus);
router.put("/updatePaymentStatus/:id", protect, adminOnly, updatePaymentStatus);
router.get("/getDashboardStats", protect, adminOnly, getDashboardStats);
router.get("/getSalesReports", protect, adminOnly, getSalesReports);

module.exports = router;