const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT || 5000;
const path = require("path");

const errorHandlerMiddleware = require("./middleware/error_handler");
const connectDB = require("./config/database");
const corsOptions = require("./config/cors");
const credentials = require("./middleware/credentials");

// Connect DB
connectDB();

// Middleware
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/products", require("./routes/api/product"));
app.use("/api/cart", require("./routes/api/cart"));

// 404 handler
app.all(/.*/, (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use(errorHandlerMiddleware);

// Start server when DB ready
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
});
