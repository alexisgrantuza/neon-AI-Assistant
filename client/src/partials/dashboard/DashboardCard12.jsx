import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs"; // Install this library for easier date manipulation
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

function DashboardCard12() {
  const [stats, setStats] = useState({ questionCount: 0, answerCount: 0 });
  const [groupedQuestions, setGroupedQuestions] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:3001/stats");
        const data = await response.json();
        setStats(data);

        // Add `showDropdown` property and sort by date
        const questions = data.questions.map((q) => ({
          ...q,
          showDropdown: false,
        }));

        groupQuestions(questions);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const groupQuestions = (questions) => {
    const grouped = {
      today: [],
      yesterday: [],
      last7Days: [],
    };

    questions.forEach((q) => {
      const createdAt = dayjs(q.createdAt);

      if (createdAt.isToday()) {
        grouped.today.push(q);
      } else if (createdAt.isYesterday()) {
        grouped.yesterday.push(q);
      } else if (dayjs().diff(createdAt, "day") <= 7) {
        grouped.last7Days.push(q);
      }
    });

    setGroupedQuestions(grouped);
  };

  const toggleDropdown = (index, category) => {
    setGroupedQuestions((prevGrouped) => ({
      ...prevGrouped,
      [category]: prevGrouped[category].map((q, i) =>
        i === index ? { ...q, showDropdown: !q.showDropdown } : q
      ),
    }));
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-sm rounded-xl py-2">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Activity Overview
        </h2>
      </header>
      <div className="p-6 flex justify-around items-center">
        {/* Question Count */}
        <div className="text-center">
          <div className="text-4xl font-bold text-violet-500">
            {stats.questionCount}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Questions
          </div>
        </div>
        {/* Answer Count */}
        <div className="text-center">
          <div className="text-4xl font-bold text-green-500">
            {stats.answerCount}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Answers
          </div>
        </div>
      </div>

      {/* Render Grouped Questions */}
      {Object.entries(groupedQuestions).map(([group, questions]) => (
        <div key={group}>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
            {group === "today" && "Today"}
            {group === "yesterday" && "Yesterday"}
            {group === "last7Days" && "Last 7 Days"}
          </header>
          <ul className="my-1">
            {questions.map((q, index) => (
              <li className="flex px-2 flex-col" key={index}>
                <div className="flex items-center">
                  <div className="w-9 h-9 rounded-full shrink-0 bg-violet-500 my-2 mr-3">
                    <svg
                      className="w-9 h-9 fill-current text-white"
                      viewBox="0 0 36 36"
                    >
                      <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
                    </svg>
                  </div>
                  <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                    <div className="grow flex justify-between">
                      <div className="self-center">
                        <span className="text-gray-800 dark:text-gray-100 font-bold">
                          Question:
                        </span>{" "}
                        <span className="text-gray-800 dark:text-gray-100">
                          {q.question}
                        </span>
                      </div>
                      <div className="shrink-0 self-end ml-2">
                        <button
                          className="font-medium text-violet-500 hover:text-violet-600 dark:hover:text-violet-400"
                          onClick={() => toggleDropdown(index, group)}
                        >
                          {q.showDropdown ? "Hide" : "View"}{" "}
                          <span className="hidden sm:inline">-&gt;</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Dropdown with Framer Motion Animation */}
                <AnimatePresence>
                  {q.showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="bg-gradient-to-r from-gray-100 via-purple-200 to-gray-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 p-3 rounded-md mt-2 mb-2 shadow-lg"
                    >
                      {/* Header Section */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-block text-xs bg-violet-500 text-white px-2 py-1 rounded-full">
                            {q.status || "Answered"}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {dayjs(q.createdAt).fromNow()}
                          </span>
                        </div>
                        <div>
                          <svg
                            className="w-5 h-5 text-violet-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9a3 3 0 016 0H5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Response Section */}
                      <p className="text-gray-700 dark:text-gray-200 text-sm whitespace-pre-line">
                        {q.response || "No response available"}
                      </p>

                      {/* Expandable Metadata */}
                      <div className="mt-3">
                        <button
                          className="text-sm font-medium text-blue-500 hover:underline"
                          onClick={() => alert(`Response ID: ${q.id}`)}
                        >
                          View more details
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default DashboardCard12;
