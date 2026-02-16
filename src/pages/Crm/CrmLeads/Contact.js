import React, { useState } from "react";
import { Container } from 'reactstrap';

import ContactsDetails from "./ContactsDetails";
import AppContact from "./index";

const Contact = () => {
  const [activeComponent, setActiveComponent] = useState("first");
  const [selectedContactId, setSelectedContactId] = useState(null);

  const switchToDetails = (id) => {
    setSelectedContactId(id);
    setActiveComponent("details");
  };

  const switchToList = () => {
    setActiveComponent("first");
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
        <div>
          {activeComponent === "first" ? (
            <AppContact switchToDetails={switchToDetails} />
          ) : (
            <ContactsDetails
              contactId={selectedContactId} 
              switchToList={switchToList}
            />
          )}
        </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Contact;
