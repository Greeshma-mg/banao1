import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams(); 

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      alert("Invalid token");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    resetPasswordAPI(token, password)
      .then(() => {
        alert("Password reset successful");
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong");
      });
  };

  const resetPasswordAPI = async (token, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("success");
      }, 1000);
    });
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
