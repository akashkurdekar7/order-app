const express = require("express");
const { registerUser, loginUser, getUserDetails, getAllUsers } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserDetails);
router.get("/getUsers", protect, adminOnly, getAllUsers);

module.exports = router;