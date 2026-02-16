import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const SoonAvailableModal = ({ isOpen, toggle, title = "Fonctionnalité bientôt disponible" }) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      className="border-0"
      contentClassName="rounded-4"
      style={{ maxWidth: "500px" }}
    >
      <ModalHeader 
        toggle={toggle} 
        className="bg-primary-subtle p-3 rounded-top-4 border-0"
      >
        <i className="ri-time-line me-2 text-primary"></i>
        {title}
      </ModalHeader>
      
      <ModalBody className="text-center py-4">
        <div className="mb-3">
          <i 
            className="ri-tools-fill text-warning" 
            style={{ fontSize: "3rem" }}
          ></i>
        </div>
        <h5 className="text-primary mb-3">Fonctionnalité en cours de développement</h5>
        <p className="text-muted mb-0">
          Cette fonctionnalité sera bientôt disponible. Notre équipe travaille dur 
          pour vous offrir la meilleure expérience possible.
        </p>
      </ModalBody>
      
      <ModalFooter className="border-0">
        <Button 
          color="primary" 
          className="rounded-pill px-4"
          onClick={toggle}
        >
          <i className="ri-check-line me-1"></i>
          Compris
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SoonAvailableModal;