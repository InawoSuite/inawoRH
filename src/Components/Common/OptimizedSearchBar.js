import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Input } from 'reactstrap';

/**
 * Composant de barre de recherche optimisé avec debouncing
 * Améliore les performances en évitant les recherches à chaque frappe
 */
const OptimizedSearchBar = memo(({ 
  value = '',
  onChange,
  placeholder = 'Rechercher...',
  debounceMs = 300,
  style = {},
  className = '',
  showIcon = true,
  disabled = false,
  onClear,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Synchroniser avec la valeur externe
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Gérer le changement avec debouncing
  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Annuler le debounce précédent
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Créer un nouveau debounce
    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);

  // Effacer la recherche
  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
    if (onClear) onClear();
    
    // Focus sur l'input après effacement
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onChange, onClear]);

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Gérer la touche Escape pour effacer
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && localValue) {
      handleClear();
    }
  }, [localValue, handleClear]);

  const baseStyle = {
    borderRadius: '20px',
    height: '40px',
    paddingLeft: showIcon && !localValue ? '2.5rem' : '12px',
    paddingRight: localValue ? '2.5rem' : '12px',
    transition: 'all 0.2s ease',
    ...style,
  };

  return (
    <div className="search-box position-relative">
      <Input
        ref={inputRef}
        type="text"
        className={`form-control ${className}`}
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={baseStyle}
        aria-label={placeholder}
      />
      
      {/* Icône de recherche (visible quand pas de texte) */}
      {showIcon && !localValue && (
        <i 
          className="ri-search-line search-icon position-absolute" 
          style={{
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6c757d',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        ></i>
      )}
      
      {/* Bouton effacer (visible quand il y a du texte) */}
      {localValue && (
        <button
          type="button"
          className="btn btn-link position-absolute p-0 border-0"
          onClick={handleClear}
          style={{
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            color: '#6c757d',
            textDecoration: 'none',
          }}
          aria-label="Effacer la recherche"
        >
          <i className="ri-close-circle-line fs-16"></i>
        </button>
      )}
    </div>
  );
});

OptimizedSearchBar.displayName = 'OptimizedSearchBar';

export default OptimizedSearchBar;
