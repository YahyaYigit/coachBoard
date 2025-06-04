import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/EditGroupPage.css";

function EditGroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [groupName, setGroupName] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state) {
      setGroupName(location.state.name);
      setIsDeleted(location.state.isDeleted || false);
    }
  }, [location.state]);

  const handleSave = async () => {
    try {
      const updatedGroup = {
        id: parseInt(id, 10),
        age: groupName,
        isDeleted: isDeleted,
      };
  
      console.log("Gönderilen veri:", updatedGroup);
  
      const response = await axiosInstance.put(`/CategoryGroups`, updatedGroup);
      console.log("API yanıtı:", response.data);
  
      setMessage("Grup başarıyla kaydedildi.");
      setTimeout(() => {
        navigate("/groups");
      }, 1000);
    } catch (error) {
      console.error("Grup güncellenirken hata oluştu:", error);
      alert("Grup güncellenirken bir hata oluştu.");
    }
  };  
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/CategoryGroups/${id}`);

      setMessage("Grup başarıyla silindi.");
      setTimeout(() => {
        navigate("/groups");
      }, 1000);
    } catch (error) {
      console.error("Grup silinirken hata oluştu:", error);
      alert("Grup silinirken bir hata oluştu.");
    }
  };

  return (
    <div className="edit-group-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h2>Grup Düzenle</h2>
      <input
        className="editGroupInput"
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Grup Adını Girin"
      />
      <div className="button-container">
        <button onClick={handleSave}>Kaydet</button>
        <button onClick={() => navigate("/groups")}>İptal</button>
      </div>
      <button onClick={handleDelete} className="delete-button">
        Sil
      </button>
      {message && <div className="success-message">{message}</div>}
    </div>
  );
}

export default EditGroupPage;