import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../styles/PlayerTrainingHours.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function PlayerTrainingHours() {
  const { team } = useParams();
  const navigate = useNavigate();
  const [trainingHours, setTrainingHours] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("team parametresi:", team);

    axiosInstance
      .get(`/TrainingHours?categoryGroupsId=${team}`)
      .then((response) => {
        console.log("API'den gelen veri:", response.data);
        const data = response.data.data || [];
        setTrainingHours(data);
      })
      .catch((error) => {
        console.error("Antrenman saatleri alınamadı:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [team]);

  if (loading) {
    return <div className="loading">Antrenman saatleri yükleniyor...</div>;
  }

  return (
    <div className="training-hours">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>{`Grup ${team} İçin Antrenman Saatleri`}</h1>
      {trainingHours && trainingHours.length > 0 ? (
        <div className="training-hours-container">
          {trainingHours.map((training) => (
            <div key={training.id} className="training-box">
              <span className="training-date">{training.trainingDate}</span>
              <span className="training-time">
                {training.trainingStartTime} - {training.trainingFinishTime}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>Antrenman saati bulunmamaktadır.</p>
      )}
    </div>
  );
}

export default PlayerTrainingHours;