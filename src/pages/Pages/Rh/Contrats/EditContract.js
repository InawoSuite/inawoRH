import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";


const EditContract = () => {
    const { t } = useTranslation();


    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title={`\u00a0${t("Modifier le contrat")}`}
                    pageTitle={
                        <>
                            <i className="ri-team-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>&nbsp;&gt;
                        </>
                    }
                />


            </Container>
        </div>
    );
};


export default EditContract;
