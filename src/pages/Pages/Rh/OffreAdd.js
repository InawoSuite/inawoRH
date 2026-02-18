import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Flatpickr from "react-flatpickr";

import { Link, useNavigate } from "react-router-dom";

    
const OffreAdd = () => {

    const navigate = useNavigate();

    const cardStyle = {
      borderRadius: "20px",
      background: "#fff",
      boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
    };
    document.title = "Ajouter une offre d'emploi";
    const NewJobs = () => {
    
      return (
        <React.Fragment>
            <Container fluid className="container-fluid">
              <Row className="row">
                <Col className="col-lg-12">
                  <Card style={cardStyle}>
                    <Form action="#">                      
                      <CardBody className="p-4">
                        <Row className="mb-3">
                                                <Col>
                                                  <h6 className="text-uppercase text-muted mb-3">Ajouter une offre d'emploi</h6>
                                                </Col>
                                              </Row>
                        <Row className="row g-4">
                          <Col className="col-lg-6">
                            <div>
                              <Label
                                htmlFor="job-title-Input"
                              >
                                Job Title <span className="text-danger">*</span>
                              </Label>
                              <Input
                                className="rounded-4"
                                type="text"
                                id="job-title-Input"
                                placeholder="Enter job title"
                                required
                              />
                            </div>
                          </Col>
                          <Col className="col-lg-6">
                            <div>
                              <Label
                                htmlFor="job-position-Input"
                              >
                                Job Position <span className="text-danger">*</span>
                              </Label>
                              <Input
                                className="rounded-4"
                                type="text"
                                id="job-position-Input"
                                placeholder="Enter job position"
                                required
                              />
                            </div>
                          </Col>
                          <Col className="col-lg-6">
                            <div>
                              <Label
                                htmlFor="job-category-Input"
                              >
                                Job Category <span className="text-danger">*</span>
                              </Label>
                              <Input className="rounded-4" id="job-category-Input" name="job-category-Input" type="select" required>
                                <option value="">Select Category</option>
                                <option value="Accounting & Finance">
                                  Accounting & Finance
                                </option>
                                <option value="Purchasing Manager">
                                  Purchasing Manager
                                </option>
                                <option value="Education & training">
                                  Education & training
                                </option>
                                <option value="Marketing & Advertising">
                                  Marketing & Advertising
                                </option>
                                <option value="It / Software Jobs">
                                  It / Software Jobs
                                </option>
                                <option value="Digital Marketing">
                                  Digital Marketing
                                </option>
                                <option value="Administrative Officer">
                                  Administrative Officer
                                </option>
                                <option value="Government Jobs">
                                  Government Jobs
                                </option>
                              </Input>
                            </div>
                          </Col>
                          <Col className="col-lg-6">
                            <div>
                              <Label
                                htmlFor="job-type-Input"
                              >
                                Job Type <span className="text-danger">*</span>
                              </Label>
                              <Input className="rounded-4" id="job-type-Input" name="job-type-Input" type="select" required>
                                <option value="">Select job type</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Intership">Intership</option>
                              </Input>
                            </div>
                          </Col>
    
                          <Col className="col-lg-12">
                            <div>
                              <Label
                                htmlFor="description-field"
                              >
                                Description <span className="text-danger">*</span>
                              </Label>
                              <Input
                                className="rounded-4"
                                id="description-field" 
                                name="description-field" 
                                type="textarea" 
                                rows="3" 
                                placeholder="Description"
                                required />
                            </div>
                          </Col>
    
                          <Col className="col-md-6">
                            <div>
                              <Label
                                htmlFor="vancancy-Input"
                              >
                                No. of Vancancy{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                className="rounded-4"
                                type="number"
                                id="vancancy-Input"
                                placeholder="No. of vancancy"
                                required
                              />
                            </div>
                          </Col>
                          <Col className="col-md-6">
                            <div>
                              <Label
                                htmlFor="experience-Input"
                              >
                                Experience <span className="text-danger">*</span>
                              </Label>
                              <Input className="rounded-4" id="experience-Input" name="experience-Input" type="select" required>
                                <option value="">Select Experience</option>
                                <option value="0 Year">0 Year</option>
                                <option value="2 Years">2 Years</option>
                                <option value="3 Years">3 Years</option>
                                <option value="4 Years">4 Years</option>
                                <option value="5 Years">5 Years</option>
                              </Input>
                            </div>
                          </Col>
    
                          <Col className="col-lg-6">
                            <div>
                              <Label
                                htmlFor="last-apply-date-Input"
                              >
                                Last Date of Apply{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Flatpickr
                                className="rounded-4"
                                id="datepicker-publish-input"
                                placeholder="Select a date"
                                options={{
                                  altInput: true,
                                  altFormat: "F j, Y",
                                  mode: "multiple",
                                  dateFormat: "d.m.y",
                                }}
                              />
                            </div>
                          </Col>
    
                          <Col className="col-lg-6">
                            <div>
                              <Label
                                htmlFor="close-date-Input"
                              >
                                Close Date <span className="text-danger">*</span>
                              </Label>
                              <Flatpickr
                                className="rounded-4"
                                id="datepicker-publish-input"
                                placeholder="Select a date"
                                options={{
                                  altInput: true,
                                  altFormat: "F j, Y",
                                  mode: "multiple",
                                  dateFormat: "d.m.y",
                                }}
                              />
                            </div>
                          </Col>
    
                          <Col className="col-md-6">
                            <div>
                              <Label
                                htmlFor="start-salary-Input"
                              >
                                Start Salary
                              </Label>
                              <Input
                                className="rounded-4"
                                type="number"
                                id="start-salary-Input"
                                placeholder="Enter start salary"
                                required
                              />
                            </div>
                          </Col>
    
                          <Col className="col-md-6">
                            <div>
                              <Label
                                htmlFor="last-salary-Input"
                              >
                                Last Salary
                              </Label>
                              <Input
                                className="rounded-4"
                                type="number"
                                id="last-salary-Input"
                                placeholder="Enter end salary"
                                required
                              />
                            </div>
                          </Col>
    
                          <Col className="col-md-6">
                            <div>
                              <Label htmlFor="country-Input">
                                Country <span className="text-danger">*</span>
                              </Label>
                              <Input
                                className="rounded-4"
                                type="text"
                                id="country-Input"
                                placeholder="Enter country"
                                required
                              />
                            </div>
                          </Col>
    
                          <Col className="col-md-6">
                            <div>
                              <Label htmlFor="city-Input">
                                State <span className="text-danger">*</span>
                              </Label>
                              <Input
                                className="rounded-4"
                                type="text"
                                id="city-Input"
                                placeholder="Enter city"
                                required
                              />
                            </div>
                          </Col>
    
                          <Col className="col-lg-12">
                            <div>
                              <Label htmlFor="website-field">
                                Tags
                              </Label>
                              <Input
                                className="rounded-4"
                                id="choices-text-unique-values"
                                data-choices
                                data-choices-text-unique-true
                                type="text"
                                defaultValue="Design, Remote"
                                required
                              />
                            </div>
                          </Col>
    
                          <Col className="col-lg-12">
                            <div className="hstack justify-content-end gap-2">
                              <button
                                type="button"
                                className="btn btn-ghost-danger"
                              >
                                <i className="ri-close-line align-bottom"></i>{" "}
                                Cancel
                              </button>
                              <button
                                style={{ borderRadius: "20px" }}
                                type="submit" 
                                className="btn btn-secondary"
                              >
                                Ajouter l'offre d'emploi
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </CardBody>
                    </Form>
                  </Card>
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
                    title="&nbsp;Offre d'emploi"
                    pageTitle={
                        <>
                            <i className="ri-team-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                        </>
                    }
                />
                <React.Fragment>
                    <NewJobs />
                </React.Fragment>
            </Container>
        </div>
    )
}

export default OffreAdd;