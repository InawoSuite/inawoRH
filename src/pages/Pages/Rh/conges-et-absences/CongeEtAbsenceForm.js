import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { CustomSelect } from "../../../../Components/Common/CustomSelectStyles";
import { useTranslation } from "react-i18next";

const CongeEtAbsenceForm = ({ mode = "add" }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        nomEmploye: "",
        dateDemande: "",
        periodeDebut: "",
        periodeFin: "",
        nombreJour: "",
        statut: "envoyé",
        nombreJourTotal: ""
    });

    useEffect(() => {
        if (mode === "edit" && id) {
            const mockData = {
                nomEmploye: "Jean Dupont",
                dateDemande: "2024-06-15",
                periodeDebut: "2024-07-01",
                periodeFin: "2024-07-15",
                nombreJour: 15,
                statut: "envoyé",
                nombreJourTotal: 25
            };
            setFormData(mockData);
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
        navigate("/:entreprise/conge-et-absence");
    };

    const cardStyle = {
        borderRadius: "20px",
        background: "#fff",
        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    };

    const [selectedStatut, setSelectedStatut] = useState(null);
    const statutOptions = [
        { value: "envoyé", label: t("Envoyé") },
        { value: "validé", label: t("Validé") }
    ];

    document.title = mode === "add" ? t("Ajouter Congé/Absence") : t("Modifier Congé/Absence");

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title={mode === "add" ? t("Ajouter un congé/absence") : t("Modifier le congé/absence")}
                    pageTitle={
                        <>
                            <i className="ri-calendar-check-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>
                            &nbsp;&gt;&nbsp;<Link to="/:entreprise/presence-et-absence">{t("Présence et Absences")}</Link>&nbsp;&gt;&nbsp;
                        </>
                    }
                />

                <Row>
                    <Col lg={12}>
                        <Card className="border-0" style={cardStyle}>
                            <CardBody className="p-4">
                                <h5 className="mb-4">
                                    {mode === "add" ? t("Nouveau congé/absence") : t("Modification congé/absence")}
                                </h5>

                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="nomEmploye">
                                                    {t("Nom employé")} <span className="text-danger">*</span>
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
                                                <Label for="dateDemande">
                                                    {t("Date de la demande")} <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="dateDemande"
                                                    className="rounded-4"
                                                    name="dateDemande"
                                                    type="date"
                                                    value={formData.dateDemande}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="periodeDebut">
                                                    {t("Date début")} <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="periodeDebut"
                                                    className="rounded-4"
                                                    name="periodeDebut"
                                                    type="date"
                                                    value={formData.periodeDebut}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="periodeFin">
                                                    {t("Date fin")} <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="periodeFin"
                                                    className="rounded-4"
                                                    name="periodeFin"
                                                    type="date"
                                                    value={formData.periodeFin}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={4}>
                                            <FormGroup className="mb-3">
                                                <Label for="nombreJour">
                                                    {t("Nombre de jour")} <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="nombreJour"
                                                    className="rounded-4"
                                                    name="nombreJour"
                                                    type="number"
                                                    placeholder={t("Ex: 15")}
                                                    value={formData.nombreJour}
                                                    onChange={handleChange}
                                                    min="1"
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md={4}>
                                            <FormGroup className="mb-3">
                                                <Label htmlFor="statut">
                                                    {t("Statut")} <span className="text-danger">*</span>
                                                </Label>
                                                <CustomSelect
                                                    inputId="statut"
                                                    value={statutOptions.find(option => option.value === formData.statut)}
                                                    onChange={(option) => {
                                                        setSelectedStatut(option);
                                                        handleChange({
                                                            target: {
                                                                name: "statut",
                                                                value: option.value
                                                            }
                                                        });
                                                    }}
                                                    options={statutOptions}
                                                    isDisabled={mode === "add"}
                                                    placeholder={t("Sélectionner un statut")}
                                                    className="rounded-4"
                                                />
                                                {mode === "add" && (
                                                    <small className="text-muted">{t("Le statut sera automatiquement \"Envoyé\"")}</small>
                                                )}
                                            </FormGroup>
                                        </Col>

                                        <Col md={4}>
                                            <FormGroup className="mb-3">
                                                <Label for="nombreJourTotal">
                                                    {t("Nombre de jour total")} <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="nombreJourTotal"
                                                    className="rounded-4"
                                                    name="nombreJourTotal"
                                                    type="number"
                                                    placeholder={t("Ex: 25")}
                                                    value={formData.nombreJourTotal}
                                                    onChange={handleChange}
                                                    min="0"
                                                    required
                                                />
                                                <small className="text-muted">{t("Total de jours disponibles")}</small>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row className="mt-4">
                                        <Col md={12}>
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button
                                                    className="btn btn-light rounded-4"
                                                    type="button"
                                                    style={{ borderRadius: "20px", padding: "10px 30px" }}
                                                    onClick={() => navigate(-1)}
                                                >
                                                    {t("Annuler")}
                                                </Button>
                                                <Button
                                                    className="btn btn-success rounded-4"
                                                    type="submit"
                                                    style={{ borderRadius: "20px", padding: "10px 30px" }}
                                                >
                                                    {mode === "add" ? t("Enregistrer") : t("Mettre à jour")}
                                                </Button>
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

export default CongeEtAbsenceForm;