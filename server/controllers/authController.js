const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Admin Creates Customer
const createCustomer = async (req, res) => {
  try {
    const { name, username, phone, password } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await User.create({
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

// Login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
      token: generateToken(
        user._id,
        user.role
      ),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createCustomer,
  loginUser,
};