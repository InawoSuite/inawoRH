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
import { BaseUrl } from "../APIKey/ApiKey";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useProfile } from "../../Components/Hooks/UserHooks";

// 🔹 Composant Loader plein écran
const LoadingPage = () => {
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
      <img src={loadingInawoGif} alt="Chargement..." style={{ width: "150px" }} />
    </div>
  );
};

const Change_Password = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth || {});
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { token_url } = useParams();

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
                `${BaseUrl}/utilisateurs/password-reset-confirm/${token_url}/`,
                {
                    password: password,
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    /* 'Authorization': Bearer ${token}, */
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
            
            localStorage.setItem("login_message", "Mot de passe modifié avec succès !");
            navigate("/fr/connexion");

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


  document.title = "Connexion | Inawo";

  // 🔹 Affiche le loader si demandé
  if (showLoadingPage) {
    return <LoadingPage />;
  }

  return (
    <React.Fragment>
      <ParticlesAuth>
        <ToastContainer />
        <div className="mt-4">
          <div className="auth-page-content">
            <div className="auth-one-bg">
              <Container className="mb-3">
                <Row className="justify-content-center" style={{ marginTop: "5%" }}>
                  <div className="text-center mt-4">
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoInwo} width="30%" alt="Logo Inawo" />
                    </Link>
                  </div>

                  <Col md={8} lg={6} xl={5}>
                    <Card className="mt-4" style={{ borderRadius: 20 }}>
                      <CardBody className="p-4">
                        <div className="text-center mt-2">
                          <h5 className="text-primary">
                            Changer le mot de passe
                          </h5>
                          <p className="text-muted mt-2">
                            Veuillez entrer votre nouveau mot de passe pour continuer
                          </p>
                        </div>

                        <div className="p-2 mt-4">
                          <Form onSubmit={handleChangePassword}>
                            <div className="mb-3">
                              <Label htmlFor="email">Password</Label>
                              <div className="position-relative auth-pass-inputgroup mb-3">
                                <Input
                                  id="password"
                                  name="password"
                                  type={passwordShow ? "text" : "password"}
                                  placeholder="Entrez votre password"
                                  className="form-control rounded-pill"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
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

                            <div className="mb-3">

                              <Label htmlFor="password">Confirm Password</Label>
                              <div className="position-relative auth-pass-inputgroup mb-3">
                                <Input
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  type={passwordShow ? "text" : "password"}
                                  placeholder="Confirmer votre password"
                                  className="form-control rounded-pill"
                                  value={passwordConfirm}
                                  onChange={(e) => setPasswordConfirm(e.target.value)}
                                  required
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

                            <div className="mt-4">
                              {/* {error && (
                                <p
                                  style={{
                                    color: "black",
                                    textAlign: "center",
                                    marginBottom: "2px",
                                  }}
                                >
                                  {error}
                                </p>
                              )} */}

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
                                  : "Changer le mot de passe"}
                              </Button>
                            </div>

                            <div className="mt-4 text-center">
                              <span>Retourner vers la page  </span>
                              <Link
                                to="/:lang/connexion"
                                className="fw-semibold text-decoration-underline"
                                style={{ color: "#014a92" }}
                              >
                                Login
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
                <p>&copy; {currentYear} Inawo. Tous droits réservés.</p>
              </div>
            </div>
          </div>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default Change_Password;