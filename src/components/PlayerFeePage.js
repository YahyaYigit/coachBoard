import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/PlayerFeePages.css";

function PlayerFeePage() {
  const navigate = useNavigate();
  const [loggedInPlayer, setLoggedInPlayer] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [playerFees, setPlayerFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPlayer = localStorage.getItem("player");
    if (storedPlayer) {
      const playerData = JSON.parse(storedPlayer);
      setLoggedInPlayer(playerData);

      if (playerData && playerData.monthlyFees) {
        const fees = Object.entries(playerData.monthlyFees).map(([key, value]) => {
          const [month, year] = key.split("-");
          const [paymentType, fee] = value.split(" - ");
          return {
            month: parseInt(month, 10),
            year: parseInt(year, 10),
            paymentType: paymentType.trim(),
            fee: parseFloat(fee.replace(".", "").replace(",", ".")),
          };
        });
        setPlayerFees(fees);
      }
      setLoading(false);
    } else {
      console.error("Kullanıcı bilgileri bulunamadı.");
      navigate("/login");
    }
  }, [navigate]);

  const calculateTotalFee = () => {
    return (playerFees || [])
      .filter((fee) => fee.year === selectedYear && fee.month === selectedMonth)
      .reduce((total, fee) => total + fee.fee, 0);
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!loggedInPlayer) {
    return <div className="error">Kullanıcı bilgisi bulunamadı.</div>;
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
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
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
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <h3>Verilen Ücretler</h3>
      <div className="fee-container">
        {(playerFees || [])
          .filter((fee) => fee.year === selectedYear && fee.month === selectedMonth)
          .map((fee, index) => (
            <div key={index} className="fee-item">
              <span className="fee-amount">Tutar: {fee.fee.toFixed(2)} TL</span>
              <span className="payment-method">Ödeme Şekli: {fee.paymentType}</span>
            </div>
          ))}
      </div>

      <div className="payment-info">
        <div className="fee-details">
          <p>Toplam Aidat: {calculateTotalFee().toFixed(2)} TL</p>
        </div>
      </div>
    </div>
  );
}

export default PlayerFeePage;