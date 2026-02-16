import { createContext, useContext, useState } from 'react';

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [activeType, setActiveType] = useState("all"); // Initialisez bien ici
  
  return (
    <ContactContext.Provider value={{ activeType, setActiveType }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContactType must be used within a ContactTypeProvider');
  }
  return context;
};