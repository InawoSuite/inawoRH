import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import CountUp from "react-countup";
import FeatherIcon from "feather-icons-react";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { useFetchOptimized } from "../../Components/Hooks/useFetchOptimized";
import { BaseUrl } from "../APIKey/ApiKey";

const StatsDashboard = () => {
  const [stats, setStats] = useState({
    recettesTotales: null,
    depensesExploitation: null,
    benefice: null,
    ventesTotales: null,
    depensesInvestissement: null,
  });
  const { userProfile, token } = useProfile();

  // Récupérer les données du dashboard avec optimisation
  const { data: dashboardData, loading, error } = useFetchOptimized(
    token && userProfile ? `${BaseUrl}/facture/dashboard/` : null,
    token
  );

  // Traiter les données du dashboard
  useEffect(() => {
    if (dashboardData) {
      try {
        const annualSummary = dashboardData?.annual_summary || {};

        setStats({
          recettesTotales: annualSummary.recettes_totales || 0,
          depensesExploitation: annualSummary.depenses_exploitation || 0,
          benefice: annualSummary.benefice || 0,
          ventesTotales: annualSummary.ventes_totales || 0,
          depensesInvestissement: annualSummary.depenses_investissement || 0,
        });

        console.log("📊 Données dashboard reçues:", annualSummary);
      } catch (err) {
        console.error("❌ Erreur traitement dashboard:", err);
      }
    }

    if (error) {
      console.error("❌ Erreur lors du chargement des statistiques:", error);
    }
  }, [dashboardData, error]);

  const tileBoxs2 = [
    {
      id: 1,
      label: "RECETTES TOTALES",
      badge: "ri-arrow-up-circle-line text-white",
      icon: "ri-space-ship-line",
      counter: stats.recettesTotales !== null ? stats.recettesTotales : 0,
      decimals: 0,
      prefix: "",
      suffix: " ",
      gradient: "linear-gradient(135deg, #014a92 0%, #0069a8 64.6%)",
      textColor: "#ffffff",
    },
    {
      id: 2,
      label: "DEPENSES",
      badge: "ri-arrow-down-circle-line text-white",
      icon: "ri-exchange-dollar-line",
      counter: stats.depensesExploitation !== null ? stats.depensesExploitation : 0,
      decimals: 0,
      prefix: "",
      suffix: " ",
      gradient: "linear-gradient(135deg, #1fa5f3 0%, #0069a8 64.6%)",
      textColor: "#ffffff",
    },
    {
      id: 3,
      label: stats.benefice !== null
        ? stats.benefice >= 0 ? "BÉNÉFICE" : "PERTE"
        : "BÉNÉFICE/PERTE",
      badge: stats.benefice !== null && stats.benefice >= 0
        ? "ri-arrow-up-circle-line text-white"
        : "ri-arrow-down-circle-line text-white",
      icon: "ri-pulse-line",
      counter: stats.benefice !== null ? Math.abs(stats.benefice) : 0,
      decimals: 0,
      prefix: stats.benefice !== null ? (stats.benefice >= 0 ? "" : "-") : "",
      suffix: " ",
      gradient: stats.benefice !== null && stats.benefice >= 0
        ? "linear-gradient(135deg, #6dbd1cad 0%, #3d7a00 64.6%)"
        : "linear-gradient(135deg, #dc3545 0%, #a71d2a 64.6%)",
      textColor: "#ffffff",
    },
    {
      id: 4,
      label: "VENTES TOTALES",
      badge: "ri-arrow-up-circle-line text-white",
      icon: "ri-trophy-line",
      counter: stats.ventesTotales !== null ? stats.ventesTotales : 0,
      decimals: 0,
      prefix: "",
      suffix: " ",
      separator: ",",
      gradient: "linear-gradient(135deg, #1fa5f3 0%, #0069a8 64.6%)",
      textColor: "#ffffff",
    },
    {
      id: 5,
      label: "INVESTISSEMENTS",
      badge: "ri-arrow-down-circle-line text-white",
      icon: "ri-service-line",
      counter: stats.depensesInvestissement !== null ? stats.depensesInvestissement : 0,
      decimals: 0,
      separator: ",",
      prefix: "",
      suffix: " ",
      gradient: "linear-gradient(135deg, #014a92 0%, #0069a8 64.6%)",
      textColor: "#ffffff",
    },
  ];

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card
            className="crm-widget rounded-4"
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
              <Row className="row-cols-md-3 row-cols-1 g-2">
                {(tileBoxs2 || []).map((item, key) => (
                  <Col
                    className="col-lg"
                    key={key}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      minHeight: "60px",
                    }}
                  >
                    <div
                      className="py-4 px-3 h-60 rounded-3"
                      style={{
                        background: item.gradient,
                        color: item.textColor,
                        border: "none",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        marginBottom: "8px",
                      }}
                    >
                      <h5
                        className="text-uppercase fs-13 mb-0"
                        style={{ color: item.textColor }}
                      >
                        {item.label}
                        <i
                          className={
                            "fs-14 float-end align-middle " + item.badge
                          }
                        ></i>
                      </h5>
                      <div className="d-flex align-items-center mt-0">
                        <div className="flex-shrink-0">
                          <i
                            className={"fs-1 " + item.icon}
                            style={{ color: item.textColor }}
                          ></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h2
                            className="mb-0"
                            style={{
                              color: item.textColor,
                              fontSize: "1.2rem",
                            }}
                          >
                            <span className="counter-value">
                              {loading ? (
                                <span style={{ fontSize: "0.9rem" }}>
                                  Chargement...
                                </span>
                              ) : error ? (
                                <span style={{ fontSize: "0.9rem" }}>
                                  Erreur
                                </span>
                              ) : (
                                <>
                                  {item.prefix}
                                  <CountUp
                                    start={0}
                                    end={item.counter}
                                    decimals={item.decimals}
                                    duration={2}
                                    separator=" "
                                  />
                                  {item.suffix}
                                </>
                              )}
                            </span>
                          </h2>
                        </div>
                      </div>
                      {error && (
                        <div className="mt-2">
                          <small style={{ color: "#ffc107" }}>
                            <FeatherIcon icon="alert-triangle" size="14" />{" "}
                            Données indisponibles
                          </small>
                        </div>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default StatsDashboard;