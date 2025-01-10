require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Add conversation history
let conversationHistory = [];

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Add user message to history
    conversationHistory.push({ role: "user", content: message });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are Neon, a helpful and friendly AI assistant similar to Siri. Keep responses concise, friendly, and conversational. If the user says 'Hey Neon', respond with a friendly greeting. For other queries, provide helpful responses.",
        },
        ...conversationHistory.slice(-5), // Keep last 5 messages for context
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const aiReply = response.choices[0].message.content.trim();

    // Add AI response to history
    conversationHistory.push({ role: "assistant", content: aiReply });

    res.json({
      reply: aiReply,
      history: conversationHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch response from AI" });
  }
});

// Add endpoint to get conversation history
app.get("/api/chat/history", (req, res) => {
  res.json({ history: conversationHistory });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
