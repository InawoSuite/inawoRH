import React, { useMemo, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Link, useNavigate, useParams } from "react-router-dom";

const mockData = {
    "1": {
        id: 1,
        code: "POSTE-001",
        nomTitre: "Directeur Commercial",
        departementService: "Direction Commerciale",
        missions: "<p><strong>Développer la stratégie commerciale</strong></p><p><br></p><p>Manager l'équipe commerciale (15 personnes)</p><p><br></p><p>Atteindre les objectifs de vente</p>",
        responsabilites: "<p>Gestion du chiffre d'affaires</p><p><br></p><p>Fidélisation des clients stratégiques</p><p><br></p><p>Reporting mensuel à la direction générale</p>",
        superieurHierarchique: "Directeur Général",
        subordonnes: "Chefs des ventes, Chargés de clientèle",
        niveauOrganigramme: "Niveau 2",
        employe: "Jean Dupont",
        lieuAffectation: "Siège - Abidjan",
        type: "Cadre",
        statut: "Actif",
        objectifsAssignes: "<p>Atteindre 15% de croissance du CA</p><p><br></p><p>Développer 3 nouveaux marchés régionaux</p>",
        typeContrat: ["CDI"],
        tempsTravail: "Temps plein",
        avantages: "Véhicule de fonction, Téléphone, Prime sur objectifs",
        masseSalarialePrevue: 25000000,
        budgetAlloue: 15000000,
        nombrePostesAutorise: 1,
        nombrePostesOccupe: 1,
        posteStrategique: "Oui"
    },
    "2": {
        id: 2,
        code: "POSTE-002",
        nomTitre: "Chef Comptable",
        departementService: "Finance et Comptabilité",
        missions: "<p>Superviser la comptabilité générale</p><p><br></p><p>Établir les états financiers</p><p><br></p><p>Gérer les clôtures mensuelles</p>",
        responsabilites: "<p>Fiabilité des comptes</p><p><br></p><p>Respect des délais légaux</p><p><br></p><p>Supervision d'une équipe</p>",
        superieurHierarchique: "Directeur Financier",
        subordonnes: "Comptables, Assistants comptables",
        niveauOrganigramme: "Niveau 3",
        employe: "Marie Martin",
        lieuAffectation: "Siège - Abidjan",
        type: "Cadre",
        statut: "Actif",
        objectifsAssignes: "<p>Clôtures mensuelles en 5 jours</p><p><br></p><p>Optimisation fiscale</p>",
        typeContrat: ["CDI"],
        tempsTravail: "Temps plein",
        avantages: "Prime de performance, Mutuelle famille",
        masseSalarialePrevue: 15000000,
        budgetAlloue: 10000000,
        nombrePostesAutorise: 1,
        nombrePostesOccupe: 1,
        posteStrategique: "Oui"
    }
};

const PosteForm = ({ mode = "add" }) => {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedPositionHierarchique, setSelectedPositionHierarchique] = useState(null);
    const positionHierarchiqueOptions = useMemo(
        () => [
            { value: "Supérieur hiérarchique", label: t("Supérieur hiérarchique") },
            { value: "Subordonnés", label: t("Subordonnés") },
            { value: "Niveau dans l'organigramme", label: t("Niveau dans l'organigramme") },
        ],
        [t]
    );

    // États pour les données du formulaire
    const [formData, setFormData] = useState({
        code: "",
        nomTitre: "",
        departementService: "",
        missions: "",
        responsabilites: "",
        superieurHierarchique: "",
        subordonnes: "",
        niveauOrganigramme: "",
        employe: "",
        lieuAffectation: "",
        type: "",
        statut: "Actif",
        objectifsAssignes: "",
        typeContrat: [],
        tempsTravail: "Temps plein",
        avantages: "",
        masseSalarialePrevue: "",
        budgetAlloue: "",
        nombrePostesAutorise: "",
        nombrePostesOccupe: "",
        posteStrategique: "Non"
    });
    
    // États pour les selects
    const [selectedType, setSelectedType] = useState(null);
    const [selectedStatut, setSelectedStatut] = useState(null);
    const [selectedTypeContrat, setSelectedTypeContrat] = useState([]);
    const [selectedTempsTravail, setSelectedTempsTravail] = useState(null);
    const [selectedPosteStrategique, setSelectedPosteStrategique] = useState(null);

    // États pour savoir si les éditeurs ont été initialisés
    const [missionsInitialized, setMissionsInitialized] = useState(false);
    const [responsabilitesInitialized, setResponsabilitesInitialized] = useState(false);
    const [objectifsInitialized, setObjectifsInitialized] = useState(false);

    // Références pour Quill
    const missionsQuillRef = useRef(null);
    const responsabilitesQuillRef = useRef(null);
    const objectifsQuillRef = useRef(null);
    
    const [missionsQuill, setMissionsQuill] = useState(null);
    const [responsabilitesQuill, setResponsabilitesQuill] = useState(null);
    const [objectifsQuill, setObjectifsQuill] = useState(null);

    // Options pour les selects
    const typeOptions = useMemo(
        () => [
            { value: "Cadre", label: t("Cadre") },
            { value: "Agent", label: t("Agent") },
            { value: "Ouvrier", label: t("Ouvrier") },
            { value: "Indépendant", label: t("Indépendant") },
            { value: "Constituant", label: t("Constituant") }
        ],
        [t]
    );

    const statutOptions = useMemo(
        () => [
            { value: "Actif", label: t("Actif") },
            { value: "Inactif", label: t("Inactif") }
        ],
        [t]
    );

    const typeContratOptions = useMemo(
        () => [
            { value: "CDI", label: t("CDI") },
            { value: "CDD", label: t("CDD") },
            { value: "Stage", label: t("Stage") },
            { value: "Alternance", label: t("Alternance") },
            { value: "Remote", label: t("Remote") },
            { value: "Autre", label: t("Autre") }
        ],
        [t]
    );

    const tempsTravailOptions = useMemo(
        () => [
            { value: "Temps plein", label: t("Temps plein") },
            { value: "Temps partiel", label: t("Temps partiel") }
        ],
        [t]
    );

    const posteStrategiqueOptions = useMemo(
        () => [
            { value: "Oui", label: t("Oui") },
            { value: "Non", label: t("Non") }
        ],
        [t]
    );

    // ============================================
    // INITIALISATION DES ÉDITEURS QUILL
    // ============================================

    // Initialisation de Quill pour Missions
    useEffect(() => {
        if (!missionsQuillRef.current) return;

        // Détruire l'ancienne instance Quill si elle existe
        if (missionsQuill) {
            missionsQuill.enable(false);
        }

        // Nettoyer le DOM des éléments Quill existants
        const editorElement = missionsQuillRef.current;
        const existingToolbar = editorElement.parentElement?.querySelector('.ql-toolbar');
        if (existingToolbar) {
            existingToolbar.remove();
        }

        const quillInstance = new Quill(missionsQuillRef.current, {
            placeholder: t("Décrivez les missions principales du poste..."),
            theme: "snow",
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'header': [1, 2, 3, false] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['clean']
                ]
            }
        });

        setMissionsQuill(quillInstance);
        setMissionsInitialized(false); // Réinitialiser le flag quand une nouvelle instance est créée

        return () => {
            // Nettoyer proprement
            if (quillInstance) {
                quillInstance.enable(false);
            }
        };
    }, [t]); // Ne dépend que de t pour éviter les réinitialisations intempestives

    // Initialisation de Quill pour Responsabilités
    useEffect(() => {
        if (!responsabilitesQuillRef.current) return;

        if (responsabilitesQuill) {
            responsabilitesQuill.enable(false);
        }

        const editorElement = responsabilitesQuillRef.current;
        const existingToolbar = editorElement.parentElement?.querySelector('.ql-toolbar');
        if (existingToolbar) {
            existingToolbar.remove();
        }

        const quillInstance = new Quill(responsabilitesQuillRef.current, {
            placeholder: t("Décrivez les responsabilités du poste..."),
            theme: "snow",
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'header': [1, 2, 3, false] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['clean']
                ]
            }
        });

        setResponsabilitesQuill(quillInstance);
        setResponsabilitesInitialized(false);

        return () => {
            if (quillInstance) {
                quillInstance.enable(false);
            }
        };
    }, [t]);

    // Initialisation de Quill pour Objectifs
    useEffect(() => {
        if (!objectifsQuillRef.current) return;

        if (objectifsQuill) {
            objectifsQuill.enable(false);
        }

        const editorElement = objectifsQuillRef.current;
        const existingToolbar = editorElement.parentElement?.querySelector('.ql-toolbar');
        if (existingToolbar) {
            existingToolbar.remove();
        }

        const quillInstance = new Quill(objectifsQuillRef.current, {
            placeholder: t("Décrivez les objectifs assignés au poste..."),
            theme: "snow",
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['clean']
                ]
            }
        });

        setObjectifsQuill(quillInstance);
        setObjectifsInitialized(false);

        return () => {
            if (quillInstance) {
                quillInstance.enable(false);
            }
        };
    }, [t]);

    // ============================================
    // CHARGEMENT DES DONNÉES EN MODE ÉDITION
    // ============================================

    // Charger les données en mode édition
    useEffect(() => {
        if (mode === "edit" && id && mockData[id]) {
            const data = mockData[id];
            setFormData({
                code: data.code,
                nomTitre: data.nomTitre,
                departementService: data.departementService,
                missions: data.missions,
                responsabilites: data.responsabilites,
                superieurHierarchique: data.superieurHierarchique,
                subordonnes: data.subordonnes,
                niveauOrganigramme: data.niveauOrganigramme,
                employe: data.employe,
                lieuAffectation: data.lieuAffectation,
                type: data.type,
                statut: data.statut,
                objectifsAssignes: data.objectifsAssignes,
                typeContrat: data.typeContrat,
                tempsTravail: data.tempsTravail,
                avantages: data.avantages,
                masseSalarialePrevue: data.masseSalarialePrevue,
                budgetAlloue: data.budgetAlloue,
                nombrePostesAutorise: data.nombrePostesAutorise,
                nombrePostesOccupe: data.nombrePostesOccupe,
                posteStrategique: data.posteStrategique
            });

            // Mettre à jour les selects
            setSelectedType(typeOptions.find(opt => opt.value === data.type));
            setSelectedStatut(statutOptions.find(opt => opt.value === data.statut));
            setSelectedTypeContrat(typeContratOptions.filter(opt => data.typeContrat.includes(opt.value)));
            setSelectedTempsTravail(tempsTravailOptions.find(opt => opt.value === data.tempsTravail));
            setSelectedPosteStrategique(posteStrategiqueOptions.find(opt => opt.value === data.posteStrategique));
            
            // Réinitialiser les flags de chargement
            setMissionsInitialized(false);
            setResponsabilitesInitialized(false);
            setObjectifsInitialized(false);
        }
    }, [mode, id, typeOptions, statutOptions, typeContratOptions, tempsTravailOptions, posteStrategiqueOptions]);

    // ============================================
    // CHARGEMENT DU CONTENU DANS LES ÉDITEURS
    // ============================================

    // Charger le contenu dans Missions
    useEffect(() => {
        if (!missionsQuill || !formData.missions || missionsInitialized) return;
        
        if (mode === "edit") {
            // Utiliser requestAnimationFrame pour s'assurer que le DOM est prêt
            const timer = setTimeout(() => {
                if (missionsQuill && !missionsQuill.getText().trim()) {
                    missionsQuill.clipboard.dangerouslyPasteHTML(0, formData.missions);
                    setMissionsInitialized(true);
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [missionsQuill, mode, formData.missions, missionsInitialized]);

    // Charger le contenu dans Responsabilités
    useEffect(() => {
        if (!responsabilitesQuill || !formData.responsabilites || responsabilitesInitialized) return;
        
        if (mode === "edit") {
            const timer = setTimeout(() => {
                if (responsabilitesQuill && !responsabilitesQuill.getText().trim()) {
                    responsabilitesQuill.clipboard.dangerouslyPasteHTML(0, formData.responsabilites);
                    setResponsabilitesInitialized(true);
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [responsabilitesQuill, mode, formData.responsabilites, responsabilitesInitialized]);

    // Charger le contenu dans Objectifs
    useEffect(() => {
        if (!objectifsQuill || !formData.objectifsAssignes || objectifsInitialized) return;
        
        if (mode === "edit") {
            const timer = setTimeout(() => {
                if (objectifsQuill && !objectifsQuill.getText().trim()) {
                    objectifsQuill.clipboard.dangerouslyPasteHTML(0, formData.objectifsAssignes);
                    setObjectifsInitialized(true);
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [objectifsQuill, mode, formData.objectifsAssignes, objectifsInitialized]);

    // ============================================
    // GESTION DES CHANGEMENTS DANS LES ÉDITEURS
    // ============================================

    // Gérer les changements de Quill pour Missions
    useEffect(() => {
        if (!missionsQuill) return;

        const handleTextChange = () => {
            const html = missionsQuill.root.innerHTML;
            setFormData(prev => ({ ...prev, missions: html }));
        };

        missionsQuill.on('text-change', handleTextChange);

        return () => {
            missionsQuill.off('text-change', handleTextChange);
        };
    }, [missionsQuill]);

    // Gérer les changements de Quill pour Responsabilités
    useEffect(() => {
        if (!responsabilitesQuill) return;

        const handleTextChange = () => {
            const html = responsabilitesQuill.root.innerHTML;
            setFormData(prev => ({ ...prev, responsabilites: html }));
        };

        responsabilitesQuill.on('text-change', handleTextChange);

        return () => {
            responsabilitesQuill.off('text-change', handleTextChange);
        };
    }, [responsabilitesQuill]);

    // Gérer les changements de Quill pour Objectifs
    useEffect(() => {
        if (!objectifsQuill) return;

        const handleTextChange = () => {
            const html = objectifsQuill.root.innerHTML;
            setFormData(prev => ({ ...prev, objectifsAssignes: html }));
        };

        objectifsQuill.on('text-change', handleTextChange);

        return () => {
            objectifsQuill.off('text-change', handleTextChange);
        };
    }, [objectifsQuill]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataObj = new FormData(e.target);
        const data = {
            code: formDataObj.get('code'),
            nomTitre: formDataObj.get('nomTitre'),
            departementService: formDataObj.get('departementService'),
            missions: formData.missions,
            responsabilites: formData.responsabilites,
            superieurHierarchique: formDataObj.get('superieurHierarchique'),
            subordonnes: formDataObj.get('subordonnes'),
            niveauOrganigramme: formDataObj.get('niveauOrganigramme'),
            employe: formDataObj.get('employe'),
            lieuAffectation: formDataObj.get('lieuAffectation'),
            type: selectedType?.value,
            statut: selectedStatut?.value || "Actif",
            objectifsAssignes: formData.objectifsAssignes,
            typeContrat: selectedTypeContrat.map(opt => opt.value),
            tempsTravail: selectedTempsTravail?.value || "Temps plein",
            avantages: formDataObj.get('avantages'),
            masseSalarialePrevue: formDataObj.get('masseSalarialePrevue'),
            budgetAlloue: formDataObj.get('budgetAlloue'),
            nombrePostesAutorise: formDataObj.get('nombrePostesAutorise'),
            nombrePostesOccupe: formDataObj.get('nombrePostesOccupe'),
            posteStrategique: selectedPosteStrategique?.value || "Non"
        };
        console.log("Données soumises:", data);
        navigate("/:entreprise/postes");
    };

    const cardStyle = {
        borderRadius: "20px",
        background: "#fff",
        boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    };

    const sectionTitleStyle = {
        backgroundColor: "#f8f9fa",
        padding: "10px 15px",
        borderRadius: "10px",
        marginBottom: "20px",
        borderLeft: "4px solid #0d6efd"
    };

    document.title = mode === "add" ? t("Ajouter un poste") : t("Modifier le poste");

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title={mode === "add" ? t("Ajouter un poste") : t("Modifier le poste")}
                    pageTitle={
                        <>
                            <i className="ri-briefcase-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">{t('Tableau de bord')}</Link>
                            &nbsp;&gt;&nbsp;<Link to="/:entreprise/postes">{t('Postes')}</Link>&nbsp;&gt;&nbsp;
                        </>
                    }
                />
                
                <Row>
                    <Col lg={12}>
                        <Card className="border-0" style={cardStyle}>
                            <CardBody className="p-4">
                                <h5 className="mb-4">
                                    {mode === "add" ? t("Nouveau poste") : t("Modification du poste")}
                                    {mode === "edit" && formData.code && <span className="text-muted ms-2">- {formData.code}</span>}
                                </h5>
                                
                                <Form onSubmit={handleSubmit}>
                                    {/* SECTION 1 : INFORMATIONS GÉNÉRALES */}
                                    <div style={sectionTitleStyle}>
                                        <h6 className="mb-0 text-primary">
                                            <i className="ri-information-line me-2"></i>
                                            {t('Informations générales du poste')}
                                        </h6>
                                    </div>
                                    
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="code">
                                                    {t('Code du poste')} <span className="text-danger">*</span>
                                                </Label>
                                                <Input 
                                                    id="code"
                                                    className="rounded-4"
                                                    name="code" 
                                                    type="text" 
                                                    placeholder="Ex: POSTE-001" 
                                                    defaultValue={formData.code}
                                                    onChange={handleChange}
                                                    required 
                                                />
                                            </FormGroup>
                                        </Col>
                                        
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="nomTitre">
                                                    {t('Nom/Titre du poste')} <span className="text-danger">*</span>
                                                </Label>
                                                <Input 
                                                    id="nomTitre"
                                                    className="rounded-4"
                                                    name="nomTitre" 
                                                    type="text" 
                                                    placeholder="Ex: Directeur Commercial" 
                                                    defaultValue={formData.nomTitre}
                                                    onChange={handleChange}
                                                    required 
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>
                                                    {t('Missions')}
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
                                                    <div ref={missionsQuillRef} style={{ minHeight: '150px' }} />
                                                </div>
                                            </FormGroup>
                                        </Col>
                                        
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>
                                                    {t('Responsabilités')}
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
                                                    <div ref={responsabilitesQuillRef} style={{ minHeight: '150px' }} />
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="positionHierarchique">
                                                    {t('Position hiérarchique')}
                                                </Label>
                                                <CustomSelect
                                                    inputId="positionHierarchique"
                                                    value={selectedPositionHierarchique}
                                                    onChange={(option) => setSelectedPositionHierarchique(option)}
                                                    options={positionHierarchiqueOptions}
                                                    placeholder={t('Sélectionner')}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="departementService">
                                                    {t('Département/Service')} <span className="text-danger">*</span>
                                                </Label>
                                                <Input 
                                                    id="departementService"
                                                    className="rounded-4"
                                                    name="departementService" 
                                                    type="text" 
                                                    placeholder="Ex: Direction Commerciale" 
                                                    defaultValue={formData.departementService}
                                                    onChange={handleChange}
                                                    required 
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="employe">
                                                    {t('Employé affecté')}
                                                </Label>
                                                <Input 
                                                    id="employe"
                                                    className="rounded-4"
                                                    name="employe" 
                                                    type="text" 
                                                    placeholder="Ex: Jean Dupont" 
                                                    defaultValue={formData.employe}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="lieuAffectation">
                                                    {t('Lieu d\'affectation')}
                                                </Label>
                                                <Input 
                                                    id="lieuAffectation"
                                                    className="rounded-4"
                                                    name="lieuAffectation" 
                                                    type="text" 
                                                    placeholder="Ex: Siège - Abidjan" 
                                                    defaultValue={formData.lieuAffectation}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label htmlFor="type">
                                                    {t('Type')} <span className="text-danger">*</span>
                                                </Label>
                                                <CustomSelect
                                                    inputId="type"
                                                    value={selectedType}
                                                    onChange={(option) => setSelectedType(option)}
                                                    options={typeOptions}
                                                    placeholder={t('Sélectionner')}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                        
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label htmlFor="statut">
                                                    {t('Statut')} <span className="text-danger">*</span>
                                                </Label>
                                                <CustomSelect
                                                    inputId="statut"
                                                    value={selectedStatut}
                                                    onChange={(option) => setSelectedStatut(option)}
                                                    options={statutOptions}
                                                    placeholder={t('Sélectionner')}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    {/* SECTION 2 : INFORMATIONS FINANCIÈRES ET CONTRACTUELLES */}
                                    <div style={sectionTitleStyle} className="mt-4">
                                        <h6 className="mb-0 text-primary">
                                            <i className="ri-money-dollar-circle-line me-2"></i>
                                            {t('Informations financières et contractuelles')}
                                        </h6>
                                    </div>

                                    <Row>
                                        <Col md={12}>
                                            <FormGroup>
                                                <Label>
                                                    {t('Objectifs assignés')}
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
                                                    <div ref={objectifsQuillRef} style={{ minHeight: '120px' }} />
                                                </div>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row className="mt-3">
                                        <Col md={4}>
                                            <FormGroup className="mb-3">
                                                <Label htmlFor="typeContrat">
                                                    {t('Type de contrat associé')}
                                                </Label>
                                                <CustomSelect
                                                    inputId="typeContrat"
                                                    value={selectedTypeContrat}
                                                    onChange={(options) => setSelectedTypeContrat(options)}
                                                    options={typeContratOptions}
                                                    isMulti={true}
                                                    placeholder={t('Sélectionner')}
                                                />
                                            </FormGroup>
                                        </Col>
                                        
                                        <Col md={4}>
                                            <FormGroup className="mb-3">
                                                <Label htmlFor="tempsTravail">
                                                    {t('Temps de travail')}
                                                </Label>
                                                <CustomSelect
                                                    inputId="tempsTravail"
                                                    value={selectedTempsTravail}
                                                    onChange={(option) => setSelectedTempsTravail(option)}
                                                    options={tempsTravailOptions}
                                                    placeholder={t('Sélectionner')}
                                                />
                                            </FormGroup>
                                        </Col>
                                        
                                        <Col md={4}>
                                            <FormGroup className="mb-3">
                                                <Label for="avantages">
                                                    {t('Avantages liés au poste')}
                                                </Label>
                                                <Input 
                                                    id="avantages"
                                                    className="rounded-4"
                                                    name="avantages" 
                                                    type="text" 
                                                    placeholder={t('Ex: Véhicule, Téléphone, Mutuelle')} 
                                                    defaultValue={formData.avantages}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="masseSalarialePrevue">
                                                    {t('Masse salariale prévue')}
                                                </Label>
                                                <Input 
                                                    id="masseSalarialePrevue"
                                                    className="rounded-4"
                                                    name="masseSalarialePrevue" 
                                                    type="number" 
                                                    placeholder="Ex: 25000000" 
                                                    defaultValue={formData.masseSalarialePrevue}
                                                    onChange={handleChange}
                                                    step="100000"
                                                    min="0"
                                                />
                                            </FormGroup>
                                        </Col>
                                        
                                        <Col md={6}>
                                            <FormGroup className="mb-3">
                                                <Label for="budgetAlloue">
                                                    {t('Budget alloué')}
                                                </Label>
                                                <Input 
                                                    id="budgetAlloue"
                                                    className="rounded-4"
                                                    name="budgetAlloue" 
                                                    type="number" 
                                                    placeholder="Ex: 15000000" 
                                                    defaultValue={formData.budgetAlloue}
                                                    onChange={handleChange}
                                                    step="100000"
                                                    min="0"
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    {/* SECTION 3 : INFORMATIONS DE PLANIFICATION */}
                                    <div style={sectionTitleStyle} className="mt-4">
                                        <h6 className="mb-0 text-primary">
                                            <i className="ri-calendar-check-line me-2"></i>
                                            {t('Planification et stratégie')}
                                        </h6>
                                    </div>

                                    <Row>
                                        <Col md={4}>
                                            <FormGroup className="mb-3">
                                                <Label for="nombrePostesAutorise">
                                                    {t('Nombre de postes autorisé')}
                                                </Label>
                                                <Input 
                                                    id="nombrePostesAutorise"
                                                    className="rounded-4"
                                                    name="nombrePostesAutorise" 
                                                    type="number" 
                                                    placeholder="Ex: 1" 
                                                    defaultValue={formData.nombrePostesAutorise}
                                                    onChange={handleChange}
                                                    min="0"
                                                    step="1"
                                                />
                                            </FormGroup>
                                        </Col>
                                        
                                        <Col md={4}>
                                            <FormGroup className="mb-3">
                                                <Label for="nombrePostesOccupe">
                                                    {t('Nombre de postes occupé')}
                                                </Label>
                                                <Input 
                                                    id="nombrePostesOccupe"
                                                    className="rounded-4"
                                                    name="nombrePostesOccupe" 
                                                    type="number" 
                                                    placeholder="Ex: 1" 
                                                    defaultValue={formData.nombrePostesOccupe}
                                                    onChange={handleChange}
                                                    min="0"
                                                    step="1"
                                                />
                                            </FormGroup>
                                        </Col>
                                        
                                        <Col md={4}>
                                            <FormGroup className="mb-3">
                                                <Label htmlFor="posteStrategique">
                                                    {t('Poste stratégique')}
                                                </Label>
                                                <CustomSelect
                                                    inputId="posteStrategique"
                                                    value={selectedPosteStrategique}
                                                    onChange={(option) => setSelectedPosteStrategique(option)}
                                                    options={posteStrategiqueOptions}
                                                    placeholder="Sélectionner..."
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row className="mt-4">
                                        <Col md={12}>
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button
                                                    className="btn btn-secondary rounded-5"
                                                    type="button"
                                                    style={{ borderRadius: "70px", padding: "10px 30px" }}
                                                    onClick={() => navigate("/:entreprise/postes")}
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

export default PosteForm;