import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import '../styles/AddGroupPage.css';

function AddGroupPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [groupName, setGroupName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      alert("Lütfen grup ismi girin!");
      return;
    }

    const newGroup = {
      id: `group_${groupName.toLowerCase().replace(/\s+/g, '')}`, 
      name: groupName,
      trainingHours: [],
      players: []
    };

    try {
      await axios.post('http://localhost:5000/groups', newGroup);
      setMessage("Grup başarıyla eklendi!");
      setTimeout(() => {
        navigate('/');  
      }, 2000);
    } catch (error) {
      console.error("Grup eklenirken hata oluştu:", error);
    }
  };

  return (
    <div className="add-group-container">
      <button className="back-button" onClick={() => navigate(state?.from || -1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>Yeni Grup Ekle</h1>
      <form className="add-group-form" onSubmit={handleSubmit}>
        <label className="form-label">Grup İsmi:</label>
        <input 
          className="form-input"
          type="text" 
          value={groupName} 
          onChange={(e) => setGroupName(e.target.value)} 
          placeholder="Örn: U-11"
        />
        <button className="submit-buttons" type="submit">Ekle</button>
      </form>
      {message && <div className="success-message">{message}</div>}
      <button className="cancel-button" onClick={() => navigate('/')}>İptal</button>
    </div>
  );
}

export default AddGroupPage;
