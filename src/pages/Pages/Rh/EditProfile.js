import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, FormGroup } from 'reactstrap';
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import { CustomSelect } from "../../../Components/Common/CustomSelectStyles";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import progileBg from "../../../assets/images/profile-bg.jpg";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

const EditProfile = () => {
    const [activeTab, setActiveTab] = useState("1");

    // États pour les descriptions Quill
    const [personalDescription, setPersonalDescription] = useState("Bonjour, je suis Anna Adame. Ce sera aussi simple que l'occidental ; en fait, ce sera occidental. Pour un Anglais, cela ressemblera à de l'anglais simplifié, comme me l'a dit un ami sceptique de Cambridge à propos de ce que l'occidental est : les langues européennes sont membres de la même famille.");
    const [jobDescription, setJobDescription] = useState("Vous voulez toujours vous assurer que vos polices fonctionnent bien ensemble et essayez de limiter le nombre de polices que vous utilisez à trois ou moins. Expérimentez et jouez avec les polices que vous avez déjà dans le logiciel avec lequel vous travaillez sur des sites Web de polices réputés.");

    // Références pour Quill
    const personalQuillRef = useRef(null);
    const jobQuillRef = useRef(null);
    const [personalQuill, setPersonalQuill] = useState(null);
    const [jobQuill, setJobQuill] = useState(null);

    // États pour les selects
    const [selectedYears, setSelectedYears] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState(null);

    const yearsOptions = useMemo(
        () => [
            { value: "2001", label: "2001" },
            { value: "2002", label: "2002" },
            { value: "2003", label: "2003" },
            { value: "2004", label: "2004" },
            { value: "2005", label: "2005" },
            { value: "2006", label: "2006" },
            { value: "2007", label: "2007" },
            { value: "2008", label: "2008" },
            { value: "2009", label: "2009" },
            { value: "2010", label: "2010" },
            { value: "2011", label: "2011" },
            { value: "2012", label: "2012" },
            { value: "2013", label: "2013" },
            { value: "2014", label: "2014" },
            { value: "2015", label: "2015" },
            { value: "2016", label: "2016" },
            { value: "2017", label: "2017" },
            { value: "2018", label: "2018" },
            { value: "2019", label: "2019" },
            { value: "2020", label: "2020" },
            { value: "2021", label: "2021" },
            { value: "2022", label: "2022" },
        ],
        []
    );

    const skillsOptions = useMemo(
        () => [
            { value: "CSS", label: "CSS" },
            { value: "HTML", label: "HTML" },
            { value: "PYTHON", label: "PYTHON" },
            { value: "JAVA", label: "JAVA" },
            { value: "ASP.NET", label: "ASP.NET" },
        ],
        []
    );

    // Initialisation de Quill pour la description personnelle
    useEffect(() => {
        if (!personalQuillRef.current) return;

        const quillInstance = new Quill(personalQuillRef.current, {
            placeholder: "Description personnelle...",
            theme: "snow",
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'header': [1, 2, 3, false] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['link'],
                    ['clean']
                ]
            }
        });

        setPersonalQuill(quillInstance);

        return () => {};
    }, []);

    // Initialisation de Quill pour la description du poste
    useEffect(() => {
        if (!jobQuillRef.current) return;

        const quillInstance = new Quill(jobQuillRef.current, {
            placeholder: "Description du poste...",
            theme: "snow",
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'header': [1, 2, 3, false] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['link'],
                    ['clean']
                ]
            }
        });

        setJobQuill(quillInstance);

        return () => {};
    }, []);

    // Mettre à jour le contenu de Quill personnel
    useEffect(() => {
        if (personalQuill && personalDescription && personalQuill.root.innerHTML !== personalDescription) {
            personalQuill.clipboard.dangerouslyPasteHTML(personalDescription);
        }
    }, [personalQuill, personalDescription]);

    // Mettre à jour le contenu de Quill job
    useEffect(() => {
        if (jobQuill && jobDescription && jobQuill.root.innerHTML !== jobDescription) {
            jobQuill.clipboard.dangerouslyPasteHTML(jobDescription);
        }
    }, [jobQuill, jobDescription]);

    // Gérer les changements de Quill personnel
    useEffect(() => {
        if (personalQuill) {
            const handleTextChange = () => {
                const html = personalQuill.root.innerHTML;
                setPersonalDescription(html);
            };

            personalQuill.on('text-change', handleTextChange);

            return () => {
                personalQuill.off('text-change', handleTextChange);
            };
        }
    }, [personalQuill]);

    // Gérer les changements de Quill job
    useEffect(() => {
        if (jobQuill) {
            const handleTextChange = () => {
                const html = jobQuill.root.innerHTML;
                setJobDescription(html);
            };

            jobQuill.on('text-change', handleTextChange);

            return () => {
                jobQuill.off('text-change', handleTextChange);
            };
        }
    }, [jobQuill]);

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    document.title = "Modifier le profil";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="position-relative mx-n4 mt-n4">
                        <div className="profile-wid-bg profile-setting-img">
                            <img src={progileBg} className="profile-wid-img" alt="Fond de profil" />
                            <div className="overlay-content">
                                <div className="text-end p-3">
                                    <div className="p-0 ms-auto profile-photo-edit">
                                        <Input id="profile-foreground-img-file-input" type="file"
                                            className="profile-foreground-img-file-input" />
                                        <Label htmlFor="profile-foreground-img-file-input"
                                            className="profile-photo-edit btn btn-light">
                                            <i className="ri-image-edit-line align-bottom me-1"></i> Changer la couverture
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Row>
                        <Col xxl={3}>
                            <Card className="mt-n5 rounded-4 border-0 shadow-sm">
                                <CardBody className="p-4">
                                    <div className="text-center">
                                        <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                            <img src={avatar1}
                                                className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                alt="Photo de profil" />
                                            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                <Input id="profile-img-file-input" type="file"
                                                    className="profile-img-file-input" />
                                                <Label htmlFor="profile-img-file-input"
                                                    className="profile-photo-edit avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-light text-body">
                                                        <i className="ri-camera-fill"></i>
                                                    </span>
                                                </Label>
                                            </div>
                                        </div>
                                        <h5 className="fs-16 mb-1">Anna Adame</h5>
                                        <p className="text-muted mb-0">Designer Principal / Développeuse</p>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="mt-4 rounded-4 border-0 shadow-sm">
                                <CardBody>
                                    <div className="d-flex align-items-center mb-5">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-0">Complétez votre profil</h5>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Link to="#" className="badge bg-light rounded-4 text-primary fs-12"><i
                                                className="ri-edit-box-line align-bottom me-1"></i> Modifier</Link>
                                        </div>
                                    </div>
                                    <div className="progress animated-progress custom-progress progress-label">
                                        <div className="progress-bar bg-danger" role="progressbar" style={{ "width": "30%" }}
                                            aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">
                                            <div className="label">30%</div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="mt-4 rounded-4 border-0 shadow-sm">
                                <CardBody>
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-0">Portfolio</h5>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Link to="#" className="badge bg-light rounded-4 text-primary fs-12"><i
                                                className="ri-add-fill align-bottom me-1"></i> Ajouter</Link>
                                        </div>
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-dark text-light">
                                                <i className="ri-github-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="email" className="form-control rounded-4" id="gitUsername" placeholder="Nom d'utilisateur"
                                            defaultValue="@daveadame" />
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-primary">
                                                <i className="ri-global-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="text" className="form-control rounded-4" id="websiteInput"
                                            placeholder="www.exemple.com" defaultValue="www.velzon.com" />
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-success">
                                                <i className="ri-dribbble-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="text" className="form-control rounded-4" id="dribbleName" placeholder="Nom d'utilisateur"
                                            defaultValue="@dave_adame" />
                                    </div>
                                    <div className="d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-danger">
                                                <i className="ri-pinterest-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="text" className="form-control rounded-4" id="pinterestName"
                                            placeholder="Nom d'utilisateur" defaultValue="Advance Dave" />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xxl={9}>
                            <Card className="mt-xxl-n5 rounded-4 border-0 shadow-sm">
                                <CardHeader className="rounded-top-4">
                                    <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                        role="tablist">
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "1" })}
                                                onClick={() => {
                                                    tabChange("1");
                                                }}>
                                                <i className="fas fa-home"></i>
                                                Informations personnelles
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "2" })}
                                                onClick={() => {
                                                    tabChange("2");
                                                }}
                                                type="button">
                                                <i className="far fa-user"></i>
                                                Changer le mot de passe
                                            </NavLink>
                                        </NavItem>
                                        <NavItem >
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "3" })}
                                                onClick={() => {
                                                    tabChange("3");
                                                }}
                                                type="button">
                                                <i className="far fa-envelope"></i>
                                                Expérience
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "4" })}
                                                onClick={() => {
                                                    tabChange("4");
                                                }}
                                                type="button">
                                                <i className="far fa-envelope"></i>
                                                Politique de confidentialité
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                <CardBody className="p-4">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <Form>
                                                <Row>
                                                    <Col lg={6}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="firstnameInput">Prénom</Label>
                                                            <Input type="text" className="form-control rounded-4" id="firstnameInput"
                                                                placeholder="Entrez votre prénom" defaultValue="Dave" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="lastnameInput">Nom</Label>
                                                            <Input type="text" className="form-control rounded-4" id="lastnameInput"
                                                                placeholder="Entrez votre nom" defaultValue="Adame" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="phonenumberInput">Téléphone</Label>
                                                            <Input type="text" className="form-control rounded-4"
                                                                id="phonenumberInput"
                                                                placeholder="Entrez votre numéro de téléphone"
                                                                defaultValue="+(1) 987 6543" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="emailInput">Adresse email</Label>
                                                            <Input type="email" className="form-control rounded-4" id="emailInput"
                                                                placeholder="Entrez votre email"
                                                                defaultValue="daveadame@velzon.com" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="JoiningdatInput">Date d'arrivée</Label>
                                                            <Flatpickr
                                                                className="form-control rounded-4"
                                                                options={{
                                                                    dateFormat: "d M, Y"
                                                                }}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="skillsInput">Compétences</Label>
                                                            <CustomSelect
                                                                inputId="skillsInput"
                                                                value={selectedSkills}
                                                                onChange={(option) => setSelectedSkills(option)}
                                                                options={skillsOptions}
                                                                placeholder="Sélectionnez vos compétences"
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="designationInput">Poste</Label>
                                                            <Input type="text" className="form-control rounded-4"
                                                                id="designationInput" placeholder="Intitulé du poste"
                                                                defaultValue="Designer Principal / Développeur" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="websiteInput1">Site web</Label>
                                                            <Input type="text" className="form-control rounded-4" id="websiteInput1"
                                                                placeholder="www.exemple.com" defaultValue="www.velzon.com" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="cityInput">Ville</Label>
                                                            <Input type="text" className="form-control rounded-4" id="cityInput"
                                                                placeholder="Ville" defaultValue="Californie" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="countryInput">Pays</Label>
                                                            <Input type="text" className="form-control rounded-4" id="countryInput"
                                                                placeholder="Pays" defaultValue="États-Unis" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="zipcodeInput">Code postal</Label>
                                                            <Input type="text" className="form-control rounded-4" minLength="5"
                                                                maxLength="6" id="zipcodeInput"
                                                                placeholder="Entrez le code postal" defaultValue="90011" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <FormGroup className="mb-3">
                                                            <Label>Description</Label>
                                                            <div 
                                                                className="snow-editor" 
                                                                style={{ 
                                                                    border: '1px solid #ced4da',
                                                                    borderRadius: '20px',
                                                                    background: '#fff',
                                                                    overflow: 'hidden'
                                                                }}
                                                            >
                                                                <div ref={personalQuillRef} style={{ minHeight: '200px' }} />
                                                            </div>
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <div className="hstack gap-2 justify-content-end">
                                                            <button type="button"
                                                                className="btn btn-secondary rounded-4">Mettre à jour</button>
                                                            <button type="button"
                                                                className="btn btn-soft-danger rounded-4">Annuler</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </TabPane>

                                        <TabPane tabId="2">
                                            <Form>
                                                <Row className="g-2">
                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="oldpasswordInput" className="form-label">Ancien
                                                                mot de passe*</Label>
                                                            <Input type="password" className="form-control rounded-4"
                                                                id="oldpasswordInput"
                                                                placeholder="Entrez votre mot de passe actuel" />
                                                        </div>
                                                    </Col>

                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="newpasswordInput" className="form-label">Nouveau
                                                                mot de passe*</Label>
                                                            <Input type="password" className="form-control rounded-4"
                                                                id="newpasswordInput" placeholder="Entrez le nouveau mot de passe" />
                                                        </div>
                                                    </Col>

                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="confirmpasswordInput" className="form-label">Confirmer
                                                                le mot de passe*</Label>
                                                            <Input type="password" className="form-control rounded-4"
                                                                id="confirmpasswordInput"
                                                                placeholder="Confirmez le mot de passe" />
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Link to="#"
                                                                className="link-primary text-decoration-underline">Mot de passe
                                                                oublié ?</Link>
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="text-end">
                                                            <button type="button" className="btn btn-secondary rounded-4">Changer
                                                                le mot de passe</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                            <div className="mt-4 mb-3 border-bottom pb-2">
                                                <div className="float-end">
                                                    <Link to="#" className="link-primary">Tout déconnecter</Link>
                                                </div>
                                                <h5 className="card-title">Historique de connexion</h5>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-4 fs-18">
                                                        <i className="ri-smartphone-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>iPhone 12 Pro</h6>
                                                    <p className="text-muted mb-0">Los Angeles, États-Unis - 16 mars à
                                                        14h47</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Déconnexion</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-4 fs-18">
                                                        <i className="ri-tablet-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Apple iPad Pro</h6>
                                                    <p className="text-muted mb-0">Washington, États-Unis - 6 novembre à
                                                        10h43</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Déconnexion</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-4 fs-18">
                                                        <i className="ri-smartphone-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Galaxy S21 Ultra 5G</h6>
                                                    <p className="text-muted mb-0">Connecticut, États-Unis - 12 juin à
                                                        15h24</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Déconnexion</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-4 fs-18">
                                                        <i className="ri-macbook-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Dell Inspiron 14</h6>
                                                    <p className="text-muted mb-0">Phoenix, États-Unis - 26 juillet à
                                                        8h10</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Déconnexion</Link>
                                                </div>
                                            </div>
                                        </TabPane>

                                        <TabPane tabId="3">
                                            <form>
                                                <div id="newlink">
                                                    <div id="1">
                                                        <Row>
                                                            <Col lg={12}>
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="jobTitle">Intitulé du poste</Label>
                                                                    <Input type="text" className="form-control rounded-4"
                                                                        id="jobTitle" placeholder="Titre du poste"
                                                                        defaultValue="Designer Principal / Développeur" />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col lg={6}>
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="companyName">Nom de l'entreprise</Label>
                                                                    <Input type="text" className="form-control rounded-4"
                                                                        id="companyName" placeholder="Nom de l'entreprise"
                                                                        defaultValue="Themesbrand" />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col lg={6}>
                                                                <FormGroup className="mb-3">
                                                                    <label htmlFor="experienceYear"
                                                                        className="form-label">Années d'expérience</label>
                                                                    <Row>
                                                                        <Col lg={5}>
                                                                            <CustomSelect
                                                                                inputId="experienceYear-1"
                                                                                value={selectedYears}
                                                                                onChange={(option) => setSelectedYears(option)}
                                                                                options={yearsOptions}
                                                                                placeholder="Sélectionnez l'année"
                                                                            />
                                                                        </Col>

                                                                        <div className="col-auto align-self-center">
                                                                            à
                                                                        </div>

                                                                        <Col lg={5}>
                                                                            <CustomSelect
                                                                                inputId="experienceYear-2"
                                                                                value={selectedYears}
                                                                                onChange={(option) => setSelectedYears(option)}
                                                                                options={yearsOptions}
                                                                                placeholder="Sélectionnez l'année"
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col lg={12}>
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="jobDescription">Description du poste</Label>
                                                                    <div 
                                                                        className="snow-editor" 
                                                                        style={{ 
                                                                            border: '1px solid #ced4da',
                                                                            borderRadius: '20px',
                                                                            background: '#fff',
                                                                            overflow: 'hidden'
                                                                        }}
                                                                    >
                                                                        <div ref={jobQuillRef} style={{ minHeight: '200px' }} />
                                                                    </div>
                                                                </FormGroup>
                                                            </Col>

                                                            <div className="hstack gap-2 justify-content-end">
                                                                <Link className="btn btn-danger rounded-4"
                                                                    to="#">Supprimer</Link>
                                                            </div>
                                                        </Row>
                                                    </div>
                                                </div>
                                                <div id="newForm" style={{ "display": "none" }}>
                                                </div>

                                                <Col lg={12}>
                                                    <div className="hstack gap-2">
                                                        <button type="submit" className="btn btn-primary rounded-4">Mettre à jour</button>
                                                        <Link to="#" className="btn btn-secondary rounded-4">Ajouter nouveau</Link>
                                                    </div>
                                                </Col>
                                            </form>
                                        </TabPane>

                                        <TabPane tabId="4">
                                            <div className="mb-4 pb-2">
                                                <h5 className="card-title text-decoration-underline mb-3">Sécurité :</h5>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">Authentification à deux facteurs</h6>
                                                        <p className="text-muted">L'authentification à deux facteurs est une mesure de sécurité renforcée. Une fois activée, vous devrez fournir deux types d'identification lors de la connexion. Google Authenticator et SMS sont pris en charge.</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#"
                                                            className="btn btn-sm rounded-4 btn-primary">Activer l'authentification à deux facteurs</Link>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">Vérification secondaire</h6>
                                                        <p className="text-muted">Le premier facteur est un mot de passe et le second inclut généralement un texte avec un code envoyé sur votre smartphone, ou des données biométriques utilisant votre empreinte digitale, votre visage ou votre rétine.</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#" className="btn btn-sm rounded-4 btn-primary">Configurer la méthode secondaire</Link>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">Codes de secours</h6>
                                                        <p className="text-muted mb-sm-0">Un code de secours est automatiquement généré pour vous lorsque vous activez l'authentification à deux facteurs via l'application iOS ou Android Twitter. Vous pouvez également générer un code de secours sur twitter.com.</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#"
                                                            className="btn btn-sm rounded-4 btn-primary">Générer des codes de secours</Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <h5 className="card-title text-decoration-underline mb-3">Notifications d'application :</h5>
                                                <ul className="list-unstyled mb-0">
                                                    <li className="d-flex">
                                                        <div className="flex-grow-1">
                                                            <label htmlFor="directMessage"
                                                                className="form-check-label fs-14">Messages directs</label>
                                                            <p className="text-muted">Messages des personnes que vous suivez</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="directMessage" defaultChecked />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="desktopNotification">
                                                                Afficher les notifications de bureau
                                                            </Label>
                                                            <p className="text-muted">Choisissez l'option que vous souhaitez comme paramètre par défaut. Bloquer un site : à côté de "Non autorisé à envoyer des notifications", cliquez sur Ajouter.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="desktopNotification" defaultChecked />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="emailNotification">
                                                                Afficher les notifications par email
                                                            </Label>
                                                            <p className="text-muted">Sous Paramètres, choisissez Notifications. Sous Sélectionner un compte, choisissez le compte pour lequel activer les notifications.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="emailNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="chatNotification">
                                                                Afficher les notifications de chat
                                                            </Label>
                                                            <p className="text-muted">Pour éviter les notifications mobiles en double des applications Gmail et Chat, dans les paramètres, désactivez les notifications de Chat.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="chatNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li className="d-flex mt-2">
                                                        <div className="flex-grow-1">
                                                            <Label className="form-check-label fs-14"
                                                                htmlFor="purchaesNotification">
                                                                Afficher les notifications d'achat
                                                            </Label>
                                                            <p className="text-muted">Recevez des alertes d'achat en temps réel pour vous protéger contre les frais frauduleux.</p>
                                                        </div>
                                                        <div className="flex-shrink-0">
                                                            <div className="form-check form-switch">
                                                                <Input className="form-check-input" type="checkbox"
                                                                    role="switch" id="purchaesNotification" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="card-title text-decoration-underline mb-3">Supprimer ce compte :</h5>
                                                <p className="text-muted">Allez dans la section Données et confidentialité de votre compte de profil. Faites défiler jusqu'à "Vos options de données et de confidentialité". Supprimez votre compte de profil. Suivez les instructions pour supprimer votre compte :</p>
                                                <div>
                                                    <Input type="password" className="form-control rounded-4" id="passwordInput"
                                                        placeholder="Entrez votre mot de passe" defaultValue="make@321654987"
                                                        style={{ maxWidth: "265px" }} />
                                                </div>
                                                <div className="hstack gap-2 mt-3">
                                                    <Link to="#" className="btn btn-soft-danger rounded-4">Fermer et supprimer ce compte</Link>
                                                    <Link to="#" className="btn btn-light rounded-4">Annuler</Link>
                                                </div>
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default EditProfile;