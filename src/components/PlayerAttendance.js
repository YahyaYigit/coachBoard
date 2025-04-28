import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../styles/PlayerAttendance.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function PlayerAttendance() {
  const { team } = useParams(); // URL'den gelen takım ID
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null); // Giriş yapan oyuncu bilgisi
  const [attendances, setAttendances] = useState([]); // Yoklama verileri
  const [selectedMonth, setSelectedMonth] = useState(""); // Seçilen ay
  const [filteredAttendances, setFilteredAttendances] = useState([]); // Filtrelenmiş yoklamalar
  const [loading, setLoading] = useState(false); // Yüklenme durumu

  useEffect(() => {
    // Giriş yapan oyuncunun bilgilerini localStorage'dan alıyoruz
    const storedPlayer = localStorage.getItem("player");
    if (storedPlayer) {
      setPlayer(JSON.parse(storedPlayer));
    } else {
      navigate("/login"); // Eğer giriş yapılmamışsa login sayfasına yönlendir
    }
  }, [navigate]);

  useEffect(() => {
    if (player) {
      setLoading(true);
      // Yoklama verilerini API'den çekiyoruz
      axiosInstance
        .get(`/Attendance?page=1&pageSize=1000`)
        .then((res) => {
          const playerAttendances = res.data.data.filter(
            (att) => att.userId === player.id
          );
          setAttendances(playerAttendances);
        })
        .catch((err) => console.error("Yoklama verileri alınamadı:", err))
        .finally(() => setLoading(false));
    }
  }, [player]);

  const handleMonthChange = (e) => {
    const selected = e.target.value;
    setSelectedMonth(selected);

    const filtered = attendances.filter((att) =>
      att.date.startsWith(selected)
    );
    setFilteredAttendances(filtered);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const renderAttendanceTable = () => {
    if (!selectedMonth) return null;

    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = getDaysInMonth(year, month);

    return (
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Tarih</th>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <th key={i + 1}>{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {player.firstName} {player.lastName}
            </td>
            {Array.from({ length: daysInMonth }, (_, i) => {
              const dateStr = `${year}-${String(month).padStart(
                2,
                "0"
              )}-${String(i + 1).padStart(2, "0")}`;

              const attendance = filteredAttendances.find((att) =>
                att.date.startsWith(dateStr)
              );

              return (
                <td key={i + 1}>
                  {attendance?.status === "Geldi"
                    ? "+"
                    : attendance?.status === "Gelmedi"
                    ? "-"
                    : ""}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="player-attendance">
      {player && (
        <div className="header">
          <h1>
            {player.firstName} {player.lastName}
          </h1>
          <button className="back-button" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h2>Takım: {team}</h2>
          <h3>Geçmiş Yoklamalarım</h3>
        </div>
      )}
      <label>
        Ay Seçin:
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          required
        />
      </label>
      {loading && <p className="loading-text">Veriler getiriliyor...</p>}
      {renderAttendanceTable()}
    </div>
  );
}

export default PlayerAttendance;