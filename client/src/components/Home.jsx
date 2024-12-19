import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(location.state?.user);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    if (!user) {
      axios
        .get("http://localhost:3001/user", { withCredentials: true })
        .then((response) => {
          if (response.data.user) {
            setUser(response.data.user);
          } else {
            navigate("/login");
          }
        })
        .catch(() => navigate("/login"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <center>
        <h1>Loading...</h1>
      </center>
    );
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">
      <h1 className="text-white text-5xl">
        Welcome Home {user && user.name} !!!
      </h1>
    </div>
  );
}

export default Home;
