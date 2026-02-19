import React from "react";
import { Card, CardBody, CardHeader, Col } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../../Components/Common/ChartsDynamicColor";

const StoreVisitsCharts = ({ dataColors = '["--vz-primary", "--vz-success", "--vz-danger", "--vz-warning", "--vz-info"]', xxl = 4, xl = 4 }) => {
  var chartDonutBasicColors = getChartColorsArray(dataColors);
  const series = [44, 55, 41, 17, 15];
  var options = {
    labels: ["Direct", "Social", "Email", "Other", "Referrals"],
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

  return (
    <Col xxl={xxl} xl={xl}>
      <Card className="card-height-100">
        <CardHeader className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Sources de Visite</h4>
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

export default StoreVisitsCharts;
