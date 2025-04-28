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
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state) {
      setGroupName(location.state.name);
    }
  }, [location.state]);

  const handleSave = async () => {
    try {
      const updatedGroup = {
        id: id,  // API'ye gönderdiğiniz id
        age: groupName,  // Güncellenmiş yaş
        isDeleted: false,  // isDeleted durumunu burada tutuyoruz
        trainingHours: []  // Güncellemek istediğiniz diğer alanlar
      };
  
      const response = await axiosInstance.put(`/CategoryGroups/${id}`, updatedGroup);
      console.log(response.data); // Dönüş verilerini kontrol edin
  
      setMessage("Grup başarıyla kaydedildi.");
      setTimeout(() => {
        navigate("/groups");
      }, 100);
    } catch (error) {
      console.error("Grup güncellenirken hata oluştu:", error);
    }
  };
  
  
  
  

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/CategoryGroups/${id}`);

      setMessage("Grup başarıyla silindi.");
      setTimeout(() => {
        navigate("/groups");
      }, 100);
    } catch (error) {
      console.error("Grup silinirken hata oluştu:", error);
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