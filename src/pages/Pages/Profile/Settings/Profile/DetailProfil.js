
// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { createSelector } from "reselect";
// import Revenue from "../../DashboardEcommerce/Revenue";
// import { getProducts as onGetProducts } from "../../../../slices/thunks";
// import PhoneInput from "../../../../Components/ContactDeleteModal/CountryPhoneInput";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import '../../../../App.css';
// import { useTranslation } from 'react-i18next';

// import {
//   Card,
//   CardBody,
//   Col,
//   Container,
//   Row,
//   Modal,
//   Table,
//   Progress,
//   ModalHeader,
//   Form,
//   ModalBody,
//   ModalFooter,
//   Label,
//   Input,
//   FormFeedback,
// } from "reactstrap";
// // import Img2 from "../../../assets/images/companies/img-2.png";
// import TableContainer from "../../../../Components/Common/TableContainer";
// // import ReviewSlider from "../../../Components/Common/ReviewSlider";
// import * as moment from "moment";
// import { useProfile } from "../../../../Components/Hooks/UserHooks";
// import BreadCrumb from "../../../../Components/Common/BreadCrumb";
// import { toast } from "react-toastify";
// // import progileBg from '../../../assets/images/profile-bg.jpg';
// import avatar1 from '../../../../assets/images/users/avatar-1.jpg';
// import smallImage9 from "../../../../assets/images/small/img-9.jpg";
// import dummyImg from "../../../../assets/images/users/user-dummy-img.jpg";
// import { country } from "../../../../common/data";
// import Flatpickr from "react-flatpickr";
// import { RevenueCharts } from "../../../DashboardEcommerce/DashboardEcommerceCharts";
// import ProjectsOverview from "../../DashboardEcommerce/SalesByLocations";
// import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

// const DetailProfil = ({ contactId, switchToList }) => {

//   const { t } = useTranslation();
//   // const { id } = useParams();
//   const navigate = useNavigate();
//   const [modal, setModal] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [order, setOrder] = useState(null);
//   const [contactDetails, setContactDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCategorie, setselectedCategorie] = useState("");
//   const dispatch = useDispatch();
//   const ecomsellerData = createSelector(
//     (state) => state.Ecommerce,
//     (products) => products.products
//   );
//   const products = useSelector(ecomsellerData);

//   const API_CONFIG = {
//     baseURL: "https://inawoapiv3.inawo.pro",
//     defaultHeaders: {
//       "Content-Type": "application/json",
//     },
//   };

//   const [productList, setProductList] = useState([]);

//   const { token, loading: profileLoading, error: profileError } = useProfile();

//   // 2. Ajoutez cette vérification au début de votre composant
//   if (profileError) {
//     console.error("Erreur de profil:", profileError);
//     toast.error("Erreur de chargement du profil utilisateur");
//     navigate("/login"); // Redirige si problème d'authentification
//     return null;
//   }



//   const RenderContactInfo = ({ label, value }) => {
//     if (!value) return null; // Ne rien afficher si la valeur est null/undefined/vide

//     return (
//       <tr className="p-0">
//         <th className="pe-2" style={{ whiteSpace: 'nowrap' }} scope="row">
//           {label}
//         </th>
//         <td className="text-muted ps-0" style={{ width: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>: {value}</td>
//       </tr>
//     );
//   };

//   useEffect(() => {
//     const fetchContactDetails = async () => {
//       if (!contactId || !token) return;

//       try {
//         setLoading(true);
//         const response = await fetch(
//           `https://inawoapiv3.inawo.pro/utilisateurs/contacte/${contactId}/`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         const data = await response.json();
//         setContactDetails(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContactDetails();
//   }, [contactId, token]);



//   // useEffect(() => {
//   //     if (contactDetailsId) {
//   //       fetchContactById(contactDetailsId).then(setContactDetails);
//   //     }
//   //   }, [contactDetailsId]);

//   const handleUpdateContact = async () => {
//     try {
//       setLoading(true);

//       // Log des données avant envoi
//       console.log("Data being sent:", order);

//       const response = await fetch(
//         `https://inawoapiv3.inawo.pro/utilisateurs/contacte/${order.id}/`,
//         {
//           method: 'PUT',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             ...order,
//             // Correction spécifique pour les numéros de téléphone
//             telephone: order.telephone.replace(/\++/g, '+'),
//             telephone2: order.telephone2?.replace(/\++/g, '+') || null
//           })
//         }
//       );

//       const data = await response.json();
//       console.log("API Response:", data); // Log de la réponse

//       if (!response.ok) throw new Error(data.message || "Update failed");

//       setContactDetails(data); // Mise à jour de l'état local
//       setModal(false);
//       toast.success("Contact mis à jour !");

//     } catch (error) {
//       console.error("Update error:", error);
//       toast.error(`Erreur: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePhoneChange = (value, field) => {
//     setOrder(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const validation = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       nom: (order && order.nom) || '',
//       nom_entreprise: (order && order.nom_entreprise) || '',
//       telephone: (order && order.telephone) || '',
//       telephone2: (order && order.telephone2) || '',
//       email: (order && order.email) || '',
//       adresse: (order && order.adresse) || '',
//       date_anniversaire: (order && order.date_anniversaire) || '',
//       site_web: (order && order.site_web) || '',
//       categorie: (order && order.categorie) || '',
//       type_contact: (order && order.type_contact) || '',
//       forme_juridique: (order && order.forme_juridique) || '',
//       capital_social: (order && order.capital_social) || '',
//       num_enreg_legal1: (order && order.num_enreg_legal1) || '',
//       num_enreg_legal2: (order && order.num_enreg_legal2) || '',
//       revenu: (order && order.revenu) || '',
//       commentaire: (order && order.commentaire) || '',
//       photo: (order && order.photo) || null,
//     },
//     validationSchema: Yup.object({
//       nom: Yup.string().required("Veuillez entrer un nom"),
//       nom_entreprise: Yup.string(),
//       telephone: Yup.string()
//         .test('is-valid-phone', 'Numéro invalide', function (value) {
//           if (!value) return true; // Permet les champs vides
//           const strValue = String(value);
//           return strValue.startsWith('+') && strValue.length > 6;
//         }),
//       telephone2: Yup.string()
//         .test('is-valid-phone', 'Numéro invalide', function (value) {
//           if (!value) return true; // Permet les champs vides
//           const strValue = String(value);
//           return strValue.startsWith('+') && strValue.length > 6;
//         }),
//       email: Yup.string().email("Veuillez entrer un email vaide"),
//       adresse: Yup.string(),
//       date_anniversaire: Yup.date()
//         .nullable() // Permet les valeurs null
//         .typeError("Veuillez entrer une date valide")
//         .max(new Date(), "La date ne peut pas être dans le futur")
//         .test(
//           'is-valid-format',
//           'Format de date invalide (YYYY-MM-DD requis)',
//           value => !value || moment(value, 'YYYY-MM-DD', true).isValid()),
//       site_web: Yup.string()
//         .url("Veuillez entrer une URL valide")
//         .nullable(), // Permet de laisser le champ vide
//       categorie: Yup.string().required("Veuillez sélectionner une catégorie"),
//       type_contact: Yup.string().required("Veuillez sélectionner un type de contact"),
//       forme_juridique: Yup.string(), // Optionnel
//       capital_social: Yup.number()
//         .typeError("Veuillez entrer un montant valide")
//         .positive("Le capital doit être un nombre positif"),
//       num_enreg_legal1: Yup.string(),
//       num_enreg_legal2: Yup.string(),
//       revenu: Yup.string(),
//       commentaire: Yup.string(),
//       photo: Yup.mixed()
//         .nullable(),
//     }
//     ),
//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         if (isEdit) {
//           if (!order?.id) {
//             throw new Error("Aucun ID de contact spécifié pour l'édition");
//           }
//           await handleUpdateContact(order.id, values);
//         } else {
//           await handleSave(values);
//         }
//         setModal(false);
//         fetchContacts(); // Rafraîchir la liste si nécessaire
//       } catch (error) {
//         console.error("Erreur:", error);
//         toast.error(error.message || "Erreur lors de l'enregistrement");
//       } finally {
//         setSubmitting(false);
//       }
//     }
//   });

//   const handlePhotoChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();

//     // formData.append('photo', file);
//     if (formData.photo instanceof File) {
//       formDataToSend.append('photo', formData.photo);
//     }

//     try {
//       const response = await fetch(
//         `https://inawoapiv3.inawo.pro/utilisateurs/contacte/${order.id}/upload_photo/`,
//         {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           },
//           body: formData
//         }
//       );

//       const result = await response.json();
//       setOrder(prev => ({ ...prev, photo: result.photo }));
//       toast.success('Photo mise à jour !');
//     } catch (error) {
//       toast.error('Erreur lors du changement de photo');
//     }
//   };

//   const toggle = useCallback(() => {
//     if (modal) {
//       setModal(false);
//       setOrder(null);
//       validation.resetForm(); // Réinitialise le formulaire
//     } else {
//       setModal(true);
//     }
//   }, [modal]);
//   // Fetch products
//   useEffect(() => {
//     if (products && !products.length) {
//       dispatch(onGetProducts());
//     }
//   }, [dispatch, products]);

//   useEffect(() => {
//     setProductList(products);
//   }, [products]);

//   // Columns for the table
//   const columns = useMemo(
//     () => [
//       {
//         header: "#",
//         enableSorting: false,
//         cell: () => {
//           return <input type="checkbox" className="form-check-input" />;
//         },
//       },
//       {
//         header: "Product",
//         accessorKey: "name",
//         enableColumnFilter: false,
//         cell: (cell) => (
//           <>
//             <div className="d-flex align-items-center">
//               <div className="flex-shrink-0 me-3">
//                 <div className="avatar-sm bg-light rounded-circle p-1">
//                   <img
//                     src={
//                       process.env.REACT_APP_API_URL +
//                       "/images/products/" +
//                       cell.row.original.image
//                     }
//                     alt=""
//                     className="img-fluid d-block"
//                   />
//                 </div>
//               </div>
//               <div className="flex-grow-1">
//                 <h5 className="fs-14 mb-1">
//                   <a
//                     href="apps-ecommerce-product-details"
//                     className="text-body"
//                   >
//                     {cell.getValue()}
//                   </a>
//                 </h5>
//                 <p className="text-muted mb-0">
//                   Catégorie:{" "}
//                   <span className="fw-medium">
//                     {cell.row.original.contactDetails?.categorie ||
//                       "Catégorie inconnue"}
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </>
//         ),
//       },
//       {
//         header: "Stock",
//         accessorKey: "stock",
//         enableColumnFilter: false,
//       },
//       {
//         header: "Price",
//         accessorKey: "price",
//         enableColumnFilter: false,
//         cell: (cell) => {
//           return <Price {...cell} />;
//         },
//       },
//       {
//         header: "Orders",
//         accessorKey: "orders",
//         enableColumnFilter: false,
//       },
//       {
//         header: "Rating",
//         accessorKey: "rating",
//         enableColumnFilter: false,
//         cell: (cell) => {
//           return <Rating {...cell} />;
//         },
//       },
//       {
//         header: "Published",
//         accessorKey: "publishedDate",
//         enableColumnFilter: false,
//         cell: (cell) => {
//           return <Published {...cell} />;
//         },
//       },
//       {
//         header: "Action",
//         cell: (cell) => {
//           return (
//             <UncontrolledDropdown>
//               <DropdownToggle
//                 href="#"
//                 className="btn btn-soft-secondary btn-sm"
//                 tag="button"
//               >
//                 <i className="ri-more-fill" />
//               </DropdownToggle>
//               <DropdownMenu className="dropdown-menu-end">
//                 <DropdownItem href="apps-ecommerce-product-details">
//                   <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
//                   View
//                 </DropdownItem>

//                 <DropdownItem href="apps-ecommerce-add-product" >
//                   <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
//                   Edit
//                 </DropdownItem>

//                 <DropdownItem divider />

//                 <DropdownItem
//                   href="#"
//                   data-bs-toggle="modal"
//                   data-bs-target="#removeItemModal"
//                 >
//                   <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
//                   Delete
//                 </DropdownItem>
//               </DropdownMenu>
//             </UncontrolledDropdown>
//           );
//         },
//       },
//     ],
//     []
//   );
//   if (loading) {
//     return <div>Chargement...</div>;
//   }
//   document.title = "Sellers Details | Velzon - React Admin & Dashboard Template";

//   return (
//     <React.Fragment>
      
//         <>
//           <>
//             <BreadCrumb
//               title="&nbsp;Détail Contact"  // &nbsp; avant "Contact"
//               pageTitle={
//                 <>
//                   <i className="ri-contacts-book-line me-1 align-bottom"></i>
//                   &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
//                 </>
//               }
//             />
//           </>
//           <Row>
//             <div className="col-lg-3 mt-lg-2">
//               <div className="d-flex flex-column h-100">
//                 <div class="card overflow-hidden flex-fill" style={{ borderRadius: "20px" }}>
//                   <div>
//                     <img
//                       src={smallImage9}
//                       alt=""
//                       className="img-fluid"
//                     />
//                   </div>
//                   <div class="card-body pt-0 mt-n5">
//                     <div class="text-center">
//                       <div class="profile-user position-relative d-inline-block mx-auto  mb-4">
//                         <img
//                           src={contactDetails?.photo
//                             ? `https://inawoapiv3.inawo.pro${contactDetails.photo}`
//                             : avatar1}
//                           className="rounded-circle avatar-xl img-thumbnail user-profile-image"
//                           alt="user-profile"
//                         />
//                         <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
//                           <input id="profile-img-file-input" type="file" class="profile-img-file-input" />
//                           <label for="profile-img-file-input" class="profile-photo-edit avatar-xs">
//                             <span class="avatar-title rounded-circle bg-light text-body">
//                               <i class="ri-camera-fill"></i>
//                             </span>
//                           </label>
//                         </div>
//                       </div>
//                       <h5 class="fs-16 mb-1">{contactDetails?.nom || "Nom inconnu"}</h5>
//                       <p class="text-muted mb-0">{contactDetails?.type_contact || "Nom inconnu"}</p>
//                     </div>
//                   </div>

//                   <Card>
//                     <CardBody style={{ overflowY: "auto" }}>

//                       <div className="table-responsive">
//                         <Table className="table-borderless mb-0">
//                           <tbody>
//                             <RenderContactInfo label="Nom " value={contactDetails?.nom} />
//                             <RenderContactInfo label="Entreprise" value={contactDetails?.nom_entreprise} />
//                             <RenderContactInfo label="Téléphone" value={contactDetails?.telephone} />
//                             <RenderContactInfo label="Téléphone 2" value={contactDetails?.telephone2} />
//                             <RenderContactInfo label="Email" value={contactDetails?.email} />
//                             <RenderContactInfo label="Adresse" value={contactDetails?.adresse} />
//                             <RenderContactInfo label="Revenu" value={contactDetails?.revenu} />
//                             <RenderContactInfo
//                               label={contactDetails?.categorie === "Particulier" ? "Date anniversaire" : "Date création"}
//                               value={contactDetails?.date_anniversaire ? new Date(contactDetails.date_anniversaire).toLocaleDateString() : null}
//                             />
//                             <RenderContactInfo label="Site web" value={contactDetails?.site_web} />
//                             <RenderContactInfo label="Forme juridique" value={contactDetails?.forme_juridique} />
//                             <RenderContactInfo label="Capital social" value={contactDetails?.capital_social} />
//                             <RenderContactInfo label="Numéro légal 1" value={contactDetails?.num_enreg_legal1} />
//                             <RenderContactInfo label="Numéro légal 2" value={contactDetails?.num_enreg_legal2} />
//                             <RenderContactInfo label="Revenu" value={contactDetails?.revenu} />

//                           </tbody>
//                         </Table>
//                       </div>
//                     </CardBody>
//                   </Card>
//                   <div className="card-body border-top">
//                     <div className="d-flex justify-content-center mb-4 pb-2">
//                       <button
//                         type="button"
//                         className="btn btn-primary"
//                         style={{ borderRadius: "20px" }}
//                         onClick={() => {
//                           setIsEdit(true);
//                           setOrder(contactDetails);
//                           setModal(true);
//                         }}
//                       >
//                         Modifier informations
//                       </button>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>

//             <div className="col-lg-9">
//               <ProjectsOverview />

//               <Row className="g-4 mb-1">
//                 {/* <div className="col-sm-auto">
//                   <div>
//                     <a
//                       href="apps-ecommerce-add-product"
//                       className="btn btn-success" style={{ borderRadius: "20px" }}
//                     >
//                       <i className="ri-add-line align-bottom me-1"></i> Add New
//                     </a>
//                   </div>
//                 </div> */}
//                 <div className="col-sm">
//                   <div className="d-flex justify-content-sm-end">
//                     <div className="search-box ms-2">
//                       <input
//                         style={{ borderRadius: "20px" }}
//                         type="text"
//                         className="form-control"
//                         placeholder="Search Products..."
//                       />
//                       <i className="ri-search-line search-icon"></i>
//                     </div>
//                   </div>
//                 </div>
//               </Row>
//               <Card style={{ borderRadius: "20px" }}>
//                 <CardBody>
//                   <div
//                     className="table-card gridjs-border-none pb-2"
//                   >
//                     <TableContainer
//                       style={{ borderRadius: "20px" }}
//                       columns={columns}
//                       data={(productList || [])}
//                       isGlobalFilter={false}
//                       isAddUserList={false}
//                       customPageSize={10}
//                       divClass="table-responsive"
//                       tableClass="mb-0 table-borderless"
//                       theadClass="table-light text-muted"
//                     />
//                   </div>
//                 </CardBody>
//               </Card>
//               <div className="col-12 text-end">
//                 <button type="reset" onClick={switchToList} className="btn btn-secondary me-2" style={{ borderRadius: "20px" }}>
//                   Retour
//                 </button>
//               </div>
//             </div>

//           </Row>
//         </>
     
//       {/* Modal de modification */}
//       <Modal
//         id="showModal"
//         isOpen={modal}
//         toggle={toggle}
//         centered
//         contentClassName="custom-rounded-modal scrollable-modal-content"
//         modalClassName="scrollable-modal"
//         style={{ overflow: 'visible' }}
//       >
//         <ModalHeader className="bg-light p-3 rounded-top-20" toggle={toggle}

//           style={{
//             borderBottom: 'none' // Supprime la bordure basse si nécessaire
//           }}
//         >
//           Modifier le contact
//         </ModalHeader>
//         <Form className="tablelist-form"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleUpdateContact();
//           }}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//               e.preventDefault();
//             }
//           }}>
//           <ModalBody style={{ overflow: 'visible' }} className="modal-body-scrollable">
//             <Input type="hidden" id="id-field" />
//             <Row className="g-3">
//               <Col lg={12}>
//                 <div className="text-center">
//                   <div className="position-relative d-inline-block">
//                     <div className="position-absolute bottom-0 end-0">
//                       <Label htmlFor="lead-image-input" className="mb-0">
//                         <div className="avatar-xs cursor-pointer">
//                           <div className="avatar-title bg-light border rounded-circle text-muted">
//                             <i className="ri-image-fill"></i>
//                           </div>
//                         </div>
//                       </Label>
//                       <Input
//                         className="form-control d-none"
//                         id="lead-image-input"
//                         type="file"
//                         accept="image/png, image/gif, image/jpeg"
//                         onChange={(e) => {
//                           const file = e.target.files[0];
//                           if (file) {
//                             validation.setFieldValue("photo", file);

//                             const reader = new FileReader();
//                             reader.onload = (event) => {
//                               document.getElementById('lead-img').src = event.target.result;
//                             };
//                             reader.readAsDataURL(file);
//                           }
//                         }}
//                       />

//                     </div>
//                     <div className="avatar-lg p-1">
//                       <div className="avatar-title bg-light rounded-circle">
//                         <img
//                           src={
//                             validation.values.photo instanceof File
//                               ? URL.createObjectURL(validation.values.photo)
//                               : order?.photo
//                                 ? `${API_CONFIG.baseURL}${order.photo}` // Chemin complet depuis l'API
//                                 : dummyImg
//                           }
//                           alt="contact"
//                           id="lead-img"
//                           className="avatar-md rounded-circle object-fit-cover"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <h5 className="fs-13 mt-3">Image du contact</h5>
//                 </div>
//               </Col>
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="type_contact" className="form-label font-size-13">
//                     {t("Type contact")} <span style={{ color: "red" }}>*</span>
//                   </Label>
//                   <Input
//                     className="form-select"
//                     type="select"
//                     id="type_contact"
//                     name="type_contact"
//                     value={validation.values.type_contact}
//                     onChange={(e) => {
//                       validation.handleChange(e);
//                       toggleTab(activeTab, e.target.value); // Synchronise avec l'onglet
//                     }}
//                     onBlur={validation.handleBlur}
//                     invalid={validation.touched.type_contact && validation.errors.type_contact ? true : false}
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                     contentClassName="rounded-modal"
//                   >
//                     <option value="">{t("Sélectionner")}</option>
//                     <option value="Client">{t("Client")}</option>
//                     <option value="Prospect">{t("Prospect")}</option>
//                     <option value="Fournisseur">{t("Fournisseur")}</option>
//                     <option value="Partenaire">{t("Partenaire")}</option>
//                   </Input>
//                   {validation.touched.type_contact && validation.errors.type_contact ? (
//                     <FormFeedback type="invalid">{t(validation.errors.type_contact)}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="categoryinput-choices" className="form-label font-size-13">
//                     {t("Catégorie")} <span style={{ color: "red" }}>*</span>
//                   </Label>
//                   <Input
//                     className="form-select"
//                     type="select"
//                     id="category"
//                     value={validation.values.categorie}
//                     onChange={(e) => {
//                       handleCategoryChange(e); // Appel de la fonction existante
//                       setselectedCategorie(e.target.value); // Mise à jour de l'état local
//                     }}
//                     onBlur={validation.handleBlur}
//                     invalid={validation.touched.categorie && validation.errors.categorie ? true : false}
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                     contentClassName="rounded-modal"
//                   >
//                     <option value="">{t("Sélectionner")}</option>
//                     <option value="Particulier">{t("Particulier")}</option>
//                     <option value="Entreprise">{t("Entreprise")}</option>
//                     <option value="Institution">{t("Institution")}</option>
//                     <option value="Association">{t("Association")}</option>
//                     <option value="Administration">{t("Administration")}</option>
//                     <option value="ONG">{t("ONG")}</option>
//                     <option value="Fondation">{t("Fondation")}</option>
//                     <option value="Groupement d'intérêt économie(GE)">{t("Groupement d'intérêt économie(GE)")}</option>

//                   </Input>
//                   {validation.touched.categorie && validation.errors.categorie ? (
//                     <FormFeedback type="invalid">{t(validation.errors.categorie)}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="name-field" className="form-label">
//                     {selectedCategorie === "Particulier" ? "Nom et Prénom du contact" : "Nom du contact"}
//                     <span style={{ color: "red" }}>*</span>
//                   </Label>
//                   <Input
//                     name="nom"
//                     id="name-field"
//                     className="form-control"
//                     placeholder={selectedCategorie === "Particulier" ? "Entrez le nom et prénom" : "Entrez le nom"}
//                     type="text"
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     value={validation.values.nom || ""}
//                     invalid={validation.touched.nom && validation.errors.nom ? true : false}
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                   />
//                   {validation.touched.nom && validation.errors.nom ? (
//                     <FormFeedback type="invalid">{validation.errors.nom}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="nom_entreprise-field" className="form-label">
//                     Nom de l'entreprise
//                   </Label>
//                   <Input
//                     name="nom_entreprise"
//                     id="nom_entreprise-field"
//                     className="form-control"
//                     placeholder="Ex: Inawo"
//                     type="text"
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     value={validation.values.nom_entreprise || ""}
//                     invalid={
//                       validation.touched.nom_entreprise && validation.errors.nom_entreprise ? true : false
//                     }
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                     contentClassName="rounded-modal"
//                   />
//                   {validation.touched.nom_entreprise && validation.errors.nom_entreprise ? (
//                     <FormFeedback type="invalid">{validation.errors.nom_entreprise}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               <Col lg={6}>
//                 <label>Téléphone</label>
//                 <PhoneInput
//                   className="rounded-phone"
//                   name="telephone"
//                   value={validation.values.telephone || ""}
//                   onChange={(value) => {
//                     const phoneValue = value ? String(value) : "";
//                     validation.setFieldValue("telephone", phoneValue);
//                   }}
//                   countries={country}
//                   defaultCountry="FR"
//                   onBlur={() => validation.setFieldTouched("telephone", true)}
//                 />
//                 {validation.touched.telephone && validation.errors.telephone && (
//                   <div className="text-danger">{validation.errors.telephone}</div>
//                 )}
//               </Col>

//               <Col lg={6}>
//                 <label>Téléphone 2</label>
//                 <PhoneInput
//                   className="rounded-phone"
//                   name="telephone2"
//                   value={validation.values.telephone2 || ""}
//                   onChange={(value) => {
//                     const phoneValue = value ? String(value) : "";
//                     validation.setFieldValue("telephone2", phoneValue);
//                   }}
//                   countries={country}
//                   defaultCountry="FR"
//                   onBlur={() => validation.setFieldTouched("telephone2", true)}
//                 />
//                 {validation.touched.telephone2 && validation.errors.telephone2 && (
//                   <div className="text-danger">{validation.errors.telephone2}</div>
//                 )}
//               </Col>
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="email-field" className="form-label">
//                     Email
//                   </Label>
//                   <Input
//                     name="email"
//                     id="email-field"
//                     className="form-control"
//                     placeholder="Entrez votre email"
//                     type="text"
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     value={validation.values.email || ""}
//                     invalid={
//                       validation.touched.email && validation.errors.email ? true : false
//                     }
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                     contentClassName="rounded-modal"
//                   />
//                   {validation.touched.email && validation.errors.email ? (
//                     <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="address-field" className="form-label">
//                     Adress
//                   </Label>
//                   <Input
//                     name="adresse"
//                     id="address-field"
//                     className="form-control"
//                     placeholder="Entrez votre adresse"
//                     type="text"
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     value={validation.values.adresse || ""}
//                     invalid={
//                       validation.touched.adresse && validation.errors.adresse ? true : false
//                     }
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                     contentClassName="rounded-modal"
//                   />
//                   {validation.touched.adresse && validation.errors.adresse ? (
//                     <FormFeedback type="invalid">{validation.errors.adresse}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>
//               {selectedCategorie !== "ONG" && (
//                 <Col lg={6}>
//                   <div>
//                     <Label htmlFor="revenue-field" className="form-label font-size-13">
//                       {t("Revenue")}
//                     </Label>
//                     <Input
//                       className="form-select"
//                       type="select"
//                       id="revenue-field"
//                       name="revenu" // Ajoutez le nom ici
//                       value={validation.values.revenu || ""}
//                       onChange={validation.handleChange}
//                       onBlur={validation.handleBlur}
//                       invalid={validation.touched.revenu && validation.errors.revenu ? true : false}
//                       style={{ borderRadius: '20px', overflow: 'hidden' }}
//                       contentClassName="rounded-modal"
//                     >
//                       <option value="">{t("Sélectionner")}</option>
//                       <option value="0-100000">{t("0 - 100000")}</option>
//                       <option value="100000-250000">{t("100000 - 250000")}</option>
//                       <option value="250000-500000">{t("250000 - 500000")}</option>
//                       <option value="500000-1000000">{t("500000 - 1000000")}</option>
//                       <option value="1000000-10000000">{t("1000000 - 10000000")}</option>
//                     </Input>
//                     {validation.touched.revenu && validation.errors.revenu ? (
//                       <FormFeedback type="invalid">{t(validation.errors.revenu)}</FormFeedback>
//                     ) : null}
//                   </div>
//                 </Col>
//               )}
//               {/* Conditional Fields */}

//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="date_anniversaire" className="form-label">
//   {selectedCategorie === "Particulier"
//     ? t("Date d'anniversaire")
//     : t("Date de création")}
// </Label>
//                   <Flatpickr
//                     id="date_anniversaire"
//                     className="form-control"
//                     style={{
//                       borderRadius: '20px',
//                       padding: '10px 15px'
//                     }}
//                     options={{
//                       dateFormat: "Y-m-d",
//                       maxDate: new Date(),
//                       static: false,
//                       position: "auto",
//                       appendTo: document.body
//                     }}
//                     value={validation.values.date_anniversaire}
//                     onChange={(date) => validation.setFieldValue("date_anniversaire", date[0])}
//                   />
//                   {validation.touched.date_anniversaire && validation.errors.date_anniversaire ? (
//                     <FormFeedback type="invalid">{validation.errors.date_anniversaire}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               {selectedCategorie !== "Institution" && selectedCategorie !== "Association" && (
//                 <Col lg={6}>
//                   <div>
//                     <Label htmlFor="forme_juridique" className="form-label">
//                       {t("Forme juridique")}
//                     </Label>
//                     <Input
//                       className="form-select"
//                       type="select"
//                       id="forme_juridique"
//                       name="forme_juridique"
//                       value={validation.values.forme_juridique || ""}
//                       onChange={validation.handleChange}
//                       onBlur={validation.handleBlur}
//                       invalid={validation.touched.forme_juridique && validation.errors.forme_juridique ? true : false}
//                       style={{ borderRadius: '20px', overflow: 'hidden' }}
//                     >
//                       <option value="">{t("Sélectionner")}</option>
//                       <option value="Entreprise Individuelle">{t("Entreprise Individuelle")}</option>
//                       <option value="Société à Responsabilité Limitée(SARL)">{t("Société à Responsabilité Limitée(SARL)")}</option>
//                       <option value="Société Unipersonnelle à Responsabilité Limitée(SARL)">{t("Société Unipersonnelle à Responsabilité Limitée(SARL)")}</option>
//                       <option value="Société Anonyme(SA)">{t("Société Anonyme(SA)")}</option>
//                       <option value="Société en Nom Collectif(SNC)">{t("Société en Nom Collectif(SNC)")}</option>
//                       <option value="Société Coopérative">{t("Société Coopérative")}</option>
//                     </Input>
//                     {validation.touched.forme_juridique && validation.errors.forme_juridique ? (
//                       <FormFeedback type="invalid">{t(validation.errors.forme_juridique)}</FormFeedback>
//                     ) : null}
//                   </div>
//                 </Col>
//               )}
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="capital_social" className="form-label">
//                     {t("Capital social")}
//                   </Label>
//                   <Input
//                     type="number"
//                     id="capital_social"
//                     className="form-control"
//                     placeholder="Capital social"
//                     name="capital_social"
//                     value={validation.values.capital_social || ""}
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     invalid={validation.touched.capital_social && validation.errors.capital_social ? true : false}
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                   />
//                   {validation.touched.capital_social && validation.errors.capital_social ? (
//                     <FormFeedback type="invalid">{t(validation.errors.capital_social)}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               {/* Champ pour Numéro légal 1 */}
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="num_enreg_legal1-field" className="form-label">
//                     {t("Numéro légal 1")}
//                   </Label>
//                   <Input
//                     type="text"
//                     id="num_enreg_legal1-field"
//                     name="num_enreg_legal1"
//                     className="form-control"
//                     placeholder="Entrez le numéro légal 1"
//                     value={validation.values.num_enreg_legal1 || ""}
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     invalid={
//                       validation.touched.num_enreg_legal1 && validation.errors.num_enreg_legal1
//                         ? true
//                         : false
//                     }
//                     style={{ borderRadius: "20px", overflow: "hidden" }}
//                   />
//                   {validation.touched.num_enreg_legal1 && validation.errors.num_enreg_legal1 ? (
//                     <FormFeedback type="invalid">{validation.errors.num_enreg_legal1}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               {/* Champ pour Numéro légal 2 (affiché uniquement si la catégorie n'est pas Particulier) */}
//               {selectedCategorie !== "Particulier" && (
//                 <Col lg={6}>
//                   <div>
//                     <Label htmlFor="num_enreg_legal2-field" className="form-label">
//                       {t("Numéro légal 2")}
//                     </Label>
//                     <Input
//                       type="text"
//                       id="num_enreg_legal2-field"
//                       name="num_enreg_legal2"
//                       className="form-control"
//                       placeholder="Entrez le numéro légal 2"
//                       value={validation.values.num_enreg_legal2 || ""}
//                       onChange={validation.handleChange}
//                       onBlur={validation.handleBlur}
//                       invalid={
//                         validation.touched.num_enreg_legal2 && validation.errors.num_enreg_legal2
//                           ? true
//                           : false
//                       }
//                       style={{ borderRadius: "20px", overflow: "hidden" }}
//                     />
//                     {validation.touched.num_enreg_legal2 && validation.errors.num_enreg_legal2 ? (
//                       <FormFeedback type="invalid">{validation.errors.num_enreg_legal2}</FormFeedback>
//                     ) : null}
//                   </div>
//                 </Col>
//               )}
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="website-field" className="form-label">
//                     {["Société", "Entreprise"].includes(selectedCategorie)
//                       ? t("Site web de l'entreprise") // Libellé pour Société ou Entreprise
//                       : t("Site web")}
//                   </Label>
//                   <Input
//                     type="url"
//                     id="website-field"
//                     name="site_web"
//                     className="form-control"
//                     placeholder={
//                       ["Société", "Entreprise"].includes(selectedCategorie)
//                         ? t("https://www.entreprise.com") // Placeholder spécifique
//                         : t("https://example.com") // Placeholder par défaut
//                     }
//                     value={validation.values.site_web || ""}
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     invalid={
//                       validation.touched.site_web && validation.errors.site_web ? true : false
//                     }
//                     style={{ borderRadius: "20px", overflow: "hidden" }}
//                   />
//                   {validation.touched.site_web && validation.errors.site_web ? (
//                     <FormFeedback type="invalid">{t(validation.errors.site_web)}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               <Col lg={12}>
//                 <div className="mb-3">
//                   <Label htmlFor="commentaire-field" className="form-label">
//                     Commentaire
//                   </Label>
//                   <textarea
//                     name="commentaire"
//                     id="commentaire-field"
//                     className="form-control"
//                     rows="3"
//                     placeholder="Ajoutez un commentaire"
//                     onChange={validation.handleChange} // Gère les changements
//                     onBlur={validation.handleBlur} // Gère le blur (perte de focus)
//                     value={validation.values.commentaire || ""} // Lien avec Formik
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                   ></textarea>
//                   {validation.touched.commentaire && validation.errors.commentaire ? (
//                     <FormFeedback type="invalid">{validation.errors.commentaire}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>
//             </Row>
//           </ModalBody>
//           <ModalFooter>
//             <div className="pagination-wrap hstack gap-2 justify-content-end">
//               <button type="button" className="btn btn-light" onClick={() => { setModal(false); }} style={{ borderRadius: '20px', overflow: 'hidden' }}
//                 contentClassName="rounded-modal" > Fermer </button>
//               <button
//                 type="submit"
//                 className="btn btn-success"
//                 style={{ borderRadius: '20px' }}
//                 disabled={loading}
//               >
//                 {loading ? "Enregistrement..." : "Mettre à jour"}
//               </button>
//             </div>
//           </ModalFooter>
//         </Form>
//       </Modal>
//     </React.Fragment>
//   );
// };

// export default DetailProfil;
// ========
// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { createSelector } from "reselect";
// import Revenue from "../../DashboardEcommerce/Revenue";
// import { getProducts as onGetProducts } from "../../../slices/thunks";
// import PhoneInput from "../../../Components/ContactDeleteModal/CountryPhoneInput";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import '../../../App.css';
// import { useTranslation } from 'react-i18next';
// import {
//   Card,
//   CardBody,
//   Col,
//   Container,
//   Row,
//   Modal,
//   Table,
//   Progress,
//   ModalHeader,
//   Form,
//   ModalBody,
//   ModalFooter,
//   Label,
//   Input,
//   FormFeedback,
// } from "reactstrap";
// import TableContainer from "../../../Components/Common/TableContainer";
// import * as moment from "moment";
// import { useProfile } from "../../../Components/Hooks/UserHooks";
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import { toast } from "react-toastify";
// import avatar1 from '../../../assets/images/users/avatar-1.jpg';
// import smallImage9 from "../../../assets/images/small/img-9.jpg";
// import dummyImg from "../../../assets/images/users/user-dummy-img.jpg";
// import { country } from "../../../common/data";
// import Flatpickr from "react-flatpickr";
// import { RevenueCharts } from "../../DashboardEcommerce/DashboardEcommerceCharts";
// import ProjectsOverview from "../../DashboardEcommerce/SalesByLocations";




// const DetailDepartement = ({ departementId, switchToList }) => {

//   const { t } = useTranslation();
//   // const { id } = useParams();
//   const navigate = useNavigate();
//   const [modal, setModal] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [order, setOrder] = useState(null);
//   const [contactDetails, setContactDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCategorie, setselectedCategorie] = useState("");
//   const dispatch = useDispatch();
//   const ecomsellerData = createSelector(
//     (state) => state.Ecommerce,
//     (products) => products.products
//   );
//   const products = useSelector(ecomsellerData);

//   const API_CONFIG = {
//     baseURL: "https://inawoapiv3.inawo.pro",
//     defaultHeaders: {
//       "Content-Type": "application/json",
//     },
//   };

//   const [productList, setProductList] = useState([]);

//   const { token, loading: profileLoading, error: profileError } = useProfile();

//   // 2. Ajoutez cette vérification au début de votre composant
//   if (profileError) {
//     console.error("Erreur de profil:", profileError);
//     toast.error("Erreur de chargement du profil utilisateur");
//     navigate("/login"); // Redirige si problème d'authentification
//     return null;
//   }



//   const RenderContactInfo = ({ label, value }) => {
//     if (!value) return null; // Ne rien afficher si la valeur est null/undefined/vide

//     return (
//       <tr className="p-0">
//         <th className="pe-2" style={{ whiteSpace: 'nowrap' }} scope="row">
//           {label}
//         </th>
//         <td className="text-muted ps-0" style={{ width: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>: {value}</td>
//       </tr>
//     );
//   };

//   useEffect(() => {
//     const fetchContactDetails = async () => {
//       if (!departementId || !token) return;

//       try {
//         setLoading(true);
//         const response = await fetch(
//           `https://inawoapiv3.inawo.pro/stocks/departements/${departementId}/`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         const data = await response.json();
//         setContactDetails(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContactDetails();
//   }, [departementId, token]);



//   // useEffect(() => {
//   //     if (contactDetailsId) {
//   //       fetchContactById(contactDetailsId).then(setContactDetails);
//   //     }
//   //   }, [contactDetailsId]);

//   const handleUpdateContact = async () => {
//     try {
//       setLoading(true);

//       // Log des données avant envoi
//       console.log("Data being sent:", order);

//       const response = await fetch(
//         `https://inawoapiv3.inawo.pro/utilisateurs/contacte/${order.id}/`,
//         {
//           method: 'PUT',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             ...order,
//             // Correction spécifique pour les numéros de téléphone
//             telephone: order.telephone.replace(/\++/g, '+'),
//             telephone2: order.telephone2?.replace(/\++/g, '+') || null
//           })
//         }
//       );

//       const data = await response.json();
//       console.log("API Response:", data); // Log de la réponse

//       if (!response.ok) throw new Error(data.message || "Update failed");

//       setContactDetails(data); // Mise à jour de l'état local
//       setModal(false);
//       toast.success("Contact mis à jour !");

//     } catch (error) {
//       console.error("Update error:", error);
//       toast.error(`Erreur: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePhoneChange = (value, field) => {
//     setOrder(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const validation = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       nom: (order && order.nom) || '',
//       nom_entreprise: (order && order.nom_entreprise) || '',
//       telephone: (order && order.telephone) || '',
//       telephone2: (order && order.telephone2) || '',
//       email: (order && order.email) || '',
//       adresse: (order && order.adresse) || '',
//       date_anniversaire: (order && order.date_anniversaire) || '',
//       site_web: (order && order.site_web) || '',
//       categorie: (order && order.categorie) || '',
//       type_contact: (order && order.type_contact) || '',
//       forme_juridique: (order && order.forme_juridique) || '',
//       capital_social: (order && order.capital_social) || '',
//       num_enreg_legal1: (order && order.num_enreg_legal1) || '',
//       num_enreg_legal2: (order && order.num_enreg_legal2) || '',
//       revenu: (order && order.revenu) || '',
//       commentaire: (order && order.commentaire) || '',
//       photo: (order && order.photo) || null,
//     },
//     validationSchema: Yup.object({
//       nom: Yup.string().required("Veuillez entrer un nom"),
//       nom_entreprise: Yup.string(),
//       telephone: Yup.string()
//         .test('is-valid-phone', 'Numéro invalide', function (value) {
//           if (!value) return true; // Permet les champs vides
//           const strValue = String(value);
//           return strValue.startsWith('+') && strValue.length > 6;
//         }),
//       telephone2: Yup.string()
//         .test('is-valid-phone', 'Numéro invalide', function (value) {
//           if (!value) return true; // Permet les champs vides
//           const strValue = String(value);
//           return strValue.startsWith('+') && strValue.length > 6;
//         }),
//       email: Yup.string().email("Veuillez entrer un email vaide"),
//       adresse: Yup.string(),
//       date_anniversaire: Yup.date()
//         .nullable() // Permet les valeurs null
//         .typeError("Veuillez entrer une date valide")
//         .max(new Date(), "La date ne peut pas être dans le futur")
//         .test(
//           'is-valid-format',
//           'Format de date invalide (YYYY-MM-DD requis)',
//           value => !value || moment(value, 'YYYY-MM-DD', true).isValid()),
//       site_web: Yup.string()
//         .url("Veuillez entrer une URL valide")
//         .nullable(), // Permet de laisser le champ vide
//       categorie: Yup.string().required("Veuillez sélectionner une catégorie"),
//       type_contact: Yup.string().required("Veuillez sélectionner un type de contact"),
//       forme_juridique: Yup.string(), // Optionnel
//       capital_social: Yup.number()
//         .typeError("Veuillez entrer un montant valide")
//         .positive("Le capital doit être un nombre positif"),
//       num_enreg_legal1: Yup.string(),
//       num_enreg_legal2: Yup.string(),
//       revenu: Yup.string(),
//       commentaire: Yup.string(),
//       photo: Yup.mixed()
//         .nullable(),
//     }
//     ),
//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         if (isEdit) {
//           if (!order?.id) {
//             throw new Error("Aucun ID de contact spécifié pour l'édition");
//           }
//           await handleUpdateContact(order.id, values);
//         } else {
//           await handleSave(values);
//         }
//         setModal(false);
//         fetchContacts(); // Rafraîchir la liste si nécessaire
//       } catch (error) {
//         console.error("Erreur:", error);
//         toast.error(error.message || "Erreur lors de l'enregistrement");
//       } finally {
//         setSubmitting(false);
//       }
//     }
//   });

//   const handlePhotoChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();

//     // formData.append('photo', file);
//     if (formData.photo instanceof File) {
//       formDataToSend.append('photo', formData.photo);
//     }

//     try {
//       const response = await fetch(
//         `https://inawoapiv3.inawo.pro/utilisateurs/contacte/${order.id}/upload_photo/`,
//         {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`
//           },
//           body: formData
//         }
//       );

//       const result = await response.json();
//       setOrder(prev => ({ ...prev, photo: result.photo }));
//       toast.success('Photo mise à jour !');
//     } catch (error) {
//       toast.error('Erreur lors du changement de photo');
//     }
//   };

//   const toggle = useCallback(() => {
//     if (modal) {
//       setModal(false);
//       setOrder(null);
//       validation.resetForm(); // Réinitialise le formulaire
//     } else {
//       setModal(true);
//     }
//   }, [modal]);
//   // Fetch products
//   useEffect(() => {
//     if (products && !products.length) {
//       dispatch(onGetProducts());
//     }
//   }, [dispatch, products]);

//   useEffect(() => {
//     setProductList(products);
//   }, [products]);

//   // Columns for the table
//   const columns = useMemo(
//     () => [
//       {
//         header: "#",
//         enableSorting: false,
//         cell: () => {
//           return <input type="checkbox" className="form-check-input" />;
//         },
//       },
//       {
//         header: "Product",
//         accessorKey: "name",
//         enableColumnFilter: false,
//         cell: (cell) => (
//           <>
//             <div className="d-flex align-items-center">
//               <div className="flex-shrink-0 me-3">
//                 <div className="avatar-sm bg-light rounded-circle p-1">
//                   <img
//                     src={
//                       process.env.REACT_APP_API_URL +
//                       "/images/products/" +
//                       cell.row.original.image
//                     }
//                     alt=""
//                     className="img-fluid d-block"
//                   />
//                 </div>
//               </div>
//               <div className="flex-grow-1">
//                 <h5 className="fs-14 mb-1">
//                   <a
//                     href="apps-ecommerce-product-details"
//                     className="text-body"
//                   >
//                     {cell.getValue()}
//                   </a>
//                 </h5>
//                 <p className="text-muted mb-0">
//                   Catégorie:{" "}
//                   <span className="fw-medium">
//                     {cell.row.original.contactDetails?.categorie ||
//                       "Catégorie inconnue"}
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </>
//         ),
//       },
//       {
//         header: "Stock",
//         accessorKey: "stock",
//         enableColumnFilter: false,
//       },
//       {
//         header: "Price",
//         accessorKey: "price",
//         enableColumnFilter: false,
//         cell: (cell) => {
//           return <Price {...cell} />;
//         },
//       },
//       {
//         header: "Orders",
//         accessorKey: "orders",
//         enableColumnFilter: false,
//       },
//       {
//         header: "Rating",
//         accessorKey: "rating",
//         enableColumnFilter: false,
//         cell: (cell) => {
//           return <Rating {...cell} />;
//         },
//       },
//       {
//         header: "Published",
//         accessorKey: "publishedDate",
//         enableColumnFilter: false,
//         cell: (cell) => {
//           return <Published {...cell} />;
//         },
//       },
//       {
//         header: "Action",
//         cell: (cell) => {
//           return (
//             <UncontrolledDropdown>
//               <DropdownToggle
//                 href="#"
//                 className="btn btn-soft-secondary btn-sm"
//                 tag="button"
//               >
//                 <i className="ri-more-fill" />
//               </DropdownToggle>
//               <DropdownMenu className="dropdown-menu-end">
//                 <DropdownItem href="apps-ecommerce-product-details">
//                   <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
//                   View
//                 </DropdownItem>

//                 <DropdownItem href="apps-ecommerce-add-product" >
//                   <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
//                   Edit
//                 </DropdownItem>

//                 <DropdownItem divider />

//                 <DropdownItem
//                   href="#"
//                   data-bs-toggle="modal"
//                   data-bs-target="#removeItemModal"
//                 >
//                   <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
//                   Delete
//                 </DropdownItem>
//               </DropdownMenu>
//             </UncontrolledDropdown>
//           );
//         },
//       },
//     ],
//     []
//   );
//   if (loading) {
//     return <div>Chargement...</div>;
//   }
//   document.title = "Sellers Details | Velzon - React Admin & Dashboard Template";

//   return (
//     <React.Fragment>
      
//         <>
//           <>
//             <BreadCrumb
//               title="&nbsp;Détail Contact"  // &nbsp; avant "Contact"
//               pageTitle={
//                 <>
//                   <i className="ri-contacts-book-line me-1 align-bottom"></i>
//                   &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
//                 </>
//               }
//             />
//           </>
//           <Row>
//             <div className="col-xxl-3 mt-xxl-2">
//               <div className="d-flex flex-column h-100">
//                 <div class="card overflow-hidden flex-fill" style={{ borderRadius: "20px" }}>
//                   <div>
//                     <img
//                       src={smallImage9}
//                       alt=""
//                       className="img-fluid"
//                     />
//                   </div>
//                   <div class="card-body pt-0 mt-n5">
//                     <div class="text-center">
//                       <div class="profile-user position-relative d-inline-block mx-auto  mb-4">
//                         <img
//                           src={contactDetails?.photo
//                             ? `https://inawoapiv3.inawo.pro${contactDetails.photo}`
//                             : avatar1}
//                           className="rounded-circle avatar-xl img-thumbnail user-profile-image"
//                           alt="user-profile"
//                         />
//                         <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
//                           <input id="profile-img-file-input" type="file" class="profile-img-file-input" />
//                           <label for="profile-img-file-input" class="profile-photo-edit avatar-xs">
//                             <span class="avatar-title rounded-circle bg-light text-body">
//                               <i class="ri-camera-fill"></i>
//                             </span>
//                           </label>
//                         </div>
//                       </div>
//                       <h5 class="fs-16 mb-1">{contactDetails?.nom || "Nom inconnu"}</h5>
//                       <p class="text-muted mb-0">{contactDetails?.type_contact || "Nom inconnu"}</p>
//                     </div>
//                   </div>

//                   <Card>
//                     <CardBody style={{ overflowY: "auto" }}>

//                       <div className="table-responsive">
//                         <Table className="table-borderless mb-0">
//                           <tbody>
//                             <RenderContactInfo label="Nom " value={contactDetails?.nom} />
//                             <RenderContactInfo label="Entreprise" value={contactDetails?.nom_entreprise} />
//                             <RenderContactInfo label="Téléphone" value={contactDetails?.telephone} />
//                             <RenderContactInfo label="Téléphone 2" value={contactDetails?.telephone2} />
//                             <RenderContactInfo label="Email" value={contactDetails?.email} />
//                             <RenderContactInfo label="Adresse" value={contactDetails?.adresse} />
//                             <RenderContactInfo label="Revenu" value={contactDetails?.revenu} />
//                             <RenderContactInfo
//                               label={contactDetails?.categorie === "Particulier" ? "Date anniversaire" : "Date création"}
//                               value={contactDetails?.date_anniversaire ? new Date(contactDetails.date_anniversaire).toLocaleDateString() : null}
//                             />
//                             <RenderContactInfo label="Site web" value={contactDetails?.site_web} />
//                             <RenderContactInfo label="Forme juridique" value={contactDetails?.forme_juridique} />
//                             <RenderContactInfo label="Capital social" value={contactDetails?.capital_social} />
//                             <RenderContactInfo label="Numéro légal 1" value={contactDetails?.num_enreg_legal1} />
//                             <RenderContactInfo label="Numéro légal 2" value={contactDetails?.num_enreg_legal2} />
//                             <RenderContactInfo label="Revenu" value={contactDetails?.revenu} />

//                           </tbody>
//                         </Table>
//                       </div>
//                     </CardBody>
//                   </Card>
//                   <div className="card-body border-top">
//                     <div className="d-flex justify-content-center mb-4 pb-2">
//                       <button
//                         type="button"
//                         className="btn btn-primary"
//                         style={{ borderRadius: "20px" }}
//                         onClick={() => {
//                           setIsEdit(true);
//                           setOrder(contactDetails);
//                           setModal(true);
//                         }}
//                       >
//                         Modifier informations
//                       </button>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>

//             <div className="col-xxl-9">
//               <ProjectsOverview />

//               <Row className="g-4 mb-1">
//                 {/* <div className="col-sm-auto">
//                   <div>
//                     <a
//                       href="apps-ecommerce-add-product"
//                       className="btn btn-success" style={{ borderRadius: "20px" }}
//                     >
//                       <i className="ri-add-line align-bottom me-1"></i> Add New
//                     </a>
//                   </div>
//                 </div> */}
//                 <div className="col-sm">
//                   <div className="d-flex justify-content-sm-end">
//                     <div className="search-box ms-2">
//                       <input
//                         style={{ borderRadius: "20px" }}
//                         type="text"
//                         className="form-control"
//                         placeholder="Search Products..."
//                       />
//                       <i className="ri-search-line search-icon"></i>
//                     </div>
//                   </div>
//                 </div>
//               </Row>
//               <Card style={{ borderRadius: "20px" }}>
//                 <CardBody>
//                   <div
//                     className="table-card gridjs-border-none pb-2"
//                   >
//                     <TableContainer
//                       style={{ borderRadius: "20px" }}
//                       columns={columns}
//                       data={(productList || [])}
//                       isGlobalFilter={false}
//                       isAddUserList={false}
//                       customPageSize={10}
//                       divClass="table-responsive"
//                       tableClass="mb-0 table-borderless"
//                       theadClass="table-light text-muted"
//                     />
//                   </div>
//                 </CardBody>
//               </Card>
//               <div className="col-12 text-end">
//                 <button type="reset" onClick={switchToList} className="btn btn-secondary me-2" style={{ borderRadius: "20px" }}>
//                   Retour
//                 </button>
//               </div>
//             </div>

//           </Row>
//         </>
     
//       {/* Modal de modification */}
//       <Modal
//         id="showModal"
//         isOpen={modal}
//         toggle={toggle}
//         centered
//         contentClassName="custom-rounded-modal scrollable-modal-content"
//         modalClassName="scrollable-modal"
//         style={{ overflow: 'visible' }}
//       >
//         <ModalHeader className="bg-light p-3 rounded-top-20" toggle={toggle}

//           style={{
//             borderBottom: 'none' // Supprime la bordure basse si nécessaire
//           }}
//         >
//           Modifier le contact
//         </ModalHeader>
//         <Form className="tablelist-form"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleUpdateContact();
//           }}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') {
//               e.preventDefault();
//             }
//           }}>
//           <ModalBody style={{ overflow: 'visible' }} className="modal-body-scrollable">
//             <Input type="hidden" id="id-field" />
//             <Row className="g-3">
//               <Col lg={12}>
//                 <div className="text-center">
//                   <div className="position-relative d-inline-block">
//                     <div className="position-absolute bottom-0 end-0">
//                       <Label htmlFor="lead-image-input" className="mb-0">
//                         <div className="avatar-xs cursor-pointer">
//                           <div className="avatar-title bg-light border rounded-circle text-muted">
//                             <i className="ri-image-fill"></i>
//                           </div>
//                         </div>
//                       </Label>
//                       <Input
//                         className="form-control d-none"
//                         id="lead-image-input"
//                         type="file"
//                         accept="image/png, image/gif, image/jpeg"
//                         onChange={(e) => {
//                           const file = e.target.files[0];
//                           if (file) {
//                             validation.setFieldValue("photo", file);

//                             const reader = new FileReader();
//                             reader.onload = (event) => {
//                               document.getElementById('lead-img').src = event.target.result;
//                             };
//                             reader.readAsDataURL(file);
//                           }
//                         }}
//                       />

//                     </div>
//                     <div className="avatar-lg p-1">
//                       <div className="avatar-title bg-light rounded-circle">
//                         <img
//                           src={
//                             validation.values.photo instanceof File
//                               ? URL.createObjectURL(validation.values.photo)
//                               : order?.photo
//                                 ? `${API_CONFIG.baseURL}${order.photo}` // Chemin complet depuis l'API
//                                 : dummyImg
//                           }
//                           alt="contact"
//                           id="lead-img"
//                           className="avatar-md rounded-circle object-fit-cover"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <h5 className="fs-13 mt-3">Image du contact</h5>
//                 </div>
//               </Col>
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="type_contact" className="form-label font-size-13">
//                     {t("Type contact")} <span style={{ color: "red" }}>*</span>
//                   </Label>
//                   <Input
//                     className="form-select"
//                     type="select"
//                     id="type_contact"
//                     name="type_contact"
//                     value={validation.values.type_contact}
//                     onChange={(e) => {
//                       validation.handleChange(e);
//                       toggleTab(activeTab, e.target.value); // Synchronise avec l'onglet
//                     }}
//                     onBlur={validation.handleBlur}
//                     invalid={validation.touched.type_contact && validation.errors.type_contact ? true : false}
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                     contentClassName="rounded-modal"
//                   >
//                     <option value="">{t("Sélectionner")}</option>
//                     <option value="Client">{t("Client")}</option>
//                     <option value="Prospect">{t("Prospect")}</option>
//                     <option value="Fournisseur">{t("Fournisseur")}</option>
//                     <option value="Partenaire">{t("Partenaire")}</option>
//                   </Input>
//                   {validation.touched.type_contact && validation.errors.type_contact ? (
//                     <FormFeedback type="invalid">{t(validation.errors.type_contact)}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="categoryinput-choices" className="form-label font-size-13">
//                     {t("Catégorie")} <span style={{ color: "red" }}>*</span>
//                   </Label>
//                   <Input
//                     className="form-select"
//                     type="select"
//                     id="category"
//                     value={validation.values.categorie}
//                     onChange={(e) => {
//                       handleCategoryChange(e); // Appel de la fonction existante
//                       setselectedCategorie(e.target.value); // Mise à jour de l'état local
//                     }}
//                     onBlur={validation.handleBlur}
//                     invalid={validation.touched.categorie && validation.errors.categorie ? true : false}
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                     contentClassName="rounded-modal"
//                   >
//                     <option value="">{t("Sélectionner")}</option>
//                     <option value="Particulier">{t("Particulier")}</option>
//                     <option value="Entreprise">{t("Entreprise")}</option>
//                     <option value="Institution">{t("Institution")}</option>
//                     <option value="Association">{t("Association")}</option>
//                     <option value="Administration">{t("Administration")}</option>
//                     <option value="ONG">{t("ONG")}</option>
//                     <option value="Fondation">{t("Fondation")}</option>
//                     <option value="Groupement d'intérêt économie(GE)">{t("Groupement d'intérêt économie(GE)")}</option>

//                   </Input>
//                   {validation.touched.categorie && validation.errors.categorie ? (
//                     <FormFeedback type="invalid">{t(validation.errors.categorie)}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="name-field" className="form-label">
//                     {selectedCategorie === "Particulier" ? "Nom et Prénom du contact" : "Nom du contact"}
//                     <span style={{ color: "red" }}>*</span>
//                   </Label>
//                   <Input
//                     name="nom"
//                     id="name-field"
//                     className="form-control"
//                     placeholder={selectedCategorie === "Particulier" ? "Entrez le nom et prénom" : "Entrez le nom"}
//                     type="text"
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     value={validation.values.nom || ""}
//                     invalid={validation.touched.nom && validation.errors.nom ? true : false}
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                   />
//                   {validation.touched.nom && validation.errors.nom ? (
//                     <FormFeedback type="invalid">{validation.errors.nom}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="nom_entreprise-field" className="form-label">
//                     Nom de l'entreprise
//                   </Label>
//                   <Input
//                     name="nom_entreprise"
//                     id="nom_entreprise-field"
//                     className="form-control"
//                     placeholder="Ex: Inawo"
//                     type="text"
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     value={validation.values.nom_entreprise || ""}
//                     invalid={
//                       validation.touched.nom_entreprise && validation.errors.nom_entreprise ? true : false
//                     }
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                     contentClassName="rounded-modal"
//                   />
//                   {validation.touched.nom_entreprise && validation.errors.nom_entreprise ? (
//                     <FormFeedback type="invalid">{validation.errors.nom_entreprise}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               <Col lg={6}>
//                 <label>Téléphone</label>
//                 <PhoneInput
//                   className="rounded-phone"
//                   name="telephone"
//                   value={validation.values.telephone || ""}
//                   onChange={(value) => {
//                     const phoneValue = value ? String(value) : "";
//                     validation.setFieldValue("telephone", phoneValue);
//                   }}
//                   countries={country}
//                   defaultCountry="FR"
//                   onBlur={() => validation.setFieldTouched("telephone", true)}
//                 />
//                 {validation.touched.telephone && validation.errors.telephone && (
//                   <div className="text-danger">{validation.errors.telephone}</div>
//                 )}
//               </Col>

//               <Col lg={6}>
//                 <label>Téléphone 2</label>
//                 <PhoneInput
//                   className="rounded-phone"
//                   name="telephone2"
//                   value={validation.values.telephone2 || ""}
//                   onChange={(value) => {
//                     const phoneValue = value ? String(value) : "";
//                     validation.setFieldValue("telephone2", phoneValue);
//                   }}
//                   countries={country}
//                   defaultCountry="FR"
//                   onBlur={() => validation.setFieldTouched("telephone2", true)}
//                 />
//                 {validation.touched.telephone2 && validation.errors.telephone2 && (
//                   <div className="text-danger">{validation.errors.telephone2}</div>
//                 )}
//               </Col>
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="email-field" className="form-label">
//                     Email
//                   </Label>
//                   <Input
//                     name="email"
//                     id="email-field"
//                     className="form-control"
//                     placeholder="Entrez votre email"
//                     type="text"
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     value={validation.values.email || ""}
//                     invalid={
//                       validation.touched.email && validation.errors.email ? true : false
//                     }
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                     contentClassName="rounded-modal"
//                   />
//                   {validation.touched.email && validation.errors.email ? (
//                     <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="address-field" className="form-label">
//                     Adress
//                   </Label>
//                   <Input
//                     name="adresse"
//                     id="address-field"
//                     className="form-control"
//                     placeholder="Entrez votre adresse"
//                     type="text"
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     value={validation.values.adresse || ""}
//                     invalid={
//                       validation.touched.adresse && validation.errors.adresse ? true : false
//                     }
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                     contentClassName="rounded-modal"
//                   />
//                   {validation.touched.adresse && validation.errors.adresse ? (
//                     <FormFeedback type="invalid">{validation.errors.adresse}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>
//               {selectedCategorie !== "ONG" && (
//                 <Col lg={6}>
//                   <div>
//                     <Label htmlFor="revenue-field" className="form-label font-size-13">
//                       {t("Revenue")}
//                     </Label>
//                     <Input
//                       className="form-select"
//                       type="select"
//                       id="revenue-field"
//                       name="revenu" // Ajoutez le nom ici
//                       value={validation.values.revenu || ""}
//                       onChange={validation.handleChange}
//                       onBlur={validation.handleBlur}
//                       invalid={validation.touched.revenu && validation.errors.revenu ? true : false}
//                       style={{ borderRadius: '20px', overflow: 'hidden' }}
//                       contentClassName="rounded-modal"
//                     >
//                       <option value="">{t("Sélectionner")}</option>
//                       <option value="0-100000">{t("0 - 100000")}</option>
//                       <option value="100000-250000">{t("100000 - 250000")}</option>
//                       <option value="250000-500000">{t("250000 - 500000")}</option>
//                       <option value="500000-1000000">{t("500000 - 1000000")}</option>
//                       <option value="1000000-10000000">{t("1000000 - 10000000")}</option>
//                     </Input>
//                     {validation.touched.revenu && validation.errors.revenu ? (
//                       <FormFeedback type="invalid">{t(validation.errors.revenu)}</FormFeedback>
//                     ) : null}
//                   </div>
//                 </Col>
//               )}
//               {/* Conditional Fields */}

//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="date_anniversaire" className="form-label">
//   {selectedCategorie === "Particulier"
//     ? t("Date d'anniversaire")
//     : t("Date de création")}
// </Label>
//                   <Flatpickr
//                     id="date_anniversaire"
//                     className="form-control"
//                     style={{
//                       borderRadius: '20px',
//                       padding: '10px 15px'
//                     }}
//                     options={{
//                       dateFormat: "Y-m-d",
//                       maxDate: new Date(),
//                       static: false,
//                       position: "auto",
//                       appendTo: document.body
//                     }}
//                     value={validation.values.date_anniversaire}
//                     onChange={(date) => validation.setFieldValue("date_anniversaire", date[0])}
//                   />
//                   {validation.touched.date_anniversaire && validation.errors.date_anniversaire ? (
//                     <FormFeedback type="invalid">{validation.errors.date_anniversaire}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               {selectedCategorie !== "Institution" && selectedCategorie !== "Association" && (
//                 <Col lg={6}>
//                   <div>
//                     <Label htmlFor="forme_juridique" className="form-label">
//                       {t("Forme juridique")}
//                     </Label>
//                     <Input
//                       className="form-select"
//                       type="select"
//                       id="forme_juridique"
//                       name="forme_juridique"
//                       value={validation.values.forme_juridique || ""}
//                       onChange={validation.handleChange}
//                       onBlur={validation.handleBlur}
//                       invalid={validation.touched.forme_juridique && validation.errors.forme_juridique ? true : false}
//                       style={{ borderRadius: '20px', overflow: 'hidden' }}
//                     >
//                       <option value="">{t("Sélectionner")}</option>
//                       <option value="Entreprise Individuelle">{t("Entreprise Individuelle")}</option>
//                       <option value="Société à Responsabilité Limitée(SARL)">{t("Société à Responsabilité Limitée(SARL)")}</option>
//                       <option value="Société Unipersonnelle à Responsabilité Limitée(SARL)">{t("Société Unipersonnelle à Responsabilité Limitée(SARL)")}</option>
//                       <option value="Société Anonyme(SA)">{t("Société Anonyme(SA)")}</option>
//                       <option value="Société en Nom Collectif(SNC)">{t("Société en Nom Collectif(SNC)")}</option>
//                       <option value="Société Coopérative">{t("Société Coopérative")}</option>
//                     </Input>
//                     {validation.touched.forme_juridique && validation.errors.forme_juridique ? (
//                       <FormFeedback type="invalid">{t(validation.errors.forme_juridique)}</FormFeedback>
//                     ) : null}
//                   </div>
//                 </Col>
//               )}
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="capital_social" className="form-label">
//                     {t("Capital social")}
//                   </Label>
//                   <Input
//                     type="number"
//                     id="capital_social"
//                     className="form-control"
//                     placeholder="Capital social"
//                     name="capital_social"
//                     value={validation.values.capital_social || ""}
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     invalid={validation.touched.capital_social && validation.errors.capital_social ? true : false}
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                   />
//                   {validation.touched.capital_social && validation.errors.capital_social ? (
//                     <FormFeedback type="invalid">{t(validation.errors.capital_social)}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               {/* Champ pour Numéro légal 1 */}
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="num_enreg_legal1-field" className="form-label">
//                     {t("Numéro légal 1")}
//                   </Label>
//                   <Input
//                     type="text"
//                     id="num_enreg_legal1-field"
//                     name="num_enreg_legal1"
//                     className="form-control"
//                     placeholder="Entrez le numéro légal 1"
//                     value={validation.values.num_enreg_legal1 || ""}
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     invalid={
//                       validation.touched.num_enreg_legal1 && validation.errors.num_enreg_legal1
//                         ? true
//                         : false
//                     }
//                     style={{ borderRadius: "20px", overflow: "hidden" }}
//                   />
//                   {validation.touched.num_enreg_legal1 && validation.errors.num_enreg_legal1 ? (
//                     <FormFeedback type="invalid">{validation.errors.num_enreg_legal1}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               {/* Champ pour Numéro légal 2 (affiché uniquement si la catégorie n'est pas Particulier) */}
//               {selectedCategorie !== "Particulier" && (
//                 <Col lg={6}>
//                   <div>
//                     <Label htmlFor="num_enreg_legal2-field" className="form-label">
//                       {t("Numéro légal 2")}
//                     </Label>
//                     <Input
//                       type="text"
//                       id="num_enreg_legal2-field"
//                       name="num_enreg_legal2"
//                       className="form-control"
//                       placeholder="Entrez le numéro légal 2"
//                       value={validation.values.num_enreg_legal2 || ""}
//                       onChange={validation.handleChange}
//                       onBlur={validation.handleBlur}
//                       invalid={
//                         validation.touched.num_enreg_legal2 && validation.errors.num_enreg_legal2
//                           ? true
//                           : false
//                       }
//                       style={{ borderRadius: "20px", overflow: "hidden" }}
//                     />
//                     {validation.touched.num_enreg_legal2 && validation.errors.num_enreg_legal2 ? (
//                       <FormFeedback type="invalid">{validation.errors.num_enreg_legal2}</FormFeedback>
//                     ) : null}
//                   </div>
//                 </Col>
//               )}
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="website-field" className="form-label">
//                     {["Société", "Entreprise"].includes(selectedCategorie)
//                       ? t("Site web de l'entreprise") // Libellé pour Société ou Entreprise
//                       : t("Site web")}
//                   </Label>
//                   <Input
//                     type="url"
//                     id="website-field"
//                     name="site_web"
//                     className="form-control"
//                     placeholder={
//                       ["Société", "Entreprise"].includes(selectedCategorie)
//                         ? t("https://www.entreprise.com") // Placeholder spécifique
//                         : t("https://example.com") // Placeholder par défaut
//                     }
//                     value={validation.values.site_web || ""}
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     invalid={
//                       validation.touched.site_web && validation.errors.site_web ? true : false
//                     }
//                     style={{ borderRadius: "20px", overflow: "hidden" }}
//                   />
//                   {validation.touched.site_web && validation.errors.site_web ? (
//                     <FormFeedback type="invalid">{t(validation.errors.site_web)}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>

//               <Col lg={12}>
//                 <div className="mb-3">
//                   <Label htmlFor="commentaire-field" className="form-label">
//                     Commentaire
//                   </Label>
//                   <textarea
//                     name="commentaire"
//                     id="commentaire-field"
//                     className="form-control"
//                     rows="3"
//                     placeholder="Ajoutez un commentaire"
//                     onChange={validation.handleChange} // Gère les changements
//                     onBlur={validation.handleBlur} // Gère le blur (perte de focus)
//                     value={validation.values.commentaire || ""} // Lien avec Formik
//                     style={{ borderRadius: '20px', overflow: 'hidden' }}
//                   ></textarea>
//                   {validation.touched.commentaire && validation.errors.commentaire ? (
//                     <FormFeedback type="invalid">{validation.errors.commentaire}</FormFeedback>
//                   ) : null}
//                 </div>
//               </Col>
//             </Row>
//           </ModalBody>
//           <ModalFooter>
//             <div className="pagination-wrap hstack gap-2 justify-content-end">
//               <button type="button" className="btn btn-light" onClick={() => { setModal(false); }} style={{ borderRadius: '20px', overflow: 'hidden' }}
//                 contentClassName="rounded-modal" > Fermer </button>
//               <button
//                 type="submit"
//                 className="btn btn-success"
//                 style={{ borderRadius: '20px' }}
//                 disabled={loading}
//               >
//                 {loading ? "Enregistrement..." : "Mettre à jour"}
//               </button>
//             </div>
//           </ModalFooter>
//         </Form>
//       </Modal>
//     </React.Fragment>
//   );
// };

// export default DetailDepartement;


  {/* <TabPane tabId="2">
                        <Form onSubmit={handleVerifEmail}>
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Label htmlFor="emailResetInput" className="form-label">
                                  Email
                                </Label>
                                {state.loading ? (
                                  <div className="placeholder-glow">
                                    <span className="placeholder col-12" style={{ height: "38px", borderRadius: "20px" }}></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="emailResetInput"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email non renseigné"
                                    style={{ borderRadius: "20px" }}
                                    disabled
                                  />
                                )}
                              </div>
                            </Col>
                            <Col lg={6}>
                              <Button
                                type="submit"
                                className="form-control rounded-pill btn w-100 text-white"
                                style={{
                                  backgroundColor: "#014a92",
                                  borderColor: "#014a92",
                                  marginTop: "28px",
                                }}
                                disabled={loading || state.loading || !email}
                                onMouseEnter={(e) => {
                                  if (!e.target.disabled) {
                                    e.target.style.backgroundColor = "#007bff";
                                    e.target.style.borderColor = "#007bff";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!e.target.disabled) {
                                    e.target.style.backgroundColor = "#014a92";
                                    e.target.style.borderColor = "#014a92";
                                  }
                                }}
                              >
                                {loading ? (
                                  <div
                                    className="spinner-border spinner-border-sm text-light"
                                    role="status"
                                  >
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </div>
                                ) : state.loading ? (
                                  "Chargement..."
                                ) : (
                                  "M'envoyer un email"
                                )}
                              </Button>
                            </Col>
                          </Row>
                          {/* Texte descriptif */}
                      //     <div className="mt-3">
                      //       <p
                      //         style={{ fontSize: "12px" }}
                      //         className="text-muted small text-center"
                      //       >
                      //         <i className="ri-information-line me-1"></i>
                      //         Cliquez sur le bouton ci-dessus pour recevoir un
                      //         email contenant un lien de réinitialisation de
                      //         votre mot de passe.
                      //       </p>
                      //     </div>
                      //   </Form>
                      // </TabPane> */}
