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
// import React, { useState, useEffect } from 'react';
// import AuthPage from '../components/AuthPage';
// import DashBoard from '../components/DashBoard';

// // function App() {
// //   const [token, setToken] = useState(localStorage.getItem('token'));
// //   const [userId, setUserId] = useState(localStorage.getItem('userId'));

// //   const handleLogin = (newToken, newUserId) => {
// //     localStorage.setItem('token', newToken);
// //     localStorage.setItem('userId', newUserId);
// //     setToken(newToken);
// //     setUserId(newUserId);
// //   };

// //   const handleLogout = () => {
// //     localStorage.clear();
// //     setToken(null);
// //     setUserId(null);
// //   };

// //   return (
// //     <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
// //       {!token ? (
// //         <AuthPage onLogin={handleLogin} />
// //       ) : (
// //         <DashBoard token={token} userId={userId} onLogout={handleLogout} />
// //       )}
// //     </div>
// //   );
// // }

// // 
// function App() {
//   const [token, setToken] = useState(null);
//   const [userId, setUserId] = useState(null);

//   const handleLogin = (receivedToken, receivedUserId) => {
//     setToken(receivedToken);
//     setUserId(receivedUserId);
//     // Use react-router navigate instead of window.location
//   };

//   // If the user is not logged in, we show AuthPage
//   if (!token) {
//     return <AuthPage onLogin={handleLogin} />;
//   }

//   // Otherwise, show the Dashboard
//   return <DashBoard token={token} userId={userId} />;
// }
// export default App;