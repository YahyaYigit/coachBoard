import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PlayerDashboard.css";

function PlayerDashboard() {
  const navigate = useNavigate();
  const [players, setPlayer] = useState(null);

  useEffect(() => {
    const storedPlayer = localStorage.getItem("players");
    if (storedPlayer) {
      const playerData = JSON.parse(storedPlayer);
      setPlayer(playerData);
      localStorage.setItem("loggedInPlayer", JSON.stringify(playerData));
      localStorage.setItem("role", playerData.role || "player");
    }
  }, []);

  if (!players) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="player-dashboard">
      <h2>Takım: {players.team}</h2>
      <h1>
        Oyuncu: {players.firstName} {players.lastName}
      </h1>

      <div className="buttons-container">
        <button
          className="action-button"
          onClick={() => navigate(`/trainingHours/:team${players.team}`)}
        >
          Antrenman Saatlerim
        </button>
        <button
          className="action-button"
          onClick={() => navigate(`/player-attendance/${players.team}`)}
        >
          Yoklamalarım
        </button>
        <button
          className="action-button"
          onClick={() => {
            const role = localStorage.getItem("role");
            if (role === "admin") {
              navigate(`/admin/fees/${players.team}`);
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
