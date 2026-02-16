import React from "react";
import NotAvailablePage from "../../Components/Common/NotAvailablePage";
import { Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";

const Banque = () => {
  return (
    <>
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb
              title="Banque"
              pageTitle={
                <>
                  <i className="ri-cash-line me-1 align-bottom"></i>
                  &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
                </>
              }
            />
            <NotAvailablePage description="..." />
          </Container>
        </div>
      </React.Fragment>
    </>
  );
};

export default Banque; // Pas de parenthèses !
