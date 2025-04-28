import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/FeePage.css";

function FeePage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [editingUserId, setEditingUserId] = useState(null);
  const [fee, setFee] = useState("");
  const [paymentType, setPaymentType] = useState("İban");

  useEffect(() => {
    axiosInstance
      .get(`/User?page=1&pageSize=10`)
      .then((response) => {
        const filteredUsers = response.data.data.filter(
          (user) => user.categoryGroupsId === parseInt(groupId, 10)
        );
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error("Oyuncu bilgileri alınırken hata oluştu:", error);
      });

    axios
      .get("https://localhost:7114/api/Dues?page=1&pageSize=10")
      .then((response) => {
        setDues(response.data.data);
      })
      .catch((error) => {
        console.error("Aidat bilgileri alınırken hata oluştu:", error);
      })
      .finally(() => setLoading(false));
  }, [groupId]);

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);

    const existingFeeDetails = getFeeDetails(user.id);

    if (existingFeeDetails) {
      setFee(existingFeeDetails.fee);
      setPaymentType(existingFeeDetails.paymentType);
    } else {
      setFee("");
      setPaymentType("İban");
    }
  };

  const handleSave = (userId) => {
    if (!fee || !paymentType) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    const existingFeeDetails = getFeeDetails(userId);

    const data = {
      id: existingFeeDetails ? existingFeeDetails.id : 0,
      userId,
      fee: parseFloat(fee),
      paymentType,
      month: selectedMonth,
      year: selectedYear,
      isDeleted: false,
    };

    if (existingFeeDetails) {
      axios
        .put(`https://localhost:7114/api/Dues/${existingFeeDetails.id}`, data)
        .then(() => {
          alert("Aidat bilgileri başarıyla güncellendi.");
          setEditingUserId(null);
          updateDuesList(existingFeeDetails.id, data);
        })
        .catch((error) => {
          console.error("Aidat bilgileri güncellenirken hata oluştu:", error.response);
          alert(error.response?.data || "Bir hata oluştu.");
        });
    } else {
      axios
        .post("https://localhost:7114/api/Dues", data)
        .then((response) => {
          alert("Aidat bilgileri başarıyla eklendi.");
          setEditingUserId(null);
          addNewDue(response.data);
        })
        .catch((error) => {
          console.error("Aidat bilgileri eklenirken hata oluştu:", error.response);
          alert(error.response?.data || "Bir hata oluştu.");
        });
    }
  };

  const getFeeDetails = (userId) => {
    return dues.find(
      (due) =>
        due.userId === userId &&
        due.month === selectedMonth &&
        due.year === selectedYear
    );
  };

  const updateDuesList = (id, updatedData) => {
    setDues((prevDues) =>
      prevDues.map((due) => (due.id === id ? { ...due, ...updatedData } : due))
    );
  };

  const addNewDue = (newDue) => {
    setDues((prevDues) => [...prevDues, newDue]);
  };

  // Seçilen ay ve yıl için toplam tutarı hesapla
  const calculateTotalFee = () => {
    return dues
      .filter((due) => due.month === selectedMonth && due.year === selectedYear)
      .reduce((total, due) => total + due.fee, 0);
  };

  if (loading) {
    return <div className="loading">Veriler yükleniyor...</div>;
  }

  return (
    <div className="fee-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>Aidat Bilgileri</h1>

      <div className="filters">
        <label>
          Yıl:
          <select value={selectedYear} onChange={handleYearChange}>
            {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ay:
          <select value={selectedMonth} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {month.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="fee-container">
        <table className="fee-table">
          <thead>
            <tr>
              <th>İsim</th>
              <th>Soyisim</th>
              <th>Aidat Durumu</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const feeDetails = getFeeDetails(user.id);

              return (
                <tr key={user.id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    {editingUserId === user.id ? (
                      <form onSubmit={(e) => e.preventDefault()}>
                        <label>
                          Tutar:
                          <input
                            type="number"
                            value={fee}
                            onChange={(e) => setFee(e.target.value)}
                          />
                        </label>
                        <label>
                          Ödeme Şekli:
                          <select
                            value={paymentType}
                            onChange={(e) => setPaymentType(e.target.value)}
                          >
                            <option value="İban">İban</option>
                            <option value="Makbuz">Makbuz</option>
                            <option value="Kredi Kartı">Kredi Kartı</option>
                            <option value="Burslu">Burslu</option>
                          </select>
                        </label>
                        <button
                          type="button"
                          onClick={() => handleSave(user.id)}
                        >
                          Kaydet
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingUserId(null)}
                        >
                          İptal
                        </button>
                      </form>
                    ) : feeDetails ? (
                      <>
                        <p>Tutar: {feeDetails.fee} TL</p>
                        <p>Ödeme Şekli: {feeDetails.paymentType}</p>
                      </>
                    ) : (
                      "Belirtilmedi"
                    )}
                  </td>
                  <td>
                    {editingUserId !== user.id && (
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick(user)}
                      >
                        Düzenle
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Tutar Toplamı */}
        <div className="total-fee">
          <h3>Toplam Tutar: {calculateTotalFee()} TL</h3>
        </div>
      </div>
    </div>
  );
}

export default FeePage;