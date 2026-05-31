import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[loading,setLoading]=useState(false);
  const[msg,setMsg]=useState("");

  function aa() {
    if (localStorage.getItem("user_id")) {
      navigate("/home");
    }
  }
  useEffect(aa, []);

  async function handleLogin(e) {
    setLoading(true);
    e.preventDefault();
    try {
          const res = await fetch("https://chat-app-backend-v8ey.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await res.json();
    console.log(data);
    if (data.sucess) {
      localStorage.setItem("user_id", data.user_id);
      navigate("/home");
      return;
    }
    setMsg(data.message);
    
    
    } catch (error) {
      
    }
    setLoading(false);

  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button type="submit" className="login-button">
          Login
        </button>
        {loading && <div className="loading"></div>}
        {!loading && <div style={{color:"red",textAlign:"center"}} >{msg}</div>}
       

        <p style={{color:"white"}} className="login-text">
          Don’t have an account?{" "}
          <Link style={{color:"lightblue"}} to="/signup" className="login-link">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
