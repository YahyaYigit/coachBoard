import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; 
import "../styles/AttendancePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const AttendancePage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [players, setPlayers] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    axiosInstance.get("/User?page=1&pageSize=100").then((response) => {
      const allPlayers = response.data.data;

      const filteredPlayers = allPlayers.filter(
        (player) => player.categoryGroupsId === parseInt(groupId)
      );

      setPlayers(filteredPlayers);

      if (filteredPlayers.length > 0) {
        setGroupName(`Grup ID: ${groupId}`);
      } else {
        setGroupName("Oyuncu bulunamadı");
      }
    });
  }, [groupId]);

  const handleAttendanceChange = (playerId, status) => {
    setAttendanceStatus((prevStatus) => ({
      ...prevStatus,
      [playerId]: status,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formattedDate = new Date(attendanceDate).toISOString();
  
    try {
      for (const player of players) {
        const status = attendanceStatus[player.id];
        const statusEnum = status === "Geldi" ? 1 : status === "Gelmedi" ? 2 : null;
  
        if (statusEnum === null) continue; // seçilmemişse atla
  
        const newAttendance = {
          userId: player.id,
          date: formattedDate,
          status: statusEnum,
        };
        console.log("Gönderilen veri:", newAttendance);

  
        await axiosInstance.post("/Attendance/CreateAttendance", newAttendance);
      }
  
      alert("Tüm yoklamalar başarıyla kaydedildi!");
      setAttendanceDate("");
      setAttendanceStatus({});
    } catch (error) {
      const errorMessage = error.response
        ? `API Error: ${JSON.stringify(error.response.data)}`
        : `Error: ${error.message}`;
      console.error(errorMessage);
      alert("Bir hata oluştu. Lütfen kontrol edin.");
      
    }
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
        onClick={() => navigate(`/past-attendance/${groupId}`)}
      >
        Geçmiş Yoklamaları Görüntüle
      </button>
    </div>
  );
};

export default AttendancePage;
