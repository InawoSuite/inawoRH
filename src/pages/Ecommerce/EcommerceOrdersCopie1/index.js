import React, { useState } from "react";


const TaskTable = () => {
const [currentPage, setCurrentPage] = useState(1);

  // Tableau pour la page 1 (sans colonne Assigned To)
  const TablePage1 = () => (
    <table className="table align-middle table-nowrap mb-0" id="tasksTable">
      <thead className="table-light text-muted">
        <tr>
          <th scope="col" style={{ width: "40px" }}>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="checkAll" />
            </div>
          </th>
          <th className="sort" data-sort="id">ID</th>
          <th className="sort" data-sort="project_name">Project</th>
          <th className="sort" data-sort="tasks_name">Task</th>
          <th className="sort" data-sort="client_name">Client Name</th>
          <th className="sort" data-sort="assignedto">Assigned To</th>
          <th className="sort" data-sort="due_date">Due Date</th>
          <th className="sort" data-sort="status">Status</th>
          <th className="sort" data-sort="priority">Priority</th>
        </tr>
      </thead>
      <tbody className="list form-check-all">
        {/* Ligne 1 */}
        <tr>
          <th scope="row">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="chk_child" />
            </div>
          </th>
          <td className="id">
            <a href="apps-tasks-details.html" className="fw-medium link-primary">#VLZ2</a>
          </td>
          <td className="project_name">
            <a href="apps-projects-overview.html" className="fw-medium link-primary">Skote - v1.0.0</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Apologize for shopping Error!</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="apps-tasks-details.html"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#showModal" data-bs-toggle="modal">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </td>
          <td className="client_name">Nathan Cole</td>
          <td className="assignedto">
            <div className="avatar-group flex-nowrap">
              <a href="javascript:void(0);" className="avatar-group-item" data-bs-toggle="tooltip" title="Virgie Price">
                <img src="assets/images/users/avatar-5.jpg" alt="" className="rounded-circle avatar-xxs" />
              </a>
              <a href="javascript:void(0);" className="avatar-group-item" data-bs-toggle="tooltip" title="Diego Norris">
                <img src="assets/images/users/avatar-9.jpg" alt="" className="rounded-circle avatar-xxs" />
              </a>
              <a href="javascript:void(0);" className="avatar-group-item" data-bs-toggle="tooltip" title="Anthony Mills">
                <img src="assets/images/users/avatar-10.jpg" alt="" className="rounded-circle avatar-xxs" />
              </a>
            </div>
          </td>
          <td className="due_date">23 Oct, 2021</td>
          <td className="status">
            <span className="badge bg-success-subtle text-success text-uppercase">Completed</span>
          </td>
          <td className="priority">
            <span className="badge bg-warning text-uppercase">Medium</span>
          </td>
        </tr>

        {/* Ligne 2 */}
        <tr>
          <th scope="row">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="chk_child" />
            </div>
          </th>
          <td className="id">
            <a href="apps-tasks-details.html" className="fw-medium link-primary">#VLZ1</a>
          </td>
          <td className="project_name">
            <a href="apps-projects-overview.html" className="fw-medium link-primary">Velzon - v1.0.0</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Profile Page Structure</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="apps-tasks-details.html"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#showModal" data-bs-toggle="modal">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </td>
          <td className="client_name">Robert McMahon</td>
          <td className="assignedto">
            <div className="avatar-group flex-nowrap">
              <a href="javascript:void(0);" className="avatar-group-item" data-bs-toggle="tooltip" title="Curtis Saenz">
                <img src="assets/images/users/avatar-1.jpg" alt="" className="rounded-circle avatar-xxs" />
              </a>
              <a href="javascript:void(0);" className="avatar-group-item" data-bs-toggle="tooltip" title="John Robles">
                <img src="assets/images/users/avatar-3.jpg" alt="" className="rounded-circle avatar-xxs" />
              </a>
            </div>
          </td>
          <td className="due_date">25 Jan, 2022</td>
          <td className="status">
            <span className="badge bg-secondary-subtle text-secondary text-uppercase">Inprogress</span>
          </td>
          <td className="priority">
            <span className="badge bg-danger text-uppercase">High</span>
          </td>
        </tr>
      </tbody>
    </table>
  );

  // Tableau pour la page 2 (sans colonne Assigned To)
  const TablePage2 = () => (
    <table className="table align-middle table-nowrap mb-0" id="tasksTable">
      <thead className="table-light text-muted">
        <tr>
          <th scope="col" style={{ width: "40px" }}>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="checkAll" />
            </div>
          </th>
          <th className="sort desc" data-sort="id">ID</th>
          <th className="sort" data-sort="project_name">Project</th>
          <th className="sort" data-sort="tasks_name">Task</th>
          <th className="sort" data-sort="client_name">Client Name</th>
          <th className="sort" data-sort="due_date">Due Date</th>
          <th className="sort" data-sort="status">Status</th>
          <th className="sort" data-sort="priority">Priority</th>
        </tr>
      </thead>
      <tbody className="list form-check-all">

        {/* Ligne 1 */}
        <tr>
          <th scope="row">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="chk_child" />
            </div>
          </th>
          <td className="id">
            <a href="apps-tasks-details.html" className="fw-medium link-primary">#VLZ10</a>
          </td>
          <td className="project_name">
            <a href="apps-projects-overview.html" className="fw-medium link-primary">Symox v1.0.0</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Add Dynamic Contact List</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="apps-tasks-details.html"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#showModal" data-bs-toggle="modal">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </td>
          <td className="client_name">RH Nichols</td>
          <td className="due_date">15 Dec, 2020</td>
          <td className="status">
            <span className="badge bg-secondary-subtle text-secondary text-uppercase">Inprogress</span>
          </td>
          <td className="priority">
            <span className="badge bg-warning text-uppercase">Medium</span>
          </td>
        </tr>

        {/* Ligne 2 */}
        <tr>
          <th scope="row">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="chk_child" />
            </div>
          </th>
          <td className="id">
            <a href="apps-tasks-details.html" className="fw-medium link-primary">#VLZ9</a>
          </td>
          <td className="project_name">
            <a href="apps-projects-overview.html" className="fw-medium link-primary">Doot - Chat App Template</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Additional Calendar</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="apps-tasks-details.html"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#showModal" data-bs-toggle="modal">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </td>
          <td className="client_name">Diana Kohler</td>
          <td className="due_date">13 Jun, 2020</td>
          <td className="status">
            <span className="badge bg-info-subtle text-info text-uppercase">New</span>
          </td>
          <td className="priority">
            <span className="badge bg-success text-uppercase">Low</span>
          </td>
        </tr>

        {/* Ligne 3 */}
        <tr>
          <th scope="row">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="chk_child" />
            </div>
          </th>
          <td className="id">
            <a href="apps-tasks-details.html" className="fw-medium link-primary">#VLZ8</a>
          </td>
          <td className="project_name">
            <a href="apps-projects-overview.html" className="fw-medium link-primary">Qexal - Landing Page</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Brand Logo design</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="apps-tasks-details.html"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#showModal" data-bs-toggle="modal">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </td>
          <td className="client_name">David Nichols</td>
          <td className="due_date">29 Dec, 2021</td>
          <td className="status">
            <span className="badge bg-warning-subtle text-warning text-uppercase">Pending</span>
          </td>
          <td className="priority">
            <span className="badge bg-danger text-uppercase">High</span>
          </td>
        </tr>

        {/* Ligne 4 */}
        <tr>
          <th scope="row">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="chk_child" />
            </div>
          </th>
          <td className="id">
            <a href="apps-tasks-details.html" className="fw-medium link-primary">#VLZ7</a>
          </td>
          <td className="project_name">
            <a href="apps-projects-overview.html" className="fw-medium link-primary">Dorsin - Landing Page</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Benner design for FB &amp; Twitter</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="apps-tasks-details.html"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#showModal" data-bs-toggle="modal">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </td>
          <td className="client_name">Carter</td>
          <td className="due_date">26 Feb, 2019</td>
          <td className="status">
            <span className="badge bg-warning-subtle text-warning text-uppercase">Pending</span>
          </td>
          <td className="priority">
            <span className="badge bg-warning text-uppercase">Medium</span>
          </td>
        </tr>

        {/* Ligne 5 */}
        <tr>
          <th scope="row">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="chk_child" />
            </div>
          </th>
          <td className="id">
            <a href="apps-tasks-details.html" className="fw-medium link-primary">#VLZ6</a>
          </td>
          <td className="project_name">
            <a href="apps-projects-overview.html" className="fw-medium link-primary">Minimal - v2.1.0</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Change email option process</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="apps-tasks-details.html"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#showModal" data-bs-toggle="modal">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </td>
          <td className="client_name">Tonya Noble</td>
          <td className="due_date">03 Mar, 2020</td>
          <td className="status">
            <span className="badge bg-success-subtle text-success text-uppercase">Completed</span>
          </td>
          <td className="priority">
            <span className="badge bg-danger text-uppercase">High</span>
          </td>
        </tr>

        {/* Ligne 6 */}
        <tr>
          <th scope="row">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="chk_child" />
            </div>
          </th>
          <td className="id">
            <a href="apps-tasks-details.html" className="fw-medium link-primary">#VLZ5</a>
          </td>
          <td className="project_name">
            <a href="apps-projects-overview.html" className="fw-medium link-primary">Qexal - Dashboard UI</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Add on hover state on the card</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="apps-tasks-details.html"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#showModal" data-bs-toggle="modal">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </td>
          <td className="client_name">Mary Gant</td>
          <td className="due_date">13 Oct, 2020</td>
          <td className="status">
            <span className="badge bg-secondary-subtle text-secondary text-uppercase">Inprogress</span>
          </td>
          <td className="priority">
            <span className="badge bg-warning text-uppercase">Medium</span>
          </td>
        </tr>

        {/* Ligne 7 */}
        <tr>
          <th scope="row">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="chk_child" />
            </div>
          </th>
          <td className="id">
            <a href="apps-tasks-details.html" className="fw-medium link-primary">#VLZ4</a>
          </td>
          <td className="project_name">
            <a href="apps-projects-overview.html" className="fw-medium link-primary">Dorsin - Admin Dashboard</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Analytics Dashboard UI</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="apps-tasks-details.html"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#showModal" data-bs-toggle="modal">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </td>
          <td className="client_name">David Nichols</td>
          <td className="due_date">13 Jun, 2020</td>
          <td className="status">
            <span className="badge bg-info-subtle text-info text-uppercase">New</span>
          </td>
          <td className="priority">
            <span className="badge bg-success text-uppercase">Low</span>
          </td>
        </tr>

      </tbody>
    </table>
  );

 return (
  
  <>
  <div className="col-lg-12" >
            <div className="card" style={{ borderRadius: "20px" }}>
              <div className="card-header" style={{
                borderRadius: "20px 20px 20px 20px",
                borderBottom: "none"
              }}>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="col-md-4">
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Chercher un commercial . . ."
                        style={{ borderRadius: "20px" }}
                        // value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="hstack text-nowrap gap-1">
                      <div className="flex-grow-1">
                        <button
                          className="btn btn-info add-btn"
                          data-bs-target="#showModal"
                          style={{ borderRadius: '20px' }}
                          onClick={() => { setIsEdit(false); toggle(); }}                          >
                          <i className="ri-file-add-line me-1  align-bottom"></i>
                          Ajouter un Département
                        </button>
                      </div>

                      <button
                        className="btn btn-success add-btn"
                        data-bs-toggle=""
                        data-bs-target="#showModal"
                        type="button" onClick={() => setIsExportCSV(true)} style={{ borderRadius: '20px', overflow: 'hidden' }}
                        contentClassName="rounded-modal"
                      >
                        <i className="ri-file-upload-line me-1 align-bottom"></i>
                        Exporter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    {/* Partie entête avec les boutons */}
    <div className="col-lg-12">
      <div className="card" style={{ borderRadius: "500px" }}>
        <div
          className="card-header"
          style={{
            borderRadius: "20px",
            borderBottom: "none",
          }}
        >
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="col-md-4">
              <div className="search-box">
                <input
                  type="text"
                  className="form-control search"
                  placeholder="All task"
                  style={{ borderRadius: "20px" }}
                  // value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>

            <div className="flex-shrink-0">
              <div className="hstack text-nowrap gap-1">
                <div className="flex-grow-1">
                  <button
                    className="btn btn-info add-btn"
                    data-bs-target="#showModal"
                    style={{ borderRadius: "20px" }}
                    onClick={() => {
                      setIsEdit(false);
                      toggle();
                    }}
                  >
                    <i className="ri-file-add-line me-1 align-bottom"></i>
                    Create task
                  </button>
                </div>

               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="card-body border border-dashed border-end-0 border-start-0">

  <form>
    <div className="row g-3">
      <div className="col-xxl-5 col-sm-12">
        <div className="search-box position-relative">
          <input
            type="text"
            className="form-control search bg-light border-light"
            placeholder="Search for tasks or something..."
          />
          <i className="ri-search-line search-icon"></i>
        </div>
      </div>

      <div className="col-xxl-3 col-sm-4">
        <input
          type="text"
          className="form-control bg-light border-light"
          id="demo-datepicker"
          placeholder="Select date range"
          readOnly
          data-provider="flatpickr"
          data-date-format="d M, Y"
          data-range-date="true"
        />
      </div>

      <div className="col-xxl-3 col-sm-4">
        <select className="form-control" id="idStatus">
          <option value="">Status</option>
          <option value="all" selected>All</option>
          <option value="New">New</option>
          <option value="Pending">Pending</option>
          <option value="Inprogress">Inprogress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="col-xxl-1 col-sm-4">
        <button
          type="button"
          className="btn btn-primary w-100"
          onClick={() => SearchData()}
        >
          <i className="ri-equalizer-fill me-1 align-bottom"></i>
          Filters
        </button>
      </div>
    </div>
  </form>
</div>

    {/* Partie table + pagination */}
  <div className="card-body">
      <div className="table-responsive table-card mb-4">
        {currentPage === 1 ? <TablePage2 /> : <TablePage1 />}

        <div className="noresult" style={{ display: "none" }}>
          <div className="text-center">
            <lord-icon
              src="https://cdn.lordicon.com/msoeawqm.json"
              trigger="loop"
              colors="primary:#121331,secondary:#08a88a"
              style={{ width: "75px", height: "75px" }}
            ></lord-icon>
            <h5 className="mt-2">Sorry! No Result Found</h5>
            <p className="text-muted mb-0">
              We've searched more than 200k+ tasks. We did not find any tasks for your search.
            </p>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mt-2">
        <div className="pagination-wrap hstack gap-2" style={{ display: "flex" }}>
          <a
            className={`page-item pagination-prev ${currentPage === 1 ? "disabled" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
          >
            Previous
          </a>

          <ul className="pagination listjs-pagination mb-0">
            <li className={currentPage === 1 ? "active" : ""}>
              <a
                className="page"
                href="#"
                data-i="1"
                data-page="8"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(1);
                }}
              >
                1
              </a>
            </li>
            <li className={currentPage === 2 ? "active" : ""}>
              <a
                className="page"
                href="#"
                data-i="2"
                data-page="8"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(2);
                }}
              >
                2
              </a>
            </li>
          </ul>

          <a
            className={`page-item pagination-next ${currentPage === 2 ? "disabled" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < 2) setCurrentPage(currentPage + 1);
            }}
          >
            Next
          </a>
        </div>
      </div>
    </div>
  </>
);

};


export default TaskTable;
