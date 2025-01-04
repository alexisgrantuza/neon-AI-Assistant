const express = require("express");
const router = express.Router();
const ChatLog = require("../models/ChatLogs");

router.get("/", async (req, res) => {
  try {
    const stats = await ChatLog.aggregate([
      {
        $group: {
          _id: null,
          questionCount: { $sum: 1 },
          totalResponses: { $sum: "$count" },
        },
      },
    ]);

    const questions = await ChatLog.find(
      {},
      "question response count createdAt"
    );

    const result = stats[0] || { questionCount: 0, totalResponses: 0 };

    res.send({
      questionCount: result.questionCount,
      answerCount: result.totalResponses,
      questions,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).send({ error: "Failed to fetch statistics." });
  }
});

module.exports = router;
