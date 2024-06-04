const express = require("express");
const reviewController = require("../controllers/reviewController");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");

//get
router.route("/").get(isAuthenticated, reviewController?.getUserReviews);
router.route("/").post(isAuthenticated, reviewController?.createReview);

module.exports = router;
