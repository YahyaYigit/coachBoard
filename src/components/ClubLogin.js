import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ClubLogin.css";

const ClubLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:5000/users");

      const user = response.data.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        console.log("Giriş başarılı!");
        navigate("/groups");
      } else {
        setError("Kullanıcı adı veya şifre hatalı!");
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="club-login">
      <h1>Kulüp Girişi</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="username">Kullanıcı Adı</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Şifre</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default ClubLogin;
