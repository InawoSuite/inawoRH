import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row, Nav, NavItem, NavLink, TabContent, TabPane, Button, Badge, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, Input, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import classnames from "classnames";
import { useTranslation } from "react-i18next";

import progileBg from "../../../../assets/images/profile-bg.jpg";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../../../assets/images/users/avatar-5.jpg";

const USER_DATA = {
    name: "Anna Adame",
    role: "Propriétaire & Fondatrice",
    location: "Californie, États-Unis",
    company: "Themesbrand",
    avatar: avatar1,
    followers: "24,3 k",
    following: "1,3 k",
    fullName: "Anna Adame",
    mobile: "+1 (987) 654-3210",
    email: "anna.adame@velzon.com",
    joiningDate: "15 mars 2020",
    about: "Bonjour, je suis Anna Adame. Ce sera aussi simple que l'occidental ; en fait, ce sera occidental. Pour un Anglais, cela ressemblera à de l'anglais simplifié, comme me l'a dit un ami sceptique de Cambridge à propos de ce que l'occidental est : les langues européennes sont membres de la même famille.",
    aboutExtended: "Vous voulez toujours vous assurer que vos polices fonctionnent bien ensemble et essayez de limiter le nombre de polices que vous utilisez à trois ou moins. Expérimentez et jouez avec les polices que vous avez déjà dans le logiciel avec lequel vous travaillez sur des sites Web de polices réputés.",
    designation: "Designer Principal",
    website: "www.velzon.com"
};

const SKILLS = [
    "Photoshop", "Illustrator", "HTML", "CSS",
    "JavaScript", "PHP", "Python", "React", "Node.js"
];

const SUGGESTIONS = [
    { id: 1, name: "Jean Dupont", role: "Designer UI", avatar: avatar2, mutual: 5 },
    { id: 2, name: "Sarah Martin", role: "Développeuse", avatar: avatar3, mutual: 3 },
    { id: 3, name: "Michel Durand", role: "Chef de Projet", avatar: avatar4, mutual: 8 },
    { id: 4, name: "Emma Wilson", role: "Designeuse UX", avatar: avatar5, mutual: 2 }
];

const POPULAR_POSTS = [
    {
        id: 1,
        title: "10 conseils de design UI pour débutants",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        date: "15 janv. 2024",
        author: "Anna Adame",
        likes: 234,
        comments: 45
    },
    {
        id: 2,
        title: "Meilleures pratiques React 2024",
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        date: "12 janv. 2024",
        author: "Anna Adame",
        likes: 189,
        comments: 32
    },
    {
        id: 3,
        title: "Maîtriser les composants Figma",
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        date: "8 janv. 2024",
        author: "Anna Adame",
        likes: 143,
        comments: 19
    }
];

const RECENT_ACTIVITIES = [
    { id: 1, user: "Jean Dupont", action: "a créé un nouveau projet", project: "Application E-commerce", time: "il y a 2 heures", icon: "ri-folder-4-line" },
    { id: 2, user: "Sarah Martin", action: "a commenté sur", project: "Design du tableau de bord", time: "il y a 5 heures", icon: "ri-chat-4-line" },
    { id: 3, user: "Michel Durand", action: "a mis à jour la tâche", project: "Correction de bugs", time: "il y a 1 jour", icon: "ri-task-line" },
    { id: 4, user: "Emma Wilson", action: "a téléversé des fichiers vers", project: "Application Mobile", time: "il y a 2 jours", icon: "ri-upload-line" }
];

const PROJECTS_OVERVIEW = [
    { id: 1, name: "Plateforme E-commerce", status: "En cours", progress: 75, color: "success", members: [avatar1, avatar2, avatar3] },
    { id: 2, name: "Tableau de bord Admin", status: "Terminé", progress: 100, color: "primary", members: [avatar1, avatar4] },
    { id: 3, name: "Design App Mobile", status: "En révision", progress: 90, color: "warning", members: [avatar2, avatar3, avatar5] },
    { id: 4, name: "Système CRM", status: "Nouveau", progress: 10, color: "info", members: [avatar1, avatar5] },
    { id: 5, name: "Site Portfolio", status: "En cours", progress: 60, color: "success", members: [avatar3, avatar4] },
    { id: 6, name: "App Réseaux sociaux", status: "Planification", progress: 25, color: "secondary", members: [avatar1, avatar2, avatar4] },
    { id: 7, name: "Tableau de bord Analytics", status: "En cours", progress: 45, color: "success", members: [avatar2, avatar5] },
    { id: 8, name: "Système d'inventaire", status: "Nouveau", progress: 5, color: "info", members: [avatar3] },
    { id: 9, name: "Gestion RH", status: "En révision", progress: 85, color: "warning", members: [avatar1, avatar4, avatar5] },
    { id: 10, name: "Plateforme d'apprentissage", status: "En cours", progress: 55, color: "success", members: [avatar2, avatar3] },
    { id: 11, name: "Système de réservation", status: "Terminé", progress: 100, color: "primary", members: [avatar1, avatar2] },
    { id: 12, name: "Application de chat", status: "En cours", progress: 70, color: "success", members: [avatar4, avatar5] }
];

const DOCUMENTS = [
    { id: 1, name: "Proposition de projet.pdf", type: "Fichier PDF", size: "2,3 Mo", date: "2024-01-15" },
    { id: 2, name: "Assets de design.zip", type: "Fichier ZIP", size: "15,7 Mo", date: "2024-01-14" },
    { id: 3, name: "Présentation.pptx", type: "Fichier PPTX", size: "5,1 Mo", date: "2024-01-13" },
    { id: 4, name: "Documentation.docx", type: "Fichier DOCX", size: "1,8 Mo", date: "2024-01-12" },
    { id: 5, name: "Assets d'images.zip", type: "Fichier ZIP", size: "25,3 Mo", date: "2024-01-11" }
];

const ProfileHeader = ({ user }) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="profile-foreground position-relative mx-n4 mt-n4">
                <div className="profile-wid-bg">
                    <img src={progileBg} className="profile-wid-img" alt={t("Fond de profil")} />
                </div>
            </div>
            <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
                <div className="row g-4">
                    <div className="col-auto">
                        <div className="avatar-lg">
                            <img src={user.avatar} alt={user.name} className="img-thumbnail rounded-circle" />
                        </div>
                    </div>
                    <div className="col">
                        <div className="p-2">
                            <h1 className="text-white mb-1 fs-2">{user.name}</h1>
                            <p className="text-white fs-5">{t(user.role)}</p>
                            <div className="hstack text-white gap-1">
                                <div className="me-2">
                                    <i className="ri-map-pin-user-line me-1 text-white text-opacity-75 fs-16 align-middle" />
                                    {t(user.location)}
                                </div>
                                <div>
                                    <i className="ri-building-line me-1 text-opacity-75 text-white fs-16 align-middle" />
                                    {user.company}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-auto order-last order-lg-0">
                        <div className="row text-white-50 text-center">
                            <div className="col-lg-6 col-4">
                                <div className="p-2">
                                    <h4 className="text-white mb-1">{user.followers}</h4>
                                    <p className="text-white-50 mb-0">{t("Abonnés")}</p>
                                </div>
                            </div>
                            <div className="col-lg-6 col-4">
                                <div className="p-2">
                                    <h4 className="text-white mb-1">{user.following}</h4>
                                    <p className="text-white-50 mb-0">{t("Abonnements")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const OptionDropdown = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)} direction="start">
            <DropdownToggle tag="button" className="btn btn-soft-secondary rounded-4 btn-sm">
                <i className="ri-more-fill"></i>
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem><i className="ri-eye-line me-2"></i>{t("Voir")}</DropdownItem>
                <DropdownItem><i className="ri-pencil-line me-2"></i>{t("Modifier")}</DropdownItem>
                <DropdownItem><i className="ri-delete-bin-line me-2"></i>{t("Supprimer")}</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

const CompleteProfileCard = () => {
    const { t } = useTranslation();
    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardBody>
                <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-0">{t("Complétez votre profil")}</h5>
                    </div>
                </div>
                <div className="progress animated-progress custom-progress progress-label mb-3">
                    <div className="progress-bar bg-danger" role="progressbar" style={{ width: "30%" }}
                        aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">
                        <div className="label">30%</div>
                    </div>
                </div>

                <h6 className="mt-4 mb-3">{t("Informations personnelles")}</h6>
                <Row>
                    <Col md={6}>
                        <div className="mb-3">
                            <Label className="form-label text-muted">{t("Nom complet")}</Label>
                            <p className="fw-semibold">{USER_DATA.fullName}</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="mb-3">
                            <Label className="form-label text-muted">{t("Téléphone")}</Label>
                            <p className="fw-semibold">{USER_DATA.mobile}</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="mb-3">
                            <Label className="form-label text-muted">{t("Email")}</Label>
                            <p className="fw-semibold">{USER_DATA.email}</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="mb-3">
                            <Label className="form-label text-muted">{t("Localisation")}</Label>
                            <p className="fw-semibold">{t(USER_DATA.location)}</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="mb-3">
                            <Label className="form-label text-muted">{t("Date d'arrivée")}</Label>
                            <p className="fw-semibold">{t(USER_DATA.joiningDate)}</p>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

const PortfolioCard = () => {
    const { t } = useTranslation();
    const links = [
        { icon: "ri-github-fill", bg: "dark", color: "light" },
        { icon: "ri-global-fill", bg: "primary", color: "white" },
        { icon: "ri-dribbble-fill", bg: "success", color: "white" },
        { icon: "ri-pinterest-fill", bg: "danger", color: "white" }
    ];

    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardBody>
                <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-0">{t("Portfolio")}</h5>
                    </div>
                </div>
                <div className="mb-3 d-flex flex-wrap gap-2">
                    {links.map((link, index) => (
                        <div key={index} className="avatar-xs d-block">
                            <span className={`avatar-title rounded-circle fs-16 bg-${link.bg} text-${link.color}`}>
                                <i className={link.icon}></i>
                            </span>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

const SkillsCard = ({ skills }) => {
    const { t } = useTranslation();
    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardBody>
                <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-0">{t("Compétences")}</h5>
                    </div>
                    <OptionDropdown />
                </div>
                <div className="d-flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                        <a href="#!" key={index} className="btn btn-soft-secondary rounded-4 btn-sm" onClick={(e) => e.preventDefault()}>
                            {skill}
                        </a>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

const SuggestionsCard = ({ suggestions }) => {
    const { t } = useTranslation();
    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardBody>
                <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-0">{t("Suggestions")}</h5>
                    </div>
                    <OptionDropdown />
                </div>
                <div className="mb-3">
                    {suggestions.map(suggestion => (
                        <div key={suggestion.id} className="d-flex align-items-center mb-3">
                            <div className="flex-shrink-0">
                                <img src={suggestion.avatar} alt={suggestion.name} className="avatar-xs rounded-circle" />
                            </div>
                            <div className="flex-grow-1 ms-2">
                                <h6 className="mb-0">{suggestion.name}</h6>
                                <p className="text-muted mb-0 small">{t(suggestion.role)} • {suggestion.mutual} {t("en commun")}</p>
                            </div>
                            <Button className="rounded-4" color="soft-primary" size="sm">
                                <i className="ri-add-line"></i>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

const PopularPostsCard = ({ posts }) => {
    const { t } = useTranslation();
    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardBody>
                <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-0">{t("Articles populaires")}</h5>
                    </div>
                    <OptionDropdown />
                </div>
                <div className="mb-3">
                    {posts.map(post => (
                        <a
                            href="#!"
                            key={post.id}
                            className="text-decoration-none text-body"
                            onClick={(e) => e.preventDefault()}
                        >
                            <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                                <div className="flex-shrink-0">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="rounded-3"
                                        style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                    />
                                </div>
                                <div className="flex-grow-1 ms-3" style={{ minWidth: 0 }}>
                                    <h6 className="mb-1 fs-14 fw-semibold text-truncate" style={{ maxWidth: "180px" }}>
                                        {post.title}
                                    </h6>
                                    <div className="d-flex align-items-center gap-3 text-muted small">
                                        <span>
                                            <i className="ri-calendar-line me-1"></i>
                                            {post.date}
                                        </span>
                                        <span>
                                            <i className="ri-heart-3-line me-1"></i>
                                            {post.likes}
                                        </span>
                                        <span>
                                            <i className="ri-chat-4-line me-1"></i>
                                            {post.comments}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

const AboutSection = ({ user }) => {
    const { t, i18n } = useTranslation();
    const aboutText = (i18n.language || "fr").startsWith("en")
        ? "Hello, I am Anna Adame. It will be as simple as Western; in fact, it will be Western. For an English speaker, it will look like simplified English, as a skeptical friend from Cambridge told me about what Western is: European languages are members of the same family."
        : user.about;
    const aboutExtendedText = (i18n.language || "fr").startsWith("en")
        ? "You always want to make sure your fonts work well together and try to limit the number of fonts you use to three or fewer. Experiment and play with the fonts you already have in your software using reputable font websites."
        : user.aboutExtended;
    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardHeader className="rounded-top-4">
                <h5 className="card-title mb-0">{t("À propos")}</h5>
            </CardHeader>
            <CardBody>
                <p className="text-muted mb-3">{aboutText}</p>
                <p className="text-muted mb-4">{aboutExtendedText}</p>

                <div className="row">
                    <div className="col-6 col-md-4">
                        <div className="d-flex mt-2">
                            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                                <div className="avatar-title bg-light text-primary rounded-circle fs-16">
                                    <i className="ri-user-2-fill"></i>
                                </div>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                                <p className="mb-1">{t("Poste")} :</p>
                                <h6 className="text-truncate mb-0">{t(user.designation)}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4">
                        <div className="d-flex mt-2">
                            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                                <div className="avatar-title bg-light text-primary rounded-circle fs-16">
                                    <i className="ri-global-line"></i>
                                </div>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                                <p className="mb-1">{t("Site web")} :</p>
                                <a href={`https://${user.website}`} className="fw-semibold" target="_blank" rel="noopener noreferrer">
                                    {user.website}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

const RecentActivityCard = ({ activities }) => {
    const [filter, setFilter] = useState("monthly");
    const { t } = useTranslation();

    const getFilteredActivities = () => {
        switch (filter) {
            case "daily":
                return activities.slice(0, 2);
            case "weekly":
                return activities;
            case "monthly":
                return [...activities, ...activities];
            default:
                return activities;
        }
    };

    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardHeader className="d-flex align-items-center rounded-top-4">
                <h5 className="card-title mb-0 flex-grow-1">{t("Activité récente")}</h5>
                <div className="flex-shrink-0">
                    <div className="btn-group" role="group">
                        <Button
                            color="soft-primary"
                            size="sm"
                            className={filter === "daily" ? "active" : ""}
                            onClick={() => setFilter("daily")}
                        >
                            {t("Jour")}
                        </Button>
                        <Button
                            color="soft-primary"
                            size="sm"
                            className={filter === "weekly" ? "active" : ""}
                            onClick={() => setFilter("weekly")}
                        >
                            {t("Semaine")}
                        </Button>
                        <Button
                            color="soft-primary"
                            size="sm"
                            className={filter === "monthly" ? "active" : ""}
                            onClick={() => setFilter("monthly")}
                        >
                            {t("Mois")}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                {getFilteredActivities().map(activity => (
                    <div key={activity.id} className="d-flex align-items-center mb-3">
                        <div className="flex-shrink-0 avatar-sm">
                            <div className="avatar-title bg-light text-primary rounded-circle fs-18">
                                <i className={activity.icon}></i>
                            </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1">
                                <span className="fw-semibold">{activity.user}</span> {t(activity.action)}{' '}
                                <span className="fw-semibold text-primary">{t(activity.project)}</span>
                            </h6>
                            <p className="text-muted mb-0">{t(activity.time)}</p>
                        </div>
                    </div>
                ))}
            </CardBody>
        </Card>
    );
};

const ProjectsOverviewCard = ({ projects }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const projectsPerPage = 3;
    const { t } = useTranslation();

    const nextPage = () => {
        if ((currentPage + 1) * projectsPerPage < projects.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const displayedProjects = projects.slice(
        currentPage * projectsPerPage,
        (currentPage + 1) * projectsPerPage
    );

    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardHeader className="d-flex rounded-top-4 align-items-center">
                <h5 className="card-title mb-0 flex-grow-1">{t("Projets")}</h5>
                <div className="flex-shrink-0">
                    <div className="btn-group" role="group">
                        <Button color="soft-primary" size="sm" onClick={prevPage} disabled={currentPage === 0}>
                            <i className="ri-arrow-left-s-line"></i>
                        </Button>
                        <Button color="soft-primary" size="sm" onClick={nextPage} disabled={(currentPage + 1) * projectsPerPage >= projects.length}>
                            <i className="ri-arrow-right-s-line"></i>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                <Row>
                    {displayedProjects.map(project => (
                        <Col md={4} key={project.id}>
                            <Card className="shadow-none rounded-4 border">
                                <CardBody>
                                    <div className="d-flex mb-3">
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">{t(project.name)}</h6>
                                            <Badge color={project.color} className="mt-1">
                                                {t(project.status)}
                                            </Badge>
                                        </div>
                                        <OptionDropdown />
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>{t("Progression")}</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <div className="progress" style={{ height: "5px" }}>
                                            <div className={`progress-bar bg-${project.color}`} style={{ width: `${project.progress}%` }} />
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-group flex-grow-1">
                                            {project.members.map((member, idx) => (
                                                <div key={idx} className="avatar-group-item">
                                                    <img src={member} alt={t("Membre")} className="avatar-xs rounded-circle" />
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <Badge color="light" pill>{t("12 tâches")}</Badge>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </CardBody>
        </Card>
    );
};

const ActivitiesTab = ({ activities }) => {
    const { t } = useTranslation();
    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardHeader className="rounded-top-4">
                <h5 className="card-title mb-0">{t("Activités")}</h5>
            </CardHeader>
            <CardBody>
                {activities.map(activity => (
                    <div key={activity.id} className="d-flex align-items-center mb-4 pb-2 border-bottom">
                        <div className="flex-shrink-0 avatar-md">
                            <div className="avatar-title bg-light text-primary rounded-circle fs-20">
                                <i className={activity.icon}></i>
                            </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1">
                                <span className="fw-semibold">{activity.user}</span> {t(activity.action)}{' '}
                                <span className="fw-semibold text-primary">{t(activity.project)}</span>
                            </h6>
                            <p className="text-muted mb-0">
                                <i className="ri-time-line me-1"></i>
                                {t(activity.time)}
                            </p>
                        </div>
                    </div>
                ))}
            </CardBody>
        </Card>
    );
};

const ProjectsTab = ({ projects }) => {
    const { t } = useTranslation();
    return (
        <>
            <div className="d-flex align-items-center mb-4">
                <h5 className="card-title mb-0 flex-grow-1">{t("Projets")} (12)</h5>
                <div className="flex-shrink-0">
                    <Button className="rounded-4" color="soft-primary" size="sm">
                        <i className="ri-filter-3-line me-1"></i>{t("Filtrer")}
                    </Button>
                </div>
            </div>
            <Row>
                {projects.map(project => (
                    <Col xxl={3} md={6} key={project.id}>
                        <Card className="shadow-none rounded-4 border">
                            <CardBody>
                                <div className="d-flex mb-3">
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1">{t(project.name)}</h6>
                                        <Badge color={project.color} className="mt-1">
                                            {t(project.status)}
                                        </Badge>
                                    </div>
                                    <OptionDropdown />
                                </div>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>{t("Progression")}</span>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <div className="progress" style={{ height: "5px" }}>
                                        <div className={`progress-bar bg-${project.color}`} style={{ width: `${project.progress}%` }} />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="avatar-group flex-grow-1">
                                        {project.members.map((member, idx) => (
                                            <div key={idx} className="avatar-group-item">
                                                <img src={member} alt={t("Membre")} className="avatar-xs rounded-circle" />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <Badge color="light" pill>{t("12 tâches")}</Badge>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
};

const DocumentsTab = ({ documents }) => {
    const { t } = useTranslation();
    const handleAction = (action, doc) => {
        console.log(`${action} document:`, doc);
    };

    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardHeader className="rounded-top-4">
                <h5 className="card-title mb-0">{t("Documents")}</h5>
            </CardHeader>
            <CardBody>
                <Table responsive className="align-middle">
                    <thead>
                        <tr>
                            <th>{t("Nom du fichier")}</th>
                            <th>{t("Type")}</th>
                            <th>{t("Taille")}</th>
                            <th>{t("Date d'upload")}</th>
                            <th>{t("Action")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map(doc => (
                            <tr key={doc.id}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <i className={`ri-file-${doc.type === 'Fichier ZIP' ? 'zip' : 'copy'}-line fs-18 me-2`}></i>
                                        {doc.name}
                                    </div>
                                </td>
                                <td>{t(doc.type)}</td>
                                <td>{doc.size}</td>
                                <td>{doc.date}</td>
                                <td>
                                    <UncontrolledDropdown>
                                        <DropdownToggle tag="button" className="btn btn-soft-secondary rounded-4 btn-sm">
                                            <i className="ri-more-2-fill"></i>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={() => handleAction('view', doc)}>
                                                <i className="ri-eye-line me-2"></i>{t("Voir")}
                                            </DropdownItem>
                                            <DropdownItem onClick={() => handleAction('download', doc)}>
                                                <i className="ri-download-line me-2"></i>{t("Télécharger")}
                                            </DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem className="text-danger" onClick={() => handleAction('delete', doc)}>
                                                <i className="ri-delete-bin-line me-2"></i>{t("Supprimer")}
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const Preference = () => {
    const [activeMainTab, setActiveMainTab] = useState("overview");
    const { t } = useTranslation();

    useEffect(() => {
        document.title = t("Détails Candidature");
    }, [t]);

    const tabs = [
        { id: "overview", label: t("Aperçu"), icon: "ri-airplay-fill" },
        { id: "activities", label: t("Activités"), icon: "ri-list-unordered" },
        { id: "projects", label: t("Projets"), icon: "ri-price-tag-line" },
        { id: "documents", label: t("Documents"), icon: "ri-folder-4-line" }
    ];

    return (
        <Container fluid>
            <ProfileHeader user={USER_DATA} />

            <Row>
                <Col xs={12}>
                    <div className="d-flex profile-wrapper mb-4">
                        <Nav className="nav-pills animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1" role="tablist">
                            {tabs.map(tab => (
                                <NavItem key={tab.id} role="presentation">
                                    <NavLink
                                        className={classnames("fs-14", { active: activeMainTab === tab.id })}
                                        onClick={() => setActiveMainTab(tab.id)}
                                        href="#"
                                    >
                                        <i className={`${tab.icon} d-inline-block d-md-none`}></i>
                                        <span className="d-none d-md-inline-block">{tab.label}</span>
                                    </NavLink>
                                </NavItem>
                            ))}
                        </Nav>
                        <div className="flex-shrink-0">
                            <Link to="/:entreprise/edit-profile" className="btn rounded-4 btn-success">
                                <i className="ri-edit-box-line align-bottom me-1"></i>
                                {t("Modifier le profil")}
                            </Link>
                        </div>
                    </div>
                </Col>

                {activeMainTab === "overview" && (
                    <Col xxl={3}>
                        <div className="tab-content pt-4 text-muted">
                            <CompleteProfileCard />
                            <PortfolioCard />
                            <SkillsCard skills={SKILLS} />
                            <SuggestionsCard suggestions={SUGGESTIONS} />
                            <PopularPostsCard posts={POPULAR_POSTS} />
                        </div>
                    </Col>
                )}

                <Col xxl={activeMainTab === "overview" ? 9 : 12}>
                    <TabContent activeTab={activeMainTab} className="pt-4 text-muted">
                        <TabPane tabId="overview">
                            <AboutSection user={USER_DATA} />
                            <RecentActivityCard activities={RECENT_ACTIVITIES} />
                            <ProjectsOverviewCard projects={PROJECTS_OVERVIEW.slice(0, 6)} />
                        </TabPane>

                        <TabPane tabId="activities">
                            <ActivitiesTab activities={RECENT_ACTIVITIES} />
                        </TabPane>

                        <TabPane tabId="projects">
                            <ProjectsTab projects={PROJECTS_OVERVIEW} />
                        </TabPane>

                        <TabPane tabId="documents">
                            <DocumentsTab documents={DOCUMENTS} />
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </Container>
    );
};

const DetailsCandidature = () => {
    const { t } = useTranslation();
    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title={t("Détails Candidature")}
                    pageTitle={
                        <>
                            <i className="ri-team-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>&nbsp;&gt;
                        </>
                    }
                />
                <Preference />
            </Container>
        </div>
    );
};

export default DetailsCandidature;