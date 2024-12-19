const express = require("express");
const router = express.Router();
const {
  uploadAudio,
  transcribeAudio,
} = require("../controllers/audioController");

// Route for uploading and transcribing audio
router.post("/upload-audio", uploadAudio, transcribeAudio);

module.exports = router;
