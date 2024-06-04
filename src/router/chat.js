const express = require("express");
const chat = require("../controllers/chatController");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");

//get
router.route("/").get(isAuthenticated, chat?.getChats);
router.route("/getOne/:id").get(isAuthenticated, chat?.getChat);
router.route("/contacts").get(isAuthenticated, chat?.getContacts);
router.route("/").post(isAuthenticated, chat?.createChat);
router.route("/send-message").post(isAuthenticated, chat?.sendMessage);

module.exports = router;
