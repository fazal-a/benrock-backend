const Review = require("../models/review");

const getUserReviews = async (req, res) => {
  let user = req?.user?._id;
  let id = req?.query?.givenTo;
  const reviews = await Review.find({
    givenTo: id || user
  }).populate({
    path: "givenBy",
    select: "name email photo"
  });
  res.json(reviews);
};

const createReview = async (req, res) => {
  const review = await Review.create({
    ...req.body,
    givenBy: req?.user?._id
  });

  res.json(review);
};

module.exports = {
  getUserReviews,
  createReview
};
