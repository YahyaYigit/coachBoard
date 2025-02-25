import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/PlayerTrainingHours.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function PlayerTrainingHours() {
  const { team } = useParams();
  const navigate = useNavigate();
  const [trainingHours, setTrainingHours] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/groups?trainingHours=${team}`)
      .then((response) => {
        const group = response.data[0];
        if (group) {
          setTrainingHours(group.trainingHours);
        }
      })
      .catch((error) => {
        console.error("Antreman saatleri alınamadı:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [team]);

  if (loading) {
    return <div className="loading">Antreman saatleri yükleniyor...</div>;
  }

  return (
    <div className="training-hours">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>{team} Grubu İçin Antreman Saatleri</h1>
      {trainingHours && trainingHours.length > 0 ? (
        <ul className="training-hours-list">
          {trainingHours.map((training, index) => (
            <li key={index} className="training-hours-item">
              <span>{training.day}:</span> {training.time}
            </li>
          ))}
        </ul>
      ) : (
        <p>Antreman saati bulunmamaktadır.</p>
      )}
    </div>
  );
}

export default PlayerTrainingHours;
