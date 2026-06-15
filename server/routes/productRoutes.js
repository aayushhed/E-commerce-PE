const express = require("express");

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const protect = require(
  "../middleware/authMiddleware"
);

const adminOnly = require(
  "../middleware/adminMiddleware"
);

const upload = require(
  "../middleware/uploadMiddleware"
);

const router = express.Router();

// Public
router.get("/", getProducts);

// Admin
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

module.exports = router;