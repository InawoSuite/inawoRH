import React, { useState } from "react";
import { Row, Col, Card, CardBody, Container, Table, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Progress } from "reactstrap";
import { Link } from "react-router-dom";
import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import Pagination from "../../../../Components/Common/Pagination";
import { CustomSelect } from "../../../../Components/Common/CustomSelectStyles";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Evaluation = () => {
    const { t } = useTranslation();

    document.title = "Evaluation";

    // États généraux
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // États pour les modals
    const [viewModal, setViewModal] = useState(false);
    const [createModal, setCreateModal] = useState(false);
    const [quizModal, setQuizModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // États pour le formulaire de création
    const [formData, setFormData] = useState({
        mode: "",
        employes: [],
        responsable: "",
        modeEvaluation: "",
        dateEvaluation: "",
        titre: "",
        description: ""
    });

    // États pour le quiz
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timer, setTimer] = useState(3600); // 60 minutes en secondes
    const [quizStarted, setQuizStarted] = useState(false);
    const [answers, setAnswers] = useState({});

    // Options pour les selects
    const modeOptions = [
        { value: "employe", label: t("Par employé") },
        { value: "entreprise", label: t("Par entreprise") },
        { value: "departement", label: t("Par département") }
    ];

    const modeEvaluationOptions = [
        { value: "auto", label: t("Auto-évaluation") },
        { value: "manager", label: t("Évaluation par manager") },
        { value: "collaborateur", label: t("Évaluation par collaborateur") },
        { value: "360", label: t("Évaluation 360°") }
    ];

    // Données mockées pour les campagnes
    const [campagnesList, setCampagnesList] = useState([
        {
            id: 1,
            numero: "EVAL-2024-001",
            titre: "Évaluation annuelle 2024",
            mode: t("Par employé"),
            responsable: "Marie Martin",
            dateEvaluation: "2024-12-15",
            statut: "en_cours",
            progression: 45
        },
        {
            id: 2,
            numero: "EVAL-2024-002",
            titre: "Évaluation des compétences",
            mode: t("Par département"),
            responsable: "Jean Dupont",
            dateEvaluation: "2024-11-30",
            statut: "planifié",
            progression: 0
        },
        {
            id: 3,
            numero: "EVAL-2024-003",
            titre: "Feedback 360°",
            mode: t("Par entreprise"),
            responsable: "Sophie Bernard",
            dateEvaluation: "2024-10-20",
            statut: "terminé",
            progression: 100
        }
    ]);

    // Données mockées pour les questions du quiz
    const quizQuestions = [
        {
            id: 1,
            question: "Comment évaluez-vous la communication de l'employé ?",
            options: ["Excellent", "Bon", "Moyen", "À améliorer", "Insuffisant"],
            type: "choix_unique"
        },
        {
            id: 2,
            question: "L'employé atteint-il ses objectifs ?",
            options: ["Toujours", "Souvent", "Parfois", "Rarement", "Jamais"],
            type: "choix_unique"
        },
        {
            id: 3,
            question: "Compétences techniques à évaluer :",
            options: ["Expert", "Avancé", "Intermédiaire", "Débutant", "Non applicable"],
            type: "choix_unique"
        }
    ];

    // Fonctions pour les modals
    const toggleViewModal = (item = null) => {
        setSelectedItem(item);
        setViewModal(!viewModal);
    };

    const toggleCreateModal = () => {
        setCreateModal(!createModal);
        if (!createModal) {
            setFormData({
                mode: "",
                employes: [],
                responsable: "",
                modeEvaluation: "",
                dateEvaluation: "",
                titre: "",
                description: ""
            });
        }
    };

    const toggleQuizModal = (item = null) => {
        setSelectedItem(item);
        setQuizModal(!quizModal);
        if (!quizModal) {
            setCurrentQuestion(0);
            setTimer(3600);
            setQuizStarted(false);
            setAnswers({});
        }
    };

    const startQuiz = () => {
        setQuizStarted(true);
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({
            ...answers,
            [questionId]: answer
        });
    };

    const nextQuestion = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const submitQuiz = () => {
        toast.success("Évaluation soumise avec succès !");
        toggleQuizModal();
    };

    const handleCreateCampagne = (e) => {
        e.preventDefault();
        const newCampagne = {
            id: campagnesList.length + 1,
            numero: `EVAL-2024-${String(campagnesList.length + 1).padStart(3, '0')}`,
            titre: formData.titre,
            mode: modeOptions.find(opt => opt.value === formData.mode)?.label || "",
            responsable: formData.responsable,
            dateEvaluation: formData.dateEvaluation,
            statut: "planifié",
            progression: 0
        };
        setCampagnesList([...campagnesList, newCampagne]);
        toast.success("Campagne créée avec succès !");
        toggleCreateModal();
    };

    const getStatutBadge = (statut) => {
        switch (statut) {
            case 'en_cours':
                return <Badge className="badge bg-warning rounded-pill" pill>{t("En cours")}</Badge>;
            case 'planifié':
                return <Badge className="badge bg-info rounded-pill" pill>{t("Planifié")}</Badge>;
            case 'terminé':
                return <Badge className="badge bg-success rounded-pill" pill>{t("Terminé")}</Badge>;
            default:
                return <Badge className="badge bg-secondary rounded-pill" pill>{statut}</Badge>;
        }
    };

    const filteredData = campagnesList.filter((item) =>
        Object.values(item).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete) {
            setCampagnesList(campagnesList.filter(i => i.id !== itemToDelete.id));
            toast.success(t("Suppression effectuée avec succès"));
            setDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const handleDeleteClose = () => {
        setDeleteModal(false);
        setItemToDelete(null);
    };

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title={t("Évaluations")}
                    pageTitle={
                        <>
                            <i className="ri-bar-chart-grouped-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/"> {t("Tableau de Bord")} </Link>&nbsp;&gt;
                        </>
                    }
                />

                <Row>
                    <Col lg={12}>
                        <SearchAndActionBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            searchPlaceholder={t("Chercher une campagne...")}
                            showSearch={true}
                            addButtonLink="/:entreprise/evaluation-add"
                            addButtonText={t("Nouvelle campagne d'évaluation")}
                            addButtonIcon="ri-file-add-line"
                            showAddButton={true}
                            onAddClick={toggleCreateModal}
                            onExportClick={() => setIsExportCSV(true)}
                            exportButtonText={t("Exporter")}
                            exportButtonIcon="ri-file-upload-line"
                            showExportButton={true}
                        />
                    </Col>

                    <Col lg={12}>
                        <Card style={{ borderRadius: "20px", boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)" }}>
                            <CardBody>
                                <div className="table-responsive">
                                    <Table className="align-middle table-nowrap mb-0">
                                        <thead className="text-muted">
                                            <tr>
                                                <th>N°</th>
                                                <th>{t("Titre")}</th>
                                                <th>{t("Mode")}</th>
                                                <th>{t("Responsable")}</th>
                                                <th>{t("Date")}</th>
                                                <th>{t("Progression")}</th>
                                                <th>{t("Statut")}</th>
                                                <th>{t("Actions")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.length > 0 ? (
                                                filteredData.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <span className="fw-medium">{item.numero}</span>
                                                        </td>
                                                        <td>
                                                            <Link
                                                                to="#"
                                                                className="fw-medium"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    toggleViewModal(item);
                                                                }}
                                                            >
                                                                {item.titre}
                                                            </Link>
                                                        </td>
                                                        <td>{item.mode}</td>
                                                        <td>{item.responsable}</td>
                                                        <td>{formatDate(item.dateEvaluation)}</td>
                                                        <td style={{ minWidth: "120px" }}>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Progress
                                                                    value={item.progression}
                                                                    color={item.progression === 100 ? "success" : "primary"}
                                                                    style={{ height: "8px", width: "100px" }}
                                                                />
                                                                <span>{item.progression}%</span>
                                                            </div>
                                                        </td>
                                                        <td>{getStatutBadge(item.statut)}</td>
                                                        <td>
                                                            <div className="gap-1">
                                                                {item.statut === "planifié" && (
                                                                    <Link
                                                                        to="#"
                                                                        className="text-success p-2"
                                                                        title={t("Démarrer")}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            toggleQuizModal(item);
                                                                        }}
                                                                    >
                                                                        <i className="ri-play-fill fs-16"></i>
                                                                    </Link>
                                                                )}
                                                                {item.statut === "en_cours" && (
                                                                    <Link
                                                                        to="#"
                                                                        className="text-warning p-2"
                                                                        title={t("Continuer")}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            toggleQuizModal(item);
                                                                        }}
                                                                    >
                                                                        <i className="ri-refresh-line fs-16"></i>
                                                                    </Link>
                                                                )}
                                                                <Link
                                                                    to="#"
                                                                    className="text-info p-2"
                                                                    title={t("Voir détails")}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        toggleViewModal(item);
                                                                    }}
                                                                >
                                                                    <i className="ri-eye-fill fs-16"></i>
                                                                </Link>
                                                                <Link
                                                                    to="/:entreprise/evaluation-edit/:id"
                                                                    className="text-primary p-2"
                                                                    title={t("Modifier")}
                                                                >
                                                                    <i className="ri-pencil-fill fs-16"></i>
                                                                </Link>
                                                                <Link
                                                                    to="#"
                                                                    className="text-danger p-2"
                                                                    title={t("Supprimer")}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeleteClick(item);
                                                                    }}
                                                                >
                                                                    <i className="ri-delete-bin-5-fill fs-16"></i>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center py-5">
                                                        <div className="text-muted">
                                                            <i className="ri-inbox-line" style={{ fontSize: "3rem" }}></i>
                                                            <h5 className="mt-3">{t("Aucune campagne trouvée")}</h5>
                                                            <p className="mb-0">{t("Commencez par créer une nouvelle campagne")}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="mt-3">
                                    <Pagination
                                        data={filteredData}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        perPageData={itemsPerPage}
                                        alwaysShow={true}
                                        showInfo={true}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* MODAL DE CRÉATION DE CAMPAGNE */}
                <Modal
                    isOpen={createModal}
                    toggle={toggleCreateModal}
                    size="lg"
                    centered
                    contentClassName="rounded-4 border-0"
                >
                    <ModalHeader toggle={toggleCreateModal} className="border-0">
                        <i className="ri-megaphone-line me-2"></i>
                        {t("Nouvelle campagne d'évaluation")}
                    </ModalHeader>
                    <Form onSubmit={handleCreateCampagne}>
                        <ModalBody>
                            <Row>
                                <Col md={12}>
                                    <FormGroup className="mb-3">
                                        <Label>{t("Titre de la campagne")} <span className="text-danger">*</span></Label>
                                        <Input
                                            type="text"
                                            placeholder={t("Ex: Évaluation annuelle 2024")}
                                            value={formData.titre}
                                            onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                                            required
                                            className="rounded-4"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FormGroup className="mb-3">
                                        <Label>{t("Mode d'évaluation")} <span className="text-danger">*</span></Label>
                                        <CustomSelect
                                            options={modeOptions}
                                            value={modeOptions.find(opt => opt.value === formData.mode)}
                                            onChange={(opt) => setFormData({...formData, mode: opt.value})}
                                            placeholder={t("Sélectionner un mode")}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup className="mb-3">
                                        <Label>{t("Responsable")} <span className="text-danger">*</span></Label>
                                        <Input
                                            type="text"
                                            placeholder={t("Nom du responsable")}
                                            value={formData.responsable}
                                            onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                                            required
                                            className="rounded-4"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FormGroup className="mb-3">
                                        <Label>{t("Mode d'évaluation")} <span className="text-danger">*</span></Label>
                                        <CustomSelect
                                            options={modeEvaluationOptions}
                                            value={modeEvaluationOptions.find(opt => opt.value === formData.modeEvaluation)}
                                            onChange={(opt) => setFormData({...formData, modeEvaluation: opt.value})}
                                            placeholder={t("Sélectionner un mode")}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup className="mb-3">
                                        <Label>{t("Date d'évaluation")} <span className="text-danger">*</span></Label>
                                        <Input
                                            type="date"
                                            value={formData.dateEvaluation}
                                            onChange={(e) => setFormData({ ...formData, dateEvaluation: e.target.value })}
                                            required
                                            className="rounded-4"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <FormGroup className="mb-3">
                                        <Label>{t("Description")}</Label>
                                        <Input
                                            type="textarea"
                                            rows="3"
                                            placeholder={t("Description de la campagne...")}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="rounded-4"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter className="border-0 pb-4">
                            <Button
                                className="rounded-4"
                                color="secondary"
                                onClick={toggleCreateModal}
                            >
                                {t("Annuler")}
                            </Button>
                            <Button
                                className="rounded-4"
                                color="primary"
                                type="submit"
                            >
                                {t("Créer la campagne")}
                            </Button>
                        </ModalFooter>
                    </Form>
                </Modal>

                {/* MODAL QUIZ */}
                <Modal
                    isOpen={quizModal}
                    toggle={() => toggleQuizModal()}
                    size="lg"
                    centered
                    contentClassName="rounded-4 border-0"
                >
                    <ModalHeader toggle={() => toggleQuizModal()} className="border-0">
                        <div className="d-flex align-items-center justify-content-between w-100">
                            <div>
                                <i className="ri-questionnaire-line me-2"></i>
                                {selectedItem?.titre}
                            </div>
                            {quizStarted && (
                                <div className="ms-3 badge bg-warning rounded-pill p-2">
                                    <i className="ri-timer-line me-1"></i>
                                    {formatTime(timer)}
                                </div>
                            )}
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {!quizStarted ? (
                            <div className="text-center py-4">
                                <div className="avatar-lg mx-auto mb-4">
                                    <span className="avatar-title bg-primary bg-opacity-10 text-primary rounded-circle fs-1">
                                        <i className="ri-questionnaire-line"></i>
                                    </span>
                                </div>
                                <h4>{t("Prêt à commencer ?")}</h4>
                                <p className="text-muted mb-4">
                                    {t("Cette évaluation contient")} {quizQuestions.length} {t("questions").toLowerCase()}.<br />
                                    {t("Vous aurez 60 minutes pour la compléter.")}
                                </p>
                                <Button color="primary" onClick={startQuiz} size="lg" className="rounded-pill px-5">
                                    <i className="ri-play-fill me-2"></i>
                                    {t("Commencer l'évaluation")}
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>{t("Question")} {currentQuestion + 1}/{quizQuestions.length}</span>
                                        <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
                                    </div>
                                    <Progress
                                        value={((currentQuestion + 1) / quizQuestions.length) * 100}
                                        color="primary"
                                        style={{ height: "8px" }}
                                    />
                                </div>

                                <div className="mb-4">
                                    <h5 className="mb-3">{quizQuestions[currentQuestion].question}</h5>
                                    <div className="mt-3">
                                        {quizQuestions[currentQuestion].options.map((option, index) => (
                                            <div key={index} className="mb-2">
                                                <Label check className="d-block p-3 bg-light rounded-3">
                                                    <Input
                                                        type="radio"
                                                        name={`question_${quizQuestions[currentQuestion].id}`}
                                                        value={option}
                                                        checked={answers[quizQuestions[currentQuestion].id] === option}
                                                        onChange={() => handleAnswerChange(quizQuestions[currentQuestion].id, option)}
                                                        className="me-2"
                                                    />
                                                    {option}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <Button
                                        className="rounded-4"
                                        color="secondary"
                                        onClick={prevQuestion}
                                        disabled={currentQuestion === 0}
                                    >
                                        <i className="ri-arrow-left-line me-2"></i>
                                        {t("Précédent")}
                                    </Button>
                                    {currentQuestion < quizQuestions.length - 1 ? (
                                        <Button
                                            className="rounded-4"
                                            color="primary"
                                            onClick={nextQuestion}
                                            disabled={!answers[quizQuestions[currentQuestion].id]}
                                        >
                                            {t("Suivant")}
                                            <i className="ri-arrow-right-line ms-2"></i>
                                        </Button>
                                    ) : (
                                        <Button
                                            className="rounded-4"
                                            color="success"
                                            onClick={submitQuiz}
                                            disabled={!answers[quizQuestions[currentQuestion].id]}
                                        >
                                            <i className="ri-check-line me-2"></i>
                                            {t("Soumettre")}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </ModalBody>
                </Modal>

                {/* MODAL VOIR DÉTAILS */}
                <Modal
                    isOpen={viewModal}
                    toggle={() => toggleViewModal()}
                    size="md"
                    centered
                    contentClassName="rounded-4 border-0"
                >
                    <ModalHeader toggle={() => toggleViewModal()} className="border-0">
                        <i className="ri-eye-line me-2"></i>
                        {t("Détails de la campagne")}
                    </ModalHeader>
                    <ModalBody>
                        {selectedItem && (
                            <div>
                                <Row>
                                    <Col md={6}>
                                        <p><strong>N°:</strong> {selectedItem.numero}</p>
                                        <p><strong>{t("Titre")}:</strong> {selectedItem.titre}</p>
                                        <p><strong>{t("Mode")}:</strong> {selectedItem.mode}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>{t("Responsable")}:</strong> {selectedItem.responsable}</p>
                                        <p><strong>{t("Date")}:</strong> {formatDate(selectedItem.dateEvaluation)}</p>
                                        <p><strong>{t("Statut")}:</strong> {getStatutBadge(selectedItem.statut)}</p>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter className="border-0 pb-4">
                        <Button 
                            className="rounded-5"
                            color="secondary"
                            onClick={() => toggleViewModal()}
                        >
                            {t("Fermer")}
                        </Button>
                        <Link
                            to="/:entreprise/evaluation-edit/:id"
                            className="btn btn-primary rounded-5 px-4"
                            style={{ borderRadius: "70px" }}
                        >
                            {t("Modifier")}
                        </Link>
                    </ModalFooter>
                </Modal>

                {/* MODAL DE SUPPRESSION */}
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteConfirm}
                    onCloseClick={handleDeleteClose}
                />
            </Container>
        </div>
    );
};

export default Evaluation;