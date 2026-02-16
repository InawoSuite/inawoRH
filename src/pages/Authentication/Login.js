import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation, useParams } from "react-router-dom";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import axios from "axios";
import logoInwo from "../../assets/images/logo_inwo.png";
import { setAuthorization } from "../../helpers/api_helper";
import { loginSuccess } from "../../slices/auth/login/reducer";
import { saveAuthData, getAuthData } from "../../utils/authUtils";
import loadingInawoGif from "../../assets/images/loading_inawo.gif.gif";
import { useTranslation } from "react-i18next";
import { BaseUrl } from "../APIKey/ApiKey";

// 🔹 Composant Loader plein écran
const LoadingPage = () => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <img
        src={loadingInawoGif}
        alt={t("Chargement...")}
        style={{ width: "150px" }}
      />
    </div>
  );
};

const Login = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth || {});
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();
  const [email, setEmail] = useState("demoglobal@inawo.pro");
  const [password, setPassword] = useState("Global2025");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const currentYear = new Date().getFullYear();

  // 🔴 États pour la validation des champs
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
  });

  // Détection et configuration de la langue
  useEffect(() => {
    const determineLanguage = () => {
      if (lang && (lang === "fr" || lang === "en")) {
        return lang;
      }

      const savedLanguage = localStorage.getItem("selectedLanguage");
      if (savedLanguage) {
        return savedLanguage;
      }

      const browserLanguage = navigator.language.split("-")[0];
      if (browserLanguage === "en" || browserLanguage === "fr") {
        return browserLanguage;
      }

      return "fr";
    };

    const detectedLanguage = determineLanguage();
    i18n.changeLanguage(detectedLanguage);
    localStorage.setItem("selectedLanguage", detectedLanguage);
    document.title =
      detectedLanguage === "fr"
        ? "Connexion | INAWO - Suite de Gestion"
        : "Login | INAWO - Suite de Gestion";
  }, [lang, i18n]);

  const initializeAuth = () => {
    const authData = getAuthData();
    if (authData.access_token && authData.user) {
      dispatch(
        loginSuccess({
          user: authData.user,
          token: authData.access_token,
          refreshToken: authData.refresh_token,
        })
      );
      setAuthorization(authData.access_token);
      return true;
    }
    return false;
  };

  // 🔴 Validation en temps réel
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "email":
        if (!value || !value.trim()) {
          return t("L'email est requis");
        }
        if (!validateEmail(value)) {
          return t("Format d'email invalide");
        }
        return null;

      case "password":
        if (!value || !value.trim()) {
          return t("Le mot de passe est requis");
        }
        return null;

      default:
        return null;
    }
  };

  // 🔴 Gestion des changements de champs avec validation en temps réel
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Réinitialiser l'erreur quand l'utilisateur commence à taper
    if (fieldErrors.email) {
      const error = validateField("email", value);
      setFieldErrors((prev) => ({
        ...prev,
        email: error !== null,
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (fieldErrors.password) {
      const error = validateField("password", value);
      setFieldErrors((prev) => ({
        ...prev,
        password: error !== null,
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newFieldErrors = {
      email: false,
      password: false,
    };

    // Validation email
    const emailValidation = validateField("email", email);
    if (emailValidation) {
      setError(emailValidation);
      newFieldErrors.email = true;
      isValid = false;
    }

    // Validation mot de passe
    const passwordValidation = validateField("password", password);
    if (passwordValidation) {
      // Ne montrer que la première erreur
      if (isValid) {
        setError(passwordValidation);
      }
      newFieldErrors.password = true;
      isValid = false;
    }

    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Réinitialiser les erreurs
    setError(null);
    setFieldErrors({ email: false, password: false });

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${BaseUrl}/utilisateurs/connexion/`, {
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Réponse API complète:", response);

      if (response && response.access_token) {
        const {
          access_token,
          refresh_token, // Récupérer le refresh_token de la réponse
          id,
          nom,
          prenom,
          telephone,
          fonction,
          email: userEmail,
          type_utilisateur,
          entreprise,
          abonnement,
          groupes,
          magasins,
          ifu,
          pays,
        } = response;

        if (access_token) {
          const userData = {
            id,
            nom,
            prenom,
            telephone,
            fonction,
            email: userEmail,
            type_utilisateur,
            entreprise,
            abonnement,
            groupes,
            magasins,
            ifu,
            pays,
          };

          // ✅ CORRECTION : S'assurer que refresh_token est inclus
          const authDataToSave = {
            access_token,
            refresh_token: refresh_token || access_token, // Fallback si pas de refresh_token
            user: userData,
          };

          console.log("Données d'auth à sauvegarder:", authDataToSave);

          saveAuthData(authDataToSave, rememberMe);
          setAuthorization(access_token);
          dispatch(
            loginSuccess({
              user: userData,
              token: access_token,
              refreshToken: refresh_token || access_token,
            })
          );

          setShowLoadingPage(true);
          setTimeout(() => {
            navigate("/:entreprise/dashboard", { replace: true });
          }, 2000);
        } else {
          throw new Error(t("Tokens d'authentification manquants"));
        }
      } else {
        throw new Error(t("Format de réponse invalide"));
      }
    } catch (error) {
      // ✅ La structure d'erreur est aussi modifiée par l'intercepteur
      if (error.originalError?.response) {
        // Accédez à la réponse originale via error.originalError
        const status = error.originalError.response.status;
        if (status === 400) {
          setError(t("Email ou mot de passe incorrect"));
        } else if (status === 401) {
          setError(t("Identifiants invalides"));
        } else {
          setError(error.message || t("Erreur du serveur"));
        }
      } else if (error.originalError?.request) {
        setError(t("Vérifiez votre connexion internet."));
      } else {
        setError(
          error.message || t("Une erreur est survenue lors de la connexion")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAuthenticated = initializeAuth();
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  if (showLoadingPage) {
    return <LoadingPage />;
  }

  const getLocalizedLink = (path) => {
    const currentLang = lang || i18n.language || "fr";
    return `/${currentLang}${path}`;
  };

  const getInscriptionLink = () => {
    const currentLang = lang || i18n.language || "fr";
    return currentLang === "fr"
      ? "https://inawo.pro/fr/inscription"
      : "https://inawo.pro/en/inscription";
  };

  // 🔴 Styles pour les champs en erreur
  const errorFieldStyle = {
    borderColor: "#dc3545",
    backgroundColor: "#fff5f5",
    boxShadow: "0 0 0 0.2rem rgba(220, 53, 69, 0.25)",
  };

  const errorLabelStyle = {
    color: "#dc3545",
    fontWeight: "bold",
  };

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="mt-4">
          <div className="auth-page-content">
            <div className="auth-one-bg">
              <Container className="mb-3">
                <Row
                  className="justify-content-center"
                  style={{ marginTop: "5%" }}
                >
                  <div className="text-center mt-4">
                    <Link
                      to={getLocalizedLink("/")}
                      className="d-inline-block auth-logo"
                    >
                      <img src={logoInwo} width="30%" alt={t("Logo Inawo")} />
                    </Link>
                  </div>

                  <Col md={8} lg={6} xl={5}>
                    <Card className="mt-4" style={{ borderRadius: 20 }}>
                      <CardBody className="p-4">
                        <div className="text-center mt-2">
                          <h5 className="text-primary">
                            {t("Bienvenue sur Inawo !")}
                          </h5>
                          <p className="text-muted mt-2">
                            {t("Connectez-vous pour continuer.")}
                          </p>
                        </div>

                        <div className="p-2 mt-4">
                          <Form onSubmit={handleFormSubmit}>
                            {/* 🔴 Champ Email avec gestion d'erreur */}
                            <div className="mb-3">
                              <Label
                                htmlFor="email"
                                style={fieldErrors.email ? errorLabelStyle : {}}
                              >
                                {t("Email")}
                                {fieldErrors.email && " *"}
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder={t("Entrez votre email")}
                                className="form-control rounded-pill"
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={() => {
                                  const error = validateField("email", email);
                                  setFieldErrors((prev) => ({
                                    ...prev,
                                    email: error !== null,
                                  }));
                                }}
                                style={fieldErrors.email ? errorFieldStyle : {}}
                                required
                              />
                              {fieldErrors.email && (
                                <div className="text-danger small mt-1">
                                  <i className="ri-error-warning-fill me-1"></i>
                                  {validateField("email", email)}
                                </div>
                              )}
                            </div>

                            {/* 🔴 Champ Mot de passe avec gestion d'erreur */}
                            <div className="mb-3">
                              <div className="float-end">
                                <Link
                                  // to={getLocalizedLink("/send-email")}
                                  to = "https://inawo.pro/fr/send-email"
                                  className="text-muted"
                                >
                                  {t("Mot de passe oublié ?")}
                                </Link>
                              </div>
                              <Label
                                htmlFor="password"
                                style={
                                  fieldErrors.password ? errorLabelStyle : {}
                                }
                              >
                                {t("Mot de passe")}
                                {fieldErrors.password && " *"}
                              </Label>
                              <div className="position-relative auth-pass-inputgroup mb-3">
                                <Input
                                  id="password"
                                  name="password"
                                  type={passwordShow ? "text" : "password"}
                                  placeholder={t("Entrez votre mot de passe")}
                                  className="form-control rounded-pill"
                                  value={password}
                                  onChange={handlePasswordChange}
                                  onBlur={() => {
                                    const error = validateField(
                                      "password",
                                      password
                                    );
                                    setFieldErrors((prev) => ({
                                      ...prev,
                                      password: error !== null,
                                    }));
                                  }}
                                  style={
                                    fieldErrors.password ? errorFieldStyle : {}
                                  }
                                  required
                                />
                                <button
                                  type="button"
                                  className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                  onClick={() => setPasswordShow(!passwordShow)}
                                  title={
                                    passwordShow
                                      ? t("Masquer le mot de passe")
                                      : t("Afficher le mot de passe")
                                  }
                                >
                                  <i className="ri-eye-fill align-middle"></i>
                                </button>
                              </div>
                              {fieldErrors.password && (
                                <div className="text-danger small mt-1">
                                  <i className="ri-error-warning-fill me-1"></i>
                                  {validateField("password", password)}
                                </div>
                              )}
                            </div>

                            <div className="form-check">
                              <Input
                                className="form-check-input"
                                type="checkbox"
                                id="auth-remember-check"
                                checked={rememberMe}
                                onChange={(e) =>
                                  setRememberMe(e.target.checked)
                                }
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="auth-remember-check"
                              >
                                {t("Se souvenir de moi")}
                              </Label>
                            </div>

                            {/* 🔴 Message d'erreur général */}
                            <div className="mt-4">
                              {error && (
                                <div
                                  style={{
                                    color: "#dc3545",
                                    textAlign: "center",
                                    marginBottom: "15px",
                                    padding: "10px",
                                    backgroundColor: "#f8d7da",
                                    border: "1px solid #f5c6cb",
                                    borderRadius: "8px",
                                    fontWeight: "500",
                                  }}
                                >
                                  <i className="ri-error-warning-fill me-2"></i>
                                  {error}
                                </div>
                              )}

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
                                {loading
                                  ? t("Connexion...")
                                  : t("Se connecter")}
                              </Button>
                            </div>

                            <div className="mt-4 text-center">
                              <span>{t("Vous n'avez pas de compte ?")} </span>
                              <Link
                                to={getInscriptionLink()}
                                className="fw-semibold text-decoration-underline"
                                style={{ color: "#014a92" }}
                              >
                                {t("S'inscrire maintenant")}
                              </Link>
                            </div>
                          </Form>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Container>
              <div
                className="text-center"
                style={{
                  position: "absolute",
                  bottom: "20px",
                  width: "100%",
                  color: "#fff",
                }}
              >
                <p>
                  &copy; {currentYear} Inawo. {t("Tous droits réservés.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Login;
