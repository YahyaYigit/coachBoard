import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../styles/TrainingHoursPage.css";

function TrainingHoursPage() {
  const { id } = useParams(); // URL'den gelen kategori ID
  const [trainingHours, setTrainingHours] = useState(null); // Başlangıçta null olarak ayarlandı
  const [showNewDayForm, setShowNewDayForm] = useState(false);
  const [newDay, setNewDay] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const navigate = useNavigate();

  const dayToNumber = {
    Pazar: 0,
    Pazartesi: 1,
    Salı: 2,
    Çarşamba: 3,
    Perşembe: 4,
    Cuma: 5,
    Cumartesi: 6,
  };

  useEffect(() => {
    if (!id) {
      console.error("Grup ID'si tanımlı değil!");
      return;
    }

    axiosInstance
      .get(`/TrainingHours?page=1&pageSize=10`)
      .then((response) => {
        const data = response.data.data || [];
        const filteredData = data.filter((item) => item.categoryGroupsId === parseInt(id, 10));
        setTrainingHours(filteredData);
      })
      .catch((error) => {
        console.error("Antrenman saatleri alınırken hata oluştu:", error);
      });
  }, [id]);

  const handleAddNewDay = () => {
    if (!newDay || newDay === "Gün Seçin" || !newStartTime || !newEndTime) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const newTrainingHour = {
      trainingDate: dayToNumber[newDay],
      trainingStartTime: `${newStartTime}:00`,
      trainingFinishTime: `${newEndTime}:00`,
      categoryGroupsId: parseInt(id, 10),
    };

    console.log("Gönderilen veri:", newTrainingHour);

    axiosInstance
      .post(`/TrainingHours/CreateTrainingHourse`, newTrainingHour)
      .then((response) => {
        const added = response.data;
        setTrainingHours((prev) => [...prev, added]);
        setShowNewDayForm(false);
        setNewDay("");
        setNewStartTime("");
        setNewEndTime("");
        alert("Yeni gün başarıyla eklendi!");
      })
      .catch((error) => {
        console.error("Yeni gün eklenirken hata oluştu:", error);
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
      });
  };

  const handleEdit = (trainingId, trainingDate) => {
    navigate(`/edit-training-hours/${id}/${trainingDate}`, {
      state: { trainingId },
    });
  };

  const handleDelete = (trainingId) => {
    if (window.confirm("Bu günü silmek istediğinize emin misiniz?")) {
      axiosInstance
        .delete(`/TrainingHours/DeleteTrainingHours?id=${trainingId}`)
        .then(() => {
          alert("Gün başarıyla silindi!");
          setTrainingHours((prev) => prev.filter((item) => item.id !== trainingId));
        })
        .catch((error) => {
          console.error("Gün silinirken hata oluştu:", error);
          alert("Bir hata oluştu, lütfen tekrar deneyin.");
        });
    }
  };

  return (
    <div className="training-hours-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <h1>Balkan Yeşilbağlar Spor Kulübü</h1>
      <h2>Grup ID: {id}</h2>
      <h3>Antrenman Saatleri</h3>

      {trainingHours === null ? (
        <div>Loading...</div>
      ) : trainingHours.length === 0 ? (
        <div>Henüz antrenman saati eklenmedi.</div>
      ) : (
        <ul className="training-hours-list">
          {trainingHours.map(({ id: trainingId, trainingDate, trainingStartTime, trainingFinishTime }) => (
            <li key={trainingId} className="training-hours-item">
              <span>
                {trainingDate}: {trainingStartTime} - {trainingFinishTime}
              </span>
              <button
                className="edit-button"
                onClick={() => handleEdit(trainingId, trainingDate)}
              >
                <FontAwesomeIcon icon={faEdit} /> Düzenle
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(trainingId)}
              >
                <FontAwesomeIcon icon={faTrash} /> Sil
              </button>
            </li>
          ))}
        </ul>
      )}

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
              <option value="Gün Seçin">Gün Seçin</option>
              {Object.keys(dayToNumber).map((d) => (
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