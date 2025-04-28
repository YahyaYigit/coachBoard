import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/playerAuthPage.css";

function PlayerAuthPage() {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:7114/api/Authentication/login", {
        email: loginData.email,
        password: loginData.password,
      });
  
      const { user } = response.data;
  
      if (user && !user.isAdmin) {
        alert("Giriş başarılı!");
  
        // Player bilgilerini localStorage'a kaydediyoruz
        localStorage.setItem("player", JSON.stringify(user));
  
        // Eğer categoryGroups bilgisi varsa, onu da kaydedelim
        if (user.categoryGroups) {
          localStorage.setItem("categoryGroups", JSON.stringify(user.categoryGroups));
        }
  
        navigate("/playerDashboard");
      } else {
        setError("E-posta veya şifre hatalı ya da yetkiniz yok!");
      }
    } catch (err) {
      console.error("Giriş hatası:", err);
      setError("Giriş yapılamadı!");
    }
  };
  

  const handlePlayerRegisterPage = () => {
    navigate("/playerRegister");
  };

  return (
    <div className="auth-page container">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="text-center">Sporcu Girişi</h2>
          <h5 className="text-center mb-4">Giriş Yap</h5>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">E-posta</label>
              <input
                type="text"
                name="email"
                className="form-control"
                placeholder="E-posta adresinizi girin"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Şifre</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Şifrenizi girin"
                onChange={handleChange}
                required
              />
            </div>
            {error && <div className="text-danger text-center">{error}</div>}
            <div className="text-center">
              <button type="submit" className="btn btn-primary w-100">
                Giriş Yap
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <p>Üye değil misin?</p>
            <button
              className="btn btn-secondary"
              onClick={handlePlayerRegisterPage}
            >
              Üye Ol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerAuthPage;