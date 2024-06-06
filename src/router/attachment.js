const express = require("express");
const attachment = require("../controllers/attachmentController");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");

//get
router.route("/").get(isAuthenticated, attachment?.getAttachmentsByUser);
router.route("/").post(isAuthenticated, attachment?.uploadPhoto);
router
  .route("/getRecentAttachments")
  .get(isAuthenticated, attachment?.getRecentAttachments);
router
  .route("/getNearByAttachments")
  .get(isAuthenticated, attachment?.getNearByAttachments);
router
  .route("/addClick/:attachmentId")
  .post(isAuthenticated, attachment?.addClick);
router
  .route("/getPaginatedAttachments")
  .get(isAuthenticated, attachment?.getPaginatedAttachments);
router
  .route("/getPopularAttachments")
  .get(isAuthenticated, attachment?.getPopularAttachments);

module.exports = router;
