const chatService = require("../services/chatService");
const ChatLog = require("../models/ChatLogs");
const audioService = require("../services/audioService");

const chatController = {
  handleChat: async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.send({
        messages: [
          {
            text: "Hey dear... How was your day?",
            audio: await audioService.getAudioBase64("audios/intro_0.wav"),
            lipsync: await audioService.getJsonTranscript(
              "audios/intro_0.json"
            ),
            facialExpression: "smile",
            animation: "Talking_2",
          },
          // Add other default messages if needed
        ],
      });
    }

    try {
      const response = await chatService.generateResponse(userMessage);
      const messages = await audioService.processMessages(response);

      res.send({ messages });

      // Log the chat
      await ChatLog.findOneAndUpdate(
        { question: userMessage },
        {
          $set: { response: messages[0]?.text || "No response generated" },
          $inc: { count: 1 },
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error(`Error generating completion: ${error.message}`);
      res
        .status(500)
        .send({ error: "An error occurred while generating the response." });
    }
  },
};

module.exports = chatController;
