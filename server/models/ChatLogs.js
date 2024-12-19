const mongoose = require("mongoose");

const chatLogSchema = new mongoose.Schema({
  count: { type: Number, default: 1 }, // Add a default count field
  question: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatLog = mongoose.model("ChatLog", chatLogSchema);

module.exports = ChatLog;
