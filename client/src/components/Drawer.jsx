import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Button.css";

function Drawer() {
  const [isActive, setIsActive] = useState(false);
  const controls = useAnimation();
  const navigate = useNavigate(); // Initialize useNavigate

  const moveToCenter = () => {
    if (isActive) {
      controls.start({
        x: "0vw",
        transition: { duration: 1, ease: "easeOut" },
      });
    } else {
      controls.start({
        x: "-25vw",
        transition: { duration: 1, ease: "easeOut" },
      });
    }
    setIsActive(!isActive);
  };

  return (
    <>
      <motion.div className="content" data-form-type="card">
        <motion.a
          href="javascript:;"
          className={`btn ${isActive ? "active" : ""}`}
          onClick={moveToCenter}
          animate={controls}
        >
          <span className="btn__circle"></span>
          <motion.span
            className={`btn__white-circle ${isActive ? "active" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="icon-arrow-right"
              viewBox="0 0 21 12"
            >
              <path d="M17.104 5.072l-4.138-4.014L14.056 0l6 5.82-6 5.82-1.09-1.057 4.138-4.014H0V5.072h17.104z"></path>
            </svg>
          </motion.span>
          <span className="btn__text">Discover the project</span>
        </motion.a>
      </motion.div>

      <motion.div
        className={`drawer ${isActive ? "active" : ""}`}
        initial={{ x: 0, opacity: 1, rotate: -90 }}
        animate={{
          x: isActive ? -450 : 0,
          opacity: 1,
          transition: { duration: 1, ease: "easeOut" },
        }}
      >
        <div className="drawer-content">
          <div className="flex flex-col items-center mb-10 w-96 rotate-90 absolute left-[850px] bottom-36">
            <div className="flex items-center text-purple-600">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 neon-text gradient-stroke"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="url(#grad1)"
                >
                  <defs>
                    <radialGradient
                      id="grad1"
                      cx="50%"
                      cy="50%"
                      r="50%"
                      fx="50%"
                      fy="50%"
                    >
                      <stop
                        offset="0%"
                        style={{
                          stopColor: "rgba(238,174,202,1)",
                          stopOpacity: 1,
                        }}
                      />
                      <stop
                        offset="100%"
                        style={{
                          stopColor: "rgba(148,187,233,1)",
                          stopOpacity: 1,
                        }}
                      />
                    </radialGradient>
                  </defs>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.5 2.5l-2 2m0 0l-2-2m2 2v4m0 10.25l2-2m-4 2l-2-2m4 2v-4M3 8.5L6.5 12M21 8.5l-3.5 3.5m-4 4L12 18M12 18l-1.5-1.5m7-7l-2.5 2.5M9 12l2.5 2.5M3 15.5L6.5 12m2 0l2.5 2.5m-7 7l2.5-2.5M9 12V8.5"
                  />
                </svg>
              </div>

              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[rgba(238,174,202,1)] to-[rgba(148,187,233,1)] neon-text">
                Neon Assistant
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Your AI-Powered Companion
            </p>
          </div>

          {/* Project Story Section */}
          <div className="project-story w-72 rotate-90 absolute left-[540px] bottom-[-70px]">
            <h2 className="text-2xl font-bold text-gray-500 ">
              Project Overview
            </h2>
            <p className="text-gray-500 text-sm mt-4">
              The Neon Assistant is an IoT device integrated with OpenAI's AI
              capabilities, designed specifically to serve as an interactive FAQ
              assistant for schools. This device, powered by natural language
              processing, is aimed at answering common questions from students,
              parents, and staff efficiently and accurately.
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Whether it’s about school schedules, upcoming events, or general
              academic inquiries, the assistant can handle a wide range of
              questions. The system is fully customizable, allowing schools to
              curate a specific knowledge base tailored to their needs.
            </p>
            <p className="text-gray-500 text-sm mt-4">
              By integrating IoT technology with AI, the Neon Assistant offers a
              seamless and futuristic way for educational institutions to manage
              and provide real-time information, enhancing communication between
              schools and their communities.
            </p>
          </div>

          <div className="flex flex-col items-center mb-10 w-96 rotate-90 absolute left-[120px] bottom-[100px]">
            <div className="flex justify-center mt-8">
              <button
                className="icon-gradient animate-pulse"
                style={{
                  WebkitMaskImage:
                    'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 2.5l-2 2m0 0l-2-2m2 2v4m0 10.25l2-2m-4 2l-2-2m4 2v-4M3 8.5L6.5 12M21 8.5l-3.5 3.5m-4 4L12 18M12 18l-1.5-1.5m7-7l-2.5 2.5M9 12l2.5 2.5M3 15.5L6.5 12m2 0l2.5 2.5m-7 7l2.5-2.5M9 12V8.5" /></svg>\')',
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "cover",
                  background:
                    "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
                  height: "100px",
                  width: "100px",
                }}
                onClick={() => {
                  navigate("/login"); // Navigate to the login page when clicked
                }}
              ></button>
            </div>

            <p className="text-gray-500 text-xs mt-2">
              This Page will direct you to our Server
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Drawer;
