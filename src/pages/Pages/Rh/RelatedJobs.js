import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Row } from "reactstrap";
import { overviewJobs } from "../../../common/data/appsJobs";

const RelatedJobs = () => {
  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <div className="d-flex align-items-center mb-4">
            <div className="flex-grow-1">
              <h5 className="mb-0">Offres similaires</h5>
            </div>
            <div className="flex-shrink-0">
              <Link to="#" className="btn btn-ghost-secondary">
                Voir tout{" "}
                <i className="ri-arrow-right-line ms-1 align-bottom"></i>
              </Link>
            </div>
          </div>
        </Col>
        {overviewJobs.map((item, key) => (
          <Col xl={4} key={key}>
            <Card className="rounded-4 border-0 shadow-sm">
              <CardBody>
                <button
                  type="button"
                  className="btn btn-icon btn-soft-primary rounded-4 border-0 float-end"
                  data-bs-toggle="button"
                  aria-pressed="true"
                >
                  <i className="mdi mdi-cards-heart fs-16"></i>
                </button>
                <div className="avatar-sm mb-4">
                  <div className={`avatar-title bg-${item.color}-subtle rounded-4 border-0`}>
                    <img src={item.companyLogo} alt="Logo entreprise" className="avatar-xxs" />
                  </div>
                </div>
                <Link to="#">
                  <h5>{item.jobTitle}</h5>
                </Link>
                <p className="text-muted">{item.companyName}</p>

                <div className="d-flex gap-4 mb-3">
                  <div>
                    <i className="ri-map-pin-2-line text-primary me-1 align-bottom"></i>{" "}
                    {item.location}
                  </div>

                  <div>
                    <i className="ri-time-line text-primary me-1 align-bottom"></i>{" "}
                    {item.time}
                  </div>
                </div>

                <p className="text-muted">{item.description}</p>

                <div className="hstack gap-2">
                  <span className="badge bg-warning-subtle text-warning">{item.s1}</span>
                  <span className="badge bg-primary-subtle text-primary">{item.s2}</span>
                  <span className="badge bg-danger-subtle text-danger">{item.s3}</span>
                </div>

                <div className="mt-4 hstack gap-2">
                  <Link to="/:entreprise/offre-details/:id" className="btn btn-soft-primary rounded-4 border-0 w-100">
                    Détails
                  </Link>
                  <Link to="/:entreprise/candidature-details/:id" className="btn btn-soft-info rounded-4 border-0 w-100">
                    Candidature
                  </Link>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  );
};

export default RelatedJobs;