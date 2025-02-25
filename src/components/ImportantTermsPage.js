import React from 'react';
import { useNavigate } from 'react-router-dom';

function ImportantTermsPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);  // Bir önceki sayfaya geri dön
  };

  return (
    <div className="important-terms-page container">
      <div className="card shadow-lg">
        <div className="card-body">
          <h3 className="text-center mb-4">Önemli Hususlar</h3>
          <p>
            Burada önemli hususlar hakkında bilgi verilmiştir. Lütfen dikkatle okuyun.
            <br />
            * Husus 1...
            <br />
            * Husus 2...
            <br />
            * Husus 3...
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

export default ImportantTermsPage;
