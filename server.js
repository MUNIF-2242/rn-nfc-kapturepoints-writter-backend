const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const textractRoutes = require("./routes/textractRoutes");

dotenv.config();
connectDB(); // connect to MongoDB

const app = express();
app.use(express.json({ limit: "50mb" }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/extract", textractRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
