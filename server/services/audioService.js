const fs = require("fs").promises;
const OpenAI = require("openai");
const path = require("path");
const { exec } = require("child_process");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "-",
});

const audioService = {
  getAudioBase64: async (file) => {
    try {
      const data = await fs.readFile(file);
      return data.toString("base64");
    } catch (error) {
      console.error(`Error converting audio file to base64: ${error.message}`);
      throw error;
    }
  },

  getJsonTranscript: async (file) => {
    try {
      const data = await fs.readFile(file, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading JSON transcript: ${error.message}`);
      throw error;
    }
  },

  execCommand: (command) => {
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
  },

  lipSyncMessage: async (message) => {
    const time = new Date().getTime();
    console.log(`Starting conversion for message ${message}`);

    try {
      await audioService.execCommand(
        `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
      );
      console.log(`Conversion done in ${new Date().getTime() - time}ms`);

      await audioService.execCommand(
        `rhubarb -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`
      );
      console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
    } catch (error) {
      console.error(`Error during lip sync: ${error.message}`);
    }
  },

  processMessages: async (messages) => {
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const speechFile = path.resolve(`audios/message_${i}.mp3`);

      try {
        const speechResponse = await openai.audio.speech.create({
          model: "tts-1",
          voice: "echo",
          input: message.text,
        });

        const buffer = Buffer.from(await speechResponse.arrayBuffer());
        await fs.writeFile(speechFile, buffer);

        await audioService.lipSyncMessage(i);
        message.audio = await audioService.getAudioBase64(
          `audios/message_${i}.mp3`
        );
        message.lipsync = await audioService.getJsonTranscript(
          `audios/message_${i}.json`
        );
      } catch (error) {
        console.error(`Error processing message ${i}: ${error.message}`);
      }
    }
    return messages;
  },
};

module.exports = audioService;
