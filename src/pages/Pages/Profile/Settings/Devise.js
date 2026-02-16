import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Util,
} from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
// import { SlArrowRight } from "react- icons/sl";


//import images
import progileBg from "../../../../assets/images/profile-bg.jpg";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";

const Devise = () => {
  console.log("Unit");
  const [activeTab, setActiveTab] = useState("1");

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  document.title =
    "Devise Settings | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="main-content" style={{ margin: "0" }}>
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                  <h4 className="mb-sm-0 fw-100">Devise</h4>

                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <a href="#" className="text-decoration-none">Inawo&gt;</a>
                      </li>
                      <li className="breadcrumb-item active">Devise</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-12">
              <div class="card">
                <div class="card-header">
                  <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div class="col-md-4">
                      <div class="search-box">
                        <input
                          type="text"
                          class="form-control search"
                          placeholder="Chercher une devise . . ."
                          style={{borderRadius: '20px'}}
                        />
                        <i class="ri-search-line search-icon"></i>
                      </div>
                    </div>

                    <div class="flex-shrink-0">
                      <div class="hstack text-nowrap gap-2">
                        <div class="flex-grow-1">
                          <button
                            class="btn btn-info add-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#showModal"
                            style={{borderRadius: '20px'}}
                          >
                          <i class="ri-file-add-line"></i>
                          Ajouter une devise
                          </button>
                        </div>

                        <button
                          class="btn btn-success add-btn"
                          data-bs-toggle=""
                          data-bs-target="#showModal"
                          style={{borderRadius: '20px'}}
                        >
                          <i class="ri-file-upload-line me-1 align-bottom"></i>{" "}
                          Exporter{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="">
              <div class="card" id="contactList">
                <div class="card-body">
                  <div>
                    <div class="table-responsive table-card ">
                      <table
                        class="table align-middle table-nowrap mb-0"
                        id="customerTable align-item-center" 
                       >
                        <thead class="table-light">
                          <tr>
                            <th scope="col" style={{ width: "50px" }}>
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  id="checkAll"
                                  value="option"
                                />
                              </div>
                            </th>
                            <th class="sort" data-sort="name" scope="col">
                              Nom
                            </th>
                            <th
                              class="sort"
                              data-sort="company_name"
                              scope="col"
                            >
                              Zone
                            </th>
                            <th
                              class="sort"
                              data-sort="company_name"
                              scope="col"
                            >
                              Statut
                            </th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody class="list form-check-all">
                          <tr>
                            <th scope="row">
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  name="chk_child"
                                  value="option1"
                                />
                              </div>
                            </th>
                            <td class="id" style={{ display: "none" }}>
                              <a
                                href="javascript:void(0);"
                                class="fw-medium link-primary"
                              >
                                #VZ001
                              </a>
                            </td>
                            <td class="name">
                              <div class="d-flex align-items-center">
                                <div class="flex-shrink-0">
                                  
                                </div>
                                <div class="flex-grow-1 ms-2 name">Euro</div>
                              </div>
                            </td>
                            <td class="tags">
                              <span class="badge bg-primary-subtle text-primary">
                                €
                              </span>
                            </td>

                            <td class="tags">
                              <div class="form-check form-switch fs-4">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  id="rating_1"
                                />
                                <label
                                  class="form-check-label"
                                  for="rating_1"
                                ></label>
                              </div>
                            </td>
                            <td>
                              <ul class="list-inline hstack gap-2 mb-0">
                                <li class="list-inline-item">
                                  <div class="dropdown">
                                    <button
                                      class="btn btn-soft-secondary btn-sm dropdown"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i class="ri-edit-line"></i>
                                    </button>
                                  </div>
                                </li>
                                <li class="list-inline-item">
                                  <div class="dropdown">
                                    <button
                                      class="btn btn-soft-secondary btn-sm dropdown"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i class="ri-delete-bin-6-line"></i>
                                    </button>
                                  </div>
                                </li>
                              </ul>
                            </td>
                          </tr>

                          <tr>
                            <th scope="row">
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  name="chk_child"
                                  value="option1"
                                />
                              </div>
                            </th>
                            <td class="id" style={{ display: "none" }}>
                              <a
                                href="javascript:void(0);"
                                class="fw-medium link-primary"
                              >
                                #VZ001
                              </a>
                            </td>
                            <td class="name">
                              <div class="d-flex align-items-center">
                                <div class="flex-shrink-0">
                                </div>
                                <div class="flex-grow-1 ms-2 name">Dolla</div>
                              </div>
                            </td>
                            <td class="tags">
                              <span class="badge bg-primary-subtle text-primary">
                                $
                              </span>
                            </td>

                            <td class="tags">
                              <div class="form-check form-switch fs-4">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  id="rating_1"
                                />
                                <label
                                  class="form-check-label"
                                  for="rating_1"
                                ></label>
                              </div>
                            </td>

                            <td>
                              <ul class="list-inline hstack gap-2 mb-0">
                                <li class="list-inline-item">
                                  <div class="dropdown">
                                    <button
                                      class="btn btn-soft-secondary btn-sm dropdown"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i class="ri-edit-line"></i>
                                    </button>
                                  </div>
                                </li>
                                <li class="list-inline-item">
                                  <div class="dropdown">
                                    <button
                                      class="btn btn-soft-secondary btn-sm dropdown"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i class="ri-delete-bin-6-line"></i>
                                    </button>
                                  </div>
                                </li>
                              </ul>
                            </td>
                          </tr>

                          <tr>
                            <th scope="row">
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  name="chk_child"
                                  value="option1"
                                />
                              </div>
                            </th>
                            <td class="id" style={{ display: "none" }}>
                              <a
                                href="javascript:void(0);"
                                class="fw-medium link-primary"
                              >
                                #VZ001
                              </a>
                            </td>
                            <td class="name">
                              <div class="d-flex align-items-center">
                                <div class="flex-shrink-0">
                                </div>
                                <div class="flex-grow-1 ms-2 name">Franc</div>
                              </div>
                            </td>
                            <td class="tags">
                              <span class="badge bg-primary-subtle text-primary">
                                
                              </span>
                            </td>
                            <td class="tags">
                              <div class="form-check form-switch fs-4">
                                <input
                                  class="form-check-input"
                                  type="checkbox"
                                  id="rating_1"
                                />
                                <label
                                  class="form-check-label"
                                  for="rating_1"
                                ></label>
                              </div>
                            </td>
                            <td>
                              <ul class="list-inline hstack gap-2 mb-0">
                                <li class="list-inline-item">
                                  <div class="dropdown">
                                    <button
                                      class="btn btn-soft-secondary btn-sm dropdown"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i class="ri-edit-line"></i>
                                    </button>
                                  </div>
                                </li>
                                <li class="list-inline-item">
                                  <div class="dropdown">
                                    <button
                                      class="btn btn-soft-secondary btn-sm dropdown"
                                      type="button"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i class="ri-delete-bin-6-line"></i>
                                    </button>
                                  </div>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div class="noresult" style={{ display: "none" }}>
                        <div class="text-center">
                          <lord-icon
                            src="https://cdn.lordicon.com/msoeawqm.json"
                            trigger="loop"
                            colors="primary:#121331,secondary:#08a88a"
                            style={{ width: "75px", height: "75px" }}
                          ></lord-icon>
                          <h5 class="mt-2">Sorry! No Result Found</h5>
                          <p class="text-muted mb-0">
                            We've searched more than 150+ contacts We did not
                            find any contacts for you search.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex justify-content-end mt-3">
                      <div class="pagination-wrap hstack gap-2">
                        <a class="page-item pagination-prev disabled" href="#"  style={{borderRadius: '20px'}}>
                          Previous
                        </a>
                        <ul class="pagination listjs-pagination mb-0 active"></ul>
                        <button type="submit" class="btn btn-info" id="add-btn"  style={{borderRadius: '50px'}}>
                          1
                        </button>
                        <ul class="pagination listjs-pagination mb-0"></ul>
                        <a class="page-item pagination-next" href="#"  style={{borderRadius: '50px'}}>
                          2
                        </a>
                        <ul class="pagination listjs-pagination mb-0"></ul>
                        <a class="page-item pagination-next" href="#"  style={{borderRadius: '20px'}}>
                          Next
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    class="modal fade"
                    id="showModal"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                   >
                    <div class="modal-dialog modal-dialog-centered">
                      <div class="modal-content border-0 rounded-4">
                        <div class="modal-header bg-info-subtle p-3 rounded-top-4">
                          <h5 class="modal-title" id="exampleModalLabel">Ajouter une devise</h5>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            id="close-modal"
                            style={{borderRadius: '20px'}}
                          ></button>
                        </div>
                        <form class="tablelist-form" autocomplete="off">
                          <div class="modal-body">
                            <input type="hidden" id="id-field" />
                            <div class="row g-3">
                              <div class="col-lg-12">
                                <div>
                                  <label for="name-field" class="form-label">
                                    Nom
                                  </label>
                                  <input
                                    type="text"
                                    id="customername-field"
                                    class="form-control"
                                    placeholder="Enter name"
                                    required
                                  />
                                </div>
                              </div>
                              <div class="col-lg-12">
                                <div>
                                  <div class="mb-3">
                                    <label
                                      for="company_name"
                                      class="form-label"
                                    >
                                      Zone
                                    </label>
                                    <select
                                      id="company_name"
                                      class="form-control"
                                      required
                                    >
                                      <optgroup label="Asie">
                                      <option value="ford">Centre</option>
                                        <option value="tesla">Sud</option>
                                        <option value="toyota">Est</option>
                                        <option value="toyota">Ouest</option>
                                      </optgroup>
                                      <optgroup label="Amerique">
                                      <option value="ford">Centre</option>
                                        <option value="tesla">Sud</option>
                                        <option value="toyota">Est</option>
                                        <option value="toyota">Ouest</option>
                                      </optgroup>
                                      <optgroup label="Afrique">
                                        <option value="ford">Centre</option>
                                        <option value="tesla">Sud</option>
                                        <option value="toyota">Est</option>
                                        <option value="toyota">Ouest</option>
                                      </optgroup>
                                      <optgroup label="Europe">
                                      <option value="ford">Centre</option>
                                        <option value="tesla">Sud</option>
                                        <option value="toyota">Est</option>
                                        <option value="toyota">Ouest</option>
                                      </optgroup>
                                      <optgroup label="Oceanie">
                                      <option value="ford">Centre</option>
                                        <option value="tesla">Sud</option>
                                        <option value="toyota">Est</option>
                                        <option value="toyota">Ouest</option>
                                      </optgroup>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="modal-footer">
                            <div class="hstack gap-2 justify-content-end">
                              <button
                                type="button"
                                class="btn btn-light"
                                data-bs-dismiss="modal"
                              >
                                Fermer
                              </button>
                              <button
                                type="submit"
                                class="btn btn-success"
                                id="add-btn"
                                style={{borderRadius: '20px'}}
                              >
                                Ajouter la devise
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div
                    class="modal fade zoomIn"
                    id="deleteRecordModal"
                    tabindex="-1"
                    aria-hidden="true"
                    >
                    {/* <h5 class=" ">Ajouter une devise</h5> */}
                    <div class="modal-dialog modal-dialog-centered">
                      <div class="modal-content">
                        <div class="modal-header">
                          <button
                            type="button"
                            class="btn-close"
                            id="deleteRecord-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                          <span class="ms-2 fs-6">Ajouter une devise</span>{" "}
                        </div>
                        <div class="modal-body p-5 text-center">
                          <lord-icon
                            src="https://cdn.lordicon.com/gsqxdxog.json"
                            trigger="loop"
                            colors="primary:#405189,secondary:#f06548"
                            style={{ width: "90px", height: "90px" }}
                          ></lord-icon>
                          <div class="mt-4 text-center">
                            <h4 class="fs-semibold">
                              You are about to delete a contact?
                            </h4>
                            <p class="text-muted fs-14 mb-4 pt-1">
                              Deleting your contact will remove all of your
                              information from our database.
                            </p>
                            <div class="hstack gap-2 justify-content-center remove">
                              <button
                                class="btn btn-link link-success fw-medium text-decoration-none"
                                id="deleteRecord-close"
                                data-bs-dismiss="modal"
                              >
                                <i class="ri-close-line me-1 align-middle"></i>{" "}
                                Close
                              </button>
                              <button class="btn btn-danger" id="delete-record">
                                Yes, Delete It!!
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div class="col-xxl-3">
              <div class="card" id="contact-view-detail">
                {/* <div class="card-body text-center">
                  <div class="position-relative d-inline-block">
                    <img
                      src="assets/images/users/avatar-10.jpg"
                      alt=""
                      class="avatar-lg rounded-circle img-thumbnail"
                    />
                    <span class="contact-active position-absolute rounded-circle bg-success">
                      <span class="visually-hidden"></span>
                    </span>
                  </div>
                  <h5 class="mt-4 mb-1">Tonya Noble</h5>
                  <p class="text-muted">Nesta Technologies</p>

                  <ul class="list-inline mb-0">
                    <li class="list-inline-item avatar-xs">
                      <a
                        href="javascript:void(0);"
                        class="avatar-title bg-success-subtle text-success fs-15 rounded"
                      >
                        <i class="ri-phone-line"></i>
                      </a>
                    </li>
                    <li class="list-inline-item avatar-xs">
                      <a
                        href="javascript:void(0);"
                        class="avatar-title bg-danger-subtle text-danger fs-15 rounded"
                      >
                        <i class="ri-mail-line"></i>
                      </a>
                    </li>
                    <li class="list-inline-item avatar-xs">
                      <a
                        href="javascript:void(0);"
                        class="avatar-title bg-warning-subtle text-warning fs-15 rounded"
                      >
                        <i class="ri-question-answer-line"></i>
                      </a>
                    </li>
                  </ul>
                </div> *
                * <div class="card-body">
                  <h6 class="text-muted text-uppercase fw-semibold mb-3">
                    Personal Information
                  </h6>
                  <p class="text-muted mb-4">
                    Hello, I'm Tonya Noble, The most effective objective is one
                    that is tailored to the job you are applying for. It states
                    what kind of career you are seeking, and what skills and
                    experiences.
                  </p>
                  <div class="table-responsive table-card">
                    <table class="table table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td class="fw-medium" scope="row">
                            Designation
                          </td>
                          <td>Lead Designer / Developer</td>
                        </tr>
                        <tr>
                          <td class="fw-medium" scope="row">
                            Email ID
                          </td>
                          <td>tonyanoble@velzon.com</td>
                        </tr>
                        <tr>
                          <td class="fw-medium" scope="row">
                            Phone No
                          </td>
                          <td>414-453-5725</td>
                        </tr>
                        <tr>
                          <td class="fw-medium" scope="row">
                            Lead Score
                          </td>
                          <td>154</td>
                        </tr>
                        <tr>
                          <td class="fw-medium" scope="row">
                            Tags
                          </td>
                          <td>
                            <span class="badge bg-primary-subtle text-primary">
                              Lead
                            </span>
                            <span class="badge bg-primary-subtle text-primary">
                              Partner
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td class="fw-medium" scope="row">
                            Last Contacted
                          </td>
                          <td>
                            15 Dec, 2021{" "}
                            <small class="text-muted">08:58AM</small>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div> 
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Devise;
