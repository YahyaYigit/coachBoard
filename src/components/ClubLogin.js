import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ClubLogin.css";

const ClubLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://localhost:7114/api/Authentication/login", {
        email,
        password,
      });

      const { user } = response.data;

      if (user && user.isAdmin) {
        console.log("Giriş başarılı!");
        navigate("/groups");
      } else {
        setError("Kullanıcı adı veya şifre hatalı ya da yetkiniz yok!");
      }
    } catch (err) {
      console.error("API isteği sırasında hata oluştu:", err);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="club-login">
      <h1>Kulüp Girişi</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">E-Posta</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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