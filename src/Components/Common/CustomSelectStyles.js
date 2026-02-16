// import React from 'react';
// import Select from 'react-select';

// // Styles personnalisés à réutiliser
// export const customSelectStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     borderRadius: "20px",
//     border: "2px solid #dee2e6",
//     boxShadow: "none",
//     "&:hover": {
//       borderColor: "#dee2e6",
//     },
//   }),
//   menu: (provided) => ({
//     ...provided,
//     borderRadius: "5px",
//     border: "1px  #dee2e6",
//     boxShadow:"0 2px 5px rgba(15, 34, 58, 0.12)"
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected ? "white" : "white",
//     color: state.isSelected ? "#212529" : "#212529",
//     "&:hover": {
//       backgroundColor: "#e9ebec",
//     },
//   }),
// };

// // Composant Select personnalisé réutilisable
// export const CustomSelect = ({ 
//   options, 
//   value, 
//   onChange, 
//   placeholder = "Sélectionner...",
//   isDisabled = false,
//   isMulti = false,
//   ...props 
// }) => {
//   return (
//     <Select
//       options={options}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       isDisabled={isDisabled}
//       isMulti={isMulti}
//       styles={customSelectStyles}
//       {...props}
//     />
//   );
// };



import React from 'react';
import Select from 'react-select';

// Fonction pour détecter le mode sombre
const isDarkMode = () => {
  if (typeof window === 'undefined') return false;
  
  // Vérifier la classe sur le body
  if (document.body.classList.contains('dark-mode')) return true;
  
  // Vérifier les préférences système
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return true;
  
  // Vérifier le localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') return true;
  
  return false;
};

// Styles personnalisés adaptatifs pour le mode sombre
export const customSelectStyles = {
  control: (provided, state) => {
    const darkMode = isDarkMode();
    return {
      ...provided,
      borderRadius: "20px",
      border: darkMode ? "2px solid #4b5563" : "2px solid #dee2e6",
      backgroundColor: darkMode ? "#374151" : "#ffffff",
      color: darkMode ? "#f3f4f6" : "#212529",
      boxShadow: "none",
      "&:hover": {
        borderColor: darkMode ? "#6b7280" : "#dee2e6",
      },
    };
  },
  menu: (provided) => {
    const darkMode = isDarkMode();
    return {
      ...provided,
      borderRadius: "5px",
      border: darkMode ? "1px solid #4b5563" : "1px solid #dee2e6",
      backgroundColor: darkMode ? "#374151" : "#ffffff",
      boxShadow: "0 2px 5px rgba(15, 34, 58, 0.12)"
    };
  },
  option: (provided, state) => {
    const darkMode = isDarkMode();
    return {
      ...provided,
      backgroundColor: state.isSelected 
        ? (darkMode ? "#4b5563" : "#e9ebec") 
        : (darkMode ? "#374151" : "#ffffff"),
      color: darkMode ? "#f3f4f6" : "#212529",
      "&:hover": {
        backgroundColor: darkMode ? "#4b5563" : "#e9ebec",
      },
    };
  },
  singleValue: (provided) => {
    const darkMode = isDarkMode();
    return {
      ...provided,
      color: darkMode ? "#f3f4f6" : "#212529",
    };
  },
  placeholder: (provided) => {
    const darkMode = isDarkMode();
    return {
      ...provided,
      color: darkMode ? "#9ca3af" : "#6c757d",
    };
  },
  input: (provided) => {
    const darkMode = isDarkMode();
    return {
      ...provided,
      color: darkMode ? "#f3f4f6" : "#212529",
    };
  },
  dropdownIndicator: (provided) => {
    const darkMode = isDarkMode();
    return {
      ...provided,
      color: darkMode ? "#9ca3af" : "#6c757d",
      "&:hover": {
        color: darkMode ? "#d1d5db" : "#495057",
      },
    };
  },
  clearIndicator: (provided) => {
    const darkMode = isDarkMode();
    return {
      ...provided,
      color: darkMode ? "#9ca3af" : "#6c757d",
      "&:hover": {
        color: darkMode ? "#d1d5db" : "#495057",
      },
    };
  },
  indicatorSeparator: (provided) => {
    const darkMode = isDarkMode();
    return {
      ...provided,
      backgroundColor: darkMode ? "#4b5563" : "#dee2e6",
    };
  },
  multiValue: (provided) => {
    const darkMode = isDarkMode();
    return {
      ...provided,
      backgroundColor: darkMode ? "#4b5563" : "#e9ecef",
    };
  },
  multiValueLabel: (provided) => {
    const darkMode = isDarkMode();
    return {
      ...provided,
      color: darkMode ? "#f3f4f6" : "#212529",
    };
  },
  multiValueRemove: (provided) => {
    const darkMode = isDarkMode();
    return {
      ...provided,
      color: darkMode ? "#9ca3af" : "#6c757d",
      "&:hover": {
        backgroundColor: darkMode ? "#6b7280" : "#dee2e6",
        color: darkMode ? "#f3f4f6" : "#212529",
      },
    };
  },
};

// Version alternative utilisant les CSS Variables (recommandée)
export const customSelectStylesWithCSSVars = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "20px",
    border: "2px solid var(--select-border, #dee2e6)",
    backgroundColor: "var(--select-bg, #ffffff)",
    color: "var(--select-text, #212529)",
    boxShadow: "none",
    "&:hover": {
      borderColor: "var(--select-border-hover, #dee2e6)",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "5px",
    border: "1px solid var(--select-border, #dee2e6)",
    backgroundColor: "var(--select-bg, #ffffff)",
    boxShadow: "0 2px 5px rgba(15, 34, 58, 0.12)"
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? "var(--select-option-selected-bg, #e9ebec)" 
      : "var(--select-option-bg, #ffffff)",
    color: state.isSelected 
      ? "var(--select-option-selected-text, #212529)" 
      : "var(--select-option-text, #212529)",
    "&:hover": {
      backgroundColor: "var(--select-option-hover-bg, #e9ebec)",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--select-text, #212529)",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--select-placeholder, #6c757d)",
  }),
  input: (provided) => ({
    ...provided,
    color: "var(--select-text, #212529)",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "var(--select-indicator, #6c757d)",
    "&:hover": {
      color: "var(--select-indicator-hover, #495057)",
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "var(--select-indicator, #6c757d)",
    "&:hover": {
      color: "var(--select-indicator-hover, #495057)",
    },
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: "var(--select-border, #dee2e6)",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "var(--select-multivalue-bg, #e9ecef)",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "var(--select-text, #212529)",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "var(--select-indicator, #6c757d)",
    "&:hover": {
      backgroundColor: "var(--select-multivalue-remove-hover, #dee2e6)",
      color: "var(--select-text, #212529)",
    },
  }),
};

// Composant Select personnalisé réutilisable
export const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Sélectionner...",
  isDisabled = false,
  isMulti = false,
  useCSSVars = true, // Option pour utiliser les CSS Variables
  ...props 
}) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isMulti={isMulti}
      styles={useCSSVars ? customSelectStylesWithCSSVars : customSelectStyles}
      {...props}
    />
  );
};