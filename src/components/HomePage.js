import React, { useEffect } from "react";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflowY = 'hidden';

    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, []);

  const handleClubLogin = () => {
    navigate("/club-login");
  };

  const handlePlayerLogin = () => {
    navigate("/playerAuth"); 
  };

  return (
    <div className="home-page">
      <div className="content-container">
        <h1>Balkan Yeşilbağlar Kulübüne Hoşgeldiniz</h1>
        <p>Giriş yapmak için seçiniz</p>

        <div className="button-container">
          <div className="button" onClick={handlePlayerLogin}>
            Sporcu Girişi
          </div>
          <div className="button" onClick={handleClubLogin}>
            Kulüp Girişi
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
