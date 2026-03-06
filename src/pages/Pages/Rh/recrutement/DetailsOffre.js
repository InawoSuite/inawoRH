import React from "react";
import { Col, Container, Row } from "reactstrap";
import Header from "./Header";
import JobDescription from "./JobDescription";
import RelatedJobs from "./RelatedJobs";
import RightSection from "./RightSection";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DetailsOffre = () => {
  const { t } = useTranslation();

  const JobOverview = () => {

    return (
      <React.Fragment>
        <Container fluid>

          <Row>
            <Header />
          </Row>

          <Row className="mt-n5">
            <Col xxl={9}>
              <JobDescription />

              <RelatedJobs />
            </Col>
            <Col xxl={3}>
              <RightSection />
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  };
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title={`\u00a0${t("Détails de l'offre")}`}
          pageTitle={
            <>
              <i className="ri-team-line"></i>
              &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>&nbsp;&gt;
            </>
          }
        />
        <React.Fragment>
          <JobOverview />
        </React.Fragment>
      </Container>
    </div>
  )

}

export default DetailsOffre;