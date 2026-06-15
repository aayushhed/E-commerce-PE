const express = require("express");

const {
  getCustomers,
  createCustomer,
  deleteCustomer,
} = require(
  "../controllers/customerController"
);

const protect = require(
  "../middleware/authMiddleware"
);

const adminOnly = require(
  "../middleware/adminMiddleware"
);

const router = express.Router();

router.get(
  "/",
  protect,
  adminOnly,
  getCustomers
);

router.post(
  "/",
  protect,
  adminOnly,
  createCustomer
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCustomer
);

module.exports = router;