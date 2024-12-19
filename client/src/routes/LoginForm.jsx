import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Users from "../pages/Users";
import Login from "../components/LoginPage";
import Drawer from "../components/Drawer";
import Dashboard from "../pages/Dashboard";
import "../css/style.css";
import "../charts/ChartjsConfig";

function LoginRoute() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Check if the current route is "/login" or "/home"
  const isLoginOrHomePage =
    location.pathname === "/login" || location.pathname === "/home";

  return (
    <>
      {!isLoginOrHomePage && (
        <>
          <Users />
          <Drawer />
        </>
      )}

      <Routes>
        <Route path="/home" element={<Dashboard />} />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
      </Routes>
    </>
  );
}

export default function LoginForm() {
  return (
    <BrowserRouter>
      <LoginRoute />
    </BrowserRouter>
  );
}
