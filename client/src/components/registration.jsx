import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setIsLoggedIn, isLoggedIn }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3001/login",
        { name, email, password },
        { withCredentials: true }
      )
      .then((result) => {
        if (result.data === "Success") {
          axios
            .get("http://localhost:3001/user", {
              withCredentials: true,
            })
            .then((response) => {
              if (response.data.user) {
                setIsLoggedIn(true);
                navigate("/home", { state: { user: response.data.user } });
              }
            });
        } else {
          alert("Login failed");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="mb-2">
          <label className="block text-white text-sm font-bold mb-2 bg-transparent">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            className="w-full px-3 py-2  border-b border-gray-300 rounded-md focus:outline-none bg-transparent backdrop-blur-md placeholder-slate-200 text-white font-semibold "
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="block text-white text-sm font-bold mb-2 bg-transparent">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full px-3 py-2 border-b border-gray-300 rounded-md focus:outline-none bg-transparent backdrop-blur-md placeholder-slate-200 text-white font-semibold"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="block text-white text-sm font-bold mb-2 bg-transparent">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full px-3 py-2 border-b border-gray-300 rounded-md focus:outline-none bg-transparent backdrop-blur-md placeholder-slate-200 text-white font-semibold"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-transparent text-white font-extrabold rounded-lg transition duration-300"
        >
          Login
        </button>
      </form>
    </>
  );
}

export default Login;
