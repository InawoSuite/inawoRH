/**
 * Bouton protégé par la vérification d'abonnement
 * Affiche automatiquement le modal d'expiration si l'abonnement a expiré
 */
import React from 'react';
import { Button } from 'reactstrap';
import { useSubscriptionGuard } from '../Hooks/useSubscriptionGuard';
import { useTranslation } from 'react-i18next';

/**
 * GuardedButton - Bouton qui vérifie l'abonnement avant d'exécuter l'action
 * 
 * @param {Object} props
 * @param {string} props.actionType - 'add' | 'edit' | 'delete' | 'create' | 'update'
 * @param {Function} props.onClick - Fonction à exécuter si l'abonnement est valide
 * @param {boolean} props.showTooltip - Afficher un tooltip si désactivé (default: true)
 * @param {string} props.disabledStyle - 'hidden' | 'disabled' | 'normal' (default: 'normal')
 * @param {React.ReactNode} props.children - Contenu du bouton
 * 
 * @example
 * <GuardedButton
 *   actionType="add"
 *   onClick={() => navigate('/add')}
 *   color="primary"
 * >
 *   <i className="ri-add-line me-1"></i>
 *   Ajouter
 * </GuardedButton>
 */
const GuardedButton = ({
  actionType = 'add',
  onClick,
  showTooltip = true,
  disabledStyle = 'normal',
  children,
  disabled: externalDisabled = false,
  ...rest
}) => {
  const { t } = useTranslation();
  const { isExpired, guardAction } = useSubscriptionGuard();

  // Handler protégé
  const handleClick = (e) => {
    if (externalDisabled) return;
    
    // Vérifier l'abonnement et afficher le modal si expiré
    if (!guardAction(actionType)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Exécuter l'action originale
    if (onClick) {
      onClick(e);
    }
  };

  // Style du bouton selon la configuration
  const getButtonStyle = () => {
    if (!isExpired || disabledStyle === 'normal') {
      return {};
    }
    
    if (disabledStyle === 'hidden') {
      return { display: 'none' };
    }
    
    if (disabledStyle === 'disabled') {
      return { opacity: 0.6, cursor: 'not-allowed' };
    }
    
    return {};
  };

  // Tooltip pour indiquer l'expiration
  const tooltipProps = showTooltip && isExpired ? {
    title: t('Abonnement expiré - Cliquez pour en savoir plus'),
  } : {};

  return (
    <Button
      {...rest}
      {...tooltipProps}
      onClick={handleClick}
      disabled={externalDisabled}
      style={{ ...getButtonStyle(), ...rest.style }}
    >
      {children}
    </Button>
  );
};

/**
 * Variantes prédéfinies du GuardedButton
 */

// Bouton d'ajout
export const AddButton = ({ onClick, children, ...rest }) => (
  <GuardedButton actionType="add" onClick={onClick} color="primary" {...rest}>
    {children || (
      <>
        <i className="ri-add-line align-bottom me-1"></i>
        Ajouter
      </>
    )}
  </GuardedButton>
);

// Bouton de modification
export const EditButton = ({ onClick, children, ...rest }) => (
  <GuardedButton actionType="edit" onClick={onClick} color="info" size="sm" {...rest}>
    {children || <i className="ri-pencil-line"></i>}
  </GuardedButton>
);

// Bouton de suppression
export const DeleteButton = ({ onClick, children, ...rest }) => (
  <GuardedButton actionType="delete" onClick={onClick} color="danger" size="sm" {...rest}>
    {children || <i className="ri-delete-bin-line"></i>}
  </GuardedButton>
);

// Bouton de sauvegarde
export const SaveButton = ({ onClick, children, loading = false, ...rest }) => (
  <GuardedButton actionType="edit" onClick={onClick} color="success" disabled={loading} {...rest}>
    {loading ? (
      <>
        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
        Enregistrement...
      </>
    ) : (
      children || (
        <>
          <i className="ri-save-line align-bottom me-1"></i>
          Enregistrer
        </>
      )
    )}
  </GuardedButton>
);

export default GuardedButton;
