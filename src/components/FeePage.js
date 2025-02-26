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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("Tümü");
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editingMonth, setEditingMonth] = useState(null);
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

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleEditClick = (player, month) => {
    const feeData = player.fees?.[selectedYear]?.[month];
    setEditingPlayer(player.id);
    setEditingMonth(month);
    setNewFee(feeData?.amount || "");
    setPaymentMethod(feeData?.paymentMethod || "");
  };

  const handleSaveFee = (playerId, month) => {
    const updatedPlayers = players.map((player) =>
      player.id === playerId
        ? {
            ...player,
            fees: {
              ...player.fees,
              [selectedYear]: {
                ...(player.fees?.[selectedYear] || {}),
                [month]: {
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
        setEditingMonth(null);
        setNewFee("");
        setPaymentMethod("");
      })
      .catch((error) => console.error("Aidat güncelleme hatası:", error));
  };

  const calculateTotalFee = () => {
    return players.reduce((total, player) => {
      if (selectedMonth === "Tümü") {
        return (
          total +
          months.reduce((monthTotal, month) => {
            const feeData = player.fees?.[selectedYear]?.[month];
            const amount = parseFloat(feeData?.amount) || 0;
            return monthTotal + amount;
          }, 0)
        );
      } else {
        const feeData = player.fees?.[selectedYear]?.[selectedMonth];
        const amount = parseFloat(feeData?.amount) || 0;
        return total + amount;
      }
    }, 0);
  };

  return (
    <div className="fee-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>Aidat Bilgileri</h1>

      <div className="selectors">
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
          <label>Ay: </label>
          <select value={selectedMonth} onChange={handleMonthChange}>
            <option value="Tümü">Tümü</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="fee-container">
        <table className="fee-table">
          <thead>
            <tr>
              <th>İsim</th>
              <th>Doğum Tarihi</th>
              {selectedMonth === "Tümü"
                ? months.map((month) => <th key={month}>{month}</th>)
                : [<th key={selectedMonth}>{selectedMonth}</th>]}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="player">
                <td>
                  {player.firstName} {player.lastName}
                </td>
                <td>{player.dob || "Bilinmiyor"}</td>
                {selectedMonth === "Tümü"
                  ? months.map((month) => (
                      <td key={month}>
                        {editingPlayer === player.id && editingMonth === month ? (
                          <>
                            <input
                              type="number"
                              value={newFee}
                              onChange={(e) => setNewFee(e.target.value)}
                              className="fee-input"
                            />
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
                            <button
                              className="save-btn"
                              onClick={() => handleSaveFee(player.id, month)}
                            >
                              ✔
                            </button>
                          </>
                        ) : (
                          <>
                            <div>
                              {player.fees?.[selectedYear]?.[month]?.amount ||
                                "0"}{" "}
                              TL
                            </div>
                            <div>
                              {player.fees?.[selectedYear]?.[month]
                                ?.paymentMethod || "Belirtilmedi"}
                            </div>
                            <button
                              className="edit-btn"
                              onClick={() => handleEditClick(player, month)}
                            >
                              ✏
                            </button>
                          </>
                        )}
                      </td>
                    ))
                  : [selectedMonth].map((month) => (
                      <td key={month}>
                        {editingPlayer === player.id && editingMonth === month ? (
                          <>
                            <input
                              type="number"
                              value={newFee}
                              onChange={(e) => setNewFee(e.target.value)}
                              className="fee-input"
                            />
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
                            <button
                              className="save-btn"
                              onClick={() => handleSaveFee(player.id, month)}
                            >
                              ✔
                            </button>
                          </>
                        ) : (
                          <>
                            <div>
                              {player.fees?.[selectedYear]?.[month]?.amount ||
                                "0"}{" "}
                              TL
                            </div>
                            <div>
                              {player.fees?.[selectedYear]?.[month]
                                ?.paymentMethod || "Belirtilmedi"}
                            </div>
                            <button
                              className="edit-btn"
                              onClick={() => handleEditClick(player, month)}
                            >
                              ✏
                            </button>
                          </>
                        )}
                      </td>
                    ))}
              </tr>
            ))}
            <tr>
              <td colSpan={2}>Toplam Aidat:</td>
              <td colSpan={selectedMonth === "Tümü" ? months.length : 1}>
                {calculateTotalFee()} TL
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FeePage;