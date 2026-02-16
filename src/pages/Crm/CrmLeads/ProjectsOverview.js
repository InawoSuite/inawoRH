import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import CountUp from "react-countup";
import { ProjectsOverviewCharts } from './DashboardProjectCharts'; // Corrigez l'import
import { useProfile } from "../../../Components/Hooks/UserHooks";
import { BaseUrl } from "../../APIKey/ApiKey"

const ProjectsOverview = ({ clientId }) => {
    const [chartData, setChartData] = useState(null);
    const [dashboardStats, setDashboardStats] = useState({
        achat_annuel: 0,
        reglements: 0,
        creances: 0,
        nombre_commandes: 0
    });
    const [clientName, setClientName] = useState("");
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useProfile();

    // Fonction pour récupérer les statistiques du client
    const fetchClientStats = async () => {
        if (!clientId || !token) {
            console.error("clientId ou token manquant");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            console.log("Tentative de récupération des données pour clientId:", clientId);

            // Récupérer les données du client
            const response = await fetch(
                `${BaseUrl}/utilisateurs/contact_client/${clientId}/detail/`,
                { headers }
            );

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log("Données client reçues:", data);

            // Mettre à jour les statistiques
            setDashboardStats({
                achat_annuel: data.achat_annuel || 0,
                reglements: data.reglements || 0,
                creances: data.creances || 0,
                nombre_commandes: data.nombre_commandes || 0
            });

            setClientName(data.client || "Client");

            // Générer les données du graphique
            generateChartDataFromAPI(data);

        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            setError(error.message || "Erreur de chargement des données");
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour générer les données du graphique à partir des données API
    const generateChartDataFromAPI = (apiData) => {
        setChartLoading(true);

        try {
            const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
            
            // Initialiser les tableaux pour les 12 mois avec 0 au lieu de null
            const achatsData = new Array(12).fill(0);
            const reglementsData = new Array(12).fill(0);
            const produitsData = new Array(12).fill(0);

            console.log("Données pour le graphique:", {
                achats_mensuels: apiData.achats_mensuels,
                reglements_mensuels: apiData.reglements_mensuels,
                produits_mensuels: apiData.produits_mensuels
            });

            // Remplir les données d'achats mensuels
            if (apiData.achats_mensuels && apiData.achats_mensuels.length > 0) {
                apiData.achats_mensuels.forEach(item => {
                    try {
                        const date = new Date(item.mois);
                        const monthIndex = date.getMonth(); // 0-11
                        achatsData[monthIndex] = item.total || 0;
                    } catch (e) {
                        console.error("Erreur de parsing date achats:", e);
                    }
                });
            }

            // Remplir les données de règlements mensuels
            if (apiData.reglements_mensuels && apiData.reglements_mensuels.length > 0) {
                apiData.reglements_mensuels.forEach(item => {
                    try {
                        const date = new Date(item.mois);
                        const monthIndex = date.getMonth();
                        reglementsData[monthIndex] = item.total || 0;
                    } catch (e) {
                        console.error("Erreur de parsing date règlements:", e);
                    }
                });
            }

            // Remplir les données de produits mensuels
            if (apiData.produits_mensuels && apiData.produits_mensuels.length > 0) {
                apiData.produits_mensuels.forEach(item => {
                    try {
                        const date = new Date(item.mois);
                        const monthIndex = date.getMonth();
                        // Convertir la string en nombre
                        produitsData[monthIndex] = parseFloat(item.total) || 0;
                    } catch (e) {
                        console.error("Erreur de parsing date produits:", e);
                    }
                });
            }

            const formattedData = [
                {
                    name: 'Achats effectués',
                    type: 'column',
                    data: achatsData
                },
                {
                    name: 'Nombre de produits achetés',
                    type: 'line',
                    data: produitsData
                },
                {
                    name: 'Règlements reçus',
                    type: 'column', 
                    data: reglementsData
                }
            ];
            
            console.log("Données formatées pour graphique:", {
                series: formattedData,
                categories: monthNames
            });

            setChartData({
                series: formattedData,
                categories: monthNames
            });

        } catch (error) {
            console.error('Erreur lors de la génération du graphique:', error);
            setChartData({
                series: [
                    { name: 'Achats effectués', type: 'column', data: [] },
                    { name: 'Nombre de produits achetés', type: 'line', data: [] },
                    { name: 'Règlements reçus', type: 'column', data: [] }
                ],
                categories: []
            });
        } finally {
            setChartLoading(false);
        }
    };

    useEffect(() => {
        if (clientId && token) {
            console.log("useEffect déclenché - clientId:", clientId);
            fetchClientStats();
        } else {
            console.log("Conditions non remplies - clientId:", clientId, "token:", !!token);
        }
    }, [clientId, token]);

    // Ajoutez un log pour le débogage
    console.log("État actuel:", {
        clientId,
        loading,
        chartLoading,
        error,
        chartData: !!chartData,
        dashboardStats
    });

    return (
        <React.Fragment>
            <Row>
                <Col xl={12}>
                    <Card style={{ border: "none", borderRadius: "20px"}}>
                        <CardHeader className="border-0 align-items-center d-flex" style={{borderRadius:"20px"}}>
                            <h4 className="card-title mb-0 flex-grow-1">
                                Vue Globale - {clientName}
                            </h4>
                            <div className="d-flex gap-1">
                                <span style={{ border: "none"}}>
                                    Année : {new Date().getFullYear()}
                                </span>
                            </div>
                        </CardHeader>

                        <CardHeader className="p-0 border-0 bg-light-subtle">
                            <Row className="g-0 text-center">
                                <Col xs={6} md={3} lg={3}>
                                    <div className="p-3 border border-dashed border-start-0">
                                        <h5 className="mb-1">
                                            {loading ? (
                                                <span>Chargement...</span>
                                            ) : (
                                                <span className="counter-value">
                                                    <CountUp
                                                        start={0}
                                                        end={dashboardStats.achat_annuel}
                                                        separator={" "}
                                                        duration={4}
                                                    />
                                                </span>
                                            )}
                                        </h5>
                                        <p className="text-muted mb-0">Achat annuel</p>
                                    </div>
                                </Col>

                                <Col xs={6} md={3} lg={3}>
                                    <div className="p-3 border border-dashed border-start-0">
                                        <h5 className="mb-1">
                                            {loading ? (
                                                <span>Chargement...</span>
                                            ) : (
                                                <span className="counter-value">
                                                    <CountUp
                                                        start={0}
                                                        end={dashboardStats.reglements}
                                                        separator={" "}
                                                        duration={4}
                                                    />
                                                </span>
                                            )}
                                        </h5>
                                        <p className="text-muted mb-0">Règlements effectués</p>
                                    </div>
                                </Col>

                                <Col xs={6} md={3} lg={3}>
                                    <div className="p-3 border border-dashed border-start-0">
                                        <h5 className="mb-1">
                                            {loading ? (
                                                <span>Chargement...</span>
                                            ) : (
                                                <span className="counter-value">
                                                    <CountUp
                                                        start={0}
                                                        end={dashboardStats.creances}
                                                        separator={" "}
                                                        duration={4}
                                                    />
                                                </span>
                                            )}
                                        </h5>
                                        <p className="text-muted mb-0">Créances Clients</p>
                                    </div>
                                </Col>

                                <Col xs={6} md={3} lg={3}>
                                    <div className="p-3 border border-dashed border-start-0 border-end-0">
                                        <h5 className="mb-1">
                                            {loading ? (
                                                <span>Chargement...</span>
                                            ) : (
                                                <span className="counter-value">
                                                    <CountUp
                                                        start={0}
                                                        end={dashboardStats.nombre_commandes}
                                                        duration={4}
                                                    />
                                                </span>
                                            )}
                                        </h5>
                                        <p className="text-muted mb-0">Nombre de commandes</p>
                                    </div>
                                </Col>
                            </Row>
                        </CardHeader>
                        
                        <CardBody className="p-0 pb-2">
                            <div>
                                {error ? (
                                    <div className="text-center py-4 text-danger">
                                        <p>{error}</p>
                                        <button 
                                            className="btn btn-sm btn-primary mt-2"
                                            onClick={fetchClientStats}
                                        >
                                            Réessayer
                                        </button>
                                    </div>
                                ) : chartLoading || loading ? (
                                    <div className="d-flex justify-content-center align-items-center" style={{height: '374px'}}>
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Chargement du graphique...</span>
                                        </div>
                                    </div>
                                ) : chartData ? (
                                    <div dir="ltr" className="apex-charts">
                                        <ProjectsOverviewCharts 
                                            chartData={chartData}
                                            dataColors='["--vz-primary", "--vz-warning", "--vz-success"]' 
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-muted">
                                        <p>Aucune donnée disponible pour le graphique</p>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ProjectsOverview;