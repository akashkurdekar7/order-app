const express = require("express");
const { registerUser, loginUser, getUserDetails, getAllUsers, updateProfile } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/userDetails", protect, getUserDetails);
router.put("/updateProfile", protect, upload.single("image"), updateProfile);
router.get("/getUsers", protect, adminOnly, getAllUsers);

module.exports = router;