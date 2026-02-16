import React, { useState } from "react";
import InvoiceListe from "./InvoiceListe";
import InvoiceDetail from "./InvoiceDetail";
import InvoiceCreate from "./InvoiceCreate";

const Immobilisations = () => {
  const [activeComponent, setActiveComponent] = useState("first");
  const [selectedOperation, setSelectedOperation] = useState(null);

  // Fonction pour afficher les détails
  const showDetails = (operation) => {
    setSelectedOperation(operation);
    setActiveComponent("third");
  };

  // Fonction pour éditer une entrée
  const editOperation = (operation) => {
    setSelectedOperation(operation);
    setActiveComponent("second");
  };

  return (
    <div>
      {activeComponent === "first" ? (
        <InvoiceListe
        // jk
          switchToCreate={() => setActiveComponent("second")}
          showDetails={showDetails}
          switchToEdit={editOperation}
        />
      ) : activeComponent === "second" ? (
        <InvoiceCreate
          switchToList={() => setActiveComponent("first")}
          expenseToEdit={selectedOperation}
        />
      ) : activeComponent === "third" ? (
        <InvoiceDetail
          operation={selectedOperation}
          switchToList={() => setActiveComponent("first")}
          switchToEdit={() => editOperation(selectedOperation)}
        />
      ) : null}
    </div>
  );
};

export default Immobilisations;