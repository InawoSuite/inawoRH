// import PropTypes from "prop-types";
// import React, { useEffect, useState } from "react";
// import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form } from "reactstrap";
// import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import withRouter from "../../Components/Common/withRouter";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import { userForgetPassword } from "../../slices/thunks";
// import logoInwo from "../../assets/images/logo_inwo.png";
// import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
// import { createSelector } from "reselect";

// const ForgetPasswordPage = (props) => {
//   const dispatch = useDispatch();
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

//   const validation = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       email: '',
//     },
//     validationSchema: Yup.object({
//       email: Yup.string().email("Invalid email").required("Please Enter Your Email"),
//     }),
//     onSubmit: (values) => {
//       dispatch(userForgetPassword(values, props.history));
//     }
//   });

//   const selectLayoutState = (state) => state.ForgetPassword;
//   const selectLayoutProperties = createSelector(
//     selectLayoutState,
//     (state) => ({
//       forgetError: state.forgetError,
//       forgetSuccessMsg: state.forgetSuccessMsg,
//     })
//   );

//   const { forgetError, forgetSuccessMsg } = useSelector(selectLayoutProperties);

//   document.title = "Reset Password | Velzon - React Admin & Dashboard Template";

//   return (
//     <ParticlesAuth>
//       <div className="mt-4">
//           <div className="auth-page-content">
//             <div className="auth-one-bg">
//               <Container className="mb-3">
//                 <Row
//                   className="justify-content-center"
//                   style={{ marginTop: "5%" }}
//                 >
              
//                   <div className="text-center mt-4">
//                         <Link to="/" className="d-inline-block auth-logo">
//                           <img src={logoInwo} width="30%" alt="Logo Inawo" />
//                         </Link>
//                   </div>

                
//                   <Col md={8} lg={6} xl={5}>
//                     <Card className="mt-4" style={{ borderRadius: 20 }}>
//                       <CardBody className="p-4">
//                         <div className="text-center mt-2">
//                           <h5 className="text-primary">Mot de passe oublié?</h5>
//                           <p className="text-muted">Réinitialiser le mot de passe avec Inawo</p>

//                           <lord-icon
//                             src="https://cdn.lordicon.com/rhvddzym.json"
//                             trigger="loop"
//                             colors="#014a92"
//                             className="avatar-xl"
//                             style={{ width: "120px", height: "120px" }}
//                           ></lord-icon>
//                         </div>

//                         <Alert 
//                           className="text-center mb-2 mx-2"
//                           style={{
//                             backgroundColor: 'transparent',
//                             border: 'none',
//                             color: '#000000'
//                           }}
//                         >
//                           Entrez votre adresse e-mail et les instructions vous seront envoyées !
//                         </Alert>

//                         <div className="p-2">
//                           {forgetError && <Alert color="danger">{forgetError}</Alert>}
//                           {forgetSuccessMsg && <Alert color="success">{forgetSuccessMsg}</Alert>}

//                           <Form onSubmit={validation.handleSubmit}>
//                             <div className="mb-4">
//                               <Label className="form-label">Email</Label>
//                               <Input
//                                 name="email"
//                                 className="form-control rounded-pill"
//                                 placeholder="Entrer votre email"
//                                 type="email"
//                                 onChange={validation.handleChange}
//                                 onBlur={validation.handleBlur}
//                                 value={validation.values.email}
//                                 invalid={validation.touched.email && validation.errors.email}
//                               />
//                               {validation.touched.email && validation.errors.email && (
//                                 <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
//                               )}
//                             </div>

//                             <div className="text-center mt-4">
//                               <button 
//                                 className="btn w-100 form-control rounded-pill" 
//                                 type="submit"
//                                 style={{
//                                   backgroundColor: '#014a92', 
//                                   color: '#fff',             
//                                   border: 'none'             
//                                 }}
//                               >
//                                 Envoyer le lien de réinitialisation
//                               </button>
//                             </div>

                            
//                           </Form>
//                         </div>
//                       </CardBody>
//                     </Card>

                  
//                   </Col>
//                 </Row>
//               </Container>
//               <div className="mt-4 text-center"
//               style={{
                
//                 color: "#fff",
//               }}>
//                   <p className="mb-0">
//                       Attendez, je me souviens de mon mot de passe...{" "}
//                       <Link 
//                         to="/suite.inawo.pro/fr/connexion" 
//                         className="fw-semibold text-white text-decoration-underline"
//                       >
//                         Clicker ici
//                       </Link>
//                   </p>
//               </div>
//             </div>
//           </div>
//       </div>
//     </ParticlesAuth>
//   );
// };

// ForgetPasswordPage.propTypes = {
//   history: PropTypes.object,
// };

// export default withRouter(ForgetPasswordPage);


import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form, Modal, ModalBody, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { userForgetPassword } from "../../slices/thunks";
import logoInwo from "../../assets/images/logo_inwo.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from "reselect";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../APIKey/ApiKey";
import { useProfile } from "../../Components/Hooks/UserHooks";

const ForgetPasswordPage = (props) => {
  const dispatch = useDispatch();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [email, setEmail] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useProfile();
  
  const handleVerifEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Email soumis :", email);
    
    try {
      const response = await axios.post(
        `${BaseUrl}/utilisateurs/password-reset-request/`,
        {
          email: email.trim(),
        }, {
        headers: {
          'Content-Type': 'application/json',
          /* 'Authorization': Bearer ${token}, */
        }
      });
      
      console.log("La reponse de l'API", response);
      // Si la réponse est OK, afficher le modal de succès
      setShowSuccessModal(true);
      setEmail("");

    } catch (error) {
      console.log("Email", email);
      console.log("Erreur complète:", error);
      
      let errorMsg = "Une erreur est survenue lors de l'envoi de l'email";
      
      if (error.response) {
        // Erreur avec réponse du serveur
        const status = error.response.status;
        
        if (status === 404) {
          errorMsg = "Aucun compte trouvé avec cet email. Veuillez vérifier l'adresse email saisie.";
        } else if (status === 400) {
          errorMsg = "Email invalide. Veuillez vérifier le format de l'email.";
        } else if (status === 500) {
          errorMsg = "Erreur du serveur. Veuillez réessayer plus tard.";
        } else {
          errorMsg = error.response.data?.message || "Erreur lors de l'envoi de l'email";
        }
      } else if (error.request) {
        // Pas de réponse du serveur
        errorMsg = "Problème de connexion. Vérifiez votre connexion internet.";
      } else {
        // Erreur de configuration
        errorMsg = error.message || "Erreur lors de l'envoi de l'email";
      }
      
      // Afficher le modal d'erreur au lieu du toast
      setErrorMessage(errorMsg);
      setShowErrorModal(true);
      
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour fermer le modal d'erreur
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  document.title = "Reset Password | Velzon - React Admin & Dashboard Template";

  return (
    <ParticlesAuth>
      <ToastContainer />
      
      {/* Modal de succès */}
      <Modal isOpen={showSuccessModal} toggle={() => setShowSuccessModal(false)} backdrop="static" centered contentClassName="rounded-4">
        <ModalBody className="p-0" style={{ borderRadius: "20px" }}>
          <Row className="justify-content-center">
            <Col md={12}>
              <Card className="mt-0 border-0" style={{ borderRadius: 20 }}>
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
                        className="w-100 rounded-pill"
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

      {/* Modal d'erreur */}
      <Modal isOpen={showErrorModal} toggle={handleCloseErrorModal} backdrop="static" centered contentClassName="rounded-4">
        <ModalBody className="p-0" style={{ borderRadius: "20px" }}>
          <Row className="justify-content-center">
            <Col md={12}>
              <Card className="mt-0 border-0" style={{ borderRadius: 20 }}>
                <CardBody className="p-4 text-center">
                  <div className="avatar-lg mx-auto mt-2">
                    <div className="avatar-title bg-light text-danger display-3 rounded-circle">
                      <i className="ri-error-warning-fill"></i>
                    </div>
                  </div>
                  <div className="mt-4 pt-2">
                    <h4>Erreur d'envoi</h4>
                    <p className="text-muted mx-4">
                      {/* {errorMessage} */}
                      Email invalide
                    </p>
                    <div className="mt-4">
                      <Button
                        color="danger"
                        className="w-100 rounded-pill"
                        onClick={handleCloseErrorModal}
                      >
                       Veuillez Renseigner à nouveau votre email
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <div className="mt-4">
        <div className="auth-page-content">
          <div className="auth-one-bg">
            <Container className="mb-3">
              <Row
                className="justify-content-center"
                style={{ marginTop: "5%" }}
              >
                <div className="text-center mt-4">
                  <Link to="/" className="d-inline-block auth-logo">
                    <img src={logoInwo} width="30%" alt="Logo Inawo" />
                  </Link>
                </div>

                <Col md={8} lg={6} xl={5}>
                  <Card className="mt-4" style={{ borderRadius: 20 }}>
                    <CardBody className="p-4">
                      <div className="text-center mt-2">
                        <h5 className="text-primary">Mot de passe oublié?</h5>
                        <p className="text-muted">Réinitialiser le mot de passe avec Inawo</p>

                        <lord-icon
                          src="https://cdn.lordicon.com/rhvddzym.json"
                          trigger="loop"
                          colors="#014a92"
                          className="avatar-xl"
                          style={{ width: "120px", height: "120px" }}
                        ></lord-icon>
                      </div>

                      <Alert
                        className="text-center mb-2 mx-2"
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#000000'
                        }}
                      >
                        Entrez votre adresse e-mail et les instructions vous seront envoyées !
                      </Alert>

                      <div className="p-2">
                        <Form onSubmit={handleVerifEmail}>
                          <div className="mb-4">
                            <Label className="form-label">Email</Label>
                            <Input
                              name="email"
                              className="form-control rounded-pill"
                              placeholder="Entrer votre email"
                              type="email"
                              value={email}
                              onChange={(e) => { setEmail(e.target.value) }}
                              required
                            />
                          </div>

                          <div className="text-center mt-4">
                            <Button
                              type="submit"
                              className="form-control rounded-pill btn w-100 text-white"
                              style={{
                                backgroundColor: "#014a92",
                                borderColor: "#014a92",
                              }}
                              disabled={loading || !email}
                              onMouseEnter={(e) => {
                                if (!e.target.disabled) {
                                  e.target.style.backgroundColor = "#007bff";
                                  e.target.style.borderColor = "#007bff";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!e.target.disabled) {
                                  e.target.style.backgroundColor = "#014a92";
                                  e.target.style.borderColor = "#014a92";
                                }
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
                                : "Envoyer le lien de réinitialisation"}
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
            <div className="mt-4 text-center"
              style={{
                color: "#fff",
              }}>
              <p className="mb-0">
                Attendez, je me souviens de mon mot de passe...{" "}
                <Link
                  to="/suite.inawo.pro/fr/connexion"
                  className="fw-semibold text-white text-decoration-underline"
                >
                  Clicker ici
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ParticlesAuth>
  );
};

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);