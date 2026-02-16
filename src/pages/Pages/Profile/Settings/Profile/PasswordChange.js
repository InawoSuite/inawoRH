import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Modal, ModalBody, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane } from 'reactstrap';
import classnames from "classnames";
import BreadCrumb from '../../../../../Components/Common/BreadCrumb';


//import images
import progileBg from '../../../../../assets/images/profile-bg.jpg';
import avatar1 from '../../../../../assets/images/users/avatar-1.jpg';
import smallImage9 from "../../../../../assets/images/small/img-9.jpg";
import { useProfile } from "../../../../../Components/Hooks/UserHooks";
// import { BaseUrl } from '../../../Authentication/ApiKey';
import userdummy from "../../../../../assets/images/users/user-dummy-img.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { set } from 'lodash';

const Settings_Change_Password = () => {
    const [activeTab, setActiveTab] = useState("1");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { userProfile, token} = useProfile();
    const [state, setState] = useState({
        loading: true,
        error: null,
        userData: null,
        profilePhoto: avatar1,
        coverPhoto: smallImage9
    });
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordShow, setPasswordShow] = useState(false);
    const navigate = useNavigate();
    const { token_url } = useParams();

    console.log("Token reçu :", token_url);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== passwordConfirm) {
            toast.error(
                <span style={{ fontWeight: "bold", color: "red" }}>
                    Les mots de passes ne correspondent pas !
                </span>, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                
            });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `https://inawoapiv3.inawo.pro/utilisateurs/password-reset-confirm/${token_url}/`,
                {
                    password: password,
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            }
            );
            console.log("Email", password);
            console.log("La reponse de l'API", response);
            // Si la réponse est OK, afficher le modal

            // setShowSuccessModal(true);

            toast.success(
                <span style={{ fontWeight: "bold", color: "#16a34a" }}>
                    Mot de passe modifié avec succès !
                </span>, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                /* closeButton: (
                    <span style={{ color: "green", }}>
                        ✖
                    </span>
                ), */
            });

            setPassword("");
            setPasswordConfirm("");
            
            localStorage.setItem("profile_message", "Mot de passe modifié avec succès !");
            navigate("/profil");

        } catch (error) {
            if (error) {
                
                console.log(error.originalError.response.data.error);
                toast.error(
                    <span style={{ fontWeight: "bold", color: "red" }}>
                        Erreur du serveur : {error.originalError.response.data.error}
                    </span>, {
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const msg = localStorage.getItem("profile_message");
        if (msg) {
            toast.success(
                <span style={{ fontWeight: "bold", color: "#16a34a" }}>
                    {msg}
                </span>, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                closeButton: (
                    <span style={{ color: "green", }}>
                        ✖
                    </span>
                ),
            });
            localStorage.removeItem("profile_message");
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!userProfile?.id) {
                    throw new Error("Session invalide - Veuillez vous reconnecter");
                }

                const response = await fetch(`https://inawoapiv3.inawo.pro/utilisateurs/update-profile/${userProfile.id}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    //credentials: 'include',
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
                <ToastContainer />
                <Container fluid>
                    {/* Modal de succès */}
                    <Modal isOpen={showSuccessModal} toggle={() => setShowSuccessModal(false)} backdrop="static" centered>
                        <ModalBody className="p-0">
                            <Row className="justify-content-center">
                                <Col md={12}>
                                    <Card className="mt-0 border-0">
                                        <CardBody className="p-4 text-center">
                                            <div className="avatar-lg mx-auto mt-2">
                                                <div className="avatar-title bg-light text-success display-3 rounded-circle">
                                                    <i className="ri-checkbox-circle-fill"></i>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-2">
                                                <h4>Email envoyé !</h4>
                                                <p className="text-muted mx-4">
                                                    Vérifiez votre boîte mail pour réinitialiser votre mot de passe.
                                                </p>
                                                <div className="mt-4">
                                                    <Button
                                                        color="success"
                                                        className="w-100"
                                                        onClick={() => setShowSuccessModal(false)}
                                                    >
                                                        Compris
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </ModalBody>
                    </Modal>
                    <BreadCrumb
                        title="&nbsp;Profil"  // &nbsp; avant "Contact"
                        pageTitle={
                            <>
                                <i className="ri-contacts-book-line me-1 align-bottom"></i>
                                &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                            </>
                        }
                    />
                    <Row className="h-100">
                        <div className="col-lg-3 mt-lg-2">
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
                                                {/* <img
                                                    src={state.profilePhoto || avatar1}
                                                    className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                    alt="user-profile"
                                                /> */}
                                                <img
                                                    src={userProfile.photo || userdummy}
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

                        <div className="col-lg-9 mt-lg-2">
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
                                                            handleTabChange("1");
                                                        }}>
                                                        <i className="fas fa-home"></i>
                                                        Modifier mot de passe
                                                    </NavLink>
                                                </NavItem>
                                                
                                            </Nav>

                                            
                                        </div>
                                    </CardHeader>
                                    <CardBody className="p-4">
                                        <TabContent activeTab={activeTab}>
                                            
                                            <TabPane tabId="1">
                                                <Form onSubmit={handleChangePassword}>
                                                    <Row>
                                                        <Col lg={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="firstnameInput" className="form-label">
                                                                    Password</Label>
                                                                <div className='position-relative auth-pass-inputgroup'>
                                                                    <Input type={passwordShow ? "text" : "password"} className="form-control" id="firstnameInput"
                                                                        onChange={(e) => setPassword(e.target.value)}
                                                                        style={{ borderRadius: "20px" }}
                                                                        placeholder='Entrer nouveau mot de passe'
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                                                        onClick={() => setPasswordShow(!passwordShow)}
                                                                    >
                                                                        <i className="ri-eye-fill align-middle"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col lg={6}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="firstnameInput" className="form-label">
                                                                    Confirm Password</Label>
                                                                <div className='position-relative auth-pass-inputgroup'>
                                                                    <Input type={passwordShow ? "text" : "password"} className="form-control" id="firstnameInput"
                                                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                                                        style={{ borderRadius: "20px" }}
                                                                        placeholder='Confirmer le mot de passe'
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                                                        onClick={() => setPasswordShow(!passwordShow)}
                                                                    >
                                                                        <i className="ri-eye-fill align-middle"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={12}>
                                                            <Button
                                                                type="submit"
                                                                className="form-control rounded-pill btn w-100 text-white"
                                                                style={{
                                                                    backgroundColor: "#014a92",
                                                                    borderColor: "#014a92",
                                                                }}
                                                                disabled={loading}
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.backgroundColor = "#007bff";
                                                                    e.target.style.borderColor = "#007bff";
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.backgroundColor = "#014a92";
                                                                    e.target.style.borderColor = "#014a92";
                                                                }}
                                                            >
                                                                {loading ? (
                                                                    <div
                                                                        className="spinner-border spinner-border-sm text-light"
                                                                        role="status"
                                                                    >
                                                                        <span className="visually-hidden">Loading...</span>
                                                                    </div>
                                                                )
                                                                    : "Modifier mot de passe"}
                                                            </Button>
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

export default Settings_Change_Password;