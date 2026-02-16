import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane } from 'reactstrap';
import classnames from "classnames";
import BreadCrumb from '../../../../Components/Common/BreadCrumb';


//import images
import progileBg from '../../../../assets/images/profile-bg.jpg';
import avatar1 from '../../../../assets/images/users/avatar-1.jpg';
import smallImage9 from "../../../../assets/images/small/img-9.jpg";
import { toast } from "react-toastify";
import { useProfile } from "../../../../Components/Hooks/UserHooks";


const Settings = () => {
    const [activeTab, setActiveTab] = useState("1");
    const { userProfile, loading: profileLoading } = useProfile();
    const [state, setState] = useState({
        loading: true,
        error: null,
        userData: null,
        profilePhoto: avatar1,
        coverPhoto: smallImage9
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!userProfile?.id) {
                    throw new Error("Session invalide - Veuillez vous reconnecter");
                }

                const response = await fetch(`https://inawoapiv3.inawo.pro/utilisateurs/update-profile/${userProfile.id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                setState(prev => ({
                    ...prev,
                    userData: data,
                    loading: false,
                    profilePhoto: data.photo ?
                        `https://inawoapiv3.inawo.pro${data.photo}` :
                        avatar1,
                    coverPhoto: data.photo_couverture ?
                        `https://inawoapiv3.inawo.pro${data.photo_couverture}` :
                        smallImage9
                }));

            } catch (err) {
                console.error("Erreur fetchData:", err);
                setState(prev => ({
                    ...prev,
                    error: err.message,
                    loading: false
                }));
                toast.error(err.message);
            }
        };

        if (userProfile?.id) {
            fetchData();
        }
    }, [userProfile]); // Add userProfile as dependency

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (state.loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="alert alert-danger m-3">
                <i className="ri-error-warning-line me-2"></i>
                {state.error}
            </div>
        );
    }

    document.title = "Profile Settings | INAWO - Suite de Gestion";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
              title="&nbsp;Profil"  
              pageTitle={
                <>
                  <i className="ri-user-settings-line"></i>
                  &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                </>
              }
            />
                    <Row className="h-100">
                        <div className="col-xxl-3 mt-xxl-2">
                            <div className="d-flex flex-column">
                                <div className="card overflow-hidden flex-fill" style={{ borderRadius: "20px" }}>
                                    <div>
                                        <img
                                            src={state.coverPhoto || smallImage9}
                                            alt=""
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="card-body pt-0 mt-n5">
                                        <div className="text-center">
                                            <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                                                <img
                                                    src={state.profilePhoto || avatar1}
                                                    className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                    alt="user-profile"
                                                />
                                            </div>
                                            <h5 className="fs-16 mb-1">{state.userData?.nom} {state.userData?.prenom}</h5>
                                            <p className="text-muted mb-0">{state.userData?.fonction}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-9 mt-xxl-2">
                            <div className="d-flex flex-column h-100">
                                <Card className="flex-fill" style={{ borderRadius: "20px", overflow: "hidden" }}>
                                    <CardHeader>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                                role="tablist">
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === "1" })}
                                                        onClick={() => {
                                                            tabChange("1");
                                                        }}>
                                                        <i className="fas fa-home"></i>
                                                        Detail Personnel
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
                                                        Modifier mot de passe
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>

                                            <div>
                                                <Link
                                                    to="/profile-edit"
                                                    className="btn btn-primary"
                                                    style={{ borderRadius: "20px" }}
                                                >
                                                    Modifier Profil
                                                </Link>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardBody className="p-4">
                                        <TabContent activeTab={activeTab}>
                                            <TabPane tabId="1">
                                                <Form>
                                                    <Row>
                                                        <Col lg={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="firstnameInput" className="form-label">
                                                                    Nom</Label>
                                                                <Input type="text" className="form-control" id="firstnameInput"
                                                                    defaultValue={state.userData?.nom || ''}
                                                                    style={{ borderRadius: "20px" }}
                                                                    disabled />
                                                            </div>
                                                        </Col>
                                                        <Col lg={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="lastnameInput" className="form-label">Prénom
                                                                </Label>
                                                                <Input type="text" className="form-control" id="lastnameInput"
                                                                    defaultValue={state.userData?.prenom || ''}
                                                                    style={{ borderRadius: "20px" }}
                                                                    disabled />
                                                            </div>
                                                        </Col>
                                                        <Col lg={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="phonenumberInput" className="form-label">Téléphone
                                                                </Label>
                                                                <Input type="text" className="form-control"
                                                                    id="phonenumberInput"
                                                                    placeholder="Entrer votre numéro de téléphone"
                                                                    defaultValue={state.userData?.telephone || ''}
                                                                    style={{ borderRadius: "20px" }}
                                                                    disabled />
                                                            </div>
                                                        </Col>
                                                        <Col lg={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="emailInput" className="form-label">Email
                                                                </Label>
                                                                <Input type="email" className="form-control" id="emailInput"
                                                                    placeholder="Entrer votre email"
                                                                    defaultValue={state.userData?.email || ''}
                                                                    style={{ borderRadius: "20px" }}
                                                                    disabled />
                                                            </div>
                                                        </Col>

                                                        <Col lg={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="countryInput" className="form-label">Pays</Label>
                                                                <Input type="text" className="form-control" id="countryInput"
                                                                    placeholder="" defaultValue={state.userData?.pays || ''}
                                                                    style={{ borderRadius: "20px" }}
                                                                    disabled />
                                                            </div>
                                                        </Col>



                                                        <Col lg={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="countryInput" className="form-label">Fonction</Label>
                                                                <Input type="text" className="form-control" id="countryInput"
                                                                    placeholder="" defaultValue={state.userData?.fonction || ''}
                                                                    style={{ borderRadius: "20px" }}
                                                                    disabled />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>
                                </Card>

                            </div>
                        </div>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Settings;