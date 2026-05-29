
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProgressChart from './ProgressChart';

const ProgressTracker = () => {
  const [settings, setSettings] = useState(365);
  const [wins, setWins] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [dailyProgress, setDailyProgress] = useState("");
  const [progressDis, setProgressDis] = useState("1% Daily");
  const [submittedToday, setSubmittedToday] = useState(false);
// 1. Top-level useEffect for Authentication and initial data fetch
 const token = sessionStorage.getItem("token");
 const userId = sessionStorage.getItem("user_id");
 useEffect(() => {
  if (!token) {
    window.location.href = "/";}
else{
 refreshData();
 
}

}, []);


const refreshData = async () => {
  // 1. Pull the token and ID inside the function
 
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("user_id")  || 2;

  // 2. Safety check: If no token, the backend WILL return 422
  if (!token) {
    console.error("No token found in session! Blocking request.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/progress/graph/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 3. Ensure Bearer is followed by a single space and no colon
        "Authorization": `Bearer ${token}` 
      }
    });

    if (!response.ok) {
      console.log("Error Occured")
      if (response.status === 422) {
        console.error("Backend says the Token is missing or malformed (422).",token);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setWins(data);
   
  } catch (err) {
    console.error("Fetch failed:", err.message,token,userId);
  }
};

  const handleDailySubmit = async (e) => {
    e.preventDefault();
    if (!dailyProgress) return;

   ; // Must match AuthPage key!

    try {
      const response = await fetch('http://localhost:5000/api/progress', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          task_name: progressDis,
          current_value: parseFloat(dailyProgress),
          user_id: parseInt(userId) // Ensure it's a number, not a string
        })
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error("Server rejected progress:", errorData);
          return;
      }

      setSubmittedToday(true);
      refreshData(); 
    } catch (err) {
      console.error("Error saving progress:", err);
    }
};


const saveSettings = async (e) => {
  e.preventDefault();
  
  // 1. Pull the fresh ID from session
  const currentUserId = sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("token");

  // 2. Safety Gate: Stop if the ID is null
  if (!currentUserId || currentUserId === "null") {
    console.error("Cannot save settings: User ID is null");
    setError("Session error. Please log in again.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/user/settings/${currentUserId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        target_days: settings,
      })
    });

    if (response.ok) {
      setShowSettings(false);
      await refreshData(); // Refresh the chart with new settings
    } else {
      console.error("Failed to save settings:", response.status);
    }
  } catch (err) {
    console.error("Error saving settings:", err);
  }

};
  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/";
  }
  // --- STYLES ---
  const inputStyle = { padding: "8px", borderRadius: "4px", border: "1px solid #333", background: "#000", color: "#fff", margin: "0 10px" };
  const buttonStyle = { padding: "10px 20px", borderRadius: "4px", border: "none", background: "#00ffcc", color: "#000", fontWeight: "bold", cursor: "pointer" };

  return (
    <div style={{ maxWidth: '1000px', margin: "auto", padding: "20px", color: "#fff", background: "#121212" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: "10px" }}>
        <button onClick={logout} style={{ ...buttonStyle, background: "#ff4d4d" }}>Logout</button>
        <button onClick={() => setShowSettings(!showSettings)} style={{ background: "transparent", border: "1px solid #333 ", color: "#888", cursor: "pointer" }}>
          {showSettings ? "Close Settings" : " ⚙️ Adjust Settings"}
        </button>
      </div>

      {showSettings && (
        <div style={{ background: "#1a1a1a", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
          <form onSubmit={saveSettings}>
            <label>Target Timespan (Days): </label>
            <input type="number" value={settings} style={inputStyle} onChange={(e) => setSettings(e.target.value)} />
            <button type='submit' style={buttonStyle}>Save Settings</button>
          </form>
        </div>
      )}

      <ProgressChart data={wins} />

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        {!submittedToday ? (
          <form onSubmit={handleDailySubmit}>
            <h3>What is your 1% win for today?</h3>
            <input type="number" step="0.01" value={dailyProgress} onChange={(e) => setDailyProgress(e.target.value)} style={{ ...inputStyle, width: "200px", fontSize: "1.3rem" }} placeholder='Win %' />
            <button type='submit' style={buttonStyle}>Log Win</button>
          </form>
        ) : (
          <div style={{ color: "#00ffcc" }}>
            <p>✅ Progress Logged. See you tomorrow!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;