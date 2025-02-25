import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PlayerAttendance.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function PlayerAttendance() {
  const { team } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedPlayer = localStorage.getItem("loggedInPlayer");
    if (storedPlayer) {
      setPlayer(JSON.parse(storedPlayer));
    }
  }, []);

  useEffect(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  }, [year, month]);

  const fetchAttendance = () => {
    if (player) {
      setLoading(true);
      axios
        .get(
          `http://localhost:5000/attendances?team=${team}&year=${year}&month=${month}`
        )
        .then((response) => {
          const attendanceMap = response.data.reduce((acc, record) => {
            const date = new Date(record.date);
            const day = date.getDate();

            if (date.getFullYear() === year && date.getMonth() + 1 === month) {
              if (!acc[day]) {
                acc[day] = [];
              }

              record.players.forEach((p) => {
                if (p.playerId === player.id) {
                  acc[day].push({
                    name: `${p.firstName} ${p.lastName}`,
                    status:
                      p.status === "Gelmedi"
                        ? "-"
                        : p.status === "geldi"
                        ? "+"
                        : "Belirtilmedi",
                  });
                }
              });
            }

            return acc;
          }, {});

          setAttendance(attendanceMap);
        })
        .catch((error) => {
          console.error("Yoklama verileri alınamadı:", error);
        })
        .finally(() => {
          setTimeout(() => setLoading(false), 1000);
        });
    }
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
          <h3>Yoklamalarım</h3>
        </div>
      )}
      <div className="filters">
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <button onClick={fetchAttendance} className="search-button">
          {loading ? "Aranıyor..." : "Ara"}
        </button>
      </div>
      {loading && (
        <p className="loading-text">Veriler getiriliyor, lütfen bekleyin...</p>
      )}
      <div className="attendance-days">
        {days.map((day) => (
          <div key={day} className="day-box">
            <span>{day}</span>
            {attendance[day] && attendance[day].length > 0
              ? attendance[day].map((record, index) => (
                  <div key={index}>
                    <p className="recordStatus">{record.status}</p>
                  </div>
                ))
              : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerAttendance;
