const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: "./src/config/config.env"
});

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect("mongodb+srv://osamawaseem692:J21UyXsga2Bbs5Gr@trackkrr.apvgk4z.mongodb.net/socio");
    console.log("\x1b[32m%s\x1b[0m", "Database Connected " + connection.host);
  } catch (error) {
    console.log("Error connecting database: " + error);
    process.exit(1);
  }
};

module.exports = connectDB;
