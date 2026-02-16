import React from 'react';
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";

const ProjectsOverviewCharts = ({ dataColors, chartData }) => {
    var linechartcustomerColors = getChartColorsArray(dataColors);

    // Si pas de données, afficher un graphique vide
    if (!chartData || !chartData.series || chartData.series.length === 0) {
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
                categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                axisTicks: {
                    show: false
                },
                axisBorder: {
                    show: false
                }
            },
            yaxis: {
                min: 0,
                labels: {
                    formatter: function(value) {
                        return value >= 0 ? value.toLocaleString('fr-FR') : '';
                    }
                }
            },
            grid: {
                show: true,
                borderColor: '#f0f0f0',
            },
            annotations: {
                texts: [{
                    x: '50%',
                    y: '50%',
                    textAnchor: 'middle',
                    fontSize: '14px',
                    color: '#999'
                }]
            }
        };

        const emptySeries = [
            { name: 'Revenues', type: 'line', data: [] },
            { name: 'Dépenses', type: 'column', data: [] }
        ];

        return (
            <ReactApexChart 
                dir="ltr"
                options={emptyOptions}
                series={emptySeries}
                type="line"
                height="374"
                className="apex-charts"
            />
        );
    }

    // Configuration du graphique avec les vraies données
    var options = {
        chart: {
            height: 374,
            type: 'line',
            toolbar: {
                show: false,
            }
        },
        stroke: {
            curve: 'smooth',
            dashArray: [0, 0],
            width: [0, 0],
        },
        fill: {
            opacity: [0.85, 0.85]
        },
        markers: {
            size: [0, 0],
            strokeWidth: 2,
            hover: {
                size: 6,
            }
        },
        xaxis: {
            categories: chartData.categories,
            axisTicks: {
                show: false
            },
            axisBorder: {
                show: false
            }
        },
        yaxis: {
            min: 0,
            forceNiceScale: true,
            labels: {
                formatter: function(value) {
                    // Afficher uniquement les valeurs positives
                    if (value < 0) return '';
                    return value.toLocaleString('fr-FR');
                }
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
            padding: {
                top: 0,
                right: -2,
                bottom: 15,
                left: 10
            },
        },
        legend: {
            show: true,
            horizontalAlign: 'center',
            offsetX: 0,
            offsetY: -5,
            markers: {
                width: 9,
                height: 9,
                radius: 6,
            },
            itemMargin: {
                horizontal: 10,
                vertical: 0
            },
        },
        plotOptions: {
            bar: {
                columnWidth: '30%',
                barHeight: '70%'
            }
        },
        colors: linechartcustomerColors,
        // Remplacer la couleur orange/warning par un jaune vif
        colors: ['#2563eb','#10b981' ],
        tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            style: {
                fontSize: '12px',
                fontFamily: 'inherit'
            },
            x: {
                show: true,
                format: 'MMM',
                formatter: undefined,
            },
            y: [
                {
                    title: {
                        formatter: function (seriesName) {
                            return seriesName + ': ';
                        }
                    },
                    formatter: function (value, { seriesIndex, dataPointIndex, w }) {
                        if (value === null || value === undefined) {
                            return '<span style="color: #999;">Aucune donnée</span>';
                        }
                        return '<span style="color: #2563eb; font-weight: 600;">' + 
                               value.toLocaleString('fr-FR');
                    }
                },
                {
                    title: {
                        formatter: function (seriesName) {
                            return seriesName + ': ';
                        }
                    },
                    formatter: function (value, { seriesIndex, dataPointIndex, w }) {
                        if (value === null || value === undefined) {
                            return '<span style="color: #999;">Aucune donnée</span>';
                        }
                        return '<span style="color: #f59e0b; font-weight: 600;">' + 
                               value.toLocaleString('fr-FR');
                    }
                },
                // {
                //     title: {
                //         formatter: function (seriesName) {
                //             return seriesName + ': ';
                //         }
                //     },
                //     formatter: function (value, { seriesIndex, dataPointIndex, w }) {
                //         if (value === null || value === undefined) {
                //             return '<span style="color: #999;">Aucune donnée</span>';
                //         }
                //         // Afficher la valeur réelle (même si négative) dans le tooltip
                //         const color = value >= 0 ? '#10b981' : '#ef4444';
                //         const prefix = value >= 0 ? '' : '-';
                //         return '<span style="color: ' + color + '; font-weight: 600;">' + 
                //                prefix + Math.abs(value).toLocaleString('fr-FR') + ' </span>';
                //     }
                // }
            ],
            marker: {
                show: true,
            },
            custom: function({ series, seriesIndex, dataPointIndex, w }) {
                const categories = w.globals.categoryLabels;
                const monthName = categories[dataPointIndex];
                
                // Récupérer les valeurs pour ce mois
                const ventesValue = series[0][dataPointIndex];
                const depensesValue = series[1][dataPointIndex];
                
                // Si toutes les valeurs sont null, afficher un message
                if ((ventesValue === null || ventesValue === undefined) && 
                    (depensesValue === null || depensesValue === undefined)   ) {
                    return `
                        <div style="
                            background: white;
                            border: 2px solid #e2e8f0;
                            border-radius: 8px;
                            padding: 12px 16px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                            min-width: 200px;
                        ">
                            <div style="
                                font-weight: 700;
                                font-size: 14px;
                                color: #1f2937;
                                margin-bottom: 8px;
                                border-bottom: 2px solid #e2e8f0;
                                padding-bottom: 6px;
                            ">
                                ${monthName}
                            </div>
                            <div style="
                                color: black;
                                font-size: 13px;
                                text-align: center;
                                padding: 8px 0;
                                font-weight: 500;
                            ">
                             Aucune donnée pour ce mois
                            </div>
                        </div>
                    `;
                }
                
                return `
                    <div style="
                        background: white;
                        border: 1px solid #e2e8f0;
                        border-radius: 8px;
                        padding: 12px 16px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        min-width: 250px;
                    ">
                        <div style="
                            font-weight: 700;
                            font-size: 14px;
                            color: #1f2937;
                            margin-bottom: 10px;
                            border-bottom: 1px solid #e2e8f0;
                            padding-bottom: 6px;
                        ">
                            ${monthName}
                        </div>
                        <div style="margin-top: 8px;">
                            <div style="
                                display: flex;
                                align-items: center;
                                margin-bottom: 6px;
                                padding: 4px;
                                background: #eff6ff;
                                border-radius: 4px;
                            ">
                                <span style="
                                    width: 10px;
                                    height: 10px;
                                    background: #2563eb;
                                    border-radius: 2px;
                                    margin-right: 8px;
                                "></span>
                                <span style="
                                    font-size: 12px;
                                    color: #4b5563;
                                    flex: 1;
                                ">Revenus:</span>
                                <span style="
                                    font-weight: 600;
                                    font-size: 13px;
                                    color: #2563eb;
                                ">
                                    ${ventesValue !== null && ventesValue !== undefined 
                                        ? ventesValue.toLocaleString('fr-FR') 
                                        : '<span style="color: #9ca3af;">N/A</span>'}
                                </span>
                            </div>
                            <div style="
                                display: flex;
                                align-items: center;
                                margin-bottom: 6px;
                                padding: 4px;
                                background: #e4fdf2;
                                border-radius: 4px;
                            ">
                                <span style="
                                    width: 10px;
                                    height: 10px;
                                    background: #07bc0c;
                                    border-radius: 2px;
                                    margin-right: 8px;
                                "></span>
                                <span style="
                                    font-size: 12px;
                                    color: #4b5563;
                                    flex: 1;
                                ">Dépenses:</span>
                                <span style="
                                    font-weight: 600;
                                    font-size: 13px;
                                    color: #07bc0c;
                                ">
                                    ${depensesValue !== null && depensesValue !== undefined 
                                        ? depensesValue.toLocaleString('fr-FR') 
                                        : '<span style="color: #9ca3af;">N/A</span>'}
                                </span>
                            </div>
                           
                        </div>
                    </div>
                `;
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

const TeamMembersCharts = ({ seriesData, chartsColor }) => {
    const series = [seriesData];

    const options = {
        chart: {
            type: 'radialBar',
            width: 36,
            height: 36,
            sparkline: {
                enabled: !0
            }
        },
        dataLabels: {
            enabled: !1
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 0,
                    size: '50%'
                },
                track: {
                    margin: 1
                },
                dataLabels: {
                    show: !1
                }
            }
        },
        colors: [chartsColor]
    };
    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                options={options}
                series={[...series]}
                type="radialBar"
                height="36"
                className="apex-charts"
            />
        </React.Fragment>
    );
};

const PrjectsStatusCharts = ({ dataColors, series }) => {
    var donutchartProjectsStatusColors = getChartColorsArray(dataColors);

    var options = {
        labels: ["Completed", "In Progress", "Yet to Start", "Cancelled"],
        chart: {
            type: "donut",
            height: 230,
        },
        plotOptions: {
            pie: {
                size: 100,
                offsetX: 0,
                offsetY: 0,
                donut: {
                    size: "90%",
                    labels: {
                        show: false,
                    }
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        stroke: {
            lineCap: "round",
            width: 0
        },
        colors: donutchartProjectsStatusColors,
    };
    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                options={options}
                series={series}
                type="donut"
                height="230"
                className="apex-charts"
            />
        </React.Fragment>
    );
};

export { ProjectsOverviewCharts, TeamMembersCharts, PrjectsStatusCharts };