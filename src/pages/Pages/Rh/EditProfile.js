import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane, FormGroup } from 'reactstrap';
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import { CustomSelect } from "../../../Components/Common/CustomSelectStyles";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";

import progileBg from "../../../assets/images/profile-bg.jpg";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

const EditProfile = () => {
    const [activeTab, setActiveTab] = useState("1");
    const { t, i18n } = useTranslation();
    const tr = (fr, en) => ((i18n.language || "fr").startsWith("en") ? en : t(fr));

    // États pour les descriptions Quill
    const [personalDescription, setPersonalDescription] = useState("");
    const [jobDescription, setJobDescription] = useState("");

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

    useEffect(() => {
        setPersonalDescription(
            tr(
                "Bonjour, je suis Anna Adame. Ce sera aussi simple que l'occidental ; en fait, ce sera occidental. Pour un Anglais, cela ressemblera à de l'anglais simplifié, comme me l'a dit un ami sceptique de Cambridge à propos de ce que l'occidental est : les langues européennes sont membres de la même famille.",
                "Hello, I am Anna Adame. It will be as simple as Western; in fact, it will be Western. For an English speaker, it will look like simplified English, as a skeptical friend from Cambridge told me about what Western is: European languages are members of the same family."
            )
        );
        setJobDescription(
            tr(
                "Vous voulez toujours vous assurer que vos polices fonctionnent bien ensemble et essayez de limiter le nombre de polices que vous utilisez à trois ou moins. Expérimentez et jouez avec les polices que vous avez déjà dans le logiciel avec lequel vous travaillez sur des sites Web de polices réputés.",
                "You always want to make sure your fonts work well together and try to limit the number of fonts you use to three or fewer. Experiment and play with the fonts you already have in your software using reputable font websites."
            )
        );
    }, [i18n.language]);

    // Initialisation de Quill pour la description personnelle
    useEffect(() => {
        if (!personalQuillRef.current) return;

        const quillInstance = new Quill(personalQuillRef.current, {
            placeholder: tr("Description personnelle...", "Personal description..."),
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

        setPersonalQuill(quillInstance);

        return () => { };
    }, [i18n.language]);

    // Initialisation de Quill pour la description du poste
    useEffect(() => {
        if (!jobQuillRef.current) return;

        const quillInstance = new Quill(jobQuillRef.current, {
            placeholder: tr("Description du poste...", "Job description..."),
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

        setJobQuill(quillInstance);

        return () => { };
    }, [i18n.language]);

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

    document.title = tr("Modifier le profil", "Edit profile");

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="position-relative mx-n4 mt-n4">
                        <div className="profile-wid-bg profile-setting-img">
                            <img src={progileBg} className="profile-wid-img" alt={tr("Fond de profil", "Profile background")} />
                            <div className="overlay-content">
                                <div className="text-end p-3">
                                    <div className="p-0 ms-auto profile-photo-edit">
                                        <Input id="profile-foreground-img-file-input" type="file"
                                            className="profile-foreground-img-file-input" />
                                        <Label htmlFor="profile-foreground-img-file-input"
                                            className="profile-photo-edit btn btn-light">
                                            <i className="ri-image-edit-line align-bottom me-1"></i> {tr("Changer la couverture", "Change cover")}
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
                                                alt={tr("Photo de profil", "Profile photo")} />
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
                                        <p className="text-muted mb-0">{tr("Designer Principal / Développeuse", "Lead Designer / Developer")}</p>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="mt-4 rounded-4 border-0 shadow-sm">
                                <CardBody>
                                    <div className="d-flex align-items-center mb-5">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title mb-0">{tr("Complétez votre profil", "Complete your profile")}</h5>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Link to="#" className="badge bg-light rounded-4 text-primary fs-12"><i
                                                className="ri-edit-box-line align-bottom me-1"></i> {tr("Modifier", "Edit")}</Link>
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
                                            <h5 className="card-title mb-0">{tr("Portfolio", "Portfolio")}</h5>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Link to="#" className="badge bg-light rounded-4 text-primary fs-12"><i
                                                className="ri-add-fill align-bottom me-1"></i> {tr("Ajouter", "Add")}</Link>
                                        </div>
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-dark text-light">
                                                <i className="ri-github-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="email" className="form-control rounded-4" id="gitUsername" placeholder={tr("Nom d'utilisateur", "Username")}
                                            defaultValue="@daveadame" />
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-primary">
                                                <i className="ri-global-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="text" className="form-control rounded-4" id="websiteInput"
                                            placeholder={tr("www.exemple.com", "www.example.com")} defaultValue="www.velzon.com" />
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-success">
                                                <i className="ri-dribbble-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="text" className="form-control rounded-4" id="dribbleName" placeholder={tr("Nom d'utilisateur", "Username")}
                                            defaultValue="@dave_adame" />
                                    </div>
                                    <div className="d-flex">
                                        <div className="avatar-xs d-block flex-shrink-0 me-3">
                                            <span className="avatar-title rounded-circle fs-16 bg-danger">
                                                <i className="ri-pinterest-fill"></i>
                                            </span>
                                        </div>
                                        <Input type="text" className="form-control rounded-4" id="pinterestName"
                                            placeholder={tr("Nom d'utilisateur", "Username")} defaultValue="Advance Dave" />
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
                                                {tr("Informations personnelles", "Personal information")}
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
                                                {tr("Changer le mot de passe", "Change password")}
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
                                                {tr("Expérience", "Experience")}
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
                                                {tr("Politique de confidentialité", "Privacy policy")}
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
                                                            <Label htmlFor="firstnameInput">{tr("Prénom", "First name")}</Label>
                                                            <Input type="text" className="form-control rounded-4" id="firstnameInput"
                                                                placeholder={tr("Entrez votre prénom", "Enter your first name")} defaultValue="Dave" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="lastnameInput">{tr("Nom", "Last name")}</Label>
                                                            <Input type="text" className="form-control rounded-4" id="lastnameInput"
                                                                placeholder={tr("Entrez votre nom", "Enter your last name")} defaultValue="Adame" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="phonenumberInput">{tr("Téléphone", "Phone")}</Label>
                                                            <Input type="text" className="form-control rounded-4"
                                                                id="phonenumberInput"
                                                                placeholder={tr("Entrez votre numéro de téléphone", "Enter your phone number")}
                                                                defaultValue="+(1) 987 6543" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="emailInput">{tr("Adresse email", "Email address")}</Label>
                                                            <Input type="email" className="form-control rounded-4" id="emailInput"
                                                                placeholder={tr("Entrez votre email", "Enter your email")}
                                                                defaultValue="daveadame@velzon.com" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="JoiningdatInput">{tr("Date d'arrivée", "Joining date")}</Label>
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
                                                            <Label htmlFor="skillsInput">{tr("Compétences", "Skills")}</Label>
                                                            <CustomSelect
                                                                inputId="skillsInput"
                                                                value={selectedSkills}
                                                                onChange={(option) => setSelectedSkills(option)}
                                                                options={skillsOptions}
                                                                placeholder={tr("Sélectionnez vos compétences", "Select your skills")}
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="designationInput">{tr("Poste", "Position")}</Label>
                                                            <Input type="text" className="form-control rounded-4"
                                                                id="designationInput" placeholder={tr("Intitulé du poste", "Job title")}
                                                                defaultValue={tr("Designer Principal / Développeur", "Lead Designer / Developer")} />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={6}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="websiteInput1">{tr("Site web", "Website")}</Label>
                                                            <Input type="text" className="form-control rounded-4" id="websiteInput1"
                                                                placeholder={tr("www.exemple.com", "www.example.com")} defaultValue="www.velzon.com" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="cityInput">{tr("Ville", "City")}</Label>
                                                            <Input type="text" className="form-control rounded-4" id="cityInput"
                                                                placeholder={tr("Ville", "City")} defaultValue={tr("Californie", "California")} />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="countryInput">{tr("Pays", "Country")}</Label>
                                                            <Input type="text" className="form-control rounded-4" id="countryInput"
                                                                placeholder={tr("Pays", "Country")} defaultValue={tr("États-Unis", "United States")} />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <FormGroup className="mb-3">
                                                            <Label htmlFor="zipcodeInput">{tr("Code postal", "ZIP code")}</Label>
                                                            <Input type="text" className="form-control rounded-4" minLength="5"
                                                                maxLength="6" id="zipcodeInput"
                                                                placeholder={tr("Entrez le code postal", "Enter ZIP code")} defaultValue="90011" />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <FormGroup className="mb-3">
                                                            <Label>{tr("Description", "Description")}</Label>
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
                                                            <button type="button" className="btn btn-secondary rounded-4">
                                                                {tr("Mettre à jour", "Update")}
                                                            </button>
                                                            <button type="button"
                                                                className="btn btn-soft-danger rounded-4">{tr("Annuler", "Cancel")}</button>
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
                                                            <Label htmlFor="oldpasswordInput" className="form-label">{tr("Ancien mot de passe", "Old password")}*</Label>
                                                            <Input type="password" className="form-control rounded-4"
                                                                id="oldpasswordInput"
                                                                placeholder={tr("Entrez votre mot de passe actuel", "Enter your current password")} />
                                                        </div>
                                                    </Col>

                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="newpasswordInput" className="form-label">{tr("Nouveau mot de passe", "New password")}*</Label>
                                                            <Input type="password" className="form-control rounded-4"
                                                                id="newpasswordInput" placeholder={tr("Entrez le nouveau mot de passe", "Enter new password")} />
                                                        </div>
                                                    </Col>

                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="confirmpasswordInput" className="form-label">{tr("Confirmer le mot de passe", "Confirm password")}*</Label>
                                                            <Input type="password" className="form-control rounded-4"
                                                                id="confirmpasswordInput"
                                                                placeholder={tr("Confirmez le mot de passe", "Confirm password")} />
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Link to="#"
                                                                className="link-primary text-decoration-underline">{tr("Mot de passe oublié ?", "Forgot password?")}</Link>
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="text-end">
                                                            <button type="button" className="btn btn-secondary rounded-4">{tr("Changer le mot de passe", "Change password")}</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Form>
                                            <div className="mt-4 mb-3 border-bottom pb-2">
                                                <div className="float-end">
                                                    <Link to="#" className="link-primary">{tr("Tout déconnecter", "Log out all")}</Link>
                                                </div>
                                                <h5 className="card-title">{tr("Historique de connexion", "Login history")}</h5>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-4 fs-18">
                                                        <i className="ri-smartphone-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>iPhone 12 Pro</h6>
                                                    <p className="text-muted mb-0">{tr("Los Angeles, États-Unis - 16 mars à 14h47", "Los Angeles, United States - March 16 at 2:47 PM")}</p>
                                                </div>
                                                <div>
                                                    <Link to="#">{tr("Déconnexion", "Log out")}</Link>
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
                                                    <p className="text-muted mb-0">{tr("Washington, États-Unis - 6 novembre à 10h43", "Washington, United States - November 6 at 10:43 AM")}</p>
                                                </div>
                                                <div>
                                                    <Link to="#">{tr("Déconnexion", "Log out")}</Link>
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
                                                    <p className="text-muted mb-0">{tr("Connecticut, États-Unis - 12 juin à 15h24", "Connecticut, United States - June 12 at 3:24 PM")}</p>
                                                </div>
                                                <div>
                                                    <Link to="#">{tr("Déconnexion", "Log out")}</Link>
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
                                                    <p className="text-muted mb-0">{tr("Phoenix, États-Unis - 26 juillet à 8h10", "Phoenix, United States - July 26 at 8:10 AM")}</p>
                                                </div>
                                                <div>
                                                    <Link to="#">{tr("Déconnexion", "Log out")}</Link>
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
                                                                    <Label htmlFor="jobTitle">{tr("Intitulé du poste", "Job title")}</Label>
                                                                    <Input type="text" className="form-control rounded-4"
                                                                        id="jobTitle" placeholder={tr("Titre du poste", "Position title")}
                                                                        defaultValue={tr("Designer Principal / Développeur", "Lead Designer / Developer")} />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col lg={6}>
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="companyName">{tr("Nom de l'entreprise", "Company name")}</Label>
                                                                    <Input type="text" className="form-control rounded-4"
                                                                        id="companyName" placeholder={tr("Nom de l'entreprise", "Company name")}
                                                                        defaultValue="Themesbrand" />
                                                                </FormGroup>
                                                            </Col>

                                                            <Col lg={6}>
                                                                <FormGroup className="mb-3">
                                                                    <label htmlFor="experienceYear"
                                                                        className="form-label">{tr("Années d'expérience", "Years of experience")}</label>
                                                                    <Row>
                                                                        <Col lg={5}>
                                                                            <CustomSelect
                                                                                inputId="experienceYear-1"
                                                                                value={selectedYears}
                                                                                onChange={(option) => setSelectedYears(option)}
                                                                                options={yearsOptions}
                                                                                placeholder={tr("Sélectionnez l'année", "Select year")}
                                                                            />
                                                                        </Col>

                                                                        <div className="col-auto align-self-center">
                                                                            {tr("à", "to")}
                                                                        </div>

                                                                        <Col lg={5}>
                                                                            <CustomSelect
                                                                                inputId="experienceYear-2"
                                                                                value={selectedYears}
                                                                                onChange={(option) => setSelectedYears(option)}
                                                                                options={yearsOptions}
                                                                                placeholder={tr("Sélectionnez l'année", "Select year")}
                                                                            />
                                                                        </Col>
                                                                    </Row>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col lg={12}>
                                                                <FormGroup className="mb-3">
                                                                    <Label htmlFor="jobDescription">{tr("Description du poste", "Job description")}</Label>
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
                                                                    to="#">{tr("Supprimer", "Delete")}</Link>
                                                            </div>
                                                        </Row>
                                                    </div>
                                                </div>
                                                <div id="newForm" style={{ "display": "none" }}>
                                                </div>

                                                <Col lg={12}>
                                                    <div className="hstack gap-2">
                                                        <button type="submit" className="btn btn-primary rounded-4">{tr("Mettre à jour", "Update")}</button>
                                                        <Link to="#" className="btn btn-secondary rounded-4">{tr("Ajouter nouveau", "Add new")}</Link>
                                                    </div>
                                                </Col>
                                            </form>
                                        </TabPane>

                                        <TabPane tabId="4">
                                            <div className="mb-4 pb-2">
                                                <h5 className="card-title text-decoration-underline mb-3">{tr("Sécurité", "Security")} :</h5>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">{tr("Authentification à deux facteurs", "Two-factor authentication")}</h6>
                                                        <p className="text-muted">{tr("L'authentification à deux facteurs est une mesure de sécurité renforcée. Une fois activée, vous devrez fournir deux types d'identification lors de la connexion. Google Authenticator et SMS sont pris en charge.", "Two-factor authentication is an enhanced security measure. Once enabled, you must provide two forms of identification when signing in. Google Authenticator and SMS are supported.")}</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#"
                                                            className="btn btn-sm rounded-4 btn-primary">{tr("Activer l'authentification à deux facteurs", "Enable two-factor authentication")}</Link>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">{tr("Vérification secondaire", "Secondary verification")}</h6>
                                                        <p className="text-muted">{tr("Le premier facteur est un mot de passe et le second inclut généralement un texte avec un code envoyé sur votre smartphone, ou des données biométriques utilisant votre empreinte digitale, votre visage ou votre rétine.", "The first factor is a password and the second usually includes a text code sent to your smartphone, or biometric data using your fingerprint, face, or retina.")}</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#" className="btn btn-sm rounded-4 btn-primary">{tr("Configurer la méthode secondaire", "Set up secondary method")}</Link>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column flex-sm-row mb-4 mb-sm-0 mt-2">
                                                    <div className="flex-grow-1">
                                                        <h6 className="fs-14 mb-1">{tr("Codes de secours", "Backup codes")}</h6>
                                                        <p className="text-muted mb-sm-0">{tr("Un code de secours est automatiquement généré pour vous lorsque vous activez l'authentification à deux facteurs via l'application iOS ou Android Twitter. Vous pouvez également générer un code de secours sur twitter.com.", "A backup code is automatically generated when you enable two-factor authentication via the Twitter iOS or Android app. You can also generate a backup code on twitter.com.")}</p>
                                                    </div>
                                                    <div className="flex-shrink-0 ms-sm-3">
                                                        <Link to="#"
                                                            className="btn btn-sm rounded-4 btn-primary">{tr("Générer des codes de secours", "Generate backup codes")}</Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <h5 className="card-title text-decoration-underline mb-3">{tr("Notifications d'application", "Application notifications")} :</h5>
                                                <ul className="list-unstyled mb-0">
                                                    <li className="d-flex">
                                                        <div className="flex-grow-1">
                                                            <label htmlFor="directMessage"
                                                                className="form-check-label fs-14">{tr("Messages directs", "Direct messages")}</label>
                                                            <p className="text-muted">{tr("Messages des personnes que vous suivez", "Messages from people you follow")}</p>
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
                                                                {tr("Afficher les notifications de bureau", "Show desktop notifications")}
                                                            </Label>
                                                            <p className="text-muted">{tr("Choisissez l'option que vous souhaitez comme paramètre par défaut. Bloquer un site : à côté de \"Non autorisé à envoyer des notifications\", cliquez sur Ajouter.", "Choose the option you want as default. To block a site, next to \"Not allowed to send notifications\", click Add.")}</p>
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
                                                                {tr("Afficher les notifications par email", "Show email notifications")}
                                                            </Label>
                                                            <p className="text-muted">{tr("Sous Paramètres, choisissez Notifications. Sous Sélectionner un compte, choisissez le compte pour lequel activer les notifications.", "In Settings, choose Notifications. Under Select an account, choose the account for which to enable notifications.")}</p>
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
                                                                {tr("Afficher les notifications de chat", "Show chat notifications")}
                                                            </Label>
                                                            <p className="text-muted">{tr("Pour éviter les notifications mobiles en double des applications Gmail et Chat, dans les paramètres, désactivez les notifications de Chat.", "To avoid duplicate mobile notifications from Gmail and Chat, disable Chat notifications in settings.")}</p>
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
                                                                {tr("Afficher les notifications d'achat", "Show purchase notifications")}
                                                            </Label>
                                                            <p className="text-muted">{tr("Recevez des alertes d'achat en temps réel pour vous protéger contre les frais frauduleux.", "Receive real-time purchase alerts to protect against fraudulent charges.")}</p>
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
                                                <h5 className="card-title text-decoration-underline mb-3">{tr("Supprimer ce compte", "Delete this account")} :</h5>
                                                <p className="text-muted">{tr("Allez dans la section Données et confidentialité de votre compte de profil. Faites défiler jusqu'à \"Vos options de données et de confidentialité\". Supprimez votre compte de profil. Suivez les instructions pour supprimer votre compte :", "Go to the Data and privacy section of your profile account. Scroll to \"Your data and privacy options\". Delete your profile account. Follow the instructions to delete your account:")}</p>
                                                <div>
                                                    <Input type="password" className="form-control rounded-4" id="passwordInput"
                                                        placeholder={tr("Entrez votre mot de passe", "Enter your password")} defaultValue="make@321654987"
                                                        style={{ maxWidth: "265px" }} />
                                                </div>
                                                <div className="hstack gap-2 mt-3">
                                                    <Link to="#" className="btn btn-soft-danger rounded-4">{tr("Fermer et supprimer ce compte", "Close and delete this account")}</Link>
                                                    <Link to="#" className="btn btn-light rounded-4">{tr("Annuler", "Cancel")}</Link>
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