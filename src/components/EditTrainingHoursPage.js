import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/EditTrainingHoursPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function EditTrainingHoursPage() {
  const { groupId, day } = useParams();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDay, setSelectedDay] = useState(day);
  const [trainingHours, setTrainingHours] = useState([]);
  const [group, setGroup] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/groups/${groupId}`)
      .then((response) => {
        setGroup(response.data);
        setTrainingHours(response.data.trainingHours);
        const trainingDay = response.data.trainingHours.find(
          (item) => item.day === selectedDay
        );
        if (trainingDay) {
          const [start, end] = trainingDay.time.split(" - ");
          setStartTime(start.trim());
          setEndTime(end.trim());
        }
      })
      .catch((error) => console.error("Veri çekilirken hata:", error));
  }, [groupId, selectedDay]);

  const handleSave = () => {
    const updatedTrainingHours = trainingHours.map((item) =>
      item.day === day
        ? { ...item, day: selectedDay, time: `${startTime} - ${endTime}` }
        : item
    );

    axios
      .put(`http://localhost:5000/groups/${groupId}`, {
        ...group,
        trainingHours: updatedTrainingHours,
      })
      .then(() => {
        alert("Antrenman saati başarıyla güncellendi!");
        navigate(`/training-hours/${groupId}`);
      })
      .catch((error) => {
        console.error("Saat güncellenirken hata:", error);
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
      });
  };

  const handleDayChange = (e) => {
    const newDay = e.target.value;
    setSelectedDay(newDay);
    
    const trainingDay = trainingHours.find((item) => item.day === newDay);
    if (trainingDay) {
      const [start, end] = trainingDay.time.split(" - ");
      setStartTime(start.trim());
      setEndTime(end.trim());
    } else {
      setStartTime("");
      setEndTime("");
    }
  };

  const handleDeleteDay = () => {
    const updatedTrainingHours = trainingHours.filter(
      (item) => item.day !== selectedDay
    );

    axios
      .put(`http://localhost:5000/groups/${groupId}`, {
        ...group,
        trainingHours: updatedTrainingHours,
      })
      .then(() => {
        alert("Gün başarıyla silindi!");
        setTrainingHours(updatedTrainingHours);
        navigate(`/training-hours/${groupId}`);
      })
      .catch((error) => {
        console.error("Gün silinirken hata oluştu:", error);
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
      });
  };

  return (
    <div className="training-hours-page">
      <h1>Antrenman Saatini Düzenle</h1>
      <h2>{selectedDay}</h2>
      <button className="back-button" onClick={() => navigate(state?.from || -1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <div className="input-containerd">
        <div className="input-container">
          <label htmlFor="day">Gün Seçin:</label>
          <select id="day" value={selectedDay} onChange={handleDayChange}>
            {[
              "Pazartesi",
              "Salı",
              "Çarşamba",
              "Perşembe",
              "Cuma",
              "Cumartesi",
              "Pazar",
            ].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="input-container">
          <label htmlFor="start-time">Başlangıç saatini girin:</label>
          <input
            type="time"
            id="start-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="input-container">
          <label htmlFor="end-time">Bitiş saatini girin:</label>
          <input
            type="time"
            id="end-time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <div className="btn-order">
        <button className="trainingButton" onClick={handleSave}>
          Kaydet
        </button>

        <button
          className="trainingButton delete-day-button"
          onClick={handleDeleteDay}
        >
          Sil
        </button>
      </div>
    </div>
  );
}

export default EditTrainingHoursPage;
