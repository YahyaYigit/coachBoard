import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../styles/EditTrainingHoursPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function EditTrainingHoursPage() {
  const { id: groupId } = useParams();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [trainingDate, setTrainingDate] = useState("");
  const [trainingHour, setTrainingHour] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  const formatTime = (time) => {
    if (time.split(":").length === 3) return time;
    return `${time}:00`;
  };

  const dayNameToNumber = {
    "Pazar": "0",
    "Pazartesi": "1",
    "Salı": "2",
    "Çarşamba": "3",
    "Perşembe": "4",
    "Cuma": "5",
    "Cumartesi": "6"
  };
  

  useEffect(() => {
    if (state?.trainingId) {
      axiosInstance
        .get(`/TrainingHours/GetTrainingHourse?id=${state.trainingId}`)
        .then((response) => {
          const data = response.data;
          setTrainingHour(data);
          setTrainingDate(dayNameToNumber[data.trainingDate]);
          setStartTime(data.trainingStartTime);
          setEndTime(data.trainingFinishTime);
        })
        .catch((error) => console.error("Veri çekilirken hata:", error));
    }
  }, [state?.trainingId]);
  
  const handleSave = () => {
    if (!trainingHour) {
      alert("Veriler yükleniyor, lütfen bekleyin.");
      return;
    }

    const numericGroupId = parseInt(groupId, 10);
    if (isNaN(numericGroupId)) {
      alert("Geçersiz grup ID'si!");
      return;
    }

    const updatedTrainingHour = {
      id: trainingHour.id,
      trainingDate: parseInt(trainingDate, 10),
      trainingStartTime: formatTime(startTime),
      trainingFinishTime: formatTime(endTime),
      categoryGroupsId: numericGroupId,
      isDeleted: false,
    };

    axiosInstance
      .put(`/TrainingHours/${trainingHour.id}`, updatedTrainingHour)
      .then(() => {
        alert("Antrenman saati başarıyla güncellendi!");
        navigate(`/training-hours/${groupId}`);
      })
      .catch((error) => {
        console.error("Saat güncellenirken hata:", error);
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
      });
  };

  if (!trainingHour) {
    return <div>Loading...</div>;
  }

  return (
    <div className="training-hours-page">
      <h1>Antrenman Saatini Düzenle</h1>
      <h2>{`Gün: ${trainingDate}`}</h2>
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <div className="input-containerd">
        <div className="input-container">
          <label htmlFor="day">Gün Seçin:</label>
          <select
  id="day"
  value={trainingDate}
  onChange={(e) => setTrainingDate(e.target.value)}
>
  {[
    { value: "0", label: "Pazar" },
    { value: "1", label: "Pazartesi" },
    { value: "2", label: "Salı" },
    { value: "3", label: "Çarşamba" },
    { value: "4", label: "Perşembe" },
    { value: "5", label: "Cuma" },
    { value: "6", label: "Cumartesi" },
  ].map((d) => (
    <option key={d.value} value={d.value}>
      {d.label}
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
      </div>
    </div>
  );
}

export default EditTrainingHoursPage;
