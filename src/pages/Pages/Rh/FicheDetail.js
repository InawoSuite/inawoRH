import React, { useMemo, useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import PhoneInput from "../../../Components/ContactDeleteModal/CountryPhoneInput";
import { country } from "../../../common/data";
import { CustomSelect } from "../../../Components/Common/CustomSelectStyles";
import dummyImg from "../../../assets/images/users/user-dummy-img.jpg";
import Fiche4 from "../Compta/Etats/tables/FicheR4";

const FicheDetail = () => {
    const navigate = useNavigate();
   

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title="&nbsp;Ajouter un collaborateur"
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


export default FicheDetail;
