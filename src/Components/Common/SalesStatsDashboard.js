import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { BaseUrl } from "../../pages/APIKey/ApiKey";

const SalesStatsDashboard = () => {
  const [stats, setStats] = useState({
    loading: true,
    error: null,
    data: null
  });

  const { userProfile, token } = useProfile();

  // Fonction pour formater les nombres en milliers
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0";
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  // Configuration des 5 statistiques de vente
  const getSalesConfig = () => {
    return [
      { 
        name: "Vte du jour", 
        icon: "ri-calendar-event-line",
        period: "jour",
        color: "#014a92"
      },
      { 
        name: "Vte du mois", 
        icon: "ri-calendar-line",
        period: "mois",
        color: "#1fa5f3"
      },
      { 
        name: "Vte des 60 jours", 
        icon: "ri-calendar-2-line",
        period: "60jours",
        color: "#6dbd1c"
      },
      { 
        name: "Vte des 6 derniers mois", 
        icon: "ri-bar-chart-line",
        period: "6mois",
        color: "#f06548"
      },
      { 
        name: "Vente annuelle", 
        icon: "ri-line-chart-line",
        period: "annuelle",
        color: "#8950fc"
      },
    ];
  };

  // Fonction pour calculer les différentes statistiques
  const calculateSalesStats = (apiData) => {
    if (!apiData) return {};

    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toISOString().substring(0, 7);
    const currentYear = new Date().getFullYear().toString();

    // Vente du jour
    const venteJour = apiData.recapitulatif_journalier_30_derniers_jours
      ?.find(item => item.date === today)?.total || 0;

    // Vente du mois (mois en cours)
    const venteMois = apiData.recapitulatif_mensuel_annee_en_cours
      ?.find(item => item.month === currentMonth)?.total || 0;

    // Vente des 60 derniers jours
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const vente60Jours = apiData.recapitulatif_journalier_30_derniers_jours
      ?.filter(item => new Date(item.date) >= sixtyDaysAgo)
      ?.reduce((sum, item) => sum + item.total, 0) || 0;

    // Vente des 6 derniers mois
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const vente6Mois = apiData.recapitulatif_mensuel_annee_en_cours
      ?.filter(item => {
        const itemDate = new Date(item.month + '-01');
        return itemDate >= sixMonthsAgo;
      })
      ?.reduce((sum, item) => sum + item.total, 0) || 0;

    // Vente annuelle (année en cours)
    const venteAnnuelle = apiData.recapitulatif_annuel
      ?.find(item => item.year === currentYear)?.total || 0;

    return {
      venteJour,
      venteMois,
      vente60Jours,
      vente6Mois,
      venteAnnuelle
    };
  };

  // Fonction pour récupérer les données de vente
  const fetchSalesStats = async () => {
    if (!token || !userProfile) {
      console.log("En attente du token ou du profil utilisateur...");
      return;
    }

    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      const endpoint = `${BaseUrl}/facture/valeur-ventes/`;
      console.log("📊 Chargement des statistiques de vente depuis:", endpoint);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(endpoint, { headers });

      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }

      const apiData = await response.json();
      console.log("✅ Données de vente reçues de l'API:", apiData);

      const calculatedStats = calculateSalesStats(apiData);

      setStats({
        data: calculatedStats,
        loading: false,
        error: null,
      });

    } catch (error) {
      console.error("❌ Erreur lors du chargement des statistiques de vente:", error);

      setStats({
        data: null,
        loading: false,
        error: error.message || "Erreur lors du chargement des données",
      });
    }
  };

  useEffect(() => {
    if (token && userProfile) {
      fetchSalesStats();
    }
  }, [token, userProfile]);

  const salesConfig = getSalesConfig();

  // Fonction pour obtenir la valeur selon la période
  const getValueByPeriod = (period, data) => {
    if (!data) return 0;
    
    switch (period) {
      case "jour":
        return data.venteJour || 0;
      case "mois":
        return data.venteMois || 0;
      case "60jours":
        return data.vente60Jours || 0;
      case "6mois":
        return data.vente6Mois || 0;
      case "annuelle":
        return data.venteAnnuelle || 0;
      default:
        return 0;
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card
            className="crm-widget"
            style={{
              border: "none",
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <CardBody
              className="p-0"
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              {/* Bloc unique avec toutes les statistiques côte à côte */}
              <div
                className="card mb-0"
                style={{
                  boxShadow: "0 1px 0 rgba(56, 65, 74, 0.10)",
                  borderRadius: "20px",
                  border: "1px solid var(--vz-border-color)",
                //   padding: "0 15px",
                }}
              >
                <Row className="row-cols-xxl-5 row-cols-lg-3 row-cols-md-2 row-cols-1 g-3">
                  {salesConfig.map((item, key) => (
                    <Col
                      key={key}
                      style={{ border: "none", backgroundColor: "transparent" }}
                    >
                      <div
                        className="h-100 card-body"
                        style={{
                          borderRadius: "12px",
                          minHeight: "110px",
                        }}
                      >
                        {/* Conteneur principal avec icône à gauche et texte à droite */}
                        <div className="d-flex h-100">
                          {/* Icône dans un cercle - AGRANDIE */}
                          <div
                            className="d-flex align-items-center justify-content-center me-2 mt-4"
                            style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              backgroundColor: `${item.color}15`,
                              flexShrink: 0
                            }}
                          >
                            <i
                              className={item.icon}
                              style={{
                                color: item.color,
                                fontSize: '1.6rem',
                                lineHeight: 1,
                              }}
                            ></i>
                          </div>
                          
                          {/* Conteneur des textes alignés verticalement */}
                          <div className="d-flex flex-column justify-content-center flex-grow-1">
                            {/* Ligne 1: Catégorie */}
                            <div className="mb-0">
                              <span
                                className="text-muted"
                                style={{
                                  fontSize: "0.8rem",
                                  fontWeight: "500",
                                }}
                              >
                                {item.name}
                              </span>
                            </div>

                            {/* Ligne 2: Montant total */}
                            <div className="mb-0">
                              <span
                                style={{
                                  fontSize: "1.1rem",
                                  fontWeight: "700",
                                  lineHeight: "1.2",
                                //   color: item.color,
                                }}
                              >
                                {stats.loading ? (
                                  <div
                                    className="spinner-border spinner-border-sm"
                                    style={{ 
                                      color: item.color,
                                      width: "0.8rem",
                                      height: "0.8rem"
                                    }}
                                  ></div>
                                ) : stats.error ? (
                                  "Erreur"
                                ) : (
                                  `${formatNumber(getValueByPeriod(item.period, stats.data))}`
                                )}
                              </span>
                            </div>

                            {/* Ligne 3: Période détaillée */}
                            <div>
                              <span
                                className="text-muted"
                                style={{
                                  fontSize: "0.75rem",
                                  fontWeight: "400",
                                }}
                              >
                                {item.period === "jour" && "Aujourd'hui"}
                                {item.period === "mois" && "Ce mois"}
                                {item.period === "60jours" && "60 derniers jours"}
                                {item.period === "6mois" && "6 derniers mois"}
                                {item.period === "annuelle" && "Cette année"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>

                {/* {!stats.loading && stats.error && (
                  <div className="text-center py-4">
                    <i className="ri-error-warning-line text-danger mb-2" style={{ fontSize: "2rem" }}></i>
                    <h6 className="text-danger" style={{ fontSize: "0.9rem" }}>
                      Erreur de chargement
                    </h6>
                    <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                      {stats.error}
                    </p>
                    <button 
                      className="btn btn-sm btn-primary mt-2 rounded-pill"
                      onClick={fetchSalesStats}
                    >
                      <i className="ri-refresh-line me-1"></i>
                      Réessayer
                    </button>
                  </div>
                )} */}

                {/* {!stats.loading && !stats.error && stats.data && 
                 Object.values(stats.data).every(val => val === 0) && (
                  <div className="text-center py-4">
                    <i className="ri-bar-chart-line text-muted mb-2" style={{ fontSize: "2rem" }}></i>
                    <h6 className="text-muted" style={{ fontSize: "0.9rem" }}>
                      Aucune donnée de vente disponible
                    </h6>
                    <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                      Aucune vente enregistrée pour les périodes sélectionnées.
                    </p>
                  </div>
                )} */}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SalesStatsDashboard;