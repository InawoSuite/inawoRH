// components/SimpleModernCalendar.jsx
import React, { useState, useRef, useEffect } from 'react';
import './EnhancedCalendar.css';

const SimpleModernCalendar = ({
  value,
  onChange,
  placeholder = "Sélectionner une date",
  minDate = null,
  maxDate = null,
  disabled = false,
  className = "",
  id,
  name,
  required = false,
  onBlur,
  format = "YYYY-MM-DD",
}) => {
  const [dateValue, setDateValue] = useState(value || '');
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);
  const pickerRef = useRef(null);

  // Formater la date pour l'affichage
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateChange = (e) => {
    const newValue = e.target.value;
    setDateValue(newValue);
    if (onChange) {
      onChange(newValue ? [new Date(newValue)] : []);
    }
  };

  const handleInputClick = () => {
    if (!disabled) {
      setShowPicker(true);
      // Focus sur l'input date pour ouvrir le picker natif
      setTimeout(() => {
        if (pickerRef.current) {
          pickerRef.current.showPicker();
        }
      }, 100);
    }
  };

  // Fermer le picker quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(e.target) &&
        inputRef.current && 
        !inputRef.current.contains(e.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="simple-calendar-container">
      <div 
        className={`simple-calendar-input-wrapper ${disabled ? 'disabled' : ''}`}
        onClick={handleInputClick}
      >
        <input
          ref={inputRef}
          type="text"
          className={`simple-calendar-display ${className}`}
          value={formatDisplayDate(dateValue)}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          id={id}
          name={name}
          required={required}
        />
        <div className="calendar-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
      </div>
      
      <input
        ref={pickerRef}
        type="date"
        className="simple-calendar-native"
        value={dateValue}
        onChange={handleDateChange}
        onBlur={onBlur}
        min={minDate}
        max={maxDate}
        disabled={disabled}
        style={{ 
          position: 'absolute',
          opacity: 0,
          pointerEvents: showPicker ? 'auto' : 'none',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0
        }}
      />
    </div>
  );
};

export default SimpleModernCalendar;