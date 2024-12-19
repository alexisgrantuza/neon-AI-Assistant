import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useChat } from "../hooks/useChat";

export function ConversationArea({ hidden }) {
  const [conversations, setConversations] = useState([]);
  const messagesEndRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const { chat, loading, message } = useChat();

  const handleMicClick = () => {
    if (isActive) {
      mediaRecorder.stop();
      setIsActive(false);
    } else {
      startRecording();
      setIsActive(true);
    }
  };

  const startRecording = () => {
    setAudioBlob(null);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          setAudioBlob(event.data);
        };
        recorder.start();
        setMediaRecorder(recorder);
      })
      .catch((err) => {
        console.error("Error accessing audio device:", err);
      });
  };

  const sendAudioToBackend = async () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.mp3");

      try {
        const response = await fetch(
          "http://localhost:3001/audio/upload-audio",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        setConversations((prev) => [
          ...prev,
          { sender: "user", text: result.transcription },
        ]);

        await chat(result.transcription);
      } catch (error) {
        console.error("Error sending audio to backend:", error);
      }
    }
  };

  useEffect(() => {
    if (!isActive && audioBlob) {
      sendAudioToBackend();
    }
  }, [isActive, audioBlob]);

  useEffect(() => {
    if (message) {
      setConversations((prevConversations) => [
        ...prevConversations,
        { sender: "AI", text: message.text },
      ]);
    }
  }, [message]);

  if (hidden) {
    return null;
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations]);

  return (
    <div className="fixed z-10 left-0 right-0 flex flex-col items-center justify-center h-screen p-4">
      <motion.div
        layout
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-xl bg-transparent rounded-lg shadow-lg p-6 flex flex-col justify-between h-[500px]"
      >
        <div
          className="flex-grow overflow-y-auto mb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {conversations.length === 0 ? (
            <p className="text-white text-center">
              No messages yet. Start the conversation!
            </p>
          ) : (
            conversations.map((conversation, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`flex items-start p-3 my-2 rounded-xl max-w-[80%] shadow-md ${
                  conversation.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white self-end flex-row-reverse ml-32 flex items-center"
                    : "bg-gradient-to-r from-gray-200 to-gray-300 text-black self-start flex items-center"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-${
                    conversation.sender === "user" ? "green-400" : "blue-400"
                  } to-${
                    conversation.sender === "user" ? "teal-500" : "blue-500"
                  } text-white`}
                >
                  {conversation.sender === "user" ? "U" : "AI"}
                </div>
                <div
                  className="ml-6 flex-1 break-words overflow-hidden"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {conversation.text}
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleMicClick}
            className={`flex items-center justify-center h-16 w-16 rounded-full shadow-md ${
              isActive ? "bg-green-500 text-white" : "bg-black text-white"
            }`}
            aria-label="Record audio"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-mic"
              viewBox="0 0 16 16"
            >
              <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
              <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3" />
            </svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
