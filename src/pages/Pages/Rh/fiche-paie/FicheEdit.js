import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";


const FicheEdit = () => {
    const { t } = useTranslation();
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

    const cardStyle = {
        borderRadius: "20px",
        background: "#fff",
        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    };
    const navigate = useNavigate();

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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title={`\u00a0${t("Modifier une fiche de paie")}`}
                    pageTitle={
                        <>
                            <i className="ri-team-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>&nbsp;&gt;
                        </>
                    }
                />

                <Form onSubmit={(event) => event.preventDefault()}>
                    <Row className="mb-2">
                        <Col lg={12}>
                            <Card className="border-0" style={cardStyle}>
                                <CardBody className="p-4">
                                    <Row className="mb-3">
                                        <Col>
                                            <h6 className="text-uppercase text-muted mb-0">{t("Informations générales")}</h6>
                                        </Col>
                                    </Row>
                                    <Row className="gx-3 gy-2">
                                        <Col md={4}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="entreprise">{t("Entreprise")}</Label>
                                                <Input id="entreprise" name="entreprise" type="text" value={formData.entreprise} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="numero">{t("N°")}</Label>
                                                <Input id="numero" name="numero" type="text" value={formData.numero} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="mois">{t("Mois")}</Label>
                                                <Input id="mois" name="mois" type="text" value={formData.mois} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="datePaie">{t("Date de paie")}</Label>
                                                <Input id="datePaie" name="datePaie" type="date" value={formData.datePaie} onChange={handleChange} className="rounded-pill" />
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
                                            <h6 className="text-uppercase text-muted mb-0">{t("Informations de la fiche de paie")}</h6>
                                        </Col>
                                    </Row>
                                    <Row className="gx-3 gy-2">
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="nomPrenoms">{t("Nom et Prénoms")}</Label>
                                                <Input id="nomPrenoms" name="nomPrenoms" type="text" value={formData.nomPrenoms} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="emplois">{t("Emplois")}</Label>
                                                <Input id="emplois" name="emplois" type="text" value={formData.emplois} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="matricule">{t("N° Matricule")}</Label>
                                                <Input id="matricule" name="matricule" type="text" value={formData.matricule} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="categorie">{t("Catégorie")}</Label>
                                                <Input id="categorie" name="categorie" type="text" value={formData.categorie} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="situationFamiliale">{t("Situation Familiale")}</Label>
                                                <Input id="situationFamiliale" name="situationFamiliale" type="text" value={formData.situationFamiliale} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="salaireBase">{t("Salaire de base")}</Label>
                                                <Input id="salaireBase" name="salaireBase" type="text" value={formData.salaireBase} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="primeAnciennete">{t("Prime d'ancienneté")}</Label>
                                                <Input id="primeAnciennete" name="primeAnciennete" type="text" value={formData.primeAnciennete} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="conges">{t("Congés")}</Label>
                                                <Input id="conges" name="conges" type="text" value={formData.conges} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="rappelsSalaire">{t("Rappels sur salaire")}</Label>
                                                <Input id="rappelsSalaire" name="rappelsSalaire" type="text" value={formData.rappelsSalaire} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="salaireBrut">{t("Salaire Brut")}</Label>
                                                <Input id="salaireBrut" name="salaireBrut" type="text" value={formData.salaireBrut} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="cnss">{t("CNSS (3,6%)")}</Label>
                                                <Input id="cnss" name="cnss" type="text" value={formData.cnss} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="its">{t("ITS")}</Label>
                                                <Input id="its" name="its" type="text" value={formData.its} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="totalRetenues">{t("Total Retenues")}</Label>
                                                <Input id="totalRetenues" name="totalRetenues" type="text" value={formData.totalRetenues} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup className="mb-0">
                                                <Label style={{ marginBottom: "0" }} for="salaireNetPayer">{t("Salaire Net à Payer")}</Label>
                                                <Input id="salaireNetPayer" name="salaireNetPayer" type="text" value={formData.salaireNetPayer} onChange={handleChange} className="rounded-pill" />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button
                                    color="secondary"
                                    type="button"
                                    style={{ borderRadius: "20px" }}
                                    onClick={() => navigate(-1)}
                                >
                                    {t("Annuler")}
                                </Button>
                                <Button
                                    color="primary"
                                    type="submit"
                                    style={{ borderRadius: "20px" }}
                                >
                                    {t("Enregistrer")}
                                </Button>
                            </div>
                        </Col>
                    </Row>




                </Form>
            </Container>
        </div>
    );
};


export default FicheEdit;
