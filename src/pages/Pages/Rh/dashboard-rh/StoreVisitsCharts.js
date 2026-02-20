import React, { useMemo, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../../../Components/Common/ChartsDynamicColor";
import CountUp from "react-countup";
import { revenueWidgets } from "../../../../common/data/ecommerce";
import {
  allRevenueData,
  monthRevenueData,
  halfYearRevenueData,
  yearRevenueData,
} from "../../../../common/data/dashboardEcommerce";

const StoreVisitsCharts = ({
  dataColors = '["--vz-primary", "--vz-success", "--vz-danger"]',
  xxl = 12,
  xl = 12,
}) => {
  const [period, setPeriod] = useState("ALL");
  const revenueChartColors = getChartColorsArray(dataColors);

  const series = useMemo(() => {
    if (period === "1M") return monthRevenueData;
    if (period === "6M") return halfYearRevenueData;
    if (period === "1Y") return yearRevenueData;
    return allRevenueData;
  }, [period]);

  const cardStyle = {
		borderRadius: "20px",
		background: "#fff",
		boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
		overflow: "hidden",
	};

  const options = {
    chart: {
      height: 364,
      type: "line",
      toolbar: {
        show: false,
      },
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
    colors: revenueChartColors,
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

  return (
    <Col xxl={xxl} xl={xl}>
      <Card className="card-height-100" style={cardStyle}>
        <CardHeader className="align-items-center d-flex"  >
          <h4 className="card-title mb-0 flex-grow-1">Revenue</h4>
          <div className="d-flex gap-1" >
            {["ALL", "1M", "6M", "1Y"].map((item) => (
              <Button
                key={item}
                color={period === item ? "primary" : "soft-secondary"}
                size="sm"
                className={period === item ? "btn-soft-primary" : "btn-soft-secondary"}
                onClick={() => setPeriod(item)}
                style={{ borderRadius: "20px" }}
              >
                {item}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardHeader className="p-0 border-0 bg-light-subtle">
          <Row className="g-0 text-center">
            {(revenueWidgets || []).map((item) => (
              <div className="col-6 col-sm-3" key={item.id}>
                <div className="p-3 border border-dashed border-start-0">
                  <h5 className={`mb-1 ${item.counterClass || ""}`.trim()}>
                    <span className="counter-value">
                      <CountUp
                        start={0}
                        prefix={item.prefix}
                        suffix={item.suffix}
                        separator={item.separator}
                        end={Number(item.counter)}
                        decimals={item.decimals}
                        duration={2.5}
                      />
                    </span>
                  </h5>
                  <p className="text-muted mb-0">{item.label}</p>
                </div>
              </div>
            ))}
          </Row>
        </CardHeader>

        <CardBody className="p-0 pb-2">
          <ReactApexChart
            dir="ltr"
            options={options}
            series={series}
            type="line"
            height="370"
            className="apex-charts"
          />
        </CardBody>
      </Card>
    </Col>
  );
};

export default StoreVisitsCharts;
