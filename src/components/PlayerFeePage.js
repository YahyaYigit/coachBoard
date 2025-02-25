import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/PlayerFeePages.css";

function PlayerFeePage() {
  const navigate = useNavigate();
  const [loggedInPlayer, setLoggedInPlayer] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("Ocak");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [playerFee, setPlayerFee] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("Belirtilmedi");

  useEffect(() => {
    const storedPlayer = localStorage.getItem("loggedInPlayer");

    if (storedPlayer) {
      const playerData = JSON.parse(storedPlayer);
      setLoggedInPlayer(playerData);

      axios
        .get(`http://localhost:5000/groups/?name=${playerData.team}`)
        .then((response) => {
          const player = response.data[0]?.players.find(
            (p) => p.id === playerData.id
          );

          if (player && player.fees) {
            setPlayerFee(
              player.fees[selectedYear]?.[selectedMonth]?.amount || "0"
            );
            setPaymentMethod(
              player.fees[selectedYear]?.[selectedMonth]?.paymentMethod ||
                "Belirtilmedi"
            );
          } else {
            setPlayerFee("0");
            setPaymentMethod("Belirtilmedi");
          }
        })
        .catch((error) => console.error("Veri çekme hatası:", error));
    }
  }, [selectedMonth, selectedYear]);

  if (!loggedInPlayer) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="fee-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>Aidat Bilgilerim</h1>
      <h2>
        {loggedInPlayer.firstName} {loggedInPlayer.lastName}
      </h2>

      <div className="selectors">
        <div className="year-month-container">
          <div className="year-selector">
            <label>Yıl: </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {["2025", "2026", "2027", "2028"].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="month-selector">
            <label>Aidat Ayı: </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {[
                "Ocak",
                "Şubat",
                "Mart",
                "Nisan",
                "Mayıs",
                "Haziran",
                "Temmuz",
                "Ağustos",
                "Eylül",
                "Ekim",
                "Kasım",
                "Aralık",
              ].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <h3>Verilen Ücretler</h3>
      <div className="fee-container">
        <div className="fee-item">
          <span className="player-name">
            {loggedInPlayer.firstName} {loggedInPlayer.lastName}
          </span>
          {/* <span className="player-name">
          <p>{paymentMethod}</p>
          </span> */}
          <span className="fee-amount">{playerFee} TL</span>
        </div>
      </div>

      <div className="payment-info">
        <div className="fee-details">
          <p>Aidat Tutarı: {playerFee} TL</p>
        </div>
      </div>
    </div>
  );
}

export default PlayerFeePage;
