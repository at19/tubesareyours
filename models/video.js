const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const videoSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Video", videoSchema);
