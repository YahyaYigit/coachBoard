import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PlayerDashboard.css";

function PlayerDashboard() {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null); // Oyuncu bilgisi
  const [loading, setLoading] = useState(true); // Yüklenme durumu

  useEffect(() => {
    const storedPlayer = localStorage.getItem("player");

    if (storedPlayer) {
      const playerData = JSON.parse(storedPlayer); // Giriş yapan oyuncunun bilgilerini alıyoruz
      setPlayer(playerData); // Oyuncu bilgilerini state'e kaydediyoruz
      setLoading(false); // Yüklenme durumu tamamlandı
    } else {
      navigate("/login"); // Eğer giriş yapılmamışsa login sayfasına yönlendir
    }
  }, [navigate]);

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!player) {
    return <div className="error">Oyuncu bilgisi bulunamadı.</div>;
  }

  return (
    <div className="player-dashboard">
      <h2>Takım: {player.categoryGroups}</h2>
      <h1>
        Oyuncu: {player.firstName} {player.lastName}
      </h1>
      <h3>Grup ID: {player.categoryGroupsId}</h3>

      <div className="buttons-container">
        <button
          className="action-button"
          onClick={() => navigate(`/trainingHours/${player.categoryGroupsId}`)}
        >
          Antrenman Saatlerim
        </button>
        <button
          className="action-button"
          onClick={() => navigate(`/player-attendance/${player.categoryGroupsId}`)}
        >
          Yoklamalarım
        </button>
        <button
          className="action-button"
          onClick={() => {
            const role = localStorage.getItem("role");
            if (role === "admin") {
              navigate(`/admin/fees/${player.categoryGroupsId}`);
            } else {
              navigate("/player/fees");
            }
          }}
        >
          Aidatlarım
        </button>
      </div>
    </div>
  );
}

export default PlayerDashboard;