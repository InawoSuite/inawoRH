import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Fonction pour obtenir le nom d'un commercial
export const getCommercialName = (commercialId, commercials, t = (text) => text) => {
  if (!commercialId) return t("Non assigné");
  
  const commercial = commercials.find((c) => c.id === commercialId);
  if (!commercial) return t("Commercial inconnu");
  
  return `${commercial.first_name || ""} ${commercial.last_name || ""}`.trim();
};

// Fonction pour obtenir le nom d'un contact
export const getContactName = (contactId, contacts, t = (text) => text) => {
  if (!contactId) return t("Non assigné");
  
  const contact = contacts.find((c) => c.id === contactId);
  if (!contact) return t("Contact inconnu");
  
  const nomAffichage = contact.nom || contact.nom_contact || "Sans nom";
  return `${nomAffichage}`;
};

// Hook pour la navigation des entités
export const useEntityNavigation = () => {
  const navigate = useNavigate();

  const handleCommercialClick = (commercialId, entreprise, e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!commercialId) {
      toast.error("Aucun commercial associé");
      return;
    }

    if (!entreprise) {
      toast.error("Erreur de navigation: entreprise non définie");
      return;
    }
    
    navigate(`/${entreprise}/details/commercial/${commercialId}`);
  };

  const handleContactClick = (contactId, entreprise, e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!contactId) {
      toast.error("Aucun contact associé");
      return;
    }

    if (!entreprise) {
      toast.error("Erreur de navigation: entreprise non définie");
      return;
    }
    
    navigate(`/${entreprise}/detailsContact/${contactId}`);
  };

  return {
    handleCommercialClick,
    handleContactClick
  };
};

// Composant de cellule réutilisable pour les commerciaux
export const CommercialCell = ({ commercialId, commercialName, entreprise, onCommercialClick }) => {
  return (
    <div style={{ whiteSpace: "normal", wordWrap: "break-word", maxWidth: "200px" }}>
      {commercialId ? (
        <button
          className="btn btn-link text-primary p-0 text-decoration-none"
          onClick={(e) => onCommercialClick(commercialId, entreprise, e)}
          title={`Voir le détail de ${commercialName}`}
        >
          <i className="ri-user-line me-1"></i>
          {commercialName}
        </button>
      ) : (
        <span className="text-muted">{commercialName}</span>
      )}
    </div>
  );
};

// Composant de cellule réutilisable pour les contacts
export const ContactCell = ({ contactId, contactName, entreprise, onContactClick }) => {
  return (
    <div style={{ whiteSpace: "normal", wordWrap: "break-word", maxWidth: "200px" }}>
      {contactId ? (
        <button
          className="btn btn-link text-primary p-0 text-decoration-none"
          onClick={(e) => onContactClick(contactId, entreprise, e)}
          title={`Voir le détail de ${contactName}`}
        >
          <i className="ri-contacts-book-line me-1"></i>
          {contactName}
        </button>
      ) : (
        <span className="text-muted">{contactName}</span>
      )}
    </div>
  );
};