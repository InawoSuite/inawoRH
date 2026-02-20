import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

// Données mockées pour l'exemple (à remplacer par votre API)
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
    const { id } = useParams(); // Récupère l'ID depuis l'URL si on est en mode edit
    
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

    // Charger les données si on est en mode édition
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
        // Ici, vous enverriez les données à votre API
        navigate("/avance-et-pret");
    };

    const cardStyle = {
        borderRadius: "20px",
        background: "#fff",
        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    };

    document.title = mode === "add" ? "Ajouter Avance/Prêt" : "Modifier Avance/Prêt";

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title={mode === "add" ? "Ajouter une avance/prêt" : "Modifier l'avance/prêt"}
                    pageTitle={
                        <>
                            <i className="ri-money-dollar-circle-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>
                            &nbsp;&gt;&nbsp;<Link to="/avance-et-pret">Avance et Prêt</Link>&nbsp;&gt;&nbsp;
                        </>
                    }
                />
                
                <Row>
                    <Col lg={12}>
                        <Card className="border-0" style={cardStyle}>
                            <CardBody className="p-4">
                                <h5 className="mb-4">
                                    {mode === "add" ? "Nouvelle avance/prêt" : "Modification avance/prêt"}
                                </h5>
                                
                                <Form onSubmit={handleSubmit}>
                                    {/* Informations de base (toujours visibles) */}
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="nomEmploye">
                                                    Nom de l'employé <span className="text-danger">*</span>
                                                </Label>
                                                <Input 
                                                    id="nomEmploye"
                                                    className="rounded-4"
                                                    name="nomEmploye" 
                                                    type="text" 
                                                    placeholder="Ex: Jean Dupont" 
                                                    value={formData.nomEmploye}
                                                    onChange={handleChange}
                                                    required 
                                                />
                                            </FormGroup>
                                        </Col>
                                        
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="salaireNet">
                                                    Salaire net (FCFA) <span className="text-danger">*</span>
                                                </Label>
                                                <Input 
                                                    id="salaireNet"
                                                    className="rounded-4"
                                                    name="salaireNet" 
                                                    type="number" 
                                                    placeholder="Ex: 250000" 
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
                                                    Montant du prêt (FCFA) <span className="text-danger">*</span>
                                                </Label>
                                                <Input 
                                                    id="montantPret"
                                                    className="rounded-4"
                                                    name="montantPret" 
                                                    type="number" 
                                                    placeholder="Ex: 50000" 
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
                                                    Période <span className="text-danger">*</span>
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
                                                    Date de remboursement <span className="text-danger">*</span>
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

                                    {/* Champs supplémentaires pour l'édition */}
                                    {mode === "edit" && (
                                        <>
                                            <h6 className="text-primary mt-4 mb-3">Informations de suivi</h6>
                                            <Row>
                                                <Col md={4}>
                                                    <FormGroup className="mb-3">
                                                        <Label for="montantRembourse">
                                                            Montant remboursé (FCFA)
                                                        </Label>
                                                        <Input 
                                                            id="montantRembourse"
                                                            className="rounded-4"
                                                            name="montantRembourse" 
                                                            type="number" 
                                                            placeholder="Ex: 20000" 
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
                                                            Solde restant (FCFA)
                                                        </Label>
                                                        <Input 
                                                            id="solde"
                                                            className="rounded-4"
                                                            name="solde" 
                                                            type="number" 
                                                            placeholder="Ex: 30000" 
                                                            value={formData.solde}
                                                            onChange={handleChange}
                                                            step="1000"
                                                            min="0"
                                                            readOnly={mode === "edit"} // Optionnel : calculé automatiquement
                                                        />
                                                        <small className="text-muted">Montant prêt - Montant remboursé</small>
                                                    </FormGroup>
                                                </Col>
                                                
                                                <Col md={4}>
                                                    <FormGroup className="mb-3">
                                                        <Label for="statut">
                                                            Statut
                                                        </Label>
                                                        <Input 
                                                            id="statut"
                                                            className="rounded-4"
                                                            name="statut" 
                                                            type="select"
                                                            value={formData.statut}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="actif">Actif</option>
                                                            <option value="payé">Payé</option>
                                                            <option value="dépassé">Dépassé</option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </>
                                    )}

                                    <Row className="mt-4">
                                        <Col md={12}>
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button
                                                    color="secondary"
                                                    type="button"
                                                    style={{ borderRadius: "20px", padding: "10px 30px" }}
                                                    onClick={() => navigate("/avance-et-pret")}
                                                >
                                                    Annuler
                                                </Button>
                                                <Button
                                                    color="primary"
                                                    type="submit"
                                                    style={{ borderRadius: "20px", padding: "10px 30px" }}
                                                >
                                                    {mode === "add" ? "Enregistrer" : "Mettre à jour"}
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

export default AvanceEtPretForm;