import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  Form,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  FormFeedback,
  Button,
  Badge,
  Table,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { toast } from "react-toastify";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import smallImage9 from "../../../assets/images/small/img-9.jpg";
import dummyImg from "../../../assets/images/users/user-dummy-img.jpg";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import * as Yup from "yup";
import { useFormik } from "formik";
import PhoneInput from "../../../Components/ContactDeleteModal/CountryPhoneInput";
import { country } from "../../../common/data";
import Flatpickr from "react-flatpickr";
import * as moment from "moment";
import TableContainer from "../../../Components/Common/TableContainer";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../../Components/Common/ChartsDynamicColor";
import FeatherIcon from "feather-icons-react";

const ProjectsOverviewCharts = ({ dataColors, chartData }) => {
    var linechartcustomerColors = getChartColorsArray(dataColors);

    // Si pas de données, afficher un graphique vide mais stylisé
    if (!chartData || !chartData.series || chartData.series.length === 0 || 
        chartData.series.every(s => !s.data || s.data.length === 0)) {
        
        // Configuration pour un graphique vide
        const emptyOptions = {
            chart: {
                height: 374,
                type: 'line',
                toolbar: {
                    show: false,
                }
            },
            stroke: {
                curve: 'smooth',
                dashArray: [0, 3, 0],
                width: [0, 2, 0],
            },
            fill: {
                opacity: [0.8, 0.1, 0.8]
            },
            xaxis: {
                categories: ['Aucune', 'donnée', 'disponible'],
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                },
                labels: {
                    style: {
                        colors: '#999'
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: '#999'
                    }
                }
            },
            grid: {
                show: true,
                borderColor: '#f0f0f0',
                xaxis: {
                    lines: {
                        show: true,
                    }
                },
                yaxis: {
                    lines: {
                        show: false,
                    }
                }
            },
            legend: {
                show: false
            },
            tooltip: {
                enabled: false
            },
            annotations: {
                texts: [{
                    x: '50%',
                    y: '50%',
                    textAnchor: 'middle',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    fontWeight: '400',
                    color: '#999'
                }]
            }
        };

        const emptySeries = [
            {
                name: 'Revenus Encaissés',
                type: 'column',
                data: []
            },
            {
                name: 'Nombre Commandes',
                type: 'line',
                data: []
            },
            {
                name: 'Dépenses Effectuées',
                type: 'column',
                data: []
            }
        ];

        return (
            <React.Fragment>
                <ReactApexChart 
                    options={emptyOptions}
                    series={emptySeries}
                    type="line"
                    height="374"
                    className="apex-charts"
                />
            </React.Fragment>
        );
    }

    // Configuration pour les données existantes
    const options = {
        chart: {
            height: 374,
            type: 'line',
            toolbar: {
                show: false,
            }
        },
        stroke: {
            curve: 'smooth',
            dashArray: [0, 3, 0],
            width: [0, 2, 0],
        },
        fill: {
            opacity: [0.8, 0.1, 0.8]
        },
        markers: {
            size: [0, 4, 0],
        },
        xaxis: {
            categories: chartData.categories || [],
            axisTicks: {
                show: false
            },
            axisBorder: {
                show: false
            }
        },
        grid: {
            show: true,
            xaxis: {
                lines: {
                    show: true,
                }
            },
            yaxis: {
                lines: {
                    show: false,
                }
            },
        },
        colors: linechartcustomerColors,
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'right',
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: function (y) {
                    if (typeof y !== "undefined") {
                        return y.toFixed(0) + " ";
                    }
                    return y;
                }
            }
        }
    };

    return (
        <React.Fragment>
            <ReactApexChart 
                dir="ltr"
                options={options}
                series={chartData.series}
                type="line"
                height="374"
                className="apex-charts"
            />
        </React.Fragment>
    );
};

const DetailTeam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [collaborateurData, setCollaborateurData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useProfile();

  const RenderUserInfo = ({ label, value }) => {
    if (value === null || value === undefined || value === "") return null;

    return (
      <tr className="p-0">
        <th className="pe-2" style={{ whiteSpace: "nowrap" }} scope="row">
          {label}
        </th>
        <td
          className="text-muted ps-0"
          style={{
            width: "110px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          : {value}
        </td>
      </tr>
    );
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id || !token) return;

      try {
        setLoading(true);
        const response = await fetch(
          `https://inawoapiv3.inawo.pro/facture/detail_collaborateur/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const data = await response.json();
        setCollaborateurData(data);
        
        // Utiliser les données du collaborateur_profile comme userDetails
        const collaborateurProfile = data.collaborateur_profile;
        setUserDetails({
          id: id,
          nom: collaborateurProfile?.nom?.split(' ')[0] || "",
          prenom: collaborateurProfile?.nom?.split(' ').slice(1).join(' ') || "",
          email: collaborateurProfile?.email || "",
          telephone: collaborateurProfile?.telephone || "",
          adresse: collaborateurProfile?.adresse || "",
          entreprise: collaborateurProfile?.entreprise || "",
          revenu_estimatif: collaborateurProfile?.revenu_estimatif || "",
          date_anniversaire: collaborateurProfile?.date_anniversaire || "",
          forme_juridique: collaborateurProfile?.forme_juridique || "",
          photo: collaborateurProfile?.profile_image || null,
          type_utilisateur: "Collaborateur"
        });
      } catch (error) {
        setError(error.message);
        toast.error("Erreur de chargement des détails de l'utilisateur");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, token]);

  const handleUpdateUser = async (values) => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://inawoapiv3.inawo.pro/utilisateurs/colaborateuruser/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Update failed");

      setUserDetails(data);
      setModal(false);
      toast.success("Utilisateur mis à jour !");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      nom: userDetails?.nom || "",
      prenom: userDetails?.prenom || "",
      email: userDetails?.email || "",
      telephone: userDetails?.telephone || "",
      adresse: userDetails?.adresse || "",
      entreprise: userDetails?.entreprise || "",
    },
    validationSchema: Yup.object({
      nom: Yup.string().required("Le nom est requis"),
      prenom: Yup.string().required("Le prénom est requis"),
      email: Yup.string()
        .email("Email invalide")
        .required("L'email est requis"),
      telephone: Yup.string().test(
        "is-valid-phone",
        "Numéro invalide",
        function (value) {
          if (!value) return true;
          const strValue = String(value);
          return strValue.startsWith("+") && strValue.length > 6;
        }
      ),
    }),
    onSubmit: async (values) => {
      await handleUpdateUser(values);
    },
  });

  const toggle = () => {
    if (modal) {
      setModal(false);
      validation.resetForm();
    } else {
      setModal(true);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non renseigné";
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Préparer les données pour le graphique
  const chartData = useMemo(() => {
    if (!collaborateurData?.global_overview?.graphique_mensuel) {
      return null;
    }
    
    const monthlyData = collaborateurData.global_overview.graphique_mensuel;
    
    return {
      categories: monthlyData.map(item => item.mois),
      series: [
        {
          name: 'Revenus Encaissés',
          type: 'column',
          data: monthlyData.map(item => item.revenus_encaisses || 0)
        },
        {
          name: 'Nombre Commandes',
          type: 'line',
          data: monthlyData.map(item => item.nombre_commandes || 0)
        },
        {
          name: 'Dépenses Effectuées',
          type: 'column',
          data: monthlyData.map(item => item.depenses_effectuees || 0)
        }
      ]
    };
  }, [collaborateurData]);

  // Colonnes pour le tableau des produits/services
  const columns = useMemo(
    () => [
      {
        header: "#",
        enableSorting: false,
        cell: () => {
          return <input type="checkbox" className="form-check-input" />;
        },
      },
      {
        header: "Nom",
        accessorKey: "nom",
        enableColumnFilter: false,
        cell: (cell) => (
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <h5 className="fs-14 mb-1">
                {cell.getValue() || "N/A"}
              </h5>
            </div>
          </div>
        ),
      },
      {
        header: "Type",
        accessorKey: "type",
        enableColumnFilter: false,
      },
      {
        header: "Prix",
        accessorKey: "prix",
        enableColumnFilter: false,
        cell: (cell) => {
          return cell.getValue() ? `${cell.getValue()} ` : "N/A";
        },
      },
      {
        header: "Statut",
        accessorKey: "statut",
        enableColumnFilter: false,
        cell: (cell) => {
          const status = cell.getValue();
          const color = status === "Actif" ? "success" : "warning";
          return <Badge color={color}>{status || "Inactif"}</Badge>;
        },
      }
    ],
    []
  );

  // Combiner les données des produits et services pour le tableau
  const tableData = useMemo(() => {
    if (!collaborateurData) return [];
    
    const products = (collaborateurData.products_table || []).map(item => ({
      ...item,
      type: "Produit"
    }));
    
    const services = (collaborateurData.services_list || []).map(item => ({
      ...item,
      type: "Service"
    }));
    
    return [...products, ...services];
  }, [collaborateurData]);

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Chargement...</span>
            </div>
            <p className="mt-2">Chargement des détails de l'utilisateur...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center py-4">
            <div className="text-danger mb-3">
              <i className="ri-error-warning-line display-4"></i>
            </div>
            <p className="text-danger">{error}</p>
            <Button color="primary" onClick={() => navigate("/:entreprise/utilisateur")}>
              Retour à la liste
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center py-4">
            <p>Utilisateur non trouvé</p>
            <Button color="primary" onClick={() => navigate("/:entreprise/utilisateur")}>
              Retour à la liste
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  document.title = `Détail Utilisateur | ${userDetails.nom} ${userDetails.prenom}`;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title={`Détail Utilisateur - ${userDetails.nom} ${userDetails.prenom}`}
            pageTitle={
              <>
                <i className="ri-group-line"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                <Link to="/team">Équipe</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <div className="col-lg-3 mt-lg-2">
              <div className="d-flex flex-column h-90">
                <div className="card overflow-hidden flex-fill" style={{ borderRadius: "20px" }}>
                  <div>
                    <img src={smallImage9} alt="" className="img-fluid" />
                  </div>
                  <div className="card-body pt-0 mt-n5">
                    <div className="text-center">
                      <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                        <img
                          src={userDetails.photo ? `https://inawoapiv3.inawo.pro${userDetails.photo}` : avatar1}
                          className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                          alt="user-profile"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = avatar1;
                          }}
                        />
                      </div>
                      <h5 className="fs-16 mb-1">
                        {userDetails.nom} {userDetails.prenom}
                      </h5>
                      <p className="text-muted mb-0">{userDetails.type_utilisateur}</p>
                      <p className="text-muted">{userDetails.entreprise || "Aucune entreprise"}</p>
                    </div>
                  </div>

                  <Card>
                    <CardBody style={{ overflowY: "auto" }}>
                      <div className="table-responsive">
                        <Table className="table-borderless mb-0">
                          <tbody>
                            <RenderUserInfo label="ID" value={userDetails.id} />
                            <RenderUserInfo label="Nom" value={userDetails.nom} />
                            <RenderUserInfo label="Prénom" value={userDetails.prenom} />
                            <RenderUserInfo label="Email" value={userDetails.email} />
                            <RenderUserInfo label="Téléphone" value={userDetails.telephone} />
                            <RenderUserInfo label="Adresse" value={userDetails.adresse} />
                            <RenderUserInfo label="Entreprise" value={userDetails.entreprise} />
                            <RenderUserInfo label="Revenu estimatif" value={userDetails.revenu_estimatif} />
                            <RenderUserInfo label="Date anniversaire" value={formatDate(userDetails.date_anniversaire)} />
                            <RenderUserInfo label="Forme juridique" value={userDetails.forme_juridique} />
                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>

                  {/* <div className="card-body border-top">
                    <div className="d-flex justify-content-center mb-4 pb-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ borderRadius: "20px" }}
                        onClick={() => {
                          setIsEdit(true);
                          setModal(true);
                        }}
                      >
                        Modifier informations
                      </button>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              {/* Vue d'ensemble */}
              <Row className="mb-4">
                <Col xl={12}>
                  <Card style={{ borderRadius: "20px" }}>
                    <CardBody>
                      <Row className="align-items-center">
                        <Col sm={6}>
                          <div className="mb-0">
                            <h5 className="card-title mb-0">Vue d'ensemble {collaborateurData?.global_overview?.annee}</h5>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col sm={4}>
                          <div className="text-center">
                            <p className="text-muted mb-2">Total Revenus</p>
                            <h5 className="text-success mb-0">
                              {collaborateurData?.global_overview?.total_revenus_encaisses?.toLocaleString() || 0} 
                            </h5>
                          </div>
                        </Col>
                        <Col sm={4}>
                          <div className="text-center">
                            <p className="text-muted mb-2">Total Dépenses</p>
                            <h5 className="text-danger mb-0">
                              {collaborateurData?.global_overview?.total_depenses_effectuees?.toLocaleString() || 0} 
                            </h5>
                          </div>
                        </Col>
                        <Col sm={4}>
                          <div className="text-center">
                            <p className="text-muted mb-2">Nombre Commandes</p>
                            <h5 className="text-primary mb-0">
                              {collaborateurData?.global_overview?.total_nombre_commandes || 0}
                            </h5>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Graphique */}
              <Row className="mb-4">
                <Col xl={12}>
                  <Card style={{ borderRadius: "20px" }}>
                    <CardBody>
                      <h5 className="card-title mb-4">Évolution mensuelle</h5>
                      <ProjectsOverviewCharts 
                        dir="ltr"
                        dataColors='["--vz-primary", "--vz-success", "--vz-warning"]' 
                        chartData={chartData}
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              {/* Tableau des produits et services */}
              <Row>
                <Col xl={12}>
                  <Card style={{ borderRadius: "20px" }}>
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="card-title mb-0">Produits et Services</h5>
                        <div className="search-box">
                          <input
                            style={{ borderRadius: "20px" }}
                            type="text"
                            className="form-control"
                            placeholder="Rechercher..."
                          />
                          <i className="ri-search-line search-icon"></i>
                        </div>
                      </div>
                      
                      {tableData.length > 0 ? (
                        <div className="table-card gridjs-border-none pb-2">
                          <TableContainer
                            columns={columns}
                            data={tableData}
                            isGlobalFilter={false}
                            isAddUserList={false}
                            customPageSize={10}
                            divClass="table-responsive"
                            tableClass="mb-0 table-borderless"
                            theadClass="table-light text-muted"
                          />
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <i className="ri-inbox-line display-4 text-muted"></i>
                          <p className="text-muted mt-2">Aucun produit ou service trouvé</p>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <div className="text-end mt-4">
                <Button
                  color="secondary"
                  onClick={() => navigate("/:entreprise/utilisateur")}
                  style={{ borderRadius: "20px" }}
                >
                  <i className="ri-arrow-left-line me-1"></i>
                  Retour à la liste
                </Button>
              </div>
            </div>
          </Row>
        </Container>
      </div>

      {/* Modal de modification */}
      <Modal
        id="showModal"
        isOpen={modal}
        toggle={toggle}
        centered
      >
        <ModalHeader toggle={toggle}>
          Modifier l'utilisateur
        </ModalHeader>
        <Form
          className="tablelist-form"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
          }}
        >
          <ModalBody>
            <Row className="g-3">
              <Col lg={6}>
                <div>
                  <Label htmlFor="nom-field" className="form-label">
                    Nom <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    name="nom"
                    id="nom-field"
                    className="form-control"
                    placeholder="Entrez le nom"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.nom || ""}
                    invalid={validation.touched.nom && validation.errors.nom ? true : false}
                  />
                  {validation.touched.nom && validation.errors.nom ? (
                    <FormFeedback type="invalid">{validation.errors.nom}</FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col lg={6}>
                <div>
                  <Label htmlFor="prenom-field" className="form-label">
                    Prénom <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    name="prenom"
                    id="prenom-field"
                    className="form-control"
                    placeholder="Entrez le prénom"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.prenom || ""}
                    invalid={validation.touched.prenom && validation.errors.prenom ? true : false}
                  />
                  {validation.touched.prenom && validation.errors.prenom ? (
                    <FormFeedback type="invalid">{validation.errors.prenom}</FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col lg={12}>
                <div>
                  <Label htmlFor="email-field" className="form-label">
                    Email <span style={{ color: "red" }}>*</span>
                  </Label>
                  <Input
                    name="email"
                    id="email-field"
                    className="form-control"
                    placeholder="Entrez l'email"
                    type="email"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email || ""}
                    invalid={validation.touched.email && validation.errors.email ? true : false}
                  />
                  {validation.touched.email && validation.errors.email ? (
                    <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                  ) : null}
                </div>
              </Col>

              <Col lg={6}>
                <div>
                  <Label className="form-label">Téléphone</Label>
                  <PhoneInput
                    name="telephone"
                    value={validation.values.telephone || ""}
                    onChange={(value) => {
                      validation.setFieldValue("telephone", value ? String(value) : "");
                    }}
                    countries={country}
                    defaultCountry="FR"
                    onBlur={() => validation.setFieldTouched("telephone", true)}
                  />
                  {validation.touched.telephone && validation.errors.telephone && (
                    <div className="text-danger">{validation.errors.telephone}</div>
                  )}
                </div>
              </Col>

              <Col lg={6}>
                <div>
                  <Label htmlFor="entreprise-field" className="form-label">
                    Entreprise
                  </Label>
                  <Input
                    name="entreprise"
                    id="entreprise-field"
                    className="form-control"
                    placeholder="Entrez l'entreprise"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.entreprise || ""}
                  />
                </div>
              </Col>

              <Col lg={12}>
                <div>
                  <Label htmlFor="adresse-field" className="form-label">
                    Adresse
                  </Label>
                  <Input
                    name="adresse"
                    id="adresse-field"
                    className="form-control"
                    placeholder="Entrez l'adresse"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.adresse || ""}
                  />
                </div>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <Button color="light" onClick={() => setModal(false)}>
                Fermer
              </Button>
              <Button type="submit" color="success" disabled={loading}>
                {loading ? "Enregistrement..." : "Mettre à jour"}
              </Button>
            </div>
          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default DetailTeam;