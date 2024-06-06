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
    clicks: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
      path: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
  },
  { timestamps: true }
);

const attachment = mongoose.model("attachment", attachmentSchema);

module.exports = attachment;
