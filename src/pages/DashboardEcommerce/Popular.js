import React from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

// Importation des images (assurez-vous que les chemins sont corrects)
import GestionImage from '../../assets/images/svg/Gestion_02.jpg';
import SupportClientImage from '../../assets/images/svg/SupportClient02.png';
import AutorisationImage from '../../assets/images/svg/Autorisation01.png';
import AppIcon from '../../assets/images/svg/App.png'; // Nouvelle importation

// Constante JSON contenant les données statiques
const STATIC_DATA = {
  title: "Bienvenue sur la suite Inawo.",
  description: "La suite inawo est votre solution évolutive de gestion des ventes et stocks en ligne. L'utilisation de la suite permettra à votre entreprise d'accroitre sa productivité, son efficacité et sa rentabilité.",
  features: [
    {
      id: 1,
      title: "Gérez votre entreprise de partout !",
      description: "Découvrez la facilité de gestion de votre activité avec l'application mobile Inawo. pour Android et iOS.",
      image: GestionImage,
      bottomIcon: AppIcon, // Nouvelle propriété pour l'icône du bas
      hasSpecialStyle: false
    },
    {
      id: 2,
      title: "Vous avez une question ?",
      description: "Écrivez-nous à support@inawo.pro et nous vous répondrons. Vous pouvez également ouvrir un ticket pour discuter avec le support client.",
      image: SupportClientImage,
      hasSpecialStyle: true,
      buttonText: "Support Client",
      gradient: "linear-gradient(135deg, #3182CE 0%, #2C5282 100%)" // Dégradé bleu
    },
    {
      id: 3,
      title: "Rôles et autorisations",
      description: "Invitez des utilisateurs à rejoindre votre organisation et choisissez les modules auxquels ils ont accès.",
      image: AutorisationImage,
      hasSpecialStyle: false,
      // Ajout des propriétés pour le bouton "Ajouter utilisateur"
      hasUserButton: true,
      buttonText: "Ajouter utilisateur",
      buttonColor: "#3182CE" // Couleur bleue comme le card du milieu
    }
  ]
};

const FeatureCard = ({ feature }) => {
  const navigate = useNavigate();
  
  // Fonction pour gérer le clic sur le bouton "Ajouter utilisateur"
  const handleAddUser = () => {
    navigate('/:entreprise/utilisateur', { state: { showModal: true } });
  };

  return (
    <div
      style={{
        padding: "32px 24px",
        backgroundColor: feature.hasSpecialStyle ? "#fff" : "#fff",
        background: feature.gradient || "#fff", // Appliquer le dégradé si présent
        borderRadius: "12px",
        border: feature.hasSpecialStyle ? "none" : "1px solid #e2e8f0",
        transition: "all 0.3s ease",
        cursor: "pointer",
        color: feature.hasSpecialStyle ? "white" : "inherit",
        position: "relative",
        overflow: "hidden",
        boxShadow: feature.hasSpecialStyle ? "0 4px 15px rgba(49, 130, 206, 0.3)" : "none"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = feature.hasSpecialStyle 
          ? "0 8px 25px rgba(49, 130, 206, 0.4)" 
          : "0 8px 25px rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = feature.hasSpecialStyle 
          ? "0 4px 15px rgba(49, 130, 206, 0.3)" 
          : "none";
      }}
    >
      <div
        style={{
          width: "70px",
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px auto",
        }}
      >
        <img 
          src={feature.image} 
          alt={feature.title}
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
          }}
        />
      </div>

      <h3
        style={{
          fontSize: "18px",
          fontWeight: "600",
          color: feature.hasSpecialStyle ? "white" : "#2d3748",
          margin: "0 0 8px 0",
        }}
      >
        {feature.title}
      </h3>

      <p
        style={{
          fontSize: "14px",
          color: feature.hasSpecialStyle ? "rgba(255, 255, 255, 0.9)" : "#718096",
          lineHeight: "1.5",
          margin: feature.hasSpecialStyle ? "0 0 20px 0" : "0 0 20px 0", // Ajout de marge pour tous
        }}
      >
        {feature.description}
      </p>

      {/* Icône en bas pour le premier card */}
      {feature.bottomIcon && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "16px"
          }}
        >
          <img 
            src={feature.bottomIcon} 
            alt="App icon"
            style={{
              width: "90px",
              height: "90px",
              objectFit: "contain",
            }}
          />
        </div>
      )}
      
      {feature.hasSpecialStyle && (
        <button
          onClick={() => navigate('/:entreprise/supportClient')}
          style={{
            backgroundColor: "white",
            color: "#3182CE",
            border: "none",
            padding: "10px 20px",
            borderRadius: "70px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            marginTop: "15px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f7fafc";
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
          }}
        >
          {feature.buttonText}
        </button>
      )}
      
      {/* Bouton "Ajouter utilisateur" pour le troisième card */}
      {feature.hasUserButton && (
        <button
          onClick={handleAddUser}
          style={{
            backgroundColor: feature.buttonColor || "#3182CE",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "70px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            marginTop: "35px",
            width: "55%",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2C5282";
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = feature.buttonColor || "#3182CE";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
          }}
        >
          {feature.buttonText}
        </button>
      )}
    </div>
  );
};

const VelzonDashboardCard = () => {
  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card style={{ 
            borderRadius: "20px",
            border: "none",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)"
          }}>
            <CardBody
              style={{
                padding: "60px 40px",
                textAlign: "center",
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              {/* Subtitle */}
              {/* <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#4a5568",
                  margin: "0 0 12px 0",
                  lineHeight: "1.4",
                }}
              >
                {STATIC_DATA.title}
              </h2> */}

              {/* Description */}
              <p
                style={{
                  fontSize: "14px",
                  color: "#718096",
                  lineHeight: "1.6",
                  margin: "0 0 32px 0",
                  maxWidth: "520px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {STATIC_DATA.description}
              </p>

              {/* Feature Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "24px",
                  marginTop: "32px",
                }}
              >
                {STATIC_DATA.features.map(feature => (
                  <FeatureCard key={feature.id} feature={feature} />
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default VelzonDashboardCard;
