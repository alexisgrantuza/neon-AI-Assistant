import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useChat } from "../hooks/useChat";

export function ConversationArea({ hidden }) {
  const [conversations, setConversations] = useState([]);
  const input = useRef();
  const ref = useRef(null);
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
          "https://neon-ai-assistant.onrender.com/audio/upload-audio",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        // Add transcription to conversations as a user message
        setConversations((prev) => [
          ...prev,
          { sender: "user", text: result.transcription },
        ]);

        // Optionally, send the transcription to the AI for a response
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

  // Function to handle sending messages
  const sendMessage = async () => {
    const text = input.current.value.trim();
    if (text && !loading) {
      // Add user's message
      setConversations([...conversations, { sender: "user", text }]);
      input.current.value = "";

      // Reset textarea height to default
      input.current.style.height = "22px"; // or whatever your default height should be

      // Send user's message to the chat API
      await chat(text);
    }
  };

  // Update conversation with AI's response when it arrives
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

  // Function to adjust the height of the textarea
  const adjustTextareaHeight = () => {
    const textarea = input.current;
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set it to the scroll height
  };

  return (
    <div className="fixed z-10 left-0 right-0 flex flex-col items-end justify-center h-screen p-4 mr-24">
      <motion.div
        layout
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-2xl bg-transparent rounded-lg shadow-lg p-6 flex flex-col justify-between h-[650px]"
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

        <div className="flex w-full flex-col rounded-[26px] p-1.5 transition-colors bg-[#f4f4f4] dark:bg-neutral-800 justify-center">
          <div className="flex items-end gap-1.5 md:gap-2">
            <div className="relative">
              <button
                onClick={handleMicClick}
                className={`flex items-center justify-center h-8 w-8 rounded-full mb-1 ml-1.5 mt-1 ${
                  isActive
                    ? "bg-green-500 text-white"
                    : "text-neutral-900 dark:text-white"
                }`}
                aria-label="Attach files"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-mic"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
                  <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3" />
                </svg>
              </button>
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <textarea
                id="prompt-textarea"
                rows="1"
                ref={input}
                placeholder="Type your question..."
                className="m-0 resize-none border-0 bg-transparent px-0 text-neutral-900 dark:text-white outline-none focus:ring-0 focus-visible:ring-0 max-h-[25vh] mb-2.5"
                spellCheck="false"
                style={{ height: "auto", overflowY: "hidden" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent default Enter behavior
                    sendMessage();
                  }
                }}
                onInput={adjustTextareaHeight} // Adjust height on input
              ></textarea>
            </div>
            <motion.button
              disabled={loading}
              onClick={sendMessage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Send prompt"
              className="mb-1 me-1 mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black disabled:bg-[#D7D7D7] disabled:text-neutral-400 hover:opacity-70 focus-visible:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
