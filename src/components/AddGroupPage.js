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
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      alert("Lütfen grup ismi girin!");
      return;
    }

    const newGroup = {
      age: groupName,
      trainingHours: [],
      isDeleted: false
    };

    try {
      await axios.post('https://localhost:7114/api/CategoryGroups', newGroup);
      setMessage("Grup başarıyla eklendi!");
      setError('');
      setTimeout(() => {
        navigate('/groups');
      }, 100);
    } catch (error) {
      console.error("Grup eklenirken hata oluştu:", error);
      setError("Grup eklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      setMessage('');
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
      {error && <div className="error-message">{error}</div>}
      <button className="cancel-button" onClick={() => navigate('/groups')}>İptal</button>
    </div>
  );
}

export default AddGroupPage;