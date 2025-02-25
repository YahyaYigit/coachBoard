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

  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'i')
      .replace(/ç/g, 'c')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/groups`);

      let foundPlayer = null;
      let foundGroup = null;

      response.data.forEach((group) => {
        if (group.players && Array.isArray(group.players)) {
          const player = group.players.find(
            (p) =>
              normalizeString(p.email).trim() === normalizeString(loginData.email).trim() &&
              String(p.password).trim() === loginData.password.trim()
          );

          if (player) {
            foundPlayer = player;
            foundGroup = group.name;
          }
        }
      });

      if (foundPlayer) {
        alert("Giriş başarılı!");

        const playerData = { ...foundPlayer, team: foundGroup };
        localStorage.setItem("players", JSON.stringify(playerData));

        navigate("/playerDashboard");
      } else {
        setError("E-posta veya şifre hatalı!");
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
