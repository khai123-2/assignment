require("dotenv").config();
const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connect MongoDB successfully");
  } catch {
    console.log("Connect MongoDB failed");
  }
}

module.exports = { connect };
