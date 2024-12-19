const fs = require("fs");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const multer = require("multer");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "-",
});

// Configure Multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const uploadAudio = upload.single("audio");

const transcribeAudio = async (req, res) => {
  const audioPath = req.file.path; // Path to the uploaded audio file

  try {
    // Create transcription using Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
    });

    console.log(transcription.text);

    // Return the transcription text to the frontend
    res.json({
      transcription: transcription.text,
      message: "Audio uploaded and transcribed successfully!",
    });

    // Optionally, delete the file after transcription
    fs.unlinkSync(audioPath);
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).send("Error transcribing audio");
  }
};

module.exports = {
  uploadAudio,
  transcribeAudio,
};
