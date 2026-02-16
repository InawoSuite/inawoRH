// import Pagination from "../../../Components/Common/Pagination";
// import PhoneInput from "../../../Components/ContactDeleteModal/CountryPhoneInput";
// import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
// import SearchAndActionBar from "../../../Components/Common/SearchAndActionBar";
// import "react-phone-number-input/style.css";
// import EmptyDataCard from "../../../Components/Common/EmptyDataCard";
// import {
//   ShowIf,
//   WithPermission,
// } from "../../../Components/Permissions/WithPermission";
// import { usePermissionCheck } from "../../../Components/Hooks/usePermissionCheck";
// import "../../../App.css";
// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import {
//   Card,
//   CardBody,
//   Col,
//   Container,
//   CardHeader,
//   Nav,
//   NavItem,
//   NavLink,
//   Row,
//   Modal,
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownToggle,
//   ModalHeader,
//   Form,
//   ModalBody,
//   ModalFooter,
//   Label,
//   Input,
//   FormFeedback,
//   FormGroup,
//   Button,
// } from "reactstrap";
// import * as moment from "moment";
// import { jwtDecode } from "jwt-decode";
// import { Link, Route } from "react-router-dom";
// import classnames from "classnames";
// import Flatpickr from "react-flatpickr";
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import TableContainer from "../../../Components/Common/TableContainer";
// import DeleteModal from "../../../Components/Common/DeleteModal";
// import { country } from "../../../common/data";

// // Importer le drapeau des US
// import us from "../../../assets/images/flags/us.svg";

// // Formik
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import dummyImg from "../../../assets/images/users/user-dummy-img.jpg";
// import Loader from "../../../Components/Common/Loader";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useProfile } from "../../../Components/Hooks/UserHooks";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useSidebar } from "../../../contexts/SidebarContext";
// import { useTranslation } from "react-i18next";
// import axios from "axios";
// import Contact from "./Contact";
// import { CustomSelect } from "../../../Components/Common/CustomSelectStyles";
// import { BaseUrl } from "../../APIKey/ApiKey";
// import SubscriptionRestrictionMessage from "../../../Components/Common/SubscriptionRestrictionMessage";
// import withRouter from "../../../Components/Common/withRouter";
// import { withTranslation } from "react-i18next";

// const AppContact = ({ switchToDetails, t }) => {
//   const location = useLocation();
//   const [isValid, setIsValid] = useState(true);
//   const [modal, setModal] = useState(false);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [sortBy, setsortBy] = useState("Owner");
//   const [activeTab, setActiveTab] = useState("1");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [orders, setOrders] = useState([]);
//   const {
//     canViewContact,
//     canAddContact,
//     canEditContact,
//     canDeleteContact,
//     isMainAdmin,
//   } = usePermissionCheck();

//   const [userPermissions, setUserPermissions] = useState(null);
//   const [permissionsLoading, setPermissionsLoading] = useState(true);

//   // Fonction pour récupérer les permissions
//   useEffect(() => {
//     const fetchUserPermissions = async () => {
//       if (!userProfile?.id || !token) {
//         setPermissionsLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(
//           `https://inawoapiv3.inawo.pro/utilisateurs/user-permissions/${userProfile.id}/`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`Erreur HTTP: ${response.status}`);
//         }

//         const permissionsData = await response.json();
//         setUserPermissions(permissionsData);
//       } catch (error) {
//         console.error(
//           "❌ Erreur lors de la récupération des permissions:",
//           error
//         );
//         setUserPermissions({ is_admin: false, permissions: [] });
//       } finally {
//         setPermissionsLoading(false);
//       }
//     };

//     fetchUserPermissions();
//   }, [userProfile?.id, token]);

//   // Fonction pour vérifier les permissions
//   const hasPermission = (permissionCode) => {
//     if (permissionsLoading || !userPermissions) {
//       return false;
//     }

//     // Si l'utilisateur est admin, il a toutes les permissions
//     if (userPermissions.is_admin === true) {
//       return true;
//     }

//     // Si pas de permission spécifique demandée, autoriser par défaut
//     if (!permissionCode) {
//       return true;
//     }

//     // Vérifier dans le tableau des permissions
//     return userPermissions.permissions.includes(permissionCode);
//   };

//   // Déplacer useSidebar ici, au niveau racine du composant
//   const { activateSidebarMenu } = useSidebar();

//   const deleteCheckbox = () => {
//     const ele = document.querySelectorAll(".orderCheckBox:checked");
//     ele.length > 0
//       ? setIsMultiDeleteButton(true)
//       : setIsMultiDeleteButton(false);
//     setSelectedCheckBoxDelete(ele);
//   };

//   // Options pour les sélecteurs - CORRIGÉ avec traduction
//   const typeContactOptions = useMemo(
//     () => [
//       { value: "Client", label: t("Client") },
//       { value: "Prospect", label: t("Prospect") },
//       { value: "Fournisseur", label: t("Fournisseur") },
//       { value: "Partenaire", label: t("Partenaire") },
//     ],
//     [t]
//   );

//   const categorieOptions = useMemo(
//     () => [
//       { value: "Particulier", label: t("Particulier") },
//       { value: "Entreprise", label: t("Entreprise") },
//       { value: "Institution", label: t("Institution") },
//       { value: "Association", label: t("Association") },
//       { value: "Administration", label: t("Administration") },
//       { value: "ONG", label: t("ONG") },
//       { value: "Fondation", label: t("Fondation") },
//       {
//         value: "Groupement d'intérêt économie(GE)",
//         label: t("Groupement d'intérêt économie(GE)"),
//       },
//     ],
//     [t]
//   );

//   const typeClientOptions = useMemo(
//     () => [
//       { value: "Detaillant", label: t("Détaillant") },
//       { value: "Grossiste", label: t("Grossiste") },
//       { value: "VIP", label: t("VIP") },
//     ],
//     [t]
//   );

//   const formeJuridiqueOptions = useMemo(
//     () => [
//       { value: "Entreprise Individuelle", label: t("Entreprise Individuelle") },
//       {
//         value: "Société à Responsabilité Limitée(SARL)",
//         label: t("Société à Responsabilité Limitée(SARL)"),
//       },
//       {
//         value: "Société Unipersonnelle à Responsabilité Limitée(SARL)",
//         label: t("Société Unipersonnelle à Responsabilité Limitée(SARL)"),
//       },
//       { value: "Société Anonyme(SA)", label: t("Société Anonyme(SA)") },
//       {
//         value: "Société en Nom Collectif(SNC)",
//         label: t("Société en Nom Collectif(SNC)"),
//       },
//       { value: "Société Coopérative", label: t("Société Coopérative") },
//     ],
//     [t]
//   );

//   const revenuOptions = useMemo(
//     () => [
//       { value: "0-100000", label: "0 - 100000" },
//       { value: "100000-250000", label: "100000 - 250000" },
//       { value: "250000-500000", label: "250000 - 500000" },
//       { value: "500000-1000000", label: "500000 - 1000000" },
//       { value: "1000000-10000000", label: "1000000 - 10000000" },
//     ],
//     []
//   );

//   const [activeFilter, setActiveFilter] = useState("all");
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const tabMap = {
//     all: "1",
//     Client: "2",
//     Fournisseur: "3",
//     Prospect: "5",
//     Partenaire: "6",
//   };

//   const [selectedCategorie, setselectedCategorie] = useState("");
//   const [selectedTypeContact, setSelectedTypeContact] = useState("");
//   const [orderList, setOrderList] = useState([]);
//   const [order, setOrder] = useState(null);
//   const [isExportCSV, setIsExportCSV] = useState(false);

//   // État pour stocker les contacts
//   const [contacts, setContacts] = useState([]);
//   const [filteredContacts, setFilteredContacts] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(country[0]);
//   const [selectedCountry2, setSelectedCountry2] = useState(country[0]);
//   const [dropdownOpen2, setDropdownOpen2] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [isLinked, setIsLinked] = useState(false);
//   const [deleteModalMulti, setDeleteModalMulti] = useState(false);
//   const { userProfile, token, loading: profileLoading } = useProfile();
//   const [isSaving, setIsSaving] = useState(false);
//   const [afficherPlus, setAfficherPlus] = useState(false);

//   // Corrigez l'effet de recherche :
//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = contacts.filter(
//         (item) =>
//           // Recherche dans le nom (particulier) ou nom_entreprise
//           (item.nom &&
//             item.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
//           (item.nom_entreprise &&
//             item.nom_entreprise
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase())) ||
//           // Recherche dans l'email
//           (item.email &&
//             item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
//           // Recherche dans le téléphone
//           (item.telephone && item.telephone.includes(searchTerm)) ||
//           // Recherche dans le type de contact
//           (item.type_contact &&
//             item.type_contact
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase())) ||
//           // Recherche dans la catégorie
//           (item.categorie &&
//             item.categorie.toLowerCase().includes(searchTerm.toLowerCase())) ||
//           // Recherche dans l'adresse
//           (item.adresse &&
//             item.adresse.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredContacts(filtered);
//       setCurrentPage(1); // Réinitialiser à la première page
//     } else {
//       // Si pas de terme de recherche, appliquer le filtre actuel de l'onglet
//       const currentType = Object.keys(tabMap).find(
//         (key) => tabMap[key] === activeTab
//       );
//       const filtered =
//         currentType === "all"
//           ? contacts
//           : contacts.filter((contact) => contact.type_contact === currentType);

//       setFilteredContacts(filtered);
//       setCurrentPage(1);
//     }
//   }, [searchTerm, contacts, activeTab]);

//   const getEntrepriseId = () => {
//     try {
//       if (userProfile?.entreprise?.id) {
//         return userProfile.entreprise.id;
//       }

//       const localUser = JSON.parse(localStorage.getItem("user"));
//       if (localUser?.entreprise?.id) {
//         return localUser.entreprise.id;
//       }

//       const token = localStorage.getItem("access_token");
//       if (token) {
//         const decoded = jwtDecode(token);
//         if (decoded.entreprise_id) {
//           return decoded.entreprise_id;
//         }
//       }
//     } catch (error) {
//       console.error("Erreur getEntrepriseId:", error);
//       toast.error(
//         <span style={{ fontWeight: "bold", color: "red" }}>
//           {t("Impossible de déterminer l'entreprise")}
//         </span>,
//         {
//           position: "top-center",
//           autoClose: 4000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         }
//       );
//     }
//   };

//   const handleAfficherPlus = () => {
//     setAfficherPlus(!afficherPlus);
//   };

//   const isTokenValid = (token) => {
//     try {
//       const decoded = jwtDecode(token);
//       const now = Date.now() / 1000;
//       return decoded.exp > now;
//     } catch (error) {
//       console.error("Erreur de décodage:", error);
//       return false;
//     }
//   };

//   // Fonction pour les contacts
//   const fetchContacts = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${BaseUrl}/utilisateurs/createlistecontacte/`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         if (response.status === 401) {
//           const newToken = await refreshToken();
//           if (newToken) {
//             return fetchContacts();
//           }
//           throw new Error(t("Session expirée - Veuillez vous reconnecter"));
//         }
//         throw new Error(`Erreur HTTP: ${response.status}`);
//       }

//       const data = await response.json();

//       let contactsArray = [];

//       if (data.contacts && data.contacts.mes_contacts) {
//         contactsArray = data?.contacts?.mes_contacts;
//       } else if (Array.isArray(data)) {
//         contactsArray = data;
//       } else if (data.results) {
//         contactsArray = data.results;
//       } else if (data.data) {
//         contactsArray = data.data;
//       }

//       setContacts(contactsArray);
//       setFilteredContacts(contactsArray);
//     } catch (error) {
//       console.error("Erreur fetchContacts:", error);
//       toast.error(t("Impossible de charger les contacts"));
//       setContacts([]);
//       setFilteredContacts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const isValidPhoneNumber = (phone) => {
//     const phoneRegex = /^\+?[0-9\s-]+$/;
//     return phoneRegex.test(phone);
//   };

//   const isValidURL = (url) => {
//     try {
//       new URL(url);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   // Fonction pour rafraîchir le token
//   const refreshToken = async () => {
//     const refreshToken = localStorage.getItem("refresh_token");

//     try {
//       const response = await fetch(`${BaseUrl}/token/refresh/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ refresh: refreshToken }),
//       });

//       const data = await response.json();
//       localStorage.setItem("access_token", data.access);
//       return data.access;
//     } catch (error) {
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       return null;
//     }
//   };

//   const handleSave = async (formData) => {
//     setIsSaving(true);

//     if (isEdit && !canEditContact) {
//       toast.error(t("Vous n'avez pas la permission de modifier ce contact"));
//       setIsSaving(false);
//       return;
//     }

//     if (!isEdit && !canAddContact) {
//       toast.error(t("Vous n'avez pas la permission d'ajouter un contact"));
//       setIsSaving(false);
//       return;
//     }

//     try {
//       const formDataToSend = new FormData();

//       formDataToSend.append("entreprise", getEntrepriseId());
//       formDataToSend.append("nom_contact", formData.nom_contact || "");
//       selectedTypeContact == "Client"
//         ? formDataToSend.append("type_client", formData.type_client || "")
//         : formDataToSend.append("type_client", "");
//       formDataToSend.append("categorie", formData.categorie || "");
//       formDataToSend.append("nom", formData.nom || "");
//       formDataToSend.append("email", formData.email || "");
//       formDataToSend.append("telephone", `${formData.telephone}` || "");
//       formDataToSend.append(
//         "telephone2",
//         formData.telephone2 ? `${formData.telephone2}` : ""
//       );
//       formDataToSend.append("adresse", formData.adresse || "");
//       formDataToSend.append("type_contact", formData.type_contact || "");
//       formDataToSend.append("capital_social", formData.capital_social || "");
//       formDataToSend.append("site_web", formData.site_web || "");
//       formDataToSend.append("commentaire", formData.commentaire || "");
//       formDataToSend.append("nom_entreprise", formData.nom_entreprise || "");
//       formDataToSend.append(
//         "num_enreg_legal1",
//         formData.num_enreg_legal1 || ""
//       );
//       formDataToSend.append(
//         "num_enreg_legal2",
//         formData.num_enreg_legal2 || ""
//       );
//       formDataToSend.append("forme_juridique", formData.forme_juridique || "");
//       formDataToSend.append("revenu", formData.revenu || "");

//       if (formData.photo instanceof File) {
//         formDataToSend.append("photo", formData.photo);
//       }

//       if (formData.date_anniversaire) {
//         formDataToSend.append(
//           "date_anniversaire",
//           moment(formData.date_anniversaire).format("YYYY-MM-DD")
//         );
//       }

//       const response = await fetch(
//         `${BaseUrl}/utilisateurs/createlistecontacte/`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formDataToSend,
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         console.error("API Error Response:", data);
//         throw new Error(data.message || t("Erreur serveur"));
//       }

//       toast.success(
//         <span style={{ fontWeight: "bold", color: "#16a34a" }}>
//           {t("Contact créé avec succès!")}
//         </span>,
//         {
//           position: "top-right",
//           autoClose: 4000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         }
//       );
//       fetchContacts();
//       setModal(false);
//       return data;
//     } catch (error) {
//       console.error("Full error details:", error);
//       toast.error(
//         <span style={{ fontWeight: "bold", color: "red" }}>
//           {error.message || t("Erreur lors de la création du contact")}
//         </span>,
//         {
//           position: "top-right",
//           autoClose: 4000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         }
//       );
//       throw error;
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const currentId = isEdit && order ? order.id : null;

//   const updateContact = async (id, data) => {
//     if (!id) {
//       throw new Error(t("ID du contact manquant pour la mise à jour"));
//     }

//     try {
//       const payload = {
//         ...data,
//         entreprise: getEntrepriseId(),
//         date_anniversaire: data.date_anniversaire
//           ? moment(data.date_anniversaire).format("YYYY-MM-DD")
//           : null,
//         telephone: data.telephone
//           ? `${selectedCountry.countryCode}${data.telephone}`
//           : null,
//         telephone2: data.telephone2
//           ? `${selectedCountry2.countryCode}${data.telephone2}`
//           : null,
//       };

//       const response = await fetch(`${BaseUrl}/utilisateurs/contacte/${id}/`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         console.error("Détails de l'erreur:", errorData);
//         throw new Error(
//           errorData.detail ||
//             errorData.message ||
//             `Erreur HTTP ${response.status}`
//         );
//       }

//       return await response.json();
//     } catch (error) {
//       console.error("Erreur détaillée:", error);
//       throw error;
//     }
//   };

//   const handleUpdateContact = async (id, formData) => {
//     setIsSaving(true);

//     try {
//       const formDataToSend = new FormData();

//       formDataToSend.append("entreprise", getEntrepriseId() || "");
//       formDataToSend.append("nom", formData.nom || "");
//       formDataToSend.append("email", formData.email || "");
//       formDataToSend.append("adresse", formData.adresse || "");
//       formDataToSend.append("nom_entreprise", formData.nom_entreprise || "");
//       formDataToSend.append("nom_contact", formData.nom_contact || "");
//       formDataToSend.append("telephone", formData.telephone || "");
//       formDataToSend.append("telephone2", formData.telephone2 || "");

//       if (formData.date_anniversaire) {
//         formDataToSend.append(
//           "date_anniversaire",
//           moment(formData.date_anniversaire).format("YYYY-MM-DD")
//         );
//       }

//       formDataToSend.append("site_web", formData.site_web || "");
//       formDataToSend.append("commentaire", formData.commentaire || "");
//       formDataToSend.append("type_contact", formData.type_contact || "");
//       formDataToSend.append("capital_social", formData.capital_social || "");
//       formDataToSend.append(
//         "num_enreg_legal1",
//         formData.num_enreg_legal1 || ""
//       );
//       formDataToSend.append(
//         "num_enreg_legal2",
//         formData.num_enreg_legal2 || ""
//       );
//       formDataToSend.append("revenu", formData.revenu || "");
//       formDataToSend.append("forme_juridique", formData.forme_juridique || "");

//       if (formData.photo instanceof File) {
//         formDataToSend.append("photo", formData.photo);
//       } else if (formData.photo) {
//         formDataToSend.append("photo", formData.photo);
//       }

//       const response = await fetch(`${BaseUrl}/utilisateurs/contacte/${id}/`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         console.error("Erreur de l'API:", errorData);
//         throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
//       }

//       const updatedContact = await response.json();

//       setContacts((prev) =>
//         prev.map((item) =>
//           item.id === id ? { ...item, ...updatedContact } : item
//         )
//       );

//       setFilteredContacts((prev) =>
//         prev.map((item) =>
//           item.id === id ? { ...item, ...updatedContact } : item
//         )
//       );

//       toast.success(t("Contact mis à jour avec succès!"));
//       setModal(false);
//       fetchContacts();
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour:", error);
//       toast.error(`${t("Échec de la mise à jour")}: ${error.message}`);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Fonction pour déclencher la suppression
//   const onClickDelete = (contact) => {
//     setOrder(contact);
//     setDeleteModal(true);
//   };

//   // Fonction pour exécuter la suppression
//   const handleDeleteOrder = async () => {
//     if (!order?.id) return;

//     try {
//       const response = await fetch(
//         `${BaseUrl}/utilisateurs/deletecontacte/${order.id}/`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const data = await response.json();

//       switch (response.status) {
//         case 200:
//           setContacts((prev) => prev.filter((c) => c.id !== order.id));
//           toast.success(data.message || t("Contact supprimé"));
//           break;

//         case 400:
//           toast.error(
//             data.message ||
//               t(
//                 "Impossible de supprimer - contact utilisé dans des transactions"
//               )
//           );
//           return;

//         case 404:
//           toast.error(t("Contact introuvable"));
//           break;

//         default:
//           throw new Error(data.message || `Erreur ${response.status}`);
//       }

//       setDeleteModal(false);
//     } catch (error) {
//       console.error("Erreur suppression:", error);
//       toast.error(
//         <span style={{ fontWeight: "bold", color: "red" }}>
//           {t("Erreur technique lors de la suppression")}
//         </span>,
//         {
//           position: "top-center",
//           autoClose: 4000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         }
//       );
//     }
//   };

//   useEffect(() => {
//     setOrderList(filteredContacts);
//   }, [filteredContacts]);

//   // VALIDATION FORMIK - CORRIGÉ avec traductions
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
//       date_anniversaire:
//         order && order.date_anniversaire
//           ? moment(order.date_anniversaire).format("YYYY-MM-DD")
//           : "",
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
//       type_client: Yup.string(),
//       nom_contact: Yup.string(),
//       segment: Yup.string(),
//       nom: Yup.string().required(t("Veuillez entrer un nom")),
//       nom_entreprise: Yup.string(),
//       telephone: Yup.string().test(
//         "is-valid-phone",
//         t("Numéro invalide"),
//         function (value) {
//           if (!value) return true;
//           const strValue = String(value);
//           return strValue.startsWith("+") && strValue.length > 6;
//         }
//       ),
//       telephone2: Yup.string().test(
//         "is-valid-phone",
//         t("Numéro invalide"),
//         function (value) {
//           if (!value) return true;
//           const strValue = String(value);
//           return strValue.startsWith("+") && strValue.length > 6;
//         }
//       ),
//       email: Yup.string().email(t("Veuillez entrer un email valide")),
//       adresse: Yup.string(),
//       date_anniversaire: Yup.date()
//         .nullable()
//         .typeError(t("Veuillez entrer une date valide"))
//         .max(new Date(), t("La date ne peut pas être dans le futur"))
//         .test(
//           "is-valid-format",
//           t("Format de date invalide (YYYY-MM-DD requis)"),
//           (value) => !value || moment(value, "YYYY-MM-DD", true).isValid()
//         ),
//       site_web: Yup.string().nullable(),
//       categorie: Yup.string().required(
//         t("Veuillez sélectionner une catégorie")
//       ),
//       type_contact: Yup.string().required(
//         t("Veuillez sélectionner un type de contact")
//       ),
//       forme_juridique: Yup.string(),
//       capital_social: Yup.number()
//         .typeError(t("Veuillez entrer un montant valide"))
//         .positive(t("Le capital doit être un nombre positif")),
//       num_enreg_legal1: Yup.string(),
//       num_enreg_legal2: Yup.string(),
//       revenu: Yup.string(),
//       commentaire: Yup.string(),
//       photo: Yup.mixed().nullable(),
//     }),

//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         console.log("Données à soumettre:", values);
//         console.log("Mode édition:", isEdit);
//         console.log("ID du contact:", order?.id);

//         if (isEdit) {
//           if (!order?.id) {
//             throw new Error(t("Aucun ID de contact spécifié pour l'édition"));
//           }
//           await handleUpdateContact(order.id, values);
//         } else {
//           await handleSave(values);
//         }
//         setModal(false);
//         fetchContacts();
//       } catch (error) {
//         console.error("Erreur:", error);
//         toast.error(error.message || t("Erreur lors de l'enregistrement"));
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   // Gestion du formulaire avec Formik
//   const handleCategoryChange = useCallback(
//     (e) => {
//       const selectedValue = e.target.value;
//       setselectedCategorie(selectedValue);
//       validation.setFieldValue("categorie", selectedValue);
//     },
//     [validation]
//   );

//   useEffect(() => {
//     setselectedCategorie(validation.values.categorie || "");
//   }, [validation.values.categorie]);

//   // 1. Configuration des onglets - CORRIGÉ avec traductions
//   const navTabsData = useMemo(
//     () => [
//       {
//         key: "1",
//         label: t("Tous les contacts"),
//         icon: "ri-store-2-fill",
//         filterType: "all",
//         menuId: "contacts-all",
//       },
//       {
//         key: "2",
//         label: t("Clients"),
//         icon: "ri-checkbox-circle-line",
//         filterType: "Client",
//         menuId: "contacts-client",
//       },
//       {
//         key: "3",
//         label: t("Fournisseurs"),
//         icon: "ri-checkbox-circle-line",
//         filterType: "Fournisseur",
//         menuId: "contacts-fournisseur",
//       },
//       {
//         key: "5",
//         label: t("Prospects"),
//         icon: "ri-checkbox-circle-line",
//         filterType: "Prospect",
//         menuId: "contacts-prospect",
//       },
//       {
//         key: "6",
//         label: t("Partenaires"),
//         icon: "ri-checkbox-circle-line",
//         filterType: "Partenaire",
//         menuId: "contacts-partenaire",
//       },
//     ],
//     [t]
//   );

//   // 2. Fonction toggleTab corrigée - SANS useSidebar à l'intérieur
//   const toggleTab = useCallback(
//     (tabKey, contactType, menuId) => {
//       console.log("toggleTab appelé:", tabKey, contactType, menuId);

//       if (activeTab !== tabKey) {
//         setActiveTab(tabKey);

//         // Active le menu sidebar correspondant - utilise la variable du contexte
//         if (activateSidebarMenu) {
//           activateSidebarMenu(contactType);
//         }

//         // Filtrer les contacts localement
//         const filtered =
//           contactType === "all"
//             ? contacts
//             : contacts.filter(
//                 (contact) => contact.type_contact === contactType
//               );

//         setFilteredContacts(filtered);
//         setCurrentPage(1);

//         // Navigation vers l'URL correspondante
//         const currentPath = window.location.pathname;
//         navigate(`${currentPath}?type=${contactType}`);
//       }
//     },
//     [activeTab, contacts, activateSidebarMenu, navigate]
//   );

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const type = urlParams.get("type");

//     console.log("Type depuis URL:", type);

//     if (type && tabMap[type]) {
//       const tabNumber = tabMap[type];
//       if (activeTab !== tabNumber) {
//         console.log("Synchronisation URL -> Onglet:", type, "->", tabNumber);
//         setActiveTab(tabNumber);

//         // Active le menu sidebar correspondant
//         if (activateSidebarMenu) {
//           activateSidebarMenu(type);
//         }

//         // Filtrer les contacts selon le type
//         const filtered =
//           type === "all"
//             ? contacts
//             : contacts.filter((contact) => contact.type_contact === type);

//         setFilteredContacts(filtered);
//         setCurrentPage(1);
//       }
//     } else if (!type && activeTab !== "1") {
//       // Si pas de type dans l'URL mais l'onglet actif n'est pas "Tous"
//       setActiveTab("1");
//       if (activateSidebarMenu) {
//         activateSidebarMenu("all");
//       }
//       setFilteredContacts(contacts);
//       setCurrentPage(1);
//     }
//   }, [window.location.search, contacts, activeTab, activateSidebarMenu]);

//   // 3. Fonction handleTabChange
//   const handleTabChange = useCallback(
//     (tabKey, tabData) => {
//       console.log("Tab cliqué:", tabKey, tabData);
//       toggleTab(tabKey, tabData.filterType, tabData.menuId);
//     },
//     [toggleTab]
//   );

//   useEffect(() => {
//     setSelectedTypeContact(validation.values.type_contact || "");
//   }, [validation.values.type_contact]);

//   // FONCTION toggle
//   const toggle = useCallback(() => {
//     if (modal) {
//       setModal(false);
//       setOrder(null);
//       setIsEdit(false);
//       validation.resetForm();
//       setAfficherPlus(false);
//       setselectedCategorie("");
//       setSelectedTypeContact("");
//     } else {
//       setModal(true);
//     }
//   }, [modal, validation]);

//   //FONCTION handleOrderClick
//   const handleOrderClick = useCallback(
//     (contact) => {
//       console.log("Contact sélectionné pour édition:", contact);

//       setOrder(contact);
//       setIsEdit(true);

//       setselectedCategorie(contact.categorie || "");
//       setSelectedTypeContact(contact.type_contact || "");

//       toggle();
//     },
//     [toggle]
//   );

//   //useEffect POUR SYNCHRONISER LES SELECTS
//   useEffect(() => {
//     if (isEdit && order) {
//       console.log(
//         "Synchronisation des selects avec les données du contact:",
//         order
//       );

//       if (order.categorie) {
//         setselectedCategorie(order.categorie);
//       }
//       if (order.type_contact) {
//         setSelectedTypeContact(order.type_contact);
//       }

//       validation.setValues({
//         type_client: order.statut_contacte || "Détaillant",
//         nom_contact: order.nom_contact || "",
//         segment: order.segment || "",
//         nom: order.nom || "",
//         nom_entreprise: order.nom_entreprise || "",
//         telephone: order.telephone || "",
//         telephone2: order.telephone2 || "",
//         email: order.email || "",
//         adresse: order.adresse || "",
//         date_anniversaire: order.date_anniversaire
//           ? moment(order.date_anniversaire).format("YYYY-MM-DD")
//           : "",
//         site_web: order.site_web || "",
//         categorie: order.categorie || "",
//         type_contact: order.type_contact || "",
//         forme_juridique: order.forme_juridique || "",
//         capital_social: order.capital_social || "",
//         num_enreg_legal1: order.num_enreg_legal1 || "",
//         num_enreg_legal2: order.num_enreg_legal2 || "",
//         revenu: order.revenu || "",
//         commentaire: order.commentaire || "",
//         photo: order.photo || null,
//       });
//     }
//   }, [isEdit, order]);

//   // Gestion des menus
//   const updateMenuSelection = (type) => {
//     validation.setFieldValue("type_contact", type);
//   };

//   const [searchParams, setSearchParams] = useState("");

//   useEffect(() => {
//     setSearchParams(window.location.search);

//     const handlePopState = () => {
//       setSearchParams(window.location.search);
//     };

//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, []);

//   useEffect(() => {
//     if (searchParams) {
//       const params = new URLSearchParams(searchParams);
//       const type = params.get("type");

//       if (type) {
//         if (tabMap[type]) {
//           setActiveTab(tabMap[type]);
//         }
//       }
//     }
//   }, [searchParams]);

//   // Dans votre composant principal, ajoutez ce useEffect
//   useEffect(() => {
//     if (validation.values.telephone) {
//       const foundCountry = country.find((c) =>
//         validation.values.telephone.startsWith(c.countryCode)
//       );
//       if (foundCountry) setSelectedCountry(foundCountry);
//     }

//     if (validation.values.telephone2) {
//       const foundCountry2 = country.find((c) =>
//         validation.values.telephone2.startsWith(c.countryCode)
//       );
//       if (foundCountry2) setSelectedCountry2(foundCountry2);
//     }
//   }, [validation.values.telephone, validation.values.telephone2]);

//   // Calculer les données paginées
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(50);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredContacts.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   // Checked All
//   const checkedAll = useCallback(() => {
//     const checkall = document.getElementById("checkBoxAll");
//     const ele = document.querySelectorAll(".orderCheckBox");

//     if (checkall.checked) {
//       ele.forEach((ele) => {
//         ele.checked = true;
//       });
//     } else {
//       ele.forEach((ele) => {
//         ele.checked = false;
//       });
//     }
//     deleteCheckbox();
//   }, []);

//   // Delete Multiple
//   const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
//   const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

//   const deleteMultiple = () => {
//     const checkall = document.getElementById("checkBoxAll");
//     const ids = selectedCheckBoxDelete.map((item) => item.value);
//     const updatedContacts = contacts.filter((item) => !ids.includes(item.id));
//     setContacts(updatedContacts);
//     setFilteredContacts(updatedContacts);
//     checkall.checked = false;
//     setIsMultiDeleteButton(false);
//     toast.success(t("Contacts sélectionnés supprimés avec succès"), {
//       autoClose: 3000,
//     });
//   };

//   // Triez les contacts par nom avant de les paginer
//   const sortedContacts = useMemo(() => {
//     return [...(filteredContacts || [])].sort((a, b) => {
//       const getSortableName = (contact) => {
//         const name =
//           contact.categorie === "Particulier"
//             ? contact.nom
//             : contact.nom_entreprise;

//         return {
//           name: name || "",
//           hasName: !!name,
//         };
//       };

//       const aName = getSortableName(a);
//       const bName = getSortableName(b);

//       if (aName.hasName !== bName.hasName) {
//         return aName.hasName ? -1 : 1;
//       }

//       return aName.name.localeCompare(bName.name, "fr", {
//         sensitivity: "base",
//       });
//     });
//   }, [filteredContacts]);

//   // Column - CORRIGÉ avec traductions
//   // const columns = useMemo(
//   //   () => [
//   //     {
//   //       header: "#",
//   //       enableColumnFilter: false,
//   //       cell: (cell) => {
//   //         const totalItems = filteredContacts?.length || 0;
//   //         const itemPosition =
//   //           cell.row.index + 1 + (currentPage - 1) * itemsPerPage;
//   //         const reverseIndex = totalItems - itemPosition + 1;

//   //         const displayIndex =
//   //           totalItems > 0 && reverseIndex > 0
//   //             ? reverseIndex
//   //             : cell.row.index + 1;

//   //         return (
//   //           <span
//   //             style={{
//   //               display: "inline-block",
//   //               width: "100%",
//   //               textAlign: "center",
//   //             }}
//   //           >
//   //             {displayIndex}
//   //           </span>
//   //         );
//   //       },
//   //       id: "index",
//   //       size: 50,
//   //     },
//   //     {
//   //       header: t("Nom"),
//   //       accessorKey: "nom",
//   //       enableColumnFilter: false,
//   //       headerStyle: { fontWeight: "normal" },
//   //       cell: (cellProps) => {
//   //         const contact = cellProps.row.original;
//   //         const photoUrl = contact.photo
//   //           ? `${BaseUrl}${contact.photo}`
//   //           : dummyImg;

//   //         const getDisplayName = (contact) => {
//   //           if (contact.categorie === "Particulier") {
//   //             if (contact.nom && contact.nom_entreprise) {
//   //               return `${contact.nom}`;
//   //             }
//   //             return (
//   //               contact.nom || contact.nom_entreprise || t("Nom non renseigné")
//   //             );
//   //           }

//   //           if (
//   //             contact.categorie === "Entreprise" ||
//   //             contact.categorie === "Institution"
//   //           ) {
//   //             if (contact.nom_entreprise && contact.nom_contact) {
//   //               return `${contact.nom_entreprise} - ${contact.nom_contact}`;
//   //             }
//   //             return (
//   //               contact.nom_entreprise ||
//   //               contact.nom ||
//   //               contact.nom_contact ||
//   //               t("Nom non renseigné")
//   //             );
//   //           }

//   //           return (
//   //             contact.nom_entreprise ||
//   //             contact.nom ||
//   //             contact.nom_contact ||
//   //             t("Nom non renseigné")
//   //           );
//   //         };

//   //         const displayName = getDisplayName(contact);

//   //         return (
//   //           <div className="d-flex align-items-center">
//   //             <div className="flex-shrink-0">
//   //               <img
//   //                 src={photoUrl}
//   //                 className="avatar-xxs rounded-circle"
//   //                 onError={(e) => {
//   //                   e.target.src = dummyImg;
//   //                 }}
//   //               />
//   //             </div>
//   //             <div className="flex-grow-1 ms-2">
//   //               <Link
//   //                 onClick={() => switchToDetails(cellProps.row.original.id)}
//   //               >
//   //                 <span>{displayName}</span>
//   //               </Link>
//   //             </div>
//   //           </div>
//   //         );
//   //       },
//   //     },
//   //     {
//   //       header: t("Type de contact"),
//   //       accessorKey: "type_contact",
//   //       enableColumnFilter: false,
//   //       cell: (cellProps) => {
//   //         const type_contact = cellProps.getValue();
//   //         return (
//   //           <h6>
//   //             {" "}
//   //             <span
//   //               style={{ fontSize: "0.58rem" }}
//   //               className={`badge badge-sm  rounded-pill  ${
//   //                 type_contact === "Client"
//   //                   ? "bg-warning"
//   //                   : type_contact === "Fournisseur"
//   //                   ? "bg-info"
//   //                   : type_contact === "Prospect"
//   //                   ? "bg-success"
//   //                   : type_contact === "Partenaire"
//   //                   ? "bg-primary"
//   //                   : "bg-secondary"
//   //               }`}
//   //             >
//   //               {type_contact}
//   //             </span>
//   //           </h6>
//   //         );
//   //       },
//   //     },
//   //     {
//   //       header: t("Catégorie"),
//   //       accessorKey: "categorie",
//   //       enableColumnFilter: false,
//   //       cell: (cellProps) => {
//   //         const categorie = cellProps.getValue();
//   //         return (
//   //           <h6>
//   //             <span
//   //               style={{ fontSize: "0.58rem" }}
//   //               className={`badge badge-sm  rounded-pill ${
//   //                 categorie === "Particulier"
//   //                   ? "bg-warning"
//   //                   : categorie === "Entreprise"
//   //                   ? "bg-info"
//   //                   : categorie === "Institution"
//   //                   ? "bg-success"
//   //                   : categorie === "ONG"
//   //                   ? "bg-danger"
//   //                   : categorie === "Fondation"
//   //                   ? "bg-dark"
//   //                   : categorie === "Association"
//   //                   ? "bg-black"
//   //                   : categorie === "Groupement d'intérêt économie(GE)"
//   //                   ? "bg-muted"
//   //                   : categorie === "Administration"
//   //                   ? "bg-primary"
//   //                   : "bg-secondary"
//   //               }`}
//   //             >
//   //               {categorie}
//   //             </span>
//   //           </h6>
//   //         );
//   //       },
//   //     },
//   //     {
//   //       header: t("Email"),
//   //       accessorKey: "email",
//   //       enableColumnFilter: false,
//   //     },
//   //     {
//   //       header: t("Adresse"),
//   //       accessorKey: "adresse",
//   //       enableColumnFilter: false,
//   //     },
//   //     {
//   //       header: t("Actions"),
//   //       cell: (cellProps) => (
//   //         <ul className="list-inline hstack gap-2 mb-0">
//   //           {/* Voir */}
//   //           <li className="list-inline-item">
//   //             <Link
//   //               onClick={() => switchToDetails(cellProps.row.original.id)}
//   //               to="#"
//   //               className="text-primary d-inline-block"
//   //             >
//   //               <i className="ri-eye-fill fs-16"></i>
//   //             </Link>
//   //           </li>

//   //           {/* Modifier */}
//   //           {canEditContact && (
//   //             <li className="list-inline-item edit">
//   //               <Link
//   //                 to="#"
//   //                 className="text-primary d-inline-block edit-item-btn"
//   //                 onClick={() => handleOrderClick(cellProps.row.original)}
//   //               >
//   //                 <i className="ri-pencil-fill fs-16"></i>
//   //               </Link>
//   //             </li>
//   //           )}

//   //           {/* Supprimer */}
//   //           {canDeleteContact && (
//   //             <li className="list-inline-item">
//   //               <Link
//   //                 to="#"
//   //                 className="text-danger d-inline-block remove-item-btn"
//   //                 onClick={() => onClickDelete(cellProps.row.original)}
//   //               >
//   //                 <i className="ri-delete-bin-5-fill fs-16"></i>
//   //               </Link>
//   //             </li>
//   //           )}
//   //         </ul>
//   //       ),
//   //     },
//   //   ],
//   //   [t, canEditContact, canDeleteContact, handleOrderClick, checkedAll, filteredContacts, currentPage, itemsPerPage]
//   // );

//   const columns = useMemo(
//     () => [
//       {
//         header: "#",
//         enableColumnFilter: false,
//         cell: (cell) => {
//           const totalItems = filteredContacts?.length || 0;
//           const itemPosition =
//             cell.row.index + 1 + (currentPage - 1) * itemsPerPage;
//           const reverseIndex = totalItems - itemPosition + 1;

//           const displayIndex =
//             totalItems > 0 && reverseIndex > 0
//               ? reverseIndex
//               : cell.row.index + 1;

//           return (
//             <span
//               style={{
//                 display: "inline-block",
//                 width: "100%",
//                 textAlign: "center",
//               }}
//             >
//               {displayIndex}
//             </span>
//           );
//         },
//         id: "index",
//         size: 50,
//       },
//       {
//         header: t("Nom"),
//         accessorKey: "nom",
//         enableColumnFilter: false,
//         headerStyle: { fontWeight: "normal" },
//         cell: (cellProps) => {
//           const contact = cellProps.row.original;
//           const photoUrl = contact.photo
//             ? `${BaseUrl}${contact.photo}`
//             : dummyImg;

//           const getDisplayName = (contact) => {
//             if (contact.categorie === "Particulier") {
//               if (contact.nom && contact.nom_entreprise) {
//                 return `${contact.nom}`;
//               }
//               return (
//                 contact.nom || contact.nom_entreprise || t("Nom non renseigné")
//               );
//             }

//             if (
//               contact.categorie === "Entreprise" ||
//               contact.categorie === "Institution"
//             ) {
//               if (contact.nom_entreprise && contact.nom_contact) {
//                 return `${contact.nom_entreprise} - ${contact.nom_contact}`;
//               }
//               return (
//                 contact.nom_entreprise ||
//                 contact.nom ||
//                 contact.nom_contact ||
//                 t("Nom non renseigné")
//               );
//             }

//             return (
//               contact.nom_entreprise ||
//               contact.nom ||
//               contact.nom_contact ||
//               t("Nom non renseigné")
//             );
//           };

//           const displayName = getDisplayName(contact);

//           return (
//             <div className="d-flex align-items-center">
//               <div className="flex-shrink-0">
//                 <img
//                   src={photoUrl}
//                   className="avatar-xxs rounded-circle"
//                   onError={(e) => {
//                     e.target.src = dummyImg;
//                   }}
//                 />
//               </div>
//               <div className="flex-grow-1 ms-2">
//                 <Link
//                   onClick={() => switchToDetails(cellProps.row.original.id)}
//                 >
//                   <span>{displayName}</span>
//                 </Link>
//               </div>
//             </div>
//           );
//         },
//       },
//       {
//         header: t("Type de contact"),
//         accessorKey: "type_contact",
//         enableColumnFilter: false,
//         cell: (cellProps) => {
//           const type_contact = cellProps.getValue();
//           return (
//             <h6>
//               {" "}
//               <span
//                 style={{ fontSize: "0.58rem" }}
//                 className={`badge badge-sm  rounded-pill  ${
//                   type_contact === "Client"
//                     ? "bg-warning"
//                     : type_contact === "Fournisseur"
//                     ? "bg-info"
//                     : type_contact === "Prospect"
//                     ? "bg-success"
//                     : type_contact === "Partenaire"
//                     ? "bg-primary"
//                     : "bg-secondary"
//                 }`}
//               >
//                 {type_contact}
//               </span>
//             </h6>
//           );
//         },
//       },
//       {
//         header: t("Catégorie"),
//         accessorKey: "categorie",
//         enableColumnFilter: false,
//         cell: (cellProps) => {
//           const categorie = cellProps.getValue();
//           return (
//             <h6>
//               <span
//                 style={{ fontSize: "0.58rem" }}
//                 className={`badge badge-sm  rounded-pill ${
//                   categorie === "Particulier"
//                     ? "bg-warning"
//                     : categorie === "Entreprise"
//                     ? "bg-info"
//                     : categorie === "Institution"
//                     ? "bg-success"
//                     : categorie === "ONG"
//                     ? "bg-danger"
//                     : categorie === "Fondation"
//                     ? "bg-dark"
//                     : categorie === "Association"
//                     ? "bg-black"
//                     : categorie === "Groupement d'intérêt économie(GE)"
//                     ? "bg-muted"
//                     : categorie === "Administration"
//                     ? "bg-primary"
//                     : "bg-secondary"
//                 }`}
//               >
//                 {categorie}
//               </span>
//             </h6>
//           );
//         },
//       },
//       {
//         header: t("Email"),
//         accessorKey: "email",
//         enableColumnFilter: false,
//       },
//       {
//         header: t("Adresse"),
//         accessorKey: "adresse",
//         enableColumnFilter: false,
//       },
//       {
//         header: t("Actions"),
//         cell: (cellProps) => {
//           // Vérifier les permissions pour chaque action
//           const canView = hasPermission("can_view_contact");
//           const canEdit = hasPermission("can_edit_contact");
//           const canDelete = hasPermission("can_delete_contact");

//           return (
//             <ul className="list-inline hstack gap-2 mb-0">
//               {/* Voir - Toujours visible si on a la permission */}
//               {canView && (
//                 <li className="list-inline-item">
//                   <Link
//                     onClick={() => switchToDetails(cellProps.row.original.id)}
//                     to="#"
//                     className="text-primary d-inline-block"
//                     title={t("Voir les détails")}
//                   >
//                     <i className="ri-eye-fill fs-16"></i>
//                   </Link>
//                 </li>
//               )}

//               {/* Modifier - Conditionné par la permission */}
//               {canEdit && (
//                 <li className="list-inline-item edit">
//                   <Link
//                     to="#"
//                     className="text-primary d-inline-block edit-item-btn"
//                     onClick={() => handleOrderClick(cellProps.row.original)}
//                     title={t("Modifier le contact")}
//                   >
//                     <i className="ri-pencil-fill fs-16"></i>
//                   </Link>
//                 </li>
//               )}

//               {/* Supprimer - Conditionné par la permission */}
//               {canDelete && (
//                 <li className="list-inline-item">
//                   <Link
//                     to="#"
//                     className="text-danger d-inline-block remove-item-btn"
//                     onClick={() => onClickDelete(cellProps.row.original)}
//                     title={t("Supprimer le contact")}
//                   >
//                     <i className="ri-delete-bin-5-fill fs-16"></i>
//                   </Link>
//                 </li>
//               )}

//               {/* Message si aucune action disponible */}
//               {!canView && !canEdit && !canDelete && (
//                 <li className="list-inline-item">
//                   <span
//                     className="text-muted d-inline-block"
//                     title={t("Aucune action autorisée")}
//                   >
//                     <i className="ri-forbid-line fs-16"></i>
//                   </span>
//                 </li>
//               )}
//             </ul>
//           );
//         },
//       },
//     ],
//     [
//       t,
//       handleOrderClick,
//       checkedAll,
//       filteredContacts,
//       currentPage,
//       itemsPerPage,
//       userPermissions,
//       permissionsLoading,
//     ]
//   );

//   // Vérification d'accès
//   if (!canViewContact) {
//     return (
//       <EmptyDataCard
//         title={t("Accès refusé")}
//         description={t("Vous n'avez pas l'accès à cette page")}
//         icon="ri-lock-line"
//       />
//     );
//   }

//   document.title = t("Contacts | INAWO - Suite de Gestion");

//   return (
//     <>
//       <ExportCSVModal
//         show={isExportCSV}
//         onCloseClick={() => setIsExportCSV(false)}
//         data={orderList}
//       />
//       <DeleteModal
//         show={deleteModal}
//         onDeleteClick={handleDeleteOrder}
//         onCloseClick={() => setDeleteModal(false)}
//       />
//       <Col lg={12}>
//         <>
//           <BreadCrumb
//             title={t("Contact")}
//             pageTitle={
//               <>
//                 <i className="ri-contacts-book-line me-1 align-bottom"></i>
//                 &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>
//                 &nbsp;&gt;
//               </>
//             }
//           />
//         </>
//         <div className="row">
//           <SearchAndActionBar
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             searchPlaceholder={t("Chercher un contact...")}
//             showSearch={true}
//             onAddClick={() => {
//               setIsEdit(false);
//               toggle();
//             }}
//             addButtonText={t("Ajouter un contact")}
//             showAddButton={canAddContact}
//             // Permissions spécifiques
//             requiredAddPermission="can_add_contact"
//             requiredExportPermission="can_export_contacts"
//             onExportClick={() => setIsExportCSV(true)}
//             exportButtonText={t("Exporter")}
//             exportButtonIcon="ri-file-upload-line"
//             showExportButton={true}
//           />

//           <div>
//             {loading ? (
//               <div
//                 className="d-flex justify-content-center align-items-center"
//                 style={{ minHeight: "300px" }}
//               >
//                 <Loader />
//               </div>
//             ) : contacts.length > 0 ? (
//               <TableContainer
//                 columns={columns}
//                 data={currentItems}
//                 isGlobalFilter={false}
//                 customPageSize={itemsPerPage}
//                 showNavTabs={true}
//                 navTabs={navTabsData}
//                 activeTab={activeTab}
//                 onTabChange={handleTabChange}
//                 navTabsClass="nav-tabs nav-tabs-custom nav-success py-4 mb-0 rounded-top-20"
//                 containerStyle={{
//                   borderRadius: "20px",
//                   overflow: "hidden",
//                   boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
//                 }}
//               >
//                 {filteredContacts.length === 0 ? (
//                   <div className="text-center py-5"></div>
//                 ) : (
//                   <Pagination
//                     style={{ marginLeft: "10px" }}
//                     data={filteredContacts}
//                     currentPage={currentPage}
//                     setCurrentPage={setCurrentPage}
//                     perPageData={itemsPerPage}
//                     alwaysShow={true}
//                     showInfo={true}
//                   />
//                 )}
//               </TableContainer>
//             ) : (
//               <EmptyDataCard
//                 title={t("Aucun contact trouvé")}
//                 description={t("Commencer par ajouter un contact")}
//                 actionButton={
//                   <button
//                     className="btn btn-success"
//                     onClick={() => {
//                       setIsEdit(false);
//                       toggle();
//                     }}
//                     style={{ borderRadius: "20px" }}
//                   >
//                     <i className="ri-file-add-line me-1"></i>
//                     {t("Ajouter un contact")}
//                   </button>
//                 }
//               />
//             )}
//           </div>
//           <WithPermission
//             module="contact"
//             action="add"
//             fallback={
//               <div className="alert alert-warning">
//                 {t("Vous n'avez pas la permission d'ajouter des contacts")}
//               </div>
//             }
//           >
//             <Modal
//               id="showModal"
//               isOpen={modal}
//               toggle={toggle}
//               centered
//               contentClassName="custom-rounded-modal scrollable-modal-content"
//               modalClassName="scrollable-modal"
//               style={{ overflow: "visible" }}
//             >
//               <ModalHeader
//                 className="bg-light p-3 rounded-top-20"
//                 toggle={toggle}
//                 style={{
//                   borderBottom: "none",
//                 }}
//               >
//                 {!!isEdit ? t("Modifier le contact") : t("Ajouter un contact")}
//               </ModalHeader>
//               <Form
//                 className="tablelist-form"
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   validation.handleSubmit();
//                   return false;
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault();
//                   }
//                 }}
//               >
//                 <ModalBody
//                   style={{ overflow: "visible" }}
//                   className="modal-body-scrollable"
//                 >
//                   <Input type="hidden" id="id-field" />
//                   <Row className="g-3">
//                     <Col lg={12}>
//                       <div className="text-center">
//                         <div className="position-relative d-inline-block">
//                           <div className="position-absolute bottom-0 end-0">
//                             <Label htmlFor="lead-image-input" className="mb-0">
//                               <div className="avatar-xs cursor-pointer">
//                                 <div className="avatar-title bg-light border rounded-circle text-muted">
//                                   <i className="ri-image-fill"></i>
//                                 </div>
//                               </div>
//                             </Label>
//                             <Input
//                               className="form-control d-none"
//                               id="lead-image-input"
//                               type="file"
//                               accept="image/png, image/gif, image/jpeg"
//                               onChange={(e) => {
//                                 const file = e.target.files[0];
//                                 if (file) {
//                                   validation.setFieldValue("photo", file);

//                                   const reader = new FileReader();
//                                   reader.onload = (event) => {
//                                     document.getElementById("lead-img").src =
//                                       event.target.result;
//                                   };
//                                   reader.readAsDataURL(file);
//                                 }
//                               }}
//                             />
//                           </div>
//                           <div className="avatar-lg p-1">
//                             <div className="avatar-title bg-light rounded-circle">
//                               <img
//                                 src={
//                                   validation.values.photo instanceof File
//                                     ? URL.createObjectURL(
//                                         validation.values.photo
//                                       )
//                                     : order?.photo
//                                     ? `${BaseUrl}${order.photo}`
//                                     : dummyImg
//                                 }
//                                 alt="contact"
//                                 id="lead-img"
//                                 className="avatar-md rounded-circle object-fit-cover"
//                               />
//                             </div>
//                           </div>
//                         </div>
//                         <h5 className="fs-13 mt-3"></h5>
//                       </div>
//                     </Col>

//                     {/* Type contact */}
//                     <Col lg={12}>
//                       <div>
//                         <Label
//                           htmlFor="type_contact"
//                           className="form-label font-size-13"
//                         >
//                           {t("Type contact")}{" "}
//                           <span style={{ color: "red" }}>*</span>
//                         </Label>
//                         <CustomSelect
//                           value={
//                             typeContactOptions.find(
//                               (opt) =>
//                                 opt.value === validation.values.type_contact
//                             ) || null
//                           }
//                           onChange={(selectedOption) => {
//                             const value = selectedOption
//                               ? selectedOption.value
//                               : "";
//                             validation.setFieldValue("type_contact", value);
//                             setSelectedTypeContact(value);
//                           }}
//                           options={typeContactOptions}
//                           placeholder={t("Sélectionner un type")}
//                         />
//                         {validation.touched.type_contact &&
//                         validation.errors.type_contact ? (
//                           <FormFeedback type="invalid">
//                             {validation.errors.type_contact}
//                           </FormFeedback>
//                         ) : null}
//                       </div>
//                     </Col>

//                     {/* Catégorie */}
//                     <Col lg={12}>
//                       <div>
//                         <Label
//                           htmlFor="categoryinput-choices"
//                           className="form-label font-size-13"
//                         >
//                           {t("Catégorie")}{" "}
//                           <span style={{ color: "red" }}>*</span>
//                         </Label>
//                         <CustomSelect
//                           value={
//                             categorieOptions.find(
//                               (opt) => opt.value === validation.values.categorie
//                             ) || null
//                           }
//                           onChange={(selectedOption) => {
//                             const value = selectedOption
//                               ? selectedOption.value
//                               : "";
//                             validation.setFieldValue("categorie", value);
//                             setselectedCategorie(value);
//                           }}
//                           options={categorieOptions}
//                           placeholder={t("Sélectionner une catégorie")}
//                         />
//                         {validation.touched.categorie &&
//                         validation.errors.categorie ? (
//                           <FormFeedback type="invalid">
//                             {validation.errors.categorie}
//                           </FormFeedback>
//                         ) : null}
//                       </div>
//                     </Col>

//                     {/* Type Client */}
//                     {selectedTypeContact == "Client" && (
//                       <Col lg={12}>
//                         <div>
//                           <Label
//                             htmlFor="type_client"
//                             className="form-label font-size-13"
//                           >
//                             {t("Type client")}{" "}
//                             <span style={{ color: "red" }}>*</span>
//                           </Label>
//                           <CustomSelect
//                             value={
//                               typeClientOptions.find(
//                                 (opt) =>
//                                   opt.value === validation.values.type_client
//                               ) || null
//                             }
//                             onChange={(selectedOption) => {
//                               const value = selectedOption
//                                 ? selectedOption.value
//                                 : "";
//                               validation.setFieldValue("type_client", value);
//                             }}
//                             options={typeClientOptions}
//                             placeholder={t("Sélectionner un type")}
//                           />
//                           {validation.touched.type_client &&
//                           validation.errors.type_client ? (
//                             <FormFeedback type="invalid">
//                               {validation.errors.type_client}
//                             </FormFeedback>
//                           ) : null}
//                         </div>
//                       </Col>
//                     )}

//                     {/* Nom */}
//                     <Col lg={12}>
//                       <div>
//                         <Label htmlFor="name-field" className="form-label">
//                           {selectedCategorie === "Particulier"
//                             ? t("Nom et Prénom du contact")
//                             : t(
//                                 `Nom  de ${selectedCategorie || "l'entreprise"}`
//                               )}
//                           <span style={{ color: "red" }}>*</span>
//                         </Label>
//                         <Input
//                           name="nom"
//                           id="name-field"
//                           className="form-control"
//                           placeholder={
//                             selectedCategorie === "Particulier"
//                               ? t("Entrez le nom et prénom")
//                               : t("Entrez le nom")
//                           }
//                           type="text"
//                           onChange={validation.handleChange}
//                           onBlur={validation.handleBlur}
//                           value={validation.values.nom || ""}
//                           invalid={
//                             validation.touched.nom && validation.errors.nom
//                               ? true
//                               : false
//                           }
//                           style={{ borderRadius: "20px", overflow: "hidden" }}
//                         />
//                         {validation.touched.nom && validation.errors.nom ? (
//                           <FormFeedback type="invalid">
//                             {validation.errors.nom}
//                           </FormFeedback>
//                         ) : null}
//                       </div>
//                     </Col>

//                     {/* ------------Afficher plus d'information---------------- */}
//                     {!afficherPlus && (
//                       <Col lg={12}>
//                         <div className="text mt-3 mb-3">
//                           <Button
//                             type="submit"
//                             className="form-control rounded-pill btn w-100 text-white"
//                             onClick={handleAfficherPlus}
//                             style={{
//                               backgroundColor: "#014a92",
//                               borderColor: "#014a92",
//                             }}
//                             disabled={loading}
//                             onMouseEnter={(e) => {
//                               e.target.style.backgroundColor = "#007bff";
//                               e.target.style.borderColor = "#007bff";
//                             }}
//                             onMouseLeave={(e) => {
//                               e.target.style.backgroundColor = "#014a92";
//                               e.target.style.borderColor = "#014a92";
//                             }}
//                           >
//                             <i
//                               className={`ri-${
//                                 afficherPlus ? "eye-off" : "eye"
//                               }-line me-1`}
//                             ></i>
//                             {afficherPlus
//                               ? t("Afficher moins")
//                               : t("Afficher plus")}
//                           </Button>
//                         </div>
//                       </Col>
//                     )}

//                     {afficherPlus && (
//                       <>
//                         {/* Nom du contact */}
//                         {selectedCategorie !== "Particulier" && (
//                           <Col lg={12}>
//                             <div>
//                               <Label
//                                 htmlFor="nom_contact-field"
//                                 className="form-label"
//                               >
//                                 {t("Nom de contact")}
//                               </Label>
//                               <Input
//                                 name="nom_contact"
//                                 id="nom_contact-field"
//                                 className="form-control"
//                                 placeholder={t("Entrer le nom de contact")}
//                                 type="text"
//                                 onChange={validation.handleChange}
//                                 onBlur={validation.handleBlur}
//                                 value={validation.values.nom_contact || ""}
//                                 invalid={
//                                   validation.touched.nom_contact &&
//                                   validation.errors.nom_contact
//                                     ? true
//                                     : false
//                                 }
//                                 style={{
//                                   borderRadius: "20px",
//                                   overflow: "hidden",
//                                 }}
//                                 contentClassName="rounded-modal"
//                               />
//                               {validation.touched.nom_contact &&
//                               validation.errors.nom_contact ? (
//                                 <FormFeedback type="invalid">
//                                   {validation.errors.nom_contact}
//                                 </FormFeedback>
//                               ) : null}
//                             </div>
//                           </Col>
//                         )}

//                         {/* Nom de l'entreprise */}
//                         {selectedCategorie == "Particulier" && (
//                           <Col lg={12}>
//                             <div>
//                               <Label
//                                 htmlFor="nom_entreprise-field"
//                                 className="form-label"
//                               >
//                                 {t("Nom de l'entreprise")}
//                               </Label>
//                               <Input
//                                 name="nom_entreprise"
//                                 id="nom_entreprise-field"
//                                 className="form-control"
//                                 placeholder="Ex: Inawo"
//                                 type="text"
//                                 onChange={validation.handleChange}
//                                 onBlur={validation.handleBlur}
//                                 value={validation.values.nom_entreprise || ""}
//                                 invalid={
//                                   validation.touched.nom_entreprise &&
//                                   validation.errors.nom_entreprise
//                                     ? true
//                                     : false
//                                 }
//                                 style={{
//                                   borderRadius: "20px",
//                                   overflow: "hidden",
//                                 }}
//                                 contentClassName="rounded-modal"
//                               />
//                               {validation.touched.nom_entreprise &&
//                               validation.errors.nom_entreprise ? (
//                                 <FormFeedback type="invalid">
//                                   {validation.errors.nom_entreprise}
//                                 </FormFeedback>
//                               ) : null}
//                             </div>
//                           </Col>
//                         )}

//                         {/* Téléphone */}
//                         <Col lg={12}>
//                           <div>
//                             <Label
//                               htmlFor="nom_entreprise-field"
//                               className="form-label"
//                             >
//                               {t("Téléphone")}
//                             </Label>
//                             <PhoneInput
//                               className="rounded-phone"
//                               name="telephone"
//                               value={validation.values.telephone || ""}
//                               onChange={(value) => {
//                                 const phoneValue = value ? String(value) : "";
//                                 validation.setFieldValue(
//                                   "telephone",
//                                   phoneValue
//                                 );
//                               }}
//                               countries={country}
//                               defaultCountry="FR"
//                               onBlur={() =>
//                                 validation.setFieldTouched("telephone", true)
//                               }
//                             />
//                             {validation.touched.telephone &&
//                               validation.errors.telephone && (
//                                 <div className="text-danger">
//                                   {validation.errors.telephone}
//                                 </div>
//                               )}
//                           </div>
//                         </Col>

//                         {/* Téléphone 2 */}
//                         <Col lg={12}>
//                           <div>
//                             <Label
//                               htmlFor="nom_entreprise-field"
//                               className="form-label"
//                             >
//                               {t("Téléphone 2")}
//                             </Label>
//                             <PhoneInput
//                               className="rounded-phone"
//                               name="telephone2"
//                               value={validation.values.telephone2 || ""}
//                               onChange={(value) => {
//                                 const phoneValue = value ? String(value) : "";
//                                 validation.setFieldValue(
//                                   "telephone2",
//                                   phoneValue
//                                 );
//                               }}
//                               countries={country}
//                               defaultCountry="FR"
//                               onBlur={() =>
//                                 validation.setFieldTouched("telephone2", true)
//                               }
//                             />
//                             {validation.touched.telephone2 &&
//                               validation.errors.telephone2 && (
//                                 <div className="text-danger">
//                                   {validation.errors.telephone2}
//                                 </div>
//                               )}
//                           </div>
//                         </Col>

//                         {/* Email */}
//                         <Col lg={12}>
//                           <div>
//                             <Label htmlFor="email-field" className="form-label">
//                               {t("Email")}
//                             </Label>
//                             <Input
//                               name="email"
//                               id="email-field"
//                               className="form-control"
//                               placeholder={t("Entrez votre email")}
//                               type="text"
//                               onChange={validation.handleChange}
//                               onBlur={validation.handleBlur}
//                               value={validation.values.email || ""}
//                               invalid={
//                                 validation.touched.email &&
//                                 validation.errors.email
//                                   ? true
//                                   : false
//                               }
//                               style={{
//                                 borderRadius: "20px",
//                                 overflow: "hidden",
//                               }}
//                               contentClassName="rounded-modal"
//                             />
//                             {validation.touched.email &&
//                             validation.errors.email ? (
//                               <FormFeedback type="invalid">
//                                 {validation.errors.email}
//                               </FormFeedback>
//                             ) : null}
//                           </div>
//                         </Col>

//                         {/* Adresse */}
//                         <Col lg={12}>
//                           <div>
//                             <Label
//                               htmlFor="address-field"
//                               className="form-label"
//                             >
//                               {t("Adresse")}
//                             </Label>
//                             <Input
//                               name="adresse"
//                               id="address-field"
//                               className="form-control"
//                               placeholder={t("Entrez votre adresse")}
//                               type="text"
//                               onChange={validation.handleChange}
//                               onBlur={validation.handleBlur}
//                               value={validation.values.adresse || ""}
//                               invalid={
//                                 validation.touched.adresse &&
//                                 validation.errors.adresse
//                                   ? true
//                                   : false
//                               }
//                               style={{
//                                 borderRadius: "20px",
//                                 overflow: "hidden",
//                               }}
//                               contentClassName="rounded-modal"
//                             />
//                             {validation.touched.adresse &&
//                             validation.errors.adresse ? (
//                               <FormFeedback type="invalid">
//                                 {validation.errors.adresse}
//                               </FormFeedback>
//                             ) : null}
//                           </div>
//                         </Col>

//                         {/* Revenu */}
//                         {selectedCategorie == "Particulier" && (
//                           <Col lg={12}>
//                             <div>
//                               <Label
//                                 htmlFor="revenue-field"
//                                 className="form-label font-size-13"
//                               >
//                                 {t("Revenue")}
//                               </Label>
//                               <CustomSelect
//                                 value={
//                                   revenuOptions.find(
//                                     (opt) =>
//                                       opt.value === validation.values.revenu
//                                   ) || null
//                                 }
//                                 onChange={(selectedOption) => {
//                                   const value = selectedOption
//                                     ? selectedOption.value
//                                     : "";
//                                   validation.setFieldValue("revenu", value);
//                                 }}
//                                 options={revenuOptions}
//                                 placeholder={t("Sélectionner une tranche")}
//                               />
//                               {validation.touched.revenu &&
//                               validation.errors.revenu ? (
//                                 <FormFeedback type="invalid">
//                                   {validation.errors.revenu}
//                                 </FormFeedback>
//                               ) : null}
//                             </div>
//                           </Col>
//                         )}
//                         {/* Segment */}
//                         {selectedCategorie == "Particulier" && (
//                           <Col lg={12}>
//                             <div>
//                               <Label
//                                 htmlFor="segment-field"
//                                 className="form-label"
//                               >
//                                 {t("Segment")}
//                               </Label>
//                               <Input
//                                 name="segment"
//                                 id="segment-field"
//                                 className="form-control"
//                                 placeholder={t("Entrez votre segment")}
//                                 type="text"
//                                 onChange={validation.handleChange}
//                                 onBlur={validation.handleBlur}
//                                 value={validation.values.segment || ""}
//                                 invalid={
//                                   validation.touched.segment &&
//                                   validation.errors.segment
//                                     ? true
//                                     : false
//                                 }
//                                 style={{
//                                   borderRadius: "20px",
//                                   overflow: "hidden",
//                                 }}
//                                 contentClassName="rounded-modal"
//                               />
//                               {validation.touched.segment &&
//                               validation.errors.segment ? (
//                                 <FormFeedback type="invalid">
//                                   {validation.errors.segment}
//                                 </FormFeedback>
//                               ) : null}
//                             </div>
//                           </Col>
//                         )}

//                         <Col lg={12}>
//                           <div>
//                             <Label
//                               htmlFor="date_anniversaire"
//                               className="form-label"
//                             >
//                               {selectedCategorie === "Particulier"
//                                 ? t("Date d'anniversaire")
//                                 : t("Date de création")}
//                             </Label>
//                             <Flatpickr
//                               id="date_anniversaire"
//                               className="form-control"
//                               style={{
//                                 borderRadius: "20px",
//                                 padding: "10px 15px",
//                               }}
//                               options={{
//                                 dateFormat: "Y-m-d",
//                                 maxDate: new Date(),
//                                 static: false,
//                                 position: "auto",
//                                 appendTo: document.body,
//                               }}
//                               placeholder={t("Sélectionner une date")}
//                               value={validation.values.date_anniversaire}
//                               onChange={(date) => {
//                                 const formattedDate = date[0]
//                                   ? moment(date[0]).format("YYYY-MM-DD")
//                                   : "";
//                                 validation.setFieldValue(
//                                   "date_anniversaire",
//                                   formattedDate
//                                 );
//                               }}
//                             />
//                             {validation.touched.date_anniversaire &&
//                             validation.errors.date_anniversaire ? (
//                               <FormFeedback type="invalid">
//                                 {validation.errors.date_anniversaire}
//                               </FormFeedback>
//                             ) : null}
//                           </div>
//                         </Col>

//                         {/* Forme juridique */}
//                         {selectedCategorie == "Entreprise" && (
//                           <Col lg={12}>
//                             <div>
//                               <Label
//                                 htmlFor="forme_juridique"
//                                 className="form-label"
//                               >
//                                 {t("Forme juridique")}
//                               </Label>
//                               <CustomSelect
//                                 value={
//                                   formeJuridiqueOptions.find(
//                                     (opt) =>
//                                       opt.value ===
//                                       validation.values.forme_juridique
//                                   ) || null
//                                 }
//                                 onChange={(selectedOption) => {
//                                   const value = selectedOption
//                                     ? selectedOption.value
//                                     : "";
//                                   validation.setFieldValue(
//                                     "forme_juridique",
//                                     value
//                                   );
//                                 }}
//                                 options={formeJuridiqueOptions}
//                                 placeholder={t(
//                                   "Sélectionner une forme juridique"
//                                 )}
//                               />
//                               {validation.touched.forme_juridique &&
//                               validation.errors.forme_juridique ? (
//                                 <FormFeedback type="invalid">
//                                   {validation.errors.forme_juridique}
//                                 </FormFeedback>
//                               ) : null}
//                             </div>
//                           </Col>
//                         )}
//                         {/* Capital social */}
//                         {selectedCategorie == "Entreprise" && (
//                           <Col lg={12}>
//                             <div>
//                               <Label
//                                 htmlFor="capital_social"
//                                 className="form-label"
//                               >
//                                 {t("Capital social")}
//                               </Label>
//                               <Input
//                                 type="number"
//                                 id="capital_social"
//                                 className="form-control"
//                                 placeholder={t("Capital social")}
//                                 name="capital_social"
//                                 value={validation.values.capital_social || ""}
//                                 onChange={validation.handleChange}
//                                 onBlur={validation.handleBlur}
//                                 invalid={
//                                   validation.touched.capital_social &&
//                                   validation.errors.capital_social
//                                     ? true
//                                     : false
//                                 }
//                                 style={{
//                                   borderRadius: "20px",
//                                   overflow: "hidden",
//                                 }}
//                               />
//                               {validation.touched.capital_social &&
//                               validation.errors.capital_social ? (
//                                 <FormFeedback type="invalid">
//                                   {validation.errors.capital_social}
//                                 </FormFeedback>
//                               ) : null}
//                             </div>
//                           </Col>
//                         )}

//                         {/* Champ pour Numéro légal 1 */}
//                         {selectedCategorie !== "Particulier" && (
//                           <Col lg={12}>
//                             <div>
//                               <Label
//                                 htmlFor="num_enreg_legal1-field"
//                                 className="form-label"
//                               >
//                                 {t("Numéro légal 1")}
//                               </Label>
//                               <Input
//                                 type="text"
//                                 id="num_enreg_legal1-field"
//                                 name="num_enreg_legal1"
//                                 className="form-control"
//                                 placeholder={t("Entrez le numéro légal 1")}
//                                 value={validation.values.num_enreg_legal1 || ""}
//                                 onChange={validation.handleChange}
//                                 onBlur={validation.handleBlur}
//                                 invalid={
//                                   validation.touched.num_enreg_legal1 &&
//                                   validation.errors.num_enreg_legal1
//                                     ? true
//                                     : false
//                                 }
//                                 style={{
//                                   borderRadius: "20px",
//                                   overflow: "hidden",
//                                 }}
//                               />
//                               {validation.touched.num_enreg_legal1 &&
//                               validation.errors.num_enreg_legal1 ? (
//                                 <FormFeedback type="invalid">
//                                   {validation.errors.num_enreg_legal1}
//                                 </FormFeedback>
//                               ) : null}
//                             </div>
//                           </Col>
//                         )}

//                         {/* Champ pour Numéro légal 2 */}
//                         {selectedCategorie !== "Particulier" && (
//                           <Col lg={12}>
//                             <div>
//                               <Label
//                                 htmlFor="num_enreg_legal2-field"
//                                 className="form-label"
//                               >
//                                 {t("Numéro légal 2")}
//                               </Label>
//                               <Input
//                                 type="text"
//                                 id="num_enreg_legal2-field"
//                                 name="num_enreg_legal2"
//                                 className="form-control"
//                                 placeholder={t("Entrez le numéro légal 2")}
//                                 value={validation.values.num_enreg_legal2 || ""}
//                                 onChange={validation.handleChange}
//                                 onBlur={validation.handleBlur}
//                                 invalid={
//                                   validation.touched.num_enreg_legal2 &&
//                                   validation.errors.num_enreg_legal2
//                                     ? true
//                                     : false
//                                 }
//                                 style={{
//                                   borderRadius: "20px",
//                                   overflow: "hidden",
//                                 }}
//                               />
//                               {validation.touched.num_enreg_legal2 &&
//                               validation.errors.num_enreg_legal2 ? (
//                                 <FormFeedback type="invalid">
//                                   {validation.errors.num_enreg_legal2}
//                                 </FormFeedback>
//                               ) : null}
//                             </div>
//                           </Col>
//                         )}

//                         {/* Champ pour le site web */}
//                         <Col lg={12}>
//                           <div>
//                             <Label
//                               htmlFor="website-field"
//                               className="form-label"
//                             >
//                               {["Société", "Entreprise"].includes(
//                                 selectedCategorie
//                               )
//                                 ? t("Site web de l'entreprise")
//                                 : t("Site web")}
//                             </Label>
//                             <Input
//                               type="text"
//                               id="website-field"
//                               name="site_web"
//                               className="form-control"
//                               placeholder={
//                                 ["Société", "Entreprise"].includes(
//                                   selectedCategorie
//                                 )
//                                   ? t("https://www.entreprise.com")
//                                   : t("https://example.com")
//                               }
//                               value={validation.values.site_web || ""}
//                               onChange={validation.handleChange}
//                               onBlur={validation.handleBlur}
//                               invalid={
//                                 validation.touched.site_web &&
//                                 validation.errors.site_web
//                                   ? true
//                                   : false
//                               }
//                               style={{
//                                 borderRadius: "20px",
//                                 overflow: "hidden",
//                               }}
//                             />
//                             {validation.touched.site_web &&
//                             validation.errors.site_web ? (
//                               <FormFeedback type="invalid">
//                                 {validation.errors.site_web}
//                               </FormFeedback>
//                             ) : null}
//                           </div>
//                         </Col>

//                         {/* Commentaire */}
//                         <Col lg={12}>
//                           <div className="mb-3">
//                             <Label
//                               htmlFor="commentaire-field"
//                               className="form-label"
//                             >
//                               {t("Commentaire")}
//                             </Label>
//                             <textarea
//                               name="commentaire"
//                               id="commentaire-field"
//                               className="form-control"
//                               rows="3"
//                               placeholder={t("Ajouter un commentaire")}
//                               onChange={validation.handleChange}
//                               onBlur={validation.handleBlur}
//                               value={validation.values.commentaire || ""}
//                               style={{
//                                 borderRadius: "20px",
//                                 overflow: "hidden",
//                               }}
//                             ></textarea>
//                             {validation.touched.commentaire &&
//                             validation.errors.commentaire ? (
//                               <FormFeedback type="invalid">
//                                 {validation.errors.commentaire}
//                               </FormFeedback>
//                             ) : null}
//                           </div>
//                         </Col>
//                       </>
//                     )}
//                   </Row>
//                 </ModalBody>
//                 <ModalFooter>
//                   <div className="pagination-wrap hstack gap-2 justify-content-end">
//                     <button
//                       type="button"
//                       className="btn btn-light"
//                       onClick={() => {
//                         setModal(false);
//                       }}
//                       style={{ borderRadius: "20px", overflow: "hidden" }}
//                       contentClassName="rounded-modal"
//                     >
//                       {t("Annuler")}{" "}
//                     </button>
//                     <button
//                       type="submit"
//                       className="btn btn-success"
//                       style={{ borderRadius: "20px", overflow: "hidden" }}
//                       contentClassName="rounded-modal"
//                       onClick={() => {}}
//                     >
//                       {validation.isSubmitting
//                         ? t("Enregistrement...")
//                         : isEdit
//                         ? t("Mettre à jour")
//                         : t("Enregistrer")}
//                     </button>
//                   </div>
//                 </ModalFooter>
//               </Form>
//             </Modal>
//           </WithPermission>
//           <ToastContainer closeButton={false} limit={1} />
//         </div>
//       </Col>
//     </>
//   );
// };

// export default withRouter(withTranslation()(AppContact));



import Pagination from "../../../Components/Common/Pagination";
import PhoneInput from "../../../Components/ContactDeleteModal/CountryPhoneInput";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SearchAndActionBar from "../../../Components/Common/SearchAndActionBar";
import "react-phone-number-input/style.css";
import EmptyDataCard from "../../../Components/Common/EmptyDataCard";
import { useUniversalPermissions } from "../../../Components/Hooks/useUniversalPermissions";
import { useSubscriptionGuard } from "../../../Components/Hooks/useSubscriptionGuard";
import "../../../App.css";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Modal,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ModalHeader,
  Form,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  FormFeedback,
  FormGroup,
  Button,
} from "reactstrap";
import * as moment from "moment";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { country } from "../../../common/data";

// Importer le drapeau des US
import us from "../../../assets/images/flags/us.svg";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import dummyImg from "../../../assets/images/users/user-dummy-img.jpg";
import Loader from "../../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../../../contexts/SidebarContext";
import { useTranslation } from "react-i18next";
import { CustomSelect } from "../../../Components/Common/CustomSelectStyles";
import { BaseUrl } from "../../APIKey/ApiKey";
import withRouter from "../../../Components/Common/withRouter";
import { withTranslation } from "react-i18next";
import { 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo,
  showLoading,
  updateToast,
  dismissToast,
  clearAllToasts 
} from "../../../utils/toastManager";

const AppContact = ({ switchToDetails, t }) => {
  const location = useLocation();
  const [isValid, setIsValid] = useState(true);
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔐 UTILISATION DU SYSTÈME DE PERMISSIONS
  const { hasPermission, permissionsLoading, isAdmin } = useUniversalPermissions();
  
  // 🔐 PROTECTION ABONNEMENT - Vérifie avant ajout/modification/suppression
  const { guardAction, isExpired } = useSubscriptionGuard();

  const { activateSidebarMenu } = useSidebar(); 

   useEffect(() => {
    return () => {
      clearAllToasts();
    };
  }, []);

  // Fonction pour activer le menu correspondant
  const activateMenuByFilterType = (filterType) => {
    const menuMap = {
      all: "contacts-all",
      Client: "contacts-client",
      Fournisseur: "contacts-fournisseur",
      Prospect: "contacts-prospect",
      Partenaire: "contacts-partenaire",
    };

    const menuId = menuMap[filterType];
    if (menuId && activateSidebarMenu) {
      activateSidebarMenu(menuId);
    }
  };

  // Options pour les sélecteurs
  const typeContactOptions = useMemo(
    () => [
      { value: "Client", label: t("Client") },
      { value: "Prospect", label: t("Prospect") },
      { value: "Fournisseur", label: t("Fournisseur") },
      { value: "Partenaire", label: t("Partenaire") },
    ],
    [t]
  );

  const categorieOptions = useMemo(
    () => [
      { value: "Particulier", label: t("Particulier") },
      { value: "Entreprise", label: t("Entreprise") },
      { value: "Institution", label: t("Institution") },
      { value: "Association", label: t("Association") },
      { value: "Administration", label: t("Administration") },
      { value: "ONG", label: t("ONG") },
      { value: "Fondation", label: t("Fondation") },
      {
        value: "Groupement d'intérêt économie(GE)",
        label: t("Groupement d'intérêt économie(GE)"),
      },
    ],
    [t]
  );

  const typeClientOptions = useMemo(
    () => [
      { value: "Detaillant", label: t("Détaillant") },
      { value: "Grossiste", label: t("Grossiste") },
      { value: "VIP", label: t("VIP") },
    ],
    [t]
  );

  const formeJuridiqueOptions = useMemo(
    () => [
      { value: "Entreprise Individuelle", label: t("Entreprise Individuelle") },
      {
        value: "Société à Responsabilité Limitée(SARL)",
        label: t("Société à Responsabilité Limitée(SARL)"),
      },
      {
        value: "Société Unipersonnelle à Responsabilité Limitée(SARL)",
        label: t("Société Unipersonnelle à Responsabilité Limitée(SARL)"),
      },
      { value: "Société Anonyme(SA)", label: t("Société Anonyme(SA)") },
      {
        value: "Société en Nom Collectif(SNC)",
        label: t("Société en Nom Collectif(SNC)"),
      },
      { value: "Société Coopérative", label: t("Société Coopérative") },
    ],
    [t]
  );

  const revenuOptions = useMemo(
    () => [
      { value: "0-100000", label: "0 - 100000" },
      { value: "100000-250000", label: "100000 - 250000" },
      { value: "250000-500000", label: "250000 - 500000" },
      { value: "500000-1000000", label: "500000 - 1000000" },
      { value: "1000000-10000000", label: "1000000 - 10000000" },
    ],
    []
  );

  const tabMap = {
    all: "1",
    Client: "2",
    Fournisseur: "3",
    Prospect: "5",
    Partenaire: "6",
  };

  const [selectedCategorie, setselectedCategorie] = useState("");
  const [selectedTypeContact, setSelectedTypeContact] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [order, setOrder] = useState(null);
  const [isExportCSV, setIsExportCSV] = useState(false);

  // État pour stocker les contacts
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(country[0]);
  const [selectedCountry2, setSelectedCountry2] = useState(country[0]);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const { userProfile, token } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [afficherPlus, setAfficherPlus] = useState(false);

  // 🔐 VÉRIFICATION D'ACCÈS À LA PAGE
  if (!permissionsLoading && !isAdmin && !hasPermission("view_contact")) {
    return (
      <EmptyDataCard
        title={t("Accès refusé")}
        description={t("Vous n'avez pas l'accès aux contacts")}
        icon="ri-lock-line"
      />
    );
  }

  // Effet de recherche
  useEffect(() => {
    if (searchTerm) {
      const filtered = contacts.filter(
        (item) =>
          (item.nom &&
            item.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.nom_entreprise &&
            item.nom_entreprise
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (item.email &&
            item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.telephone && item.telephone.includes(searchTerm)) ||
          (item.type_contact &&
            item.type_contact
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (item.categorie &&
            item.categorie.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.adresse &&
            item.adresse.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredContacts(filtered);
      setCurrentPage(1);
    } else {
      const currentType = Object.keys(tabMap).find(
        (key) => tabMap[key] === activeTab
      );
      const filtered =
        currentType === "all"
          ? contacts
          : contacts.filter((contact) => contact.type_contact === currentType);

      setFilteredContacts(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, contacts, activeTab]);

  const getEntrepriseId = () => {
    try {
      if (userProfile?.entreprise?.id) {
        return userProfile.entreprise.id;
      }

      const localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser?.entreprise?.id) {
        return localUser.entreprise.id;
      }

      const token = localStorage.getItem("access_token");
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.entreprise_id) {
          return decoded.entreprise_id;
        }
      }
    } catch (error) {
      console.error("Erreur getEntrepriseId:", error);
      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {t("Impossible de déterminer l'entreprise")}
        </span>,
        {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  const handleAfficherPlus = () => {
    setAfficherPlus(!afficherPlus);
  };

  // Fonction pour les contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BaseUrl}/utilisateurs/createlistecontacte/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      let contactsArray = [];

      if (data.contacts && data.contacts.mes_contacts) {
        contactsArray = data?.contacts?.mes_contacts;
      } else if (Array.isArray(data)) {
        contactsArray = data;
      } else if (data.results) {
        contactsArray = data.results;
      } else if (data.data) {
        contactsArray = data.data;
      }

      setContacts(contactsArray);
      setFilteredContacts(contactsArray);
    } catch (error) {
      console.error("Erreur fetchContacts:", error);
      toast.error(t("Impossible de charger les contacts"));
      setContacts([]);
      setFilteredContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Fonction pour rafraîchir le token
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      const response = await fetch(`${BaseUrl}/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      return data.access;
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return null;
    }
  };

  // Fonction de compression d'image
const compressImage = (file, maxWidth = 600, quality = 0.6) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionner
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
    };
  });
};

  const handleSave = async (formData) => {
    setIsSaving(true);

    // 🔐 VÉRIFICATION ABONNEMENT - Affiche le modal si expiré
    if (!guardAction('add')) {
      setIsSaving(false);
      return;
    }

    // 🔐 VÉRIFICATION PERMISSION AJOUT
    if (!isAdmin && !hasPermission("add_contact")) {
      toast.error(t("Vous n'avez pas la permission d'ajouter un contact"));
      setIsSaving(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

  // Compresser l'image d'abord si présente
    if (formData.photo instanceof File) {
      // toast.info(t("Optimisation de l'image..."));
      const originalSize = formData.photo.size;
      const compressedPhoto = await compressImage(formData.photo, 600, 0.6);
      console.log(`Image réduite: ${(originalSize/1024).toFixed(0)}KB → ${(compressedPhoto.size/1024).toFixed(0)}KB`);
      formDataToSend.append("photo", compressedPhoto);
    }

      formDataToSend.append("entreprise", getEntrepriseId());
      formDataToSend.append("nom_contact", formData.nom_contact || "");
      selectedTypeContact == "Client"
        ? formDataToSend.append("type_client", formData.type_client || "")
        : formDataToSend.append("type_client", "");
      formDataToSend.append("categorie", formData.categorie || "");
      formDataToSend.append("nom", formData.nom || "");
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("telephone", `${formData.telephone}` || "");
      formDataToSend.append(
        "telephone2",
        formData.telephone2 ? `${formData.telephone2}` : ""
      );
      formDataToSend.append("adresse", formData.adresse || "");
      formDataToSend.append("type_contact", formData.type_contact || "");
      formDataToSend.append("capital_social", formData.capital_social || "");
      formDataToSend.append("site_web", formData.site_web || "");
      formDataToSend.append("commentaire", formData.commentaire || "");
      formDataToSend.append("nom_entreprise", formData.nom_entreprise || "");
      formDataToSend.append(
        "num_enreg_legal1",
        formData.num_enreg_legal1 || ""
      );
      formDataToSend.append(
        "num_enreg_legal2",
        formData.num_enreg_legal2 || ""
      );
      formDataToSend.append("forme_juridique", formData.forme_juridique || "");
      formDataToSend.append("revenu", formData.revenu || "");

      if (formData.photo instanceof File) {
        formDataToSend.append("photo", formData.photo);
      }

      if (formData.date_anniversaire) {
        formDataToSend.append(
          "date_anniversaire",
          moment(formData.date_anniversaire).format("YYYY-MM-DD")
        );
      }

      const response = await fetch(
      `${BaseUrl}/utilisateurs/createlistecontacte/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || t("Erreur serveur"));
    }

    showSuccess(t("Contact créé avec succès!"));
    // toast.success(t("Contact créé avec succès!"));
    fetchContacts();
    setModal(false);
  } catch (error) {
    toast.error(error.message);
    throw error;
  } finally {
    setIsSaving(false);
  }
};

  const handleUpdateContact = async (id, formData) => {
    setIsSaving(true);

    // 🔐 VÉRIFICATION PERMISSION MODIFICATION
    if (!isAdmin && !hasPermission("edit_contact")) {
      toast.error(t("Vous n'avez pas la permission de modifier ce contact"));
      setIsSaving(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("entreprise", getEntrepriseId() || "");
      formDataToSend.append("nom", formData.nom || "");
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("adresse", formData.adresse || "");
      formDataToSend.append("nom_entreprise", formData.nom_entreprise || "");
      formDataToSend.append("nom_contact", formData.nom_contact || "");
      formDataToSend.append("telephone", formData.telephone || "");
      formDataToSend.append("telephone2", formData.telephone2 || "");

      if (formData.date_anniversaire) {
        formDataToSend.append(
          "date_anniversaire",
          moment(formData.date_anniversaire).format("YYYY-MM-DD")
        );
      }

      formDataToSend.append("site_web", formData.site_web || "");
      formDataToSend.append("commentaire", formData.commentaire || "");
      formDataToSend.append("type_contact", formData.type_contact || "");
      formDataToSend.append("capital_social", formData.capital_social || "");
      formDataToSend.append(
        "num_enreg_legal1",
        formData.num_enreg_legal1 || ""
      );
      formDataToSend.append(
        "num_enreg_legal2",
        formData.num_enreg_legal2 || ""
      );
      formDataToSend.append("revenu", formData.revenu || "");
      formDataToSend.append("forme_juridique", formData.forme_juridique || "");

      if (formData.photo instanceof File) {
        formDataToSend.append("photo", formData.photo);
      } else if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      const response = await fetch(`${BaseUrl}/utilisateurs/contacte/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erreur de l'API:", errorData);
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`);
      }

      const updatedContact = await response.json();

      setContacts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updatedContact } : item
        )
      );

      setFilteredContacts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updatedContact } : item
        )
      );

      showSuccess(t("Contact mis à jour avec succès!"));
      // toast.success(t("Contact mis à jour avec succès!"));
      setModal(false);
      fetchContacts();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error(`${t("Échec de la mise à jour")}: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour déclencher la suppression
  const onClickDelete = (contact) => {
    // 🔐 VÉRIFICATION PERMISSION SUPPRESSION
    if (!isAdmin && !hasPermission("delete_contact")) {
      toast.error(t("Vous n'avez pas la permission de supprimer des contacts"));
      return;
    }
    setOrder(contact);
    setDeleteModal(true);
  };

  // Fonction pour exécuter la suppression
  const handleDeleteOrder = async () => {
    if (!order?.id) return;

    // 🔐 VÉRIFICATION ABONNEMENT - Affiche le modal si expiré
    if (!guardAction('delete')) {
      setDeleteModal(false);
      return;
    }

    try {
      const response = await fetch(
        `${BaseUrl}/utilisateurs/deletecontacte/${order.id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      switch (response.status) {
        case 200:
          setContacts((prev) => prev.filter((c) => c.id !== order.id));
          // toast.success(data.message || t("Contact supprimé"));
          showSuccess(data.message || t("Contact supprimé"));
          break;
        case 400:
          toast.error(
            data.message ||
              t(
                "Impossible de supprimer - contact utilisé dans des transactions"
              )
          );
          return;
        case 404:
          toast.error(t("Contact introuvable"));
          break;
        default:
          throw new Error(data.message || `Erreur ${response.status}`);
      }

      setDeleteModal(false);
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {t("Erreur technique lors de la suppression")}
        </span>,
        {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  useEffect(() => {
    setOrderList(filteredContacts);
  }, [filteredContacts]);

  // VALIDATION FORMIK
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
      date_anniversaire:
        order && order.date_anniversaire
          ? moment(order.date_anniversaire).format("YYYY-MM-DD")
          : "",
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
      nom: Yup.string().required(t("Veuillez entrer un nom")),
      email: Yup.string().email(t("Veuillez entrer un email valide")),
      categorie: Yup.string().required(
        t("Veuillez sélectionner une catégorie")
      ),
      type_contact: Yup.string().required(
        t("Veuillez sélectionner un type de contact")
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (isEdit) {
          if (!order?.id) {
            throw new Error(t("Aucun ID de contact spécifié pour l'édition"));
          }
          await handleUpdateContact(order.id, values);
        } else {
          await handleSave(values);
        }
        setModal(false);
        fetchContacts();
      } catch (error) {
        console.error("Erreur:", error);
        toast.error(error.message || t("Erreur lors de l'enregistrement"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Configuration des onglets
  const navTabsData = useMemo(
    () => [
      {
        key: "1",
        label: t("Tous les contacts"),
        icon: "ri-store-2-fill",
        filterType: "all",
        menuId: "contacts-all",
      },
      {
        key: "2",
        label: t("Clients"),
        icon: "ri-checkbox-circle-line",
        filterType: "Client",
        menuId: "contacts-client",
      },
      {
        key: "3",
        label: t("Fournisseurs"),
        icon: "ri-checkbox-circle-line",
        filterType: "Fournisseur",
        menuId: "contacts-fournisseur",
      },
      {
        key: "5",
        label: t("Prospects"),
        icon: "ri-checkbox-circle-line",
        filterType: "Prospect",
        menuId: "contacts-prospect",
      },
      {
        key: "6",
        label: t("Partenaires"),
        icon: "ri-checkbox-circle-line",
        filterType: "Partenaire",
        menuId: "contacts-partenaire",
      },
    ],
    [t]
  );

  const toggleTab = useCallback(
    (tabKey, contactType, menuId) => {
      if (activeTab !== tabKey) {
        setActiveTab(tabKey);

        // Activer le menu correspondant dans la sidebar
        if (activateSidebarMenu) {
          // Utiliser menuId si fourni, sinon déterminer à partir du type
          const menuIdToUse = menuId || `contacts-${contactType.toLowerCase()}`;
          activateSidebarMenu(menuIdToUse);
        }

        // Filtrer les contacts
        const filtered =
          contactType === "all"
            ? contacts
            : contacts.filter(
                (contact) => contact.type_contact === contactType
              );

        setFilteredContacts(filtered);
        setCurrentPage(1);

        // Mettre à jour l'URL
        const currentPath = window.location.pathname;
        navigate(`${currentPath}?type=${contactType}`);
      }
    },
    [activeTab, contacts, activateSidebarMenu, navigate]
  );

  // Effet pour synchroniser avec l'URL au chargement
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeFromUrl = searchParams.get("type") || "all"; // Défaut à "all"

    const tabKey = tabMap[typeFromUrl] || "1";
    const navTab = navTabsData.find((tab) => tab.filterType === typeFromUrl);

    if (activeTab !== tabKey) {
      setActiveTab(tabKey);

      // Activer le menu sidebar correspondant
      if (activateSidebarMenu && navTab?.menuId) {
        activateSidebarMenu(navTab.menuId);
      }
    }
  }, [location.search, activateSidebarMenu]);

  // Et dans l'effet de recherche/filtrage :
  useEffect(() => {
    if (searchTerm) {
      // ... recherche par terme
    } else {
      const currentType = Object.keys(tabMap).find(
        (key) => tabMap[key] === activeTab
      );

      console.log("Active Tab:", activeTab, "Current Type:", currentType); // Debug

      const filtered =
        currentType === "all"
          ? contacts
          : contacts.filter((contact) => contact.type_contact === currentType);

      setFilteredContacts(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, contacts, activeTab]);

  const handleTabChange = useCallback(
    (tabKey, tabData) => {
      if (activeTab !== tabKey) {
        setActiveTab(tabKey);

        // Activer le menu sidebar correspondant
        if (activateSidebarMenu && tabData?.menuId) {
          activateSidebarMenu(tabData.menuId);
        }

        // Filtrer les contacts
        const filtered =
          tabData.filterType === "all"
            ? contacts
            : contacts.filter(
                (contact) => contact.type_contact === tabData.filterType
              );

        setFilteredContacts(filtered);
        setCurrentPage(1);

        // Mettre à jour l'URL
        const currentPath = window.location.pathname;
        navigate(`${currentPath}?type=${tabData.filterType}`);
      }
    },
    [activeTab, contacts, activateSidebarMenu, navigate]
  );

  // Fonction utilitaire pour mapper type → menuId
  const getMenuIdFromType = (type) => {
    const menuMap = {
      all: "contacts-all",
      Client: "contacts-client",
      Fournisseur: "contacts-fournisseur",
      Prospect: "contacts-prospect",
      Partenaire: "contacts-partenaire",
    };
    return menuMap[type] || "contacts-all";
  };

  // FONCTION toggle
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setOrder(null);
      setIsEdit(false);
      validation.resetForm();
      setAfficherPlus(false);
      setselectedCategorie("");
      setSelectedTypeContact("");
    } else {
      // 🔐 VÉRIFICATION ABONNEMENT avant d'ouvrir le modal d'ajout
      if (!guardAction('add')) {
        return;
      }
      setModal(true);
    }
  }, [modal, validation, guardAction]);

  // FONCTION handleOrderClick
  const handleOrderClick = useCallback(
    (contact) => {
      // 🔐 VÉRIFICATION PERMISSION MODIFICATION
      if (!isAdmin && !hasPermission("edit_contact")) {
        toast.error(
          t("Vous n'avez pas la permission de modifier des contacts")
        );
        return;
      }

      // 🔐 VÉRIFICATION ABONNEMENT avant d'ouvrir le modal d'édition
      if (!guardAction('edit')) {
        return;
      }

      setOrder(contact);
      setIsEdit(true);
      setselectedCategorie(contact.categorie || "");
      setSelectedTypeContact(contact.type_contact || "");
      toggle();
    },
    [toggle, isAdmin, hasPermission, guardAction]
  );

  // Au début du composant AppContact, dans un useEffect
  useEffect(() => {
    // Exposer une fonction pour activer un menu depuis Navdata
    window.activateContactMenu = (type) => {
      const menuId = getMenuIdFromType(type);
      if (activateSidebarMenu) {
        activateSidebarMenu(menuId);
      }
    };

    return () => {
      delete window.activateContactMenu;
    };
  }, [activateSidebarMenu]);

  // Et dans Navdata.js, vous pouvez appeler :
  // window.activateContactMenu && window.activateContactMenu(type);

  // Calculer les données paginées
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContacts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Columns avec permissions
  const columns = useMemo(
    () => [
      {
        header: "#",
        enableColumnFilter: false,
        cell: (cell) => {
          const totalItems = filteredContacts?.length || 0;
          const itemPosition =
            cell.row.index + 1 + (currentPage - 1) * itemsPerPage;
          const reverseIndex = totalItems - itemPosition + 1;
          const displayIndex =
            totalItems > 0 && reverseIndex > 0
              ? reverseIndex
              : cell.row.index + 1;
          return (
            <span
              style={{
                display: "inline-block",
                width: "100%",
                textAlign: "center",
              }}
            >
              {displayIndex}
            </span>
          );
        },
        id: "index",
        size: 50,
      },
      {
        header: t("Nom"),
        accessorKey: "nom",
        enableColumnFilter: false,
        headerStyle: { fontWeight: "normal" },
        cell: (cellProps) => {
          const contact = cellProps.row.original;
          const photoUrl = contact.photo
            ? `${BaseUrl}${contact.photo}`
            : dummyImg;

          const getDisplayName = (contact) => {
            if (contact.categorie === "Particulier") {
              if (contact.nom && contact.nom_entreprise) {
                return `${contact.nom}`;
              }
              return (
                contact.nom || contact.nom_entreprise || t("Nom non renseigné")
              );
            }
            if (
              contact.categorie === "Entreprise" ||
              contact.categorie === "Institution"
            ) {
              if (contact.nom_entreprise && contact.nom_contact) {
                return `${contact.nom_entreprise} - ${contact.nom_contact}`;
              }
              return (
                contact.nom_entreprise ||
                contact.nom ||
                contact.nom_contact ||
                t("Nom non renseigné")
              );
            }
            return (
              contact.nom_entreprise ||
              contact.nom ||
              contact.nom_contact ||
              t("Nom non renseigné")
            );
          };

          const displayName = getDisplayName(contact);

          return (
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <img
                  src={photoUrl}
                  className="avatar-xxs rounded-circle"
                  onError={(e) => {
                    e.target.src = dummyImg;
                  }}
                />
              </div>
              <div className="flex-grow-1 ms-2">
                <Link
                  onClick={() => switchToDetails(cellProps.row.original.id)}
                >
                  <span>{displayName}</span>
                </Link>
              </div>
            </div>
          );
        },
      },
      {
        header: t("Type de contact"),
        accessorKey: "type_contact",
        enableColumnFilter: false,
        cell: (cellProps) => {
          const type_contact = cellProps.getValue();
          return (
            <h6>
              <span
                style={{ fontSize: "0.58rem" }}
                className={`badge badge-sm rounded-pill ${
                  type_contact === "Client"
                    ? "bg-warning"
                    : type_contact === "Fournisseur"
                    ? "bg-info"
                    : type_contact === "Prospect"
                    ? "bg-success"
                    : type_contact === "Partenaire"
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
              >
                {type_contact}
              </span>
            </h6>
          );
        },
      },
      {
        header: t("Catégorie"),
        accessorKey: "categorie",
        enableColumnFilter: false,
        cell: (cellProps) => {
          const categorie = cellProps.getValue();
          return (
            <h6>
              <span
                style={{ fontSize: "0.58rem" }}
                className={`badge badge-sm rounded-pill ${
                  categorie === "Particulier"
                    ? "bg-warning"
                    : categorie === "Entreprise"
                    ? "bg-info"
                    : categorie === "Institution"
                    ? "bg-success"
                    : categorie === "ONG"
                    ? "bg-danger"
                    : categorie === "Fondation"
                    ? "bg-dark"
                    : categorie === "Association"
                    ? "bg-black"
                    : categorie === "Groupement d'intérêt économie(GE)"
                    ? "bg-muted"
                    : categorie === "Administration"
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
              >
                {categorie}
              </span>
            </h6>
          );
        },
      },
      {
        header: t("Email"),
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: t("Adresse"),
        accessorKey: "adresse",
        enableColumnFilter: false,
      },
      {
        header: t("Actions"),
        cell: (cellProps) => {
          // Vérifier les permissions pour chaque action
          const canView =
            !permissionsLoading && (isAdmin || hasPermission("view_contact"));
          const canEdit =
            !permissionsLoading && (isAdmin || hasPermission("edit_contact"));
          const canDelete =
            !permissionsLoading && (isAdmin || hasPermission("delete_contact"));

          return (
            <ul className="list-inline hstack gap-2 mb-0">
              {/* Voir */}
              {canView && (
                <li className="list-inline-item">
                  <Link
                    onClick={() => switchToDetails(cellProps.row.original.id)}
                    to="#"
                    className="text-info d-inline-block"
                    title={t("Voir les détails")}
                  >
                    <i className="ri-eye-fill fs-16"></i>
                  </Link>
                </li>
              )}

              {/* Modifier */}
              {canEdit && (
                <li className="list-inline-item edit">
                  <Link
                    to="#"
                    className="text-primary d-inline-block edit-item-btn"
                    onClick={() => handleOrderClick(cellProps.row.original)}
                    title={t("Modifier le contact")}
                  >
                    <i className="ri-pencil-fill fs-16"></i>
                  </Link>
                </li>
              )}

              {/* Supprimer */}
              {canDelete && (
                <li className="list-inline-item">
                  <Link
                    to="#"
                    className="text-danger d-inline-block remove-item-btn"
                    onClick={() => onClickDelete(cellProps.row.original)}
                    title={t("Supprimer le contact")}
                  >
                    <i className="ri-delete-bin-5-fill fs-16"></i>
                  </Link>
                </li>
              )}

              {/* Message si aucune action disponible */}
              {!permissionsLoading && !canView && !canEdit && !canDelete && (
                <li className="list-inline-item">
                  <span
                    className="text-muted d-inline-block"
                    title={t("Aucune action autorisée")}
                  >
                    <i className="ri-forbid-line fs-16"></i>
                  </span>
                </li>
              )}
            </ul>
          );
        },
      },
    ],
    [
      t,
      handleOrderClick,
      filteredContacts,
      currentPage,
      itemsPerPage,
      permissionsLoading,
      isAdmin,
      hasPermission,
    ]
  );

  document.title = t("Contacts | INAWO - Suite de Gestion");

  return (
    <>
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={orderList}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Col lg={12}>
        <BreadCrumb
          title={t("Contact")}
          pageTitle={
            <>
              <i className="ri-contacts-book-line me-1 align-bottom"></i>
              &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>
              &nbsp;&gt;
            </>
          }
        />
        <div className="row">
          {/* 🔐 SEARCH AND ACTION BAR AVEC PERMISSIONS */}
          <SearchAndActionBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder={t("Chercher un contact...")}
            showSearch={true}
            onAddClick={() => {
              setIsEdit(false);
              toggle();
            }}
            addButtonText={t("Ajouter un contact")}
            showAddButton={
              !permissionsLoading && (isAdmin || hasPermission("add_contact"))
            }
            onExportClick={() => setIsExportCSV(true)}
            exportButtonText={t("Exporter")}
            exportButtonIcon="ri-file-upload-line"
            showExportButton={
              !permissionsLoading &&
              (isAdmin || hasPermission("export_contacts"))
            }
          />

          <div>
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "300px" }}
              >
                <Loader />
              </div>
            ) : contacts.length > 0 ? (
              <TableContainer
                columns={columns}
                data={currentItems}
                isGlobalFilter={false}
                customPageSize={itemsPerPage}
                showNavTabs={true}
                navTabs={navTabsData}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                navTabsClass="nav-tabs nav-tabs-custom nav-success py-4 mb-0 rounded-top-20"
                containerStyle={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
                }}
              >
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-5"></div>
                ) : (
                  <Pagination
                    style={{ marginLeft: "10px" }}
                    data={filteredContacts}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    perPageData={itemsPerPage}
                    alwaysShow={true}
                    showInfo={true}
                  />
                )}
              </TableContainer>
            ) : (
              <EmptyDataCard
                title={t("Aucun contact trouvé")}
                description={t("Commencer par ajouter un contact")}
                actionButton={
                  !permissionsLoading &&
                  (isAdmin || hasPermission("add_contact")) && (
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setIsEdit(false);
                        toggle();
                      }}
                      style={{ borderRadius: "20px" }}
                    >
                      <i className="ri-file-add-line me-1"></i>
                      {t("Ajouter un contact")}
                    </button>
                  )
                }
              />
            )}
          </div>

          {/* MODAL (toujours visible si on a les permissions) */}
          {!permissionsLoading &&
            (isAdmin ||
              hasPermission("add_contact") ||
              hasPermission("edit_contact")) && (
              <Modal
                id="showModal"
                isOpen={modal}
                toggle={toggle}
                centered
                contentClassName="custom-rounded-modal scrollable-modal-content"
                modalClassName="scrollable-modal"
                style={{ overflow: "visible" }}
              >
                <ModalHeader
                  className="bg-light p-3 rounded-top-20"
                  toggle={toggle}
                  style={{ borderBottom: "none" }}
                >
                  {!!isEdit
                    ? t("Modifier le contact")
                    : t("Ajouter un contact")}
                </ModalHeader>
                <Form
                  className="tablelist-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                >
                  <ModalBody
                    style={{ overflow: "visible" }}
                    className="modal-body-scrollable"
                  >
                    <Input type="hidden" id="id-field" />
                    <Row className="g-3">
                      <Col lg={12}>
                        <div className="text-center">
                          <div className="position-relative d-inline-block">
                            <div className="position-absolute bottom-0 end-0">
                              <Label
                                htmlFor="lead-image-input"
                                className="mb-0"
                              >
                                <div className="avatar-xs cursor-pointer">
                                  <div className="avatar-title bg-light border rounded-circle text-muted">
                                    <i className="ri-image-fill"></i>
                                  </div>
                                </div>
                              </Label>
                              <Input
                                className="form-control d-none"
                                id="lead-image-input"
                                type="file"
                                accept="image/png, image/gif, image/jpeg"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    validation.setFieldValue("photo", file);

                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      document.getElementById("lead-img").src =
                                        event.target.result;
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
                                      ? URL.createObjectURL(
                                          validation.values.photo
                                        )
                                      : order?.photo
                                      ? `${BaseUrl}${order.photo}`
                                      : dummyImg
                                  }
                                  alt="contact"
                                  id="lead-img"
                                  className="avatar-md rounded-circle object-fit-cover"
                                />
                              </div>
                            </div>
                          </div>
                          <h5 className="fs-13 mt-3"></h5>
                        </div>
                      </Col>

                      {/* Type contact */}
                      <Col lg={12}>
                        <div>
                          <Label
                            htmlFor="type_contact"
                            className="form-label font-size-13"
                          >
                            {t("Type contact")}{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Label>
                          <CustomSelect
                            value={
                              typeContactOptions.find(
                                (opt) =>
                                  opt.value === validation.values.type_contact
                              ) || null
                            }
                            onChange={(selectedOption) => {
                              const value = selectedOption
                                ? selectedOption.value
                                : "";
                              validation.setFieldValue("type_contact", value);
                              setSelectedTypeContact(value);
                            }}
                            options={typeContactOptions}
                            placeholder={t("Sélectionner un type")}
                          />
                          {validation.touched.type_contact &&
                          validation.errors.type_contact ? (
                            <FormFeedback type="invalid">
                              {validation.errors.type_contact}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      {/* Catégorie */}
                      <Col lg={12}>
                        <div>
                          <Label
                            htmlFor="categoryinput-choices"
                            className="form-label font-size-13"
                          >
                            {t("Catégorie")}{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Label>
                          <CustomSelect
                            value={
                              categorieOptions.find(
                                (opt) =>
                                  opt.value === validation.values.categorie
                              ) || null
                            }
                            onChange={(selectedOption) => {
                              const value = selectedOption
                                ? selectedOption.value
                                : "";
                              validation.setFieldValue("categorie", value);
                              setselectedCategorie(value);
                            }}
                            options={categorieOptions}
                            placeholder={t("Sélectionner une catégorie")}
                          />
                          {validation.touched.categorie &&
                          validation.errors.categorie ? (
                            <FormFeedback type="invalid">
                              {validation.errors.categorie}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      {/* Type Client */}
                      {selectedTypeContact == "Client" && (
                        <Col lg={12}>
                          <div>
                            <Label
                              htmlFor="type_client"
                              className="form-label font-size-13"
                            >
                              {t("Type client")}{" "}
                              <span style={{ color: "red" }}>*</span>
                            </Label>
                            <CustomSelect
                              value={
                                typeClientOptions.find(
                                  (opt) =>
                                    opt.value === validation.values.type_client
                                ) || null
                              }
                              onChange={(selectedOption) => {
                                const value = selectedOption
                                  ? selectedOption.value
                                  : "";
                                validation.setFieldValue("type_client", value);
                              }}
                              options={typeClientOptions}
                              placeholder={t("Sélectionner un type")}
                            />
                            {validation.touched.type_client &&
                            validation.errors.type_client ? (
                              <FormFeedback type="invalid">
                                {validation.errors.type_client}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                      )}

                      {/* Nom */}
                      <Col lg={12}>
                        <div>
                          <Label htmlFor="name-field" className="form-label">
                            {selectedCategorie === "Particulier"
                              ? t("Nom et Prénom du contact")
                              : t(
                                  `Nom  de ${
                                    selectedCategorie || "l'entreprise"
                                  }`
                                )}
                            <span style={{ color: "red" }}>*</span>
                          </Label>
                          <Input
                            name="nom"
                            id="name-field"
                            className="form-control"
                            placeholder={
                              selectedCategorie === "Particulier"
                                ? t("Entrez le nom et prénom")
                                : t("Entrez le nom")
                            }
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.nom || ""}
                            invalid={
                              validation.touched.nom && validation.errors.nom
                                ? true
                                : false
                            }
                            style={{ borderRadius: "20px", overflow: "hidden" }}
                          />
                          {validation.touched.nom && validation.errors.nom ? (
                            <FormFeedback type="invalid">
                              {validation.errors.nom}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      {/* ------------Afficher plus d'information---------------- */}
                      {!afficherPlus && (
                        <Col lg={12}>
                          <div className="text mt-3 mb-3">
                            <Button
                              type="submit"
                              className="form-control rounded-pill btn w-100 text-white"
                              onClick={handleAfficherPlus}
                              style={{
                                backgroundColor: "#014a92",
                                borderColor: "#014a92",
                              }}
                              disabled={loading}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#007bff";
                                e.target.style.borderColor = "#007bff";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#014a92";
                                e.target.style.borderColor = "#014a92";
                              }}
                            >
                              <i
                                className={`ri-${
                                  afficherPlus ? "eye-off" : "eye"
                                }-line me-1`}
                              ></i>
                              {afficherPlus
                                ? t("Afficher moins")
                                : t("Afficher plus")}
                            </Button>
                          </div>
                        </Col>
                      )}

                      {afficherPlus && (
                        <>
                          {/* Nom du contact */}
                          {selectedCategorie !== "Particulier" && (
                            <Col lg={12}>
                              <div>
                                <Label
                                  htmlFor="nom_contact-field"
                                  className="form-label"
                                >
                                  {t("Nom de contact")}
                                </Label>
                                <Input
                                  name="nom_contact"
                                  id="nom_contact-field"
                                  className="form-control"
                                  placeholder={t("Entrer le nom de contact")}
                                  type="text"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.nom_contact || ""}
                                  invalid={
                                    validation.touched.nom_contact &&
                                    validation.errors.nom_contact
                                      ? true
                                      : false
                                  }
                                  style={{
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                  }}
                                  contentClassName="rounded-modal"
                                />
                                {validation.touched.nom_contact &&
                                validation.errors.nom_contact ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.nom_contact}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          )}

                          {/* Nom de l'entreprise */}
                          {selectedCategorie == "Particulier" && (
                            <Col lg={12}>
                              <div>
                                <Label
                                  htmlFor="nom_entreprise-field"
                                  className="form-label"
                                >
                                  {t("Nom de l'entreprise")}
                                </Label>
                                <Input
                                  name="nom_entreprise"
                                  id="nom_entreprise-field"
                                  className="form-control"
                                  placeholder="Ex: Inawo"
                                  type="text"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.nom_entreprise || ""}
                                  invalid={
                                    validation.touched.nom_entreprise &&
                                    validation.errors.nom_entreprise
                                      ? true
                                      : false
                                  }
                                  style={{
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                  }}
                                  contentClassName="rounded-modal"
                                />
                                {validation.touched.nom_entreprise &&
                                validation.errors.nom_entreprise ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.nom_entreprise}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          )}

                          {/* Téléphone */}
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="nom_entreprise-field"
                                className="form-label"
                              >
                                {t("Téléphone")}
                              </Label>
                              <PhoneInput
                                className="rounded-phone"
                                name="telephone"
                                value={validation.values.telephone || ""}
                                onChange={(value) => {
                                  const phoneValue = value ? String(value) : "";
                                  validation.setFieldValue(
                                    "telephone",
                                    phoneValue
                                  );
                                }}
                                countries={country}
                                defaultCountry="FR"
                                onBlur={() =>
                                  validation.setFieldTouched("telephone", true)
                                }
                              />
                              {validation.touched.telephone &&
                                validation.errors.telephone && (
                                  <div className="text-danger">
                                    {validation.errors.telephone}
                                  </div>
                                )}
                            </div>
                          </Col>

                          {/* Téléphone 2 */}
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="nom_entreprise-field"
                                className="form-label"
                              >
                                {t("Téléphone 2")}
                              </Label>
                              <PhoneInput
                                className="rounded-phone"
                                name="telephone2"
                                value={validation.values.telephone2 || ""}
                                onChange={(value) => {
                                  const phoneValue = value ? String(value) : "";
                                  validation.setFieldValue(
                                    "telephone2",
                                    phoneValue
                                  );
                                }}
                                countries={country}
                                defaultCountry="FR"
                                onBlur={() =>
                                  validation.setFieldTouched("telephone2", true)
                                }
                              />
                              {validation.touched.telephone2 &&
                                validation.errors.telephone2 && (
                                  <div className="text-danger">
                                    {validation.errors.telephone2}
                                  </div>
                                )}
                            </div>
                          </Col>

                          {/* Email */}
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="email-field"
                                className="form-label"
                              >
                                {t("Email")}
                              </Label>
                              <Input
                                name="email"
                                id="email-field"
                                className="form-control"
                                placeholder={t("Entrez votre email")}
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email || ""}
                                invalid={
                                  validation.touched.email &&
                                  validation.errors.email
                                    ? true
                                    : false
                                }
                                style={{
                                  borderRadius: "20px",
                                  overflow: "hidden",
                                }}
                                contentClassName="rounded-modal"
                              />
                              {validation.touched.email &&
                              validation.errors.email ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.email}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>

                          {/* Adresse */}
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="address-field"
                                className="form-label"
                              >
                                {t("Adresse")}
                              </Label>
                              <Input
                                name="adresse"
                                id="address-field"
                                className="form-control"
                                placeholder={t("Entrez votre adresse")}
                                type="text"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.adresse || ""}
                                invalid={
                                  validation.touched.adresse &&
                                  validation.errors.adresse
                                    ? true
                                    : false
                                }
                                style={{
                                  borderRadius: "20px",
                                  overflow: "hidden",
                                }}
                                contentClassName="rounded-modal"
                              />
                              {validation.touched.adresse &&
                              validation.errors.adresse ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.adresse}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>

                          {/* Revenu */}
                          {selectedCategorie == "Particulier" && (
                            <Col lg={12}>
                              <div>
                                <Label
                                  htmlFor="revenue-field"
                                  className="form-label font-size-13"
                                >
                                  {t("Revenue")}
                                </Label>
                                <CustomSelect
                                  value={
                                    revenuOptions.find(
                                      (opt) =>
                                        opt.value === validation.values.revenu
                                    ) || null
                                  }
                                  onChange={(selectedOption) => {
                                    const value = selectedOption
                                      ? selectedOption.value
                                      : "";
                                    validation.setFieldValue("revenu", value);
                                  }}
                                  options={revenuOptions}
                                  placeholder={t("Sélectionner une tranche")}
                                />
                                {validation.touched.revenu &&
                                validation.errors.revenu ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.revenu}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          )}
                          {/* Segment */}
                          {selectedCategorie == "Particulier" && (
                            <Col lg={12}>
                              <div>
                                <Label
                                  htmlFor="segment-field"
                                  className="form-label"
                                >
                                  {t("Segment")}
                                </Label>
                                <Input
                                  name="segment"
                                  id="segment-field"
                                  className="form-control"
                                  placeholder={t("Entrez votre segment")}
                                  type="text"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.segment || ""}
                                  invalid={
                                    validation.touched.segment &&
                                    validation.errors.segment
                                      ? true
                                      : false
                                  }
                                  style={{
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                  }}
                                  contentClassName="rounded-modal"
                                />
                                {validation.touched.segment &&
                                validation.errors.segment ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.segment}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          )}
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="date_anniversaire"
                                className="form-label"
                              >
                                {selectedCategorie === "Particulier"
                                  ? t("Date d'anniversaire")
                                  : t("Date de création")}
                              </Label>
                              <Input
                                type="date"
                                name="date_anniversaire"
                                id="date_anniversaire"
                                onChange={(e) => {
                                  console.log(
                                    "Date anniversaire:",
                                    e.target.value
                                  );
                                  validation.setFieldValue(
                                    "date_anniversaire",
                                    e.target.value
                                  );
                                }}
                                onBlur={validation.handleBlur}
                                value={
                                  validation.values.date_anniversaire || ""
                                }
                                style={{ borderRadius: "20px" }}
                                invalid={
                                  validation.touched.date_anniversaire &&
                                  !!validation.errors.date_anniversaire
                                }
                              />
                              {validation.touched.date_anniversaire &&
                                validation.errors.date_anniversaire && (
                                  <div className="invalid-feedback d-block">
                                    {validation.errors.date_anniversaire}
                                  </div>
                                )}
                            </div>
                          </Col>
                          {/* <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="date_anniversaire"
                                className="form-label"
                              >
                                {selectedCategorie === "Particulier"
                                  ? t("Date d'anniversaire")
                                  : t("Date de création")}
                              </Label>
                              <Flatpickr
                                id="date_anniversaire"
                                className="form-control"
                                style={{
                                  borderRadius: "20px",
                                  padding: "10px 15px",
                                }}
                                options={{
                                  dateFormat: "Y-m-d",
                                  maxDate: new Date(),
                                  static: false,
                                  position: "auto",
                                  appendTo: document.body,
                                }}
                                placeholder={t("Sélectionner une date")}
                                value={validation.values.date_anniversaire}
                                onChange={(date) => {
                                  const formattedDate = date[0]
                                    ? moment(date[0]).format("YYYY-MM-DD")
                                    : "";
                                  validation.setFieldValue(
                                    "date_anniversaire",
                                    formattedDate
                                  );
                                }}
                              />
                              {validation.touched.date_anniversaire &&
                              validation.errors.date_anniversaire ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.date_anniversaire}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col> */}

                          {/* Forme juridique */}
                          {selectedCategorie == "Entreprise" && (
                            <Col lg={12}>
                              <div>
                                <Label
                                  htmlFor="forme_juridique"
                                  className="form-label"
                                >
                                  {t("Forme juridique")}
                                </Label>
                                <CustomSelect
                                  value={
                                    formeJuridiqueOptions.find(
                                      (opt) =>
                                        opt.value ===
                                        validation.values.forme_juridique
                                    ) || null
                                  }
                                  onChange={(selectedOption) => {
                                    const value = selectedOption
                                      ? selectedOption.value
                                      : "";
                                    validation.setFieldValue(
                                      "forme_juridique",
                                      value
                                    );
                                  }}
                                  options={formeJuridiqueOptions}
                                  placeholder={t(
                                    "Sélectionner une forme juridique"
                                  )}
                                />
                                {validation.touched.forme_juridique &&
                                validation.errors.forme_juridique ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.forme_juridique}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          )}
                          {/* Capital social */}
                          {selectedCategorie == "Entreprise" && (
                            <Col lg={12}>
                              <div>
                                <Label
                                  htmlFor="capital_social"
                                  className="form-label"
                                >
                                  {t("Capital social")}
                                </Label>
                                <Input
                                  type="number"
                                  id="capital_social"
                                  className="form-control"
                                  placeholder={t("Capital social")}
                                  name="capital_social"
                                  value={validation.values.capital_social || ""}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.capital_social &&
                                    validation.errors.capital_social
                                      ? true
                                      : false
                                  }
                                  style={{
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                  }}
                                />
                                {validation.touched.capital_social &&
                                validation.errors.capital_social ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.capital_social}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          )}

                          {/* Champ pour Numéro légal 1 */}
                          {selectedCategorie !== "Particulier" && (
                            <Col lg={12}>
                              <div>
                                <Label
                                  htmlFor="num_enreg_legal1-field"
                                  className="form-label"
                                >
                                  {t("Numéro légal 1")}
                                </Label>
                                <Input
                                  type="text"
                                  id="num_enreg_legal1-field"
                                  name="num_enreg_legal1"
                                  className="form-control"
                                  placeholder={t("Entrez le numéro légal 1")}
                                  value={
                                    validation.values.num_enreg_legal1 || ""
                                  }
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.num_enreg_legal1 &&
                                    validation.errors.num_enreg_legal1
                                      ? true
                                      : false
                                  }
                                  style={{
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                  }}
                                />
                                {validation.touched.num_enreg_legal1 &&
                                validation.errors.num_enreg_legal1 ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.num_enreg_legal1}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          )}

                          {/* Champ pour Numéro légal 2 */}
                          {selectedCategorie !== "Particulier" && (
                            <Col lg={12}>
                              <div>
                                <Label
                                  htmlFor="num_enreg_legal2-field"
                                  className="form-label"
                                >
                                  {t("Numéro légal 2")}
                                </Label>
                                <Input
                                  type="text"
                                  id="num_enreg_legal2-field"
                                  name="num_enreg_legal2"
                                  className="form-control"
                                  placeholder={t("Entrez le numéro légal 2")}
                                  value={
                                    validation.values.num_enreg_legal2 || ""
                                  }
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                    validation.touched.num_enreg_legal2 &&
                                    validation.errors.num_enreg_legal2
                                      ? true
                                      : false
                                  }
                                  style={{
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                  }}
                                />
                                {validation.touched.num_enreg_legal2 &&
                                validation.errors.num_enreg_legal2 ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.num_enreg_legal2}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          )}

                          {/* Champ pour le site web */}
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="website-field"
                                className="form-label"
                              >
                                {["Société", "Entreprise"].includes(
                                  selectedCategorie
                                )
                                  ? t("Site web de l'entreprise")
                                  : t("Site web")}
                              </Label>
                              <Input
                                type="text"
                                id="website-field"
                                name="site_web"
                                className="form-control"
                                placeholder={
                                  ["Société", "Entreprise"].includes(
                                    selectedCategorie
                                  )
                                    ? t("https://www.entreprise.com")
                                    : t("https://example.com")
                                }
                                value={validation.values.site_web || ""}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                invalid={
                                  validation.touched.site_web &&
                                  validation.errors.site_web
                                    ? true
                                    : false
                                }
                                style={{
                                  borderRadius: "20px",
                                  overflow: "hidden",
                                }}
                              />
                              {validation.touched.site_web &&
                              validation.errors.site_web ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.site_web}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>

                          {/* Commentaire */}
                          <Col lg={12}>
                            <div className="mb-3">
                              <Label
                                htmlFor="commentaire-field"
                                className="form-label"
                              >
                                {t("Commentaire")}
                              </Label>
                              <textarea
                                name="commentaire"
                                id="commentaire-field"
                                className="form-control"
                                rows="3"
                                placeholder={t("Ajouter un commentaire")}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.commentaire || ""}
                                style={{
                                  borderRadius: "20px",
                                  overflow: "hidden",
                                }}
                              ></textarea>
                              {validation.touched.commentaire &&
                              validation.errors.commentaire ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.commentaire}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </>
                      )}
                    </Row>
                  </ModalBody>

                  <ModalFooter>
                    <div className="pagination-wrap hstack gap-2 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setModal(false)}
                        style={{ borderRadius: "20px" }}
                      >
                        {t("Annuler")}
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success"
                        style={{ borderRadius: "20px" }}
                      >
                        {validation.isSubmitting
                          ? t("Enregistrement...")
                          : isEdit
                          ? t("Mettre à jour")
                          : t("Enregistrer")}
                      </button>
                    </div>
                  </ModalFooter>
                </Form>
              </Modal>
            )}
          <ToastContainer closeButton={false} limit={1} />
        </div>
      </Col>
    </>
  );
};

export default withRouter(withTranslation()(AppContact));
