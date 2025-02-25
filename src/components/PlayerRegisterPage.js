import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/PlayerRegisterPage.css";

function PlayerRegisterPage() {
  const navigate = useNavigate();
  const [player, setPlayer] = useState({
    firstName: "",
    lastName: "",
    birthPlace: "",
    birthDate: "",
    address: "",
    phone: "",
    school: "",
    height: "",
    weight: "",
    healthProblem: "",
    motherName: "",
    motherPhone: "",
    fatherName: "",
    fatherPhone: "",
    email: "",
    password: "",
    joinWhatsapp: false,
    fatherJoinWhatsapp: false,
    motherJoinWhatsapp: false,
    acceptedKVKK: false,
    acceptedImportant: false,
  });
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const savedPlayer = JSON.parse(localStorage.getItem("playerData"));
    if (savedPlayer) {
      setPlayer(savedPlayer);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playerData", JSON.stringify(player));
  }, [player]);

  const handleChange = (e) => {
    setPlayer({ ...player, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    if (!isNaN(value) || value === "") {
      setPlayer({ ...player, [name]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPlayer({ ...player, [name]: checked });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(player).forEach((key) => {
      if (
        !player[key] &&
        key !== "healthProblem" &&
        key !== "joinWhatsapp" &&
        key !== "fatherJoinWhatsapp" &&
        key !== "motherJoinWhatsapp" &&
        key !== "acceptedKVKK" &&
        key !== "acceptedImportant"
      ) {
        newErrors[key] = `${key} alanı boş olamaz!`;
      }
    });

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (player.email && !emailRegex.test(player.email)) {
      newErrors.email = "Geçersiz e-posta!";
    }

    if (player.phone && isNaN(player.phone)) {
      newErrors.phone = "Telefon numarası sadece sayılardan oluşmalıdır!";
    }
    if (player.motherPhone && isNaN(player.motherPhone)) {
      newErrors.motherPhone =
        "Anne telefon numarası sadece sayılardan oluşmalıdır!";
    }
    if (player.fatherPhone && isNaN(player.fatherPhone)) {
      newErrors.fatherPhone =
        "Baba telefon numarası sadece sayılardan oluşmalıdır!";
    }

    if (player.password && player.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!player.acceptedKVKK || !player.acceptedImportant) {
      alert("Lütfen KVKK ve Önemli Hususları kabul edin.");
      return;
    }

    if (!validateForm()) {
      setFormSubmitted(true);
      return;
    }

    try {
      const groupResponse = await axios.get(
        `http://localhost:5000/groups?name=${player.group}`
      );
      const selectedGroup = groupResponse.data[0];

      if (!selectedGroup) {
        alert("Seçilen grup bulunamadı!");
        return;
      }

      const newPlayer = {
        id: Date.now(),
        firstName: player.firstName,
        lastName: player.lastName,
        club: "Balkan Yeşilbağlar Spor Kulübü",
        birthPlace: player.birthPlace,
        dob: player.birthDate,
        address: player.address,
        phone: player.phone,
        school: player.school,
        height: player.height,
        weight: player.weight,
        healthProblem: player.healthProblem,
        motherName: player.motherName,
        motherContact: player.motherPhone,
        fatherName: player.fatherName,
        fatherContact: player.fatherPhone,
        email: player.email,
        password: player.password,
        fee: 0,
        attendance: "belirtilmedi",
        whatsappGroup: player.joinWhatsapp ? "katıldı" : "katılmadı",
        fatherWhatsappGroup: player.fatherJoinWhatsapp
          ? "katıldı"
          : "katılmadı",
        motherWhatsappGroup: player.motherJoinWhatsapp
          ? "katıldı"
          : "katılmadı",
      };

      const updatedGroup = {
        ...selectedGroup,
        players: [...selectedGroup.players, newPlayer],
      };

      await axios.put(
        `http://localhost:5000/groups/${selectedGroup.id}`,
        updatedGroup
      );
      alert("Kayıt başarılı!");
      navigate("/playerAuth");
    } catch (error) {
      console.error("Kayıt sırasında hata oluştu:", error);
      alert("Kayıt başarısız!");
    }
  };

  return (
    <div className="register-page container">
      <div className="card shadow-lg">
        <div className="card-body">
          <div className="text-center mb-3">
            <img
              src={require("../images/balkanlogo.jpg")}
              alt="Kulüp Logosu"
              className="img-fluid"
            />
          </div>

          <h2 className="register_title text-center mb-4">
            BALKAN YEŞİLBAĞLAR SPOR KULÜBÜ
          </h2>
          <h3 className="register_title text-center mb-4"> KAYIT FORMU </h3>

          <form onSubmit={handleSubmit}>
            {/* Form Fields */}
            <div className="mb-3">
              <label className="form-label">Adı</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                placeholder="Adınızı girin"
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.firstName && (
                <div className="text-danger">{errors.firstName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Soyadı</label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                placeholder="Soyadınızı girin"
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.lastName && (
                <div className="text-danger">{errors.lastName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Doğum Yeri</label>
              <input
                type="text"
                name="birthPlace"
                className="form-control"
                placeholder="Doğum yerinizi girin"
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.birthPlace && (
                <div className="text-danger">{errors.birthPlace}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Doğum Tarihi</label>
              <input
                type="date"
                name="birthDate"
                className="form-control"
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.birthDate && (
                <div className="text-danger">{errors.birthDate}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Adres</label>
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder="Adresinizi girin"
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.address && (
                <div className="text-danger">{errors.address}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Telefon</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="Telefon numaranızı girin"
                value={player.phone}
                onChange={handlePhoneChange}
                required
              />
              {formSubmitted && errors.phone && (
                <div className="text-danger">{errors.phone}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                WhatsApp Grubuna Katılmak İstiyor Musunuz?
              </label>
              <input
                type="checkbox"
                name="joinWhatsapp"
                onChange={handleCheckboxChange}
                checked={player.joinWhatsapp}
              />
              <span> Evet</span>
            </div>

            <div className="mb-3">
              <label className="form-label">Okul</label>
              <input
                type="text"
                name="school"
                className="form-control"
                placeholder="Okul adını girin"
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.school && (
                <div className="text-danger">{errors.school}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Boy</label>
              <input
                type="text"
                name="height"
                className="form-control"
                placeholder="Boyunuzu girin"
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.height && (
                <div className="text-danger">{errors.height}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Kilo</label>
              <input
                type="text"
                name="weight"
                className="form-control"
                placeholder="Kilonuzu girin"
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.weight && (
                <div className="text-danger">{errors.weight}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Sağlık Problemi</label>
              <input
                type="text"
                name="healthProblem"
                className="form-control"
                placeholder="Sağlık problemini belirtin"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Anne Adı</label>
              <input
                type="text"
                name="motherName"
                className="form-control"
                placeholder="Anne adını girin"
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.motherName && (
                <div className="text-danger">{errors.motherName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Anne Telefon</label>
              <input
                type="text"
                name="motherPhone"
                className="form-control"
                placeholder="Anne telefonunu girin"
                value={player.motherPhone}
                onChange={handlePhoneChange}
                required
              />
              {formSubmitted && errors.motherPhone && (
                <div className="text-danger">{errors.motherPhone}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Baba Adı</label>
              <input
                type="text"
                name="fatherName"
                className="form-control"
                placeholder="Baba adını girin"
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.fatherName && (
                <div className="text-danger">{errors.fatherName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Baba Telefon</label>
              <input
                type="text"
                name="fatherPhone"
                className="form-control"
                placeholder="Baba telefonunu girin"
                value={player.fatherPhone}
                onChange={handlePhoneChange}
                required
              />
              {formSubmitted && errors.fatherPhone && (
                <div className="text-danger">{errors.fatherPhone}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">E-posta</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="E-posta adresinizi girin"
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.email && (
                <div className="text-danger">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Şifre</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Şifrenizi girin"
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.password && (
                <div className="text-danger">{errors.password}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                KVKK Aydınlatma Metnini Kabul Ediyorum
              </label>
              <input
                type="checkbox"
                name="acceptedKVKK"
                onChange={handleCheckboxChange}
                checked={player.acceptedKVKK}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Önemli Hususları Kabul Ediyorum
              </label>
              <input
                type="checkbox"
                name="acceptedImportant"
                onChange={handleCheckboxChange}
                checked={player.acceptedImportant}
              />
            </div>

            <div className="text-center mb-3">
              <button type="submit" className="btn-color btn btn-primary">
                Kaydı Tamamla
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PlayerRegisterPage;
