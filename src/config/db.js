const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: "./src/config/config.env"
});

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect("mongodb+srv://fazal:Ethan%40786%21%40%23@cluster0.n5f37ce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("\x1b[32m%s\x1b[0m", "Database Connected " + connection.host);
  } catch (error) {
    console.log("Error connecting database: " + error);
    process.exit(1);
  }
};

module.exports = connectDB;
