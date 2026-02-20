import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

const FicheDetail = () => {
    const { id } = useParams();
    const { state } = useLocation();
    const [formData, setFormData] = useState({
        entreprise: "",
        numero: "",
        mois: "",
        datePaie: "",
        nomPrenoms: "",
        emplois: "",
        matricule: "",
        categorie: "",
        situationFamiliale: "",
        salaireBase: "",
        primeAnciennete: "0",
        conges: "0",
        rappelsSalaire: "0",
        salaireBrut: "",
        cnss: "",
        its: "",
        totalRetenues: "",
        salaireNetPayer: "",
    });

    const fichePaieData = useMemo(() => ([
        {
            id: 1,
            nom: "Dupont",
            prenom: "Jean",
            periode: "Mai",
            lot_de_paie: "Lot 1",
            remuneration_totale: "500 000",
            salaire_base: "400 000",
            statut: "actif",
        },
        {
            id: 2,
            nom: "Martin",
            prenom: "Marie",
            periode: "Juin",
            lot_de_paie: "Lot 2",
            remuneration_totale: "600 000",
            salaire_base: "500 000",
            statut: "actif",
        },
        {
            id: 3,
            nom: "Durant",
            prenom: "Pierre",
            periode: "Juillet",
            lot_de_paie: "Lot 3",
            remuneration_totale: "550 000",
            salaire_base: "450 000",
            statut: "inactif",
        },
    ]), []);

    const selectedFichePaie = useMemo(() => {
        const fromState = state?.fichePaie;
        if (fromState) {
            return fromState;
        }
        return fichePaieData.find((item) => String(item.id) === String(id)) || null;
    }, [state, fichePaieData, id]);

    useEffect(() => {
        if (!selectedFichePaie) {
            return;
        }

        setFormData({
            entreprise: "INAWO",
            numero: String(selectedFichePaie.id || ""),
            mois: selectedFichePaie.periode || "",
            datePaie: "",
            nomPrenoms: `${selectedFichePaie.nom || ""} ${selectedFichePaie.prenom || ""}`.trim(),
            emplois: selectedFichePaie.lot_de_paie || "",
            matricule: "",
            categorie: "",
            situationFamiliale: "",
            salaireBase: selectedFichePaie.salaire_base || "",
            primeAnciennete: "0",
            conges: "0",
            rappelsSalaire: "0",
            salaireBrut: selectedFichePaie.remuneration_totale || "",
            cnss: "",
            its: "",
            totalRetenues: "",
            salaireNetPayer: selectedFichePaie.remuneration_totale || "",
        });
    }, [selectedFichePaie]);

    const cardStyle = {
        borderRadius: "20px",
        background: "#fff",
        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    };

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title="&nbsp;Détails de la fiche de paie"
                    pageTitle={
                        <>
                            <i className="ri-team-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                        </>
                    }
                />

                <Form>
                    <Row className="mb-2">
                        <Col lg={12}>
                            <Card className="border-0" style={cardStyle}>
                                <CardBody className="p-4">
                                    <Row className="mb-3">
                                        <Col>
                                            <h6 className="text-uppercase text-muted mb-0">Informations générales</h6>
                                        </Col>
                                    </Row>
                                    <Row className="gx-3 gy-2">
                                        <Col md={4}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="entreprise">Entreprise</Label>
                                                <Input id="entreprise" name="entreprise" type="text" value={formData.entreprise} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="numero">N°</Label>
                                                <Input id="numero" name="numero" type="text" value={formData.numero} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="mois">Mois</Label>
                                                <Input id="mois" name="mois" type="text" value={formData.mois} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="datePaie">Date de paie</Label>
                                                <Input id="datePaie" name="datePaie" type="date" value={formData.datePaie} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col lg={12}>
                            <Card className="border-0" style={cardStyle}>
                                <CardBody className="p-4">
                                    <Row className="mb-3">
                                        <Col>
                                            <h6 className="text-uppercase text-muted mb-0">Informations de la fiche de paie</h6>
                                        </Col>
                                    </Row>
                                    <Row className="gx-3 gy-2">
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="nomPrenoms">Nom et Prénoms</Label>
                                                <Input id="nomPrenoms" name="nomPrenoms" type="text" value={formData.nomPrenoms} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="emplois">Emplois</Label>
                                                <Input id="emplois" name="emplois" type="text" value={formData.emplois} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="matricule">N° Matricule</Label>
                                                <Input id="matricule" name="matricule" type="text" value={formData.matricule} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="categorie">Catégorie</Label>
                                                <Input id="categorie" name="categorie" type="text" value={formData.categorie} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="situationFamiliale">Situation Familiale</Label>
                                                <Input id="situationFamiliale" name="situationFamiliale" type="text" value={formData.situationFamiliale} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="salaireBase">Salaire de base</Label>
                                                <Input id="salaireBase" name="salaireBase" type="text" value={formData.salaireBase} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="primeAnciennete">Prime d'ancienneté</Label>
                                                <Input id="primeAnciennete" name="primeAnciennete" type="text" value={formData.primeAnciennete} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="conges">Congés</Label>
                                                <Input id="conges" name="conges" type="text" value={formData.conges} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="rappelsSalaire">Rappels sur salaire</Label>
                                                <Input id="rappelsSalaire" name="rappelsSalaire" type="text" value={formData.rappelsSalaire} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="salaireBrut">Salaire Brut</Label>
                                                <Input id="salaireBrut" name="salaireBrut" type="text" value={formData.salaireBrut} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="cnss">CNSS (3,6%)</Label>
                                                <Input id="cnss" name="cnss" type="text" value={formData.cnss} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="its">ITS</Label>
                                                <Input id="its" name="its" type="text" value={formData.its} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="totalRetenues">Total Retenues</Label>
                                                <Input id="totalRetenues" name="totalRetenues" type="text" value={formData.totalRetenues} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="salaireNetPayer">Salaire Net à Payer</Label>
                                                <Input id="salaireNetPayer" name="salaireNetPayer" type="text" value={formData.salaireNetPayer} readOnly className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    );
};


export default FicheDetail;
