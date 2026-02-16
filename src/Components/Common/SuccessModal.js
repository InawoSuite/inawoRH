import React from "react";
import {
  Modal,
  ModalBody,
  Card,
  CardBody,
  Row,
  Col,
  Button,
} from "reactstrap";

const SuccessModal = ({
  // État et contrôle
  isOpen,
  toggle,
  
  // Contenu
  title = "Succès !",
  message = "Opération effectuée avec succès",
  
  // Bouton
  buttonText = "Compris",
  buttonColor = "success",
  onButtonClick,
  showButton = true,
  
  // Icône
  icon = "ri-checkbox-circle-fill",
  iconColor = "success",
  showIcon = true,
  
  // Style et configuration
  centered = true,
  size = "md",
  backdrop = true,
}) => {
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      toggle();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered={centered}
      size={size}
      backdrop={backdrop}
      className="success-modal" contentClassName="custom-rounded-modal"
    >
      <ModalBody className="p-0">
        <Row className="justify-content-center">
          <Col md={12}>
            <Card className="mt-0 border-0 shadow-none bg-transparent">
              <CardBody className="p-4 text-center">
                {/* Icône */}
                {showIcon && (
                  <div className="avatar-lg mx-auto mt-2">
                    <div
                      className={`avatar-title bg-light text-${iconColor} display-3 rounded-circle`}
                      style={{ 
                        width: "80px", 
                        height: "80px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <i className={icon} style={{ fontSize: "2.5rem" }}></i>
                    </div>
                  </div>
                )}
                
                {/* Contenu */}
                <div className="mt-4 pt-2">
                  <h4 className="text-dark mb-3" style={{ fontWeight: "600" }}>
                    {title}
                  </h4>
                  
                  <p 
                    className="text-muted mx-4 mb-4" 
                    // style={{ 
                    //   lineHeight: "1.6",
                    //   fontSize: "1rem"
                    // }}
                  >
                    {message}
                  </p>
                  
                  {/* Bouton */}
                  {showButton && (
                    <div className="mt-4">
                      <Button
                        color={buttonColor}
                        className="rounded-pill"
                        onClick={handleButtonClick}
                        // style={{ 
                        //   fontWeight: "600",
                        //   padding: "12px 40px",
                        //   fontSize: "1rem",
                        //   minWidth: "140px"
                        // }}
                      >
                        {buttonText}
                      </Button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default SuccessModal;