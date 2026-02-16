import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Row,
  FormGroup,
  Badge,
  Alert,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "../../../Components/ContactDeleteModal/CountryPhoneInput";
import smallImage9 from "../../../assets/images/small/img-9.jpg";
import dummyUser from "../../../assets/images/users/user-dummy-img.jpg";
import * as Yup from "yup";
import { useFormik } from "formik";
import SimpleBar from "simplebar-react";
import { country } from "../../../common/data";
import { CustomSelect } from "../../../Components/Common/CustomSelectStyles";
import EmptyDataCard from "../../../Components/Common/EmptyDataCard";
import { ShowIf } from "../../../Components/Permissions/WithPermission";
import { usePermissionCheck } from "../../../Components/Hooks/usePermissionCheck";
import { useSubscriptionGuard } from "../../../Components/Hooks/useSubscriptionGuard";
import { BaseUrl } from "../../APIKey/ApiKey";
import { useProfile } from "../../../Components/Hooks/UserHooks";
// Composants optimisés
import { useOptimizedApi, useDebouncedValue } from "../../../Components/Hooks/useOptimizedApi";
import UserCard from "../../../Components/Common/UserCard";
import OptimizedSearchBar from "../../../Components/Common/OptimizedSearchBar";
import { UserGridSkeleton } from "../../../Components/Common/SkeletonLoader";

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
      "Ajouter un membre de votre équipe et assignez lui des permissions",
  },
  {
    value: "Observateur",
    label: "Observateur",
    description: "Il dispose d'un regard sur les modules que vous lui assignez",
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
      { id: "all_contact", label: "Tout" },
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
      { id: "all_produit", label: "Tout Voir" },
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
      { id: "all_agenda", label: "Tout Voir" },
    ],
  },
  {
    id: "facturation_simple",
    label: "Facture Simple",
    description: "Votre collaborateur pourra gérer les factures simples",
    actions: [
      { id: "add_facture", label: "Ajouter" },
      { id: "change_facture", label: "Modifier" },
      { id: "delete_facture", label: "Supprimer" },
      { id: "view_facture", label: "Voir" },
      { id: "all_facture", label: "Tout Voir" },
    ],
  },
  {
    id: "vente",
    label: "Vente",
    description: "Votre collaborateur pourra gérer les ventes",
    actions: [
      { id: "add_vente", label: "Ajouter" },
      { id: "change_vente", label: "Modifier" },
      { id: "delete_vente", label: "Supprimer" },
      { id: "view_vente", label: "Voir" },
      { id: "all_vente", label: "Tout Voir" },
    ],
  },
  {
    id: "opportunite",
    label: "Opportunité",
    description: "Votre collaborateur pourra gérer les opportunités commerciales",
    actions: [
      { id: "add_opportunite", label: "Ajouter" },
      { id: "change_opportunite", label: "Modifier" },
      { id: "delete_opportunite", label: "Supprimer" },
      { id: "view_opportunite", label: "Voir" },
      { id: "all_opportunite", label: "Tout Voir" },
    ],
  },
  {
    id: "tache",
    label: "Tâches",
    description: "Votre collaborateur pourra gérer les tâches",
    actions: [
      { id: "add_tache", label: "Ajouter" },
      { id: "change_tache", label: "Modifier" },
      { id: "delete_tache", label: "Supprimer" },
      { id: "view_tache", label: "Voir" },
      { id: "all_tache", label: "Tout Voir" },
    ],
  },
  {
    id: "bon_reception",
    label: "Bon de Réception",
    description: "Votre collaborateur pourra gérer les bons de réception",
    actions: [
      { id: "add_bon_reception", label: "Ajouter" },
      { id: "change_bon_reception", label: "Modifier" },
      { id: "delete_bon_reception", label: "Supprimer" },
      { id: "view_bon_reception", label: "Voir" },
      { id: "all_bon_reception", label: "Tout Voir" },
    ],
  },
  {
    id: "facture_normalise",
    label: "Facture Normalisée",
    description: "Votre collaborateur pourra gérer les factures normalisées",
    actions: [
      { id: "add_facture_normalise", label: "Ajouter" },
      { id: "change_facture_normalise", label: "Modifier" },
      { id: "delete_facture_normalise", label: "Supprimer" },
      { id: "view_facture_normalise", label: "Voir" },
      { id: "all_facture_normalise", label: "Tout Voir" },
    ],
  },
  {
    id: "stock",
    label: "Stock",
    description: "Votre collaborateur pourra gérer le stock",
    actions: [
      { id: "add_stock", label: "Ajouter" },
      { id: "change_stock", label: "Modifier" },
      { id: "delete_stock", label: "Supprimer" },
      { id: "view_stock", label: "Voir" },
      { id: "all_stock", label: "Tout Voir" },
    ],
  },
  {
    id: "stock_integral",
    label: "Stock Intégral",
    description: "Votre collaborateur pourra gérer le stock intégral",
    actions: [
      { id: "add_stock_integral", label: "Ajouter" },
      { id: "change_stock_integral", label: "Modifier" },
      { id: "delete_stock_integral", label: "Supprimer" },
      { id: "view_stock_integral", label: "Voir" },
      { id: "all_stock_integral", label: "Tout Voir" },
    ],
  },
  {
    id: "bon_livraison",
    label: "Bon de Livraison",
    description: "Votre collaborateur pourra gérer les bons de livraison",
    actions: [
      { id: "add_bon_livraison", label: "Ajouter" },
      { id: "change_bon_livraison", label: "Modifier" },
      { id: "delete_bon_livraison", label: "Supprimer" },
      { id: "view_bon_livraison", label: "Voir" },
      { id: "all_bon_livraison", label: "Tout Voir" },
    ],
  },
  {
    id: "bon_avoir",
    label: "Bon d'Avoir",
    description: "Votre collaborateur pourra gérer les bons d'avoir",
    actions: [
      { id: "add_bon_avoir", label: "Ajouter" },
      { id: "change_bon_avoir", label: "Modifier" },
      { id: "delete_bon_avoir", label: "Supprimer" },
      { id: "view_bon_avoir", label: "Voir" },
      { id: "all_bon_avoir", label: "Tout Voir" },
    ],
  },
  {
    id: "bon_sortie",
    label: "Bon de Sortie",
    description: "Votre collaborateur pourra gérer les bons de sortie",
    actions: [
      { id: "add_bon_sortie", label: "Ajouter" },
      { id: "change_bon_sortie", label: "Modifier" },
      { id: "delete_bon_sortie", label: "Supprimer" },
      { id: "view_bon_sortie", label: "Voir" },
      { id: "all_bon_sortie", label: "Tout Voir" },
    ],
  },
  {
    id: "approvisionnement",
    label: "Approvisionnement",
    description: "Votre collaborateur pourra gérer les approvisionnements",
    actions: [
      { id: "add_approvisionnement", label: "Ajouter" },
      { id: "change_approvisionnement", label: "Modifier" },
      { id: "delete_approvisionnement", label: "Supprimer" },
      { id: "view_approvisionnement", label: "Voir" },
      { id: "all_approvisionnement", label: "Tout Voir" },
    ],
  },
  {
    id: "bon_transfert",
    label: "Bon de Transfert",
    description: "Votre collaborateur pourra gérer les bons de transfert",
    actions: [
      { id: "add_bon_transfert", label: "Ajouter" },
      { id: "change_bon_transfert", label: "Modifier" },
      { id: "delete_bon_transfert", label: "Supprimer" },
      { id: "view_bon_transfert", label: "Voir" },
      { id: "all_bon_transfert", label: "Tout Voir" },
    ],
  },
  {
    id: "bon_commande",
    label: "Bon de Commande",
    description: "Votre collaborateur pourra gérer les bons de commande",
    actions: [
      { id: "add_bon_commande", label: "Ajouter" },
      { id: "change_bon_commande", label: "Modifier" },
      { id: "delete_bon_commande", label: "Supprimer" },
      { id: "view_bon_commande", label: "Voir" },
      { id: "all_bon_commande", label: "Tout Voir" },
    ],
  },
  {
    id: "depense",
    label: "Dépenses",
    description: "Votre collaborateur pourra gérer les dépenses",
    actions: [
      { id: "add_depense", label: "Ajouter" },
      { id: "change_depense", label: "Modifier" },
      { id: "delete_depense", label: "Supprimer" },
      { id: "view_depense", label: "Voir" },
      { id: "all_depense", label: "Tout Voir" },
    ],
  },
];

const Team = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { userProfile, token } = useProfile();
  
  const {
    isAdmin,
    isCollaborator,
    isObserver,
    subscriptionModule,
    subscriptionCategory,
    maxUsers,
    getRemainingUserSlots,
    hasReachedLimit,
    canAddUsers,
    canManagePermissions
  } = usePermissionCheck();

  // 🔐 PROTECTION ABONNEMENT
  const { guardAction, isExpired } = useSubscriptionGuard();

  // Hook API optimisé avec cache
  const { get, post, patch, loading: apiLoading, axiosInstance } = useOptimizedApi({
    cacheTTL: 3 * 60 * 1000, // 3 minutes de cache
    enableCache: true,
  });

  // États pour les données
  const [magasins, setMagasins] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [loadingMagasins, setLoadingMagasins] = useState(false);
  const [loadingGroupes, setLoadingGroupes] = useState(false);

  // États pour les modals
  const [modalStep1, setModalStep1] = useState(false);
  const [modalStep2, setModalStep2] = useState(false);
  const [modalStep3, setModalStep3] = useState(false);
  const [confirmAdminModal, setConfirmAdminModal] = useState(false);
  
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [permissionsModalMode, setPermissionsModalMode] = useState("create");
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [savingPermissions, setSavingPermissions] = useState(false);

  const [teamList, setTeamList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [authUserId, setAuthUserId] = useState(null);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [hoveredPeriode, setHoveredPeriode] = useState(null);
  const [destinationType, setDestinationType] = useState("");
  const [selectedPays, setSelectedPays] = useState(null);
  const navigate = useNavigate();

  // États pour les sélections
  const [selectedMagasin, setSelectedMagasin] = useState(null);
  const [selectedSuccursale, setSelectedSuccursale] = useState(null);

  // Calcul des limites
  const currentUserCount = teamList.length;
  const remainingUserSlots = getRemainingUserSlots(teamList);
  const hasReachedLimitValue = hasReachedLimit(teamList);
  const canAddMoreUsers = canAddUsers(teamList);

  const [finalConfirmAdminModal, setFinalConfirmAdminModal] = useState(false);
  const [formDataToConfirm, setFormDataToConfirm] = useState(null);

  // Options des pays
  const paysOptions = useMemo(() => {
    return country.map((c) => ({
      value: c.countryName,
      label: c.countryName,
      countryCode: c.countryCode,
      flagImg: c.flagImg,
    }));
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        if (!userProfile) return;

        const userId = userProfile?.id;
        if (!userId) return;

        setAuthUserId(userId);
      } catch (error) {
        console.error("Erreur d'initialisation:", error);
      }
    };
    init();
  }, [userProfile]);

  // Chargement des données avec cache
  useEffect(() => {
    if (authUserId) {
      fetchMagasins();
      fetchGroupes();
      fetchUsers();
    }
  }, [authUserId]);

  // Fetch optimisé avec cache pour les magasins
  const fetchMagasins = useCallback(async () => {
    try {
      setLoadingMagasins(true);
      const data = await get("/stocks/magasins/", { 
        useCache: true, 
        ttl: 5 * 60 * 1000 // 5 minutes de cache
      });
      if (data && Array.isArray(data)) {
        setMagasins(data);
      }
    } catch (error) {
      console.error("Erreur chargement magasins:", error);
    } finally {
      setLoadingMagasins(false);
    }
  }, [get]);

  // Fetch optimisé avec cache pour les groupes
  const fetchGroupes = useCallback(async () => {
    try {
      setLoadingGroupes(true);
      const data = await get("/utilisateurs/groupes/", { 
        useCache: true, 
        ttl: 5 * 60 * 1000 
      });
      if (data && Array.isArray(data)) {
        setGroupes(data);
      }
    } catch (error) {
      console.error("Erreur chargement groupes:", error);
    } finally {
      setLoadingGroupes(false);
    }
  }, [get]);

  // Fetch optimisé pour les utilisateurs avec cache court
  const fetchUsers = useCallback(async (forceRefresh = false) => {
    if (!authUserId) return;

    setPageLoading(true);
    try {
      const data = await get(
        `/utilisateurs/colaborateuruser/${authUserId}/`,
        { 
          useCache: !forceRefresh, 
          forceRefresh,
          ttl: 2 * 60 * 1000 // 2 minutes de cache pour les utilisateurs
        }
      );

      let users = [];

      if (data && data.collaborateurs) {
        users = data.collaborateurs;
      } else if (Array.isArray(data)) {
        users = data;
      }

      if (Array.isArray(users)) {
        setTeamList(users);
      } else {
        setTeamList([]);
      }
    } catch (err) {
      console.error("Erreur fetchUsers:", err);
      setTeamList([]);
    } finally {
      setPageLoading(false);
    }
  }, [authUserId, get]);

  // Gestion des modals
  const openModalStep1 = () => {
    // 🔐 VÉRIFICATION ABONNEMENT DÈS LE CLIC
    if (!guardAction('add')) {
      return; // Le modal d'abonnement expiré sera affiché automatiquement
    }
    
    if (hasReachedLimitValue) {
      toast.error(`Vous avez atteint la limite de ${maxUsers} utilisateur(s) avec votre abonnement ${subscriptionModule} ${subscriptionCategory}.`);
      return;
    }
    
    setModalStep1(true);
    setSelectedRole("");
    setSelectedPermissions({});
  };

  const closeModalStep1 = () => {
    setModalStep1(false);
  };

   // AJOUTER ces fonctions pour gérer la confirmation finale
  const confirmFinalAdminCreation = () => {
    if (formDataToConfirm) {
      handleSubmitForm(formDataToConfirm, true); // true = bypass confirmation
    }
  };

  const cancelFinalAdminCreation = () => {
    setFinalConfirmAdminModal(false);
    setFormDataToConfirm(null);
  };

   const proceedToStep2 = () => {
    if (!selectedRole) {
      toast.error("Veuillez sélectionner un rôle");
      return;
    }

    // Plus de confirmation intermédiaire, aller directement au formulaire
    setModalStep1(false);
    setModalStep2(true);
    
    // Charger les données si nécessaire
    if (selectedRole !== "Administrateur") {
      fetchMagasins();
      fetchGroupes();
    }
  };

  const closeModalStep2 = () => {
    setModalStep2(false);
    formikValidation.resetForm();
    setDestinationType("");
    setSelectedMagasin(null);
    setSelectedSuccursale(null);
    setSelectedPays(null);
  };

  const proceedToStep3 = () => {
    formikValidation.validateForm().then((errors) => {
      if (selectedRole === "Administrateur") {
        delete errors.magasin;
        delete errors.succursale;
      }

      if (Object.keys(errors).length === 0) {
        if (selectedRole !== "Administrateur" && !destinationType) {
          toast.error("Veuillez sélectionner un type de destination");
          return;
        }

        setModalStep2(false);
        
        // Pour les administrateurs, créer directement
        if (selectedRole === "Administrateur") {
          handleSubmitForm(formikValidation.values);
        } else {
          // Pour collaborateur/observateur, ouvrir le modal de permissions
          setModalStep3(true);
        }
      } else {
        formikValidation.setTouched(
          Object.keys(errors).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {},
          ),
        );
        const firstError = Object.values(errors)[0];
        toast.error(firstError);
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

  const closeModalStep3 = () => {
    setModalStep3(false);
    setSelectedPermissions({});
  };

  // Configuration Formik
  const validationSchema = useMemo(() => {
    const baseSchema = {
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
        },
      ),
      pays: Yup.string().required("Le pays est requis"),
    };

    if (selectedRole !== "Administrateur") {
      return Yup.object().shape({
        ...baseSchema,
        magasin: Yup.string(),
        succursale: Yup.string(),
      });
    }

    return Yup.object().shape(baseSchema);
  }, [selectedRole]);

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
    },
     validationSchema: validationSchema,
    onSubmit: (values) => {
      // Pour les administrateurs, créer directement (la confirmation sera gérée dans handleSubmitForm)
      if (selectedRole === "Administrateur") {
        handleSubmitForm(values, false); // false = afficher confirmation
      } else {
        // Pour les autres, valider et passer au modal de permissions
        proceedToStep3();
      }
    },
  });

  // Gestion des sélections
  const handleSelectPays = (selectedOption) => {
    setSelectedPays(selectedOption);
    formikValidation.setFieldValue(
      "pays",
      selectedOption ? selectedOption.value : "",
    );
  };

  const handleSelectMagasin = (selectedOption) => {
    setSelectedMagasin(selectedOption);
    if (selectedOption) {
      formikValidation.setFieldValue("magasin", selectedOption.value);
      formikValidation.setFieldValue("succursale", "");
      setSelectedSuccursale(null);
    } else {
      formikValidation.setFieldValue("magasin", "");
    }
  };

  const handleSelectSuccursale = (selectedOption) => {
    setSelectedSuccursale(selectedOption);
    if (selectedOption) {
      formikValidation.setFieldValue("succursale", selectedOption.value);
      formikValidation.setFieldValue("magasin", "");
      setSelectedMagasin(null);
    } else {
      formikValidation.setFieldValue("succursale", "");
    }
  };

  useEffect(() => {
    if (destinationType === "magasin") {
      formikValidation.setFieldValue("succursale", "");
      setSelectedSuccursale(null);
    } else if (destinationType === "succursale") {
      formikValidation.setFieldValue("magasin", "");
      setSelectedMagasin(null);
    }
  }, [destinationType]);

  // Styles pour les rôles
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

  const handlePeriodeClick = (role) => {
    setSelectedRole(role.value);
  };

  // Gestion des permissions
  const isObservateur = selectedRole === "Observateur";

  const isModuleSelected = (moduleId) => {
    return selectedPermissions.hasOwnProperty(moduleId);
  };

  const isPermissionSelected = (moduleId, actionId) => {
    return (
      selectedPermissions[moduleId] &&
      selectedPermissions[moduleId][actionId] === true
    );
  };

  const isModuleAllSelected = (moduleId, actions) => {
    return actions.every(
      (action) =>
        selectedPermissions[moduleId] &&
        selectedPermissions[moduleId][action.id] === true,
    );
  };

  const handleSelectAllModule = (moduleId, actions) => {
    const allSelected = isModuleAllSelected(moduleId, actions);

    if (allSelected) {
      setSelectedPermissions((prev) => {
        const newPermissions = { ...prev };
        delete newPermissions[moduleId];
        return newPermissions;
      });
    } else {
      setSelectedPermissions((prev) => ({
        ...prev,
        [moduleId]: actions.reduce(
          (acc, action) => ({
            ...acc,
            [action.id]: true,
          }),
          {},
        ),
      }));
    }
  };

  const handlePermissionChange = (moduleId, actionId, checked) => {
    if (
      isObservateur &&
      !actionId.includes("view") &&
      !actionId.includes("Voir") &&
      checked
    ) {
      toast.error(
        "Les observateurs ne peuvent avoir que des permissions de visualisation",
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

  const isPermissionDisabled = (actionId) => {
    return (
      isObservateur && !(actionId.includes("view") || actionId.includes("Voir"))
    );
  };

  // Soumission du formulaire avec permissions
  const handleSubmitForm = async (values, bypassConfirmation = false) => {
    // Vérification finale de la limite (sécurité supplémentaire)
    if (hasReachedLimitValue) {
      toast.error(`Impossible d'ajouter un utilisateur. Limite de ${maxUsers} atteinte.`);
      return;
    }

    // Si c'est un administrateur et pas de bypass, montrer la confirmation
    if (selectedRole === "Administrateur" && !bypassConfirmation) {
      // Sauvegarder les données et montrer la confirmation
      setFormDataToConfirm(values);
      setFinalConfirmAdminModal(true);
      return;
    }

    setFormSubmitLoading(true);

    try {
      // Préparer les permissions selon le rôle
      let flatPermissions = [];
      
      if (selectedRole === "Administrateur") {
        // Pour les administrateurs, toutes les permissions
        allPermissionsData.forEach((module) => {
          module.actions.forEach((action) => {
            flatPermissions.push(action.id);
          });
        });
      } else {
        // Pour collaborateur/observateur, les permissions sélectionnées
        Object.keys(selectedPermissions).forEach((moduleId) => {
          Object.keys(selectedPermissions[moduleId]).forEach((actionId) => {
            if (selectedPermissions[moduleId][actionId] === true) {
              flatPermissions.push(actionId);
            }
          });
        });

        // Vérifier les permissions pour les observateurs
        if (selectedRole === "Observateur") {
          const hasNonViewPermissions = flatPermissions.some(
            (permId) => !permId.includes("view") && !permId.includes("Voir"),
          );
          if (hasNonViewPermissions) {
            toast.error(
              "Les observateurs ne peuvent avoir que des permissions de visualisation",
            );
            setFormSubmitLoading(false);
            return;
          }
        }

        // Vérifier qu'au moins une permission est sélectionnée pour non-admin
        if (flatPermissions.length === 0) {
          toast.error("Veuillez sélectionner au moins une permission.");
          setFormSubmitLoading(false);
          return;
        }
      }

      // Préparer les données d'inscription
      const userData = {
        nom: values.nom?.trim() || "",
        prenom: values.prenom?.trim() || "",
        email: values.email?.trim() || "",
        fonction: values.fonction?.trim() || "",
        pays: values.pays || "",
        password: "Inawo@1234",
        type_utilisateur: selectedRole || "",
        langue: "Fr",
        telephone: values.telephone || "",
        adresse: values.adresse || "",
        permissions: JSON.stringify(flatPermissions),
      };

      // Pour les non-administrateurs, ajouter magasin/succursale
      if (selectedRole !== "Administrateur") {
        if (destinationType === "succursale" && values.succursale) {
          userData.succursale = values.succursale;
        } else if (destinationType === "magasin" && values.magasin) {
          userData.magasin = values.magasin;
        }
      }

      console.log("Données à envoyer:", userData);

      // Envoyer la requête
      const response = await axiosInstance.post(
        "/utilisateurs/inscription/",
        userData,
      );

      toast.success("Utilisateur ajouté avec succès !");
      
      // Message selon le rôle
      if (selectedRole === "Administrateur") {
        toast.info("L'administrateur a été créé avec tous les droits d'accès.");
      } else if (selectedRole === "Collaborateur") {
        toast.info("Le collaborateur a été créé avec les permissions attribuées.");
      } else if (selectedRole === "Observateur") {
        toast.info("L'observateur a été créé avec accès en visualisation seulement.");
      }

      // Rafraîchir la liste et fermer les modals
      await fetchUsers();
      closeModalStep2();
      closeModalStep3();
      setFinalConfirmAdminModal(false);
    } catch (error) {
      console.error("Erreur création utilisateur:", error.response?.data || error.message);

      let errorMessage = "Une erreur est survenue lors de la création de l'utilisateur.";

      if (error.response?.data) {
        if (error.response.data.email) {
          errorMessage = `Email: ${
            Array.isArray(error.response.data.email)
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


  // Gestion des permissions pour utilisateur existant
  const handleSavePermissions = async () => {
    if (permissionsModalMode === "edit" && !canManagePermissions) {
      toast.error("Vous n'avez pas les permissions pour modifier les utilisateurs");
      return;
    }

    if (permissionsModalMode === "edit" && !selectedUserForEdit) return;

    setSavingPermissions(true);

    try {
      const flatPermissions = [];
      Object.keys(selectedPermissions).forEach((moduleId) => {
        Object.keys(selectedPermissions[moduleId]).forEach((actionId) => {
          if (selectedPermissions[moduleId][actionId] === true) {
            flatPermissions.push(actionId);
          }
        });
      });

      if (permissionsModalMode === "create") {
        // Pour les administrateurs, ajouter toutes les permissions automatiquement
        if (selectedRole === "Administrateur") {
          allPermissionsData.forEach((module) => {
            module.actions.forEach((action) => {
              flatPermissions.push(action.id);
            });
          });
        }

        // Soumettre le formulaire
        await handleSubmitForm(formikValidation.values);
      } else {
        const response = await axiosInstance.post(
          `/updatepermission/${selectedUserForEdit.id}/`,
          {
            permissions: flatPermissions,
          },
        );

        if (response.status === 200) {
          toast.success("Permissions mises à jour avec succès");
          closeModalStep3();
          fetchUsers();
        }
      }
    } catch (error) {
      console.error("Erreur sauvegarde permissions:", error);
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

  // Gestion des utilisateurs existants
  const handleSuspendUser = async (userId, currentStatus) => {
    if (!canManagePermissions) {
      toast.error("Vous n'avez pas les permissions pour cette action");
      return;
    }

    try {
      setActionLoading(true);
      const response = await axiosInstance.patch(
        "/utilisateurs/suspend-collaborateur/",
        { user_id: userId },
      );

      if (response.status === 200) {
        const newStatus = !currentStatus;
        toast.success(
          newStatus
            ? "Utilisateur suspendu avec succès"
            : "Utilisateur réactivé avec succès",
        );

        setTeamList((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, suspendu: newStatus } : user,
          ),
        );
      }
    } catch (error) {
      console.error("Erreur modification statut:", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la modification du statut",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Ouvrir modal d'édition des permissions
  const openEditPermissionsModal = async (user) => {
    if (!canManagePermissions) {
      toast.error("Vous n'avez pas les permissions pour modifier les utilisateurs");
      return;
    }

    setSelectedUserForEdit(user);
    setSelectedRole(user.type_utilisateur);
    setPermissionsModalMode("edit");

    try {
      const response = await axiosInstance.get(
        `/utilisateurs/user-permissions/${user.id}/`,
      );

      if (response.data && response.data.permissions) {
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
      console.error("Erreur chargement permissions:", error);
      setSelectedPermissions({});
    }

    setModalStep3(true);
  };

  // Filtrage des utilisateurs
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return teamList;

    const searchTermLower = searchTerm.toLowerCase();
    return teamList.filter((user) => {
      return (
        (user.nom && user.nom.toLowerCase().includes(searchTermLower)) ||
        (user.prenom && user.prenom.toLowerCase().includes(searchTermLower)) ||
        (user.email && user.email.toLowerCase().includes(searchTermLower)) ||
        (user.fonction && user.fonction.toLowerCase().includes(searchTermLower)) ||
        (user.telephone && user.telephone.toLowerCase().includes(searchTermLower))
      );
    });
  }, [teamList, searchTerm]);

  // Rendu du contenu principal avec skeleton loader
  const renderContent = () => {
    if (pageLoading) {
      return <UserGridSkeleton count={8} />;
    }

    // Vérifier si l'utilisateur peut ajouter
    if (!isAdmin || (isAdmin && !canAddMoreUsers)) {
      return (
        <EmptyDataCard
          title={hasReachedLimitValue ? "Limite d'utilisateurs atteinte" : "Fonctionnalité limitée"}
          description={
            hasReachedLimitValue 
              ? `Vous avez atteint la limite de ${maxUsers} utilisateur(s) avec votre abonnement ${subscriptionModule} ${subscriptionCategory}.`
              : "Vous n'avez pas les permissions nécessaires pour gérer les utilisateurs"
          }
          actionButton={
            hasReachedLimitValue ? (
              <Button
                color="warning"
                onClick={() => navigate("/offres")}
                style={{ borderRadius: "20px" }}
              >
                <i className="ri-star-line me-1"></i>
                Passer à un abonnement supérieur
              </Button>
            ) : (
              <Button
                color="info"
                onClick={openModalStep1}
                style={{ borderRadius: "20px" }}
                disabled={!canAddMoreUsers}
              >
                <i className="ri-user-add-line me-1"></i>
                Ajouter un utilisateur
              </Button>
            )
          }
          icon={hasReachedLimitValue ? "ri-user-unfollow-line" : "ri-user-shared-line"}
        />
      );
    }

    if (filteredUsers.length > 0) {
      return (
        <Row className="team-list grid-view-filter">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              actionLoading={actionLoading}
              canManagePermissions={canManagePermissions}
              onSuspend={handleSuspendUser}
              onEditPermissions={openEditPermissionsModal}
            />
          ))}
        </Row>
      );
    }

    return (
      <EmptyDataCard
        title="Aucun utilisateur trouvé"
        description="Commencez par ajouter votre premier utilisateur"
        actionButton={
          <Button
            color="info"
            onClick={openModalStep1}
            style={{ borderRadius: "20px" }}
            disabled={!canAddMoreUsers}
          >
            <i className="ri-user-add-line me-1"></i>
            Ajouter un utilisateur
          </Button>
        }
      />
    );
  };

 return (
    <React.Fragment>
      <ToastContainer closeButton={false} />

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
          
          {/* Header avec barre de recherche optimisée, badge et bouton */}
      <Card style={{ borderRadius: "70px" }}>
  <CardBody>
    <Row className="align-items-center">
      {/* Colonne GAUCHE - Barre de recherche optimisée avec debouncing */}
      <Col md={4}>
        <OptimizedSearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher par nom, email..."
          debounceMs={300}
        />
      </Col>
      
      {/* Colonne DROITE - Badge et bouton côte à côte */}
      <Col md={8} className="text-end">
        <div className="d-flex align-items-center justify-content-end gap-3">
          {/* Badge d'information */}
          {isAdmin && (
            <div 
              className={`px-3 py-2 d-inline-flex align-items-center justify-content-center ${
                hasReachedLimitValue ? 'bg-danger' : 'bg-success'
              }`}
              style={{ 
                borderRadius: '20px',
                height: '40px',
                // fontSize: '0.9rem',
                fontWeight: '500',
                color: 'white',
                minWidth: '200px',
                lineHeight: '1',
                transition: 'all 0.3s ease',
                cursor: 'default',
              }}
            >
              {hasReachedLimitValue ? (
                <>
                  <i className="ri-alert-line me-2"></i>
                  Limite atteinte ({currentUserCount}/{maxUsers})
                </>
              ) : (
                <>
                  <i className="ri-user-line me-2"></i>
                  {remainingUserSlots} utilisateur(s) restante(s) ({maxUsers})
                </>
              )}
            </div>
          )}
          
          {/* Bouton Ajouter */}
          {isAdmin && canAddMoreUsers && (
            <Button 
              color="info"
              style={{ 
                borderRadius: "20px",
                height: "40px",
                display: "inline-flex",
                alignItems: "center",
                padding: "0 20px",
                fontWeight: "500",
              }}
              onClick={openModalStep1}
              // title={`Ajouter un utilisateur (${remainingUserSlots} restant(s))`}
            >
              <i className="ri-file-add-line me-2 align-bottom"></i>
              Ajouter un utilisateur
            </Button>
          )}
        </div>
      </Col>
    </Row>
  </CardBody>
</Card>
          
          {/* Contenu principal */}
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
              className={`p-3 rounded-top-4 ${
                selectedRole === "Administrateur" 
                  ? "bg-primary-subtle" 
                  : selectedRole === "Collaborateur" 
                  ? "bg-info-subtle" 
                  : "bg-secondary-subtle"
              }`}
              toggle={closeModalStep2}
            >
              <i className="ri-user-3-line me-2"></i>
              Informations personnelles
              {/* {selectedRole && (
                <Badge 
                  color={
                    selectedRole === "Administrateur" 
                      ? "primary" 
                      : selectedRole === "Collaborateur" 
                      ? "info" 
                      : "secondary"
                  } 
                  className="ms-2"
                >
                  {selectedRole}
                </Badge>
              )} */}
            </ModalHeader>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                formikValidation.handleSubmit();
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
                          formikValidation.setFieldValue(
                            "telephone",
                            value ? String(value) : "",
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
                  
                  {/* Section Magasin/Succursale (seulement pour non-administrateurs) */}
                  {selectedRole !== "Administrateur" && (
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
                              onChange={(e) => {
                                setDestinationType(e.target.value);
                                handleSelectSuccursale(null);
                              }}
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
                              onChange={(e) => {
                                setDestinationType(e.target.value);
                                handleSelectMagasin(null);
                              }}
                            />
                            <Label check for="radioSuccursale" className="ms-2">
                              Succursale
                            </Label>
                          </FormGroup>
                        </div>

                        {destinationType === "magasin" && (
                          <CustomSelect
                            value={selectedMagasin}
                            onChange={handleSelectMagasin}
                            options={magasins.map((m) => ({
                              value: m.id,
                              label: m.nom,
                            }))}
                            placeholder={
                              loadingMagasins
                                ? "Chargement des magasins..."
                                : "Sélectionner un magasin"
                            }
                            isDisabled={loadingMagasins}
                            className="rounded-pill"
                          />
                        )}

                        {destinationType === "succursale" && (
                          <CustomSelect
                            value={selectedSuccursale}
                            onChange={handleSelectSuccursale}
                            options={groupes.map((g) => ({
                              value: g.id,
                              label: g.nom,
                            }))}
                            placeholder={
                              loadingGroupes
                                ? "Chargement des succursales..."
                                : "Sélectionner une succursale"
                            }
                            isDisabled={loadingGroupes}
                            className="rounded-pill"
                          />
                        )}
                      </div>
                    </Col>
                  )}
                </Row>
                
                {/* Information spéciale selon le rôle */}
                {selectedRole === "Administrateur" ? (
                  <Alert color="info" className="mt-3">
                    <i className="ri-information-line me-2"></i>
                    <strong>Note :</strong> Cet administrateur aura tous les droits d'accès aux modules.
                    Une confirmation vous sera demandée avant la création.
                  </Alert>
                ) : selectedRole === "Observateur" ? (
                  <Alert color="secondary" className="mt-3">
                    <i className="ri-information-line me-2"></i>
                    <strong>Note :</strong> L'observateur pourra seulement visualiser les modules pour lesquels vous lui attribuerez des permissions.
                  </Alert>
                ) : (
                  <Alert color="info" className="mt-3">
                    <i className="ri-information-line me-2"></i>
                    <strong>Note :</strong> Vous pourrez attribuer des permissions spécifiques à ce collaborateur dans l'étape suivante.
                  </Alert>
                )}
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="secondary rounded-pill" 
                  onClick={() => {
                    setModalStep2(false);
                    setModalStep1(true);
                  }}
                >
                  Retour
                </Button>
                <Button 
                  color="primary rounded-pill" 
                  type="submit"
                  disabled={formSubmitLoading}
                >
                  {formSubmitLoading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Validation...
                    </>
                  ) : selectedRole === "Administrateur" ? (
                    <>
                      <i className="ri-check-line me-1"></i>
                      Créer l'administrateur
                    </>
                  ) : (
                    <>
                      <i className="ri-arrow-right-line me-1"></i>
                      Attribuer des permissions
                    </>
                  )}
                </Button>
              </ModalFooter>
            </Form>
          </Modal>

          {/* Modal de confirmation FINALE pour Administrateur (après formulaire) */}
          <Modal
            isOpen={finalConfirmAdminModal}
            toggle={cancelFinalAdminCreation}
            centered
            contentClassName="rounded-4"
          >
            <ModalHeader className="bg-warning-subtle p-3 rounded-top-4">
              <i className="ri-shield-keyhole-line me-2 text-warning"></i>
              Confirmation finale - Création d'Administrateur
            </ModalHeader>
            <ModalBody>
              <Alert color="warning" className="border-0">
                <h5 className="alert-heading">
                  <i className="ri-alert-line me-2"></i>
                  Dernière confirmation
                </h5>
                <p>
                  Vous êtes sur le point de créer un <strong>Administrateur</strong> avec les informations suivantes :
                </p>
                <hr />
                {formDataToConfirm && (
                  <div className="mt-3">
                    <p><strong>Informations de l'administrateur :</strong></p>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-1"><strong>Nom :</strong> {formDataToConfirm.nom}</p>
                      <p className="mb-1"><strong>Prénom :</strong> {formDataToConfirm.prenom}</p>
                      <p className="mb-1"><strong>Email :</strong> {formDataToConfirm.email}</p>
                      <p className="mb-1"><strong>Fonction :</strong> {formDataToConfirm.fonction}</p>
                      <p className="mb-0"><strong>Téléphone :</strong> {formDataToConfirm.telephone || "Non renseigné"}</p>
                    </div>
                  </div>
                )}
                <div className="mt-3">
                  <p className="mb-0">
                    <strong>⚠️ Cet utilisateur aura :</strong><br />
                    • Tous les droits d'accès aux modules<br />
                    • La possibilité de gérer d'autres utilisateurs<br />
                    • Les mêmes privilèges que vous
                  </p>
                </div>
              </Alert>
              <div className="mt-3">
                <p>
                  <strong>Confirmez-vous la création de cet administrateur ?</strong>
                </p>
                <p className="text-muted small">
                  Cette action ne peut pas être annulée. L'administrateur aura immédiatement accès à toutes les fonctionnalités.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary rounded-pill" onClick={cancelFinalAdminCreation}>
                <i className="ri-close-line me-1"></i>
                Annuler
              </Button>
              <Button color="primary rounded-pill" onClick={confirmFinalAdminCreation} disabled={formSubmitLoading}>
                {formSubmitLoading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <i className="ri-check-double-line me-1"></i>
                    Oui, créer l'administrateur
                  </>
                )}
              </Button>
            </ModalFooter>
          </Modal>

          {/* Modal Étape 3: Permissions (pour collaborateurs et observateurs) */}
          <Modal
            isOpen={modalStep3}
            toggle={closeModalStep3}
            size="xl-6"
            // style={{ maxHeight: "250%"}}
            contentClassName="custom-rounded-modal"
          >
            <ModalHeader
              toggle={closeModalStep3}
              className={`p-3 rounded-top-4 ${
                selectedRole === "Collaborateur" ? "bg-info-subtle" : "bg-secondary-subtle"
              }`}
            >
              <i className="ri-sound-module-line me-2"></i>
              {permissionsModalMode === "create" 
                ? `Attribuer des permissions - ${selectedRole}`
                : `Modifier les permissions - ${selectedUserForEdit?.type_utilisateur || selectedRole}`}
              
              {selectedRole === "Observateur" && (
                <Badge color="secondary" className="ms-2">
                  Visualisation seulement
                </Badge>
              )}
            </ModalHeader>

            <ModalBody className="p-0">
              <SimpleBar style={{ maxHeight: "60vh" }}>
                <table className="table table-borderless mb-0">
                  <thead className="table-light sticky-top">
                    <tr>
                      <th style={{ width: "20%" }}>Module</th>
                      <th style={{ width: "12%" }}>Ajouter</th>
                      <th style={{ width: "12%" }}>Modifier</th>
                      <th style={{ width: "12%" }}>Supprimer</th>
                      <th style={{ width: "10%" }}>Voir</th>
                      <th style={{ width: "10%" }}>Tout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPermissionsData.map((permission) => (
                      <tr key={permission.id} style={{ height: "50px" }}>
                        <td
                          style={{
                            padding: "10px 15px",
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
                                    permission.actions,
                                  )
                                }
                                disabled={selectedRole === "Observateur" && !permission.actions.some(a => a.id.includes("view"))}
                                style={{
                                  borderRadius: "50%",
                                  width: "16px",
                                  height: "16px",
                                }}
                              />{" "}
                              <strong>{permission.label}</strong>
                              {/* <div className="text-muted small mt-1">
                                {permission.description}
                              </div> */}
                            </Label>
                          </FormGroup>
                        </td>
                        {permission.actions.map((action) => (
                          <td
                            key={action.id}
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                              padding: "10px 10px",
                            }}
                          >
                            <FormGroup
                              switch
                              className="d-flex justify-content-center"
                            >
                              <Input
                                type="switch"
                                checked={isPermissionSelected(permission.id, action.id)}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    permission.id,
                                    action.id,
                                    e.target.checked,
                                  )
                                }
                                disabled={
                                  !isModuleSelected(permission.id) ||
                                  (selectedRole === "Observateur" && isPermissionDisabled(action.id))
                                }
                              />
                              {/* <Label check className="small ms-2">
                                {action.label}
                              </Label> */}
                            </FormGroup>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </SimpleBar>
              
              {/* Instructions pour les observateurs */}
              {selectedRole === "Observateur" && (
                <Alert color="secondary" className="m-3">
                  <i className="ri-information-line me-2"></i>
                  <strong>Information :</strong> Les observateurs ne peuvent avoir que des permissions de visualisation (Voir).
                  Les autres permissions seront automatiquement désactivées.
                </Alert>
              )}
            </ModalBody>

            <ModalFooter>
              <Button color="secondary rounded-pill" onClick={backToStep2}>
                <i className="ri-arrow-left-line me-1"></i>
                Retour aux informations
              </Button>
              <Button
                color="primary rounded-pill"
                onClick={() => handleSavePermissions()}
                disabled={savingPermissions || formSubmitLoading}
              >
                {savingPermissions || formSubmitLoading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {permissionsModalMode === "create" ? "Création en cours..." : "Enregistrement..."}
                  </>
                ) : (
                  <>
                    <i className="ri-check-line me-1"></i>
                    {permissionsModalMode === "create" ? "Ajouter utilisateur" : "Enregistrer les permissions"}
                  </>
                )}
              </Button>
            </ModalFooter>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Team;