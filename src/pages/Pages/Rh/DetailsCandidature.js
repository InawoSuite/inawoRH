import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";

const DetailsCandidature = () => {

    

  return (
    <div className="page-content">
                    <Container fluid>
                        <BreadCrumb
                          title="&nbsp;Details Candidature"
                          pageTitle={
                            <>
                              <i className="ri-team-line"></i>
                              &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                            </>
                          }
                        />
                        <React.Fragment>
                            
                        </React.Fragment>
                    </Container>
                </div>
  );
};

export default DetailsCandidature;