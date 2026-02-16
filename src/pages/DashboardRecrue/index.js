import React, { useState } from "react";
import { Col, Container, Row, Card, CardBody } from "reactstrap";
import Widget from "../DashboardEcommerce/Widgets";
import BestSellingProducts from "./BestSellingProducts";
import RecentActivity from "./RecentActivity";
import RecentOrders from "./RecentOrders";
import Revenue from "./Revenue";
import SalesByLocations from "./SalesByLocations";
import Section from "../DashboardEcommerce/Section";
import StatsDashboard from "../DashboardEcommerce/StatsDashboard";
import StoreVisits from "./StoreVisits";
import TopSellers from "./TopSellers";

import ApplicationsStatistic from "../DashboardJob/ApplicationsStatistic";
import Candidates from "../DashboardJob/Candidates";
import Statistics from "./Statistics";
import Popular from "./Popular";
import Hello from "./Config/Hello";
import NotAvailablePage from "../../Components/Common/NotAvailablePage";

const DashboardEcommerce = () => {
  document.title = "Dashboard | INAWO - Suite de Gestion";

  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <React.Fragment>
      <div className="page-content ">
        <Container fluid>
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0" style={{ color: "rgb(98,116,142)" }}>
                  Tableau de bord
                </h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="#" className="text-decoration-none d-flex">
                        {" "}
                        <span style={{ marginRight: "2%", background: "" }}>
                          Inawo
                        </span>{" "}
                        <span>&gt;</span>{" "}
                      </a>
                    </li>
                    <li className="breadcrumb-item active">Tableau de bord</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <Row>
            <Col>
              <div className="h-100">
                <Section rightClickBtn={toggleRightColumn} />
                <Row>
                  <Col xl={12}>
                    <StatsDashboard />
                  </Col>
                </Row>
                <Card style={{ borderRadius: "20px" }}>
                  <CardBody>
                    <NotAvailablePage />
                  </CardBody>
                </Card>
                {/* <Row>
                  <ApplicationsStatistic dataColors='["--vz-success", "--vz-info", "--vz-primary"]' />
                  <Candidates />
                </Row> */}
              </div>
            </Col>
            {/* <RecentActivity rightColumn={rightColumn} hideRightColumn={toggleRightColumn} /> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
