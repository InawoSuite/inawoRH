import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";


const AddContract = () => {
   

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title="&nbsp;Ajouter un contrat"
                    pageTitle={
                        <>
                            <i className="ri-team-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                        </>
                    }
                />

               
            </Container>
        </div>
    );
};


export default AddContract;
