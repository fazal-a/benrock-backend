import jwt from "jsonwebtoken";
import User = require("../models/user");
import dotenv from "dotenv";
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
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default isAuthenticated;
