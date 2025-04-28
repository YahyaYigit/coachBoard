import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AllPlayersPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import debounce from "lodash/debounce";

function AllPlayersPage() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPlayer, setEditingPlayer] = useState({
    firstName: "",
    lastName: "",
    categoryGroupsId: "",
    birtDay: "",
    address: "",
    phoneNumber: "",
    school: "",
    height: "",
    weight: "",
    motherName: "",
    motherPhoneNumber: "",
    fatherName: "",
    fatherPhoneNumber: "",
    email: "",
    healthProblem: "",
    isAcceptedWhatsappGroup: "katılmadı",
    isAcceptedFatherWhatsappGroup: "katılmadı",
    isAcceptedMotherWhatsappGroup: "katılmadı",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = (query = "") => {
    setLoading(true);
    axios
      .get(`https://localhost:7114/api/User?page=1&pageSize=10&search=${query}`)
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

  const debouncedFetchPlayers = useCallback(
    debounce((query) => fetchPlayers(query), 300),
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetchPlayers(query);
  };

  const handleEdit = (player) => {
    setEditingPlayer({ ...player });
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedPlayer = {
      ...editingPlayer,
      isAcceptedWhatsappGroup:
        editingPlayer.isAcceptedWhatsappGroup === "katıldı",
      isAcceptedFatherWhatsappGroup:
        editingPlayer.isAcceptedFatherWhatsappGroup === "katıldı",
      isAcceptedMotherWhatsappGroup:
        editingPlayer.isAcceptedMotherWhatsappGroup === "katıldı",
    };

    axios
      .put(`https://localhost:7114/api/User/UpdateUser`, updatedPlayer)
      .then(() => {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.id === editingPlayer.id ? editingPlayer : player
          )
        );
        setIsEditing(false);
        alert("Oyuncu bilgileri güncellendi.");
      })
      .catch((error) => {
        console.error("Güncelleme hatası:", error);
        alert("Bir hata oluştu.");
      });
  };

  const handleDelete = (playerId) => {
    axios
      .delete(`https://localhost:7114/api/User/DeleteUser?id=${playerId}`)
      .then(() => {
        setPlayers((prevPlayers) =>
          prevPlayers.filter((player) => player.id !== playerId)
        );
        alert("Oyuncu silindi.");
      })
      .catch((error) => {
        console.error("Silme hatası:", error);
        alert("Bir hata oluştu.");
      });
  };

  const handleChange = (e, field) => {
    setEditingPlayer({
      ...editingPlayer,
      [field]: e.target.value,
    });
  };

  return (
    <div className="all-players-page">
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>Tüm Oyuncular</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="İsim veya Soyisim ile Ara..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

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
              <th>WhatsApp Katılımı</th>
              <th>Baba WhatsApp Katılımı</th>
              <th>Anne WhatsApp Katılımı</th>
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
                <td>
                  <input
                    type="checkbox"
                    checked={player.isAcceptedWhatsappGroup === "katıldı"}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={player.isAcceptedFatherWhatsappGroup === "katıldı"}
                    readOnly
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={player.isAcceptedMotherWhatsappGroup === "katıldı"}
                    readOnly
                  />
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(player)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(player.id)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && (
        <div className="edit-form">
          <h2>Oyuncu Düzenle</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <table className="edit-table">
              <tbody>
                <tr>
                  <td>
                    <label>İsim:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.firstName || ""}
                      onChange={(e) => handleChange(e, "firstName")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Soyisim:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.lastName || ""}
                      onChange={(e) => handleChange(e, "lastName")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Grup ID:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.categoryGroupsId || ""}
                      onChange={(e) => handleChange(e, "categoryGroupsId")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Doğum Tarihi:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.birtDay || ""}
                      onChange={(e) => handleChange(e, "birtDay")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Telefon:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.phoneNumber || ""}
                      onChange={(e) => handleChange(e, "phoneNumber")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Adres:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.address || ""}
                      onChange={(e) => handleChange(e, "address")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Okul:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.school || ""}
                      onChange={(e) => handleChange(e, "school")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Boy:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.height || ""}
                      onChange={(e) => handleChange(e, "height")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Kilo:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.weight || ""}
                      onChange={(e) => handleChange(e, "weight")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Anne Adı:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.motherName || ""}
                      onChange={(e) => handleChange(e, "motherName")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Anne İletişim:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.motherPhoneNumber || ""}
                      onChange={(e) => handleChange(e, "motherPhoneNumber")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Baba Adı:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.fatherName || ""}
                      onChange={(e) => handleChange(e, "fatherName")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Baba İletişim:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.fatherPhoneNumber || ""}
                      onChange={(e) => handleChange(e, "fatherPhoneNumber")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>E-posta:</label>
                  </td>
                  <td>
                    <input
                      type="email"
                      value={editingPlayer.email || ""}
                      onChange={(e) => handleChange(e, "email")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Sağlık Problemi:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.healthProblem || ""}
                      onChange={(e) => handleChange(e, "healthProblem")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Baba İletişim:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.fatherPhoneNumber || ""}
                      onChange={(e) => handleChange(e, "fatherPhoneNumber")}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>WhatsApp Katılımı:</label>
                    <input
                      type="checkbox"
                      checked={
                        editingPlayer.isAcceptedWhatsappGroup === "katıldı"
                      }
                      onChange={(e) =>
                        setEditingPlayer({
                          ...editingPlayer,
                          isAcceptedWhatsappGroup: e.target.checked
                            ? "katıldı"
                            : "katılmadı",
                        })
                      }
                    />
                    <span>{editingPlayer.isAcceptedWhatsappGroup}</span>
                  </td>
                  <td>
                    <label>Baba WhatsApp Katılımı:</label>
                    <input
                      type="checkbox"
                      checked={
                        editingPlayer.isAcceptedFatherWhatsappGroup ===
                        "katıldı"
                      }
                      onChange={(e) =>
                        setEditingPlayer({
                          ...editingPlayer,

                          isAcceptedFatherWhatsappGroup: e.target.checked
                            ? "katıldı"
                            : "katılmadı",
                        })
                      }
                    />
                    <span>{editingPlayer.isAcceptedFatherWhatsappGroup}</span>
                  </td>
                  <td>
                    <label>Anne WhatsApp Katılımı:</label>
                    <input
                      type="checkbox"
                      checked={
                        editingPlayer.isAcceptedMotherWhatsappGroup ===
                        "katıldı"
                      }
                      onChange={(e) =>
                        setEditingPlayer({
                          ...editingPlayer,

                          isAcceptedMotherWhatsappGroup: e.target.checked
                            ? "katıldı"
                            : "katılmadı",
                        })
                      }
                    />
                    <span>{editingPlayer.isAcceptedMotherWhatsappGroup}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="edit-buttons">
              <button type="button" onClick={handleSave}>Kaydet</button>
              <button type="button" onClick={() => setIsEditing(false)}>İptal</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AllPlayersPage;