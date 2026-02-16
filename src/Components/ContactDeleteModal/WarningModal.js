import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Modal,
  ModalBody,
   ModalHeader,
  ModalFooter,
} from "reactstrap";
export default function WarningModal({ 
  isOpen, 
  onClose,
  message = "Ce contact est lié à des transactions et ne peut être supprimé",
  details = "Ce contact ne peut être supprimé car il est associé à des transactions existantes."
}) {
  return (
    <Modal isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}>
        <i className="ri-alert-line me-2"></i> Avertissement
      </ModalHeader>
      <ModalBody>
        <div className="text-center">
          <div className="mb-3">
            <i className="ri-error-warning-line text-warning" style={{ fontSize: "4rem" }}></i>
          </div>
          <h5>{message}</h5>
          <p className="text-muted mt-2">{details}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <button 
          className="btn btn-warning"
          onClick={onClose}
        >
          J'ai compris
        </button>
      </ModalFooter>
    </Modal>
  );
}