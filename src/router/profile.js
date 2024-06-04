const express = require("express");
const profile = require("../controllers/profileController");
const router = express.Router();
const uploadImages = require("../middleware/uploadImage");
const isAuthenticated = require("../middleware/auth");

//get
router.route("/").get(isAuthenticated, profile?.getProfile);
// put
router.route("/").put(isAuthenticated, profile?.updateProfile);
router.route("/upload").post(isAuthenticated,profile.updateProfilePhoto);
router.route("/delete-picture").delete(isAuthenticated,profile?.deleteProfilePicture);

module.exports = router;
