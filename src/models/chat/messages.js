const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "chat",
      required: true
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    message: {
      type: String,
      required: true
    },

    messageType: {
      type: String,
      required: true
    },
    attachments: [],
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("message", messageSchema);
