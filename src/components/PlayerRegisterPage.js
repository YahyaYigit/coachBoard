import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/PlayerRegisterPage.css";

function PlayerRegisterPage() {
  const navigate = useNavigate();
  const [response, setPlayer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    tcNo: "",
    birthPlace: "",
    birthDay: "",
    school: "",
    height: "",
    weight: "",
    healthProblem: "",
    address: "",
    phoneNumber: "",
    motherName: "",
    motherPhoneNumber: "",
    fatherName: "",
    fatherPhoneNumber: "",
    whatsappGroup: false,
    fatherWhatsappGroup: false,
    motherWhatsappGroup: false,
    acceptedKVKK: false,
    acceptedImportant: false,
  });
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedPlayer = JSON.parse(localStorage.getItem("playerData"));
    if (savedPlayer) {
      setPlayer(savedPlayer);
    }
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      localStorage.setItem("playerData", JSON.stringify(response));
    }
  }, [response, isSubmitting]);

  const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (
      name !== "email" &&
      name !== "password" &&
      name !== "healthProblem" &&
      name !== "address"
    ) {
      updatedValue = capitalize(value);
    }
    setPlayer({ ...response, [name]: updatedValue });
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    if (!isNaN(value) || value === "") {
      setPlayer({ ...response, [name]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPlayer({ ...response, [name]: checked });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(response).forEach((key) => {
      if (
        !response[key] &&
        key !== "healthProblem" &&
        key !== "whatsappGroup" &&
        key !== "fatherWhatsappGroup" &&
        key !== "motherWhatsappGroup" &&
        key !== "acceptedKVKK" &&
        key !== "acceptedImportant"
      ) {
        newErrors[key] = `${key} alanı boş olamaz!`;
      }
    });

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (response.email && !emailRegex.test(response.email)) {
      newErrors.email = "Geçersiz e-posta!";
    }

    if (response.phoneNumber && (isNaN(response.phoneNumber) || response.phoneNumber.length !== 11)) {
      newErrors.phoneNumber = "Telefon numarası 11 haneli olmalıdır ve sadece sayılardan oluşmalıdır!";
    }
    if (response.motherPhoneNumber && (isNaN(response.motherPhoneNumber) || response.motherPhoneNumber.length !== 11)) {
      newErrors.motherPhoneNumber = "Anne telefon numarası 11 haneli olmalıdır ve sadece sayılardan oluşmalıdır!";
    }
    if (response.fatherPhoneNumber && (isNaN(response.fatherPhoneNumber) || response.fatherPhoneNumber.length !== 11)) {
      newErrors.fatherPhoneNumber = "Baba telefon numarası 11 haneli olmalıdır ve sadece sayılardan oluşmalıdır!";
    }
    if (response.tcNo && (isNaN(response.tcNo) || response.tcNo.length !== 11)) {
      newErrors.tcNo = "TC Kimlik numarası 11 haneli olmalıdır ve sadece sayılardan oluşmalıdır!";
    }

    if (response.password && response.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalıdır!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!response.acceptedKVKK || !response.acceptedImportant) {
      alert("Lütfen KVKK ve Önemli Hususları kabul edin.");
      setIsSubmitting(false);
      return;
    }

    if (!validateForm()) {
      setFormSubmitted(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const registerRes = await axios.post(
        "https://localhost:7114/api/authentication/register",
        response
      );

      if (registerRes.status === 200) {
        alert("Kayıt başarılı!");

        const userPostRes = await axios.post("https://localhost:7114/api/User", {
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          password: response.password,
          tcNo: response.tcNo,
          birthPlace: response.birthPlace,
          birthDay: response.birthDay,
          school: response.school,
          height: response.height,
          weight: response.weight,
          healthProblem: response.healthProblem,
          address: response.address,
          phoneNumber: response.phoneNumber,
          motherName: response.motherName,
          motherPhoneNumber: response.motherPhoneNumber,
          fatherName: response.fatherName,
          fatherPhoneNumber: response.fatherPhoneNumber,
          whatsappGroup: response.whatsappGroup,
          fatherWhatsappGroup: response.fatherWhatsappGroup,
          motherWhatsappGroup: response.motherWhatsappGroup,
          acceptedKVKK: response.acceptedKVKK,
          acceptedImportant: response.acceptedImportant,
        });

        if (userPostRes.status === 201) {
          alert("Kullanıcı başarıyla eklendi!");
          navigate("/playerAuth");
        } else {
          alert("Kullanıcı eklenemedi!");
        }
      } else {
        alert("Kayıt başarısız!");
      }
    } catch (error) {
      console.error("Kayıt sırasında hata oluştu:", error);
      alert("Kayıt başarısız!");
    } finally {
      setIsSubmitting(false);
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
            <div className="mb-3">
              <label className="form-label">Adı</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                placeholder="Adınızı girin"
                value={response.firstName}
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
                value={response.lastName}
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.lastName && (
                <div className="text-danger">{errors.lastName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">E-Posta</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="E-posta adresinizi girin"
                value={response.email}
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
                value={response.password}
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.password && (
                <div className="text-danger">{errors.password}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">TC Kimlik No</label>
              <input
                type="text"
                name="tcNo"
                className="form-control"
                placeholder="TC Kimlik No girin"
                value={response.tcNo}
                onChange={handleChange}
                required
                minLength="11"
                maxLength="11"
                pattern="\d{11}"
              />
              {formSubmitted && errors.tcNo && (
                <div className="text-danger">{errors.tcNo}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Doğum Yeri</label>
              <input
                type="text"
                name="birthPlace"
                className="form-control"
                placeholder="Doğum yerinizi girin"
                value={response.birthPlace}
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
                name="birthDay"
                className="form-control"
                value={response.birthDay}
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.birthDay && (
                <div className="text-danger">{errors.birthDay}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Okul</label>
              <input
                type="text"
                name="school"
                className="form-control"
                placeholder="Okul adını girin"
                value={response.school}
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
                value={response.height}
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.height && (
                <div className="text-danger">{errors.height}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Ağırlık</label>
              <input
                type="text"
                name="weight"
                className="form-control"
                placeholder="Ağırlığınızı girin"
                value={response.weight}
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.weight && (
                <div className="text-danger">{errors.weight}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Sağlık Sorunu</label>
              <textarea
                name="healthProblem"
                className="form-control"
                placeholder="Sağlık problemini belirtin"
                value={response.healthProblem}
                onChange={handleChange}
              />
              {formSubmitted && errors.healthProblem && (
                <div className="text-danger">{errors.healthProblem}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Adres</label>
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder="Adresinizi girin"
                value={response.address}
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
                name="phoneNumber"
                className="form-control"
                placeholder="Telefon numaranızı girin"
                value={response.phoneNumber}
                onChange={handlePhoneChange}
                required
                minLength="11"
                maxLength="11"
                pattern="\d{11}"
              />
              {formSubmitted && errors.phoneNumber && (
                <div className="text-danger">{errors.phoneNumber}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Anne Adı</label>
              <input
                type="text"
                name="motherName"
                className="form-control"
                placeholder="Anne adını girin"
                value={response.motherName}
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.motherName && (
                <div className="text-danger">{errors.motherName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Anne Telefon Numarası</label>
              <input
                type="text"
                name="motherPhoneNumber"
                className="form-control"
                placeholder="Anne telefon numarasını girin"
                value={response.motherPhoneNumber}
                onChange={handlePhoneChange}
                required
                minLength="11"
                maxLength="11"
                pattern="\d{11}"
              />
              {formSubmitted && errors.motherPhoneNumber && (
                <div className="text-danger">{errors.motherPhoneNumber}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Baba Adı</label>
              <input
                type="text"
                name="fatherName"
                className="form-control"
                placeholder="Baba adını girin"
                value={response.fatherName}
                onChange={handleChange}
                required
              />
              {formSubmitted && errors.fatherName && (
                <div className="text-danger">{errors.fatherName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Baba Telefon Numarası</label>
              <input
                type="text"
                name="fatherPhoneNumber"
                className="form-control"
                placeholder="Baba telefon numarasını girin"
                value={response.fatherPhoneNumber}
                onChange={handlePhoneChange}
                required
                minLength="11"
                maxLength="11"
                pattern="\d{11}"
              />
              {formSubmitted && errors.fatherPhoneNumber && (
                <div className="text-danger">{errors.fatherPhoneNumber}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                WhatsApp Grubuna Katılmak İstiyor Musunuz?
              </label>
              <input
                type="checkbox"
                name="whatsappGroup"
                onChange={handleCheckboxChange}
                checked={response.whatsappGroup}
              />
              <span> Evet</span>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Anne WhatsApp Grubuna Katılmak İstiyor Musunuz?
              </label>
              <input
                type="checkbox"
                name="motherWhatsappGroup"
                onChange={handleCheckboxChange}
                checked={response.motherWhatsappGroup}
              />
              <span> Evet</span>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Baba WhatsApp Grubuna Katılmak İstiyor Musunuz?
              </label>
              <input
                type="checkbox"
                name="fatherWhatsappGroup"
                onChange={handleCheckboxChange}
                checked={response.fatherWhatsappGroup}
              />
              <span> Evet</span>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="acceptedKVKK"
                onChange={handleCheckboxChange}
                checked={response.acceptedKVKK}
                required
              />
              <label className="form-check-label">
                <Link to="/kvkk">Kişisel Verilerin Korunması Kanunu'nu</Link> kabul ediyorum.
              </label>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="acceptedImportant"
                onChange={handleCheckboxChange}
                checked={response.acceptedImportant}
                required
              />
              <label className="form-check-label">
                Önemli Hususları kabul ediyorum.
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
              Kayıt Ol
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PlayerRegisterPage;