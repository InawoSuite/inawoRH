// import React from "react";

// import "./whatsapp.css"


// const ButtonWhatsApp = ({ 
//   whatsappLink = "https://wa.me/message/AHRYOWVVRYB6D1",
//   // whatsappLink = "https://faq.whatsapp.com/5913398998672934/?locale=fr_FR",
//   message = "Bonjour, je souhaite obtenir plus d'informations",
//   size = "medium", // small, medium, large
//   showLabel = false,
//   pulse = true
// }) => {
  
//   const createWhatsAppUrl = () => {
//     if (message) {
//       const encodedMessage = encodeURIComponent(message);
//       return `${whatsappLink}?text=${encodedMessage}`;
//     }
//     return whatsappLink;
//   };

//   // Styles pour le bouton
//   const containerStyle = {
//     position: 'absolute',
//     bottom: '20px',
//     right: '20px',
//     zIndex: 1000,
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     gap: '8px'
//   };

//   const getButtonSize = () => {
//     switch(size) {
//       case 'small': return { width: '50px', height: '50px', fontSize: '24px' };
//       case 'large': return { width: '70px', height: '70px', fontSize: '32px' };
//       default: return { width: '60px', height: '60px', fontSize: '28px' };
//     }
//   };

//   const buttonStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(37, 211, 102, 0.7)',
//     color: 'white',
//     border: 'none',
//     borderRadius: '50%',
//     textDecoration: 'none',
//     boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
//     transition: 'all 0.3s ease',
//     cursor: 'pointer',
//     ...getButtonSize()
//   };

//   const labelStyle = {
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     color: 'white',
//     padding: '6px 12px',
//     borderRadius: '20px',
//     fontSize: '12px',
//     fontWeight: '500',
//     whiteSpace: 'nowrap',
//     opacity: 0,
//     transform: 'translateY(10px)',
//     transition: 'all 0.3s ease'
//   };

//   return (
//     <div style={containerStyle}>
//       <a
//         href={createWhatsAppUrl()}
//         target="_blank"
//         rel="noopener noreferrer"
//         style={buttonStyle}
//         className={pulse ? 'whatsapp-pulse' : ''}
//         title="Contactez-nous sur WhatsApp"
//         onMouseEnter={(e) => {
//           e.target.style.backgroundColor = '#128C7E';
//           e.target.style.transform = 'scale(1.1)';
//           e.target.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.6)';
          
//           // Afficher le label au survol
//           if (showLabel) {
//             const label = e.target.nextSibling;
//             if (label) {
//               label.style.opacity = '1';
//               label.style.transform = 'translateY(0)';
//             }
//           }
//         }}
//         onMouseLeave={(e) => {
//           e.target.style.backgroundColor = 'rgba(37, 211, 102, 0.7)';
//           e.target.style.transform = 'scale(1)';
//           e.target.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
          
//           // Masquer le label
//           if (showLabel) {
//             const label = e.target.nextSibling;
//             if (label) {
//               label.style.opacity = '0';
//               label.style.transform = 'translateY(10px)';
//             }
//           }
//         }}
//       >
//         <i className="ri-whatsapp-fill"></i>
//       </a>
      
//       {showLabel && (
//         <div style={labelStyle}>
//           Contactez-nous
//         </div>
//       )}
//     </div>
//   );
// };

// export default ButtonWhatsApp;






// import React from "react";
// import "./whatsapp.css"

// const ButtonWhatsApp = ({ 
//   whatsappLink = "https://wa.me/message/AHRYOWVVRYB6D1",
//   message = "Bonjour, je souhaite obtenir plus d'informations",
//   size = "medium",
//   showLabel = false,
//   pulse = true
// }) => {
  
//   const createWhatsAppUrl = () => {
//     if (message) {
//       const encodedMessage = encodeURIComponent(message);
//       return `${whatsappLink}?text=${encodedMessage}`;
//     }
//     return whatsappLink;
//   };

//   // Styles pour le bouton - CHANGEMENT ICI : 'absolute' → 'fixed'
//   const containerStyle = {
//     position: 'fixed', // ← CHANGEMENT CRITIQUE
//     bottom: '20px',
//     right: '20px',
//     zIndex: 9999, // ← Augmenté pour être sûr qu'il soit au-dessus
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     gap: '8px'
//   };

//   const getButtonSize = () => {
//     switch(size) {
//       case 'small': return { width: '50px', height: '50px', fontSize: '24px' };
//       case 'large': return { width: '70px', height: '70px', fontSize: '32px' };
//       default: return { width: '60px', height: '60px', fontSize: '28px' };
//     }
//   };

//   const buttonStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(37, 211, 102, 0.7)',
//     color: 'white',
//     border: 'none',
//     borderRadius: '50%',
//     textDecoration: 'none',
//     boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
//     transition: 'all 0.3s ease',
//     cursor: 'pointer',
//     ...getButtonSize()
//   };

//   const labelStyle = {
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     color: 'white',
//     padding: '6px 12px',
//     borderRadius: '20px',
//     fontSize: '12px',
//     fontWeight: '500',
//     whiteSpace: 'nowrap',
//     opacity: 0,
//     transform: 'translateY(10px)',
//     transition: 'all 0.3s ease'
//   };

//   return (
//     <div style={containerStyle}>
//       <a
//         href={createWhatsAppUrl()}
//         target="_blank"
//         rel="noopener noreferrer"
//         style={buttonStyle}
//         className={pulse ? 'whatsapp-pulse' : ''}
//         title="Contactez-nous sur WhatsApp"
//         onMouseEnter={(e) => {
//           e.target.style.backgroundColor = '#128C7E';
//           e.target.style.transform = 'scale(1.1)';
//           e.target.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.6)';
          
//           if (showLabel) {
//             const label = e.target.nextSibling;
//             if (label) {
//               label.style.opacity = '1';
//               label.style.transform = 'translateY(0)';
//             }
//           }
//         }}
//         onMouseLeave={(e) => {
//           e.target.style.backgroundColor = 'rgba(37, 211, 102, 0.7)';
//           e.target.style.transform = 'scale(1)';
//           e.target.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
          
//           if (showLabel) {
//             const label = e.target.nextSibling;
//             if (label) {
//               label.style.opacity = '0';
//               label.style.transform = 'translateY(10px)';
//             }
//           }
//         }}
//       >
//         <i className="ri-whatsapp-fill"></i>
//       </a>
      
//       {showLabel && (
//         <div style={labelStyle}>
//           Contactez-nous
//         </div>
//       )}
//     </div>
//   );
// };

// export default ButtonWhatsApp;

import React, { useState } from "react";
import "./whatsapp.css";

const ButtonWhatsApp = ({ 
  whatsappLink = "https://wa.me/message/AHRYOWVVRYB6D1",
  message = "Bonjour, je souhaite obtenir plus d'informations",
  labelText = "Contactez-nous",
  size = "medium",
  showLabel = true,
  pulse = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const createWhatsAppUrl = () => {
    if (message) {
      const encodedMessage = encodeURIComponent(message);
      return `${whatsappLink}?text=${encodedMessage}`;
    }
    return whatsappLink;
  };

  // Container principal
  const containerStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10px'
  };

  const getButtonSize = () => {
    switch(size) {
      case 'small': return { width: '50px', height: '50px', fontSize: '24px' };
      case 'large': return { width: '70px', height: '70px', fontSize: '32px' };
      default: return { width: '60px', height: '60px', fontSize: '28px' };
    }
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    outline: 'none',
    flexShrink: 0,
    ...getButtonSize()
  };

  // Bulle de texte à gauche
  const labelStyle = {
    backgroundColor: '#25D366',
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '70px',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    opacity: isHovered && showLabel ? 1 : 0,
    transform: isHovered && showLabel ? 'translateX(0)' : 'translateX(10px)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none',
    position: 'relative'
  };

  // Petite flèche pointant vers le bouton
  const arrowStyle = {
    content: '""',
    position: 'absolute',
    right: '-6px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid rgba(0, 0, 0, 0.8)',
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent'
  };

  return (
    <div style={containerStyle}>
      {/* Bulle de texte à gauche */}
      {showLabel && (
        <div style={labelStyle}>
          {labelText}
          {/* <div style={arrowStyle}></div> */}
        </div>
      )}
      
      {/* Bouton WhatsApp */}
      <a
        href={createWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        style={buttonStyle}
        className={pulse ? 'whatsapp-pulse' : ''}
        title=""
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        <i className="ri-whatsapp-fill"></i>
      </a>
    </div>
  );
};

export default ButtonWhatsApp;