import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/PastAttendancePage.css";

const PastAttendancePage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [group, setGroup] = useState({});
  const [attendances, setAttendances] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredAttendances, setFilteredAttendances] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/groups/${groupId}`)
      .then((response) => setGroup(response.data))
      .catch((error) => console.error("Grup bilgisi alınamadı:", error));

    axios
      .get("http://localhost:5000/attendances")
      .then((response) => setAttendances(response.data))
      .catch((error) => console.error("Yoklamalar alınamadı:", error));
  }, [groupId]);

  const handleMonthChange = (e) => {
    const selected = e.target.value;
    setSelectedMonth(selected);

    const filtered = attendances.filter((att) => {
      return att.groupId === groupId && att.date.startsWith(selected);
    });
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
                    (att) => att.date === dateStr
                  );
                  const playerAttendance = attendance
                    ? attendance.players.find((p) => p.playerId === player.id)
                    : null;

                  return (
                    <td key={i + 1}>
                      {playerAttendance
                        ? playerAttendance.status === "Geldi"
                          ? "+"
                          : "-"
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
      <button className="back-button" onClick={() => navigate(state?.from || -1)}>
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
