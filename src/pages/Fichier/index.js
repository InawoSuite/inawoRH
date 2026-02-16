import React, { useState } from "react";
import {
  CardBody,
  Row,
  Col,
  Card,
  Container,
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Label,
  Input
} from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import NotAvailablePage from '../../Components/Common/NotAvailablePage';

// Données statiques pour les magasins
const staticData = [
  {
    id: 1,
    nom: "Magasin Central",
    description: "Magasin principal de stockage",
    ville: "Douala",
    pays: "Cameroun",
    status: "Actif"
  },
  {
    id: 2,
    nom: "Dépôt Sud",
    description: "Dépôt secondaire zone sud",
    ville: "Yaoundé",
    pays: "Cameroun",
    status: "Actif"
  },
  // Ajoutez d'autres magasins ici
];

const Fichier= () => {
  // États
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState(""); // Ajout de l'état search
  const [selectedItems, setSelectedItems] = useState([]); // État pour les checkboxes
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    ville: "",
    pays: "",
    status: "Actif"
  });

  // Filtrage des données
  const filteredData = staticData.filter(item =>
    Object.values(item).some(
      value => value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  // Calculs de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Fonctions de gestion
  const toggle = () => setModal(!modal);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setModal(false);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

    document.title = "Fichiers | INAWO - Suite de Gestion"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <>
                    <BreadCrumb
                      title="&nbsp;Fichiers"
                      pageTitle={
                        <>
                          <i className="ri-folders-line"></i>
                          &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                        </>
                      }
                    />
                  </>
          
          <Row>
            <Col lg={12}>
            <div className="col-lg-12" >
            <div className="card" style={{ borderRadius: "70px" }}>
              <div className="card-header" style={{
                borderRadius: "70px 70px 70px 70px",
                borderBottom: "none"
              }}>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="col-md-4">
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Liste des fichiers"
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
                          disabled
                          onClick={() => { setIsEdit(false); toggle(); }}                          >
                          <i className="ri-file-add-line me-1  align-bottom"></i>
                          Ajouter un fichier
                        </button>
                      </div>

                    
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
              <Card style={{ borderRadius :"20px" }}>
                
        
                <CardBody>
                    <NotAvailablePage description="Cette page vous permettra de consulter de vos fichiers" />
                  {/* <table className="table  table-hover">
                    <thead className="table-light">
                      <tr>
                      <th>
                       
                        </th>
                        <th>N°</th>
                        <th>Nom</th>
                        <th>type</th>
                        <th>unité</th>
                        <th>quantité</th>
                        <th>Stock disponible</th>
                        <th>Stock d'alerte</th>
                        <th>Magasin</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staticData.map((item) => (
                        <tr key={item.id}>
                          <td>
                            
                          </td>
                          <td>{item.id}</td>
                          <td>{item.nom}</td>
                          <td>{item.type}</td>
                          <td>{item.unité}</td>
                          <td>{item.quantité}</td>
                          <td>{item.disponible}</td>
                          <td>{item.alerte}</td>
                          <td>{item.magasin}</td>
                          <td>
                                <ul class="list-inline hstack gap-2 mb-0">
                                    <li class="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" aria-label="View" data-bs-original-title="View">
                                        <a href="apps-ecommerce-order-details.html" class="text-primary d-inline-block">
                                            <i class="ri-eye-fill fs-16"></i>
                                        </a>
                                    </li>
                                    <li class="list-inline-item edit" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" aria-label="Edit" data-bs-original-title="Edit">
                                        <a href="#showModal" data-bs-toggle="modal" class="text-primary d-inline-block edit-item-btn">
                                            <i class="ri-pencil-fill fs-16"></i>
                                        </a>
                                    </li>
                                    <li class="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" aria-label="Remove" data-bs-original-title="Remove">
                                        <a class="text-danger d-inline-block remove-item-btn" data-bs-toggle="modal" href="#deleteOrder">
                                            <i class="ri-delete-bin-5-fill fs-16"></i>
                                        </a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table> */}

                  {/* Modal d'ajout/modification */}
                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} className="modal-header bg-light p-3">
                      Nouvel Commande
                    </ModalHeader>
                    <ModalBody>
                      <Form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <Label htmlFor="reference">Nom</Label>
                          <Input
                            type="text"
                            id="reference"
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="reference">type</Label>
                          <Input
                            type="text"
                            id="reference"
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="reference">Unité</Label>
                          <Input
                            type="text"
                            id="reference"
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="quantite">Quantité</Label>
                          <Input
                            type="number"
                            id="quantite"
                            name="quantite"
                            value={formData.quantite}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="reference">Stock disponible</Label>
                          <Input
                            type="text"
                            id="reference"
                            name="reference"
                            value={formData.reference}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="demandeur">Stock d'alerte</Label>
                          <Input
                            type="text"
                            id="demandeur"
                            name="demandeur"
                            value={formData.demandeur}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="demandeur">Magasin</Label>
                          <Input
                            type="text"
                            id="demandeur"
                            name="demandeur"
                            value={formData.demandeur}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="text-end">
                          <button type="button" className="btn btn-light me-2" onClick={toggle}>
                            Annuler
                          </button>
                          <button type="submit" className="btn btn-primary">
                            Enregistrer
                          </button>
                        </div>
                      </Form>
                    </ModalBody>
                  </Modal>

                  {/* <div className="d-flex justify-content-end">
                    <div className="pagination-wrap hstack gap-2" style={{ display: 'flex' }}>
                      <a
                        className={`page-item pagination-prev ${currentPage === 1 ? 'disabled' : ''}`}
                        href="#"
                        style={{ borderRadius: "20px" }}
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                      >
                        Précédent
                      </a>
                      <ul className="pagination listjs-pagination mb-0">
                        {[...Array(totalPages)].map((_, i) => (
                          <li key={i + 1} className={currentPage === i + 1 ? 'active' : ''}>
                            <a
                              className="page"
                              href="#"
                              style={{ borderRadius: "20px" }}
                              onClick={(e) => {
                                e.preventDefault();
                                onPageChange(i + 1);
                              }}
                            >
                              {i + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                      <a
                        className={`page-item pagination-next ${currentPage === totalPages ? 'disabled' : ''}`}
                        href="#"
                        style={{ borderRadius: "20px" }}
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) onPageChange(currentPage + 1);
                        }}
                      >
                        Suivant
                      </a>
                    </div>
                  </div> */}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Fichier;


