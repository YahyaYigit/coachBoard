import React from 'react';
import { useNavigate } from 'react-router-dom';

function KVKKPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);  // Bir önceki sayfaya geri dön
  };

  return (
    <div className="kvkk-page container">
      <div className="card shadow-lg">
        <div className="card-body">
          <h3 className="text-center mb-4">KVKK Metni</h3>
          <p>
            Burada KVKK metni hakkında bilgi verilmiştir. Lütfen dikkatle okuyun.
            <br />
            * Madde 1...
            <br />
            * Madde 2...
            <br />
            * Madde 3...
          </p>
          <div className="text-center">
            <button className="btn btn-primary" onClick={handleBack}>
              Anladım
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KVKKPage;
