const express = require("express");
const app = express();
const cors = require("cors");
require("./connection/conn");
const path = require("path");
const auth = require("./routes/auth");
const list = require("./routes/list");

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/v1", auth);
app.use("/api/v2", list);

// Serve Static Files
app.use(express.static(path.resolve(__dirname, "frontend", "build")));

// SPA Routing
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

// Export the Express app for Vercel to handle serverless routing
module.exports = app;
