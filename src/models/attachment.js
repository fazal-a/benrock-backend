const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attachmentSchema = new Schema(
  {
    createdBy: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    type: {
      type: String,
      enum: ["photo", "video"],
      default: "photo"
    },
    clicks: Number,
    path: String,
    thumbnail: String
  },
  { timestamps: true }
);

const attachment = mongoose.model("attachment", attachmentSchema);

module.exports = attachment;
