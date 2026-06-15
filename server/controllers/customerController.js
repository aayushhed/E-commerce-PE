const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get All Customers
const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({
      role: "customer",
    }).select("-password");

    res.json(customers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Customer
const createCustomer = async (req, res) => {
  try {
    const {
      name,
      username,
      phone,
      password,
    } = req.body;

    const userExists =
      await User.findOne({
        username,
      });

    if (userExists) {
      return res.status(400).json({
        message:
          "Username already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const customer =
      await User.create({
        name,
        username,
        phone,
        password: hashedPassword,
        role: "customer",
      });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Customer
const deleteCustomer = async (
  req,
  res
) => {
  try {
    const customer =
      await User.findById(
        req.params.id
      );

    if (!customer) {
      return res.status(404).json({
        message:
          "Customer Not Found",
      });
    }

    await customer.deleteOne();

    res.json({
      message:
        "Customer Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  deleteCustomer,
};