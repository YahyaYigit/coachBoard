import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; 
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
        const response = await axiosInstance.get("/CategoryGroups?page=1&pageSize=10");
        setGroups(response.data.data);
      } catch (error) {
        console.error("Grup verileri alınamadı", error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      const groupId = groups[teamId - 1]?.id;
      
      if (!groupId) {
        console.error("Geçersiz grup ID");
        return;
      }

      axiosInstance.get(`/CategoryGroups/${groupId}`)
        .then(response => {
          setGroup(response.data);
        })
        .catch(error => {
          console.error("Veri çekme hatası:", error);
        });
    }
  }, [teamId, groups]);

  const handleNavigate = (path) => {
    navigate(path, { state: { categoryGroup: group.age } });
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="group-detail-page">
      <button className="back-button" onClick={() => navigate(state?.from || -1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <h1>{group.age} - Balkan Yeşilbağlar Spor Kulübü</h1>
      <h2>{group.age}</h2>
      <h3>{group.id}</h3>


      <div className="buttons-container">
        <button className="action-button" onClick={() => handleNavigate(`/training-hours/${group.id}`)}>Antreman Saatleri</button>
        <button className="action-button" onClick={() => handleNavigate(`/list-page/${group.id}`)}>Listem</button>
        <button className="action-button" onClick={() => handleNavigate(`/fee/${group.id}`)}>Aidat</button>
        <button className="action-button" onClick={() => handleNavigate(`/attendance/${group.id}`)}>Yoklama</button>
      </div>

      <button className="notify-button">Bu gruba bildirim gönder</button>
    </div>
  );
}

export default GroupsDetailPage;