// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { createSelector } from "reselect";
// import { getProducts as onGetProducts } from "../../../slices/thunks";
// import PhoneInput from "../../../Components/ContactDeleteModal/CountryPhoneInput";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import '../../../App.css';
// import { useTranslation } from 'react-i18next';
// import { BaseUrl } from '../../APIKey/ApiKey';
// import {
//   Card,
//   CardBody,
//   Col,
//   Row,
//   Modal,
//   Table,
//   ModalHeader,
//   Form,
//   ModalBody,
//   ModalFooter,
//   Label,
//   Input,
//   FormFeedback,
//   UncontrolledDropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem,
// } from "reactstrap";
// import TableContainer from "../../../Components/Common/TableContainer";
// import EmptyDataCard from "../../../Components/Common/EmptyDataCard";
// import * as moment from "moment";
// import { useProfile } from "../../../Components/Hooks/UserHooks";
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import { toast } from "react-toastify";
// import avatar1 from '../../../assets/images/users/user-dummy-img.jpg';
// import smallImage9 from "../../../assets/images/small/img-9.jpg";
// import dummyImg from "../../../assets/images/users/user-dummy-img.jpg";
// import { country } from "../../../common/data";
// import Flatpickr from "react-flatpickr";
// import ProjectsOverview from "./ProjectsOverview";
// import Loader from "../../../Components/Common/Loader";

// const ContactsDetails = ({ contactId, switchToList }) => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [modal, setModal] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [order, setOrder] = useState(null);
//   const [contactDetails, setContactDetails] = useState(null);
//   const [contactStats, setContactStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [statsLoading, setStatsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedCategorie, setselectedCategorie] = useState("");
//   const [selectedTypeContact, setSelectedTypeContact] = useState("");
//   const dispatch = useDispatch();
  
//   const ecomsellerData = createSelector(
//     (state) => state.Ecommerce,
//     (products) => products.products
//   );
//   const products = useSelector(ecomsellerData);
//   const [productList, setProductList] = useState([]);
//   const { token, loading: profileLoading, error: profileError } = useProfile();

//   // Options pour les sélecteurs
//   const typeContactOptions = [
//     { value: "Client", label: "Client" },
//     { value: "Prospect", label: "Prospect" },
//     { value: "Fournisseur", label: "Fournisseur" },
//     { value: "Partenaire", label: "Partenaire" },
//   ];

//   const categorieOptions = [
//     { value: "Particulier", label: "Particulier" },
//     { value: "Entreprise", label: "Entreprise" },
//     { value: "Institution", label: "Institution" },
//     { value: "Association", label: "Association" },
//     { value: "Administration", label: "Administration" },
//     { value: "ONG", label: "ONG" },
//     { value: "Fondation", label: "Fondation" },
//     {
//       value: "Groupement d'intérêt économie(GE)",
//       label: "Groupement d'intérêt économie(GE)",
//     },
//   ];

//   const typeClientOptions = [
//     { value: "Detaillant", label: "Détaillant" },
//     { value: "Grossiste", label: "Grossiste" },
//     { value: "VIP", label: "VIP" },
//   ];

//   const formeJuridiqueOptions = [
//     { value: "Entreprise Individuelle", label: "Entreprise Individuelle" },
//     {
//       value: "Société à Responsabilité Limitée(SARL)",
//       label: "Société à Responsabilité Limitée(SARL)",
//     },
//     {
//       value: "Société Unipersonnelle à Responsabilité Limitée(SARL)",
//       label: "Société Unipersonnelle à Responsabilité Limitée(SARL)",
//     },
//     { value: "Société Anonyme(SA)", label: "Société Anonyme(SA)" },
//     {
//       value: "Société en Nom Collectif(SNC)",
//       label: "Société en Nom Collectif(SNC)",
//     },
//     { value: "Société Coopérative", label: "Société Coopérative" },
//   ];

//   const revenuOptions = [
//     { value: "0-100000", label: "0 - 100000" },
//     { value: "100000-250000", label: "100000 - 250000" },
//     { value: "250000-500000", label: "250000 - 500000" },
//     { value: "500000-1000000", label: "500000 - 1000000" },
//     { value: "1000000-10000000", label: "1000000 - 10000000" },
//   ];

//   // Vérification d'authentification
//   if (profileError) {
//     console.error("Erreur de profil:", profileError);
//     toast.error("Erreur de chargement du profil utilisateur");
//     navigate("/login");
//     return null;
//   }

//   // Fonction pour formater les nombres
//   const formatNumber = (num) => {
//     if (!num && num !== 0) return "0";
//     return new Intl.NumberFormat('fr-FR').format(num);
//   };

//   // Fonction pour récupérer les statistiques selon le type de contact
//   const fetchContactStats = async (contactId, typeContact) => {
//     if (!contactId || !token) return;
    
//     setStatsLoading(true);
//     try {
//       let url = "";
      
//       if (typeContact === "Client") {
//         url = `${BaseUrl}/utilisateurs/contact_client/${contactId}/detail/`;
//       } else if (typeContact === "Fournisseur") {
//         url = `${BaseUrl}/utilisateurs/contact_fournisseur/${contactId}/detail/`;
//       } else {
//         setStatsLoading(false);
//         return;
//       }
      
//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       if (!response.ok) throw new Error("Erreur lors du chargement des statistiques");
      
//       const data = await response.json();
//       setContactStats(data);
//     } catch (error) {
//       console.error("Erreur chargement stats:", error);
//       setError(error.message);
//     } finally {
//       setStatsLoading(false);
//     }
//   };

//   // Récupération des détails du contact
//   useEffect(() => {
//     const fetchContactDetails = async () => {
//       if (!contactId || !token) return;

//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${BaseUrl}/utilisateurs/contacte/${contactId}/`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
        
//         if (!response.ok) throw new Error("Erreur lors du chargement du contact");
        
//         const data = await response.json();
//         setContactDetails(data);
        
//         // Récupérer les stats si c'est un client ou fournisseur
//         if (data.type_contact === "Client" || data.type_contact === "Fournisseur") {
//           fetchContactStats(contactId, data.type_contact);
//         }
//       } catch (error) {
//         console.error("Erreur:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContactDetails();
//   }, [contactId, token]);

//   // Fetch products
//   useEffect(() => {
//     if (products && !products.length) {
//       dispatch(onGetProducts());
//     }
//   }, [dispatch, products]);

//   useEffect(() => {
//     setProductList(products);
//   }, [products]);

//   // Composant pour afficher les informations de contact
//   const RenderContactInfo = ({ label, value }) => {
//     if (!value && value !== 0) return null;
    
//     return (
//       <tr className="p-0">
//         <th className="pe-2" style={{ whiteSpace: 'nowrap' }} scope="row">
//           {label}
//         </th>
//         <td className="text-muted ps-0" style={{ width: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//           : {value}
//         </td>
//       </tr>
//     );
//   };

//   // Préparer les données pour le graphique
//   const prepareChartData = () => {
//     if (!contactStats || !contactDetails) return null;
    
//     const { type_contact } = contactDetails;
//     let series = [];
//     let categories = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
//     if (type_contact === "Client") {
//       // Préparer les données pour les clients
//       const achatsMensuels = Array(12).fill(0);
//       const reglementsMensuels = Array(12).fill(0);
//       const produitsMensuels = Array(12).fill(0);
      
//       // Remplir les données existantes
//       if (contactStats.achats_mensuels) {
//         contactStats.achats_mensuels.forEach(item => {
//           const month = new Date(item.mois).getMonth();
//           achatsMensuels[month] = item.total;
//         });
//       }
      
//       if (contactStats.reglements_mensuels) {
//         contactStats.reglements_mensuels.forEach(item => {
//           const month = new Date(item.mois).getMonth();
//           reglementsMensuels[month] = item.total;
//         });
//       }
      
//       if (contactStats.produits_mensuels) {
//         contactStats.produits_mensuels.forEach(item => {
//           const month = new Date(item.mois).getMonth();
//           produitsMensuels[month] = parseFloat(item.total) || 0;
//         });
//       }
      
//       series = [
//         { 
//           name: 'Achats effectués', 
//           type: 'column', 
//           data: achatsMensuels 
//         },
//         { 
//           name: 'Nombre de produits achetés', 
//           type: 'line', 
//           data: produitsMensuels 
//         },
//         { 
//           name: 'Règlements reçus', 
//           type: 'column', 
//           data: reglementsMensuels 
//         }
//       ];
//     } else if (type_contact === "Fournisseur") {
//       // Préparer les données pour les fournisseurs
//       const commandesMensuelles = Array(12).fill(0);
//       const commandesPayees = Array(12).fill(0);
//       const produitsMensuels = Array(12).fill(0);
      
//       // Remplir les données existantes
//       if (contactStats.commandes_mensuelles) {
//         contactStats.commandes_mensuelles.forEach(item => {
//           const month = new Date(item.mois).getMonth();
//           commandesMensuelles[month] = item.total;
//         });
//       }
      
//       if (contactStats.commandes_payees) {
//         contactStats.commandes_payees.forEach(item => {
//           const month = new Date(item.mois).getMonth();
//           commandesPayees[month] = item.total;
//         });
//       }
      
//       if (contactStats.produits_mensuels) {
//         contactStats.produits_mensuels.forEach(item => {
//           const month = new Date(item.mois).getMonth();
//           produitsMensuels[month] = parseFloat(item.total) || 0;
//         });
//       }
      
//       series = [
//         { 
//           name: 'Commandes', 
//           type: 'column', 
//           data: commandesMensuelles 
//         },
//         { 
//           name: 'Nombre de produits achetés', 
//           type: 'line', 
//           data: produitsMensuels 
//         },
//         { 
//           name: 'Commandes payées', 
//           type: 'column', 
//           data: commandesPayees 
//         }
//       ];
//     }
    
//     return {
//       series,
//       categories
//     };
//   };

//   // Fonction pour mettre à jour le contact
//   const handleUpdateContact = async () => {
//     if (!order?.id) {
//       toast.error("Aucun contact sélectionné pour la modification");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formDataToSend = new FormData();

//       // Ajoutez tous les champs au FormData
//       formDataToSend.append("nom", order.nom || "");
//       formDataToSend.append("email", order.email || "");
//       formDataToSend.append("adresse", order.adresse || "");
//       formDataToSend.append("nom_entreprise", order.nom_entreprise || "");
//       formDataToSend.append("nom_contact", order.nom_contact || "");
//       formDataToSend.append("telephone", order.telephone || "");
//       formDataToSend.append("telephone2", order.telephone2 || "");
//       formDataToSend.append("site_web", order.site_web || "");
//       formDataToSend.append("commentaire", order.commentaire || "");
//       formDataToSend.append("type_contact", order.type_contact || "");
//       formDataToSend.append("capital_social", order.capital_social || "");
//       formDataToSend.append("num_enreg_legal1", order.num_enreg_legal1 || "");
//       formDataToSend.append("num_enreg_legal2", order.num_enreg_legal2 || "");
//       formDataToSend.append("revenu", order.revenu || "");
//       formDataToSend.append("forme_juridique", order.forme_juridique || "");
//       formDataToSend.append("categorie", order.categorie || "");

//       if (order.date_anniversaire) {
//         formDataToSend.append(
//           "date_anniversaire",
//           moment(order.date_anniversaire).format("YYYY-MM-DD")
//         );
//       }

//       // Ajoutez la photo seulement si c'est un nouveau fichier
//       if (order.photo instanceof File) {
//         formDataToSend.append("photo", order.photo);
//       } else if (order.photo) {
//         formDataToSend.append("photo", order.photo);
//       }

//       const response = await fetch(
//         `${BaseUrl}/utilisateurs/contacte/${order.id}/`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formDataToSend,
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
//       }

//       const updatedContact = await response.json();
      
//       // Mettre à jour les états locaux
//       setContactDetails(updatedContact);
      
//       toast.success("Contact mis à jour avec succès!");
//       setModal(false);
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour:", error);
//       toast.error(`Échec de la mise à jour: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Configuration Formik pour la modification
//   const validation = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       type_client: (order && order.statut_contacte) || "Détaillant",
//       nom_contact: (order && order.nom_contact) || "",
//       segment: (order && order.segment) || "",
//       nom: (order && order.nom) || "",
//       nom_entreprise: (order && order.nom_entreprise) || "",
//       telephone: (order && order.telephone) || "",
//       telephone2: (order && order.telephone2) || "",
//       email: (order && order.email) || "",
//       adresse: (order && order.adresse) || "",
//       date_anniversaire: (order && order.date_anniversaire) || "",
//       site_web: (order && order.site_web) || "",
//       categorie: (order && order.categorie) || "",
//       type_contact: (order && order.type_contact) || "",
//       forme_juridique: (order && order.forme_juridique) || "",
//       capital_social: (order && order.capital_social) || "",
//       num_enreg_legal1: (order && order.num_enreg_legal1) || "",
//       num_enreg_legal2: (order && order.num_enreg_legal2) || "",
//       revenu: (order && order.revenu) || "",
//       commentaire: (order && order.commentaire) || "",
//       photo: (order && order.photo) || null,
//     },
//     validationSchema: Yup.object({
//       nom: Yup.string().required("Veuillez entrer un nom"),
//       telephone: Yup.string().test(
//         "is-valid-phone",
//         "Numéro invalide",
//         function (value) {
//           if (!value) return true;
//           const strValue = String(value);
//           return strValue.startsWith("+") && strValue.length > 6;
//         }
//       ),
//       telephone2: Yup.string().test(
//         "is-valid-phone",
//         "Numéro invalide",
//         function (value) {
//           if (!value) return true;
//           const strValue = String(value);
//           return strValue.startsWith("+") && strValue.length > 6;
//         }
//       ),
//       email: Yup.string().email("Veuillez entrer un email valide"),
//       categorie: Yup.string().required("Veuillez sélectionner une catégorie"),
//       type_contact: Yup.string().required("Veuillez sélectionner un type de contact"),
//     }),
//     onSubmit: (values) => {
//       setOrder(prev => ({ ...prev, ...values }));
//       handleUpdateContact();
//     }
//   });

//   // Gestion des changements de catégorie
//   const handleCategoryChange = useCallback(
//     (e) => {
//       const selectedValue = e.target.value;
//       setselectedCategorie(selectedValue);
//       validation.setFieldValue("categorie", selectedValue);
//     },
//     [validation]
//   );

//   // Fonction toggle pour la modal
//   const toggle = useCallback(() => {
//     if (modal) {
//       setModal(false);
//       setOrder(null);
//       validation.resetForm();
//     } else {
//       setModal(true);
//     }
//   }, [modal, validation]);

//   // Fonction pour ouvrir la modal de modification
//   const handleEditClick = () => {
//     if (contactDetails) {
//       setIsEdit(true);
//       setOrder(contactDetails);
//       setselectedCategorie(contactDetails.categorie || "");
//       setSelectedTypeContact(contactDetails.type_contact || "");
//       setModal(true);
//     }
//   };

//   // Configuration des colonnes pour TableContainer
//   const columns = useMemo(
//     () => [
//       {
//         header: "Produit",
//         accessorKey: "name",
//         enableColumnFilter: false,
//         cell: (cell) => (
//           <div className="d-flex align-items-center">
//             <div className="flex-shrink-0 me-3">
//               <div className="avatar-sm bg-light rounded-circle p-1">
//                 <img
//                   src={cell.row.original.image || dummyImg}
//                   alt=""
//                   className="img-fluid d-block rounded-circle"
//                   onError={(e) => {
//                     e.target.src = dummyImg;
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="flex-grow-1">
//               <h5 className="fs-14 mb-1">
//                 <a href="#" className="text-body">
//                   {cell.getValue()}
//                 </a>
//               </h5>
//               <p className="text-muted mb-0">
//                 Catégorie: <span className="fw-medium">{cell.row.original.category || "Non spécifié"}</span>
//               </p>
//             </div>
//           </div>
//         ),
//       },
//       {
//         header: "Stock",
//         accessorKey: "stock",
//         enableColumnFilter: false,
//         cell: (cell) => (
//           <span className={cell.getValue() > 0 ? "text-success" : "text-danger"}>
//             {cell.getValue() > 0 ? `${cell.getValue()} en stock` : "Rupture"}
//           </span>
//         ),
//       },
//       {
//         header: "Prix",
//         accessorKey: "price",
//         enableColumnFilter: false,
//         cell: (cell) => (
//           <span>{formatNumber(cell.getValue())} abonnement_user</span>
//         ),
//       },
//       {
//         header: "Statut",
//         accessorKey: "status",
//         enableColumnFilter: false,
//         cell: (cell) => {
//           const status = cell.getValue();
//           return (
//             <span className={`badge badge-soft-${status === "En stock" ? "success" : "warning"} text-uppercase`}>
//               {status}
//             </span>
//           );
//         },
//       },
//       {
//         header: "Action",
//         cell: (cell) => {
//           return (
//             <UncontrolledDropdown>
//               <DropdownToggle href="#" className="btn btn-soft-secondary btn-sm" tag="button">
//                 <i className="ri-more-fill" />
//               </DropdownToggle>
//               <DropdownMenu className="dropdown-menu-end">
//                 <DropdownItem href="#">
//                   <i className="ri-eye-fill align-bottom me-2 text-muted"></i> Voir
//                 </DropdownItem>
//                 <DropdownItem href="#">
//                   <i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Modifier
//                 </DropdownItem>
//                 <DropdownItem divider />
//                 <DropdownItem href="#">
//                   <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Supprimer
//                 </DropdownItem>
//               </DropdownMenu>
//             </UncontrolledDropdown>
//           );
//         },
//       },
//     ],
//     []
//   );

//   // Données fictives pour les produits
//   const sampleProducts = [
  
//   ];

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
//         <Loader />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <EmptyDataCard
//         title="Erreur de chargement"
//         description={error}
//         actionButton={
//           <button
//             className="btn btn-primary"
//             onClick={() => window.location.reload()}
//             style={{ borderRadius: "20px" }}
//           >
//             <i className="ri-refresh-line me-1"></i>
//             Réessayer
//           </button>
//         }
//       />
//     );
//   }

//   if (!contactDetails) {
//     return (
//       <EmptyDataCard
//         title="Contact non trouvé"
//         description="Le contact que vous recherchez n'existe pas ou a été supprimé."
//         actionButton={
//           <button
//             className="btn btn-secondary"
//             onClick={switchToList}
//             style={{ borderRadius: "20px" }}
//           >
//             <i className="ri-arrow-left-line me-1"></i>
//             Retour à la liste
//           </button>
//         }
//       />
//     );
//   }

//   document.title = `Détail Contact - ${contactDetails.nom || "Contact"} | INAWO - Suite de Gestion`;

//   // Rendu conditionnel selon le type de contact
//   const isClientOrFournisseur = contactDetails.type_contact === "Client" || contactDetails.type_contact === "Fournisseur";

//   return (
//     <React.Fragment>
//       <BreadCrumb
//         title={`Détail Contact - ${contactDetails.nom || "Contact"}`}
//         pageTitle={
//           <>
//             <i className="ri-contacts-book-line me-1 align-bottom"></i>
//             &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;&nbsp;
//             <Link to="#" onClick={switchToList}>Contacts</Link>&nbsp;&gt;
//           </>
//         }
//       />
      
//       <Row>
//         {/* Colonne de gauche - Informations du contact */}
//         <div className="col-lg-3 mt-lg-2">
//           <div className="d-flex flex-column h-100">
//             <Card className="overflow-hidden flex-fill" style={{ borderRadius: "20px" }}>
//               <div>
//                 <img src={smallImage9} alt="Bannière" className="img-fluid" />
//               </div>
//               <CardBody className="pt-0 mt-n5">
//                 <div className="text-center">
//                   <div className="profile-user position-relative d-inline-block mx-auto mb-4">
//                     <img
//                       src={contactDetails?.photo
//                         ? `${BaseUrl}${contactDetails.photo}`
//                         : avatar1}
//                       className="rounded-circle avatar-xl img-thumbnail user-profile-image"
//                       alt="user-profile"
//                       onError={(e) => {
//                         e.target.src = avatar1;
//                       }}
//                     />
//                     <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
//                       <input id="profile-img-file-input" type="file" className="profile-img-file-input" />
//                       <label htmlFor="profile-img-file-input" className="profile-photo-edit avatar-xs">
//                         <span className="avatar-title rounded-circle bg-light text-body">
//                           <i className="ri-camera-fill"></i>
//                         </span>
//                       </label>
//                     </div>
//                   </div>
//                   <h5 className="fs-16 mb-1">{contactDetails?.nom || "Nom inconnu"}</h5>
//                   <p className="text-muted mb-0">{contactDetails?.type_contact || "Type inconnu"}</p>
//                   {contactDetails?.nom_entreprise && (
//                     <p className="text-muted mb-0">{contactDetails.nom_entreprise}</p>
//                   )}
//                 </div>
//               </CardBody>

//               <Card>
//                 <CardBody style={{ overflowY: "auto" }}>
//                   <div className="table-responsive">
//                     <Table className="table-borderless mb-0">
//                       <tbody>
//                         <RenderContactInfo label="Nom" value={contactDetails?.nom} />
//                         <RenderContactInfo label="Entreprise" value={contactDetails?.nom_entreprise} />
//                         <RenderContactInfo label="Téléphone" value={contactDetails?.telephone} />
//                         <RenderContactInfo label="Téléphone 2" value={contactDetails?.telephone2} />
//                         <RenderContactInfo label="Email" value={contactDetails?.email} />
//                         <RenderContactInfo label="Adresse" value={contactDetails?.adresse} />
//                         <RenderContactInfo label="Revenu" value={contactDetails?.revenu} />
//                         <RenderContactInfo
//                           label={contactDetails?.categorie === "Particulier" ? "Date anniversaire" : "Date création"}
//                           value={contactDetails?.date_anniversaire ? new Date(contactDetails.date_anniversaire).toLocaleDateString() : null}
//                         />
//                         <RenderContactInfo label="Site web" value={contactDetails?.site_web} />
//                         <RenderContactInfo label="Forme juridique" value={contactDetails?.forme_juridique} />
//                         <RenderContactInfo label="Capital social" value={contactDetails?.capital_social} />
//                         <RenderContactInfo label="Numéro légal 1" value={contactDetails?.num_enreg_legal1} />
//                         <RenderContactInfo label="Numéro légal 2" value={contactDetails?.num_enreg_legal2} />
//                         <RenderContactInfo label="Commentaire" value={contactDetails?.commentaire} />
//                       </tbody>
//                     </Table>
//                   </div>
//                 </CardBody>
//               </Card>
              
//               <div className="card-body border-top">
//                 <div className="d-flex justify-content-center mb-4 pb-2">
//                   <button
//                     type="button"
//                     className="btn btn-primary"
//                     style={{ borderRadius: "20px" }}
//                     onClick={handleEditClick}
//                   >
//                     <i className="ri-pencil-line me-1"></i>
//                     Modifier informations
//                   </button>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>

//         {/* Colonne de droite - Contenu conditionnel */}
//         <div className="col-lg-9">
//           {isClientOrFournisseur ? (
//             // Affichage pour Clients et Fournisseurs
//             <>
//            {/* <Card className="mb-4" style={{ borderRadius: "20px" }}> */}
//   <CardBody>
//     <div className="d-flex justify-content-between align-items-center mb-4">
//       <h5 className="card-title mb-0">
//         {contactDetails.type_contact === "Client" 
//           ? "Activité d'achat mensuelle" 
//           : "Activité des commandes mensuelles"}
//       </h5>
//     </div>
    
//     {statsLoading ? (
//       <div className="text-center py-5">
//         <Loader />
//         <p className="text-muted mt-3">Chargement du graphique...</p>
//       </div>
//     ) : contactStats ? (
//       <ProjectsOverview 
//         clientId={contactId} // ← AJOUT IMPORTANT
//         chartData={prepareChartData()} // ← SUPPRIMEZ CETTE LIGNE
//       />
//     ) : (
//       <EmptyDataCard
//         title="Aucune donnée disponible"
//         description={`Les données statistiques pour ce ${contactDetails.type_contact.toLowerCase()} ne sont pas disponibles pour le moment.`}
//         icon="ri-bar-chart-line"
//       />
//     )}
//   </CardBody>
// {/* </Card> */}
//               {/* Tableau des produits */}
//               {/* <Card style={{ borderRadius: "20px" }}> */}
//                 <CardBody>
//                   <div className="d-flex justify-content-between align-items-center mb-4">
//                     <h5 className="card-title mb-0">Ventes associés</h5>
//                     <div className="search-box">
//                       <input
//                         style={{ borderRadius: "20px" }}
//                         type="text"
//                         className="form-control"
//                         placeholder="Rechercher des ventes..."
//                       />
//                       <i className="ri-search-line search-icon"></i>
//                     </div>
//                   </div>
                  
//                   {sampleProducts && sampleProducts.length > 0 ? (
//                     <TableContainer
//                       columns={columns}
//                       data={sampleProducts}
//                       isGlobalFilter={false}
//                       isAddUserList={false}
//                       customPageSize={10}
//                       divClass="table-responsive"
//                       tableClass="mb-0 table-borderless"
//                       theadClass="table-light text-muted"
//                       containerStyle={{
//                         borderRadius: "20px",
//                         overflow: "hidden",
//                       }}
//                     />
//                   ) : (
//                     <EmptyDataCard
//                       title="Aucune vente associée"
//                       description="Aucune vente n'est actuellement associée à ce contact."
//                       actionButton={
//                         <button
//                           className="btn btn-success"
//                           style={{ borderRadius: "20px" }}
//                         >
//                           <i className="ri-add-line me-1"></i>
//                           Ajouter une vente
//                         </button>
//                       }
//                     />
//                   )}
//                 </CardBody>
//               {/* </Card> */}
//             </>
//           ) : (
//             // Affichage pour autres types de contacts (Prospect, Partenaire, etc.)
//             <Card style={{ borderRadius: "20px" }}>
//               <CardBody>
//                 <div className="text-center py-5">
//                   <i className="ri-user-line display-4 text-muted"></i>
//                   <h5 className="text-muted mt-3">Informations du contact</h5>
//                   <p className="text-muted mb-4">
//                     Ce contact est un {contactDetails.type_contact}. Les statistiques détaillées et les graphiques 
//                     ne sont disponibles que pour les clients et fournisseurs.
//                   </p>
                  
//                   {/* Vous pouvez ajouter d'autres informations spécifiques ici si nécessaire */}
//                   <div className="row mt-4">
//                     <div className="col-md-12">
//                       <div className="text-center p-3">
//                         <i className="ri-calendar-line text-primary fs-2"></i>
//                         <h6 className="mt-2">Date de création</h6>
//                         <p className="text-muted mb-0">
//                           {contactDetails?.date_anniversaire 
//                             ? new Date(contactDetails.date_anniversaire).toLocaleDateString()
//                             : "Non spécifiée"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardBody>
//             </Card>
//           )}

//           {/* Bouton retour */}
//           <div className="col-12 text-end mt-4">
//             <button 
//               type="button" 
//               onClick={switchToList} 
//               className="btn btn-secondary me-2" 
//               style={{ borderRadius: "20px" }}
//             >
//               <i className="ri-arrow-left-line me-1"></i>
//               Retour à la liste
//             </button>
//           </div>
//         </div>
//       </Row>

//       {/* Modal de modification */}
//       <Modal
//         id="showModal"
//         isOpen={modal}
//         toggle={toggle}
//         centered
//         size="lg"
//         contentClassName="custom-rounded-modal"
//       >
//         <ModalHeader className="bg-light p-3 rounded-top-20" toggle={toggle}>
//           Modifier le contact
//         </ModalHeader>
//         <Form
//           className="tablelist-form"
//           onSubmit={(e) => {
//             e.preventDefault();
//             validation.handleSubmit();
//           }}
//         >
//           <ModalBody>
//             <Row className="g-3">
//               <Col lg={12}>
//                 <div className="text-center">
//                   <div className="position-relative d-inline-block">
//                     <div className="position-absolute bottom-0 end-0">
//                       <Label htmlFor="contact-image-input" className="mb-0">
//                         <div className="avatar-xs cursor-pointer">
//                           <div className="avatar-title bg-light border rounded-circle text-muted">
//                             <i className="ri-image-fill"></i>
//                           </div>
//                         </div>
//                       </Label>
//                       <Input
//                         className="form-control d-none"
//                         id="contact-image-input"
//                         type="file"
//                         accept="image/png, image/gif, image/jpeg"
//                         onChange={(e) => {
//                           const file = e.target.files[0];
//                           if (file) {
//                             validation.setFieldValue("photo", file);
//                             const reader = new FileReader();
//                             reader.onload = (event) => {
//                               document.getElementById("contact-img").src = event.target.result;
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
//                               ? `${BaseUrl}${order.photo}`
//                               : dummyImg
//                           }
//                           alt="contact"
//                           id="contact-img"
//                           className="avatar-md rounded-circle object-fit-cover"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <h5 className="fs-13 mt-3">Photo du contact</h5>
//                 </div>
//               </Col>

//               {/* Type contact */}
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="type_contact" className="form-label">
//                     Type contact <span className="text-danger">*</span>
//                   </Label>
//                   <Input
//                     type="select"
//                     name="type_contact"
//                     value={validation.values.type_contact}
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     invalid={validation.touched.type_contact && validation.errors.type_contact}
//                     style={{ borderRadius: '20px' }}
//                   >
//                     <option value="">Sélectionner</option>
//                     {typeContactOptions.map(option => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </Input>
//                   {validation.touched.type_contact && validation.errors.type_contact && (
//                     <FormFeedback>{validation.errors.type_contact}</FormFeedback>
//                   )}
//                 </div>
//               </Col>

//               {/* Catégorie */}
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="categorie" className="form-label">
//                     Catégorie <span className="text-danger">*</span>
//                   </Label>
//                   <Input
//                     type="select"
//                     name="categorie"
//                     value={validation.values.categorie}
//                     onChange={(e) => {
//                       handleCategoryChange(e);
//                       validation.handleChange(e);
//                     }}
//                     onBlur={validation.handleBlur}
//                     invalid={validation.touched.categorie && validation.errors.categorie}
//                     style={{ borderRadius: '20px' }}
//                   >
//                     <option value="">Sélectionner</option>
//                     {categorieOptions.map(option => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </Input>
//                   {validation.touched.categorie && validation.errors.categorie && (
//                     <FormFeedback>{validation.errors.categorie}</FormFeedback>
//                   )}
//                 </div>
//               </Col>

//               {/* Type Client (uniquement pour les clients) */}
//               {validation.values.type_contact === "Client" && (
//                 <Col lg={6}>
//                   <div>
//                     <Label htmlFor="type_client" className="form-label">
//                       Type client
//                     </Label>
//                     <Input
//                       type="select"
//                       name="type_client"
//                       value={validation.values.type_client}
//                       onChange={validation.handleChange}
//                       style={{ borderRadius: '20px' }}
//                     >
//                       <option value="">Sélectionner</option>
//                       {typeClientOptions.map(option => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </Input>
//                   </div>
//                 </Col>
//               )}

//               {/* Nom */}
//               <Col lg={validation.values.type_contact === "Client" ? 6 : 12}>
//                 <div>
//                   <Label htmlFor="nom" className="form-label">
//                     {selectedCategorie === "Particulier" ? "Nom et Prénom" : "Nom"}
//                     <span className="text-danger">*</span>
//                   </Label>
//                   <Input
//                     name="nom"
//                     value={validation.values.nom}
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     invalid={validation.touched.nom && validation.errors.nom}
//                     placeholder={selectedCategorie === "Particulier" ? "Entrez le nom et prénom" : "Entrez le nom"}
//                     style={{ borderRadius: '20px' }}
//                   />
//                   {validation.touched.nom && validation.errors.nom && (
//                     <FormFeedback>{validation.errors.nom}</FormFeedback>
//                   )}
//                 </div>
//               </Col>

//               {/* Téléphone */}
//               <Col lg={6}>
//                 <div>
//                   <Label className="form-label">Téléphone</Label>
//                   <PhoneInput
//                     name="telephone"
//                     value={validation.values.telephone}
//                     onChange={(value) => validation.setFieldValue("telephone", value)}
//                     countries={country}
//                     defaultCountry="FR"
//                     inputStyle={{ borderRadius: '20px' }}
//                   />
//                   {validation.touched.telephone && validation.errors.telephone && (
//                     <div className="text-danger small">{validation.errors.telephone}</div>
//                   )}
//                 </div>
//               </Col>

//               {/* Téléphone 2 */}
//               <Col lg={6}>
//                 <div>
//                   <Label className="form-label">Téléphone 2</Label>
//                   <PhoneInput
//                     name="telephone2"
//                     value={validation.values.telephone2}
//                     onChange={(value) => validation.setFieldValue("telephone2", value)}
//                     countries={country}
//                     defaultCountry="FR"
//                     inputStyle={{ borderRadius: '20px' }}
//                   />
//                   {validation.touched.telephone2 && validation.errors.telephone2 && (
//                     <div className="text-danger small">{validation.errors.telephone2}</div>
//                   )}
//                 </div>
//               </Col>

//               {/* Email */}
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="email" className="form-label">Email</Label>
//                   <Input
//                     name="email"
//                     type="email"
//                     value={validation.values.email}
//                     onChange={validation.handleChange}
//                     onBlur={validation.handleBlur}
//                     invalid={validation.touched.email && validation.errors.email}
//                     placeholder="Entrez votre email"
//                     style={{ borderRadius: '20px' }}
//                   />
//                   {validation.touched.email && validation.errors.email && (
//                     <FormFeedback>{validation.errors.email}</FormFeedback>
//                   )}
//                 </div>
//               </Col>

//               {/* Adresse */}
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="adresse" className="form-label">Adresse</Label>
//                   <Input
//                     name="adresse"
//                     value={validation.values.adresse}
//                     onChange={validation.handleChange}
//                     placeholder="Entrez votre adresse"
//                     style={{ borderRadius: '20px' }}
//                   />
//                 </div>
//               </Col>

//               {/* Date anniversaire/création */}
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="date_anniversaire" className="form-label">
//                     {selectedCategorie === "Particulier" ? "Date d'anniversaire" : "Date de création"}
//                   </Label>
//                   <Flatpickr
//                     className="form-control"
//                     value={validation.values.date_anniversaire}
//                     onChange={(date) => validation.setFieldValue("date_anniversaire", date[0])}
//                     options={{
//                       dateFormat: "Y-m-d",
//                       maxDate: new Date(),
//                     }}
//                     style={{ borderRadius: '20px' }}
//                   />
//                 </div>
//               </Col>

//               {/* Site web */}
//               <Col lg={6}>
//                 <div>
//                   <Label htmlFor="site_web" className="form-label">Site web</Label>
//                   <Input
//                     name="site_web"
//                     value={validation.values.site_web}
//                     onChange={validation.handleChange}
//                     placeholder="https://example.com"
//                     style={{ borderRadius: '20px' }}
//                   />
//                 </div>
//               </Col>

//               {/* Commentaire */}
//               <Col lg={12}>
//                 <div>
//                   <Label htmlFor="commentaire" className="form-label">Commentaire</Label>
//                   <Input
//                     name="commentaire"
//                     type="textarea"
//                     rows="3"
//                     value={validation.values.commentaire}
//                     onChange={validation.handleChange}
//                     placeholder="Ajoutez un commentaire"
//                     style={{ borderRadius: '20px' }}
//                   />
//                 </div>
//               </Col>
//             </Row>
//           </ModalBody>
//           <ModalFooter>
//             <button
//               type="button"
//               className="btn btn-light"
//               onClick={toggle}
//               style={{ borderRadius: '20px' }}
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               className="btn btn-success"
//               disabled={loading}
//               style={{ borderRadius: '20px' }}
//             >
//               {loading ? "Enregistrement..." : "Mettre à jour"}
//             </button>
//           </ModalFooter>
//         </Form>
//       </Modal>
//     </React.Fragment>
//   );
// };

// export default ContactsDetails;







import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { getProducts as onGetProducts } from "../../../slices/thunks";
import PhoneInput from "../../../Components/ContactDeleteModal/CountryPhoneInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import '../../../App.css';
import { useTranslation } from 'react-i18next';
import { BaseUrl } from '../../APIKey/ApiKey';
import {
  Card,
  CardBody,
  Col,
  Row,
  Modal,
  Table,
  ModalHeader,
  Form,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  FormFeedback,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import EmptyDataCard from "../../../Components/Common/EmptyDataCard";
import * as moment from "moment";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { toast } from "react-toastify";
import avatar1 from '../../../assets/images/users/user-dummy-img.jpg';
import smallImage9 from "../../../assets/images/small/img-9.jpg";
import dummyImg from "../../../assets/images/users/user-dummy-img.jpg";
import { country } from "../../../common/data";
import Flatpickr from "react-flatpickr";
import ProjectsOverview from "./ProjectsOverview";
import Loader from "../../../Components/Common/Loader";

const ContactsDetails = ({ contactId, switchToList }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [order, setOrder] = useState(null);
  const [contactDetails, setContactDetails] = useState(null);
  const [contactStats, setContactStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategorie, setselectedCategorie] = useState("");
  const [selectedTypeContact, setSelectedTypeContact] = useState("");
  const dispatch = useDispatch();
  
  const ecomsellerData = createSelector(
    (state) => state.Ecommerce,
    (products) => products.products
  );
  const products = useSelector(ecomsellerData);
  const [productList, setProductList] = useState([]);
  const { token, loading: profileLoading, error: profileError } = useProfile();

  // Options pour les sélecteurs
  const typeContactOptions = [
    { value: "Client", label: "Client" },
    { value: "Prospect", label: "Prospect" },
    { value: "Fournisseur", label: "Fournisseur" },
    { value: "Partenaire", label: "Partenaire" },
  ];

  const categorieOptions = [
    { value: "Particulier", label: "Particulier" },
    { value: "Entreprise", label: "Entreprise" },
    { value: "Institution", label: "Institution" },
    { value: "Association", label: "Association" },
    { value: "Administration", label: "Administration" },
    { value: "ONG", label: "ONG" },
    { value: "Fondation", label: "Fondation" },
    {
      value: "Groupement d'intérêt économie(GE)",
      label: "Groupement d'intérêt économie(GE)",
    },
  ];

  const typeClientOptions = [
    { value: "Detaillant", label: "Détaillant" },
    { value: "Grossiste", label: "Grossiste" },
    { value: "VIP", label: "VIP" },
  ];

  const formeJuridiqueOptions = [
    { value: "Entreprise Individuelle", label: "Entreprise Individuelle" },
    {
      value: "Société à Responsabilité Limitée(SARL)",
      label: "Société à Responsabilité Limitée(SARL)",
    },
    {
      value: "Société Unipersonnelle à Responsabilité Limitée(SARL)",
      label: "Société Unipersonnelle à Responsabilité Limitée(SARL)",
    },
    { value: "Société Anonyme(SA)", label: "Société Anonyme(SA)" },
    {
      value: "Société en Nom Collectif(SNC)",
      label: "Société en Nom Collectif(SNC)",
    },
    { value: "Société Coopérative", label: "Société Coopérative" },
  ];

  const revenuOptions = [
    { value: "0-100000", label: "0 - 100000" },
    { value: "100000-250000", label: "100000 - 250000" },
    { value: "250000-500000", label: "250000 - 500000" },
    { value: "500000-1000000", label: "500000 - 1000000" },
    { value: "1000000-10000000", label: "1000000 - 10000000" },
  ];

  // Vérification d'authentification
  if (profileError) {
    console.error("Erreur de profil:", profileError);
    toast.error("Erreur de chargement du profil utilisateur");
    navigate("/login");
    return null;
  }

  // Fonction pour formater les nombres
  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifié";
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Fonction pour récupérer les détails complets du contact
  const fetchContactDetails = async () => {
    if (!contactId || !token) return;

    try {
      setLoading(true);
      setError(null);
      
      // Utiliser la nouvelle route pour récupérer tous les détails
      const response = await fetch(
        `${BaseUrl}/stocks/contact_client/${contactId}/detail/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        // Si la route client ne fonctionne pas, essayer avec une autre route générique
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("📊 Données contact détaillées:", data);
      setContactDetails(data.contact_details);
      setContactStats(data);
      
    } catch (error) {
      console.error("Erreur chargement détails contact:", error);
      
      // Fallback: essayer de récupérer les informations de base
      try {
        const basicResponse = await fetch(
          `${BaseUrl}/utilisateurs/contacte/${contactId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (basicResponse.ok) {
          const basicData = await basicResponse.json();
          setContactDetails(basicData);
          setContactStats(null); // Pas de stats détaillées disponibles
        } else {
          throw new Error("Impossible de charger les informations du contact");
        }
      } catch (fallbackError) {
        console.error("Erreur fallback:", fallbackError);
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Récupération des détails du contact
  useEffect(() => {
    fetchContactDetails();
  }, [contactId, token]);

  // Fetch products
  useEffect(() => {
    if (products && !products.length) {
      dispatch(onGetProducts());
    }
  }, [dispatch, products]);

  useEffect(() => {
    setProductList(products);
  }, [products]);

  // Composant pour afficher les informations de contact
  const RenderContactInfo = ({ label, value }) => {
    if (!value && value !== 0) return null;
    
    return (
      <tr className="p-0">
        <th className="pe-2" style={{ whiteSpace: 'nowrap' }} scope="row">
          {label}
        </th>
        <td className="text-muted ps-0" style={{ width: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          : {value}
        </td>
      </tr>
    );
  };

  // Composant pour afficher les sections d'historique
  const HistoriqueSection = ({ title, data, emptyMessage, renderItem }) => {
    if (!data || data.length === 0) {
      return (
        <Card className="mb-3" style={{ borderRadius: "15px" }}>
          <CardBody>
            <div className="text-center py-4">
              <i className="ri-inbox-line display-4 text-muted"></i>
              <h6 className="text-muted mt-3">{emptyMessage}</h6>
            </div>
          </CardBody>
        </Card>
      );
    }

    return (
      <Card className="mb-4" style={{ borderRadius: "15px" }}>
        <CardBody>
          <h6 className="mb-3 text-primary">
            <i className="ri-history-line me-2"></i>
            {title} ({data.length})
          </h6>
          <div className="table-responsive">
            <Table className="table-borderless mb-0">
              <tbody>
                {data.map((item, index) => renderItem(item, index))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    );
  };

  // Fonction pour rendre un élément de vente
  const renderVenteItem = (vente, index) => (
    <tr key={vente.id} className="border-bottom">
      <td style={{ width: '40px' }}>
        <Badge color="primary" className="rounded-pill">#{vente.id}</Badge>
      </td>
      <td>
        <div>
          <strong>{vente.code}</strong>
          <div className="text-muted small">
            {formatDate(vente.date)}
          </div>
        </div>
      </td>
      <td className="text-end">
        <div className="fw-bold">{formatNumber(vente.montant_totale)} abonnement_user</div>
        <div className="text-muted small">
          Reçu: {formatNumber(vente.montant_recus)} abonnement_user
        </div>
      </td>
      <td className="text-end">
        <Badge 
          color={
            vente.statut_paiement === "Terminé" ? "success" : 
            vente.statut_paiement === "En cours" ? "warning" : "secondary"
          }
          className="rounded-pill"
        >
          {vente.statut_paiement}
        </Badge>
      </td>
    </tr>
  );

  // Fonction pour rendre un élément de facture
  const renderFactureItem = (facture, index) => (
    <tr key={facture.id} className="border-bottom">
      <td style={{ width: '40px' }}>
        <Badge color="info" className="rounded-pill">#{facture.id}</Badge>
      </td>
      <td>
        <div>
          <strong>{facture.numero_facture}</strong>
          <div className="text-muted small">
            Émission: {formatDate(facture.date_emission)}
          </div>
        </div>
      </td>
      <td className="text-end">
        <div className="fw-bold">{formatNumber(facture.montant_total)} abonnement_user</div>
        <div className="text-muted small">
          Restant: {formatNumber(facture.montant_restant)} abonnement_user
        </div>
      </td>
      <td className="text-end">
        <Badge 
          color={
            facture.statut === "payee" ? "success" : 
            facture.statut === "partiellement_payee" ? "warning" : "danger"
          }
          className="rounded-pill"
        >
          {facture.statut === "payee" ? "Payée" : 
           facture.statut === "partiellement_payee" ? "Partiellement payée" : "Impayée"}
        </Badge>
      </td>
    </tr>
  );

  // Fonction pour rendre un élément d'opportunité
  const renderOpportuniteItem = (opportunite, index) => (
    <tr key={opportunite.id} className="border-bottom">
      <td style={{ width: '40px' }}>
        <Badge color="warning" className="rounded-pill">#{opportunite.id}</Badge>
      </td>
      <td>
        <div>
          <strong>{opportunite.nom}</strong>
          <div className="text-muted small">
            {opportunite.description?.substring(0, 100)}...
          </div>
        </div>
      </td>
      <td className="text-end">
        <div className="fw-bold">{formatNumber(opportunite.valeur)} abonnement_user</div>
      </td>
      <td className="text-end">
        <Badge 
          color={
            opportunite.statut === "Offre accepte" ? "success" : 
            opportunite.statut === "Négociation" ? "warning" : "secondary"
          }
          className="rounded-pill"
        >
          {opportunite.statut}
        </Badge>
      </td>
    </tr>
  );

  // Fonction pour mettre à jour le contact
  const handleUpdateContact = async () => {
    if (!order?.id) {
      toast.error("Aucun contact sélectionné pour la modification");
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();

      // Ajoutez tous les champs au FormData
      formDataToSend.append("nom", order.nom || "");
      formDataToSend.append("email", order.email || "");
      formDataToSend.append("adresse", order.adresse || "");
      formDataToSend.append("nom_entreprise", order.nom_entreprise || "");
      formDataToSend.append("nom_contact", order.nom_contact || "");
      formDataToSend.append("telephone", order.telephone || "");
      formDataToSend.append("telephone2", order.telephone2 || "");
      formDataToSend.append("site_web", order.site_web || "");
      formDataToSend.append("commentaire", order.commentaire || "");
      formDataToSend.append("type_contact", order.type_contact || "");
      formDataToSend.append("capital_social", order.capital_social || "");
      formDataToSend.append("num_enreg_legal1", order.num_enreg_legal1 || "");
      formDataToSend.append("num_enreg_legal2", order.num_enreg_legal2 || "");
      formDataToSend.append("revenu", order.revenu || "");
      formDataToSend.append("forme_juridique", order.forme_juridique || "");
      formDataToSend.append("categorie", order.categorie || "");

      if (order.date_anniversaire) {
        formDataToSend.append(
          "date_anniversaire",
          moment(order.date_anniversaire).format("YYYY-MM-DD")
        );
      }

      // Ajoutez la photo seulement si c'est un nouveau fichier
      if (order.photo instanceof File) {
        formDataToSend.append("photo", order.photo);
      } else if (order.photo) {
        formDataToSend.append("photo", order.photo);
      }

      const response = await fetch(
        `${BaseUrl}/utilisateurs/contacte/${order.id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
      }

      const updatedContact = await response.json();
      
      // Mettre à jour les états locaux
      setContactDetails(updatedContact);
      
      toast.success("Contact mis à jour avec succès!");
      setModal(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error(`Échec de la mise à jour: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Configuration Formik pour la modification
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      type_client: (order && order.statut_contacte) || "Détaillant",
      nom_contact: (order && order.nom_contact) || "",
      segment: (order && order.segment) || "",
      nom: (order && order.nom) || "",
      nom_entreprise: (order && order.nom_entreprise) || "",
      telephone: (order && order.telephone) || "",
      telephone2: (order && order.telephone2) || "",
      email: (order && order.email) || "",
      adresse: (order && order.adresse) || "",
      date_anniversaire: (order && order.date_anniversaire) || "",
      site_web: (order && order.site_web) || "",
      categorie: (order && order.categorie) || "",
      type_contact: (order && order.type_contact) || "",
      forme_juridique: (order && order.forme_juridique) || "",
      capital_social: (order && order.capital_social) || "",
      num_enreg_legal1: (order && order.num_enreg_legal1) || "",
      num_enreg_legal2: (order && order.num_enreg_legal2) || "",
      revenu: (order && order.revenu) || "",
      commentaire: (order && order.commentaire) || "",
      photo: (order && order.photo) || null,
    },
    validationSchema: Yup.object({
      nom: Yup.string().required("Veuillez entrer un nom"),
      telephone: Yup.string().test(
        "is-valid-phone",
        "Numéro invalide",
        function (value) {
          if (!value) return true;
          const strValue = String(value);
          return strValue.startsWith("+") && strValue.length > 6;
        }
      ),
      telephone2: Yup.string().test(
        "is-valid-phone",
        "Numéro invalide",
        function (value) {
          if (!value) return true;
          const strValue = String(value);
          return strValue.startsWith("+") && strValue.length > 6;
        }
      ),
      email: Yup.string().email("Veuillez entrer un email valide"),
      categorie: Yup.string().required("Veuillez sélectionner une catégorie"),
      type_contact: Yup.string().required("Veuillez sélectionner un type de contact"),
    }),
    onSubmit: (values) => {
      setOrder(prev => ({ ...prev, ...values }));
      handleUpdateContact();
    }
  });

  // Gestion des changements de catégorie
  const handleCategoryChange = useCallback(
    (e) => {
      const selectedValue = e.target.value;
      setselectedCategorie(selectedValue);
      validation.setFieldValue("categorie", selectedValue);
    },
    [validation]
  );

  // Fonction toggle pour la modal
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setOrder(null);
      validation.resetForm();
    } else {
      setModal(true);
    }
  }, [modal, validation]);

  // Fonction pour ouvrir la modal de modification
  const handleEditClick = () => {
    if (contactDetails) {
      setIsEdit(true);
      setOrder(contactDetails);
      setselectedCategorie(contactDetails.categorie || "");
      setSelectedTypeContact(contactDetails.type_contact || "");
      setModal(true);
    }
  };

  // Configuration des colonnes pour TableContainer
  const columns = useMemo(
    () => [
      {
        header: "Produit",
        accessorKey: "name",
        enableColumnFilter: false,
        cell: (cell) => (
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0 me-3">
              <div className="avatar-sm bg-light rounded-circle p-1">
                <img
                  src={cell.row.original.image || dummyImg}
                  alt=""
                  className="img-fluid d-block rounded-circle"
                  onError={(e) => {
                    e.target.src = dummyImg;
                  }}
                />
              </div>
            </div>
            <div className="flex-grow-1">
              <h5 className="fs-14 mb-1">
                <a href="#" className="text-body">
                  {cell.getValue()}
                </a>
              </h5>
              <p className="text-muted mb-0">
                Catégorie: <span className="fw-medium">{cell.row.original.category || "Non spécifié"}</span>
              </p>
            </div>
          </div>
        ),
      },
      {
        header: "Stock",
        accessorKey: "stock",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className={cell.getValue() > 0 ? "text-success" : "text-danger"}>
            {cell.getValue() > 0 ? `${cell.getValue()} en stock` : "Rupture"}
          </span>
        ),
      },
      {
        header: "Prix",
        accessorKey: "price",
        enableColumnFilter: false,
        cell: (cell) => (
          <span>{formatNumber(cell.getValue())} abonnement_user</span>
        ),
      },
      {
        header: "Statut",
        accessorKey: "status",
        enableColumnFilter: false,
        cell: (cell) => {
          const status = cell.getValue();
          return (
            <span className={`badge badge-soft-${status === "En stock" ? "success" : "warning"} text-uppercase`}>
              {status}
            </span>
          );
        },
      },
      {
        header: "Action",
        cell: (cell) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle href="#" className="btn btn-soft-secondary btn-sm" tag="button">
                <i className="ri-more-fill" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem href="#">
                  <i className="ri-eye-fill align-bottom me-2 text-muted"></i> Voir
                </DropdownItem>
                <DropdownItem href="#">
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Modifier
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#">
                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Supprimer
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        },
      },
    ],
    []
  );

  // Données fictives pour les produits
  const sampleProducts = [];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyDataCard
        title="Erreur de chargement"
        description={error}
        actionButton={
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
            style={{ borderRadius: "20px" }}
          >
            <i className="ri-refresh-line me-1"></i>
            Réessayer
          </button>
        }
      />
    );
  }

  if (!contactDetails) {
    return (
      <EmptyDataCard
        title="Contact non trouvé"
        description="Le contact que vous recherchez n'existe pas ou a été supprimé."
        actionButton={
          <button
            className="btn btn-secondary"
            onClick={switchToList}
            style={{ borderRadius: "20px" }}
          >
            <i className="ri-arrow-left-line me-1"></i>
            Retour à la liste
          </button>
        }
      />
    );
  }

  document.title = `Détail Contact - ${contactDetails.nom || "Contact"} | INAWO - Suite de Gestion`;

  // Rendu conditionnel selon le type de contact
  const isClientOrFournisseur = contactDetails.type_contact === "Client" || contactDetails.type_contact === "Fournisseur";

  return (
    <React.Fragment>
      <BreadCrumb
        title={`Détail Contact - ${contactDetails.nom || "Contact"}`}
        pageTitle={
          <>
            <i className="ri-contacts-book-line me-1 align-bottom"></i>
            &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;&nbsp;
            <Link to="#" onClick={switchToList}>Contacts</Link>&nbsp;&gt;
          </>
        }
      />
      
      <Row>
        {/* Colonne de gauche - Informations du contact */}
        <div className="col-lg-4 mt-lg-2">
          <div className="d-flex flex-column h-100">
            <Card className="overflow-hidden flex-fill" style={{ borderRadius: "20px" }}>
              <div>
                <img src={smallImage9} alt="Bannière" className="img-fluid" />
              </div>
              <CardBody className="pt-0 mt-n5">
                <div className="text-center">
                  <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                    <img
                      src={contactDetails?.photo
                        ? `${BaseUrl}${contactDetails.photo}`
                        : avatar1}
                      className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                      alt="user-profile"
                      onError={(e) => {
                        e.target.src = avatar1;
                      }}
                    />
                    <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                      <input id="profile-img-file-input" type="file" className="profile-img-file-input" />
                      <label htmlFor="profile-img-file-input" className="profile-photo-edit avatar-xs">
                        <span className="avatar-title rounded-circle bg-light text-body">
                          <i className="ri-camera-fill"></i>
                        </span>
                      </label>
                    </div>
                  </div>
                  <h5 className="fs-16 mb-1">{contactDetails?.nom || "Nom inconnu"}</h5>
                  <p className="text-muted mb-0">
                    <Badge color="primary" className="rounded-pill">
                      {contactDetails?.type_contact || "Type inconnu"}
                    </Badge>
                  </p>
                  {contactDetails?.nom_entreprise && (
                    <p className="text-muted mb-0">{contactDetails.nom_entreprise}</p>
                  )}
                  {contactDetails?.categorie && (
                    <p className="text-muted mb-0">
                      <Badge color="secondary" className="rounded-pill">
                        {contactDetails.categorie}
                      </Badge>
                    </p>
                  )}
                </div>
              </CardBody>

              <Card>
                <CardBody style={{ overflowY: "auto" }}>
                  <div className="table-responsive">
                    <Table className="table-borderless mb-0">
                      <tbody>
                        <RenderContactInfo label="Nom" value={contactDetails?.nom} />
                        <RenderContactInfo label="Entreprise" value={contactDetails?.nom_entreprise} />
                        <RenderContactInfo label="Téléphone" value={contactDetails?.telephone} />
                        <RenderContactInfo label="Téléphone 2" value={contactDetails?.telephone2} />
                        <RenderContactInfo label="Email" value={contactDetails?.email} />
                        <RenderContactInfo label="Adresse" value={contactDetails?.adresse} />
                        <RenderContactInfo label="Revenu" value={contactDetails?.revenu} />
                        <RenderContactInfo
                          label={contactDetails?.categorie === "Particulier" ? "Date anniversaire" : "Date création"}
                          value={contactDetails?.date_anniversaire ? formatDate(contactDetails.date_anniversaire) : null}
                        />
                        <RenderContactInfo label="Site web" value={contactDetails?.site_web} />
                        <RenderContactInfo label="Forme juridique" value={contactDetails?.forme_juridique} />
                        <RenderContactInfo label="Capital social" value={contactDetails?.capital_social} />
                        <RenderContactInfo label="Numéro légal 1" value={contactDetails?.num_enreg_legal1} />
                        <RenderContactInfo label="Numéro légal 2" value={contactDetails?.num_enreg_legal2} />
                        <RenderContactInfo label="Type client" value={contactDetails?.type_client} />
                        <RenderContactInfo label="Nom contact" value={contactDetails?.nom_contact} />
                      </tbody>
                    </Table>
                  </div>
                  
                  {contactDetails?.commentaire && (
                    <div className="mt-3">
                      <Label className="form-label fw-bold">Commentaire</Label>
                      <div className="p-3 bg-light rounded" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        <p className="text-muted mb-0 small">{contactDetails.commentaire}</p>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
              
              <div className="card-body border-top">
                <div className="d-flex justify-content-center mb-4 pb-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ borderRadius: "20px" }}
                    onClick={handleEditClick}
                  >
                    <i className="ri-pencil-line me-1"></i>
                    Modifier informations
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Colonne de droite - Historiques et statistiques */}
        <div className="col-lg-8">
          {contactStats ? (
            // Affichage avec données détaillées
            <>
              {/* Historique des ventes */}
              <HistoriqueSection
                title="Historique des Ventes"
                data={contactStats.historique_ventes}
                emptyMessage="Aucune vente enregistrée pour ce contact"
                renderItem={renderVenteItem}
              />

              {/* Historique des factures */}
              <HistoriqueSection
                title="Historique des Factures"
                data={contactStats.historique_factures}
                emptyMessage="Aucune facture enregistrée pour ce contact"
                renderItem={renderFactureItem}
              />

              {/* Historique des opportunités */}
              <HistoriqueSection
                title="Historique des Opportunités"
                data={contactStats.historique_opportunites}
                emptyMessage="Aucune opportunité enregistrée pour ce contact"
                renderItem={renderOpportuniteItem}
              />

              {/* Historique des devis */}
              <HistoriqueSection
                title="Historique des Devis"
                data={contactStats.historique_devis}
                emptyMessage="Aucun devis enregistré pour ce contact"
                renderItem={renderFactureItem} // Réutiliser le même rendu que les factures
              />

              {/* Historique des approvisionnements fournisseur */}
              {contactDetails.type_contact === "Fournisseur" && (
                <HistoriqueSection
                  title="Historique des Approvisionnements"
                  data={contactStats.historique_approvisionnements_fournisseur}
                  emptyMessage="Aucun approvisionnement enregistré pour ce fournisseur"
                  renderItem={renderVenteItem} // Réutiliser le même rendu que les ventes
                />
              )}
            </>
          ) : (
            // Affichage pour contacts sans données détaillées
            <Card style={{ borderRadius: "20px" }}>
              <CardBody>
                <div className="text-center py-5">
                  <i className="ri-user-line display-4 text-muted"></i>
                  <h5 className="text-muted mt-3">Informations du contact</h5>
                  <p className="text-muted mb-4">
                    Ce contact est un {contactDetails.type_contact}. Les historiques détaillés 
                    ne sont disponibles que pour les contacts avec des données associées.
                  </p>
                  
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <div className="text-center p-3">
                        <i className="ri-calendar-line text-primary fs-2"></i>
                        <h6 className="mt-2">Date de création</h6>
                        <p className="text-muted mb-0">
                          {contactDetails?.created_at 
                            ? formatDate(contactDetails.created_at)
                            : "Non spécifiée"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-center p-3">
                        <i className="ri-refresh-line text-success fs-2"></i>
                        <h6 className="mt-2">Dernière modification</h6>
                        <p className="text-muted mb-0">
                          {contactDetails?.updated_at 
                            ? formatDate(contactDetails.updated_at)
                            : "Non spécifiée"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Bouton retour */}
          <div className="col-12 text-end mt-4">
            <button 
              type="button" 
              onClick={switchToList} 
              className="btn btn-secondary me-2" 
              style={{ borderRadius: "20px" }}
            >
              <i className="ri-arrow-left-line me-1"></i>
              Retour à la liste
            </button>
          </div>
        </div>
      </Row>

      {/* Modal de modification */}
      <Modal
        id="showModal"
        isOpen={modal}
        toggle={toggle}
        centered
        size="lg"
        contentClassName="custom-rounded-modal"
      >
        <ModalHeader className="bg-light p-3 rounded-top-20" toggle={toggle}>
          Modifier le contact
        </ModalHeader>
        <Form
          className="tablelist-form"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
          }}
        >
          <ModalBody>
            <Row className="g-3">
              <Col lg={12}>
                <div className="text-center">
                  <div className="position-relative d-inline-block">
                    <div className="position-absolute bottom-0 end-0">
                      <Label htmlFor="contact-image-input" className="mb-0">
                        <div className="avatar-xs cursor-pointer">
                          <div className="avatar-title bg-light border rounded-circle text-muted">
                            <i className="ri-image-fill"></i>
                          </div>
                        </div>
                      </Label>
                      <Input
                        className="form-control d-none"
                        id="contact-image-input"
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            validation.setFieldValue("photo", file);
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              document.getElementById("contact-img").src = event.target.result;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                    <div className="avatar-lg p-1">
                      <div className="avatar-title bg-light rounded-circle">
                        <img
                          src={
                            validation.values.photo instanceof File
                              ? URL.createObjectURL(validation.values.photo)
                              : order?.photo
                              ? `${BaseUrl}${order.photo}`
                              : dummyImg
                          }
                          alt="contact"
                          id="contact-img"
                          className="avatar-md rounded-circle object-fit-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <h5 className="fs-13 mt-3">Photo du contact</h5>
                </div>
              </Col>

              {/* Type contact */}
              <Col lg={6}>
                <div>
                  <Label htmlFor="type_contact" className="form-label">
                    Type contact <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="select"
                    name="type_contact"
                    value={validation.values.type_contact}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={validation.touched.type_contact && validation.errors.type_contact}
                    style={{ borderRadius: '20px' }}
                  >
                    <option value="">Sélectionner</option>
                    {typeContactOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Input>
                  {validation.touched.type_contact && validation.errors.type_contact && (
                    <FormFeedback>{validation.errors.type_contact}</FormFeedback>
                  )}
                </div>
              </Col>

              {/* Catégorie */}
              <Col lg={6}>
                <div>
                  <Label htmlFor="categorie" className="form-label">
                    Catégorie <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="select"
                    name="categorie"
                    value={validation.values.categorie}
                    onChange={(e) => {
                      handleCategoryChange(e);
                      validation.handleChange(e);
                    }}
                    onBlur={validation.handleBlur}
                    invalid={validation.touched.categorie && validation.errors.categorie}
                    style={{ borderRadius: '20px' }}
                  >
                    <option value="">Sélectionner</option>
                    {categorieOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Input>
                  {validation.touched.categorie && validation.errors.categorie && (
                    <FormFeedback>{validation.errors.categorie}</FormFeedback>
                  )}
                </div>
              </Col>

              {/* Type Client (uniquement pour les clients) */}
              {validation.values.type_contact === "Client" && (
                <Col lg={6}>
                  <div>
                    <Label htmlFor="type_client" className="form-label">
                      Type client
                    </Label>
                    <Input
                      type="select"
                      name="type_client"
                      value={validation.values.type_client}
                      onChange={validation.handleChange}
                      style={{ borderRadius: '20px' }}
                    >
                      <option value="">Sélectionner</option>
                      {typeClientOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Input>
                  </div>
                </Col>
              )}

              {/* Nom */}
              <Col lg={validation.values.type_contact === "Client" ? 6 : 12}>
                <div>
                  <Label htmlFor="nom" className="form-label">
                    {selectedCategorie === "Particulier" ? "Nom et Prénom" : "Nom"}
                    <span className="text-danger">*</span>
                  </Label>
                  <Input
                    name="nom"
                    value={validation.values.nom}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={validation.touched.nom && validation.errors.nom}
                    placeholder={selectedCategorie === "Particulier" ? "Entrez le nom et prénom" : "Entrez le nom"}
                    style={{ borderRadius: '20px' }}
                  />
                  {validation.touched.nom && validation.errors.nom && (
                    <FormFeedback>{validation.errors.nom}</FormFeedback>
                  )}
                </div>
              </Col>

              {/* Téléphone */}
              <Col lg={6}>
                <div>
                  <Label className="form-label">Téléphone</Label>
                  <PhoneInput
                    name="telephone"
                    value={validation.values.telephone}
                    onChange={(value) => validation.setFieldValue("telephone", value)}
                    countries={country}
                    defaultCountry="FR"
                    inputStyle={{ borderRadius: '20px' }}
                  />
                  {validation.touched.telephone && validation.errors.telephone && (
                    <div className="text-danger small">{validation.errors.telephone}</div>
                  )}
                </div>
              </Col>

              {/* Téléphone 2 */}
              <Col lg={6}>
                <div>
                  <Label className="form-label">Téléphone 2</Label>
                  <PhoneInput
                    name="telephone2"
                    value={validation.values.telephone2}
                    onChange={(value) => validation.setFieldValue("telephone2", value)}
                    countries={country}
                    defaultCountry="FR"
                    inputStyle={{ borderRadius: '20px' }}
                  />
                  {validation.touched.telephone2 && validation.errors.telephone2 && (
                    <div className="text-danger small">{validation.errors.telephone2}</div>
                  )}
                </div>
              </Col>

              {/* Email */}
              <Col lg={6}>
                <div>
                  <Label htmlFor="email" className="form-label">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={validation.values.email}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    invalid={validation.touched.email && validation.errors.email}
                    placeholder="Entrez votre email"
                    style={{ borderRadius: '20px' }}
                  />
                  {validation.touched.email && validation.errors.email && (
                    <FormFeedback>{validation.errors.email}</FormFeedback>
                  )}
                </div>
              </Col>

              {/* Adresse */}
              <Col lg={6}>
                <div>
                  <Label htmlFor="adresse" className="form-label">Adresse</Label>
                  <Input
                    name="adresse"
                    value={validation.values.adresse}
                    onChange={validation.handleChange}
                    placeholder="Entrez votre adresse"
                    style={{ borderRadius: '20px' }}
                  />
                </div>
              </Col>

              {/* Date anniversaire/création */}
              <Col lg={6}>
                <div>
                  <Label htmlFor="date_anniversaire" className="form-label">
                    {selectedCategorie === "Particulier" ? "Date d'anniversaire" : "Date de création"}
                  </Label>
                  <Flatpickr
                    className="form-control"
                    value={validation.values.date_anniversaire}
                    onChange={(date) => validation.setFieldValue("date_anniversaire", date[0])}
                    options={{
                      dateFormat: "Y-m-d",
                      maxDate: new Date(),
                    }}
                    style={{ borderRadius: '20px' }}
                  />
                </div>
              </Col>

              {/* Site web */}
              <Col lg={6}>
                <div>
                  <Label htmlFor="site_web" className="form-label">Site web</Label>
                  <Input
                    name="site_web"
                    value={validation.values.site_web}
                    onChange={validation.handleChange}
                    placeholder="https://example.com"
                    style={{ borderRadius: '20px' }}
                  />
                </div>
              </Col>

              {/* Commentaire */}
              <Col lg={12}>
                <div>
                  <Label htmlFor="commentaire" className="form-label">Commentaire</Label>
                  <Input
                    name="commentaire"
                    type="textarea"
                    rows="3"
                    value={validation.values.commentaire}
                    onChange={validation.handleChange}
                    placeholder="Ajoutez un commentaire"
                    style={{ borderRadius: '20px' }}
                  />
                </div>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-light"
              onClick={toggle}
              style={{ borderRadius: '20px' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
              style={{ borderRadius: '20px' }}
            >
              {loading ? "Enregistrement..." : "Mettre à jour"}
            </button>
          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default ContactsDetails;