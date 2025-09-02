// App.js
import React, { useState, useEffect } from "react";
import Auth from "./Auth";
import TaskManager from "./TaskManager";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <div className="animated-background">
      <div className="gradient-overlay"></div>
      <div className="floating-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="main-content-wrapper">
        <div className="app-container">
          {token ? (
            <TaskManager token={token} onLogout={handleLogout} />
          ) : (
            <Auth setToken={setToken} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;