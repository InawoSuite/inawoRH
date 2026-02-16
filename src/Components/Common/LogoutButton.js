// src/components/LogoutButton.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LogoutButton = ({ className = "", style = {} }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout('manual');
    }
  };

  return (
    <button 
      className={`btn btn-danger ${className}`}
      style={style}
      onClick={handleLogout}
      title="Se déconnecter"
    >
      <i className="ri-logout-box-r-line me-1"></i>
      Déconnexion
    </button>
  );
};

export default LogoutButton;