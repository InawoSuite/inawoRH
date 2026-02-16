import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../Components/Common/ChartsDynamicColor";

const RevenueCharts = ({ dataColors, series }) => {

   const defaultColors = ['#3e60d5', '#47ad77', '#fa5c7c'];
  const linechartcustomerColors = dataColors ? getChartColorsArray(dataColors) : defaultColors;

   const safeSeries = Array.isArray(series) ? series : [];
  
  // 4. Options du graphique
  const options = {
    chart: {
      height: 370,
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      curve: "straight",
      dashArray: [0, 0, 8],
      width: [2, 0, 2.2],
    },
    fill: {
      opacity: [0.1, 0.9, 1],
    },
    markers: {
      size: [0, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 15,
        left: 10,
      },
    },
    legend: {
      show: true,
      horizontalAlign: "center",
      offsetX: 0,
      offsetY: -5,
      markers: {
        width: 9,
        height: 9,
        radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        barHeight: "70%",
      },
    },
    colors: linechartcustomerColors,
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0);
            }
            return y;
          },
        },
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return "$" + y.toFixed(2) + "k";
            }
            return y;
          },
        },
        {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              return y.toFixed(0) + " Sales";
            }
            return y;
          },
        },
      ],
    },
  };
return   <ReactApexChart
      options={options}
      series={series}
      type="line"
      height="370"
      className="apex-charts"
    />
};

const StoreVisitsCharts = ({ dataColors, series = [] }) => { // Valeur par défaut
  const defaultColors = ['#3e60d5', '#47ad77', '#fa5c7c', '#6c757d', '#39afd1'];
  const chartDonutBasicColors = dataColors ? getChartColorsArray(dataColors) : defaultColors;
  
  // Validation des données
  const safeSeries = Array.isArray(series) && series.length > 0 
    ? series 
    : [44, 55, 41, 17, 15]; // Valeurs par défaut

  const options = {
    labels: ["Direct", "Social", "Email", "Other", "Referrals"],
    chart: { height: 333, type: "donut" },
    legend: { position: "bottom" },
    stroke: { show: false },
    dataLabels: { dropShadow: { enabled: false } },
   colors: chartDonutBasicColors,
  };

  return (
    <ReactApexChart
      options={options}
      series={safeSeries}
      type="donut"
      height="333"
      className="apex-charts"
    />
  );
};

export { RevenueCharts, StoreVisitsCharts };
