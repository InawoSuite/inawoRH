// components/DocumentView/DocumentView.jsx
import React from 'react';

const DocumentView = ({ 
  title,
  documentNumber,
  enterprise,
  client,
  dateEmission,
  items = [],
  totals,
  notes,
  conditions,
  signatureData,
  qrCodeUrl,
  children 
}) => {
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  return (
    <div id="document-to-print" style={{
      width: '100%',
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
    }}>
      
      {/* En-tête avec logo et titre */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '20px 40px 0 40px'
      }}>
        {/* Logo */}
        {enterprise?.logo ? (
          <div style={{ width: "150px", height: "150px", overflow: "hidden" }}>
            <img
              src={`https://inawoapiv3.inawo.pro${enterprise.logo}`}
              alt="Logo entreprise"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        ) : (
          <div style={{
            width: "150px", height: "150px", backgroundColor: "#444",
            display: "flex", justifyContent: "center", alignItems: "center",
            color: "white", borderRadius: "8px"
          }}>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>LOGO</span>
          </div>
        )}

        {/* Titre du document */}
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <h1 style={{
            fontSize: '42px', fontWeight: 'bold', color: '#444',
            margin: '0', letterSpacing: '3px'
          }}>
            {title}
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '16px' }}>
            {documentNumber}
          </p>
        </div>
      </div>

      {/* Sections d'information */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 40px',
        marginTop: '30px',
        gap: '20px'
      }}>
        {/* Informations entreprise */}
        <div style={{ flex: 1 }}>
          <h3 style={sectionTitleStyle}>Entreprise</h3>
          <div style={sectionContentStyle}>
            <p style={boldTextStyle}>{enterprise?.nom}</p>
            <p><strong>Email:</strong> {enterprise?.email}</p>
            <p><strong>NIF:</strong> {enterprise?.nif}</p>
          </div>
        </div>

        {/* Informations client */}
        <div style={{ flex: 1 }}>
          <h3 style={sectionTitleStyle}>Client</h3>
          <div style={sectionContentStyle}>
            <p style={boldTextStyle}>{client?.nom}</p>
            <p><strong>Adresse:</strong> {client?.adresse}</p>
            <p><strong>Téléphone:</strong> {client?.telephone}</p>
            <p><strong>Email:</strong> {client?.email}</p>
            <p><strong>IFU:</strong> {client?.ifu || 'N/A'}</p>
          </div>
        </div>

        {/* Informations document */}
        <div style={{ flex: 1 }}>
          <h3 style={sectionTitleStyle}>Informations</h3>
          <div style={infoSectionStyle}>
            <InfoRow label="Date d'émission:" value={formatDate(dateEmission)} />
            <InfoRow label="Référence:" value={documentNumber} />
            {/* Ajoutez d'autres lignes d'information au besoin */}
            {children}
          </div>
        </div>
      </div>

      {/* Contenu spécifique au document */}
      <div style={{ padding: '0 40px' }}>
        {/* Les composants enfants peuvent ajouter du contenu spécifique ici */}
      </div>
    </div>
  );
};

// Composants helper
const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
    <span style={{ color: '#666' }}>{label}</span>
    <span style={{ fontWeight: 'bold', color: '#444' }}>{value}</span>
  </div>
);

// Styles
const sectionTitleStyle = {
  fontSize: '16px', marginBottom: '15px', color: '#444',
  fontWeight: 'bold', textTransform: 'uppercase'
};

const sectionContentStyle = {
  fontSize: '14px', lineHeight: '1.6'
};

const boldTextStyle = {
  margin: '5px 0', color: '#444', fontWeight: 'bold'
};

const infoSectionStyle = {
  display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px'
};

export default DocumentView;