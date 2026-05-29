import React, { useState } from "react";
import AuthPage from "../components/AuthPage";
import DashBoard from "../components/DashBoard";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("token")
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <DashBoard onLogout={handleLogout} />
      ) : (
        <AuthPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
