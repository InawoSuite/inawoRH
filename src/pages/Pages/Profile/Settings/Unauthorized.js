// pages/Unauthorized.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="card">
            <div className="card-body py-5">
              <div className="avatar-lg mx-auto">
                <div className="avatar-title bg-light text-danger display-4 rounded-circle">
                  <i className="ri-error-warning-line"></i>
                </div>
              </div>
              <h4 className="text-danger mt-4">Accès non autorisé</h4>
              <p className="text-muted">
                Désolé {user?.prenom || 'Utilisateur'}, vous n'avez pas les permissions 
                nécessaires pour accéder à cette page.
              </p>
              
              <div className="mt-4">
                <Link to="/dashboard" className="btn btn-primary me-2">
                  <i className="ri-home-4-line me-1"></i> Tableau de bord
                </Link>
                <Link to="/suite.inawo.pro/mon_entreprise/profil" className="btn btn-outline-secondary">
                  <i className="ri-user-settings-line me-1"></i> Mon profil
                </Link>
              </div>

              {user?.type_utilisateur === 'observateur' && (
                <div className="alert alert-info mt-4">
                  <i className="ri-information-line me-1"></i>
                  En tant qu'Observateur, vous avez uniquement accès aux fonctionnalités de visualisation.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;