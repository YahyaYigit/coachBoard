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
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    school: "",
    address: "",
    height: "",
    weight: "",
    motherName: "",
    motherContact: "",
    fatherName: "",
    fatherContact: "",
    email: "",
    password: "",
    healthProblem: "",
    whatsappGroup: "katılmadı",
    fatherWhatsappGroup: "katılmadı",
    motherWhatsappGroup: "katılmadı",
  });
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/groups/${groupId}`)
      .then((response) => {
        if (response.data) {
          const players = response.data.players || [];
          setPlayers(players);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Veri çekme hatası:", error);
        setLoading(false);
      });
  }, [groupId]);

  const handleEdit = (player) => {
    setEditingPlayer({ ...player });
    setIsEditing(true);
  };

  const handleSave = () => {
    axios
      .get(`http://localhost:5000/groups/${groupId}`)
      .then((response) => {
        const groupData = response.data;

        const updatedPlayers = groupData.players.map((player) =>
          player.id === editingPlayer.id ? editingPlayer : player
        );

        const updatedGroup = {
          ...groupData,
          players: updatedPlayers,
        };

        return axios.put(
          `http://localhost:5000/groups/${groupId}`,
          updatedGroup
        );
      })
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
      .get(`http://localhost:5000/groups/${groupId}`)
      .then((response) => {
        const groupData = response.data;

        const updatedPlayers = groupData.players.filter(
          (player) => player.id !== playerId
        );

        const updatedGroup = {
          ...groupData,
          players: updatedPlayers,
        };

        return axios.put(
          `http://localhost:5000/groups/${groupId}`,
          updatedGroup
        );
      })
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

  const handleNewPlayerChange = (e, field) => {
    setNewPlayer({
      ...newPlayer,
      [field]: e.target.value,
    });
  };

  const handleAddPlayer = () => {
    axios
      .get(`http://localhost:5000/groups/${groupId}`)
      .then((response) => {
        const groupData = response.data;

        const updatedGroup = {
          ...groupData,
          players: [...groupData.players, { ...newPlayer, id: Date.now() }],
        };

        return axios.put(
          `http://localhost:5000/groups/${groupId}`,
          updatedGroup
        );
      })
      .then(() => {
        setPlayers((prevPlayers) => [
          ...prevPlayers,
          { ...newPlayer, id: Date.now() },
        ]);
        setNewPlayer({
          firstName: "",
          lastName: "",
          dob: "",
          phone: "",
          school: "",
          address: "",
          height: "",
          weight: "",
          motherName: "",
          motherContact: "",
          fatherName: "",
          fatherContact: "",
          email: "",
          password: "",
          healthProblem: "",
          whatsappGroup: "katılmadı",
          fatherWhatsappGroup: "katılmadı",
          motherWhatsappGroup: "katılmadı",
        });
        alert("Yeni oyuncu eklendi.");
        setIsAddingPlayer(false);
      })
      .catch((error) => {
        console.error("Yeni oyuncu ekleme hatası:", error);
        alert("Bir hata oluştu.");
      });
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (players.length === 0 || isAddingPlayer) {
    return (
      <div>
        {isAddingPlayer ? (
          <div className="edit-form">
            <h2>Yeni Oyuncu Ekle</h2>
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
                        value={newPlayer.firstName}
                        onChange={(e) => handleNewPlayerChange(e, "firstName")}
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
                        value={newPlayer.lastName}
                        onChange={(e) => handleNewPlayerChange(e, "lastName")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>Doğum Tarihi:</label>
                    </td>
                    <td>
                      <input
                        type="date"
                        value={newPlayer.dob}
                        onChange={(e) => handleNewPlayerChange(e, "dob")}
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
                        value={newPlayer.phone}
                        onChange={(e) => handleNewPlayerChange(e, "phone")}
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
                        value={newPlayer.school}
                        onChange={(e) => handleNewPlayerChange(e, "school")}
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
                        value={newPlayer.address}
                        onChange={(e) => handleNewPlayerChange(e, "address")}
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
                        value={newPlayer.height}
                        onChange={(e) => handleNewPlayerChange(e, "height")}
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
                        value={newPlayer.weight}
                        onChange={(e) => handleNewPlayerChange(e, "weight")}
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
                        value={newPlayer.motherName}
                        onChange={(e) => handleNewPlayerChange(e, "motherName")}
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
                        value={newPlayer.motherContact}
                        onChange={(e) => handleNewPlayerChange(e, "motherContact")}
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
                        value={newPlayer.fatherName}
                        onChange={(e) => handleNewPlayerChange(e, "fatherName")}
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
                        value={newPlayer.fatherContact}
                        onChange={(e) => handleNewPlayerChange(e, "fatherContact")}
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
                        value={newPlayer.email}
                        onChange={(e) => handleNewPlayerChange(e, "email")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>Şifre:</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={newPlayer.password}
                        onChange={(e) => handleNewPlayerChange(e, "password")}
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
                        value={newPlayer.healthProblem}
                        onChange={(e) => handleNewPlayerChange(e, "healthProblem")}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>WhatsApp Katılımı:</label>
                      <input
                        type="checkbox"
                        checked={newPlayer.whatsappGroup === "katıldı"}
                        onChange={(e) =>
                          setNewPlayer({
                            ...newPlayer,
                            whatsappGroup: e.target.checked
                              ? "katıldı"
                              : "katılmadı",
                          })
                        }
                      />
                      <span>{newPlayer.whatsappGroup}</span>
                    </td>
                    <td>
                      <label>Baba WhatsApp Katılımı:</label>
                      <input
                        type="checkbox"
                        checked={newPlayer.fatherWhatsappGroup === "katıldı"}
                        onChange={(e) =>
                          setNewPlayer({
                            ...newPlayer,
                            fatherWhatsappGroup: e.target.checked
                              ? "katıldı"
                              : "katılmadı",
                          })
                        }
                      />
                      <span>{newPlayer.fatherWhatsappGroup}</span>
                    </td>
                    <td>
                      <label>Anne WhatsApp Katılımı:</label>
                      <input
                        type="checkbox"
                        checked={newPlayer.motherWhatsappGroup === "katıldı"}
                        onChange={(e) =>
                          setNewPlayer({
                            ...newPlayer,
                            motherWhatsappGroup: e.target.checked
                              ? "katıldı"
                              : "katılmadı",
                          })
                        }
                      />
                      <span>{newPlayer.motherWhatsappGroup}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="form-actions">
                <button type="button" onClick={handleAddPlayer}>
                  Ekle
                </button>
                <button type="button" onClick={() => setIsAddingPlayer(false)}>
                  İptal
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button onClick={() => setIsAddingPlayer(true)}>
            Yeni Oyuncu Ekle
          </button>
        )}
      </div>
    );
  }


  return (
    <div className="list-page">
      <button className="back-button" onClick={() => navigate(state?.from || -1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>Oyuncu Listesi - {groupId}</h1>
      <button onClick={() => setIsAddingPlayer(true)}>Yeni Oyuncu Ekle</button>
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
              <th>Şifre</th>
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
                <td>{player.dob}</td>
                <td>{player.address}</td>
                <td>{player.phone}</td>
                <td>{player.school}</td>
                <td>{player.height}</td>
                <td>{player.weight}</td>
                <td>{player.motherName}</td>
                <td>{player.motherContact}</td>
                <td>{player.fatherName}</td>
                <td>{player.fatherContact}</td>
                <td>{player.email}</td>
                <td>{player.password}</td>
                <td>{player.healthProblem || "Yok"}</td>
                <td>{player.whatsappGroup}</td>
                <td>{player.fatherWhatsappGroup}</td>
                <td>{player.motherWhatsappGroup}</td>
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
                      value={editingPlayer.firstName}
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
                      value={editingPlayer.lastName}
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "lastName")
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
                      type="date"
                      value={editingPlayer.dob}
                      onChange={(e) => handleChange(e, editingPlayer.id, "dob")}
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
                      value={editingPlayer.phone}
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "phone")
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
                      value={editingPlayer.school}
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
                      value={editingPlayer.address}
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
                      value={editingPlayer.height}
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
                      value={editingPlayer.weight}
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
                      value={editingPlayer.motherName}
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
                      value={editingPlayer.motherContact}
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "motherContact")
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
                      value={editingPlayer.fatherName}
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
                      value={editingPlayer.fatherContact}
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "fatherContact")
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
                      value={editingPlayer.email}
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "email")
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>Şifre:</label>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingPlayer.password}
                      onChange={(e) =>
                        handleChange(e, editingPlayer.id, "password")
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
                      value={editingPlayer.healthProblem}
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
                      checked={editingPlayer.whatsappGroup === "katıldı"}
                      onChange={(e) =>
                        setEditingPlayer({
                          ...editingPlayer,
                          whatsappGroup: e.target.checked
                            ? "katıldı"
                            : "katılmadı",
                        })
                      }
                    />
                    <span>{editingPlayer.whatsappGroup}</span>
                  </td>
                  <td>
                    <label>Baba WhatsApp Katılımı:</label>
                    <input
                      type="checkbox"
                      checked={editingPlayer.fatherWhatsappGroup === "katıldı"}
                      onChange={(e) =>
                        setEditingPlayer({
                          ...editingPlayer,
                          fatherWhatsappGroup: e.target.checked
                            ? "katıldı"
                            : "katılmadı",
                        })
                      }
                    />
                    <span>{editingPlayer.fatherWhatsappGroup}</span>
                  </td>
                  <td>
                    <label>Anne WhatsApp Katılımı:</label>
                    <input
                      type="checkbox"
                      checked={editingPlayer.motherWhatsappGroup === "katıldı"}
                      onChange={(e) =>
                        setEditingPlayer({
                          ...editingPlayer,
                          motherWhatsappGroup: e.target.checked
                            ? "katıldı"
                            : "katılmadı",
                        })
                      }
                    />
                    <span>{editingPlayer.motherWhatsappGroup}</span>
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
