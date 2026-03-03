import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Section from "../../../DashboardEcommerce/Section";
import StatsDashboard from "../../../DashboardEcommerce/StatsDashboard";
import ApplicationsStatistic from "../../../DashboardJob/ApplicationsStatistic";
import Candidates from "../../../DashboardJob/Candidates";
import Widgets from "../../../DashboardJob/Widgets";
import FeaturedCompanies from "../../../DashboardJob/FeaturedCompanies";
import AgendaTable from "./AgendaTable";
import StoreVisitsCharts from "./StoreVisitsCharts";
import Graphe from "./Graphe";
import Tache from "./Tache";


const DashboardRH = () => {
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
                {/* <Section rightClickBtn={toggleRightColumn} /> */}
                <Row>
                   <Row>
            <Widgets />
            <FeaturedCompanies />
          </Row>
                </Row>
                {/* <Card style={{ borderRadius: "20px" }}>
                  <CardBody>
                    <NotAvailablePage />
                  </CardBody>
                </Card> */}
                <Row>
                  {/* <ApplicationsStatistic xxl={12} dataColors='["--vz-success", "--vz-info", "--vz-primary"]' /> */}
                    <StoreVisitsCharts dataColors='["--vz-success", "--vz-info", "--vz-primary", "--vz-warning", "--vz-danger"]' />
                  {/* <Candidates /> */}
                </Row>
                <Row>
                  <AgendaTable />
                  <Graphe dataColors='["--vz-success", "--vz-info", "--vz-primary", "--vz-warning", "--vz-danger"]' />
                
                </Row>
                <Row>
                  <Tache />
                </Row>

              </div>
            </Col>
            
            {/* <RecentActivity rightColumn={rightColumn} hideRightColumn={toggleRightColumn} /> */}
          </Row>
           
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardRH;
