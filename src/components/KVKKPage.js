import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/KVKKPage.css"; // KVKK için özel CSS dosyası

function KVKKPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Bir önceki sayfaya geri dön
  };

  return (
    <div className="kvkk-page container d-flex justify-content-center align-items-center">
      <div className="card shadow-lg kvkk-card">
        <div className="card-body">
          <h3 className="text-center mb-4 kvkk-title">KVKK Metni</h3>
          <p className="kvkk-text">
            Burada KVKK metni hakkında bilgi verilmiştir. Lütfen dikkatle okuyun.
            <br />
            <br />
            <strong>* Madde 1:</strong> Kişisel verilerinizin işlenmesi...
            <br />
            <strong>* Madde 2:</strong> Verilerin saklanma süresi...
            <br />
            <strong>* Madde 3:</strong> Haklarınız ve başvuru yolları...
          </p>
          <div className="text-center">
            <button className="btn btn-primary kvkk-button" onClick={handleBack}>
              Anladım
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KVKKPage;