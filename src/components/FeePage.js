import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FeePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function FeePage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("Ocak");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [newFee, setNewFee] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

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

  const years = [
    2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
  ];

  useEffect(() => {
    axios
      .get(`http://localhost:5000/groups/${groupId}`)
      .then((response) => {
        setPlayers(response.data.players || []);
      })
      .catch((error) => {
        console.error("Veri çekme hatası:", error);
      });
  }, [groupId]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleEditClick = (player) => {
    const feeData = player.fees?.[selectedYear]?.[selectedMonth];
    setEditingPlayer(player.id);
    setNewFee(feeData?.amount || "");
    setPaymentMethod(feeData?.paymentMethod || "");
  };

  const handleSaveFee = (playerId) => {
    const updatedPlayers = players.map((player) =>
      player.id === playerId
        ? {
            ...player,
            fees: {
              ...player.fees,
              [selectedYear]: {
                ...(player.fees?.[selectedYear] || {}),
                [selectedMonth]: {
                  amount: newFee,
                  paymentMethod: paymentMethod,
                },
              },
            },
          }
        : player
    );

    axios
      .patch(`http://localhost:5000/groups/${groupId}`, {
        players: updatedPlayers,
      })
      .then(() => {
        setPlayers(updatedPlayers);
        setEditingPlayer(null);
        setNewFee("");
        setPaymentMethod("");
      })
      .catch((error) => console.error("Aidat güncelleme hatası:", error));
  };

  const calculateTotalFee = () => {
    return players.reduce((total, player) => {
      const feeData = player.fees?.[selectedYear]?.[selectedMonth];
      const amount = parseFloat(feeData?.amount) || 0;
      return total + amount;
    }, 0);
  };

  return (
    <div className="fee-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>Aidat Bilgileri</h1>

      <div className="selectors">
        <div className="year-month-container">
          <div className="year-selector">
            <label>Yıl: </label>
            <select value={selectedYear} onChange={handleYearChange}>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="month-selector">
            <label>Aidat Ayı: </label>
            <select value={selectedMonth} onChange={handleMonthChange}>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="fee-container">
        <table className="fee-table">
          <thead>
            <tr>
              <th>İsim</th>
              <th>Doğum Tarihi</th>
              <th>Aidat Tutarı</th>
              <th>Ödeme Şekli</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="player">
                <td>
                  {player.firstName} {player.lastName}
                </td>
                <td>{player.dob || "Bilinmiyor"}</td>

                {editingPlayer === player.id ? (
                  <>
                    <td>
                      <input
                        type="number"
                        value={newFee}
                        onChange={(e) => setNewFee(e.target.value)}
                        className="fee-input"
                      />
                    </td>
                    <td>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="payment-method-select"
                      >
                        <option value="">Seç</option>
                        <option value="IBAN">IBAN</option>
                        <option value="Makbuz">Makbuz</option>
                        <option value="Kredi-Karti">Kredi Kartı</option>
                        <option value="Burslu">Burslu</option>
                        <option value="Gelmedi">Gelmedi</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="save-btn"
                        onClick={() => handleSaveFee(player.id)}
                      >
                        ✔
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      {player.fees?.[selectedYear]?.[selectedMonth]?.amount ||
                        "0"}{" "}
                      TL
                    </td>
                    <td>
                      {player.fees?.[selectedYear]?.[selectedMonth]
                        ?.paymentMethod || "Belirtilmedi"}
                    </td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick(player)}
                      >
                        ✏
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            <div className="total-fee">
              <h3>Toplam Aidat: {calculateTotalFee()} TL</h3>
            </div>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FeePage;
