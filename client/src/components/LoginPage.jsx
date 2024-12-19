import React from "react";
import Login from "./registration";
import { BackgroundGradientAnimation } from "./ui/background-gradient-animation";

const LoginPage = ({ setIsLoggedIn, isLoggedIn }) => {
  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex items-center justify-center -top-[1000px]">
        <div className="flex absolute">
          {/* Container with blur background */}
          <div className=" bg-opacity-10 backdrop-blur-3xl p-10 rounded-xl shadow-lg bg-white">
            <div className="flex flex-col items-center mb-10 w-96">
              <div className="flex items-center text-purple-600">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 neon-text gradient-stroke"
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
              <p className="text-gray-200 text-sm mt-2">
                Your AI-Powered Companion
              </p>
            </div>

            {/* Login Form */}
            <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            <div className="flex flex-col items-center w-96">
              <div className="flex justify-center mt-8">
                <div
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
                />
              </div>
              <p className="text-gray-200 text-xs mt-2">
                This Page will direct you to our Server
              </p>
            </div>
          </div>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
};

export default LoginPage;
