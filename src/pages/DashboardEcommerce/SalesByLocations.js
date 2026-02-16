import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import CountUp from "react-countup";
import { ProjectsOverviewCharts } from '../DashboardProject/DashboardProjectCharts';
import { useProfile } from "../../Components/Hooks/UserHooks";
import { BaseUrl } from '../APIKey/ApiKey';

const ProjectsOverview = () => {
    const [chartData, setChartData] = useState(null);
    const [dashboardStats, setDashboardStats] = useState({
        ventes_totales: 0,
        approvisionnement_total: 0,
        recettes_totales: 0,
        depenses_exploitation: 0,
        benefice: 0,
        depenses_investissement: 0,
        achat_decaisse: 0
    });
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(false);
    const [error, setError] = useState(null);
    const { userProfile, token } = useProfile();

    // Fonction pour récupérer les statistiques globales
    const fetchDashboardStats = async () => {
        if (!token || !userProfile) {
            console.log("⏳ En attente du token ou profil...");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch(`${BaseUrl}/facture/dashboard/`, { headers });

            if (response.ok) {
                const data = await response.json();
                console.log("📊 Données dashboard complètes:", data);
                
                const currentYear = new Date().getFullYear().toString();
                const annualSummary = data?.annual_summary || {};
                
                setDashboardStats({
                    ventes_totales: annualSummary.ventes_totales || 0,
                    approvisionnement_total: annualSummary.approvisionnement_total || 0,
                    recettes_totales: annualSummary.recettes_totales || 0,
                    depenses_exploitation: annualSummary.depenses_exploitation || 0,
                    benefice: annualSummary.benefice || 0,
                    depenses_investissement: annualSummary.depenses_investissement || 0,
                    achat_decaisse: annualSummary.achat_decaisse || 0
                });
            } else {
                throw new Error(`Erreur API: ${response.status}`);
            }

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des statistiques:', error);
            setError(error.message || "Erreur de chargement des données");
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour générer les données du graphique
    const generateChartData = async () => {
        if (!token || !userProfile) {
            console.log("⏳ En attente du token pour le graphique...");
            return;
        }

        setChartLoading(true);

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            const response = await fetch(`${BaseUrl}/facture/dashboard/`, { headers });

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }

            const data = await response.json();
            const currentYear = new Date().getFullYear().toString();
            const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
            
            const monthlyData = data?.monthly_breakdown || {};

            const ventesData = [];
            const depensesData = [];
            // const beneficesData = [];

            // Remplir les données pour chaque mois (1 à 12)
            for (let i = 1; i <= 12; i++) {
                const monthKey = i.toString();
                const monthData = monthlyData[monthKey];

                if (monthData) {
                    ventesData.push(monthData.ventes_totales || 0);
                    depensesData.push(monthData.depenses_exploitation || 0);
                    // beneficesData.push(monthData.benefice || 0);
                } else {
                    ventesData.push(0);
                    depensesData.push(0);
                    // beneficesData.push(0);
                }
            }

            const formattedData = [
                {
                    name: 'Revenus',
                    type: 'column',
                    data: ventesData
                },
                {
                    name: 'Dépenses', 
                    type: 'column',
                    data: depensesData
                },
                // {
                //     name: 'Bénéfice',
                //     type: 'line',
                //     data: beneficesData
                // }
            ];
            
            setChartData({
                series: formattedData,
                categories: monthNames
            });

        } catch (error) {
            console.error('❌ Erreur lors de la génération du graphique:', error);
            const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
            setChartData({
                series: [
                    { name: 'Ventes Encaissées', type: 'column', data: Array(12).fill(0) },
                    { name: 'Dépenses Exploitation', type: 'column', data: Array(12).fill(0) },
                    { name: 'Bénéfice', type: 'line', data: Array(12).fill(0) }
                ],
                categories: monthNames
            });
        } finally {
            setChartLoading(false);
        }
    };

    useEffect(() => {
        if (token && userProfile) {
            fetchDashboardStats();
            generateChartData();
        }
    }, [token, userProfile]);

    return (
        <React.Fragment>
            <Row>
                <Col xl={12}>
                    <Card style={{ border: "none", borderRadius: "20px"}}>
                        <CardHeader className="border-0 align-items-center d-flex" style={{borderRadius:"20px"}}>
                            <h4 className="card-title mb-0 flex-grow-1">Vue Globale Encaissée/Décaissée</h4>
                            <div className="d-flex gap-1">
                                <span style={{ border: "none"}}>
                                    Année : {new Date().getFullYear()}
                                </span>
                            </div>
                        </CardHeader>

                        <CardHeader className="p-0 border-0 bg-light-subtle">
                            <Row className="g-0 text-center">
                                {/* Ventes encaissées */}
                                <Col xs={6} sm={3}>
                                    <div className="p-3 border border-dashed border-start-0">
                                        <h5 className="mb-1">
                                            {loading ? (
                                                <span className="text-muted" style={{fontSize: '0.9rem'}}>Chargement...</span>
                                            ) : (
                                                <span className="counter-value">
                                                    <CountUp
                                                        start={0}
                                                        end={dashboardStats.ventes_totales}
                                                        separator={" "}
                                                        duration={4}
                                                    />
                                                </span>
                                            )}
                                        </h5>
                                        <p className="text-muted mb-0">Ventes totales</p>
                                    </div>
                                </Col>

                          

                                {/* Recettes totales */}
                                <Col xs={6} sm={3}>
                                    <div className="p-3 border border-dashed border-start-0">
                                        <h5 className="mb-1">
                                            {loading ? (
                                                <span className="text-muted" style={{fontSize: '0.9rem'}}>Chargement...</span>
                                            ) : (
                                                <span className="counter-value">
                                                    <CountUp
                                                        start={0}
                                                        end={dashboardStats.recettes_totales}
                                                        separator={" "}
                                                        duration={4}
                                                    />
                                                </span>
                                            )}
                                        </h5>
                                        <p className="text-muted mb-0">Recettes Totales</p>
                                    </div>
                                </Col>

                                      {/* Autres recettes */}
                                <Col xs={6} sm={3}>
                                    <div className="p-3 border border-dashed border-start-0">
                                        <h5 className="mb-1">
                                            {loading ? (
                                                <span className="text-muted" style={{fontSize: '0.9rem'}}>Chargement...</span>
                                            ) : (
                                                <span className="counter-value">
                                                    <CountUp
                                                        start={0}
                                                        end={dashboardStats.approvisionnement_total}
                                                        separator={" "}
                                                        duration={4}
                                                    />
                                                </span>
                                            )}
                                        </h5>
                                        <p className="text-muted mb-0">Approvisionnement</p>
                                    </div>
                                </Col>

                                {/* Bénéfice */}
                                <Col xs={6} sm={3}>
                                    <div className="p-3 border border-dashed border-start-0">
                                        <h5 className="mb-1">
                                            {loading ? (
                                                <span className="text-muted" style={{fontSize: '0.9rem'}}>Chargement...</span>
                                            ) : (
                                                <span className="counter-value">
                                                    <CountUp
                                                        start={0}
                                                        end={dashboardStats.achat_decaisse}
                                                        separator={" "}
                                                        duration={4}
                                                    />
                                                </span>
                                            )}
                                        </h5>
                                        <p className="text-muted mb-0">Achat décaissés</p>
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
                                            onClick={() => {
                                                fetchDashboardStats();
                                                generateChartData();
                                            }}
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
                                ) : (
                                    <div dir="ltr" className="apex-charts">
                                        <ProjectsOverviewCharts 
                                            chartData={chartData}
                                            dataColors='["--vz-primary", "--vz-warning", "--vz-success"]' 
                                        />
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