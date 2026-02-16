import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Alert,
} from "reactstrap";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import avatar1 from "../../../../../assets/images/users/user-dummy-img.jpg";
import smallImage9 from "../../../../../assets/images/small/img-9.jpg";
import { useProfile } from "../../../../../Components/Hooks/UserHooks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BaseUrl } from '../../../../APIKey/ApiKey';
import SuccessModal from "../../../../../Components/Common/SuccessModal";

const Settings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("1");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalConfig, setSuccessModalConfig] = useState({});
  const { userProfile, loading: profileLoading, token } = useProfile();
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [state, setState] = useState({
    loading: true,
    error: null,
    userData: {},
    profilePhoto: avatar1,
    coverPhoto: smallImage9,
  });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [passwordData, setPasswordData] = useState({
    ancien_password: '',
    nouveau_password: '',
    confirm_password: ''
  });

  const [showPassword, setShowPassword] = useState({
    ancien_password: false,
    nouveau_password: false,
    confirm_password: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour afficher le modal de succès
  const showSuccessMessage = (config = {}) => {
    const defaultConfig = {
      title: t('Succès !'),
      message: t('Opération effectuée avec succès'),
      buttonText: t('Compris'),
      icon: 'ri-checkbox-circle-fill',
      iconColor: 'success'
    };
    
    setSuccessModalConfig({ ...defaultConfig, ...config });
    setShowSuccessModal(true);
  };

  const handleVerifEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${BaseUrl}/utilisateurs/password-reset-request/`,
        {
          email: email.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      showSuccessMessage({
        title: t('Email envoyé !'),
        message: t('Vérifiez votre boîte mail pour réinitialiser votre mot de passe.'),
        icon: 'ri-mail-send-fill'
      });
      
    } catch (error) {
      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {t('Erreur du serveur')}
        </span>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const msg = localStorage.getItem("profile_message");
    if (msg) {
      toast.success(
        <span style={{ fontWeight: "bold", color: "#16a34a" }}>{msg}</span>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      localStorage.removeItem("profile_message");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userProfile?.id) {
          throw new Error(t('Session invalide'));
        }

        const response = await fetch(
          `${BaseUrl}/utilisateurs/update-profile/${userProfile.id}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        setState((prev) => ({
          ...prev,
          userData: data || {},
          loading: false,
          profilePhoto: data.photo ? `${BaseUrl}${data.photo}` : avatar1,
          coverPhoto: data.photo_couverture ? `${BaseUrl}${data.photo_couverture}` : smallImage9,
        }));

        setEmail(data?.email || "");

      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err.message,
          loading: false,
          userData: {},
        }));
      }
    };

    if (userProfile?.id) {
      fetchData();
    }
  }, [userProfile, token, t]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getDisplayValue = (value, placeholder = t('Non fourni')) => {
    return value || placeholder;
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!passwordData.ancien_password) {
      newErrors.ancien_password = t('L\'ancien mot de passe est requis');
    }

    if (!passwordData.nouveau_password) {
      newErrors.nouveau_password = t('Le nouveau mot de passe est requis');
    } else if (passwordData.nouveau_password.length < 6) {
      newErrors.nouveau_password = t('Le mot de passe doit contenir au moins 6 caractères');
    }

    if (!passwordData.confirm_password) {
      newErrors.confirm_password = t('La confirmation du mot de passe est requise');
    } else if (passwordData.nouveau_password !== passwordData.confirm_password) {
      newErrors.confirm_password = t('Les mots de passe ne correspondent pas');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, 5000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${BaseUrl}/utilisateurs/change-password-view/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            ancien_password: passwordData.ancien_password,
            nouveau_password: passwordData.nouveau_password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Utilisation du SuccessModal pour le succès
        showSuccessMessage({
          title: t('Mot de passe modifié !'),
          message: t('Votre mot de passe a été modifié avec succès. Vous pouvez maintenant utiliser votre nouveau mot de passe pour vous connecter.'),
          icon: 'ri-shield-check-fill',
          iconColor: 'success',
          onButtonClick: () => {
            setShowSuccessModal(false);
            // Réinitialiser le formulaire
            setPasswordData({
              ancien_password: "",
              nouveau_password: "",
              confirm_password: "",
            });
            // Réinitialiser les erreurs
            setErrors({});
          }
        });
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          const errorMessage = data.message || t('Erreur de changement de mot de passe');
          showAlert("danger", errorMessage);
          
          // Afficher une alerte toast pour les erreurs
          toast.error(
            <span style={{ fontWeight: "bold", color: "red" }}>
              {errorMessage}
            </span>,
            {
              position: "top-right",
              autoClose: 4000,
            }
          );
        }
      }
    } catch (error) {
      const errorMessage = t('Erreur de connexion au serveur');
      showAlert("danger", errorMessage);
      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {errorMessage}
        </span>,
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  document.title = t('Profil') + " | INAWO - Suite de Gestion";

  return (
    <React.Fragment>
      <div className="page-content">
        <ToastContainer 
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
        {/* Modal de succès réutilisable */}
        <SuccessModal
          isOpen={showSuccessModal}
          toggle={() => setShowSuccessModal(false)}
          title={successModalConfig.title}
          message={successModalConfig.message}
          buttonText={successModalConfig.buttonText}
          icon={successModalConfig.icon}
          iconColor={successModalConfig.iconColor}
          onButtonClick={successModalConfig.onButtonClick}
        />
        
        <Container fluid>
          <BreadCrumb
            title={`${t('Profil Utilisateur')}`}
            pageTitle={
              <>
                <i className="ri-contacts-book-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">{t('Tableau de Bord')}</Link>&nbsp;&gt;&nbsp;
              </>
            }
          />

          {alert.show && (
            <Alert color={alert.type} className="mt-3" style={{ borderRadius: "15px" }}>
              <i className={`ri-${alert.type === 'success' ? 'check' : 'close'}-circle-fill me-2`}></i>
              {alert.message}
            </Alert>
          )}

          <Row className="h-100">
            {/* Colonne de gauche - Photo de profil */}
            <div className="col-lg-3 mt-lg-2">
              <div className="d-flex flex-column">
                <div className="card overflow-hidden flex-fill" style={{ borderRadius: "20px" }}>
                  <div>
                    {state.loading ? (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: "150px", background: "#f8f9fa" }}>
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">{t('Chargement')}</span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={state.coverPhoto || smallImage9}
                        alt={t('Couverture de profil')}
                        className="img-fluid"
                        style={{
                          height: "150px",
                          objectFit: "cover",
                          width: "100%",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = smallImage9;
                        }}
                      />
                    )}
                  </div>
                  <div className="card-body pt-0 mt-n5">
                    <div className="text-center">
                      <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                        {state.loading ? (
                          <div className="rounded-circle avatar-xl img-thumbnail d-flex align-items-center justify-content-center" style={{ width: "120px", height: "120px", background: "#f8f9fa" }}>
                            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                          </div>
                        ) : (
                          <img
                            src={state.profilePhoto || avatar1}
                            className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                            alt={t('Photo de profil')}
                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = avatar1;
                            }}
                          />
                        )}
                      </div>
                      <h5 className="fs-16 mb-1">
                        {state.loading ? (
                          <div className="placeholder-glow">
                            <span className="placeholder col-8"></span>
                          </div>
                        ) : (
                          `${getDisplayValue(state.userData?.nom, t('Nom'))} ${getDisplayValue(state.userData?.prenom, t('Prénom'))}`
                        )}
                      </h5>
                      <p className="text-muted mb-0">
                        {state.loading ? (
                          <div className="placeholder-glow">
                            <span className="placeholder col-6"></span>
                          </div>
                        ) : (
                          getDisplayValue(state.userData?.fonction, t('Fonction non spécifiée'))
                        )}
                      </p>
                      <h6 className="text-muted mb-0">
                        {state.loading ? (
                          <div className="placeholder-glow">
                            <span className="placeholder col-7"></span>
                          </div>
                        ) : (
                          getDisplayValue(userProfile?.type_utilisateur, t('Type d\'utilisateur'))
                        )}
                      </h6>
                    </div>
                  </div>
                </div>

                {/* Informations supplémentaires */}
                {/* <Card className="mt-3" style={{ borderRadius: "20px" }}>
                  <CardBody>
                    <h6 className="mb-3">{t('Informations de contact')}</h6>
                    <div className="d-flex align-items-center mb-2">
                      <i className="ri-mail-line text-primary me-2"></i>
                      <small className="text-muted">
                        {state.loading ? (
                          <span className="placeholder col-8"></span>
                        ) : (
                          getDisplayValue(state.userData?.email, t('Email non fourni'))
                        )}
                      </small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="ri-phone-line text-primary me-2"></i>
                      <small className="text-muted">
                        {state.loading ? (
                          <span className="placeholder col-6"></span>
                        ) : (
                          getDisplayValue(state.userData?.telephone, t('Téléphone non fourni'))
                        )}
                      </small>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="ri-map-pin-line text-primary me-2"></i>
                      <small className="text-muted">
                        {state.loading ? (
                          <span className="placeholder col-7"></span>
                        ) : (
                          getDisplayValue(state.userData?.pays, t('Pays non fourni'))
                        )}
                      </small>
                    </div>
                  </CardBody>
                </Card> */}
              </div>
            </div>

            {/* Colonne de droite - Contenu principal */}
            <div className="col-lg-9 mt-lg-2">
              <div className="d-flex flex-column h-100">
                <Card className="flex-fill" style={{ borderRadius: "20px", overflow: "hidden" }}>
                  <CardHeader className="pb-0" style={{ borderBottom: "1px solid #e9ecef" }}>
                    <div className="d-flex align-items-center justify-content-between mb-0">
                      <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
                        <NavItem>
                          <NavLink
                            className={classnames({ 
                              active: activeTab === "1",
                              'text-primary': activeTab === "1"
                            })}
                            onClick={() => handleTabChange("1")}
                            style={{ 
                              cursor: 'pointer',
                              border: 'none',
                              background: 'transparent'
                            }}
                          >
                            <i className="ri-user-line me-2"></i>
                            {t('Détails Personnels')}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({ 
                              active: activeTab === "2",
                              'text-primary': activeTab === "2"
                            })}
                            onClick={() => handleTabChange("2")}
                            style={{ 
                              cursor: 'pointer',
                              border: 'none',
                              background: 'transparent'
                            }}
                          >
                            <i className="ri-lock-password-line me-2"></i>
                            {t('Modifier le mot de passe')}
                          </NavLink>
                        </NavItem>
                      </Nav>

                      <div>
                        <Link
                          to="/:entreprise/profile-edit"
                          className="btn btn-primary rounded-pill"
                          style={{ 
                            borderRadius: "20px",
                            padding: "8px 20px",
                            fontWeight: "500"
                          }}
                          disabled={state.loading}
                        >
                          {state.loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              {t('Chargement')}...
                            </>
                          ) : (
                            <>
                              <i className="ri-edit-2-line me-2"></i>
                              {t('Modifier le Profil')}
                            </>
                          )}
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardBody className="p-4">
                    <TabContent activeTab={activeTab}>
                      {/* Onglet 1: Détails Personnels */}
                      <TabPane tabId="1">
                        <Form>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="firstnameInput" className="form-label fw-semibold">
                                  {t('Nom')}
                                </Label>
                                {state.loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "45px", borderRadius: "15px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    className="form-control rounded-pill"
                                    id="firstnameInput"
                                    value={getDisplayValue(state.userData?.nom, "")}
                                    placeholder={t('Nom')}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="lastnameInput" className="form-label fw-semibold">
                                  {t('Prénom')}
                                </Label>
                                {state.loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "45px", borderRadius: "15px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    className="form-control rounded-pill"
                                    id="lastnameInput"
                                    value={getDisplayValue(state.userData?.prenom, "")}
                                    placeholder={t('Prénom')}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="phonenumberInput" className="form-label fw-semibold">
                                  {t('Téléphone')}
                                </Label>
                                {state.loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "45px", borderRadius: "15px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    className="form-control rounded-pill"
                                    id="phonenumberInput"
                                    value={getDisplayValue(state.userData?.telephone, "")}
                                    placeholder={t('Numéro de téléphone')}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="emailInput" className="form-label fw-semibold">
                                  {t('Email')}
                                </Label>
                                {state.loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "45px", borderRadius: "15px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="email"
                                    className="form-control rounded-pill"
                                    id="emailInput"
                                    value={getDisplayValue(state.userData?.email, "")}
                                    placeholder={t('Email')}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="countryInput" className="form-label fw-semibold">
                                  {t('Pays')}
                                </Label>
                                {state.loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "45px", borderRadius: "15px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    className="form-control rounded-pill"
                                    id="countryInput"
                                    value={getDisplayValue(state.userData?.pays, "")}
                                    placeholder={t('Pays')}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="functionInput" className="form-label fw-semibold">
                                  {t('Fonction')}
                                </Label>
                                {state.loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "45px", borderRadius: "15px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    className="form-control rounded-pill"
                                    id="functionInput"
                                    value={getDisplayValue(state.userData?.fonction, "")}
                                    placeholder={t('Fonction')}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </TabPane>

                      {/* Onglet 2: Modification du mot de passe */}
                      <TabPane tabId="2">
                        <div className="mb-4">
                          <h6 className="text-muted mb-3">
                            <i className="ri-shield-keyhole-line me-2"></i>
                            {t('Sécurité du compte')}
                          </h6>
                          <p className="text-muted small">
                            {t('Pour assurer la sécurité de votre compte, choisissez un mot de passe fort contenant au moins 6 caractères avec des lettres, chiffres et caractères spéciaux.')}
                          </p>
                        </div>

                        <Form onSubmit={handleChangePassword}>
                          <Row className="g-3">
                            <Col lg={4}>
                              <div className="mb-3">
                                <Label htmlFor="ancien_password" className="form-label">
                                  {t('Ancien Mot de Passe')} <span className="text-danger">*</span>
                                </Label>
                                <div className="position-relative auth-pass-inputgroup">
                                  <Input 
                                    type={showPassword.ancien_password ? "text" : "password"} 
                                    className={`form-control pe-5 ${errors.ancien_password ? 'is-invalid' : ''}`}
                                    id="ancien_password"
                                    name="ancien_password"
                                    placeholder={t('Entrez votre ancien mot de passe')}
                                    value={passwordData.ancien_password}
                                    onChange={handlePasswordChange}
                                    style={{ 
                                      borderRadius: "70px",
                                    }}
                                  />
                                  <button 
                                    type="button" 
                                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y p-0 me-3 text-muted"
                                    onClick={() => togglePasswordVisibility('ancien_password')}
                                    style={{ border: 'none', background: 'transparent' }}
                                  >
                                    <i className={`ri-eye${showPassword.ancien_password ? '-line' : '-off-line'} align-middle`}></i>
                                  </button>
                                  {errors.ancien_password && (
                                    <div className="invalid-feedback d-block">
                                      <i className="ri-error-warning-line me-1"></i>
                                      {errors.ancien_password}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="mb-3">
                                <Label htmlFor="nouveau_password" className="form-label">
                                  {t('Nouveau Mot de Passe')} <span className="text-danger">*</span>
                                </Label>
                                <div className="position-relative auth-pass-inputgroup">
                                  <Input 
                                    type={showPassword.nouveau_password ? "text" : "password"} 
                                    className={`form-control pe-5 ${errors.nouveau_password ? 'is-invalid' : ''}`}
                                    id="nouveau_password" 
                                    name="nouveau_password"
                                    placeholder={t('Entrez votre nouveau mot de passe')}
                                    value={passwordData.nouveau_password}
                                    onChange={handlePasswordChange}
                                    style={{ 
                                      borderRadius: "70px",
                                    }}
                                  />
                                  <button 
                                    type="button" 
                                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y p-0 me-3 text-muted"
                                    onClick={() => togglePasswordVisibility('nouveau_password')}
                                    style={{ border: 'none', background: 'transparent' }}
                                  >
                                    <i className={`ri-eye${showPassword.nouveau_password ? '-line' : '-off-line'} align-middle`}></i>
                                  </button>
                                  {errors.nouveau_password && (
                                    <div className="invalid-feedback d-block">
                                      <i className="ri-error-warning-line me-1"></i>
                                      {errors.nouveau_password}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="mb-3">
                                <Label htmlFor="confirm_password" className="form-label">
                                  {t('Confirmer le Mot de Passe')} <span className="text-danger">*</span>
                                </Label>
                                <div className="position-relative auth-pass-inputgroup">
                                  <Input 
                                    type={showPassword.confirm_password ? "text" : "password"} 
                                    className={`form-control pe-5 ${errors.confirm_password ? 'is-invalid' : ''}`}
                                    id="confirm_password"
                                    name="confirm_password"
                                    placeholder={t('Confirmer le mot de passe')}
                                    value={passwordData.confirm_password}
                                    onChange={handlePasswordChange}
                                    style={{ 
                                      borderRadius: "70px",
                                    }}
                                  />
                                  <button 
                                    type="button" 
                                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y p-0 me-3 text-muted"
                                    onClick={() => togglePasswordVisibility('confirm_password')}
                                    style={{ border: 'none', background: 'transparent' }}
                                  >
                                    <i className={`ri-eye${showPassword.confirm_password ? '-line' : '-off-line'} align-middle`}></i>
                                  </button>
                                  {errors.confirm_password && (
                                    <div className="invalid-feedback d-block">
                                      <i className="ri-error-warning-line me-1"></i>
                                      {errors.confirm_password}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Col>

                            <Col lg={12}>
                              <div className="mt-4 pt-3 border-top">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <p className="text-muted small mb-0">
                                      <i className="ri-information-line me-2"></i>
                                      {t('Assurez-vous de vous souvenir de votre nouveau mot de passe.')}
                                    </p>
                                  </div>
                                  <button
                                    type="submit"
                                    className="btn btn-success rounded-pill"
                                    disabled={isLoading}
                                  >
                                    {isLoading ? (
                                      <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        {t('Modification...')}
                                      </>
                                    ) : (
                                      <>
                                        <i className="ri-lock-unlock-line me-2"></i>
                                        {t('Changer le Mot de Passe')}
                                      </>
                                    )}
                                  </button>
                                </div>
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