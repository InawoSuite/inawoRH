import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  Col,
  Row,
} from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import Pagination from "../../../../Components/Common/Pagination";
import Widgets from "./Widgets";
import { jobGrid } from "../../../../common/data/appsJobs";
import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
import { useTranslation } from "react-i18next";

const Recrutements = () => {
  const { t } = useTranslation();
  document.title = t("Recrutements");

  const [recrutementList, setRecrutementList] = useState([
    {
      jobTitle: "Développeur Full Stack",
      companyName: "Velzon",
      location: "New York, USA",
    },
    {
      jobTitle: "Designer UI/UX",
      companyName: "Velzon",
      location: "Paris, France"
    },
    {
      jobTitle: "Chef de Projet",
      companyName: "Velzon",
      location: "Londres, UK"
    },
    {
      jobTitle: "Analyste de Données",
      companyName: "Velzon",
      location: "Berlin, Allemagne"
    },
    {
      jobTitle: "Spécialiste Marketing",
      companyName: "Velzon",
      location: "Tokyo, Japon"
    },
    {
      jobTitle: "Responsable RH",
      companyName: "Velzon",
      location: "Sydney, Australie"
    },
    {
      jobTitle: "Ingénieur DevOps",
      companyName: "Velzon",
      location: "Toronto, Canada"
    }
  ]);

  const [isExportCSV, setIsExportCSV] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    let filtered = recrutementList;
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return filtered;
  }, [recrutementList, searchTerm]);

  const Statistics = () => {
    return (
      <React.Fragment>
        <Row className="row">
          <Widgets dataColors='["--vz-success", "--vz-danger"]' />
        </Row>
      </React.Fragment>
    );
  };

  const JobGrid = () => {
    const [jobGridData, setJobGridData] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [favouritebtn, setFavouritebtn] = useState(false);

    const favouriteBtn = (ele) => {
      if (ele.closest("button").classList.contains("active")) {
        ele.closest("button").classList.remove("active");
      } else {
        ele.closest("button").classList.add("active");
      }
    };

    const perPageData = 7;
    const indexOfLast = currentPage * perPageData;
    const indexOfFirst = indexOfLast - perPageData;
    const currentdata = useMemo(() => jobGrid?.slice(indexOfFirst, indexOfLast), [indexOfFirst, indexOfLast]);

    useEffect(() => {
      setJobGridData(currentdata);
    }, [currentdata]);

    return (
      <React.Fragment>
        <SearchAndActionBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t("Chercher une offre...")}
          showSearch={true}
          addButtonLink="/:entreprise/offre-add"
          addButtonText={t("Créer une offre d'emploi")}
          addButtonIcon="ri-user-add-line"
          showAddButton={true}
          onExportClick={() => setIsExportCSV(true)}
          exportButtonText={t("Exporter")}
          exportButtonIcon="ri-file-upload-line"
          showExportButton={true}
        />

        <Row id="job-list">
          <Col lg={3} md={6} id="job-widget">
            <Card className="card-height-100 bg-info rounded-4 border-0 shadow-sm bg-job">
              <CardBody className="p-5">
                <h2 className="lh-base text-white">
                  {t("Velzon invite les jeunes professionnels à un stage !")}
                </h2>
                <p className="text-white text-opacity-75 mb-0 fs-14">
                  {t("Ne manquez pas l'opportunité d'améliorer vos compétences !")}
                </p>
                <div className="mt-5 pt-2">
                  <button type="button" className="btn btn-light rounded-4 border-0 w-100">
                    {t("Voir plus")}{" "}
                    <i className="ri-arrow-right-line align-bottom"></i>
                  </button>
                </div>
              </CardBody>
            </Card>
          </Col>

          {(jobGridData || []).map((item, key) => (
            <Col lg={3} md={6} key={key}>
              <Card className="card-height-100 rounded-4 border-0 shadow-sm">
                <CardBody>
                  <button
                    type="button"
                    className="btn btn-icon btn-soft-primary rounded-4 border-0 float-end"
                    data-bs-toggle="button"
                    aria-pressed="true"
                    onClick={(e) => favouriteBtn(e.target)}
                  >
                    <i className="mdi mdi-cards-heart fs-16"></i>
                  </button>

                  <div className="avatar-sm mb-4">
                    <div className="avatar-title bg-light rounded-4 border-0">
                      <img
                        src={item.companyLogo}
                        alt="Logo entreprise"
                        className="avatar-xxs"
                      />
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
                      {item.postDate}
                    </div>
                  </div>

                  <p className="text-muted">{item.description}</p>

                  <div className="hstack gap-2">
                    {item.requirement.map((subItem, key) => (
                      <React.Fragment key={key}>
                        {subItem === "Full Time" ? (
                          <span className="badge bg-success-subtle text-success">{t("Temps plein")}</span>
                        ) : subItem === "Freelance" ? (
                          <span className="badge bg-primary-subtle text-primary">Freelance</span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger">{subItem}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="mt-4 hstack gap-2">
                    <Link
                      to="/:entreprise/offre-details/:id"
                      className="btn btn-soft-primary rounded-4 border-0 shadow-sm w-100"
                    >
                      {t("Détails")}
                    </Link>
                    <Link
                      to="/:entreprise/candidature-details/:id"
                      className="btn btn-soft-success rounded-4 border-0 shadow-sm w-100"
                    >
                      {t("Candidature")}
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>

        <Pagination
          perPageData={perPageData}
          data={jobGrid}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          className="pagination-block pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0"
        />
      </React.Fragment>
    );
  };

  return (
    <div className="page-content">
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={filteredData}
      />
      <Container fluid>
        <BreadCrumb
          title={`\u00a0${t("Recrutements")}`}
          pageTitle={
            <>
              <i className="ri-team-line"></i>
              &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>&nbsp;&gt;
            </>
          }
        />
        <React.Fragment>
          <Statistics />
          <JobGrid />
        </React.Fragment>
      </Container>
    </div>
  );
}

export default Recrutements;