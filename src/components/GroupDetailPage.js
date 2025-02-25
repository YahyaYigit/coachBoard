import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/GroupsDetailPage.css";

function GroupsDetailPage() {
  const { teamId } = useParams();
  const [group, setGroup] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:5000/groups");
        setGroups(response.data);
      } catch (error) {
        console.error("Grup verileri alınamadı", error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      const jsonServerId = groups[teamId - 1]?.id;
      
      if (!jsonServerId) {
        console.error("Geçersiz grup ID");
        return;
      }

      axios.get(`http://localhost:5000/groups/${jsonServerId}`)
        .then(response => {
          setGroup(response.data);
        })
        .catch(error => {
          console.error("Veri çekme hatası:", error);
        });
    }
  }, [teamId, groups]);

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="group-detail-page">
      <button className="back-button" onClick={() => navigate(state?.from || -1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <h1>{group.name} - Balkan Yeşilbağlar Spor Kulübü</h1>
      <h2>{group.name}</h2>

      <div className="buttons-container">
        <button className="action-button" onClick={() => navigate(`/training-hours/${group.id}`)}>Antreman Saatleri</button>
        <button className="action-button" onClick={() => navigate(`/list-page/${group.id}`)}>Listem</button>
        <button className="action-button" onClick={() => navigate(`/fee/${group.id}`)}>Aidat</button>
        <button className="action-button" onClick={() => navigate(`/attendance/${group.id}`)}>Yoklama</button>
      </div>

      <button className="notify-button">Bu gruba bildirim gönder</button>
    </div>
  );
}

export default GroupsDetailPage;
