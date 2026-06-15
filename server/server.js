const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const customerRoutes = require(
  "./routes/customerRoutes"
);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static("uploads")
);

app.use("/api/auth", authRoutes);
app.use(
  "/api/products",
  productRoutes
);
app.use("/api/orders", orderRoutes);
app.use(
  "/api/customers",
  customerRoutes
);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});