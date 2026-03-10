import React from "react";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import getChartColorsArray from "../../../../Components/Common/ChartsDynamicColor";

const Graphe = ({ dataColors = '["--vz-primary", "--vz-success", "--vz-danger", "--vz-warning", "--vz-info"]', xxl = 4, xl = 4 }) => {
  const { t } = useTranslation();
  var chartDonutBasicColors = getChartColorsArray(dataColors);
  const series = [44, 55, 41, 17, 15];
  var options = {
    labels: [t("Direct"), t("Social"), t("Email"), t("Other"), t("Referrals")],
    chart: {
      height: 333,
      type: "donut",
    },
    legend: {
      position: "bottom",
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      dropShadow: {
        enabled: false,
      },

    },
    colors: chartDonutBasicColors,
  };

  const cardStyle = {
    borderRadius: "20px",
    background: "#fff",
    boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    overflow: "hidden",
  };

  return (
    <Col xxl={xxl} xl={xl}>
      <Card className="card-height-100" style={cardStyle}>
        <CardHeader className="align-items-center d-flex" >
          <h4 className="card-title mb-0 flex-grow-1">{t("Sources de Visite")}</h4>
        </CardHeader>
        <CardBody>
          <ReactApexChart
            dir="ltr"
            options={options}
            series={series}
            type="donut"
            height="333"
            className="apex-charts"
          />
        </CardBody>
      </Card>
    </Col>
  );
};

export default Graphe;