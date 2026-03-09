import React, { useMemo, useState, useRef, useEffect } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Form,
    Input,
    Label,
    Row,
    FormGroup,
    Button,
} from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { CustomSelect } from "../../../../Components/Common/CustomSelectStyles";
import Flatpickr from "react-flatpickr";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OffreAdd = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    // États pour les selects
    const [selectedJobCategory, setSelectedJobCategory] = useState(null);
    const [selectedJobType, setSelectedJobType] = useState(null);
    const [selectedExperience, setSelectedExperience] = useState(null);

    // Référence pour Quill des tags
    const tagsQuillRef = useRef(null);
    const [tagsQuill, setTagsQuill] = useState(null);
    const [tags, setTags] = useState("");

    // État pour la description avec Quill
    const [description, setDescription] = useState("");
    const quillRef = useRef(null);
    const [quill, setQuill] = useState(null);

    // Options pour les selects (traduites en français)
    const jobCategoryOptions = useMemo(
        () => [
            { value: "Accounting & Finance", label: t("Comptabilité & Finance") },
            { value: "Purchasing Manager", label: t("Acheteur / Responsable achats") },
            { value: "Education & training", label: t("Éducation & Formation") },
            { value: "Marketing & Advertising", label: t("Marketing & Publicité") },
            { value: "It / Software Jobs", label: t("IT / Développement logiciel") },
            { value: "Digital Marketing", label: t("Marketing digital") },
            { value: "Administrative Officer", label: t("Agent administratif") },
            { value: "Government Jobs", label: t("Fonction publique") },
        ],
        [t]
    );

    const jobTypeOptions = useMemo(
        () => [
            { value: "Full Time", label: t("Temps plein") },
            { value: "Part Time", label: t("Temps partiel") },
            { value: "Freelance", label: t("Freelance") },
            { value: "Intership", label: t("Stage") },
        ],
        [t]
    );

    const experienceOptions = useMemo(
        () => [
            { value: "0 Year", label: t("0 an") },
            { value: "2 Years", label: t("2 ans") },
            { value: "3 Years", label: t("3 ans") },
            { value: "4 Years", label: t("4 ans") },
            { value: "5 Years", label: t("5 ans") },
        ],
        [t]
    );

    // Initialisation de Quill
    useEffect(() => {
        if (!quillRef.current) return;

        const quillInstance = new Quill(quillRef.current, {
            placeholder: t("Description détaillée de l'offre d'emploi..."),
            theme: "snow",
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'header': [1, 2, 3, false] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['link'],
                    ['clean']
                ]
            }
        });

        setQuill(quillInstance);

        return () => { };
    }, [t]);

    // Gérer les changements de Quill
    useEffect(() => {
        if (quill) {
            const handleTextChange = () => {
                const html = quill.root.innerHTML;
                setDescription(html);
            };

            quill.on('text-change', handleTextChange);

            return () => {
                quill.off('text-change', handleTextChange);
            };
        }
    }, [quill]);

    // Initialisation de Quill pour les tags
    useEffect(() => {
        if (!tagsQuillRef.current) return;

        const quillInstance = new Quill(tagsQuillRef.current, {
            placeholder: t("Ex: React, JavaScript, Senior"),
            theme: "snow",
            modules: {
                toolbar: [
                    // Toolbar simplifié pour les tags
                    ['bold', 'italic'],
                    [{ 'list': 'bullet' }],
                    ['clean']
                ]
            }
        });

        setTagsQuill(quillInstance);

        return () => { };
    }, [t]);

    // Gérer les changements de Quill pour les tags
    useEffect(() => {
        if (tagsQuill) {
            const handleTextChange = () => {
                const html = tagsQuill.root.innerHTML;
                setTags(html);
            };

            tagsQuill.on('text-change', handleTextChange);

            return () => {
                tagsQuill.off('text-change', handleTextChange);
            };
        }
    }, [tagsQuill]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            jobTitle: formData.get('job-title-Input'),
            jobPosition: formData.get('job-position-Input'),
            jobCategory: selectedJobCategory?.value,
            jobType: selectedJobType?.value,
            description: description,
            vacancy: formData.get('vancancy-Input'),
            experience: selectedExperience?.value,
            lastApplyDate: formData.get('last-apply-date-Input'),
            closeDate: formData.get('close-date-Input'),
            startSalary: formData.get('start-salary-Input'),
            lastSalary: formData.get('last-salary-Input'),
            country: formData.get('country-Input'),
            city: formData.get('city-Input'),
            tags: formData.get('tags-field'),
        };
        console.log("Données soumises:", data);
    };

    const cardStyle = {
        borderRadius: "20px",
        background: "#fff",
        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    };

    document.title = t("Ajouter une offre d'emploi");

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title={`\u00a0${t("Ajouter une offre d'emploi")}`}
                    pageTitle={
                        <>
                            <i className="ri-team-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>&nbsp;&gt;
                        </>
                    }
                />

                <Container fluid className="container-fluid">
                    <Row className="row">
                        <Col className="col-lg-12">
                            <Card style={cardStyle}>
                                <Form onSubmit={handleSubmit}>
                                    <CardBody className="p-4">
                                        <Row>
                                            {/* Titre du poste */}
                                            <Col lg={6}>
                                                <FormGroup>
                                                    <Label htmlFor="job-title-Input">
                                                        {t("Titre du poste")} <span className="text-danger">*</span>
                                                    </Label>
                                                    <Input
                                                        className="rounded-4"
                                                        type="text"
                                                        name="job-title-Input"
                                                        id="job-title-Input"
                                                        placeholder={t("Ex: Développeur Full Stack")}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>

                                            {/* Intitulé du poste */}
                                            <Col lg={6}>
                                                <FormGroup>
                                                    <Label htmlFor="job-position-Input">
                                                        {t("Intitulé exact")} <span className="text-danger">*</span>
                                                    </Label>
                                                    <Input
                                                        className="rounded-4"
                                                        type="text"
                                                        name="job-position-Input"
                                                        id="job-position-Input"
                                                        placeholder={t("Ex: Développeur Full Stack Senior")}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>

                                            {/* Catégorie d'emploi */}
                                            <Col lg={6}>
                                                <FormGroup>
                                                    <Label htmlFor="job-category-Input">
                                                        {t("Catégorie d'emploi")} <span className="text-danger">*</span>
                                                    </Label>
                                                    <CustomSelect
                                                        inputId="job-category-Input"
                                                        value={selectedJobCategory}
                                                        onChange={(option) => setSelectedJobCategory(option)}
                                                        options={jobCategoryOptions}
                                                        placeholder={t("Sélectionner une catégorie")}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            {/* Type d'emploi */}
                                            <Col lg={6}>
                                                <FormGroup>
                                                    <Label htmlFor="job-type-Input">
                                                        {t("Type d'emploi")} <span className="text-danger">*</span>
                                                    </Label>
                                                    <CustomSelect
                                                        inputId="job-type-Input"
                                                        value={selectedJobType}
                                                        onChange={(option) => setSelectedJobType(option)}
                                                        options={jobTypeOptions}
                                                        placeholder={t("Sélectionner un type")}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            {/* Description avec Quill */}
                                            <Col lg={12}>
                                                <FormGroup>
                                                    <Label>
                                                        {t("Description")} <span className="text-danger">*</span>
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
                                                        <div ref={quillRef} style={{ minHeight: '200px' }} />
                                                    </div>
                                                </FormGroup>
                                            </Col>

                                            {/* Nombre de postes */}
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label htmlFor="vancancy-Input">
                                                        {t("Nombre de postes")} <span className="text-danger">*</span>
                                                    </Label>
                                                    <Input
                                                        className="rounded-4"
                                                        type="number"
                                                        name="vancancy-Input"
                                                        id="vancancy-Input"
                                                        placeholder={t("Ex: 3")}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>

                                            {/* Expérience requise */}
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label htmlFor="experience-Input">
                                                        {t("Expérience requise")} <span className="text-danger">*</span>
                                                    </Label>
                                                    <CustomSelect
                                                        inputId="experience-Input"
                                                        value={selectedExperience}
                                                        onChange={(option) => setSelectedExperience(option)}
                                                        options={experienceOptions}
                                                        placeholder={t("Sélectionner l'expérience")}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            {/* Date limite de candidature */}
                                            <Col lg={6}>
                                                <FormGroup>
                                                    <Label htmlFor="last-apply-date-Input">
                                                        {t("Date limite de candidature")} <span className="text-danger">*</span>
                                                    </Label>
                                                    <Flatpickr
                                                        className="rounded-4 form-control"
                                                        id="last-apply-date-Input"
                                                        name="last-apply-date-Input"
                                                        placeholder={t("Sélectionner une date")}
                                                        options={{
                                                            altInput: true,
                                                            altFormat: "d F Y",
                                                            mode: "single",
                                                            dateFormat: "Y-m-d",
                                                            locale: i18n.language?.startsWith("fr") ? "fr" : undefined
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            {/* Date de clôture */}
                                            <Col lg={6}>
                                                <FormGroup>
                                                    <Label htmlFor="close-date-Input">
                                                        {t("Date de clôture")} <span className="text-danger">*</span>
                                                    </Label>
                                                    <Flatpickr
                                                        className="rounded-4 form-control"
                                                        id="close-date-Input"
                                                        name="close-date-Input"
                                                        placeholder={t("Sélectionner une date")}
                                                        options={{
                                                            altInput: true,
                                                            altFormat: "d F Y",
                                                            mode: "single",
                                                            dateFormat: "Y-m-d",
                                                            locale: i18n.language?.startsWith("fr") ? "fr" : undefined
                                                        }}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            {/* Salaire minimum */}
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label htmlFor="start-salary-Input">
                                                        {t("Salaire minimum (FCFA)")}
                                                    </Label>
                                                    <Input
                                                        className="rounded-4"
                                                        type="number"
                                                        name="start-salary-Input"
                                                        id="start-salary-Input"
                                                        placeholder={t("Ex: 300000")}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            {/* Salaire maximum */}
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label htmlFor="last-salary-Input">
                                                        {t("Salaire maximum (FCFA)")}
                                                    </Label>
                                                    <Input
                                                        className="rounded-4"
                                                        type="number"
                                                        name="last-salary-Input"
                                                        id="last-salary-Input"
                                                        placeholder={t("Ex: 800000")}
                                                    />
                                                </FormGroup>
                                            </Col>

                                            {/* Pays */}
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label htmlFor="country-Input">
                                                        {t("Pays")} <span className="text-danger">*</span>
                                                    </Label>
                                                    <Input
                                                        className="rounded-4"
                                                        type="text"
                                                        name="country-Input"
                                                        id="country-Input"
                                                        placeholder={t("Ex: France")}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>

                                            {/* Ville */}
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label htmlFor="city-Input">
                                                        {t("Ville")} <span className="text-danger">*</span>
                                                    </Label>
                                                    <Input
                                                        className="rounded-4"
                                                        type="text"
                                                        name="city-Input"
                                                        id="city-Input"
                                                        placeholder={t("Ex: Paris")}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>

                                            {/* Tags */}
                                            <Col lg={12}>
                                                <FormGroup>
                                                    <Label htmlFor="tags-field">
                                                        {t("Tags / Mots-clés")}
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
                                                        <div
                                                            ref={tagsQuillRef}
                                                            style={{ minHeight: '100px' }}
                                                        />
                                                    </div>
                                                    <small className="text-muted d-block mt-1">
                                                        {t("Saisissez vos tags (chaque ligne = un tag)")}
                                                    </small>
                                                </FormGroup>
                                            </Col>

                                            {/* Boutons */}
                                            <Col lg={12}>
                                                <div className="hstack justify-content-end gap-2">
                                                    <Button
                                                        className="btn btn-secondary rounded-5"
                                                        type="button"
                                                        style={{ borderRadius: "70px", padding: "10px 30px" }}
                                                        onClick={() => navigate("/:entreprise/recrutements")}
                                                    >
                                                        {t("Annuler")}
                                                    </Button>
                                                    <Link
                                                        to="#"
                                                        type="submit"
                                                        className="btn btn-primary rounded-5"
                                                        style={{ borderRadius: "70px", padding: "10px 30px" }}
                                                    >
                                                        {t("Ajouter l'offre d'emploi")}
                                                    </Link>
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </div>
    );
};

export default OffreAdd;