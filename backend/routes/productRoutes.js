const express = require("express");
const { addProduct, getProducts, deleteProduct, updateProduct } = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware");
const router = express.Router();

router.post("/addProduct", protect, adminOnly, upload.single("image"), addProduct);
router.get("/getProducts", getProducts);
router.delete("/deleteProduct/:id", protect, adminOnly, deleteProduct);
router.put("/updateProduct/:id", protect, adminOnly, upload.single("image"), updateProduct);
module.exports = router;