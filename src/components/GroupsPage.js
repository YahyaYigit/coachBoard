import React, { useEffect, useState } from 'react';
import '../styles/GroupsPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,} from '@fortawesome/free-solid-svg-icons';

function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/groups')
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => {
        console.error("Gruplar yüklenirken hata oluştu:", error);
      });
  }, []);

  const handleTeamClick = (index) => {
    navigate(`/group/${index + 1}`);  
  };

  const handleEdit = (group) => {
    navigate(`/edit-group/${group.id}`, { state: { name: group.name } });
  };

  return (
    <div className="groups-page">


      <h1>Balkan Yeşilbağlar Spor Kulübü</h1>
      <h2>Gruplarım</h2>

      <button className="add-group-button" onClick={() => navigate('/add-group')}>
        + Grup Ekle
      </button>

      <div className="groups-list">
        {groups.length > 0 ? (
          groups.map((group, index) => (
            <div key={index} className="group-item">
              <span onClick={() => handleTeamClick(index)}>{group.name}</span>
              <button onClick={() => handleEdit(group)} className="edit-buttons">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
          ))
        ) : (
          <p>Gruplar yükleniyor...</p>
        )}
      </div>
    </div>
  );
}

export default GroupsPage;
