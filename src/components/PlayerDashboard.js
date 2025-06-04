import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  faClock,
  faClipboardCheck,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/PlayerDashboard.css";

function PlayerDashboard() {
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPlayer = localStorage.getItem("player");

    if (storedPlayer) {
      const playerData = JSON.parse(storedPlayer);
      setPlayer(playerData);
      setLoading(false);
    } else {
      navigate("/login");
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
      <h1>
        Oyuncu: {player.firstName} {player.lastName}
      </h1>
      <h2>Takım: {player.categoryGroups}</h2>
      <h3>Grup ID: {player.categoryGroupsId}</h3>

      <div className="buttons-container">
  <div
    className="action-box"
    onClick={() => navigate(`/trainingHours/${player.categoryGroupsId}`)}
  >
    <FontAwesomeIcon icon={faClock} className="action-icon" />
    <span>Antrenman Saatlerim</span>
  </div>
  <div
    className="action-box"
    onClick={() =>
      navigate(`/player-attendance/${player.categoryGroupsId}`)
    }
  >
    <FontAwesomeIcon icon={faClipboardCheck} className="action-icon" />
    <span>Yoklamalarım</span>
  </div>
  <div
    className="action-box"
    onClick={() => {
      const role = localStorage.getItem("role");
      if (role === "admin") {
        navigate(`/admin/fees/${player.categoryGroupsId}`);
      } else {
        navigate("/player/fees");
      }
    }}
  >
    <FontAwesomeIcon icon={faMoneyBillWave} className="action-icon" />
    <span>Aidatlarım</span>
  </div>
  {/* Yeni Ödemelerim Kutusu */}
  <div className="action-box">
    <FontAwesomeIcon icon={faMoneyBillWave} className="action-icon" />
    <span>Ödemelerim</span>
  </div>
</div>
    </div>
  );
}

export default PlayerDashboard;