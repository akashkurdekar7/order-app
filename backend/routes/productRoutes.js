const express = require("express");
const { addProduct, getProducts, deleteProduct, updateProduct } = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, addProduct);
router.get("/", getProducts);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.put("/:id", protect, adminOnly, updateProduct);
module.exports = router;