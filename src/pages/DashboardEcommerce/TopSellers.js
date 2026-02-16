import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { BaseUrl } from "../APIKey/ApiKey";
import avatar1 from "../../assets/images/users/user-dummy-img.jpg";
import UserProfile from "../Authentication/user-profile";

const TopSellers = () => {
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userProfile, token } = useProfile();
  const [state, setState] = useState({
    loading: true,
    error: null,
    userData: {},
    profilePhoto: avatar1,
  });

  const fetchTopSellers = async () => {
    if (!token || !userProfile) return;

    try {
      setLoading(true);
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(`${BaseUrl}/facture/dashboard/`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        const sellers = data.top_5_sellers || [];
        setTopSellers(sellers);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des meilleurs vendeurs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && userProfile) {
      fetchTopSellers();
    }
  }, [token, userProfile]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userProfile?.id) {
          throw new Error("Session invalide");
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
        }));
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
  }, [userProfile, token]);

  // Fonction pour gérer l'erreur de chargement d'image
  const handleImageError = (event) => {
    console.log(`Image non disponible, affichage de l'icône à la place`);
    event.target.style.display = "none";
  };

  return (
    <React.Fragment>
      <Col xl={6}>
        <Card style={{ borderRadius: 20 }}>
          <CardHeader
            className="align-items-center d-flex"
            style={{ borderRadius: "20px 20px 0 0" }}
          >
            <h4 className="card-title mb-0 flex-grow-1">Meilleurs vendeurs</h4>
          </CardHeader>

          <CardBody className="p-0">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Chargement...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-centered table-hover align-middle mb-0">
                  <tbody>
                    {topSellers.length > 0 ? (
                      topSellers.map((seller, key) => (
                        <tr key={key} style={{ height: "60px" }}>
                          {/* Colonne Vendeur */}
                          <td style={{ width: "35%" }}>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 me-3">
                                {/* Conteneur pour l'avatar */}
                                <div className="position-relative">
                                  {/* Image - affichée seulement si elle existe dans state.profilePhoto */}
                                  {state.profilePhoto &&
                                  state.profilePhoto !== avatar1 ? (
                                    <img
                                      src={state.profilePhoto}
                                      alt={seller.nom_vendeur}
                                      className="rounded-circle"
                                      style={{
                                        width: "45px",
                                        height: "45px",
                                        objectFit: "cover",
                                        border: "1px solid #dee2e6",
                                      }}
                                      onError={handleImageError}
                                    />
                                  ) : (
                                    // Div circulaire avec icône - affichée quand il n'y a pas d'image
                                    <div
                                      className="avatar-title bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                                      style={{
                                        width: "45px",
                                        height: "45px",
                                      }}
                                    >
                                      <i className="ri-user-3-line fs-18"></i>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <span
                                  className="fw-medium d-block"
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    maxWidth: "180px",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  {seller.nom_vendeur}
                                </span>
                                <small className="text-muted">
                                  {userProfile?.type_utilisateur}
                                </small>
                              </div>
                            </div>
                          </td>

                          {/* Colonne Nombre de ventes */}
                          <td style={{ width: "15%" }} className="text-center">
                            <div className="d-flex flex-column justify-content-center h-100">
                              <span className="fw-semibold text-dark mb-1">
                                {seller.nombre_total_ventes}
                              </span>
                              <small className="text-muted">Nb. ventes</small>
                            </div>
                          </td>

                          {/* Colonne Valeur des ventes */}
                          <td style={{ width: "25%" }} className="text-center">
                            <div className="d-flex flex-column justify-content-center h-100">
                              <span className="fw-semibold text-dark mb-1">
                                {formatNumber(seller.valeur_des_ventes)}
                              </span>
                              <small className="text-muted">
                                Valeur ventes
                              </small>
                            </div>
                          </td>
                          {/* Colonne Performance */}
                          <td style={{ width: "25%" }} className="text-center">
                            <div className="d-flex flex-column justify-content-center h-100">
                              <div className="d-flex align-items-center justify-content-center mb-1">
                                <span className="fw-bold text-success me-2">
                                  {seller.pourcentage}%
                                </span>
                                <i className="ri-bar-chart-fill text-success fs-16"></i>
                              </div>
                              <small className="text-muted">Performance</small>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-4">
                          <div className="d-flex flex-column align-items-center">
                            <i className="ri-user-3-line fs-48 text-muted mb-2"></i>
                            <span>Aucun vendeur trouvé</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default TopSellers;
