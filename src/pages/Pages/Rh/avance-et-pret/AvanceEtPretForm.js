import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { CustomSelect } from "../../../../Components/Common/CustomSelectStyles";
import { useTranslation } from "react-i18next";

const mockData = {
    "1": {
        id: 1,
        numero: "AV-2024-001",
        nomEmploye: "Jean Dupont",
        salaireNet: 250000,
        montantPret: 50000,
        periode: "2024-01",
        dateRemboursement: "2024-02-15",
        montantRembourse: 20000,
        solde: 30000,
        statut: "actif"
    },
    "2": {
        id: 2,
        numero: "PR-2024-002",
        nomEmploye: "Marie Martin",
        salaireNet: 320000,
        montantPret: 150000,
        periode: "2024-01",
        dateRemboursement: "2024-04-30",
        montantRembourse: 50000,
        solde: 100000,
        statut: "actif"
    },
    "3": {
        id: 3,
        numero: "AV-2024-003",
        nomEmploye: "Pierre Durand",
        salaireNet: 280000,
        montantPret: 75000,
        periode: "2024-02",
        dateRemboursement: "2024-03-15",
        montantRembourse: 75000,
        solde: 0,
        statut: "payé"
    }
};

const AvanceEtPretForm = ({ mode = "add" }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        nomEmploye: "",
        salaireNet: "",
        montantPret: "",
        periode: "",
        dateRemboursement: "",
        montantRembourse: "",
        solde: "",
        statut: "actif"
    });

    useEffect(() => {
        if (mode === "edit" && id && mockData[id]) {
            const data = mockData[id];
            setFormData({
                nomEmploye: data.nomEmploye,
                salaireNet: data.salaireNet,
                montantPret: data.montantPret,
                periode: data.periode,
                dateRemboursement: data.dateRemboursement,
                montantRembourse: data.montantRembourse,
                solde: data.solde,
                statut: data.statut
            });
        }
    }, [mode, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Données soumises:", formData);
        navigate("/:entreprise/avance-et-pret");
    };

    const cardStyle = {
        borderRadius: "20px",
        background: "#fff",
        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    };

    const [selectedStatut, setSelectedStatut] = useState(null);
    const statutOptions = useMemo(
        () => [
            { value: "actif", label: t("Actif") },
            { value: "payé", label: t("Payé") },
            { value: "dépassé", label: t("Dépassé") },
        ],
        [t]
    );

    document.title = mode === "add" ? t("Ajouter une avance/prêt") : t("Modifier l'avance/prêt");

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title={mode === "add" ? t("Ajouter une avance/prêt") : t("Modifier l'avance/prêt")}
                    pageTitle={
                        <>
                            <i className="ri-money-dollar-circle-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>
                            &nbsp;&gt;&nbsp;<Link to="/:entreprise/paie-et-avances">{t("Paie et Avances")}</Link>&nbsp;&gt;&nbsp;
                        </>
                    }
                />

                <Row>
                    <Col lg={12}>
                        <Card className="border-0" style={cardStyle}>
                            <CardBody className="p-4">
                                <h5 className="mb-4">
                                    {mode === "add" ? t("Nouvelle avance/prêt") : t("Modification avance/prêt")}
                                </h5>

                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="nomEmploye">
                                                    {t("Nom de l'employé")} <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="nomEmploye"
                                                    className="rounded-4"
                                                    name="nomEmploye"
                                                    type="text"
                                                    placeholder={t("Ex: Jean Dupont")}
                                                    value={formData.nomEmploye}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="salaireNet">
                                                    {t("Salaire net")} <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="salaireNet"
                                                    className="rounded-4"
                                                    name="salaireNet"
                                                    type="number"
                                                    placeholder={t("Ex: 250000")}
                                                    value={formData.salaireNet}
                                                    onChange={handleChange}
                                                    step="1000"
                                                    min="0"
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="montantPret">
                                                    {t("Montant du prêt")} <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="montantPret"
                                                    className="rounded-4"
                                                    name="montantPret"
                                                    type="number"
                                                    placeholder={t("Ex: 50000")}
                                                    value={formData.montantPret}
                                                    onChange={handleChange}
                                                    step="1000"
                                                    min="0"
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="periode">
                                                    {t("Période")} <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="periode"
                                                    className="rounded-4"
                                                    name="periode"
                                                    type="month"
                                                    value={formData.periode}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="dateRemboursement">
                                                    {t("Date de remboursement")} <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="dateRemboursement"
                                                    className="rounded-4"
                                                    name="dateRemboursement"
                                                    type="date"
                                                    value={formData.dateRemboursement}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    {mode === "edit" && (
                                        <>
                                            <h6 className="text-primary mt-4 mb-3">{t("Informations de suivi")}</h6>
                                            <Row>
                                                <Col md={4}>
                                                    <FormGroup className="mb-3">
                                                        <Label for="montantRembourse">
                                                            {t("Montant remboursé")}
                                                        </Label>
                                                        <Input
                                                            id="montantRembourse"
                                                            className="rounded-4"
                                                            name="montantRembourse"
                                                            type="number"
                                                            placeholder={t("Ex: 20000")}
                                                            value={formData.montantRembourse}
                                                            onChange={handleChange}
                                                            step="1000"
                                                            min="0"
                                                        />
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup className="mb-3">
                                                        <Label for="solde">
                                                            {t("Solde restant")}
                                                        </Label>
                                                        <Input
                                                            id="solde"
                                                            className="rounded-4"
                                                            name="solde"
                                                            type="number"
                                                            placeholder={t("Ex: 30000")}
                                                            value={formData.solde}
                                                            onChange={handleChange}
                                                            step="1000"
                                                            min="0"
                                                            readOnly={mode === "edit"}
                                                        />
                                                        <small className="text-muted">{t("Montant prêt - Montant remboursé")}</small>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <FormGroup className="mb-3">
                                                        <Label htmlFor="statut">
                                                            {t("Statut")}
                                                        </Label>
                                                        <CustomSelect
                                                            inputId="statut"
                                                            value={selectedStatut}
                                                            onChange={(option) => setSelectedStatut(option)}
                                                            options={statutOptions}
                                                            placeholder={t("Sélectionner le statut")}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </>
                                    )}

                                    <Row className="mt-4">
                                        <Col md={12}>
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button
                                                    className="btn btn-secondary rounded-5"
                                                    type="button"
                                                    style={{ borderRadius: "70px", padding: "10px 30px" }}
                                                    onClick={() => navigate(-1)}
                                                >
                                                    {t("Annuler")}
                                                </Button>
                                                <Link
                                                    to="#"
                                                    type="submit"
                                                    className="btn btn-primary rounded-5"
                                                    style={{ borderRadius: "70px", padding: "10px 30px" }}
                                                >
                                                    {mode === "add" ? t("Enregistrer") : t("Mettre à jour")}
                                                </Link>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AvanceEtPretForm;