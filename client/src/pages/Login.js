import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
      console.log("Login attempt:", { email, password });  

    try {
      const res = await api.post("/auth/login", { email, password });
      alert("Login successful!");
      localStorage.setItem("token", res.data.token);
      navigate("/posts");
    } catch (err) {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      <div className="login-links">
        <p>
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
