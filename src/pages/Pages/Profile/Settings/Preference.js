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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import NotAvailablePage from "../../../../Components/Common/NotAvailablePage";

//import images
import progileBg from "../../../../assets/images/profile-bg.jpg";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";

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

const Preference = () => {
  console.log("Unit");
  const [activeTab, setActiveTab] = useState("1");
    const [formData, setFormData] = useState({
    nom: "",
    description: "",
    ville: "",
    pays: "",
    status: "Actif"
  });
  const [modal, setModal] = useState(false); 

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
   
  };
   const toggle = () => setModal(!modal); 

   document.title = "Préférences | INAWO - Suite de Gestion"

  return (
     <React.Fragment>
          <div className="page-content">
            <Container fluid>
              <>
                        <BreadCrumb
                          title="&nbsp; Preférences"
                          pageTitle={
                            <>
                              <i className="ri-user-settings-line"></i>
                              &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                            </>
                          }
                        />
                      </>
              
              <Row>
                
                
               
                
                                      <Col lg={12}  >
                  <Card style={{ borderRadius: "20px", marginTop: "3px" }}>
                    <CardBody style={{ paddingTop: "50px" }}>
                        <NotAvailablePage description="" />
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
    // <React.Fragment>
    //   <div className="main-content" style={{ margin: "0" }}>
    //     <div className="page-content">
    //       <div className="container-fluid">
    //         <div className="row">
    //           <div className="col-12">
    //             <div className="page-title-box d-sm-flex align-items-center justify-content-between">
    //               <h4 className="mb-sm-0">Préférences</h4>

    //               <div className="page-title-right">
    //                 <ol className="breadcrumb m-0">
    //                   <li className="breadcrumb-item">
    //                     <a href="#" className="text-decoration-none d-flex fs-6"> <span className="ms-2 me-2"><i class="ri-settings-5-line"></i></span> <span className="ms-1 me-1">&gt;</span>  <span className="ms-1 me-1">Inawo</span>  <span className="ms-1 me-1">&gt;</span>   </a>
    //                   </li>
    //                   <li className="breadcrumb-item active">Préférences</li>
    //                 </ol>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

          

    //        < row>
    //         <Card className="p-4 col-12">
    //           <h4 className="mb-sm-0 fw-bold ms-4">Préférences</h4>


    //           <form className="col-12 " >
    //             <div className="d-flex justify-content-between align-items-center text-align-center ">
    //               <CardBody className="col-5">
    //                 <div className="mb-1">
    //                    <label for="company_name" class="form-label fs-6 mt-3">Choisir la devise</label>
    //                   <select
    //                     id="company_name"
    //                     class="form-control bg-light fs-6 p-2 rounded-5"
    //                     required >              
    //                     <option value="ford" className="fs-6 Disabled" selected>Selectionner une devise</option>
    //                     <option value="ford" className="fs-6">USD - US Dollas</option>
    //                     <option value="tesla" className="fs-6">GBP - Britich pround</option>
    //                     <option value="toyota" className="fs-6">EUR - Euro</option>      
    //                   </select>    
    //                 </div>

    //                 <div className="mb-1">
    //                     <label for="company_name" class="form-label fs-6 mt-3">Zone</label>
    //                     <select
    //                       id="company_name"
    //                       class="form-control bg-light fs-6 p-2 rounded-5"
    //                       required >              
    //                       <option value="ford" className="fs-6 Disabled" selected>Selectionner une zone</option>
    //                       <option value="ford" className="fs-6">Occident</option>
    //                       <option value="tesla" className="fs-6">Orient</option>
    //                       <option value="toyota" className="fs-6">Eurpe de l'est</option>      
    //                     </select>    
    //                   </div>

    //                  <div className="mb-1">
    //                   <label for="company_name" class="form-label fs-6 mt-3">Format horaire</label>
    //                     <select
    //                       id="company_name"
    //                       class="form-control bg-light fs-6 p-2 rounded-5"
    //                       required >              
    //                       <option value="ford" className="fs-5 Disabled" selected>Selectionner une devise</option>
    //                       <option value="ford" className="fs-6">USD - US Dollas</option>
    //                       <option value="tesla" className="fs-6">GBP - Britich pround</option>
    //                       <option value="toyota" className="fs-6">EUR - Euro</option>      
    //                     </select>    
    //                   </div>
                    
    //                 </CardBody>


    //                 <CardBody className="col-5">
    //                   <div className="mb-1">
    //                     <label for="company_name" class="form-label fs-6 mt-3">Format de la date</label>
    //                     <select
    //                       id="company_name"
    //                       class="form-control bg-light fs-6 p-2 rounded-5"
    //                       required >   
    //                       <option value="ford" className="fs-6 Disabled" selected>Date</option>
    //                       <option value="ford" className="fs-6">11 nov 2026</option>
    //                       <option value="ford" className="fs-6">16/11/26</option>
    //                     </select>  
    //                   </div>

    //                   <div className="mb-1">
    //                     <label for="company_name" class="form-label fs-6 mt-3">Format horaire</label>
    //                     <select
    //                       id="company_name"
    //                       class="form-control bg-light fs-6 p-2 rounded-5"
    //                       required >  
    //                         <option value="ford" className="fs-6 Disabled" selected>Selectionner un format </option>
    //                         <option value="ford" className="fs-6">12:00 - 00:00</option>    
    //                         <option value="ford" className="fs-6">12:00 AM - 00:00 PM</option>    
    //                     </select>    
    //                   </div>

    //                   <div className="mb-1">
    //                     <label for="company_name" class="form-label fs-6 mt-3">Langue</label>
    //                     <select
    //                       id="company_name"
    //                       class="form-control bg-light fs-6 p-2 rounded-5"
    //                       required >              
    //                       <option value="ford" className="fs-6">Anglais</option>
    //                       <option value="tesla" className="fs-6" selected>Français</option>
    //                     </select>    
    //                   </div>
    //                 </CardBody>
                    
    //               </div>
    //                 <div className="text-end mb-1 d-flex justify-content-end me-4" >
    //                   <button type="submit" className="btn btn-secondary w-sm" style={{ borderRadius: '50px'}}>Annuler</button>
    //                   <button type="submit" className="btn btn-success w-sm ms-3" style={{ borderRadius: '50px'}}>Renregister</button>
    //                 </div>
    //             </form>
    //           </Card>
    //        </row>
          

    //     </div>
    //   </div>
    // </React.Fragment>
  );
};

export default Preference;


// <div class="row bg-white d-flex p-2 m-2">
//             <div class="col-6 p-4 ">
//               <h4 class="mb-sm-0 text-black fw-bold">DEVISE</h4>
//               <form action="" method="post">

//               <label for="company_name" class="form-label text-black fs-5 mt-3">Choisir la devise</label>
//               <select
//               id="company_name"
//               class="form-control bg-light fs-5 p-2"
//               required >              
//                 <option value="ford" className="fs-5 Disabled" selected>Selectionner une devise</option>
//                 <option value="ford" className="fs-5">USD - US Dollas</option>
//                 <option value="tesla" className="fs-5">GBP - Britich pround</option>
//                 <option value="toyota" className="fs-5">EUR - Euro</option>      
//               </select>    

//                 <label for="company_name" class="form-label text-black fs-5 mt-3">Choisir la devise</label>
//               <select
//               id="company_name"
//               class="form-control bg-light fs-5 p-2"
//               required >   
//                 <option value="ford" className="fs-5 Disabled" selected>Horaire</option>
//                 <option value="ford" className="fs-5">(UTC+O1) Marseille</option>
//                 <option value="ford" className="fs-5">(UTC+O9) Tokyo</option>    
//               </select> 

//               <label for="company_name" class="form-label text-black fs-5 mt-3">Format horaire</label>
//                 
//               </form>           
//             </div>


    

//             <div class="col-6 p-4">
//               <h4 class="mb-sm-0 text-black fw-bold">LANGUE</h4>
//                 <div class="col-12 p-1 px-3 mt-5 d-flex justify-content-between align-items-center text-align-center bg-light">
//                   <h4 class="mb-sm-0 text-black ">Français</h4>
//                   <div class="form-check form-switch fs-3">
//                     <input class="form-check-input"
//                       type="checkbox"
//                       id="rating_1" />
//                     <label
//                       class="form-check-label"
//                       for="rating_1"
//                       ></label>
//                   </div>                   
//                 </div>

//                 <div class="col-12 p-1 px-3 mt-5 d-flex justify-content-between align-items-center text-align-center bg-light">
//                   <h4 class="mb-sm-0 text-black ">Anglais</h4>
//                   <div class="form-check form-switch fs-3">
//                     <input class="form-check-input"
//                       type="checkbox"
//                       id="rating_1" />
//                     <label
//                       class="form-check-label"
//                       for="rating_1"
//                       ></label>
//                   </div>                    
//                 </div>
//             </div>
            
//         </div>