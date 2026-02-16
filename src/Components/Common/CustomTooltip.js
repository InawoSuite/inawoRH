import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, UncontrolledTooltip } from 'reactstrap';

/**
 * CustomTooltip - Un composant wrapper pour Tooltip de Reactstrap qui définit les propriétés de transition correctement
 * Résout le problème: "Warning: Failed prop type: The prop `transition.timeout` is marked as required in `PopperContent`"
 */
const CustomTooltip = (props) => {
  // Valeurs par défaut pour la transition
  const defaultTransition = {
    timeout: {
      enter: 200,
      exit: 200
    }
  };

  // Si c'est un UncontrolledTooltip
  if (!props.isOpen && !props.toggle) {
    return (
      <UncontrolledTooltip
        {...props}
        transition={defaultTransition}
      />
    );
  }

  // Si c'est un Tooltip contrôlé
  return (
    <Tooltip
      {...props}
      transition={defaultTransition}
    />
  );
};

CustomTooltip.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  target: PropTypes.string.isRequired,
  placement: PropTypes.string
};

CustomTooltip.defaultProps = {
  placement: 'top'
};

export default CustomTooltip;
