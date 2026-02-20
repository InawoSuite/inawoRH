import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row, Nav, NavItem, NavLink, TabContent, TabPane, Button, Badge, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown, Input, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import classnames from "classnames";

import progileBg from "../../../../assets/images/profile-bg.jpg";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../../../assets/images/users/avatar-5.jpg";

const USER_DATA = {
    name: "Anna Adame",
    role: "Owner & Founder",
    location: "California, United States",
    company: "Themesbrand",
    avatar: avatar1,
    followers: "24.3K",
    following: "1.3K",
    fullName: "Anna Adame",
    mobile: "+1 (987) 654-3210",
    email: "anna.adame@velzon.com",
    joiningDate: "15 Mar, 2020",
    about: "Hi I'm Anna Adame, It will be as simple as Occidental; in fact, it will be Occidental. To an English person, it will seem like simplified English, as a skeptical Cambridge friend of mine told me what Occidental is European languages are members of the same family.",
    aboutExtended: "You always want to make sure that your fonts work well together and try to limit the number of fonts you use to three or less. Experiment and play around with the fonts that you already have in the software you're working with reputable font websites.",
    designation: "Lead Designer",
    website: "www.velzon.com"
};

const SKILLS = [
    "Photoshop", "Illustrator", "HTML", "CSS", 
    "JavaScript", "PHP", "Python", "React", "Node.js"
];

const SUGGESTIONS = [
    { id: 1, name: "John Doe", role: "UI Designer", avatar: avatar2, mutual: 5 },
    { id: 2, name: "Sarah Smith", role: "Developer", avatar: avatar3, mutual: 3 },
    { id: 3, name: "Mike Johnson", role: "Project Manager", avatar: avatar4, mutual: 8 },
    { id: 4, name: "Emma Wilson", role: "UX Designer", avatar: avatar5, mutual: 2 }
];

const POPULAR_POSTS = [
    { 
        id: 1, 
        title: "10 UI Design Tips for Beginners", 
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        date: "15 Jan 2024",
        author: "Anna Adame",
        likes: 234,
        comments: 45
    },
    { 
        id: 2, 
        title: "React Best Practices 2024", 
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        date: "12 Jan 2024",
        author: "Anna Adame",
        likes: 189,
        comments: 32
    },
    { 
        id: 3, 
        title: "Mastering Figma Components", 
        image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        date: "08 Jan 2024",
        author: "Anna Adame",
        likes: 143,
        comments: 19
    }
];

const RECENT_ACTIVITIES = [
    { id: 1, user: "John Doe", action: "created a new project", project: "E-commerce App", time: "2 hours ago", icon: "ri-folder-4-line" },
    { id: 2, user: "Sarah Smith", action: "commented on", project: "Dashboard Design", time: "5 hours ago", icon: "ri-chat-4-line" },
    { id: 3, user: "Mike Johnson", action: "updated task", project: "Bug Fixing", time: "1 day ago", icon: "ri-task-line" },
    { id: 4, user: "Emma Wilson", action: "uploaded files to", project: "Mobile App", time: "2 days ago", icon: "ri-upload-line" }
];

const PROJECTS_OVERVIEW = [
    { id: 1, name: "E-commerce Platform", status: "In Progress", progress: 75, color: "success", members: [avatar1, avatar2, avatar3] },
    { id: 2, name: "Admin Dashboard", status: "Completed", progress: 100, color: "primary", members: [avatar1, avatar4] },
    { id: 3, name: "Mobile App Design", status: "Review", progress: 90, color: "warning", members: [avatar2, avatar3, avatar5] },
    { id: 4, name: "CRM System", status: "New", progress: 10, color: "info", members: [avatar1, avatar5] },
    { id: 5, name: "Portfolio Website", status: "In Progress", progress: 60, color: "success", members: [avatar3, avatar4] },
    { id: 6, name: "Social Media App", status: "Planning", progress: 25, color: "secondary", members: [avatar1, avatar2, avatar4] },
    { id: 7, name: "Analytics Dashboard", status: "In Progress", progress: 45, color: "success", members: [avatar2, avatar5] },
    { id: 8, name: "Inventory System", status: "New", progress: 5, color: "info", members: [avatar3] },
    { id: 9, name: "HR Management", status: "Review", progress: 85, color: "warning", members: [avatar1, avatar4, avatar5] },
    { id: 10, name: "Learning Platform", status: "In Progress", progress: 55, color: "success", members: [avatar2, avatar3] },
    { id: 11, name: "Booking System", status: "Completed", progress: 100, color: "primary", members: [avatar1, avatar2] },
    { id: 12, name: "Chat Application", status: "In Progress", progress: 70, color: "success", members: [avatar4, avatar5] }
];

const DOCUMENTS = [
    { id: 1, name: "Project Proposal.pdf", type: "PDF File", size: "2.3 MB", date: "2024-01-15" },
    { id: 2, name: "Design Assets.zip", type: "ZIP File", size: "15.7 MB", date: "2024-01-14" },
    { id: 3, name: "Presentation.pptx", type: "PPTX File", size: "5.1 MB", date: "2024-01-13" },
    { id: 4, name: "Documentation.docx", type: "DOCX File", size: "1.8 MB", date: "2024-01-12" },
    { id: 5, name: "Image Assets.zip", type: "ZIP File", size: "25.3 MB", date: "2024-01-11" }
];

const ProfileHeader = ({ user }) => {
    return (
        <>
            <div className="profile-foreground position-relative mx-n4 mt-n4">
                <div className="profile-wid-bg">
                    <img src={progileBg} className="profile-wid-img" alt="Profile Background" />
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
                            <p className="text-white fs-5">{user.role}</p>
                            <div className="hstack text-white gap-1">
                                <div className="me-2">
                                    <i className="ri-map-pin-user-line me-1 text-white text-opacity-75 fs-16 align-middle" />
                                    {user.location}
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
                                    <p className="text-white-50 mb-0">Followers</p>
                                </div>
                            </div>
                            <div className="col-lg-6 col-4">
                                <div className="p-2">
                                    <h4 className="text-white mb-1">{user.following}</h4>
                                    <p className="text-white-50 mb-0">Following</p>
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
    
    return (
        <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)} direction="start">
            <DropdownToggle tag="button" className="btn btn-soft-secondary rounded-4 btn-sm">
                <i className="ri-more-fill"></i>
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem><i className="ri-eye-line me-2"></i>View</DropdownItem>
                <DropdownItem><i className="ri-pencil-line me-2"></i>Edit</DropdownItem>
                <DropdownItem><i className="ri-delete-bin-line me-2"></i>Delete</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

const CompleteProfileCard = () => {
    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardBody>
                <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-0">Complete Your Profile</h5>
                    </div>
                </div>
                <div className="progress animated-progress custom-progress progress-label mb-3">
                    <div className="progress-bar bg-danger" role="progressbar" style={{ width: "30%" }}
                        aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">
                        <div className="label">30%</div>
                    </div>
                </div>
                
                <h6 className="mt-4 mb-3">Personal Information</h6>
                <Row>
                    <Col md={6}>
                        <div className="mb-3">
                            <Label className="form-label text-muted">Full Name</Label>
                            <p className="fw-semibold">{USER_DATA.fullName}</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="mb-3">
                            <Label className="form-label text-muted">Mobile</Label>
                            <p className="fw-semibold">{USER_DATA.mobile}</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="mb-3">
                            <Label className="form-label text-muted">Email</Label>
                            <p className="fw-semibold">{USER_DATA.email}</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="mb-3">
                            <Label className="form-label text-muted">Location</Label>
                            <p className="fw-semibold">{USER_DATA.location}</p>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="mb-3">
                            <Label className="form-label text-muted">Joining Date</Label>
                            <p className="fw-semibold">{USER_DATA.joiningDate}</p>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

const PortfolioCard = () => {
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
                        <h5 className="card-title mb-0">Portfolio</h5>
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
    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardBody>
                <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-0">Skills</h5>
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
    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardBody>
                <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-0">Suggestions</h5>
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
                                <p className="text-muted mb-0 small">{suggestion.role} • {suggestion.mutual} mutual</p>
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
    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardBody>
                <div className="d-flex align-items-center mb-4">
                    <div className="flex-grow-1">
                        <h5 className="card-title mb-0">Popular Posts</h5>
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
    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardHeader className="rounded-top-4">
                <h5 className="card-title mb-0">About</h5>
            </CardHeader>
            <CardBody>
                <p className="text-muted mb-3">{user.about}</p>
                <p className="text-muted mb-4">{user.aboutExtended}</p>
                
                <div className="row">
                    <div className="col-6 col-md-4">
                        <div className="d-flex mt-2">
                            <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                                <div className="avatar-title bg-light text-primary rounded-circle fs-16">
                                    <i className="ri-user-2-fill"></i>
                                </div>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                                <p className="mb-1">Designation :</p>
                                <h6 className="text-truncate mb-0">{user.designation}</h6>
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
                                <p className="mb-1">Website :</p>
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
    
    const getFilteredActivities = () => {
        switch(filter) {
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
                <h5 className="card-title mb-0 flex-grow-1">Recent Activity</h5>
                <div className="flex-shrink-0">
                    <div className="btn-group" role="group">
                        <Button
                            
                            color="soft-primary" 
                            size="sm"
                            className={filter === "daily" ? "active" : ""}
                            onClick={() => setFilter("daily")}
                        >
                            Daily
                        </Button>
                        <Button 
                            color="soft-primary" 
                            size="sm"
                            className={filter === "weekly" ? "active" : ""}
                            onClick={() => setFilter("weekly")}
                        >
                            Weekly
                        </Button>
                        <Button
                            
                            color="soft-primary" 
                            size="sm"
                            className={filter === "monthly" ? "active" : ""}
                            onClick={() => setFilter("monthly")}
                        >
                            Monthly
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
                                <span className="fw-semibold">{activity.user}</span> {activity.action}{' '}
                                <span className="fw-semibold text-primary">{activity.project}</span>
                            </h6>
                            <p className="text-muted mb-0">{activity.time}</p>
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
                <h5 className="card-title mb-0 flex-grow-1">Projects</h5>
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
                                            <h6 className="mb-1">{project.name}</h6>
                                            <Badge color={project.color} className="mt-1">
                                                {project.status}
                                            </Badge>
                                        </div>
                                        <OptionDropdown />
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Progress</span>
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
                                                    <img src={member} alt="" className="avatar-xs rounded-circle" />
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <Badge color="light" pill>12 tasks</Badge>
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
    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardHeader className="rounded-top-4">
                <h5 className="card-title mb-0">Activities</h5>
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
                                <span className="fw-semibold">{activity.user}</span> {activity.action}{' '}
                                <span className="fw-semibold text-primary">{activity.project}</span>
                            </h6>
                            <p className="text-muted mb-0">
                                <i className="ri-time-line me-1"></i>
                                {activity.time}
                            </p>
                        </div>
                    </div>
                ))}
            </CardBody>
        </Card>
    );
};

const ProjectsTab = ({ projects }) => {
    return (
        <>
            <div className="d-flex align-items-center mb-4">
                <h5 className="card-title mb-0 flex-grow-1">Projects (12)</h5>
                <div className="flex-shrink-0">
                    <Button className="rounded-4" color="soft-primary" size="sm">
                        <i className="ri-filter-3-line me-1"></i>Filter
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
                                        <h6 className="mb-1">{project.name}</h6>
                                        <Badge color={project.color} className="mt-1">
                                            {project.status}
                                        </Badge>
                                    </div>
                                    <OptionDropdown />
                                </div>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Progress</span>
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
                                                <img src={member} alt="" className="avatar-xs rounded-circle" />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <Badge color="light" pill>12 tasks</Badge>
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
    const handleAction = (action, doc) => {
        console.log(`${action} document:`, doc);
        // Implémenter les actions réelles ici
    };
    
    return (
        <Card className="rounded-4 border-0 shadow-sm">
            <CardHeader className="rounded-top-4">
                <h5 className="card-title mb-0">Documents</h5>
            </CardHeader>
            <CardBody>
                <Table responsive className="align-middle">
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Upload Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map(doc => (
                            <tr key={doc.id}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <i className={`ri-file-${doc.type === 'ZIP File' ? 'zip' : 'copy'}-line fs-18 me-2`}></i>
                                        {doc.name}
                                    </div>
                                </td>
                                <td>{doc.type}</td>
                                <td>{doc.size}</td>
                                <td>{doc.date}</td>
                                <td>
                                    <UncontrolledDropdown>
                                        <DropdownToggle tag="button" className="btn btn-soft-secondary rounded-4 btn-sm">
                                            <i className="ri-more-2-fill"></i>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={() => handleAction('view', doc)}>
                                                <i className="ri-eye-line me-2"></i>View
                                            </DropdownItem>
                                            <DropdownItem onClick={() => handleAction('download', doc)}>
                                                <i className="ri-download-line me-2"></i>Download
                                            </DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem className="text-danger" onClick={() => handleAction('delete', doc)}>
                                                <i className="ri-delete-bin-line me-2"></i>Delete
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

    useEffect(() => {
        document.title = "Details Candidature";
    }, []);

    const tabs = [
        { id: "overview", label: "Overview", icon: "ri-airplay-fill" },
        { id: "activities", label: "Activities", icon: "ri-list-unordered" },
        { id: "projects", label: "Projects", icon: "ri-price-tag-line" },
        { id: "documents", label: "Documents", icon: "ri-folder-4-line" }
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
                                Edit Profile
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
    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title="Details Candidature"
                    pageTitle={
                        <>
                            <i className="ri-team-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                        </>
                    }
                />
                <Preference />
            </Container>
        </div>
    );
};

export default DetailsCandidature;