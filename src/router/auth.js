const express = require("express");
const auth = require("../controllers/authController");
const router = express.Router();

//post
router.route("/register").post(auth.register);
// router.route("/createRole").post(auth.createRole);
router.route("/login").post(auth.login);
router.route("/getUsers").get(auth.getUsers);
router.route("/requestEmailToken").post(auth.requestEmailToken);
router.route("/verifyEmail").post(auth.verifyEmail);
 router.route("/forgotPassword").post(auth.forgotPassword);
// //put
router.route("/resetPassword").post(auth.resetPassword);
// router.route("/updatePassword").put(isAuthenticated, auth.updatePassword);

module.exports = router;
