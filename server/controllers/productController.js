const Product = require("../models/Product");

// Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      unit: req.body.unit || "Case",
      price: req.body.price,
      stock: req.body.stock,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    product.name =
      req.body.name || product.name;

    product.brand =
      req.body.brand || product.brand;

    product.category =
      req.body.category ||
      product.category;

    product.unit =
      req.body.unit || product.unit;

    product.price =
      req.body.price || product.price;

    product.stock =
      req.body.stock || product.stock;

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};