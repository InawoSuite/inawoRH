import React from 'react';
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../../Components/Common/ChartsDynamicColor";

const ProjectsOverviewCharts = ({ dataColors, chartData }) => {
    const linechartcustomerColors = getChartColorsArray(dataColors);

    // Vérification plus robuste des données
    if (!chartData || !chartData.series || chartData.series.length === 0) {
        console.log("Aucune donnée pour le graphique");
        return (
            <div className="text-center py-5 text-muted">
                <i className="ri-bar-chart-line display-4"></i>
                <p className="mt-2">Aucune donnée disponible pour le graphique</p>
            </div>
        );
    }

    // Vérifier si les données sont valides
    const hasValidData = chartData.series.some(serie => 
        serie.data && serie.data.some(value => value > 0)
    );

    if (!hasValidData) {
        console.log("Données du graphique toutes à zéro:", chartData);
        return (
            <div className="text-center py-5 text-muted">
                <i className="ri-bar-chart-line display-4"></i>
                <p className="mt-2">Aucune activité enregistrée</p>
            </div>
        );
    }

    const options = {
        chart: {
            height: 374,
            type: 'line',
            toolbar: {
                show: true,
            },
        },
        stroke: {
            curve: 'smooth',
            width: [0, 3, 0],
        },
        fill: {
            opacity: [0.85, 0.25, 0.85]
        },
        markers: {
            size: [0, 4, 0],
        },
        xaxis: {
            categories: chartData.categories,
            axisBorder: {
                show: false
            },
            labels: {
                style: {
                    colors: '#8c9097',
                    fontSize: '11px',
                }
            }
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    if (value >= 1000000) {
                        return (value / 1000000).toFixed(1) + 'M';
                    }
                    if (value >= 1000) {
                        return (value / 1000).toFixed(0) + 'K';
                    }
                    return value;
                },
            }
        },
        grid: {
            borderColor: '#f0f0f0',
        },
        colors: linechartcustomerColors,
        legend: {
            position: 'top',
            horizontalAlign: 'center',
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: function (value, { seriesIndex }) {
                    if (seriesIndex === 1) {
                        return value.toLocaleString('fr-FR');
                    }
                    return value.toLocaleString('fr-FR');
                }
            }
        }
    };

    return (
        <ReactApexChart 
            options={options}
            series={chartData.series}
            type="line"
            height="374"
            className="apex-charts"
        />
    );
};

export { ProjectsOverviewCharts };