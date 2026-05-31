import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();


    try {
      setLoading(true);

      const res = await fetch("https://chat-app-backend-v8ey.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log(data);

      if (data.sucess) {
        setSuccess(true);
        setMsg(data.message);
        
      } else {
        setSuccess(false);
        setMsg(data.message || "Signup failed");
      }

    } catch (error) {
      console.log(error);
      setSuccess(false);
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2 className="signup-title">Sign Up</h2>

        <input
          type="text"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="signup-input"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
        />

        {loading && <div className="loading"></div>}

        {!loading && msg && (
          <div
            style={{
              color: success ? "green" : "red",
              textAlign: "center",
              marginTop: "10px",
              fontWeight: "bold",
            }}
          >
            {msg}
          </div>
        )}

        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p style={{color:"white"}} className="signup-text">
          Already have an account?{" "}
          <Link style={{color:"lightblue"}} to="/login" className="signup-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;