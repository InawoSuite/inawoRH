// src/contexts/ContactTypeContext.js
import { createContext, useContext, useState } from 'react';

// Créez le contexte
const ContactTypeContext = createContext(null);

// Créez le Provider
export const ContactTypeProvider = ({ children }) => {
  const [contactType, setContactType] = useState("all");
  
  return (
    <ContactTypeContext.Provider value={{ contactType, setContactType }}>
      {children}
    </ContactTypeContext.Provider>
  );
};

// Créez le hook personnalisé
export const useContactType = () => {
  const context = useContext(ContactTypeContext);
  console.log("useContactType context:", context); 
  
  if (context === null) {
    throw new Error(
      "useContactType doit être utilisé à l'intérieur d'un ContactTypeProvider"
    );
  }
  
  return context;
};