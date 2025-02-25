import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/AttendancePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const AttendancePage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [groups, setGroups] = useState([]);
  const [players, setPlayers] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(groupId || "");
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/groups").then((response) => {
      setGroups(response.data);
      if (response.data.length > 0 && !selectedGroup) {
        setSelectedGroup(response.data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      const group = groups.find((group) => group.id === selectedGroup);
      if (group) {
        setPlayers(group.players || []);
        setGroupName(group.name);
      }
    }
  }, [selectedGroup, groups]);

  const handleAttendanceChange = (playerId, status) => {
    setAttendanceStatus((prevStatus) => ({
      ...prevStatus,
      [playerId]: status,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAttendance = {
      groupId: selectedGroup,
      date: attendanceDate,
      players: players.map((player) => ({
        playerId: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        status: attendanceStatus[player.id] || "belirtilmedi",
      })),
    };

    axios
      .post("http://localhost:5000/attendances", newAttendance)
      .then(() => {
        alert("Yoklama başarıyla kaydedildi!");
        setAttendanceDate("");
        setAttendanceStatus({});
      })
      .catch((error) => console.error("Error saving attendance:", error));
  };

  return (
    <div className="attendance-page">
      <button className="back-button" onClick={() => navigate(state?.from || -1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h2>Yoklama Sayfası - {groupName}</h2>

      <div className="new-attendance">
        <h3>Yeni Yoklama Gir</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Tarih:
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              required
            />
          </label>

          {attendanceDate && (
            <>
              <h4>Oyuncular</h4>
              {players.length > 0 ? (
                players.map((player) => (
                  <div key={player.id} className="player-attendance">
                    <span>
                      {player.firstName} {player.lastName}
                    </span>
                    <label>
                      <input
                        type="radio"
                        name={`attendance-${player.id}`}
                        checked={attendanceStatus[player.id] === "Geldi"}
                        onChange={() =>
                          handleAttendanceChange(player.id, "Geldi")
                        }
                      />
                      Geldi
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`attendance-${player.id}`}
                        checked={attendanceStatus[player.id] === "Gelmedi"}
                        onChange={() =>
                          handleAttendanceChange(player.id, "Gelmedi")
                        }
                      />
                      Gelmedi
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`attendance-${player.id}`}
                        checked={attendanceStatus[player.id] === "belirtilmedi"}
                        onChange={() =>
                          handleAttendanceChange(player.id, "belirtilmedi")
                        }
                      />
                      Belirtilmedi
                    </label>
                  </div>
                ))
              ) : (
                <p>Bu grup için oyuncu bulunmamaktadır.</p>
              )}
            </>
          )}

          <button type="submit" className="submit-button">
            Gir
          </button>
        </form>
      </div>

      <button
        className="past-attendance-button"
        onClick={() => navigate(`/past-attendance/${selectedGroup}`)}
      >
        Geçmiş Yoklamaları Görüntüle
      </button>
    </div>
  );
};

export default AttendancePage;
