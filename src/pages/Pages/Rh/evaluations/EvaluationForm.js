import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Badge } from "reactstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { CustomSelect } from "../../../../Components/Common/CustomSelectStyles";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";

const EvaluationForm = ({ mode = "add" }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();

    // État du formulaire avec quizzes
    const [formData, setFormData] = useState({
        titre: "",
        mode: "",
        responsable: "",
        modeEvaluation: "",
        dateEvaluation: "",
        description: "",
        quizzes: []
    });

    // États pour les selects
    const [selectedMode, setSelectedMode] = useState(null);
    const [selectedModeEvaluation, setSelectedModeEvaluation] = useState(null);

    // Références pour Quill
    const quillRef = useRef(null);
    const [quill, setQuill] = useState(null);

    // Maps pour stocker les références Quill des quiz et questions
    const quizQuillRefs = useRef({});
    const questionQuillRefs = useRef({});
    const explicationQuillRefs = useRef({}); // NOUVEAU : pour les explications
    const [quizQuills, setQuizQuills] = useState({});
    const [questionQuills, setQuestionQuills] = useState({});
    const [explicationQuills, setExplicationQuills] = useState({}); // NOUVEAU

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

    const typeQuestionOptions = [
        { value: "choix_unique", label: t("Choix unique") },
        { value: "choix_multiple", label: t("Choix multiple") }
    ];

    // Initialisation de Quill pour la description principale
    useEffect(() => {
        if (!quillRef.current) return;

        const quillInstance = new Quill(quillRef.current, {
            placeholder: t("Rédigez la description de la campagne ici..."),
            theme: "snow",
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'header': [1, 2, 3, false] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
                ]
            }
        });

        setQuill(quillInstance);

        return () => { };
    }, []);

    // Initialisation dynamique des Quill pour les descriptions de quiz
    useEffect(() => {
        formData.quizzes.forEach((quiz, quizIndex) => {
            const refKey = `quiz-${quizIndex}`;
            if (quizQuillRefs.current[refKey] && !quizQuills[refKey]) {
                const quillInstance = new Quill(quizQuillRefs.current[refKey], {
                    placeholder: t("Description du quiz..."),
                    theme: "snow",
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['link'],
                            ['clean']
                        ]
                    }
                });

                setQuizQuills(prev => ({ ...prev, [refKey]: quillInstance }));

                if (quiz.description) {
                    quillInstance.clipboard.dangerouslyPasteHTML(quiz.description);
                }

                quillInstance.on('text-change', () => {
                    const html = quillInstance.root.innerHTML;
                    handleQuizChange(quizIndex, "description", html);
                });
            }
        });
    }, [formData.quizzes.length]);

    // Initialisation dynamique des Quill pour les énoncés de questions
    useEffect(() => {
        formData.quizzes.forEach((quiz, quizIndex) => {
            quiz.questions.forEach((question, questionIndex) => {
                const refKey = `question-${quizIndex}-${questionIndex}`;
                if (questionQuillRefs.current[refKey] && !questionQuills[refKey]) {
                    const quillInstance = new Quill(questionQuillRefs.current[refKey], {
                        placeholder: t("Énoncé de la question..."),
                        theme: "snow",
                        modules: {
                            toolbar: [
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['link'],
                                ['clean']
                            ]
                        }
                    });

                    setQuestionQuills(prev => ({ ...prev, [refKey]: quillInstance }));

                    if (question.enonce) {
                        quillInstance.clipboard.dangerouslyPasteHTML(question.enonce);
                    }

                    quillInstance.on('text-change', () => {
                        const html = quillInstance.root.innerHTML;
                        handleQuestionChange(quizIndex, questionIndex, "enonce", html);
                    });
                }
            });
        });
    }, [formData.quizzes.map(q => q.questions.length).join(',')]);

    // NOUVEAU : Initialisation dynamique des Quill pour les explications
    useEffect(() => {
        formData.quizzes.forEach((quiz, quizIndex) => {
            quiz.questions.forEach((question, questionIndex) => {
                const refKey = `explication-${quizIndex}-${questionIndex}`;
                if (explicationQuillRefs.current[refKey] && !explicationQuills[refKey]) {
                    const quillInstance = new Quill(explicationQuillRefs.current[refKey], {
                        placeholder: t("Explication de la réponse (optionnel)..."),
                        theme: "snow",
                        modules: {
                            toolbar: [
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['link'],
                                ['clean']
                            ]
                        }
                    });

                    setExplicationQuills(prev => ({ ...prev, [refKey]: quillInstance }));

                    if (question.explication) {
                        quillInstance.clipboard.dangerouslyPasteHTML(question.explication);
                    }

                    quillInstance.on('text-change', () => {
                        const html = quillInstance.root.innerHTML;
                        handleQuestionChange(quizIndex, questionIndex, "explication", html);
                    });
                }
            });
        });
    }, [formData.quizzes.map(q => q.questions.length).join(',')]);

    // Charger les données en mode édition
    useEffect(() => {
        if (mode === "edit" && id) {
            const mockData = {
                titre: "Évaluation annuelle 2024",
                mode: "employe",
                responsable: "Marie Martin",
                modeEvaluation: "manager",
                dateEvaluation: "2024-12-15",
                description: "<p>Évaluation des performances annuelles</p>",
                quizzes: [
                    {
                        titre: "Quiz Sécurité",
                        type: "choix_unique",
                        pourcentageRequis: 80,
                        description: "<p>Évaluation des règles de sécurité</p>",
                        questions: [
                            {
                                type: "choix_unique",
                                enonce: "<p>Quelle est la première règle de sécurité ?</p>",
                                explication: "<p>La sécurité avant tout !</p>",
                                image: null,
                                options: [
                                    { texte: "Porter un casque", isCorrect: true },
                                    { texte: "Courir dans les couloirs", isCorrect: false }
                                ]
                            },
                            {
                                type: "choix_unique",
                                enonce: "<p>Que faire en cas d'incendie ?</p>",
                                explication: "<p>Suivre la procédure d'urgence</p>",
                                image: null,
                                options: [
                                    { texte: "Courir vers la sortie", isCorrect: false },
                                    { texte: "Utiliser l'extincteur", isCorrect: true },
                                    { texte: "Appeler les pompiers", isCorrect: false }
                                ]
                            }
                        ]
                    },
                    {
                        titre: "Quiz Management",
                        type: "choix_unique",
                        pourcentageRequis: 75,
                        description: "<p>Évaluation des compétences managériales</p>",
                        questions: [
                            {
                                type: "choix_unique",
                                enonce: "<p>Qu'est-ce qu'un bon manager ?</p>",
                                explication: "<p>L'écoute est la clé</p>",
                                image: null,
                                options: [
                                    { texte: "Qui crie fort", isCorrect: false },
                                    { texte: "Qui écoute son équipe", isCorrect: true },
                                    { texte: "Qui travaille tout le temps", isCorrect: false }
                                ]
                            }
                        ]
                    }
                ]
            };
            setFormData(mockData);
            setSelectedMode(modeOptions.find(opt => opt.value === mockData.mode));
            setSelectedModeEvaluation(modeEvaluationOptions.find(opt => opt.value === mockData.modeEvaluation));
        }
    }, [mode, id]);

    // Mettre à jour le contenu de Quill quand formData.description change
    useEffect(() => {
        if (quill && formData.description && quill.root.innerHTML !== formData.description) {
            quill.clipboard.dangerouslyPasteHTML(formData.description);
        }
    }, [quill, formData.description]);

    // Gérer les changements de Quill (description principale)
    useEffect(() => {
        if (quill) {
            const handleTextChange = () => {
                const html = quill.root.innerHTML;
                setFormData(prev => ({
                    ...prev,
                    description: html
                }));
            };

            quill.on('text-change', handleTextChange);

            return () => {
                quill.off('text-change', handleTextChange);
            };
        }
    }, [quill]);

    // =============== GESTION DES QUIZZ ===============

    const addQuiz = () => {
        setFormData(prev => ({
            ...prev,
            quizzes: [
                ...prev.quizzes,
                {
                    titre: "",
                    type: t("Choix unique"),
                    pourcentageRequis: 80,
                    description: "",
                    questions: []
                }
            ]
        }));
    };

    const removeQuiz = (quizIndex) => {
        const updated = formData.quizzes.filter((_, index) => index !== quizIndex);
        setFormData(prev => ({
            ...prev,
            quizzes: updated
        }));
    };

    const handleQuizChange = (quizIndex, field, value) => {
        const updated = [...formData.quizzes];
        updated[quizIndex][field] = value;
        setFormData(prev => ({
            ...prev,
            quizzes: updated
        }));
    };

    // =============== GESTION DES QUESTIONS ===============

    const addQuestion = (quizIndex) => {
        const updated = [...formData.quizzes];
        updated[quizIndex].questions.push({
            type: t("Choix unique"),
            enonce: "",
            explication: "",
            image: null,
            options: [
                { texte: "", isCorrect: false },
                { texte: "", isCorrect: false }
            ]
        });

        setFormData(prev => ({
            ...prev,
            quizzes: updated
        }));
    };

    const removeQuestion = (quizIndex, questionIndex) => {
        const updated = [...formData.quizzes];
        updated[quizIndex].questions = updated[quizIndex].questions.filter((_, index) => index !== questionIndex);
        setFormData(prev => ({
            ...prev,
            quizzes: updated
        }));
    };

    const handleQuestionChange = (quizIndex, questionIndex, field, value) => {
        const updated = [...formData.quizzes];
        updated[quizIndex].questions[questionIndex][field] = value;
        setFormData(prev => ({
            ...prev,
            quizzes: updated
        }));
    };

    const handleImageUpload = (quizIndex, questionIndex, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleQuestionChange(quizIndex, questionIndex, "image", reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // =============== GESTION DES OPTIONS ===============

    const addOption = (quizIndex, questionIndex) => {
        const updated = [...formData.quizzes];
        updated[quizIndex].questions[questionIndex].options.push({
            texte: "",
            isCorrect: false
        });

        setFormData(prev => ({
            ...prev,
            quizzes: updated
        }));
    };

    const removeOption = (quizIndex, questionIndex, optionIndex) => {
        const updated = [...formData.quizzes];
        updated[quizIndex].questions[questionIndex].options =
            updated[quizIndex].questions[questionIndex].options.filter((_, index) => index !== optionIndex);
        setFormData(prev => ({
            ...prev,
            quizzes: updated
        }));
    };

    const handleOptionChange = (quizIndex, questionIndex, optionIndex, value) => {
        const updated = [...formData.quizzes];
        updated[quizIndex].questions[questionIndex].options[optionIndex].texte = value;
        setFormData(prev => ({
            ...prev,
            quizzes: updated
        }));
    };

    const setCorrectOption = (quizIndex, questionIndex, optionIndex) => {
        const updated = [...formData.quizzes];
        const options = updated[quizIndex].questions[questionIndex].options;

        options.forEach((opt, idx) => {
            opt.isCorrect = idx === optionIndex;
        });

        setFormData(prev => ({
            ...prev,
            quizzes: updated
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name, option) => {
        setFormData(prev => ({
            ...prev,
            [name]: option?.value || ""
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(t("Données soumises:"), JSON.stringify(formData, null, 2));
        alert(t("Formulaire soumis ! Voir la console pour les données."));
    };

    const cardStyle = {
        borderRadius: "20px",
        background: "#fff",
        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    };

    document.title = mode === "add" ? t("Ajouter une campagne d'évaluation") : t("Modifier la campagne d'évaluation");

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title={mode === "add" ? t("Ajouter une campagne d'évaluation") : t("Modifier la campagne d'évaluation")}
                    pageTitle={
                        <>
                            <i className="ri-bar-chart-grouped-line"></i>
                            & nbsp;& gt;& nbsp; <Link to="/">{t("Tableau de Bord")}</Link>
                            & nbsp;& gt;& nbsp; <Link to="/evaluation">{t("Évaluations")}</Link> & nbsp;& gt;& nbsp;
                        </>
                    }
                />

                < Row >
                    <Col lg={12}>
                        <Card className="border-0" style={cardStyle}>
                            <CardBody className="p-4">
                                <h5 className="mb-4">
                                    {mode === "add" ? t("Nouvelle campagne d'évaluation") : t("Modification de la campagne")}
                                </h5 >

                                <Form onSubmit={handleSubmit}>
                                    {/* ========== INFOS GÉNÉRALES ========== */}
                                    <Row>
                                        <Col md={12}>
                                            <FormGroup className="mb-3">
                                                <Label for="titre">
                                                    {t("Titre de la campagne")} <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="titre"
                                                    className="rounded-4"
                                                    name="titre"
                                                    type="text"
                                                    placeholder={t("Ex: Évaluation annuelle 2024")}
                                                    value={formData.titre}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="mode">
                                                    {t("Mode d'évaluation")} <span className="text-danger">*</span>
                                                </Label>
                                                <CustomSelect
                                                    inputId="mode"
                                                    value={selectedMode}
                                                    onChange={(option) => {
                                                        setSelectedMode(option);
                                                        handleSelectChange("mode", option);
                                                    }}
                                                    options={modeOptions}
                                                    placeholder={t("Sélectionner un mode")}
                                                    className="rounded-4"
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="responsable">
                                                    {t("Responsable")} <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="responsable"
                                                    className="rounded-4"
                                                    name="responsable"
                                                    type="text"
                                                    placeholder={t("Nom du responsable")}
                                                    value={formData.responsable}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="modeEvaluation">
                                                    {t("Type d'évaluation")} <span className="text-danger">*</span>
                                                </Label>
                                                <CustomSelect
                                                    inputId="modeEvaluation"
                                                    value={selectedModeEvaluation}
                                                    onChange={(option) => {
                                                        setSelectedModeEvaluation(option);
                                                        handleSelectChange("modeEvaluation", option);
                                                    }}
                                                    options={modeEvaluationOptions}
                                                    placeholder={t("Sélectionner le type")}
                                                    className="rounded-4"
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="dateEvaluation">
                                                    {t("Date d'évaluation")} <span className="text-danger">*</span>
                                                </Label>
                                                <Input
                                                    id="dateEvaluation"
                                                    className="rounded-4"
                                                    name="dateEvaluation"
                                                    type="date"
                                                    value={formData.dateEvaluation}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    {/* Description principale */}
                                    <Row>
                                        <Col md={12}>
                                            <FormGroup className="mb-4">
                                                <Label for="description">
                                                    {t("Description de la campagne")}
                                                </Label>
                                                <div
                                                    className="snow-editor"
                                                    style={{
                                                        border: '1px solid #ced4da',
                                                        borderRadius: '20px',
                                                        background: '#fff',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <div ref={quillRef} style={{ minHeight: '150px' }} />
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    {/* ========== SECTION QUIZZES ========== */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0">{t("Quizzes")}</h5>
                                            <Button color="primary" onClick={addQuiz} className="rounded-4">
                                                {t("Ajouter un quiz")}
                                            </Button>
                                        </div>

                                        {formData.quizzes.length === 0 && (
                                            <p className="text-muted text-center py-4 bg-light rounded-4">
                                                {t("Aucun quiz ajouté. Cliquez sur \"Ajouter un quiz\" pour commencer.")}
                                            </p>
                                        )}

                                        {formData.quizzes.map((quiz, quizIndex) => (
                                            <Card key={quizIndex} className="mb-4 border-0 shadow-sm rounded-4">
                                                <CardBody>
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h6 className="mb-0">{t("Quiz")} {quizIndex + 1}</h6>
                                                        <Badge color="danger" pill className="p-2" style={{ cursor: "pointer" }} onClick={() => removeQuiz(quizIndex)}>
                                                            <i className="ri-delete-bin-line"></i>
                                                        </Badge>
                                                    </div>

                                                    <Row>
                                                        <Col md={4}>
                                                            <FormGroup className="mb-3">
                                                                <Label>{t("Titre du quiz")}</Label>
                                                                <Input
                                                                    className="rounded-4"
                                                                    value={quiz.titre}
                                                                    onChange={(e) => handleQuizChange(quizIndex, "titre", e.target.value)}
                                                                    placeholder="Ex: Quiz Sécurité"
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup className="mb-3">
                                                                <Label>{t("Type")}</Label>
                                                                <CustomSelect
                                                                    value={typeQuestionOptions.find(opt => opt.value === quiz.type)}
                                                                    onChange={(opt) => handleQuizChange(quizIndex, "type", opt.value)}
                                                                    options={typeQuestionOptions}
                                                                    placeholder={t("Sélectionner le type")}
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup className="mb-3">
                                                                <Label>{t("% requis")}</Label>
                                                                <Input
                                                                    type="number"
                                                                    className="rounded-4"
                                                                    value={quiz.pourcentageRequis}
                                                                    onChange={(e) => handleQuizChange(quizIndex, "pourcentageRequis", parseInt(e.target.value))}
                                                                    min="0"
                                                                    max="100"
                                                                />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    {/* Description du quiz avec Quill */}
                                                    <FormGroup className="mb-3">
                                                        <Label>Description du quiz</Label>
                                                        <div
                                                            className="snow-editor"
                                                            style={{
                                                                border: '1px solid #ced4da',
                                                                borderRadius: '20px',
                                                                background: '#fff',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            <div
                                                                ref={el => quizQuillRefs.current[`quiz-${quizIndex}`] = el}
                                                                style={{ minHeight: '100px' }}
                                                            />
                                                        </div>
                                                    </FormGroup >

                                                    {/* ========== QUESTIONS ========== */}
                                                    < div className="mt-4" >
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <h6 className="mb-0">{t("Questions")}</h6>
                                                            <Button color="success" size="sm" onClick={() => addQuestion(quizIndex)} className="rounded-4">
                                                                {t("Ajouter une question")}
                                                            </Button>
                                                        </div>

                                                        {
                                                            quiz.questions.map((question, questionIndex) => (
                                                                <Card key={questionIndex} className="mb-3 border-0 bg-light rounded-4">
                                                                    <CardBody>
                                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                                            <h6 className="mb-0">{t("Question")} {questionIndex + 1}</h6>
                                                                            <Badge color="danger" pill style={{ cursor: "pointer" }} onClick={() => removeQuestion(quizIndex, questionIndex)}>
                                                                                <i className="ri-delete-bin-line"></i>
                                                                            </Badge>
                                                                        </div>

                                                                        <Row>
                                                                            <Col md={12}>
                                                                                <FormGroup className="mb-3">
                                                                                    <Label>{t("Type de question")}</Label>
                                                                                    <CustomSelect
                                                                                        value={typeQuestionOptions.find(opt => opt.value === question.type)}
                                                                                        onChange={(opt) => handleQuestionChange(quizIndex, questionIndex, "type", opt.value)}
                                                                                        options={typeQuestionOptions}
                                                                                        placeholder={t("Type de question")}
                                                                                    />
                                                                                </FormGroup>
                                                                            </Col>
                                                                        </Row>

                                                                        {/* Énoncé de la question avec Quill */}
                                                                        <FormGroup className="mb-3">
                                                                            <Label>Énoncé de la question</Label>
                                                                            <div
                                                                                className="snow-editor"
                                                                                style={{
                                                                                    border: '1px solid #ced4da',
                                                                                    borderRadius: '20px',
                                                                                    background: '#fff',
                                                                                    overflow: 'hidden'
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    ref={el => questionQuillRefs.current[`question-${quizIndex}-${questionIndex}`] = el}
                                                                                    style={{ minHeight: '100px' }}
                                                                                />
                                                                            </div>
                                                                        </FormGroup >

                                                                        {/* ========== CHAMP IMAGE ========== */}
                                                                        < div className="mb-3" >
                                                                            <Label>{t("Image (optionnel)")}</Label>
                                                                            <div className="d-flex align-items-center gap-3">
                                                                                <div
                                                                                    className="border rounded-4 d-flex align-items-center justify-content-center bg-light"
                                                                                    style={{
                                                                                        width: '60px',
                                                                                        height: '60px',
                                                                                        border: '1px dashed #ced4da',
                                                                                        cursor: 'pointer',
                                                                                        overflow: 'hidden'
                                                                                    }}
                                                                                    onClick={() => document.getElementById(`image-upload-${quizIndex}-${questionIndex}`).click()}
                                                                                >
                                                                                    {question.image ? (
                                                                                        <img
                                                                                            src={question.image}
                                                                                            alt="aperçu"
                                                                                            style={{
                                                                                                width: '100%',
                                                                                                height: '100%',
                                                                                                objectFit: 'cover'
                                                                                            }}
                                                                                        />
                                                                                    ) : (
                                                                                        <i className="ri-image-add-line fs-3 text-muted"></i>
                                                                                    )}
                                                                                </div>

                                                                                <Input
                                                                                    id={`image-upload-${quizIndex}-${questionIndex}`}
                                                                                    type="file"
                                                                                    accept="image/*"
                                                                                    onChange={(e) => handleImageUpload(quizIndex, questionIndex, e)}
                                                                                    className="d-none"
                                                                                />

                                                                                <div className="flex-grow-1">
                                                                                    <div className="d-flex gap-2">
                                                                                        <Button
                                                                                            type="button"
                                                                                            color="primary"
                                                                                            outline
                                                                                            size="sm"
                                                                                            className="rounded-4"
                                                                                            onClick={() => document.getElementById(`image-upload-${quizIndex}-${questionIndex}`).click()}
                                                                                        >
                                                                                            <i className="ri-upload-2-line me-1"></i>
                                                                                            {t("Parcourir")}
                                                                                        </Button>

                                                                                        {question.image && (
                                                                                            <Button
                                                                                                type="button"
                                                                                                color="danger"
                                                                                                outline
                                                                                                size="sm"
                                                                                                className="rounded-4"
                                                                                                onClick={() => handleQuestionChange(quizIndex, questionIndex, "image", null)}
                                                                                            >
                                                                                                <i className="ri-delete-bin-line me-1"></i>
                                                                                                {t("Supprimer")}
                                                                                            </Button>
                                                                                        )}
                                                                                    </div>
                                                                                    <small className="text-muted d-block mt-1">
                                                                                        {t("JPG, PNG ou GIF (max. 2MB)")}
                                                                                    </small>
                                                                                </div>
                                                                            </div>
                                                                        </div >

                                                                        {/* ========== OPTIONS ========== */}
                                                                        < div className="mt-3" >
                                                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                                                <Label className="mb-0 fw-bold">Options</Label>
                                                                                <Button
                                                                                    color="primary"
                                                                                    size="sm"
                                                                                    onClick={() => addOption(quizIndex, questionIndex)}
                                                                                    className="rounded-4 px-3"
                                                                                    style={{ backgroundColor: '#405189', borderColor: '#405189' }}
                                                                                >
                                                                                    <i className="ri-add-line me-1"></i>
                                                                                    {t("Ajouter une option")}
                                                                                </Button>
                                                                            </div >

                                                                            <div className="options-container">
                                                                                {question.options.map((option, optionIndex) => (
                                                                                    <div
                                                                                        key={optionIndex}
                                                                                        className="d-flex align-items-center mb-4 pb-2"
                                                                                        style={{
                                                                                            borderBottom: '1px dashed #e0e0e0',
                                                                                            transition: 'all 0.2s'
                                                                                        }}
                                                                                    >
                                                                                        {/* Sélecteur : Radio pour choix unique, Checkbox pour choix multiple */}
                                                                                        <div className="me-3">
                                                                                            {question.type === 'choix_unique' ? (
                                                                                                // Bouton radio pour choix unique
                                                                                                <div
                                                                                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                                                                                    style={{
                                                                                                        width: '22px',
                                                                                                        height: '22px',
                                                                                                        border: `2px solid ${option.isCorrect ? '#405189' : '#adb5bd'}`,
                                                                                                        backgroundColor: option.isCorrect ? '#405189' : 'transparent',
                                                                                                        cursor: 'pointer',
                                                                                                        transition: 'all 0.2s'
                                                                                                    }}
                                                                                                    onClick={() => setCorrectOption(quizIndex, questionIndex, optionIndex)}
                                                                                                >
                                                                                                    {option.isCorrect && (
                                                                                                        <i className="ri-check-line text-white" style={{ fontSize: '14px' }}></i>
                                                                                                    )}
                                                                                                </div>
                                                                                            ) : (
                                                                                                // Checkbox pour choix multiple
                                                                                                <div
                                                                                                    className="rounded d-flex align-items-center justify-content-center"
                                                                                                    style={{
                                                                                                        width: '22px',
                                                                                                        height: '22px',
                                                                                                        border: `2px solid ${option.isCorrect ? '#405189' : '#adb5bd'}`,
                                                                                                        backgroundColor: option.isCorrect ? '#405189' : 'transparent',
                                                                                                        cursor: 'pointer',
                                                                                                        transition: 'all 0.2s',
                                                                                                        borderRadius: '4px'
                                                                                                    }}
                                                                                                    onClick={() => {
                                                                                                        const updated = [...formData.quizzes];
                                                                                                        updated[quizIndex].questions[questionIndex].options[optionIndex].isCorrect = !option.isCorrect;
                                                                                                        setFormData(prev => ({
                                                                                                            ...prev,
                                                                                                            quizzes: updated
                                                                                                        }));
                                                                                                    }}
                                                                                                >
                                                                                                    {option.isCorrect && (
                                                                                                        <i className="ri-check-line text-white" style={{ fontSize: '14px' }}></i>
                                                                                                    )}
                                                                                                </div>
                                                                                            )}
                                                                                        </div>

                                                                                        {/* Champ de texte avec bordure inférieure seulement */}
                                                                                        <div className="flex-grow-1 me-2 position-relative">
                                                                                            <Input
                                                                                                className="border-0 px-0 bg-transparent"
                                                                                                value={option.texte}
                                                                                                onChange={(e) => handleOptionChange(quizIndex, questionIndex, optionIndex, e.target.value)}
                                                                                                placeholder={`Option ${optionIndex + 1}`}
                                                                                                style={{
                                                                                                    padding: '8px 0',
                                                                                                    fontSize: '1rem',
                                                                                                    boxShadow: 'none',
                                                                                                    outline: 'none',
                                                                                                    borderRadius: 0,
                                                                                                    borderBottom: '1px solid #dee2e6'
                                                                                                }}
                                                                                                onFocus={(e) => e.target.style.borderBottomColor = '#405189'}
                                                                                                onBlur={(e) => e.target.style.borderBottomColor = '#dee2e6'}
                                                                                            />
                                                                                        </div>

                                                                                        {/* Bouton de suppression (si plus de 2 options) */}
                                                                                        {question.options.length > 2 && (
                                                                                            <div
                                                                                                className="d-flex align-items-center justify-content-center text-danger"
                                                                                                style={{
                                                                                                    width: '32px',
                                                                                                    height: '32px',
                                                                                                    cursor: 'pointer',
                                                                                                    transition: 'all 0.2s',
                                                                                                    borderRadius: '50%'
                                                                                                }}
                                                                                                onClick={() => removeOption(quizIndex, questionIndex, optionIndex)}
                                                                                                title={t("Supprimer cette option")}
                                                                                            >
                                                                                                <i className="ri-close-line" style={{ fontSize: '20px' }}></i>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>

                                                                            {/* Indication visuelle */}
                                                                            {
                                                                                question.options.length === 2 && (
                                                                                    <div className="text-muted small mt-2 d-flex align-items-center">
                                                                                        <i className="ri-information-line me-1"></i>
                                                                                        <span>
                                                                                            {
                                                                                                question.type === 'choix_unique'
                                                                                                    ? "Cliquez sur le bouton radio pour définir la bonne réponse. Ajoutez plus d'options si nécessaire."
                                                                                                    : "Cochez les cases pour définir les bonnes réponses. Ajoutez plus d'options si nécessaire."
                                                                                            }
                                                                                        </span >
                                                                                    </div >
                                                                                )
                                                                            }
                                                                        </div >

                                                                        {/* ========== EXPLICATION ========== */}
                                                                        < FormGroup className="mt-3" >
                                                                            <Label>Explication (optionnel)</Label>
                                                                            <div
                                                                                className="snow-editor"
                                                                                style={{
                                                                                    border: '1px solid #ced4da',
                                                                                    borderRadius: '20px',
                                                                                    background: '#fff',
                                                                                    overflow: 'hidden'
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    ref={el => explicationQuillRefs.current[`explication-${quizIndex}-${questionIndex}`] = el}
                                                                                    style={{ minHeight: '100px' }}
                                                                                />
                                                                            </div>
                                                                        </FormGroup >
                                                                    </CardBody >
                                                                </Card >
                                                            ))}
                                                    </div >
                                                </CardBody >
                                            </Card >
                                        ))}
                                    </div >

                                    {/* Boutons */}
                                    < Row className="mt-4" >
                                        <Col md={12}>
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button
                                                    className="btn btn-light rounded-4"
                                                    type="button"
                                                    style={{ borderRadius: "20px", padding: "10px 30px" }}
                                                    onClick={() => navigate("/:entreprise/evaluation")}
                                                >
                                                    {t("Annuler")}
                                                </Button>
                                                <Button
                                                    className="btn btn-success rounded-4"
                                                    type="submit"
                                                    style={{ borderRadius: "20px", padding: "10px 30px" }}
                                                >
                                                    {mode === "add" ? t("Créer la campagne") : t("Mettre à jour")}
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row >
                                </Form >
                            </CardBody >
                        </Card >
                    </Col >
                </Row >
            </Container >
        </div >
    );
};

export default EvaluationForm;