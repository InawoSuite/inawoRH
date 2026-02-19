import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Pagination from "../../../Components/Common/Pagination";
import UsersByDevice from "../../DashboardAnalytics/UsersByDevice";
import Widgets from "./Widgets";
import { jobGrid } from "../../../common/data/appsJobs";
import SearchAndActionBar from "../../../Components/Common/SearchAndActionBar";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";

const Recrutements = () => {
  document.title = "Recrutements";

    const [recrutementList, setrecrutementList] = useState([
        {
            jobTitle: "Full Stack Developer",
            companyName: "Velzon",
            location: "New York, USA",
        },
        {
            jobTitle: "UI/UX Designer",
            companyName: "Velzon",
            location: "Paris, France"
        },
        {
            jobTitle: "Project Manager",
            companyName: "Velzon",
            location: "London, UK"
        },
        {
            jobTitle: "Data Analyst",
            companyName: "Velzon",
            location: "Berlin, Germany"
        }, 
        {
            jobTitle: "Marketing Specialist",
            companyName: "Velzon",
            location: "Tokyo, Japan"
        },
        {
            jobTitle: "HR Manager",
            companyName: "Velzon",
            location: "Sydney, Australia"
        },
        {
           jobTitle: "DevOps Engineer",
           companyName: "Velzon",
           location: "Toronto, Canada" 
        }
    ]);
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredData = useMemo(() => {
        let filtered = recrutementList;
    
        // Filtre par recherche uniquement
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

        //pagination
        const perPageData = 7;
        const indexOfLast = currentPage * perPageData;
        const indexOfFirst = indexOfLast - perPageData;
        const currentdata = useMemo(() => jobGrid?.slice(indexOfFirst, indexOfLast), [indexOfFirst, indexOfLast])

        useEffect(() => {
            setJobGridData(currentdata)
        }, [currentdata]);

        const OnchangeHandler = (e, name) => {
            let search = e.target.value;
            if (search) {
            setJobGridData(
                jobGrid.filter((data) =>
                Object.values(data).some(
                    (field) =>
                    typeof field === 'string' &&
                    field.toLowerCase().includes(search?.toLowerCase()),
                )
                )
            )
            } else {
            setJobGridData(currentdata)
            }
        }

        return (
            <React.Fragment>
                <Row>
                    <SearchAndActionBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        searchPlaceholder="Chercher une offre..."
                        showSearch={true}
                        addButtonLink="/:entreprise/offre-add"
                        addButtonText="Creer une offre d'emploi"
                        addButtonIcon="ri-user-add-line"
                        showAddButton={true}
                        onExportClick={() => setIsExportCSV(true)}
                        exportButtonText="Exporter"
                        exportButtonIcon="ri-file-upload-line"
                        showExportButton={true}
                    />
                </Row>

                <Row>
                    <Col lg={12}>
                    <div className="d-flex align-items-center mb-4">
                        <div className="flex-grow-1">
                        <p className="text-muted fs-14 mb-0">
                            Result: <span id="total-result">7</span>
                        </p>
                        </div>
                        <div className="flex-shrink-0">
                        <UncontrolledDropdown className="dropdown">
                            <DropdownToggle
                            className="btn text-muted fs-14 dropdown-toggle"
                            to="#"
                            role="button"
                            tag="button"
                            type="button"
                            >
                            All View
                            </DropdownToggle>
                            <DropdownMenu
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuLink"
                            >
                            <li>
                                <DropdownItem className="dropdown-item" href="#">
                                Action
                                </DropdownItem>
                            </li>
                            <li>
                                <DropdownItem className="dropdown-item" href="#">
                                Another action
                                </DropdownItem>
                            </li>
                            <li>
                                <DropdownItem className="dropdown-item" href="#">
                                Something else here
                                </DropdownItem>
                            </li>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        </div>
                    </div>
                    </Col>
                </Row>

                <Row id="job-list">
                    <Col lg={3} md={6} id="job-widget">
                        <Card className="card-height-100 bg-info rounded-4 border-0 shadow-sm bg-job">
                            <CardBody className="p-5">
                            <h2 className="lh-base text-white">
                                Velzon invites young professionals for an intership!
                            </h2>
                            <p className="text-white text-opacity-75 mb-0 fs-14">
                                Don't miss your opportunity to improve your skills!
                            </p>
                            <div className="mt-5 pt-2">
                                <button type="button" className="btn btn-light rounded-4 border-0 w-100">
                                View More{" "}
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
                                    alt=""
                                    className="avatar-xxs"
                                    />
                                </div>
                            </div>
                            <Link to="#">
                            <h5>{item.jobTitle}</h5>
                            </Link>
                            <p className="text-muted">{item.companyName} </p>
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
                                {
                                    subItem === "Full Time" ?
                                    <span className="badge bg-success-subtle text-success">{subItem}</span>
                                    :
                                    subItem === "Freelance" ?
                                        <span className="badge bg-primary-subtle text-primary">{subItem}</span>
                                        :
                                        <span className="badge bg-danger-subtle  text-danger">{subItem}</span>
                                }
                                </React.Fragment>
                            ))}
                            </div>
                            <div className="mt-4 hstack gap-2">
                            <Link
                                to="/:entreprise/offre-details/:id"
                                className="btn btn-soft-primary rounded-4 border-0 shadow-sm w-100"
                            >
                                Details
                            </Link>
                            <Link
                                to="/:entreprise/candidature-details/:id"
                                className="btn btn-soft-success rounded-4 border-0 shadow-sm w-100"
                            >
                                Candidature
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
                  title="&nbsp;Ajouter une offre d'emploi"
                  pageTitle={
                    <>
                      <i className="ri-team-line"></i>
                      &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
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