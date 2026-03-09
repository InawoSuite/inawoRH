import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useTranslation } from "react-i18next";

import Slack from "../../../../assets/images/brands/slack.png";

const Header = () => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Col lg={12}>
        <Card className="mt-n4 mx-n4">
          <div className="bg-warning-subtle">
            <CardBody className="px-4 pb-4">
              <Row className="mb-3">
                <div className="col-md">
                  <Row className="align-items-center g-3">
                    <div className="col-md-auto">
                      <div className="avatar-md">
                        <div className="avatar-title bg-white rounded-circle">
                          <img src={Slack} alt={t("Logo Slack")} className="avatar-xs" />
                        </div>
                      </div>
                    </div>
                    <div className="col-md">
                      <div>
                        <h4 className="fw-bold">{t("Designer Produit")}</h4>
                        <div className="hstack gap-3 flex-wrap">
                          <div>
                            <i className="ri-building-line align-bottom me-1"></i>{" "}
                            Themesbrand
                          </div>
                          <div className="vr"></div>
                          <div>
                            <i className="ri-map-pin-2-line align-bottom me-1"></i>{" "}
                            {t("Zuweihir, Émirats Arabes Unis")}
                          </div>
                          <div className="vr"></div>
                          <div>
                            {t("Date de publication")} :{" "}
                            <span className="fw-semibold">{t("15 Sept, 2021")}</span>
                          </div>
                          <div className="vr"></div>
                          <div className="badge rounded-pill bg-success fs-12">
                            {t("Temps plein")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Row>
                </div>

                <div className="col-md-auto">
                  <div className="hstack gap-1 flex-wrap mt-4 mt-md-0">
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-ghost-warning fs-16"
                      title={t("Ajouter aux favoris")}
                    >
                      <i className="ri-star-fill"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-ghost-primary fs-16"
                      title={t("Partager")}
                    >
                      <i className="ri-share-line"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-ghost-primary fs-16"
                      title={t("Signaler")}
                    >
                      <i className="ri-flag-line"></i>
                    </button>
                  </div>
                </div>
              </Row>
            </CardBody>
          </div>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default Header;