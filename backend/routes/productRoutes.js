const express = require("express");
const { addProduct, getProducts, deleteProduct, updateProduct } = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/addProduct", protect, adminOnly, addProduct);
router.get("/getProducts", getProducts);
router.delete("/deleteProduct/:id", protect, adminOnly, deleteProduct);
router.put("/updateProduct/:id", protect, adminOnly, updateProduct);
module.exports = router;