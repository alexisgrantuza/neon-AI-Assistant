import React, { useEffect, useState, useCallback, useRef } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const speechSynthesis = window.speechSynthesis;

// Configure recognition for short-term listening
recognition.continuous = false;
recognition.interimResults = true;
recognition.lang = "en-US";

// Separate recognition instance for wake word detection
const wakeWordRecognition = new SpeechRecognition();
wakeWordRecognition.continuous = true;
wakeWordRecognition.interimResults = false;
wakeWordRecognition.lang = "en-US";

const SpeechRecognitionComponent = () => {
  const [status, setStatus] = useState("idle");
  const [commandBuffer, setCommandBuffer] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const recognitionRef = useRef(null);
  const processingRef = useRef(false);
  const conversationRef = useRef(null);

  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = resolve;
      speechSynthesis.speak(utterance);
    });
  }, []);

  const startCommandRecognition = useCallback(() => {
    try {
      recognition.start();
      setStatus("listening");
      processingRef.current = true;
    } catch (error) {
      console.error("Error starting command recognition:", error);
    }
  }, []);

  const processCommand = useCallback(
    async (command) => {
      try {
        setStatus("processing");
        const response = await fetch("http://localhost:3001/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `User said: ${command}. Respond in a friendly, Siri-like manner.`,
          }),
        });

        const data = await response.json();
        setConversationHistory(data.history);
        setStatus("responding");
        await speak(data.reply);

        // Reset everything after response
        setStatus("idle");
        setCommandBuffer("");
        processingRef.current = false;
        startWakeWordListening();

        // Scroll to bottom of conversation
        if (conversationRef.current) {
          conversationRef.current.scrollTop =
            conversationRef.current.scrollHeight;
        }
      } catch (error) {
        console.error("Error processing command:", error);
        await speak("Sorry, I encountered an error processing your request.");
        setStatus("idle");
        processingRef.current = false;
        startWakeWordListening();
      }
    },
    [speak]
  );

  const startWakeWordListening = useCallback(() => {
    try {
      if (!recognitionRef.current && !processingRef.current) {
        wakeWordRecognition.start();
        recognitionRef.current = true;
        setStatus("idle");
      }
    } catch (error) {
      console.error("Error starting wake word recognition:", error);
    }
  }, []);

  // Handle wake word detection
  useEffect(() => {
    wakeWordRecognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

      if (transcript.includes("hey neon")) {
        wakeWordRecognition.stop();
        recognitionRef.current = false;

        // Process the wake word as a command to get an initial response
        await processCommand("Hey Neon");

        // Then start listening for the actual command
        startCommandRecognition();
      }
    };

    wakeWordRecognition.onend = () => {
      recognitionRef.current = false;
      if (!processingRef.current) {
        startWakeWordListening();
      }
    };

    return () => {
      wakeWordRecognition.stop();
    };
  }, [speak, startCommandRecognition, startWakeWordListening, processCommand]);

  // Handle command recognition
  useEffect(() => {
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setCommandBuffer(transcript);

      if (event.results[event.results.length - 1].isFinal) {
        recognition.stop();
        processCommand(transcript);
      }
    };

    recognition.onend = () => {
      if (!processingRef.current) {
        startWakeWordListening();
      }
    };

    recognition.onerror = async (event) => {
      console.error("Speech Recognition Error:", event.error);
      if (event.error === "not-allowed") {
        await speak("Please enable microphone access to use voice commands.");
      }
      startWakeWordListening();
    };

    // Start wake word detection on mount
    startWakeWordListening();

    return () => {
      recognition.stop();
      wakeWordRecognition.stop();
      speechSynthesis.cancel();
    };
  }, [processCommand, speak, startWakeWordListening]);

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-center gap-4">
      {/* Conversation History */}
      <div
        ref={conversationRef}
        className="bg-white/90 rounded-lg shadow-lg p-4 mb-4 max-h-96 w-80 overflow-y-auto"
      >
        {conversationHistory.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-100 ml-auto max-w-[80%]"
                : msg.role === "assistant"
                ? "bg-gray-100 mr-auto max-w-[80%]"
                : ""
            }`}
          >
            <p className="text-sm">
              {msg.role === "user" ? "You: " : "Neon: "}
              {msg.content
                .replace("User said: ", "")
                .replace(". Respond in a friendly, Siri-like manner", "")}
            </p>
          </div>
        ))}
      </div>

      {/* Status Indicator */}
      <div
        className={`
          w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
          ${status === "idle" ? "bg-blue-500 hover:bg-blue-600" : ""}
          ${
            status === "listening" ? "bg-green-500 animate-pulse scale-110" : ""
          }
          ${status === "processing" ? "bg-yellow-500 animate-spin" : ""}
          ${status === "responding" ? "bg-purple-500 animate-pulse" : ""}
        `}
      >
        <div className="text-white text-2xl">
          {status === "listening" ? "🎤" : "🔊"}
        </div>
      </div>

      {/* Status Text */}
      <div className="text-sm font-medium text-gray-700 bg-white/80 px-3 py-1 rounded-full shadow-sm">
        {status === "idle" && "Say 'Hey Neon'"}
        {status === "listening" && "Listening..."}
        {status === "processing" && "Processing..."}
        {status === "responding" && "Responding..."}
      </div>

      {/* Current Command Buffer */}
      {commandBuffer && (
        <div className="bg-white p-3 rounded-lg shadow-lg max-w-xs animate-fade-in">
          <p className="text-gray-700">{commandBuffer}</p>
        </div>
      )}
    </div>
  );
};

export default SpeechRecognitionComponent;
