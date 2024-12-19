const { exec } = require("child_process");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./models/User");
const express = require("express");
const multer = require("multer");
const OpenAI = require("openai");
const fs = require("fs").promises;
const path = require("path");
const ChatLog = require("./models/ChatLogs");
const audioRoutes = require("./routers/audioRoutes");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "-",
});

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://strong-marshmallow-3d72fc.netlify.app/", // Replace with your frontend's URL
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

app.get("/user", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json("Not authenticated");
  }
});

// Other middleware and routes...
app.use("/audio", audioRoutes);

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${stderr}`);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};

const lipSyncMessage = async (message) => {
  const time = new Date().getTime();
  console.log(`Starting conversion for message ${message}`);

  try {
    await execCommand(
      `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
    );
    console.log(`Conversion done in ${new Date().getTime() - time}ms`);

    await execCommand(
      `rhubarb -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`
    );
    console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
  } catch (error) {
    console.error(`Error during lip sync: ${error.message}`);
  }
};

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log(userMessage);

  if (!userMessage) {
    res.send({
      messages: [
        {
          text: "Hey dear... How was your day?",
          audio: await audioFileToBase64("audios/intro_0.wav"),
          lipsync: await readJsonTranscript("audios/intro_0.json"),
          facialExpression: "smile",
          animation: "Talking_2",
        },
        {
          text: "I missed you so much... Please don't go for so long!",
          audio: await audioFileToBase64("audios/intro_1.wav"),
          lipsync: await readJsonTranscript("audios/intro_1.json"),
          facialExpression: "sad",
          animation: "Crying",
        },
      ],
    });
    return;
  }

  if (openai.apiKey === "-") {
    res.send({
      messages: [
        {
          text: "Please my dear, don't forget to add your API keys!",
          audio: await audioFileToBase64("audios/api_0.wav"),
          lipsync: await readJsonTranscript("audios/api_0.json"),
          facialExpression: "angry",
          animation: "Angry",
        },
        {
          text: "You don't want to ruin Wawa Sensei with a crazy ChatGPT bill, right?",
          audio: await audioFileToBase64("audios/api_1.wav"),
          lipsync: await readJsonTranscript("audios/api_1.json"),
          facialExpression: "smile",
          animation: "Laughing",
        },
      ],
    });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1000,
      temperature: 0.6,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: `
          You are a virtual assistant, named neon.
          You will always reply with a JSON array of messages. With a maximum of 1 message only.
          Each message has a text, facialExpression, and animation property.
          The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
          The different animations are: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, and Angry.
          `,
        },
        {
          role: "user",
          content: userMessage || "Hello",
        },
      ],
    });

    let messages = JSON.parse(completion.choices[0].message.content);
    console.log(messages);

    if (messages.messages) {
      messages = messages.messages;
    }

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const speechFile = path.resolve(`audios/message_${i}.mp3`);
      const textInput = message.text;

      try {
        const speechResponse = await openai.audio.speech.create({
          model: "tts-1",
          voice: "echo",
          input: textInput,
        });

        const buffer = Buffer.from(await speechResponse.arrayBuffer());
        await fs.writeFile(speechFile, buffer);

        // Generate lipsync data
        await lipSyncMessage(i);
        message.audio = await audioFileToBase64(speechFile);
        message.lipsync = await readJsonTranscript(`audios/message_${i}.json`);
      } catch (error) {
        console.error(`Error processing message ${i}: ${error.message}`);
      }
    }

    res.send({ messages });

    await ChatLog.findOneAndUpdate(
      { question: userMessage }, // Look for an entry where the question matches the user's input
      {
        $set: { response: messages[0]?.text || "No response generated" }, // Update the response field
        $inc: { count: 1 }, // Increment the count field by 1
      },
      { upsert: true, new: true } // Create a new document if not found
    );
  } catch (error) {
    console.error(`Error generating completion: ${error.message}`);
    res
      .status(500)
      .send({ error: "An error occurred while generating the response." });
  }
});

app.get("/stats", async (req, res) => {
  try {
    const stats = await ChatLog.aggregate([
      {
        $group: {
          _id: null, // Group all records together
          questionCount: { $sum: 1 }, // Count unique questions (1 per record)
          totalResponses: { $sum: `$count` }, // Sum up the `count` field across all records
        },
      },
    ]);

    const questions = await ChatLog.find(
      {},
      "question response count createdAt"
    ); // Fetch all questions

    const result = stats[0] || { questionCount: 0, totalResponses: 0 }; // Handle empty database
    res.send({
      questionCount: result.questionCount,
      answerCount: result.totalResponses,
      questions, // Add the questions to the response
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).send({ error: "Failed to fetch statistics." });
  }
});

const readJsonTranscript = async (file) => {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON transcript: ${error.message}`);
    throw error;
  }
};

const audioFileToBase64 = async (file) => {
  try {
    const data = await fs.readFile(file);
    return data.toString("base64");
  } catch (error) {
    console.error(`Error converting audio file to base64: ${error.message}`);
    throw error;
  }
};

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      const passwordMatch = bcrypt.compare(password, user.password);
      if (passwordMatch) {
        req.session.user = { id: user._id, name: user.name, email: user.email };
        // console.log(email);
        console.log(user.name);
        res.json("Success");
      } else {
        res.status(401).json("Password doesn't match");
      }
    } else {
      res.status(404).json("No Records found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: "Failed to logout" });
      } else {
        res.status(200).json("Logout successful");
      }
    });
  } else {
    res.status(400).json({ error: "No session found" });
  }
});

app.get("/user", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json("Not authenticated");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
