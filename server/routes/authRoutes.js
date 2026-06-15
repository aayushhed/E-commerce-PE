const express = require("express");

const {
  createCustomer,
  loginUser,
} = require("../controllers/authController");

const protect = require(
  "../middleware/authMiddleware"
);

const adminOnly = require(
  "../middleware/adminMiddleware"
);

const router = express.Router();

router.post("/login", loginUser);

router.post(
  "/create-customer",
  protect,
  adminOnly,
  createCustomer
);

module.exports = router;