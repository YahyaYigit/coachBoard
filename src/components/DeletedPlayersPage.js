import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AllPlayersPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function DeletedPlayersPage() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDeletedPlayers();
  }, []);

  const fetchDeletedPlayers = () => {
    setLoading(true);
    axios
      .get("https://localhost:7114/api/User/getAllDeleted?page=1&pageSize=10")
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setPlayers(response.data.data);
        } else {
          console.error("Beklenmeyen veri formatı:", response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Veri çekme hatası:", error);
        setLoading(false);
      });
  };

  const handleEdit = (player) => {
    setEditingPlayer({ ...player });
    setErrors({});
  };

  const handleSave = () => {
    const newErrors = {};
    if (!editingPlayer.categoryGroupsId) {
      newErrors.categoryGroupsId = "Doldurmak zorunlu";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    axios
      .put("https://localhost:7114/api/User/UpdateUser", editingPlayer)
      .then(() => {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.id === editingPlayer.id ? editingPlayer : player
          )
        );
        setEditingPlayer(null);
        alert("Oyuncu bilgileri güncellendi.");
      })
      .catch((error) => {
        console.error("Güncelleme hatası:", error);
        alert("Bir hata oluştu.");
      });
  };

  const handleChange = (e, field) => {
    setEditingPlayer({
      ...editingPlayer,
      [field]: e.target.value,
    });
  };

  const handleIsDeletedChange = (e) => {
    setEditingPlayer({
      ...editingPlayer,
      isDeleted: e.target.value === "true",
    });
  };

  return (
    <div className="all-players-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>Ayrılan Oyuncular</h1>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>İsim</th>
                <th>Soyisim</th>
                <th>Doğum Tarihi</th>
                <th>Adres</th>
                <th>Telefon</th>
                <th>Okul</th>
                <th>Boy</th>
                <th>Kilo</th>
                <th>Anne Adı</th>
                <th>Anne İletişim</th>
                <th>Baba Adı</th>
                <th>Baba İletişim</th>
                <th>E-posta</th>
                <th>Sağlık Problemi</th>
                <th>Silindi mi?</th>
                <th>Kategori</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id}>
                  <td>{player.firstName}</td>
                  <td>{player.lastName}</td>
                  <td>{player.birtDay}</td>
                  <td>{player.address}</td>
                  <td>{player.phoneNumber}</td>
                  <td>{player.school}</td>
                  <td>{player.height}</td>
                  <td>{player.weight}</td>
                  <td>{player.motherName}</td>
                  <td>{player.motherPhoneNumber}</td>
                  <td>{player.fatherName}</td>
                  <td>{player.fatherPhoneNumber}</td>
                  <td>{player.email}</td>
                  <td>{player.healthProblem || "Yok"}</td>
                  <td>{player.isDeleted ? "True" : "False"}</td>
                  <td>{player.categoryGroupsId || "Belirtilmemiş"}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(player)}
                    >
                      Düzenle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingPlayer && (
       <div className="edit-form">
       <h2>Oyuncu Düzenle</h2>
       <form onSubmit={(e) => e.preventDefault()} className="form-container">
         <div className="form-group">
           <label>İsim:</label>
           <input
             type="text"
             value={editingPlayer.firstName || ""}
             onChange={(e) => handleChange(e, "firstName")}
             placeholder="İsim girin"
           />
         </div>
         <div className="form-group">
           <label>Soyisim:</label>
           <input
             type="text"
             value={editingPlayer.lastName || ""}
             onChange={(e) => handleChange(e, "lastName")}
             placeholder="Soyisim girin"
           />
         </div>
         <div className="form-group">
           <label>Kategori:</label>
           <input
             type="text"
             value={editingPlayer.categoryGroupsId || ""}
             onChange={(e) => handleChange(e, "categoryGroupsId")}
             placeholder="Kategori ID girin"
           />
           {errors.categoryGroupsId && (
             <span className="error-text">{errors.categoryGroupsId}</span>
           )}
         </div>
         <div className="form-group">
           <label>Silindi mi?</label>
           <select
             value={editingPlayer.isDeleted ? "true" : "false"}
             onChange={handleIsDeletedChange}
           >
             <option value="true">Evet</option>
             <option value="false">Hayır</option>
           </select>
         </div>
         <div className="edit-buttons">
           <button type="button" onClick={handleSave} className="save-button">
             Kaydet
           </button>
           <button
             type="button"
             onClick={() => setEditingPlayer(null)}
             className="cancel-button"
           >
             İptal
           </button>
         </div>
       </form>
     </div>
      )}
    </div>
  );
}

export default DeletedPlayersPage;