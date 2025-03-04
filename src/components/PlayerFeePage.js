import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/PlayerFeePages.css";

function PlayerFeePage() {
  const navigate = useNavigate();
  const [loggedInPlayer, setLoggedInPlayer] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("Tümü");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [playerFees, setPlayerFees] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

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
            const fees = [];
            const methods = [];
            if (selectedMonth === "Tümü") {
              for (const month of months) {
                fees.push(player.fees[selectedYear]?.[month]?.amount || "0");
                methods.push(
                  player.fees[selectedYear]?.[month]?.paymentMethod ||
                    "Belirtilmedi"
                );
              }
            } else {
              fees.push(player.fees[selectedYear]?.[selectedMonth]?.amount || "0");
              methods.push(
                player.fees[selectedYear]?.[selectedMonth]?.paymentMethod ||
                  "Belirtilmedi"
              );
            }
            setPlayerFees(fees);
            setPaymentMethods(methods);
          } else {
            setPlayerFees(["0"]);
            setPaymentMethods(["Belirtilmedi"]);
          }
        })
        .catch((error) => console.error("Veri çekme hatası:", error));
    }
  }, [selectedMonth, selectedYear]);

  const months = [
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
  ];

  const calculateTotalFee = () => {
    return playerFees.reduce((total, fee) => total + parseFloat(fee), 0);
  };

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
              <option value="Tümü">Tümü</option>
              {months.map((month) => (
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
        {selectedMonth === "Tümü"
          ? months.map((month, index) => (
              <div key={month} className="fee-item">
                <span className="month-name">{month}</span>
                <span className="fee-amount">{playerFees[index]} TL</span>
                <span className="payment-method">{paymentMethods[index]}</span>
              </div>
            ))
          : playerFees.map((fee, index) => (
              <div key={selectedMonth} className="fee-item">
                <span className="month-name">{selectedMonth}</span>
                <span className="fee-amount">{fee} TL</span>
                <span className="payment-method">{paymentMethods[index]}</span>
              </div>
            ))}
      </div>

      <div className="payment-info">
        <div className="fee-details">
          <p>Toplam Aidat: {calculateTotalFee()} TL</p>
        </div>
      </div>
    </div>
  );
}

export default PlayerFeePage;