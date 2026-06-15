const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const generateOrderPDF = require("../utils/generatePDF");
const generateWhatsAppLink = require("../utils/whatsapp");

// Customer Order
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product Not Found",
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });
    }

    const order = await Order.create({
      customer: req.user._id,
      customerName: req.user.name,
      customerPhone: req.user.phone,
      items: orderItems,
      totalAmount,
      createdBy: "customer",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Customer Order History
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin View All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "customer",
      "name username phone"
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin Update Status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order Not Found",
      });
    }

    order.status = req.body.status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin Delete Order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order Not Found",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      message: "Order Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin Manual Order
const createManualOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, items } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product Not Found",
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });
    }

    const order = await Order.create({
      customerName,
      customerPhone,
      items: orderItems,
      totalAmount,
      createdBy: "admin",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Download PDF
const downloadOrderPDF = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order Not Found",
      });
    }

    generateOrderPDF(order, res);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const deliveredOrders = await Order.countDocuments({
      status: "Delivered",
    });

    const revenueOrders = await Order.find({
      status: "Delivered",
    });

    let totalRevenue = 0;
    revenueOrders.forEach((order) => {
      totalRevenue += order.totalAmount;
    });

    res.json({
      totalOrders,
      totalCustomers,
      deliveredOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// WhatsApp Share
const shareOrderWhatsApp = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order Not Found",
      });
    }

    const whatsappLink = generateWhatsAppLink(
      order.customerPhone,
      order._id
    );

    res.json({
      whatsappLink,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  createManualOrder,
  downloadOrderPDF,
  getDashboardStats,
  shareOrderWhatsApp,
};
