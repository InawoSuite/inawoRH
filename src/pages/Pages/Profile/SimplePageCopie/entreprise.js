import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
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
  Table,
  TabPane,
  Alert,
} from "reactstrap";
import classnames from "classnames";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
//import images
import avatar1 from "../../../../assets/images/users/user-dummy-img.jpg";
import smallImage9 from "../../../../assets/images/small/img-9.jpg";
import { useProfile } from "../../../../Components/Hooks/UserHooks";
import { BaseUrl } from '../../../APIKey/ApiKey';

const Settings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(true);
  const [entrepriseData, setEntrepriseData] = useState({});
  const [error, setError] = useState(null);
  const [logo, setLogo] = useState(avatar1);
  const [photo, setPhoto] = useState(smallImage9);
  const { userProfile, token } = useProfile();

  // Fonction pour construire les URLs complètes
  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${BaseUrl}${path}`;
  };

  useEffect(() => {
    const fetchEntrepriseData = async () => {
      try {
        const entrepriseId = userProfile?.entreprise?.id;

        if (!entrepriseId) {
          throw new Error(t('ID de l\'entreprise non trouvé'));
        }

        const response = await fetch(
          `${BaseUrl}/utilisateurs/updatedeleteentreprise/${entrepriseId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(t(errorData.detail || "Erreur serveur"));
        }

        const data = await response.json();
        setEntrepriseData(data || {});

        // Construction des URLs complètes
        if (data.logo) setLogo(buildImageUrl(data.logo));
        if (data.photo) setPhoto(buildImageUrl(data.photo));
      } catch (err) {
        // console.error("Erreur:", err);
        setError(err.message);
        toast.error(
                <span style={{ fontWeight: "bold", color: "red" }}>
                  {t(`Erreur: ${err.message}`)}
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
        // Initialiser avec un objet vide pour éviter les erreurs
        setEntrepriseData({});
      } finally {
        setLoading(false);
      }
    };

    fetchEntrepriseData();
  }, []);

    document.title = t('Entreprise') + " | INAWO - Suite de Gestion";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title={`${t('Entreprise')}`} 
            pageTitle={
              <>
                <i className="ri-bank-line"></i>
                &nbsp;&gt;&nbsp;<Link to="/">{t('Tableau de Bord')}</Link>&nbsp;&gt;
              </>
            }
          />
          <Row className="">
            <div className="col-lg-3 mt-lg-2">
              <div className="d-flex flex-column ">
                <div
                  className="card overflow-hidden flex-fill"
                  style={{ borderRadius: "20px" }}
                >
                  <div>
                    {loading ? (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: "200px", background: "#f8f9fa" }}>
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">{t('Chargement...')}</span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={photo || smallImage9}
                        alt={t('Photo entreprise')}
                        className="img-fluid"
                        style={{ height: "200px", objectFit: "cover", width: "100%" }}
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
                        {loading ? (
                          <div className="rounded-circle avatar-xl img-thumbnail d-flex align-items-center justify-content-center" style={{ width: "120px", height: "120px", background: "#f8f9fa" }}>
                            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                          </div>
                        ) : (
                          <img
                            src={logo || avatar1}
                            className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                            alt={t('Logo entreprise')}
                            style={{ width: "120px", height: "120px", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = avatar1;
                            }}
                          />
                        )}
                      </div>
                      <h5 className="fs-16 mb-1">
                        {loading ? (
                          <div className="placeholder-glow">
                            <span className="placeholder col-8"></span>
                          </div>
                        ) : (
                          entrepriseData?.nom || t('Nom de l\'entreprise')
                        )}
                      </h5>
                      <p className="text-muted mb-0">
                        {loading ? (
                          <div className="placeholder-glow">
                            <span className="placeholder col-6"></span>
                          </div>
                        ) : (
                          entrepriseData?.forme_juridique || t('Type d\'entreprise')
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-9 mt-lg-2">
              <div className="d-flex flex-column h-100">
                <Card
                  className="flex-fill"
                  style={{ borderRadius: "20px", overflow: "hidden" }}
                >
                  <CardHeader className="pb-0">
                    <div className="d-flex align-items-center justify-content-between">
                      <Nav
                        className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                        role="tablist"
                      >
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "1",
                            })}
                            onClick={() => setActiveTab("1")}
                          >
                            <i className="fas fa-home me-1"></i>
                           {t('Détail Entreprise')}
                          </NavLink>
                        </NavItem>
                      </Nav>

                      <div>
                        <Link
                          to="/:entreprise/modifier_entreprise"
                          className="btn btn-primary"
                          style={{ borderRadius: "20px" }}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              {t('Chargement...')}
                            </>
                          ) : (
                            t('Modifier Entreprise')
                          )}
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
                                <Label className="form-label">
                                  {t('Nom Entreprise')}
                                </Label>
                                {loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "38px", borderRadius: "20px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    value={entrepriseData?.nom || ""}
                                    placeholder= {t('Nom Entreprise')}
                                    style={{ borderRadius: "20px" }}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>

                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="phonenumberInput" className="form-label">
                                  {t('Téléphone')}
                                </Label>
                                {loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "38px", borderRadius: "20px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="phonenumberInput"
                                    value={entrepriseData?.telephone || ""}
                                    placeholder={t('Numéro de téléphone')}
                                    style={{ borderRadius: "20px" }}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>

                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="emailInput" className="form-label">
                                 {t('Email')}
                                </Label>
                                {loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "38px", borderRadius: "20px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="email"
                                    className="form-control"
                                    id="emailInput"
                                    value={entrepriseData?.email || ""}
                                    placeholder={t('Email')}
                                    style={{ borderRadius: "20px" }}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>

                            {/* <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="countryInput" className="form-label">
                                  Pays
                                </Label>
                                {loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "38px", borderRadius: "20px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="countryInput"
                                    value={entrepriseData?.pays || ""}
                                    placeholder="Pays non renseigné"
                                    style={{ borderRadius: "20px" }}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col> */}

                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="adresse" className="form-label">
                                   {t('Adresse')}
                                </Label>
                                {loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "38px", borderRadius: "20px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="adresse"
                                    value={entrepriseData?.adresse || ""}
                                    placeholder= {t('Adresse')}
                                    style={{ borderRadius: "20px" }}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>

                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="forme_juridique" className="form-label">
                                  {t('Forme Juridique')}
                                </Label>
                                {loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "38px", borderRadius: "20px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="forme_juridique"
                                    value={entrepriseData?.forme_juridique || ""}
                                    placeholder= {t('Forme Juridique')}
                                    style={{ borderRadius: "20px" }}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>

                            {/* <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="ville" className="form-label">
                                  Ville
                                </Label>
                                {loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "38px", borderRadius: "20px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="ville"
                                    value={entrepriseData?.ville || ""}
                                    placeholder="Ville non renseignée"
                                    style={{ borderRadius: "20px" }}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col> */}

                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="site_web" className="form-label">
                                  {t('Site Web')}
                                </Label>
                                {loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "38px", borderRadius: "20px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="url"
                                    className="form-control"
                                    id="site_web"
                                    value={entrepriseData?.site_web || ""}
                                    placeholder={t('Site Web')}
                                    style={{ borderRadius: "20px" }}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>

                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="capital_social" className="form-label">
                                 {t('Capital Social')}
                                </Label>
                                {loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "38px", borderRadius: "20px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="number"
                                    className="form-control"
                                    id="capital_social"
                                    value={entrepriseData?.capital_social || ""}
                                    placeholder= {t('Capital Social')}
                                    style={{ borderRadius: "20px" }}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>

                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="num_enreg_legal_1" className="form-label">
                                   {t('N° Legal 01')}
                                </Label>
                                {loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "38px", borderRadius: "20px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="legal_01"
                                    value={entrepriseData?.num_enreg_legal_1 || ""}
                                    placeholder={t('N°RCCM/ RB/CoT/00 B 00000')}
                                    style={{ borderRadius: "20px" }}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>

                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="num_enreg_legal_2" className="form-label">
                                  {t('N° Legal 02')}
                                </Label>
                                {loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "38px", borderRadius: "20px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="legal_02"
                                    value={entrepriseData?.num_enreg_legal_2 || ""}
                                    placeholder={t('N°IFU 02065000001')}
                                    style={{ borderRadius: "20px" }}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>

                            <Col lg={12}>
                              <div className="mb-3">
                                <Label htmlFor="objet_social" className="form-label">
                               {t('Objet Social')}
                                </Label>
                                {loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "100px", borderRadius: "20px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="textarea"
                                    className="form-control"
                                    id="objet_social"
                                    value={entrepriseData?.objet_social || ""}
                                    placeholder={t('Objet Social')}
                                    rows="4"
                                    style={{ borderRadius: "20px" }}
                                    disabled
                                  />
                                )}
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
