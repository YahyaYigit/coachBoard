import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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
      const response = await axios.get(`http://localhost:5000/groups/${id}`);
      const existingGroup = response.data;

      const newId = `group_${groupName.toLowerCase().replace(/\s+/g, "")}`;

      const updatedGroup = {
        ...existingGroup,
        name: groupName,
        id: newId,
      };

      await axios.delete(`http://localhost:5000/groups/${id}`);
      await axios.post(`http://localhost:5000/groups`, updatedGroup);

      setMessage("Grup başarıyla kaydedildi.");
      setTimeout(() => {
        navigate("/groups");
      }, 2000);
    } catch (error) {
      console.error("Grup güncellenirken hata oluştu:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/groups/${id}`);
      setMessage("Grup başarıyla silindi.");
      setTimeout(() => {
        navigate("/groups");
      }, 2000);
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
