const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    givenTo: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true
    },
    comments: { type: String },
    givenBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true
    },
    rating: { type: Number, required: true }
  },
  { timestamps: true }
);

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
