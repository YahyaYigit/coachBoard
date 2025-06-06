import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/ListPages.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function ListPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [categoryGroup, setCategoryGroup] = useState(
    state?.categoryGroup || ""
  );
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState({
    firstName: "",
    lastName: "",
    categoryGroupsId:"",
    duesId: 1,
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
    axios
      .get(`https://localhost:7114/api/User?page=1&pageSize=10`)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          const players = response.data.data.filter(
            (player) =>
              player.categoryGroupsId === parseInt(groupId) &&
              player.categoryGroups === categoryGroup
          );
          setPlayers(players);
        } else {
          console.error("Beklenmeyen veri formatı:", response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Veri çekme hatası:", error);
        setLoading(false);
      });
  }, [groupId, categoryGroup]);

  const handleEdit = (player) => {
    setEditingPlayer({ ...player });
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedPlayer = {
      id: editingPlayer.id,
      firstName: editingPlayer.firstName,
      lastName: editingPlayer.lastName,
      categoryGroupsId: parseInt(groupId),
      duesId: 1,
      birtDay: editingPlayer.birtDay,
      tcNo: editingPlayer.tcNo,
      birthPlace: editingPlayer.birthPlace,
      school: editingPlayer.school,
      height: editingPlayer.height,
      weight: editingPlayer.weight,
      healthProblem: editingPlayer.healthProblem,
      isAcceptedWhatsappGroup: editingPlayer.isAcceptedWhatsappGroup === "katıldı",
      isAcceptedMotherWhatsappGroup: editingPlayer.isAcceptedMotherWhatsappGroup === "katıldı",
      isAcceptedFatherWhatsappGroup: editingPlayer.isAcceptedFatherWhatsappGroup === "katıldı",
      address: editingPlayer.address,
      phoneNumber: editingPlayer.phoneNumber,
      motherName: editingPlayer.motherName,
      motherPhoneNumber: editingPlayer.motherPhoneNumber,
      fatherName: editingPlayer.fatherName,
      fatherPhoneNumber: editingPlayer.fatherPhoneNumber,
      email: editingPlayer.email,
      password: editingPlayer.password,
      isDeleted: false
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

  const handleChange = (e, playerId, field) => {
    setEditingPlayer({
      ...editingPlayer,
      [field]: e.target.value,
    });
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="list-page">
      <button
        className="back-button"
        onClick={() => navigate(state?.from || -1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>Oyuncu Listesi - {groupId}</h1>
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
                  <input type="checkbox" checked={player.isAcceptedWhatsappGroup === "katıldı"} readOnly />
                </td>
                <td>
                  <input type="checkbox" checked={player.isAcceptedFatherWhatsappGroup === "katıldı"} readOnly />
                </td>
                <td>
                  <input type="checkbox" checked={player.isAcceptedMotherWhatsappGroup === "katıldı"} readOnly />
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "firstName")
                      }
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "lastName")
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Grup İd:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.categoryGroupsId || ""}
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "categoryGroupsId")
                      }
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "birtDay")
                      }
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "phoneNumber")
                      }
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "school")
                      }
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "address")
                      }
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "height")
                      }
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "weight")
                      }
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "motherName")
                      }
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "motherPhoneNumber")
                      }
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "fatherName")
                      }
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "fatherPhoneNumber")
                      }
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "email")
                      }
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
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "healthProblem")
                      }
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
            <div className="form-actions">
              <button type="button" onClick={handleSave}>
                Kaydet
              </button>
              <button type="button" onClick={() => setIsEditing(false)}>
                İptal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
export default ListPage;
