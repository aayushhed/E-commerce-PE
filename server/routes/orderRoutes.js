const express = require("express");

const {
createOrder,
getMyOrders,
getAllOrders,
updateOrderStatus,
deleteOrder,
createManualOrder,
downloadOrderPDF,
getDashboardStats,
shareOrderWhatsApp,
} = require("../controllers/orderController");

const protect = require(
"../middleware/authMiddleware"
);

const adminOnly = require(
"../middleware/adminMiddleware"
);

const router = express.Router();

// Customer Order
router.post(
"/",
protect,
createOrder
);

// Customer Order History
router.get(
"/my-orders",
protect,
getMyOrders
);

// Admin Manual Order
router.post(
"/manual",
protect,
adminOnly,
createManualOrder
);

// Admin View All Orders
router.get(
"/all",
protect,
adminOnly,
getAllOrders
);

// Admin Dashboard Stats
router.get(
"/dashboard/stats",
protect,
adminOnly,
getDashboardStats
);

// Admin Update Status
router.put(
"/:id/status",
protect,
adminOnly,
updateOrderStatus
);

// Admin Delete Order
router.delete(
"/:id",
protect,
adminOnly,
deleteOrder
);

// Download PDF
router.get(
"/:id/pdf",
protect,
downloadOrderPDF
);

// WhatsApp Share Link
router.get(
"/:id/whatsapp",
protect,
adminOnly,
shareOrderWhatsApp
);

module.exports = router;
