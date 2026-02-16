// src/components/DynamicPricingCard.js
import React from 'react';
import { Card, CardBody, Button } from 'reactstrap';
import { Link } from 'react-router-dom';

const DynamicPricingCard = ({ 
  formule, 
  categorie, 
  tarifsModules, 
  onSubscribe,
  activeTab 
}) => {
  
  // Trouver les tarifs pour cette formule et catégorie
  const getModuleName = (formule) => {
    return formule === "Ventes" ? "InawoSales" :
           formule === "Stock" ? "InawoStock" : "Inawo Global";
  };

  const moduleName = getModuleName(formule);
  const tarifItem = tarifsModules.find(
    item => item.module_nom === moduleName && item.categorie_nom === categorie.nom
  );

  if (!tarifItem) {
    return null; // Ne pas afficher si pas de tarif trouvé
  }

  // Calculer le prix réduit (15% de réduction)
  const prixMensuelReduit = Math.round(tarifItem.prix_cfa_mensuel * 0.85);

  return (
    <Card className="pricing-box ribbon-box right rounded-5">
      {categorie.popular && (
        <div className="ribbon-two ribbon-two-danger">
          <span>Popular</span>
        </div>
      )}
      
      <CardBody className="bg-light m-2 p-4 rounded-5">
        <div className="d-flex align-items-center mb-3">
          <div className="flex-grow-1">
            <h5 className="mb-0 fw-semibold">{categorie.nom}</h5>
            <p className="text-muted mb-0">{categorie.description}</p>
          </div>
        </div>

        <div className="ms-auto">
          <h5 className="annual mb-0">
            <sup className="h5 m-0 mx-narrow">
              {tarifItem.prix_cfa_mensuel === 0 ? "Gratuit" : `$${tarifItem.prix_usd_mensuel}`}
            </sup>
          </h5>
          <h5 className="annual mb-0">
            <sup className="h3 m-0 mx-narrow">
              {tarifItem.prix_cfa_mensuel === 0 ? "0 " : `${prixMensuelReduit.toLocaleString()} `}
              <small className="fs-13 text-muted">/Mois</small>
            </sup>
          </h5>
        </div>

        <p className="text-muted">{categorie.descriptionLong}</p>
        
        <ul className="list-unstyled vstack gap-2">
          {categorie.features.map((feature, index) => (
            <li key={index}>
              <div className="d-flex">
                <div className="flex-shrink-0 text-success me-1">
                  <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                </div>
                <div className="flex-grow-1">
                  {feature}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-3 pt-2">
          <Button
            color="success"
            className="w-100 rounded-pill"
            onClick={() => onSubscribe(formule, categorie.nom)}
          >
            Abonnez-Vous
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default DynamicPricingCard;