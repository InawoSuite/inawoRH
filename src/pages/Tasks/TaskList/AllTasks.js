import React, { useState } from "react";

const TaskHeader = ({ searchTerm, setSearchTerm, deleteMultiple, SearchData }) => {
  return (
   <div className="card mb-4" style={{ borderRadius: "70px", backgroundColor: "#ffffff" }}>
  <div className="card-header" style={{ backgroundColor: "#ffffff", borderRadius: "70px" }}>
    <div className="d-flex align-items-center justify-content-between">
      {/* Partie gauche : recherche */}
      <div className="col-md-4">
        <div className="search-box">
          <input
            type="text"
            className="form-control search"
            placeholder="Toutes les tâches . . ."
            style={{ borderRadius: "20px" }}
            
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="ri-search-line search-icon"></i>
        </div>
      </div>

      {/* Partie droite : boutons */}
      <div className="flex-shrink-0 d-flex flex-wrap gap-2">
        <button
          className="btn btn-danger add-btn"
          style={{ borderRadius: "20px" }}
          data-bs-toggle="modal"
          data-bs-target="#showModal"
        >
          <i className="ri-add-line align-bottom me-1"></i> Créer une tâche 
        </button>
       
      </div>
    </div>
  </div>
</div>

  );
};

const TaskTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const toggle = () => {
    setShowModal(!showModal);
  };

  // Tableau pour la page 1 (avec colonne Assigned To)
  const TablePage1 = () => (
    <table
      className="table align-middle table-nowrap mb-0"
      style={{
        backgroundColor: "#ffffff",
        color: "#000",
        borderRadius: "20px",
        overflow: "hidden",
        width: "100%"
      }}
    >
      <thead style={{ backgroundColor: "#ffffff", color: "#000", borderRadius: "20px 20px 0 0" }}>
        <tr>
          <th scope="col" style={{ width: "40px", backgroundColor: "#ffffff" }}></th>
          <th className="sort" data-sort="id" style={{ width: "100px", backgroundColor: "#ffffff" }}>ID</th>
          <th className="sort" data-sort="project_name" style={{ width: "150px", backgroundColor: "#ffffff" }}>Project</th>
          <th className="sort" data-sort="tasks_name" style={{ width: "150px", backgroundColor: "#ffffff" }}>Task</th>
          <th className="sort" data-sort="client_name" style={{ width: "150px", backgroundColor: "#ffffff" }}>Client Name</th>
          <th className="sort" data-sort="assignedto" style={{ width: "150px", backgroundColor: "#ffffff" }}>Assigned To</th>
          <th className="sort" data-sort="due_date" style={{ width: "120px", backgroundColor: "#ffffff" }}>Due Date</th>
          <th className="sort" data-sort="status" style={{ width: "120px", backgroundColor: "#ffffff" }}>Status</th>
          <th className="sort" data-sort="priority" style={{ width: "120px", backgroundColor: "#ffffff" }}>Priority</th>
        </tr>
      </thead>
      <tbody className="list form-check-all" style={{ backgroundColor: "#ffffff" }}>
        <tr>
          <th scope="row"></th>
          <td className="id">
            <a href="#" className="fw-medium link-primary">#VLZ2</a>
          </td>
          <td className="project_name px-4">
            <a href="#" className="fw-medium link-primary">Skote - v1.0.0</a>
          </td>
          <td>
            <div className="d-flex px-4">
              <div className="flex-grow-1 tasks_name">Apologize for shopping Error!</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="#"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" href="#">
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
              <a href="#" className="avatar-group-item">
                <div className="rounded-circle avatar-xxs bg-primary text-white d-flex align-items-center justify-content-center" style={{width: "24px", height: "24px", fontSize: "10px"}}>VP</div>
              </a>
              <a href="#" className="avatar-group-item">
                <div className="rounded-circle avatar-xxs bg-success text-white d-flex align-items-center justify-content-center" style={{width: "24px", height: "24px", fontSize: "10px"}}>DN</div>
              </a>
              <a href="#" className="avatar-group-item">
                <div className="rounded-circle avatar-xxs bg-info text-white d-flex align-items-center justify-content-center" style={{width: "24px", height: "24px", fontSize: "10px"}}>AM</div>
              </a>
            </div>
          </td>
          <td className="due_date">23 Oct, 2021</td>
          <td className="status">
            <span className="badge bg-success text-white text-uppercase">Completed</span>
          </td>
          <td className="priority">
            <span className="badge bg-warning text-white text-uppercase">Medium</span>
          </td>
        </tr>
        <tr>
          <th scope="row"></th>
          <td className="id">
            <a href="#" className="fw-medium link-primary">#VLZ1</a>
          </td>
          <td className="project_name">
            <a href="#" className="fw-medium link-primary">Velzon - v1.0.0</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Profile Page Structure</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="#"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" href="#">
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
              <a href="#" className="avatar-group-item">
                <div className="rounded-circle avatar-xxs bg-warning text-white d-flex align-items-center justify-content-center" style={{width: "24px", height: "24px", fontSize: "10px"}}>CS</div>
              </a>
              <a href="#" className="avatar-group-item">
                <div className="rounded-circle avatar-xxs bg-danger text-white d-flex align-items-center justify-content-center" style={{width: "24px", height: "24px", fontSize: "10px"}}>JR</div>
              </a>
            </div>
          </td>
          <td className="due_date">25 Jan, 2022</td>
          <td className="status">
            <span className="badge bg-secondary text-white text-uppercase">Inprogress</span>
          </td>
          <td className="priority">
            <span className="badge bg-danger text-white text-uppercase">High</span>
          </td>
        </tr>
      </tbody>
    </table>
  );

  // Tableau pour la page 2 (sans colonne Assigned To)
  const TablePage2 = () => (
    <table 
      className="table align-middle table-nowrap mb-0" 
      style={{
        backgroundColor: "#ffffff",
        color: "#000",
        borderRadius: "20px",
        overflow: "hidden",
        width: "100%"
      }}
    >
      <thead 
        style={{
          backgroundColor: "#ffffff",
          color: "#000",
        }}
      >
        <tr>
          <th scope="col" style={{ width: "40px", backgroundColor: "#ffffff" }}></th>
          <th className="sort" data-sort="id" style={{ backgroundColor: "#ffffff" }}>ID</th>
          <th className="sort" data-sort="project_name" style={{ backgroundColor: "#ffffff" }}>Project</th>
          <th className="sort" data-sort="tasks_name" style={{ backgroundColor: "#ffffff" }}>Task</th>
          <th className="sort" data-sort="client_name" style={{ backgroundColor: "#ffffff" }}>Client Name</th>
          <th className="sort" data-sort="due_date" style={{ backgroundColor: "#ffffff" }}>Due Date</th>
          <th className="sort" data-sort="status" style={{ backgroundColor: "#ffffff" }}>Status</th>
          <th className="sort" data-sort="priority" style={{ backgroundColor: "#ffffff" }}>Priority</th>
        </tr>
      </thead>
      <tbody className="list form-check-all" style={{ backgroundColor: "#ffffff" }}>
        {/* Ligne 1 */}
        <tr>
          <th scope="row"></th>
          <td className="id">
            <a href="#" className="fw-medium link-primary">#VLZ10</a>
          </td>
          <td className="project_name">
            <a href="#" className="fw-medium link-primary">Symox v1.0.0</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Add Dynamic Contact List</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="#"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" href="#">
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
            <span className="badge bg-secondary text-white text-uppercase">Inprogress</span>
          </td>
          <td className="priority">
            <span className="badge bg-warning text-white text-uppercase">Medium</span>
          </td>
        </tr>

        {/* Ligne 2 */}
        <tr>
          <th scope="row"></th>
          <td className="id">
            <a href="#" className="fw-medium link-primary">#VLZ9</a>
          </td>
          <td className="project_name">
            <a href="#" className="fw-medium link-primary">Doot - Chat App Template</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Additional Calendar</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="#"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" href="#">
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
            <span className="badge bg-info text-white text-uppercase">New</span>
          </td>
          <td className="priority">
            <span className="badge bg-success text-white text-uppercase">Low</span>
          </td>
        </tr>

        {/* Ligne 3 */}
        <tr>
          <th scope="row"></th>
          <td className="id">
            <a href="#" className="fw-medium link-primary">#VLZ8</a>
          </td>
          <td className="project_name">
            <a href="#" className="fw-medium link-primary">Qexal - Landing Page</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Brand Logo design</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="#"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" href="#">
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
            <span className="badge bg-warning text-white text-uppercase">Pending</span>
          </td>
          <td className="priority">
            <span className="badge bg-danger text-white text-uppercase">High</span>
          </td>
        </tr>

        {/* Ligne 4 */}
        <tr>
          <th scope="row"></th>
          <td className="id">
            <a href="#" className="fw-medium link-primary">#VLZ7</a>
          </td>
          <td className="project_name">
            <a href="#" className="fw-medium link-primary">Dorsin - Landing Page</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Banner design for FB &amp; Twitter</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="#"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" href="#">
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
            <span className="badge bg-warning text-white text-uppercase">Pending</span>
          </td>
          <td className="priority">
            <span className="badge bg-warning text-white text-uppercase">Medium</span>
          </td>
        </tr>

        {/* Ligne 5 */}
        <tr>
          <th scope="row"></th>
          <td className="id">
            <a href="#" className="fw-medium link-primary">#VLZ6</a>
          </td>
          <td className="project_name">
            <a href="#" className="fw-medium link-primary">Minimal - v2.1.0</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Change email option process</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="#"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" href="#">
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
            <span className="badge bg-success text-white text-uppercase">Completed</span>
          </td>
          <td className="priority">
            <span className="badge bg-danger text-white text-uppercase">High</span>
          </td>
        </tr>

        {/* Ligne 6 */}
        <tr>
          <th scope="row"></th>
          <td className="id">
            <a href="#" className="fw-medium link-primary">#VLZ5</a>
          </td>
          <td className="project_name">
            <a href="#" className="fw-medium link-primary">Qexal - Dashboard UI</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Add on hover state on the card</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="#"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" href="#">
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
            <span className="badge bg-secondary text-white text-uppercase">Inprogress</span>
          </td>
          <td className="priority">
            <span className="badge bg-warning text-white text-uppercase">Medium</span>
          </td>
        </tr>

        {/* Ligne 7 */}
        <tr>
          <th scope="row"></th>
          <td className="id">
            <a href="#" className="fw-medium link-primary">#VLZ4</a>
          </td>
          <td className="project_name">
            <a href="#" className="fw-medium link-primary">Dorsin - Admin Dashboard</a>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-grow-1 tasks_name">Analytics Dashboard UI</div>
              <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                  <li className="list-inline-item">
                    <a href="#"><i className="ri-eye-fill align-bottom me-2 text-muted"></i></a>
                  </li>
                  <li className="list-inline-item">
                    <a className="edit-item-btn" href="#">
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                    </a>
                  </li>
                  <li className="list-inline-item">
                    <a className="remove-item-btn" href="#">
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
            <span className="badge bg-info text-white text-uppercase">New</span>
          </td>
          <td className="priority">
            <span className="badge bg-success text-white text-uppercase">Low</span>
          </td>
        </tr>
      </tbody>
    </table>
  );

  // Modal simple pour remplacer le bloc problématique
 const TaskModal = () => (
  <div
    className="modal fade"
    id="showModal"
    tabIndex="-1"
    style={{ display: showModal ? 'block' : 'none' }}
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div
  className="modal-content border-0"
  style={{
    borderRadius: "20px",        // ✅ arrondi visible
    overflow: "hidden",          // ✅ empêche les débordements
    backgroundColor: "#ffffff",  // ✅ fond blanc propre
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)" // ✅ ombre douce
  }}
>

        <div
  className="modal-header"
  style={{
    borderRadius: "20px 20px 0 0",
    backgroundColor: "#e6f0ff" // ou toute autre couleur
  }}
>
  <h5 className="modal-title">Créer une tâche </h5>
  <button type="button" className="btn-close" onClick={toggle}></button>
</div>

        <div className="modal-body">
          <form>
            <div className="row g-3">

              <div className="col-12">
  <label className="form-label">Titre</label>
  <input
    type="text"
    className="form-control"
    style={{ borderRadius: "20px" }}
  />
</div>


              <div className="col-12">
  <label className="form-label">Description</label>
  <input
    type="text"
    className="form-control"
   style={{ borderRadius: "20px", height: "80px" }}

  />
</div>


             <div className="col-12">
  <label className="form-label">Nom du client</label>
  <input
    type="text"
    className="form-control"
    style={{ borderRadius: "20px" }}
  />
</div>
 
 <div className="col-lg-12">
  <label className="form-label">Assigné(e) à</label>
  <div
    style={{
      maxHeight: "95px",
      overflowY: "scroll",
      borderRadius: "20px",
      border: "1px solid #ced4da",
      padding: "10px",
    }}
  >
   <ul className="list-unstyled vstack gap-2 mb-0">
  {[
    { id: "james-forbes", name: "James Forbes", avatar: "https://i.pravatar.cc/32?img=2" },
    { id: "john-robles", name: "John Robles", avatar: "https://i.pravatar.cc/32?img=3" },
    { id: "mary-gant", name: "Mary Gant", avatar: "https://i.pravatar.cc/32?img=4" },
    { id: "curtis-saenz", name: "Curtis Saenz", avatar: "https://i.pravatar.cc/32?img=5" },
    { id: "virgie-price", name: "Virgie Price", avatar: "https://i.pravatar.cc/32?img=6" },
    { id: "anthony-mills", name: "Anthony Mills", avatar: "https://i.pravatar.cc/32?img=7" },
    { id: "marian-angel", name: "Marian Angel", avatar: "https://i.pravatar.cc/32?img=8" },
    { id: "johnnie-walton", name: "Johnnie Walton", avatar: "https://i.pravatar.cc/32?img=9" },
    { id: "donna-weston", name: "Donna Weston", avatar: "https://i.pravatar.cc/32?img=10" },
    { id: "diego-norris", name: "Diego Norris", avatar: "https://i.pravatar.cc/32?img=11" }
  ].map(user => (
    <li key={user.id}>
      <div className="form-check d-flex align-items-center">
        <input
          className="form-check-input me-3"
          type="checkbox"
          id={user.id}
          name="assignedTo[]"
          value={user.avatar}
          style={{ borderRadius: "5px" }}
        />
        <label className="form-check-label d-flex align-items-center" htmlFor={user.id}>
          <span className="flex-shrink-0">
            <img src={user.avatar} alt={user.name} className="avatar-xxs rounded-circle" />
          </span>
          <span className="flex-grow-1 ms-2">{user.name}</span>
        </label>
      </div>
    </li>
  ))}
</ul>

  </div>
</div>


              {/* ✅ Duo: Due Date + Status côte à côte */}
             <div className="col-lg-6">
  <label className="form-label">Date limite</label>
  <input
    type="date"
    className="form-control"
    style={{ borderRadius: "20px" }}
  />
</div>


            <div className="col-lg-6">
  <label className="form-label">Statut</label>
  <select
    className="form-control"
    style={{ borderRadius: "20px" }}
  >
    <option value="New">Nouveau</option>
    <option value="Inprogress">En cours</option>
    <option value="Pending">En attente</option>
    <option value="Completed">Terminé</option>
  </select>
</div>


             <div className="col-12">
  <label className="form-label">Priorité</label>
  <select
    className="form-control"
    style={{ borderRadius: "20px" }}
  >
    <option value="High">Haute</option>
    <option value="Medium">Moyenne</option>
    <option value="Low">Basse</option>
  </select>
</div>

            </div>
          </form>
        </div>
       <div className="modal-footer">
  <button type="button" className="btn btn-success" style={{ borderRadius: "20px" }}>
    Supprimer
  </button>
  <button type="button" className="btn btn-secondary" onClick={toggle} style={{ borderRadius: "20px" }}>
    Enregistrer
  </button>
</div>

      </div>
    </div>
  </div>
);


  return (
    <div className="col-lg-12">
      {/* En-tête */}
      <TaskHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        deleteMultiple={() => console.log("deleteMultiple")}
        SearchData={() => console.log("SearchData")}
      />

      {/* Tableau */}
      <div className="card" style={{ borderRadius: "20px", backgroundColor: "#ffffff" }}>
        <div className="card-body" style={{ backgroundColor: "#ffffff", borderRadius: "20px" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "20px", overflow: "hidden" }}>
            {currentPage === 1 ? <TablePage2 /> : <TablePage1 />}
          </div>

          {/* Aucun résultat trouvé */}
          <div className="noresult" style={{ display: "none" }}>
            <div className="text-center">
              <h5 className="mt-2">Sorry! No Result Found</h5>
              <p className="text-muted mb-0">
                We've searched more than 200k+ tasks. We did not find any tasks for your search.
              </p>
            </div>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-end mt-3">
            <div className="pagination-wrap hstack gap-2">
              <button
                className={`btn btn-outline-primary ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() => {
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                style={{ borderRadius: "20px" }}
              >
                Previous
              </button>

              <div className="d-flex gap-1">
                <button
                  className={`btn ${currentPage === 1 ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setCurrentPage(1)}
                  style={{ borderRadius: "20px", minWidth: "40px" }}
                >
                  1
                </button>
                <button
                  className={`btn ${currentPage === 2 ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setCurrentPage(2)}
                  style={{ borderRadius: "20px", minWidth: "40px" }}
                >
                  2
                </button>
              </div>

              <button
                className={`btn btn-outline-primary ${currentPage === 2 ? "disabled" : ""}`}
                onClick={() => {
                  if (currentPage < 2) setCurrentPage(currentPage + 1);
                }}
                style={{ borderRadius: "20px" }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <TaskModal />
    </div>
  );
};

export default TaskTable;
