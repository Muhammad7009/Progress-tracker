const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' };
const cardStyle = { backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '15px', width: '350px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' };
const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0a0a0a', color: 'white', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#00ffcc', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const toggleStyle = { textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#888', fontSize: '0.9rem' };

// export default AuthPage;
import React, { useState } from 'react';
import axios from 'axios';

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  const endpoint = isLogin ? 'login' : 'register';

  try {
    const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
      method: "POST",
      headers: { 
          'Content-Type': 'application/json',
      },
      // FIX: Standard fetch uses 'body', not 'data'
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      })
    });

    // Check if the server actually liked the request
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.msg || "Authentication failed");
    }

    const resData = await res.json(); // fetch needs this to read the data

    if (isLogin) {
      console.log("Login successful. Saving to session...");
      
      // Use resData, not res.data
      sessionStorage.setItem("token", resData.access_token);
      sessionStorage.setItem("user_id", resData.user_id);
      
      if (onLogin) {
        onLogin(resData.access_token, resData.user_id);
      }
      
      // Use window.location only if your App.jsx handles the redirect logic
      window.location.assign('/dashboard');
      
    } else {
      alert("Account created! Please sign in.");
      setIsLogin(true);
    }
  } catch (err) {
    console.error("Auth Error:", err.message);
    setError(err.message || "ERROR");
  }
};



  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', color: '#00ffcc' }}>
          {isLogin ? 'Welcome Back' : 'Join the 1%'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            style={inputStyle}
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={inputStyle}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          {error && <p style={{ color: '#ff4d4d', fontSize: '0.8rem' }}>{error}</p>}
          <button type="submit" style={buttonStyle}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)} style={toggleStyle}>
          {isLogin ? "Don't have an account? Sign Up" : "Already a member? Log In"}
        </p>
      </div>
    </div>
  );
};

// ... Styles remain the same ...
export default AuthPage;
