import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/TrainingHoursPage.css";

function TrainingHoursPage() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [showNewDayForm, setShowNewDayForm] = useState(false);
  const [newDay, setNewDay] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/groups/${groupId}`)
      .then((response) => {
        setGroup(response.data);
      })
      .catch((error) => {
        console.error("Antrenman saatleri alınırken hata oluştu:", error);
      });
  }, [groupId]);

  if (!group) {
    return <div>Loading...</div>;
  }

  const handleEdit = (day) => {
    navigate(`/edit-training-hours/${groupId}/${day}`);
  };

  const handleAddNewDay = () => {
    if (!newDay || !newStartTime || !newEndTime) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const newTrainingHour = {
      day: newDay,
      time: `${newStartTime} - ${newEndTime}`,
    };

    axios
      .patch(`http://localhost:5000/groups/${groupId}`, {
        trainingHours: [...group.trainingHours, newTrainingHour],
      })
      .then((response) => {
        setGroup((prevGroup) => ({
          ...prevGroup,
          trainingHours: [...prevGroup.trainingHours, newTrainingHour],
        }));
        setShowNewDayForm(false);
      })
      .catch((error) => {
        console.error("Yeni gün eklenirken hata oluştu:", error);
      });
  };

  return (
    <div className="training-hours-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <h1>Balkan Yeşilbağlar Spor Kulübü</h1>
      <h2>{group.name}</h2>
      <h3>Antrenman Saatleri</h3>
      <ul className="training-hours-list">
        {group.trainingHours.map(({ day, time }, index) => (
          <li key={index} className="training-hours-item">
            <span>
              {day}: {time}
            </span>
            <button className="edit-button" onClick={() => handleEdit(day)}>
              ✏️
            </button>
          </li>
        ))}
      </ul>

      <button
        className="trainingButton add-day-button"
        onClick={() => setShowNewDayForm(!showNewDayForm)}
      >
        {showNewDayForm ? "İptal Et" : "Yeni Gün Ekle"}
      </button>

      {showNewDayForm && (
        <div className="new-day-form">
          <h2>Yeni Gün Ekle</h2>
          <div className="input-container">
            <label htmlFor="new-day">Gün Seçin:</label>
            <select
              id="new-day"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
            >
              {["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="input-container">
            <label htmlFor="new-start-time">Başlangıç Saati:</label>
            <input
              type="time"
              id="new-start-time"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
            />
          </div>

          <div className="input-container">
            <label htmlFor="new-end-time">Bitiş Saati:</label>
            <input
              type="time"
              id="new-end-time"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
            />
          </div>

          <button className="trainingButton" onClick={handleAddNewDay}>
            Kaydet
          </button>
        </div>
      )}
    </div>
  );
}

export default TrainingHoursPage;
