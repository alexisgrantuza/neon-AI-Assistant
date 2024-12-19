import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";

export function ConversationArea() {
  const [active, setActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const ref = useRef(null);
  const messagesEndRef = useRef(null);

  useOutsideClick(ref, () => {
    setActive(false);
    setMessages([]); // Reset the conversation
  });

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: "user" }]);
      setInputValue("");

      // Simulate AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text:
              "This is an AI response. " +
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(
                3
              ),
            sender: "ai",
          },
        ]);
      }, 1000);
    }
  };

  const handleButtonClick = () => {
    setActive(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Automatically scroll to the bottom of the conversation when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen p-4">
      <AnimatePresence>
        {!active ? (
          <motion.button
            key="openButton"
            layout
            animate={{ opacity: 1, y: 0 }}
            onClick={handleButtonClick}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg hover:shadow-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
          >
            Open Conversation
          </motion.button>
        ) : (
          <motion.div
            key="conversation"
            ref={ref}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 flex flex-col justify-between h-[500px]"
          >
            <div
              className="flex-grow overflow-y-auto mb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {messages.length === 0 ? (
                <p className="text-neutral-600 dark:text-neutral-400 text-center">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-start p-3 my-2 rounded-xl max-w-[80%] shadow-md ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white self-end flex-row-reverse ml-32 flex items-center"
                        : "bg-gradient-to-r from-gray-200 to-gray-300 text-black self-start flex items-center"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-teal-500 text-white ${
                        message.sender === "user" ? "ml-6" : ""
                      }`}
                    >
                      {message.sender === "user" ? "U" : "AI"}
                    </div>
                    <div className="ml-6 break-words max-h-[200px] overflow-y-auto">
                      {message.text}
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
                    className="flex items-center justify-center h-8 w-8 rounded-full text-neutral-900 dark:text-white focus-visible:outline-black dark:focus-visible:outline-white mb-1 ml-1.5 mt-1"
                    aria-label="Attach files"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M9 7a5 5 0 0 1 10 0v8a7 7 0 1 1-14 0V9a1 1 0 0 1 2 0v6a5 5 0 0 0 10 0V7a3 3 0 1 0-6 0v8a1 1 0 1 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 1 1-6 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <textarea
                    id="prompt-textarea"
                    rows="1"
                    placeholder="Message ChatGPT"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown} // Add this line
                    className="m-0 resize-none border-0 bg-transparent px-0 text-neutral-900 dark:text-white outline-none focus:ring-0 focus-visible:ring-0 max-h-[100px] overflow-y-auto"
                    spellCheck="false"
                    style={{ height: "30px", overflowY: "hidden" }}
                  ></textarea>
                </div>
                <motion.button
                  onClick={handleSendMessage}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Send prompt"
                  disabled={!inputValue.trim()}
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
        )}
      </AnimatePresence>
    </div>
  );
}
