const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
console.log("MONGO_URI:", process.env.MONGO_URI);


const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// API
app.use("/api", bookRoutes);

// Serve frontend (single deploy, simple)
app.use(express.static(path.join(__dirname, "../../frontend")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

connectDB(process.env.MONGO_URI).then(() => {
  console.log("Database connected successfully");
});
