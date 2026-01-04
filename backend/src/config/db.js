const mongoose = require("mongoose");

async function connectDB(mongoUri) {
  if (!mongoUri) {
    console.error("MongoDB connection failed: MONGO_URI is missing.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
