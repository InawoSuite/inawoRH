// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Card,
//   CardBody,
//   CardHeader,
//   Col,
//   Container,
//   Form,
//   Input,
//   Label,
//   Nav,
//   NavItem,
//   NavLink,
//   Row,
//   TabContent,
//   TabPane,
//   Util,
// } from "reactstrap";
// import classnames from "classnames";
// import Flatpickr from "react-flatpickr";

// //import images
// import progileBg from "../../../../assets/images/profile-bg.jpg";
// import avatar1 from "../../../../assets/images/users/avatar-1.jpg";

// const Abonnement = () => {
//   console.log("Unit");
//   const [activeTab, setActiveTab] = useState("1");

//   const tabChange = (tab) => {
//     if (activeTab !== tab) setActiveTab(tab);
//   };

//   document.title = "Unit Settings | Velzon - React Admin & Dashboard Template";

//   return (
//     <React.Fragment>
//       <div className="main-content" style={{ margin: "0" }}>
//         <div className="page-content">
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-12">
//                 <div className="page-title-box d-sm-flex align-items-center justify-content-between">
//                   <h4 className="mb-sm-0">Unite</h4>

//                   <div className="page-title-right">
//                     <ol className="breadcrumb m-0 ">
//                       <li className="breadcrumb-item">
//                       <a href="#" className="text-decoration-none d-flex fs-6"> <span className="ms-2 me-2"><i class="ri-settings-5-line"></i></span> <span className="ms-1 me-1">&gt;</span>  <span className="ms-1 me-1">Inawo</span>  <span className="ms-1 me-1">&gt;</span>   </a>

//                       </li>
//                       <li className="breadcrumb-item active">Abonnement</li>
//                     </ol>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>




//           <div class="row">
//             <div class="col-lg-12">
//               <div class="card">
//                 <div class="card-header">
//                   <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    

//                   <div class="col-md-4">
//                       <button
//                         class="btn btn-info add-btn"
//                         data-bs-toggle="modal"
//                         data-bs-target="#showModal"
//                         style={{borderRadius: '20px'}}
//                       >
//                         <i class="ri-file-add-line me-1  align-bottom"></i>
//                         Mon abonnement
//                       </button>
//                     </div>


//                     <div class="flex-shrink-0">
//                       <div class="hstack text-nowrap gap-1">

//                       <div class="flex-grow-1">
//                       <button
//                         class="btn btn-info add-btn"
//                         data-bs-toggle="modal"
//                         data-bs-target="#showModal"
//                         style={{borderRadius: '20px'}}
//                       >
//                         <i class="ri-file-add-line me-1  align-bottom"></i>
//                         Ajouter une unité
//                       </button>
//                     </div>

//                     <button
//                         class="btn btn-success add-btn"
//                         data-bs-toggle=""
//                         data-bs-target="#showModal"
//                         style={{borderRadius: '20px'}}
//                       >
//                         <i class="ri-file-upload-line me-1 align-bottom"></i>
//                         Exporter 
//                     </button>
                        
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>





//             <div class="">
//               <div class="card" id="contactList">
                
//                 <div class="card-body">
//                   <div>
//                     <div class="table-responsive table-card mb-3">
//                       <table
//                         class="table align-middle table-nowrap mb-0"
//                         id="customerTable"
//                       >
//                         <thead class="table-light">
//                           <tr>
//                             <th scope="col" style={{ width: "50px" }}>
//                               <div class="form-check">
//                                 <input
//                                   class="form-check-input"
//                                   type="checkbox"
//                                   id="checkAll"
//                                   value="option"
//                                 />
//                               </div>
//                             </th>
//                             <th class="sort" data-sort="name" scope="col">
//                               Nom
//                             </th>
//                             <th
//                               class="sort"
//                               data-sort="company_name"
//                               scope="col"
//                             >
//                               Abreviation
//                             </th>

//                             <th
//                               class="sort"
//                               data-sort="company_name"
//                               scope="col"
//                             >
//                               Sous unité
//                             </th>
//                             <th scope="col">Action</th>
//                           </tr>
//                         </thead>
//                         <tbody class="list form-check-all">
//                           <tr>
//                             <th scope="row">
//                               <div class="form-check">
//                                 <input
//                                   class="form-check-input"
//                                   type="checkbox"
//                                   name="chk_child"
//                                   value="option1"
//                                 />
//                               </div>
//                             </th>
//                             <td class="id" style={{ display: "none" }}>
//                               <a
//                                 href="javascript:void(0);"
//                                 class="fw-medium link-primary"
//                               >
//                                 #VZ001
//                               </a>
//                             </td>
//                             <td class="name">
//                               <div class="d-flex align-items-center">
//                                 <div class="flex-shrink-0">
                           
//                                 </div>
//                                 <div class="flex-grow-1 ms-2 name">Mètre</div>
//                               </div>
//                             </td>
//                             <td class="tags">
//                               <span class="badge bg-primary-subtle text-primary">
//                                 m
//                               </span>
//                             </td>
//                             <td class="tags">
//                               <span class="badge bg-primary-subtle text-primary">
//                                 unit
//                               </span>
//                             </td>

//                             <td>
//                               <ul class="list-inline hstack gap-2 mb-0">
//                                 <li class="list-inline-item">
//                                   <div class="dropdown">
//                                     <button
//                                       class="btn btn-soft-secondary btn-sm dropdown"
//                                       type="button"
//                                       data-bs-toggle="dropdown"
//                                       aria-expanded="false"
//                                     >
//                                       <i class="ri-edit-line"></i>
//                                     </button>
//                                   </div>
//                                 </li>
//                                 <li class="list-inline-item">
//                                   <div class="dropdown">
//                                     <button
//                                       class="btn btn-soft-secondary btn-sm dropdown"
//                                       type="button"
//                                       data-bs-toggle="dropdown"
//                                       aria-expanded="false"
//                                     >
//                                       <i class="ri-delete-bin-6-line"></i>
//                                     </button>
//                                   </div>
//                                 </li>
//                               </ul>
//                             </td>
//                           </tr>

//                           <tr>
//                             <th scope="row">
//                               <div class="form-check">
//                                 <input
//                                   class="form-check-input"
//                                   type="checkbox"
//                                   name="chk_child"
//                                   value="option1"
//                                 />
//                               </div>
//                             </th>
//                             <td class="id" style={{ display: "none" }}>
//                               <a
//                                 href="javascript:void(0);"
//                                 class="fw-medium link-primary"
//                               >
//                                 #VZ001
//                               </a>
//                             </td>
//                             <td class="name">
//                               <div class="d-flex align-items-center">
//                                 <div class="flex-shrink-0">
                                 
//                                 </div>
//                                 <div class="flex-grow-1 ms-2 name">Gramme</div>
//                               </div>
//                             </td>
//                             <td class="tags">
//                               <span class="badge bg-primary-subtle text-primary">
//                                 g
//                               </span>
//                             </td>
//                             <td class="tags">
//                               <span class="badge bg-primary-subtle text-primary">
//                                 unit
//                               </span>
//                             </td>

//                             <td>
//                               <ul class="list-inline hstack gap-2 mb-0">
//                                 <li class="list-inline-item">
//                                   <div class="dropdown">
//                                     <button
//                                       class="btn btn-soft-secondary btn-sm dropdown"
//                                       type="button"
//                                       data-bs-toggle="dropdown"
//                                       aria-expanded="false"
//                                     >
//                                       <i class="ri-edit-line"></i>
//                                     </button>
//                                   </div>
//                                 </li>
//                                 <li class="list-inline-item">
//                                   <div class="dropdown">
//                                     <button
//                                       class="btn btn-soft-secondary btn-sm dropdown"
//                                       type="button"
//                                       data-bs-toggle="dropdown"
//                                       aria-expanded="false"
//                                     >
//                                       <i class="ri-delete-bin-6-line"></i>
//                                     </button>
//                                   </div>
//                                 </li>
//                               </ul>
//                             </td>
//                           </tr>

//                           <tr>
//                             <th scope="row">
//                               <div class="form-check">
//                                 <input
//                                   class="form-check-input"
//                                   type="checkbox"
//                                   name="chk_child"
//                                   value="option1"
//                                 />
//                               </div>
//                             </th>
//                             <td class="id" style={{ display: "none" }}>
//                               <a
//                                 href="javascript:void(0);"
//                                 class="fw-medium link-primary"
//                               >
//                                 #VZ001
//                               </a>
//                             </td>
//                             <td class="name">
//                               <div class="d-flex align-items-center">
//                                 <div class="flex-shrink-0">
                                 
//                                 </div>
//                                 <div class="flex-grow-1 ms-2 name">Gramme</div>
//                               </div>
//                             </td>
//                             <td class="tags">
//                               <span class="badge bg-primary-subtle text-primary">
//                                 g
//                               </span>
//                             </td>
//                             <td class="tags">
//                               <span class="badge bg-primary-subtle text-primary">
//                                 unit
//                               </span>
//                             </td>

//                             <td>
//                               <ul class="list-inline hstack gap-2 mb-0">
//                                 <li class="list-inline-item">
//                                   <div class="dropdown">
//                                     <button
//                                       class="btn btn-soft-secondary btn-sm dropdown"
//                                       type="button"
//                                       data-bs-toggle="dropdown"
//                                       aria-expanded="false"
//                                     >
//                                       <i class="ri-edit-line"></i>
//                                     </button>
//                                   </div>
//                                 </li>
//                                 <li class="list-inline-item">
//                                   <div class="dropdown">
//                                     <button
//                                       class="btn btn-soft-secondary btn-sm dropdown"
//                                       type="button"
//                                       data-bs-toggle="dropdown"
//                                       aria-expanded="false"
//                                     >
//                                       <i class="ri-delete-bin-6-line"></i>
//                                     </button>
//                                   </div>
//                                 </li>
//                               </ul>
//                             </td>
//                           </tr>


                          

//                           <tr>
//                             <th scope="row">
//                               <div class="form-check">
//                                 <input
//                                   class="form-check-input"
//                                   type="checkbox"
//                                   name="chk_child"
//                                   value="option1"
//                                 />
//                               </div>
//                             </th>
//                             <td class="id" style={{ display: "none" }}>
//                               <a
//                                 href="javascript:void(0);"
//                                 class="fw-medium link-primary"
//                               >
//                                 #VZ001
//                               </a>
//                             </td>
//                             <td class="name">
//                               <div class="d-flex align-items-center">
//                                 <div class="flex-shrink-0">
                               
//                                 </div>
//                                 <div class="flex-grow-1 ms-2 name">Litre</div>
//                               </div>
//                             </td>
//                             <td class="tags">
//                               <span class="badge bg-primary-subtle text-primary">
//                                 l
//                               </span>
//                             </td>
//                             <td class="tags">
//                               <span class="badge bg-primary-subtle text-primary">
//                                 unit
//                               </span>
//                             </td>

//                             <td>
//                               <ul class="list-inline hstack gap-2 mb-0">
//                                 <li class="list-inline-item">
//                                   <div class="dropdown">
//                                     <button
//                                       class="btn btn-soft-secondary btn-sm dropdown"
//                                       type="button"
//                                       data-bs-toggle="dropdown"
//                                       aria-expanded="false"
//                                     >
//                                       <i class="ri-edit-line"></i>
//                                     </button>
//                                   </div>
//                                 </li>
//                                 <li class="list-inline-item">
//                                   <div class="dropdown">
//                                     <button
//                                       class="btn btn-soft-secondary btn-sm dropdown"
//                                       type="button"
//                                       data-bs-toggle="dropdown"
//                                       aria-expanded="false"
//                                     >
//                                       <i class="ri-delete-bin-6-line"></i>
//                                     </button>
//                                   </div>
//                                 </li>
//                               </ul>
//                             </td>
//                           </tr>
//                         </tbody>
//                       </table>

//                       <div class="noresult" style={{ display: "none" }}>
//                         <div class="text-center">
//                           <lord-icon
//                             src="https://cdn.lordicon.com/msoeawqm.json"
//                             trigger="loop"
//                             colors="primary:#121331,secondary:#08a88a"
//                             style={{ width: "75px", height: "75px" }}
//                           ></lord-icon>
//                           <h5 class="mt-2">Sorry! No Result Found</h5>
//                           <p class="text-muted mb-0">
//                             We've searched more than 150+ contacts We did not
//                             find any contacts for you search.
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div class="d-flex justify-content-end mt-3">
//                       <div class="pagination-wrap hstack gap-1">
//                       <a class="page-item pagination-next" href="#"  style={{borderRadius: '50px'}}>
//                           Précédant
//                         </a>
//                         <ul class="pagination listjs-pagination mb-0 active"></ul>
//                         <a class="page-item bg-primary text-white pagination-next" href="#"  style={{borderRadius: '50px'}}>
//                           1
//                         </a>
//                         <ul class="pagination listjs-pagination mb-0"></ul>
//                         <a class="page-item pagination-next" href="#"  style={{borderRadius: '50px'}}>
//                           2
//                         </a>
//                         <ul class="pagination listjs-pagination mb-0"></ul>
//                         <a class="page-item pagination-next" href="#"  style={{borderRadius: '50px'}}>
//                           suivant
//                         </a>
                        
//                       </div>
//                     </div>
//                   </div>
//                   <div
//                     class="modal fade"
//                     id="showModal"
//                     tabindex="-1"
//                     aria-labelledby="exampleModalLabel"
//                     aria-hidden="true"
//                   >
//                     <div class="modal-dialog modal-dialog-centered ">
//                       <div class="modal-content border-0 rounded-4">
//                         <div class="modal-header bg-info-subtle p-3 rounded-top-4">
//                           <h5 class="modal-title" id="exampleModalLabel">Ajouter une unité</h5>
//                           <button
//                             type="button"
//                             class="btn-close"
//                             data-bs-dismiss="modal"
//                             aria-label="Close"
//                             id="close-modal"
//                           ></button>
//                         </div>
//                         <form class="tablelist-form" autocomplete="off">
//                           <div class="modal-body">
//                             <input type="hidden" id="id-field" />
//                             <div class="row g-3">
//                               <div class="col-lg-12">
                                
//                                 <div>
//                                   <label for="name-field" class="form-label">
//                                     Nom
//                                   </label>
//                                   <input
//                                     type="text"
//                                     id="customername-field"
//                                     class="form-control"
//                                     placeholder="Entrer le nom de l'unité"
//                                     required
//                                     style={{borderRadius:"20px"}}
//                                   />
//                                 </div>
//                               </div>
//                               <div class="col-lg-12">
//                                 <div>
//                                   <label
//                                     for="company_name-field"
//                                     class="form-label"
//                                   >
//                                     Abbreviation
//                                   </label>
//                                   <input
//                                     type="text"
//                                     id="company_name-field"
//                                     class="form-control"
//                                     placeholder="Entrer une abreviation"
//                                     required
//                                     style={{borderRadius:"20px"}}
//                                   />
//                                 </div>
//                                 </div>

//                                 <div class="col-lg-12">
//                                 <div>
//                                   <label
//                                     for="company_name-field"
//                                     class="form-label"
//                                   >
//                                     Sous unité
//                                   </label>
//                                   <input
//                                     type="text"
//                                     id="company_name-field"
//                                     class="form-control"
//                                     placeholder="Entrer une sous unité"
//                                     required
//                                     style={{borderRadius:"20px"}}
//                                   />
//                                 </div>
//                                 </div>
                              
                              
                              
                            
                                
                             
//                             </div>
//                           </div>
//                           <div class="modal-footer">
//                             <div class="hstack gap-2 justify-content-end">
//                               <button
//                                 type="button"
//                                 class="btn btn-light"
//                                 data-bs-dismiss="modal"
//                                 style={{borderRadius:"20px"}}
//                               >
//                                 Fermer
//                               </button>
//                               <button
//                                 type="submit"
//                                 class="btn btn-success"
//                                 id="add-btn"
//                                 style={{borderRadius:"20px"}}
//                               >
//                                 Ajouter l'unité
//                               </button>
//                             </div>
//                           </div>
//                         </form>
//                       </div>
//                     </div>
//                   </div>

//                   <div
//                     class="modal fade zoomIn"
//                     id="deleteRecordModal"
//                     tabindex="-1"
//                     aria-hidden="true"
//                   >
//                     <div class="modal-dialog modal-dialog-centered">
//                       <div class="modal-content">
//                         <div class="modal-header">
//                           <button
//                             type="button"
//                             class="btn-close"
//                             id="deleteRecord-close"
//                             data-bs-dismiss="modal"
//                             aria-label="Close"
//                             className="btn-close"
//                           ></button>
//                         </div>
//                         <div class="modal-body p-5 text-center">
//                           <lord-icon
//                             src="https://cdn.lordicon.com/gsqxdxog.json"
//                             trigger="loop"
//                             colors="primary:#405189,secondary:#f06548"
//                             style={{ width: "90px", height: "90px" }}
//                           ></lord-icon>
//                           <div class="mt-4 text-center">
//                             <h4 class="fs-semibold">
//                               You are about to delete a contact ?
//                             </h4>
//                             <p class="text-muted fs-14 mb-4 pt-1">
//                               Deleting your contact will remove all of your
//                               information from our database.
//                             </p>
//                             <div class="hstack gap-2 justify-content-center remove">
//                               <button
//                                 class="btn btn-link link-success fw-medium text-decoration-none"
//                                 id="deleteRecord-close"
//                                 data-bs-dismiss="modal"
//                               >
//                                 <i class="ri-close-line me-1 align-middle"></i>{" "}
//                                 Close
//                               </button>
//                               <button class="btn btn-danger" id="delete-record">
//                                 Yes, Delete It!!
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
           
          
//       </div>
//       </div>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Abonnement;
