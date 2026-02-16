import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  UncontrolledDropdown,
  FormFeedback,
  Spinner,
  Alert,
  Row,
  FormGroup,
  CustomInput,
  Badge,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "../../../Components/ContactDeleteModal/CountryPhoneInput";
import smallImage9 from "../../../assets/images/small/img-9.jpg";
import dummyUser from "../../../assets/images/users/user-dummy-img.jpg";
import * as Yup from "yup";
import { useFormik } from "formik";
import usflag from "../../../assets/images/flags/us.svg";
import SimpleBar from "simplebar-react";
import axios from "axios";
import { country } from "../../../common/data";
import { CustomSelect } from "../../../Components/Common/CustomSelectStyles";
import EmptyDataCard from "../../../Components/Common/EmptyDataCard";
import {
  WithPermission,
  ShowIf,
} from "../../../Components/Permissions/WithPermission";
import { usePermissionCheck } from "../../../Components/Hooks/usePermissionCheck";
import { useUniversalPermissions } from "../../../Components/Hooks/useUniversalPermissions";
import { AddUserButton } from "../../../Components/Subscription/AddUserButton";
import { BaseUrl } from "../../APIKey/ApiKey";
import { useProfile } from "../../../Components/Hooks/UserHooks";

const RôlesData = [
  {
    value: "Administrateur",
    label: "Administrateur",
    description: "Il possède tous les droits, accès et permissions",
  },
  {
    value: "Collaborateur",
    label: "Collaborateur",
    description:
      "Ajouter un membre de votre équipe et assignez lui des permissions",
  },
  {
    value: "Observateur",
    label: "Observateur",
    description: "Il dispose d'un regard sur les modules que vous lui assignez",
  },
];

const allPermissionsData = [
  {
    id: "contact",
    label: "Contact",
    description: "Votre collaborateur pourra ajouter ou modifier vos contacts",
    actions: [
      { id: "add_contact", label: "Ajouter" },
      { id: "change_contact", label: "Modifier" },
      { id: "delete_contact", label: "Supprimer" },
      { id: "view_contact", label: "Voir" },
      { id: "all_contact", label: " Tout" },
    ],
  },
  {
    id: "catalogue",
    label: "Catalogue",
    description:
      "Votre collaborateur pourra ajouter ou modifier vos produits/services",
    actions: [
      { id: "add_produit", label: "Ajouter" },
      { id: "change_produit", label: "Modifier" },
      { id: "delete_produit", label: "Supprimer" },
      { id: "view_produit", label: "Voir" },
      { id: "all_produit", label: " Tout Voir" },
    ],
  },
  {
    id: "agenda",
    label: "Agenda",
    description: "Votre collaborateur pourra gérer l'agenda",
    actions: [
      { id: "add_agenda", label: "Ajouter" },
      { id: "change_agenda", label: "Modifier" },
      { id: "delete_agenda", label: "Supprimer" },
      { id: "view_agenda", label: "Voir" },
      { id: "all_agenda", label: " Tout Voir" },
    ],
  },
  {
    id: "facturation_simple",
    label: "Facture Simple",
    description: "Votre collaborateur pourra gérer les factures simples",
    actions: [
      { id: "add_facture", label: "Ajouter" },
      { id: "change_facture", label: "Modifier" },
      { id: "delete_facture", label: "Voir" },
      { id: "view_facture", label: "Voir" },
      { id: "all_facture", label: " Tout Voir" },
    ],
  },
  {
    id: "vente",
    label: "Vente",
    description: "Votre collaborateur pourra gérer les ventes",
    actions: [
      { id: "add_vente", label: "Ajouter" },
      { id: "change_vente", label: "Modifier" },
      { id: "delete_vente", label: "Voir" },
      { id: "view_vente", label: "Voir" },
      { id: "all_vente", label: " Tout Voir" },
    ],
  },
  {
    id: "opportunite",
    label: "Opportunité",
    description:
      " Votre collaborateur pourra gérer les opportunités commerciales",
    actions: [
      { id: "add_opportunite", label: "Ajouter" },
      { id: "change_opportunite", label: "Modifier" },
      { id: "delete_opportunite", label: "Voir" },
      { id: "view_opportunite", label: "Voir" },
      { id: "all_opportunite", label: " Tout Voir" },
    ],
  },
  {
    id: "tache",
    label: "Tâches",
    description: "Votre collaborateur pourra gérer les tâches",
    actions: [
      { id: "add_tache", label: "Ajouter" },
      { id: "change_tache", label: "Modifier" },
      { id: "delete_tache", label: "Voir" },
      { id: "view_tache", label: "Voir" },
      { id: "all_tache", label: " Tout Voir" },
    ],
  },
  {
    id: "bon_reception",
    label: "Bon de Réception",
    description: "Votre collaborateur pourra gérer les bons de réception",
    actions: [
      { id: "add_bon_reception", label: "Ajouter" },
      { id: "change_bon_reception", label: "Modifier" },
      { id: "delete_bon_reception", label: "Voir" },
      { id: "view_bon_reception", label: "Voir" },
      { id: "all_bon_reception", label: " Tout Voir" },
    ],
  },
  {
    id: "facture_normalise",
    label: "Facture Normalisée",
    description: "Votre collaborateur pourra gérer les factures normalisées",
    actions: [
      { id: "add_facture_normalise", label: "Ajouter" },
      { id: "change_facture_normalise", label: "Modifier" },
      { id: "delete_facture_normalise", label: "Voir" },
      { id: "view_facture_normalise", label: "Voir" },
      { id: "all_facture_normalise", label: " Tout Voir" },
    ],
  },
  {
    id: "stock",
    label: "Stock",
    description: "Votre collaborateur pourra gérer le stock",
    actions: [
      { id: "add_stock", label: "Ajouter" },
      { id: "change_stock", label: "Modifier" },
      { id: "delete_stock", label: "Voir" },
      { id: "view_stock", label: "Voir" },
      { id: "all_stock", label: " Tout Voir" },
    ],
  },
  {
    id: "stock_integral",
    label: "Stock Intégral",
    description: "Votre collaborateur pourra gérer le stock intégral",
    actions: [
      { id: "add_stock_integral", label: "Ajouter" },
      { id: "change_stock_integral", label: "Modifier" },
      { id: "delete_stock_integral", label: "Voir" },
      { id: "view_stock_integral", label: "Voir" },
      { id: "all_stock_integral", label: " Tout Voir" },
    ],
  },
  {
    id: "bon_livraison",
    label: "Bon de Livraison",
    description: "Votre collaborateur pourra gérer les bons de livraison",
    actions: [
      { id: "add_bon_livraison", label: "Ajouter" },
      { id: "change_bon_livraison", label: "Modifier" },
      { id: "delete_bon_livraison", label: "Voir" },
      { id: "view_bon_livraison", label: "Voir" },
      { id: "all_bon_livraison", label: " Tout Voir" },
    ],
  },
  {
    id: "bon_avoir",
    label: "Bon d'Avoir",
    description: "Votre collaborateur pourra gérer les bons d'avoir",
    actions: [
      { id: "add_bon_avoir", label: "Ajouter" },
      { id: "change_bon_avoir", label: "Modifier" },
      { id: "delete_bon_avoir", label: "Voir" },
      { id: "view_bon_avoir", label: "Voir" },
      { id: "all_bon_avoir", label: " Tout Voir" },
    ],
  },
  {
    id: "bon_sortie",
    label: "Bon de Sortie",
    description: "Votre collaborateur pourra gérer les bons de sortie",
    actions: [
      { id: "add_bon_sortie", label: "Ajouter" },
      { id: "change_bon_sortie", label: "Modifier" },
      { id: "delete_bon_sortie", label: "Voir" },
      { id: "view_bon_sortie", label: "Voir" },
      { id: "all_bon_sortie", label: " Tout Voir" },
    ],
  },
  {
    id: "approvisionnement",
    label: "Approvisionnement",
    description: "Votre collaborateur pourra gérer les approvisionnements",
    actions: [
      { id: "add_approvisionnement", label: "Ajouter" },
      { id: "change_approvisionnement", label: "Modifier" },
      { id: "delete_approvisionnement", label: "Voir" },
      { id: "view_approvisionnement", label: "Voir" },
      { id: "all_approvisionnement", label: " Tout Voir" },
    ],
  },
  {
    id: "bon_transfert",
    label: "Bon de Transfert",
    description: "Votre collaborateur pourra gérer les bons de transfert",
    actions: [
      { id: "add_bon_transfert", label: "Ajouter" },
      { id: "change_bon_transfert", label: "Modifier" },
      { id: "delete_bon_transfert", label: "Voir" },
      { id: "view_bon_transfert", label: "Voir" },
      { id: "all_bon_transfert", label: " Tout Voir" },
    ],
  },
  {
    id: "bon_commande",
    label: "Bon de Commande",
    description: "Votre collaborateur pourra gérer les bons de commande",
    actions: [
      { id: "add_bon_commande", label: "Ajouter" },
      { id: "change_bon_commande", label: "Modifier" },
      { id: "delete_bon_commande", label: "Voir" },
      { id: "view_bon_commande", label: "Voir" },
      { id: "all_bon_commande", label: " Tout Voir" },
    ],
  },
  {
    id: "depense",
    label: "Dépenses",
    description: "Votre collaborateur pourra gérer les dépenses",
    actions: [
      { id: "add_depense", label: "Ajouter" },
      { id: "change_depense", label: "Modifier" },
      { id: "delete_depense", label: "Voir" },
      { id: "view_depense", label: "Voir" },
      { id: "all_depense", label: " Tout Voir" },
    ],
  },
];

const Team = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { hasPermission, permissionsLoading, isAdmin } = useUniversalPermissions();


  useEffect(() => {
    if (!permissionsLoading) {
      console.log("🔐 PERMISSIONS TEAM:", {
        isAdmin,
        canAddUser: hasPermission("can_add_user"),
        canEditUser: hasPermission("can_edit_user"),
        canDeleteUser: hasPermission("can_delete_user")
      });
    }
  }, [permissionsLoading, isAdmin, hasPermission]);
  
  // const [modalStep3, setModalStep3] = useState(false);
  const [permissionsModalMode, setPermissionsModalMode] = useState("create"); // 'create' ou 'edit'
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const { userProfile, token } = useProfile();
  const {
    canAddUsers,
    canManagePermissions,
    isPaidSubscription,
    isAbonne,
    isCollaborator,
    isObserver,
    subscriptionModule,
    subscriptionCategory,
    getUpgradeMessage,
  } = usePermissionCheck();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NODE_ENV === "production" ? `${BaseUrl}` : "/api/",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  // Fonction pour suspendre/réactiver un utilisateur
  const handleSuspendUser = async (userId, currentStatus) => {
    if (!canManagePermissions) {
      toast.error("Vous n'avez pas les permissions pour cette action");
      return;
    }

    try {
      setActionLoading(true);

      const response = await axiosInstance.patch(
        `${BaseUrl}/utilisateurs/suspend-collaborateur/`,
        { user_id: userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const newStatus = !currentStatus;
        toast.success(
          newStatus
            ? "Utilisateur suspendu avec succès"
            : "Utilisateur réactivé avec succès"
        );

        // Mettre à jour la liste des utilisateurs
        setTeamList((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, suspendu: newStatus } : user
          )
        );
      }
    } catch (error) {
      console.error("Erreur lors de la modification du statut:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la modification du statut"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // États pour les modals
  const [modalStep1, setModalStep1] = useState(false);
  const [modalStep2, setModalStep2] = useState(false);
  const [modalStep3, setModalStep3] = useState(false);

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [teamList, setTeamList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [teamUserForAction, setTeamUserForAction] = useState(null);
  const [authUserId, setAuthUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [hoveredPeriode, setHoveredPeriode] = useState(null);
  const [destinationType, setDestinationType] = useState("");
  const [selectedPays, setSelectedPays] = useState(null);
  const navigate = useNavigate();
  const { modulePermissions } = usePermissionCheck();
  const { contact } = modulePermissions;

  const location = useLocation();
  console.log("Abonnement");

  useEffect(() => {
    // Vérifier si on doit ouvrir le modal
    if (location.state?.showModal) {
      openModalStep1();
      // Nettoyer le state pour éviter que le modal s'ouvre à nouveau
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // États existants
  const [activeTab, setActiveTab] = useState("1");

  const paysOptions = useMemo(() => {
    return country.map((c) => ({
      value: c.countryName,
      label: c.countryName,
      countryCode: c.countryCode,
      flagImg: c.flagImg,
    }));
  }, []);

  const [selectedMagasin, setSelectedMagasin] = useState(null);
  const [selectedSuccursale, setSelectedSuccursale] = useState(null);

  // Reset des sélections quand le type change
  useEffect(() => {
    setSelectedMagasin(null);
    setSelectedSuccursale(null);
    formikValidation.setFieldValue("magasin", "");
    formikValidation.setFieldValue("succursale", "");
  }, [destinationType]);

  useEffect(() => {
    if (!modalStep2) {
      setSelectedPays(null);
    }
  }, [modalStep2]);

  const handleSelectPays = (selectedOption) => {
    setSelectedPays(selectedOption);
    formikValidation.setFieldValue(
      "pays",
      selectedOption ? selectedOption.value : ""
    );
  };

  // Initialisation des données utilisateur
  useEffect(() => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        setError("Données utilisateur non trouvées");
        setIsLoading(false);
        return;
      }

      const userObject = JSON.parse(userString);
      if (!userObject || !userObject.id) {
        setError("ID utilisateur non trouvé dans les données utilisateur.");
        setIsLoading(false);
        return;
      }

      setAuthUserId(userObject.id);
      setUserData(userObject);

      if (!userObject.groupes || userObject.groupes.length === 0) {
        setError("Aucune succursale disponible");
      }

      if (!userObject.magasins || userObject.magasins.length === 0) {
        setError("Aucun magasin disponible");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Erreur d'initialisation:", error);
      setError(error.message);
      setIsLoading(false);
    }
  }, []);

  // Récupération des utilisateurs
  const fetchUsers = useCallback(async () => {
    
    if (!authUserId) {
    console.warn("authUserId est undefined, abandon de fetchUsers");
    return;
  }

    setPageLoading(true);
    try {
      const response = await axiosInstance.get(
        `/utilisateurs/colaborateuruser/${authUserId}/`
      );

      const data = response.data.collaborateurs || response.data;

      if (Array.isArray(data)) {
        setTeamList(data);
        setError(null);
      } else if (data && typeof data === "object") {
        // Si c'est un objet unique, le mettre dans un tableau
        setTeamList([data]);
        setError(null);
      } else {
        throw new Error("Format de données invalide");
      }
    } catch (err) {
      console.error("Erreur fetchUsers:", err);
      setError(err.message);
      toast.error("Erreur de chargement des utilisateurs");
    } finally {
      setPageLoading(false);
    }
  }, [authUserId, axiosInstance]);

  useEffect(() => {
    if (authUserId) {
      fetchUsers();
    }
  }, [authUserId, fetchUsers]);

  // Filtrage des utilisateurs
  const filteredUsers = useMemo(() => {
    return teamList.filter((user) => {
      if (!searchTerm) return true;
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (user.nom && user.nom.toLowerCase().includes(searchTermLower)) ||
        (user.prenom && user.prenom.toLowerCase().includes(searchTermLower)) ||
        (user.email && user.email.toLowerCase().includes(searchTermLower)) ||
        (user.fonction &&
          user.fonction.toLowerCase().includes(searchTermLower)) ||
        (user.telephone &&
          user.telephone.toLowerCase().includes(searchTermLower))
      );
    });
  }, [teamList, searchTerm]);

  // Gestion des modals
  const openModalStep1 = () => {
    setModalStep1(true);
    setSelectedRole("");
  };

  const closeModalStep1 = () => {
    setModalStep1(false);
  };

  const proceedToStep2 = () => {
    if (!selectedRole) {
      toast.error("Veuillez sélectionner un rôle");
      return;
    }
    setModalStep1(false);
    setModalStep2(true);
  };

  const closeModalStep2 = () => {
    setModalStep2(false);
    formikValidation.resetForm();
    setDestinationType("");
  };

  const proceedToStep3 = () => {
    // En mode édition, on ne valide pas le formulaire
    if (permissionsModalMode === "edit") {
      setModalStep2(false);
      setModalStep3(true);
      return;
    }

    // En mode création, valider le formulaire comme avant
    formikValidation.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        setModalStep2(false);
        setModalStep3(true);
      } else {
        formikValidation.setTouched(
          Object.keys(errors).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
          )
        );
        toast.error("Veuillez corriger les erreurs dans le formulaire.");
      }
    });
  };

  const backToStep1 = () => {
    setModalStep2(false);
    setModalStep1(true);
  };

  const backToStep2 = () => {
    setModalStep3(false);
    setModalStep2(true);
  };

  // const closeModalStep3 = () => {
  //   setModalStep3(false);
  //   setSelectedPermissions({});
  // };

  // Soumission du formulaire
  const handleSubmitForm = async (values) => {
    if (permissionsModalMode === "edit") {
      // Ne pas soumettre le formulaire en mode édition
      return;
    }

    setFormSubmitLoading(true);

    // Dans handleSubmitForm, avant de convertir les permissions
    if (isObservateur) {
      // Vérifier que seules les permissions "Voir" sont sélectionnées
      const hasNonViewPermissions = Object.keys(selectedPermissions).some(
        (moduleId) =>
          Object.keys(selectedPermissions[moduleId]).some(
            (actionId) => !actionId.includes("view")
          )
      );

      if (hasNonViewPermissions) {
        toast.error(
          "Les observateurs ne peuvent avoir que des permissions de visualisation"
        );
        setFormSubmitLoading(false);
        return;
      }
    }

    // Convertir les permissions sélectionnées en format plat
    const flatPermissions = [];
    Object.keys(selectedPermissions).forEach((moduleId) => {
      Object.keys(selectedPermissions[moduleId]).forEach((actionId) => {
        if (selectedPermissions[moduleId][actionId] === true) {
          flatPermissions.push(actionId);
        }
      });
    });

    if (flatPermissions.length === 0) {
      toast.error("Veuillez sélectionner au moins une permission.");
      setFormSubmitLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("nom", values.nom.trim());
    formData.append("prenom", values.prenom.trim());
    formData.append("email", values.email.trim());
    formData.append("fonction", values.fonction.trim());
    formData.append("succursale", values.succursale);
    formData.append("magasin", values.magasin);
    formData.append("pays", values.pays);
    formData.append("password", "Inawo@1234");
    formData.append("type_utilisateur", selectedRole);
    formData.append("langue", "Fr");
    formData.append("telephone", values.telephone || "");
    formData.append("adresse", values.adresse || "");
    formData.append("permissions", JSON.stringify(flatPermissions));

    try {
      await axiosInstance.post("/utilisateurs/inscription/", formData);
      toast.success("Utilisateur ajouté avec succès !");
      fetchUsers();
      closeModalStep3();
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'utilisateur:",
        error.response?.data || error.message
      );
      let errorMessage =
        "Une erreur est survenue lors de la création de l'utilisateur.";
      if (error.response?.data) {
        if (error.response.data.email) {
          errorMessage = `Email: ${
            error.response.data.email.join
              ? error.response.data.email.join(", ")
              : error.response.data.email
          }`;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (typeof error.response.data === "object") {
          const messages = Object.values(error.response.data).flat().join(" ");
          if (messages) errorMessage = messages;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Configuration Formik
  const formikValidation = useFormik({
    initialValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      adresse: "",
      pays: "",
      fonction: "",
      succursale: "",
      magasin: "",
      type_utilisateur: selectedRole,
    },
    validationSchema: Yup.object({
      nom: Yup.string().required("Le nom est requis"),
      prenom: Yup.string().required("Le prénom est requis"),
      email: Yup.string()
        .email("Email invalide")
        .required("L'email est requis"),
      fonction: Yup.string().required("La fonction est requise"),
      adresse: Yup.string().required("L'adresse est requise"),
      telephone: Yup.string().test(
        "is-valid-phone",
        "Numéro invalide",
        function (value) {
          if (!value) return true;
          const strValue = String(value);
          return strValue.startsWith("+") && strValue.length > 6;
        }
      ),
      pays: Yup.string().required("Le pays est requis"),
    }).test(
      "destination-required",
      "La destination est requise",
      function (value) {
        return (
          destinationType &&
          ((destinationType === "magasin" && value.magasin) ||
            (destinationType === "succursale" && value.succursale))
        );
      }
    ),
    onSubmit: handleSubmitForm,
  });

  // Gestion de la suppression
  const handleDeleteTeamData = () => {
    if (teamUserForAction) {
      setTeamList((prev) => prev.filter((u) => u.id !== teamUserForAction.id));
      toast.success(
        `Utilisateur ${teamUserForAction.nom} supprimé (simulation).`
      );
      setDeleteModal(false);
      setTeamUserForAction(null);
    }
  };

  const getPeriodeStyle = (role) => {
    const base = {
      height: "60px",
      padding: "0.2rem",
      borderRadius: "70px",
      border: "1px solid #e3e5e8",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
      marginBottom: "0.8rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    };

    const isHovered = hoveredPeriode === role.value;
    const isSelected = selectedRole === role.value;

    return {
      ...base,
      backgroundColor: isSelected || isHovered ? "#014a92" : "transparent",
      color: isSelected || isHovered ? "white" : "#000",
    };
  };

  // Vérifie si un module est activé (au moins une permission)
  const isModuleEnabled = (moduleId) => {
    return (
      selectedPermissions[moduleId] &&
      Object.values(selectedPermissions[moduleId]).some(
        (value) => value === true
      )
    );
  };

  // Vérifie si toutes les permissions d'un module sont sélectionnées
  const isModuleAllSelected = (moduleId, actions) => {
    return actions.every(
      (action) =>
        selectedPermissions[moduleId] &&
        selectedPermissions[moduleId][action.id] === true
    );
  };

  // Vérifie si certaines permissions sont sélectionnées (état indéterminé)
  const isModulePartiallySelected = (moduleId, actions) => {
    const hasSomeYes = actions.some(
      (action) =>
        selectedPermissions[moduleId] &&
        selectedPermissions[moduleId][action.id] === true
    );
    const hasSomeNo = actions.some(
      (action) =>
        !selectedPermissions[moduleId] ||
        selectedPermissions[moduleId][action.id] !== true
    );
    return hasSomeYes && hasSomeNo;
  };

  // Remplacer l'ancienne fonction handleSelectAllModule par :
  const handleSelectAllModule = (moduleId, actions) => {
    const allSelected = isModuleAllSelected(moduleId, actions);

    if (allSelected) {
      // Désélectionner toutes les permissions du module
      setSelectedPermissions((prev) => {
        const newPermissions = { ...prev };
        delete newPermissions[moduleId];
        return newPermissions;
      });
    } else {
      // Sélectionner toutes les permissions du module
      setSelectedPermissions((prev) => ({
        ...prev,
        [moduleId]: actions.reduce(
          (acc, action) => ({
            ...acc,
            [action.id]: true,
          }),
          {}
        ),
      }));
    }
  };

  // Fonctions de mise à jour
  const handleSelectStatut = (selectedOption) => {
    setSelectedStatut(selectedOption);
    setFormData({ ...formData, pays: selectedOption.value });
  };
  // Vérifie si l'utilisateur est un observateur
  const isObservateur = selectedRole === "Observateur";

  // Gestion de la sélection du module
  const handleModuleToggle = (moduleId, checked) => {
    if (checked) {
      // Activer le module avec un objet vide pour permettre la sélection des actions
      setSelectedPermissions((prev) => ({
        ...prev,
        [moduleId]: {},
      }));
    } else {
      // Désactiver le module et toutes ses permissions
      setSelectedPermissions((prev) => {
        const newPermissions = { ...prev };
        delete newPermissions[moduleId];
        return newPermissions;
      });
    }
  };

  // Dans handlePermissionChange, ajouter une vérification pour le mode édition
  const handlePermissionChange = (moduleId, actionId, checked) => {
    // Pour observateur: n'autoriser que les permissions "Voir"
    if (
      (isObservateur ||
        selectedUserForEdit?.type_utilisateur === "Observateur") &&
      !(actionId.includes("view") || actionId.includes("Voir")) &&
      checked
    ) {
      toast.error(
        "Les observateurs ne peuvent avoir que des permissions de visualisation"
      );
      return;
    }

    setSelectedPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [actionId]: checked,
      },
    }));
  };

  // Vérifie si un module est sélectionné
  const isModuleSelected = (moduleId) => {
    return selectedPermissions.hasOwnProperty(moduleId);
  };

  // Vérifie si une permission spécifique est sélectionnée
  const isPermissionSelected = (moduleId, actionId) => {
    return (
      selectedPermissions[moduleId] &&
      selectedPermissions[moduleId][actionId] === true
    );
  };

  // Fonction pour désactiver les permissions non autorisées pour observateur
  const isPermissionDisabled = (actionId) => {
    return (
      isObservateur && !(actionId.includes("view") || actionId.includes("Voir"))
    );
  };

  const handlePeriodeClick = (role) => {
    setSelectedRole(role.value);
    formikValidation.setFieldValue("type_utilisateur", role.value); // ← Ajouter cette ligne
  };

  // Ouvrir le modal des permissions en mode modification
  const openEditPermissionsModal = async (user) => {
    if (!canManagePermissions) {
      toast.error(
        "Vous n'avez pas les permissions pour modifier les utilisateurs"
      );
      return;
    }

    setSelectedUserForEdit(user);
    setPermissionsModalMode("edit");

    try {
      // Charger les permissions actuelles de l'utilisateur
      const response = await axiosInstance.get(
        `https://inawoapiv3.inawo.pro/utilisateurs/user-permissions/${user.id}/`
      );

      if (response.data && response.data.permissions) {
        // Convertir les permissions plates en format structuré
        const structuredPermissions = {};

        allPermissionsData.forEach((module) => {
          module.actions.forEach((action) => {
            if (response.data.permissions.includes(action.id)) {
              if (!structuredPermissions[module.id]) {
                structuredPermissions[module.id] = {};
              }
              structuredPermissions[module.id][action.id] = true;
            }
          });
        });

        setSelectedPermissions(structuredPermissions);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des permissions:", error);
      toast.error("Erreur lors du chargement des permissions");
      setSelectedPermissions({});
    }

    setModalStep3(true);
  };

  // Fermer le modal des permissions
  const closeModalStep3 = () => {
    setModalStep3(false);
    setSelectedPermissions({});
    setSelectedUserForEdit(null);
    setPermissionsModalMode("create");
    setSavingPermissions(false);
  };

  // Sauvegarder les permissions (pour les deux modes)
  const handleSavePermissions = async () => {
    // Vérifier les permissions de gestion
    if (permissionsModalMode === "edit" && !canManagePermissions) {
      toast.error(
        "Vous n'avez pas les permissions pour modifier les utilisateurs"
      );
      return;
    }

    if (permissionsModalMode === "edit" && !selectedUserForEdit) return;

    setSavingPermissions(true);

    try {
      // Convertir les permissions structurées en format plat
      const flatPermissions = [];
      Object.keys(selectedPermissions).forEach((moduleId) => {
        Object.keys(selectedPermissions[moduleId]).forEach((actionId) => {
          if (selectedPermissions[moduleId][actionId] === true) {
            flatPermissions.push(actionId);
          }
        });
      });

      if (permissionsModalMode === "create") {
        // Mode création: continuer avec le processus d'ajout d'utilisateur
        proceedToStep3();
        await handleSubmitForm(formikValidation.values);
      } else {
        // Mode édition: envoyer les permissions à l'API
        const response = await axiosInstance.post(
          `https://inawoapiv3.inawo.pro/updatepermission/${selectedUserForEdit.id}/`,
          {
            permissions: flatPermissions,
          }
        );

        if (response.status === 200) {
          toast.success("Permissions mises à jour avec succès");
          closeModalStep3();
          fetchUsers(); // Rafraîchir la liste des utilisateurs
        }
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des permissions:", error);
      const errorMessage =
        error.response?.data?.message ||
        (permissionsModalMode === "create"
          ? "Erreur lors de la création de l'utilisateur"
          : "Erreur lors de la mise à jour des permissions");
      toast.error(errorMessage);
    } finally {
      setSavingPermissions(false);
    }
  };

  // Rendu conditionnel pour afficher soit les utilisateurs, soit le EmptyDataCard
  const renderContent = () => {
    if (pageLoading) {
      return (
        <div className="py-4 text-center">
          <div>
            <lord-icon
              src="https://cdn.lordicon.com/xjovhxra.json"
              trigger="loop"
              colors="primary:#0960b6,secondary:#02376b"
              style={{ width: "72px", height: "72px" }}
            ></lord-icon>
          </div>
          <div className="mt-4">
            <h5>Chargement...</h5>
          </div>
        </div>
      );
    }

    // Afficher un message si l'utilisateur ne peut pas gérer les utilisateurs
    if (!canAddUsers && !isCollaborator && !isObserver) {
      return (
        <EmptyDataCard
          title="Fonctionnalité limitée"
          // description={getUpgradeMessage('add_users')}
          actionButton={
            <Button
              color="warning"
              onClick={() => {
                // Rediriger vers la page d'upgrade
                // window.location.href = '/:entreprise/offres/';
                navigate(`/:entreprise/offres/`);
              }}
              style={{ borderRadius: "20px" }}
            >
              <i className="ri-star-line me-1"></i>
              Voir les offres premium
            </Button>
          }
          icon="ri-user-shared-line"
        />
      );
    }

    if (filteredUsers.length > 0) {
      return (
        <Row className="team-list grid-view-filter">
          {filteredUsers.map((user, key) => (
            <Col key={key}>
              {/* Votre carte d'utilisateur existante avec modifications */}
              <Card
                className="team-box"
                style={{
                  borderRadius: 8,
                  border: user.suspendu ? "2px solid #f06548" : "none",
                  opacity: user.suspendu ? 0.7 : 1,
                }}
              >
                <div className="team-cover">
                  <img
                    src={user.backgroundImg || smallImage9}
                    alt=""
                    className="img-fluid"
                  />
                  {user.suspendu && (
                    <div className="position-absolute top-0 start-0 p-2">
                      <Badge color="danger">Suspendu</Badge>
                    </div>
                  )}
                  <div
                    className="position-absolute"
                    style={{ top: "10px", right: "10px", zIndex: 2 }}
                  >
                    <UncontrolledDropdown>
                      <DropdownToggle
                        tag="button"
                        className="btn btn-icon btn-sm btn-light rounded-circle"
                        role="button"
                        disabled={actionLoading}
                        style={{
                          border: "none",
                          width: "32px",
                          height: "32px",
                        }}
                      >
                        {actionLoading ? (
                          <Spinner size="sm" />
                        ) : (
                          <i className="ri-more-fill fs-16"></i>
                        )}
                      </DropdownToggle>
                      <DropdownMenu end>
                        <DropdownItem
                          onClick={() =>
                            navigate(`/detail-collaborateur/${user.id}`)
                          }
                        >
                          <i className="ri-eye-line me-2 align-middle text-muted"></i>
                          Voir
                        </DropdownItem>

                        {/* Masquer "Modifier" si pas de permissions de gestion */}
                        <ShowIf condition={canManagePermissions}>
                          <DropdownItem
                            onClick={() => openEditPermissionsModal(user)}
                          >
                            <i className="ri-pencil-line me-2 align-middle text-muted"></i>
                            Modifier
                          </DropdownItem>
                        </ShowIf>

                        <DropdownItem
                          onClick={() =>
                            handleSuspendUser(user.id, user.suspendu)
                          }
                          className={
                            user.suspendu ? "text-success" : "text-warning"
                          }
                          disabled={actionLoading}
                        >
                          {actionLoading ? (
                            <Spinner size="sm" className="me-2" />
                          ) : (
                            <i
                              className={`ri-user-${
                                user.suspendu ? "follow" : "unfollow"
                              }-line me-2 align-middle`}
                            ></i>
                          )}
                          {user.suspendu ? "Réactiver" : "Suspendre"}
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </div>
                <CardBody className="p-4">
                  <Row className="align-items-center team-row">
                    <Col lg={4} className="col">
                      <div className="team-profile-img">
                        <div className="">
                          {user.photo ? (
                            <img
                              src={`https://inawoapiv3.inawo.pro/utilisateurs/getuser/${user.id}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = dummyUser;
                              }}
                              alt=""
                              className="avatar-lg img-thumbnail rounded-circle mx-auto"
                            />
                          ) : (
                            <img
                              src={dummyUser}
                              alt=""
                              className="avatar-lg img-thumbnail rounded-circle mx-auto"
                            />
                          )}
                        </div>
                        <div className="team-content">
                          <h5 className="fs-16 mb-1">
                            {user.nom} {user.prenom}
                            {user.suspendu && (
                              <Badge color="danger" className="ms-2">
                                Suspendu
                              </Badge>
                            )}
                          </h5>
                          <h6 className="text-muted mb-0">
                            {user.type_utilisateur || "Néant"}
                          </h6>
                          {/* Afficher le statut d'abonnement si applicable */}
                          {user.abonnement && (
                            <Badge color="info" className="mt-1">
                              {user.abonnement.categorie_nom}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      );
    }

    // Afficher EmptyDataCard quand il n'y a pas d'utilisateurs
    return (
      <EmptyDataCard
        title="Aucun utilisateur trouvé"
        description={
          canAddUsers
            ? "Commencer par ajouter un utilisateur"
            : "Vous n'avez pas d'utilisateurs dans votre équipe"
        }
        actionButton={
          canAddUsers ? (
            <AddUserButton
              onAddUser={openModalStep1}
              subscriptionModule={subscriptionModule}
              subscriptionCategory={subscriptionCategory}
            />
          ) : null
        }
      />
    );
  };

  document.title = "Utilisateurs | INAWO - Suite de Gestion";

  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />
      {/* <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTeamData}
        onCloseClick={() => setDeleteModal(false)}
      /> */}

      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="&nbsp;Utilisateurs"
            pageTitle={
              <>
                <i className="ri-group-line"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
              </>
            }
          />
          <Card style={{ borderRadius: "70px" }}>
            <CardBody>
              <Row className="g-2 align-items-center">
                <Col sm={4}>
                  <div className="search-box">
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Rechercher par nom, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ borderRadius: "20px" }}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </Col>
                <Col className="col-sm-auto ms-auto">
                  <div className="list-grid-nav hstack gap-1">
                    <ShowIf condition={!isCollaborator && !isObserver}>
                      <AddUserButton
                        onAddUser={openModalStep1}
                        subscriptionModule={subscriptionModule}
                        subscriptionCategory={subscriptionCategory}
                      />
                    </ShowIf>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Row>
            <Col lg={12}>
              <div>{renderContent()}</div>
            </Col>
          </Row>

          {/* Modal Étape 1: Sélection du rôle */}
          <Modal
            isOpen={modalStep1}
            toggle={closeModalStep1}
            centered
            modalClassName="border-0"
            contentClassName="rounded-4"
          >
            <ModalHeader
              toggle={closeModalStep1}
              className="bg-info-subtle p-3 rounded-top-4"
            >
              <i className="ri-settings-3-line me-2"></i>
              Définir le rôle
            </ModalHeader>
            <ModalBody>
              <div className="d-flex flex-column">
                {RôlesData.map((role) => (
                  <div
                    key={role.value}
                    style={getPeriodeStyle(role)}
                    onClick={() => handlePeriodeClick(role)}
                    onMouseEnter={() => setHoveredPeriode(role.value)}
                    onMouseLeave={() => setHoveredPeriode(null)}
                  >
                    <div style={{ fontSize: "1.0rem", marginBottom: "-1px" }}>
                      <span>{role.label}</span>
                    </div>
                    <div style={{ fontSize: "0.7rem", marginTop: "-1px" }}>
                      <span>{role.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary rounded-pill" onClick={closeModalStep1}>
                Annuler
              </Button>
              <Button
                color="primary rounded-pill"
                onClick={proceedToStep2}
                disabled={!selectedRole}
              >
                Suivant
              </Button>
            </ModalFooter>
          </Modal>

          {/* Modal Étape 2: Informations personnelles */}
          <Modal
            isOpen={modalStep2}
            toggle={closeModalStep2}
            size="lg-6"
            centered
            className="rounded-4"
            contentClassName="custom-rounded-modal"
          >
            <ModalHeader
              className="bg-info-subtle p-3 rounded-top-4"
              toggle={closeModalStep2}
            >
              <i className=" ri-user-3-line  me-2"></i>
              Informations personnelles
            </ModalHeader>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                proceedToStep3();
              }}
            >
              <ModalBody>
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="nomInputForm">
                        Nom*
                      </Label>
                      <Input
                        type="text"
                        name="nom"
                        id="nomInputForm"
                        className="form-control rounded-pill"
                        placeholder="Saisissez le nom"
                        value={formikValidation.values.nom}
                        onChange={formikValidation.handleChange}
                        onBlur={formikValidation.handleBlur}
                        invalid={
                          !!(
                            formikValidation.touched.nom &&
                            formikValidation.errors.nom
                          )
                        }
                      />
                      {formikValidation.touched.nom &&
                        formikValidation.errors.nom && (
                          <FormFeedback>
                            {formikValidation.errors.nom}
                          </FormFeedback>
                        )}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="prenomInputForm">
                        Prénom(s)*
                      </Label>
                      <Input
                        type="text"
                        name="prenom"
                        id="prenomInputForm"
                        className="form-control rounded-pill"
                        placeholder="Saisissez prénom(s)"
                        value={formikValidation.values.prenom}
                        onChange={formikValidation.handleChange}
                        onBlur={formikValidation.handleBlur}
                        invalid={
                          !!(
                            formikValidation.touched.prenom &&
                            formikValidation.errors.prenom
                          )
                        }
                      />
                      {formikValidation.touched.prenom &&
                        formikValidation.errors.prenom && (
                          <FormFeedback>
                            {formikValidation.errors.prenom}
                          </FormFeedback>
                        )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="emailInputForm">
                        Email*
                      </Label>
                      <Input
                        type="email"
                        name="email"
                        id="emailInputForm"
                        className="form-control rounded-pill"
                        placeholder="Saisissez adresse email"
                        value={formikValidation.values.email}
                        onChange={formikValidation.handleChange}
                        onBlur={formikValidation.handleBlur}
                        invalid={
                          !!(
                            formikValidation.touched.email &&
                            formikValidation.errors.email
                          )
                        }
                      />
                      {formikValidation.touched.email &&
                        formikValidation.errors.email && (
                          <FormFeedback>
                            {formikValidation.errors.email}
                          </FormFeedback>
                        )}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="fonctionInputForm">
                        Fonction*
                      </Label>
                      <Input
                        type="text"
                        name="fonction"
                        id="fonctionInputForm"
                        className="form-control rounded-pill"
                        placeholder="Saisissez fonction"
                        value={formikValidation.values.fonction}
                        onChange={formikValidation.handleChange}
                        onBlur={formikValidation.handleBlur}
                        invalid={
                          !!(
                            formikValidation.touched.fonction &&
                            formikValidation.errors.fonction
                          )
                        }
                      />
                      {formikValidation.touched.fonction &&
                        formikValidation.errors.fonction && (
                          <FormFeedback>
                            {formikValidation.errors.fonction}
                          </FormFeedback>
                        )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="adresseInputForm">
                        Adresse*
                      </Label>
                      <Input
                        type="text"
                        name="adresse"
                        id="adresseInputForm"
                        className="form-control rounded-pill"
                        placeholder="Saisissez adresse"
                        value={formikValidation.values.adresse}
                        onChange={formikValidation.handleChange}
                        onBlur={formikValidation.handleBlur}
                        invalid={
                          !!(
                            formikValidation.touched.adresse &&
                            formikValidation.errors.adresse
                          )
                        }
                      />
                      {formikValidation.touched.adresse &&
                        formikValidation.errors.adresse && (
                          <FormFeedback>
                            {formikValidation.errors.adresse}
                          </FormFeedback>
                        )}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label className="form-label">Téléphone</Label>
                      <PhoneInput
                        name="telephone"
                        value={formikValidation.values.telephone || ""}
                        onChange={(value) => {
                          const phoneValue = value ? String(value) : "";
                          formikValidation.setFieldValue(
                            "telephone",
                            phoneValue
                          );
                        }}
                        countries={country}
                        defaultCountry="FR"
                        onBlur={() =>
                          formikValidation.setFieldTouched("telephone", true)
                        }
                      />
                      {formikValidation.touched.telephone &&
                        formikValidation.errors.telephone && (
                          <div className="text-danger">
                            {formikValidation.errors.telephone}
                          </div>
                        )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="paysInputForm">
                        Pays*
                      </Label>
                      <CustomSelect
                        value={selectedPays}
                        onChange={handleSelectPays}
                        options={paysOptions}
                        formatOptionLabel={(option) => (
                          <div className="d-flex align-items-center">
                            <img
                              src={option.flagImg}
                              alt={option.label}
                              className="me-2"
                              style={{ width: "20px", height: "15px" }}
                            />
                            {option.label}
                          </div>
                        )}
                        className="rounded-pill"
                      />
                      {formikValidation.touched.pays &&
                        formikValidation.errors.pays && (
                          <div className="text-danger small mt-1">
                            {formikValidation.errors.pays}
                          </div>
                        )}
                    </div>
                  </Col>
                  {/* CONDITION : Afficher Magasin/Succursale seulement si le rôle n'est PAS administrateur */}
                  {selectedRole !== "administrateur" && (
                    <Col lg={12}>
                      <div className="mb-3">
                        <Label className="form-label">Magasin/Succursale</Label>
                        <div className="d-flex gap-4 mb-3">
                          <FormGroup check>
                            <Input
                              type="radio"
                              name="destinationType"
                              id="radioMagasin"
                              value="magasin"
                              checked={destinationType === "magasin"}
                              onChange={(e) =>
                                setDestinationType(e.target.value)
                              }
                            />
                            <Label check for="radioMagasin" className="ms-2">
                              Magasin
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Input
                              type="radio"
                              name="destinationType"
                              id="radioSuccursale"
                              value="succursale"
                              checked={destinationType === "succursale"}
                              onChange={(e) =>
                                setDestinationType(e.target.value)
                              }
                            />
                            <Label check for="radioSuccursale" className="ms-2">
                              Succursale
                            </Label>
                          </FormGroup>
                        </div>

                        {/* CustomSelect pour Magasin/Succursale */}
                        {destinationType && (
                          <CustomSelect
                            value={
                              destinationType === "magasin"
                                ? selectedMagasin
                                : selectedSuccursale
                            }
                            onChange={(selectedOption) => {
                              if (destinationType === "magasin") {
                                setSelectedMagasin(selectedOption);
                                formikValidation.setFieldValue(
                                  "magasin",
                                  selectedOption.value
                                );
                              } else {
                                setSelectedSuccursale(selectedOption);
                                formikValidation.setFieldValue(
                                  "succursale",
                                  selectedOption.value
                                );
                              }
                            }}
                            options={
                              destinationType === "magasin"
                                ? (userData?.magasins || []).map((m) => ({
                                    value: m.id,
                                    label: m.nom,
                                  }))
                                : (userData?.groupes || []).map((g) => ({
                                    value: g.id,
                                    label: g.nom,
                                  }))
                            }
                            placeholder={
                              destinationType === "magasin"
                                ? "Sélectionner un magasin"
                                : "Sélectionner une succursale"
                            }
                            className="rounded-pill"
                          />
                        )}
                      </div>
                    </Col>
                  )}
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary rounded-pill" onClick={backToStep1}>
                  Retour
                </Button>
                <Button color="primary rounded-pill" type="submit">
                  Suivant
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
          {/* Modal Étape 3: Permissions (réutilisé pour création et modification) */}
          <Modal
            isOpen={modalStep3}
            toggle={closeModalStep3}
            size=""
            style={{ maxWidth: "38%", margin: "0 auto" }}
            contentClassName="custom-rounded-modal"
          >
            <ModalHeader
              toggle={closeModalStep3}
              className="bg-info-subtle p-3 rounded-top-4"
            >
              <i className="ri-sound-module-line me-2"></i>
              {permissionsModalMode === "create"
                ? "Attribuer des permissions"
                : "Modifier les permissions"}
              {/* {isObservateur && (
                <span className="badge bg-warning ms-2">Mode Observateur</span>
              )} */}
            </ModalHeader>

            <ModalBody className="p-0">
              <SimpleBar>
                <table className="table table-borderless mb-0">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th style={{ width: "15%" }}>Module</th>
                      <th style={{ width: "8%" }}>Ajouter</th>
                      <th style={{ width: "8%" }}>Modifier</th>
                      <th style={{ width: "8%" }}>Supprimer</th>
                      <th style={{ width: "6%" }}>Voir</th>
                      <th style={{ width: "6%" }}>Tout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPermissionsData.map((permission) => (
                      <tr key={permission.id} style={{ height: "45px" }}>
                        <td
                          style={{
                            padding: "8px 12px",
                            verticalAlign: "middle",
                          }}
                        >
                          <FormGroup check className="mb-0">
                            <Label check className="mb-0">
                              <Input
                                type="checkbox"
                                className="rounded-circle"
                                checked={isModuleSelected(permission.id)}
                                onChange={(e) =>
                                  handleSelectAllModule(
                                    permission.id,
                                    permission.actions
                                  )
                                }
                                style={{
                                  borderRadius: "50%",
                                  width: "15px",
                                  height: "15px",
                                }}
                              />{" "}
                              {permission.label}
                            </Label>
                          </FormGroup>
                        </td>
                        {permission.actions.map((action) => (
                          <td
                            key={action.id}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              padding: "8px 8px",
                            }}
                          >
                            <FormGroup
                              switch
                              className="d-flex justify-content-center"
                            >
                              <Input
                                type="switch"
                                checked={isPermissionSelected(
                                  permission.id,
                                  action.id
                                )}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    permission.id,
                                    action.id,
                                    e.target.checked
                                  )
                                }
                                disabled={
                                  !isModuleSelected(permission.id) ||
                                  (isObservateur &&
                                    isPermissionDisabled(action.id))
                                }
                              />
                            </FormGroup>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </SimpleBar>
            </ModalBody>

            <ModalFooter>
              {permissionsModalMode === "create" ? (
                <>
                  <Button color="secondary rounded-pill" onClick={backToStep2}>
                    Retour
                  </Button>
                  <Button
                    color="primary rounded-pill"
                    onClick={handleSavePermissions}
                    disabled={savingPermissions}
                  >
                    {savingPermissions ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        En cours...
                      </>
                    ) : (
                      "Terminer"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="secondary rounded-pill"
                    onClick={closeModalStep3}
                  >
                    Annuler
                  </Button>
                  <Button
                    color="primary rounded-pill"
                    onClick={handleSavePermissions}
                    disabled={savingPermissions}
                  >
                    {savingPermissions ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Enregistrement...
                      </>
                    ) : (
                      "Enregistrer les permissions"
                    )}
                  </Button>
                </>
              )}
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Team;