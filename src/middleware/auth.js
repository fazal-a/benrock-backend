const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv");
// import DatabaseConnection from "../database/connection";
dotenv.config({ path: ".././src/config/config.env" });

// const UserRepository = DatabaseConnection.getRepository(User);
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.emailVerified) {
      return res.status(401).json({ success: false, message: "Email not verified" });
    }
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = isAuthenticated;
