import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; 
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/PastAttendancePage.css";

const PastAttendancePage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [group, setGroup] = useState({ name: "", players: [] });
  const [attendances, setAttendances] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredAttendances, setFilteredAttendances] = useState([]);

  useEffect(() => {
    // Oyuncuları çek
    axiosInstance
      .get(`/User?page=1&pageSize=100`)
      .then((res) => {
        const players = res.data.data.filter(
          (player) => player.categoryGroupsId === parseInt(groupId)
        );
        setGroup({
          name: `Grup ${groupId}`,
          players: players,
        });
      })
      .catch((err) => console.error("Oyuncular alınamadı:", err));

    // Yoklamaları çek
    axiosInstance
      .get(`/Attendance?page=1&pageSize=1000`)
      .then((res) => {
        setAttendances(res.data.data || []);
      })
      .catch((err) => console.error("Yoklamalar alınamadı:", err));
  }, [groupId]);

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
            <th>Oyuncu</th>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <th key={i + 1}>{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {group.players &&
            group.players.map((player) => (
              <tr key={player.id}>
                <td>
                  {player.firstName} {player.lastName}
                </td>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const dateStr = `${year}-${String(month).padStart(
                    2,
                    "0"
                  )}-${String(i + 1).padStart(2, "0")}`;

                  const attendance = filteredAttendances.find(
                    (att) =>
                      att.userId === player.id &&
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
            ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="past-attendance-page">
      <h2>{group.name} - Geçmiş Yoklamalar</h2>
      <button
        className="back-button"
        onClick={() => navigate(state?.from || -1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <label>
        Ay Seçin:
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          required
        />
      </label>

      {renderAttendanceTable()}
    </div>
  );
};

export default PastAttendancePage;