import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

const DetailContract = () => {
    // const { id } = useParams();
    // const { state } = useLocation();
    // const [formData, setFormData] = useState({
    //     entreprise: "",
    //     numero: "",
    //     mois: "",
    //     datePaie: "",
    //     nomPrenoms: "",
    //     emplois: "",
    //     matricule: "",
    //     categorie: "",
    //     situationFamiliale: "",
    //     salaireBase: "",
    //     primeAnciennete: "0",
    //     conges: "0",
    //     rappelsSalaire: "0",
    //     salaireBrut: "",
    //     cnss: "",
    //     its: "",
    //     totalRetenues: "",
    //     salaireNetPayer: "",
    // });

    // const fichePaieData = useMemo(() => ([
    //     {
    //         id: 1,
    //         nom: "Dupont",
    //         prenom: "Jean",
    //         periode: "Mai",
    //         lot_de_paie: "Lot 1",
    //         remuneration_totale: "500 000",
    //         salaire_base: "400 000",
    //         statut: "actif",
    //     },
    //     {
    //         id: 2,
    //         nom: "Martin",
    //         prenom: "Marie",
    //         periode: "Juin",
    //         lot_de_paie: "Lot 2",
    //         remuneration_totale: "600 000",
    //         salaire_base: "500 000",
    //         statut: "actif",
    //     },
    //     {
    //         id: 3,
    //         nom: "Durant",
    //         prenom: "Pierre",
    //         periode: "Juillet",
    //         lot_de_paie: "Lot 3",
    //         remuneration_totale: "550 000",
    //         salaire_base: "450 000",
    //         statut: "inactif",
    //     },
    // ]), []);

    // const selectedFichePaie = useMemo(() => {
    //     const fromState = state?.fichePaie;
    //     if (fromState) {
    //         return fromState;
    //     }
    //     return fichePaieData.find((item) => String(item.id) === String(id)) || null;
    // }, [state, fichePaieData, id]);

    // useEffect(() => {
    //     if (!selectedFichePaie) {
    //         return;
    //     }

    //     setFormData({
    //         entreprise: "INAWO",
    //         numero: String(selectedFichePaie.id || ""),
    //         mois: selectedFichePaie.periode || "",
    //         datePaie: "",
    //         nomPrenoms: `${selectedFichePaie.nom || ""} ${selectedFichePaie.prenom || ""}`.trim(),
    //         emplois: selectedFichePaie.lot_de_paie || "",
    //         matricule: "",
    //         categorie: "",
    //         situationFamiliale: "",
    //         salaireBase: selectedFichePaie.salaire_base || "",
    //         primeAnciennete: "0",
    //         conges: "0",
    //         rappelsSalaire: "0",
    //         salaireBrut: selectedFichePaie.remuneration_totale || "",
    //         cnss: "",
    //         its: "",
    //         totalRetenues: "",
    //         salaireNetPayer: selectedFichePaie.remuneration_totale || "",
    //     });
    // }, [selectedFichePaie]);

    // const cardStyle = {
    //     borderRadius: "20px",
    //     background: "#fff",
    //     boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    // };

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title="&nbsp;Détails du contrat"
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


export default DetailContract;
