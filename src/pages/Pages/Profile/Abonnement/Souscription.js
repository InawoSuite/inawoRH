import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useProfile } from "../../../../Components/Hooks/UserHooks";
import Pricing from "../../Pricing/Pricing";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Label,
  Container,
  Row,
  Col,
  Badge,
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Toast,
  ToastHeader,
  ToastBody,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import { CustomSelect } from "../../../../Components/Common/CustomSelectStyles";
import EmptyDataCard from "../../../../Components/Common/EmptyDataCard";
import { BaseUrl } from "../../../APIKey/ApiKey";

// Import des composants FedaPay
import { FedaCheckoutButton } from 'fedapay-reactjs';

// Configuration Axios centralisée
const axiosInstance = axios.create({
  baseURL: `${BaseUrl}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Composant Overlay pour le mode forcé
const ForcedPaymentOverlay = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 9998,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
    }}
  >
    <div className="text-center">
      <div className="spinner-border text-light mb-3" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
      <div>Finalisation de votre abonnement...</div>
    </div>
  </div>
);

const Souscription = ({}) => {
  const { userProfile, token } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [fromWelcomeModal, setFromWelcomeModal] = useState(false);
  const [forcedPaymentMode, setForcedPaymentMode] = useState(false);

  // États pour le toast de succès
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // États pour les abonnements utilisateur
  const [userAbonnements, setUserAbonnements] = useState([]);
  const [loadingAbonnements, setLoadingAbonnements] = useState(false);
  const [errorAbonnements, setErrorAbonnements] = useState(null);

  // États pour le processus d'abonnement
  const [step1FormuleCategorieOpen, setStep1FormuleCategorieOpen] = useState(false);
  const [step2PeriodeOpen, setStep2PeriodeOpen] = useState(false);
  const [step3PromoOpen, setStep3PromoOpen] = useState(false);
  const [step4ProcessusOpen, setStep4ProcessusOpen] = useState(false);

  // États pour les sélections
  const [selectedFormule, setSelectedFormule] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoCodeVerified, setPromoCodeVerified] = useState(false);
  const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
  const [calculatingAmount, setCalculatingAmount] = useState(false);

  // États pour l'UI
  const [hoveredPeriode, setHoveredPeriode] = useState(null);
  const [showPricing, setShowPricing] = useState(false);

  // États pour le paiement
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [fedaPayOptions, setFedaPayOptions] = useState(null);

  // États pour les données
  const [tarifsModules, setTarifsModules] = useState([]);
  const [loadingTarifs, setLoadingTarifs] = useState(false);
  const [errorTarifs, setErrorTarifs] = useState(null);

  // Options pour les CustomSelect
  const formuleOptions = [
    { value: "", label: "Choisir une formule", disabled: true },
    { value: "Ventes", label: "Ventes" },
    { value: "Stock", label: "Stock" },
    { value: "Global", label: "Global" },
  ];

  const promoCodeOptions = [
    { value: "", label: "Code Promo", disabled: true },
    { value: "affiliation", label: "Code D'affiliation" },
    { value: "parrainage", label: "Code de parrainage" },
  ];

  const periodeOptions = [
    "Mensuel",
    "Trimestriel",
    "Semestriel",
    "Annuel",
    "BiAnnuel",
  ];

  // Configuration FedaPay
  const FEDAPAY_CONFIG = {
    // public_key: "pk_sandbox_lyRopdpPH4xDzC9TkjcrK0U4", // Remplacez par votre clé publique
    public_key: "pk_sandbox_lyRopdpPH4xDzC9TkjcrK0U4", // Remplacez par votre clé publique de production
    environment: "sandbox", // "live" pour la production
  };

  // État pour les données de paiement
  const [paymentData, setPaymentData] = useState({
    module: 1,
    categorie: 2,
    periodicite: "mensuel",
    tarif_module: 0,
    montant_payer: 0,
    reduction_appliquee: 0,
    methode_paiement: "",
    transaction_id: "",
    etat: "succes",
    code_parrain: "",
    code_affilie: ""
  });

  // ==================== EFFETS ====================

  useEffect(() => {
    const checkWelcomeModalRedirect = async () => {
      const cameFromWelcomeModal = sessionStorage.getItem("fromWelcomeModal");
      const userAbonnement = userProfile?.abonnement;

      if (cameFromWelcomeModal && userAbonnement) {
        console.log("🎯 Navigation depuis le modal de bienvenue détectée");
        sessionStorage.removeItem("fromWelcomeModal");

        const { module, categorie_nom } = userAbonnement;
        let formule = "";
        switch (module) {
          case "InawoSales":
            formule = "Ventes";
            break;
          case "InawoStock":
            formule = "Stock";
            break;
          case "Inawo Global":
            formule = "Global";
            break;
          default:
            formule = module;
        }

        setSelectedFormule(formule);
        setSelectedCategorie(categorie_nom);
        setFromWelcomeModal(true);

        await new Promise((resolve) => setTimeout(resolve, 100));
        setStep2PeriodeOpen(true);
      }
    };

    checkWelcomeModalRedirect();
  }, [userProfile, location]);

  useEffect(() => {
    if (userProfile?.abonnement) {
      const cameFromWelcomeModal = sessionStorage.getItem("fromWelcomeModal");
      if (cameFromWelcomeModal) {
        sessionStorage.removeItem("fromWelcomeModal");
        setTimeout(() => {
          setStep2PeriodeOpen(true);
        }, 500);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    if (token) {
      const requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      const responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
          console.error("Erreur API:", error.response?.data || error.message);
          return Promise.reject(error);
        }
      );

      return () => {
        axiosInstance.interceptors.request.eject(requestInterceptor);
        axiosInstance.interceptors.response.eject(responseInterceptor);
      };
    }
  }, [token]);

  useEffect(() => {
    const fetchUserAbonnements = async () => {
      if (!userProfile?.id) return;

      setLoadingAbonnements(true);
      setErrorAbonnements(null);

      try {
        const response = await axiosInstance.get(
          `abonnements/abonnementuser/${userProfile.id}/`
        );
        setUserAbonnements(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des abonnements:", error);
        setErrorAbonnements("Erreur lors du chargement des abonnements");
      } finally {
        setLoadingAbonnements(false);
      }
    };

    fetchUserAbonnements();
  }, [userProfile?.id]);

  useEffect(() => {
    const fetchTarifsModules = async () => {
      setLoadingTarifs(true);
      setErrorTarifs(null);

      try {
        const response = await axiosInstance.get(`abonnements/tarifmodule/`);
        setTarifsModules(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tarifs:", error);
        setErrorTarifs("Erreur lors du chargement des tarifs");
      } finally {
        setLoadingTarifs(false);
      }
    };

    fetchTarifsModules();
  }, []);

  // ==================== FONCTIONS PRINCIPALES ====================

  // Fonction pour calculer le montant avec code promo
  const calculerMontantAvecCodePromo = async (montantInitial, code) => {
    try {
      console.log("🔍 Calcul du montant avec code:", { montantInitial, code });

      const response = await axiosInstance.post(
        "https://inawoapiv3.inawo.pro/abonnements/calculer-montant/",
        {
          montant: montantInitial,
          code_parrainage: code || "",
        }
      );

      console.log("📊 Réponse calcul montant:", response.data);

      if (response.data && response.data.montant_final !== undefined) {
        const reduction = response.data.reduction_appliquee || 0;
        const nouveauMontant = response.data.montant_final;

        return {
          success: true,
          nouveau_montant: nouveauMontant,
          reduction: reduction,
          message: response.data.message || "Réduction appliquée avec succès",
        };
      } else {
        return {
          success: false,
          nouveau_montant: montantInitial,
          reduction: 0,
          message: response.data.message || "Aucune réduction applicable",
        };
      }
    } catch (error) {
      console.error("Erreur calcul montant:", error);
      return {
        success: false,
        nouveau_montant: montantInitial,
        reduction: 0,
        message: error.response?.data?.message || "Erreur lors du calcul",
      };
    }
  };

  // Fonction pour vérifier le code promo
  const verifyPromoCode = async (code) => {
    try {
      console.log("🔍 Vérification du code:", code);

      const response = await axiosInstance.get(
        `abonnements/verifier-code/?code=${code}`
      );

      console.log("📊 Réponse vérification:", response.data);

      const isValid = !!response.data.utilisateur_id;

      if (isValid) {
        const userInfo = response.data;
        const message = `Code ${userInfo.type_code} valide ! Utilisateur: ${userInfo.prenom} ${userInfo.nom}`;

        toast.success(
          <span style={{ fontWeight: "bold", color: "green" }}>{message}</span>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        return {
          valid: true,
          discount: 0,
          message: message,
          userInfo: userInfo,
        };
      } else {
        return {
          valid: false,
          discount: 0,
          message: "Code invalide",
        };
      }
    } catch (error) {
      console.error("Erreur vérification code promo:", error);

      let errorMessage = "Code invalide";

      if (error.response?.status === 404) {
        errorMessage = "Code non trouvé";
      } else if (error.response?.status === 400) {
        const serverMessage =
          error.response.data.error || error.response.data.message || "";
        if (
          serverMessage.includes("Aucun utilisateur") ||
          serverMessage.includes("utilisateur trouvé") ||
          serverMessage.includes("Code inexistant")
        ) {
          errorMessage = "Code invalide";
        } else if (serverMessage.includes("expiré")) {
          errorMessage = "Code expiré";
        } else if (serverMessage.includes("déjà utilisé")) {
          errorMessage = "Code déjà utilisé";
        } else {
          errorMessage = "Code invalide";
        }
      } else if (error.response?.data?.error) {
        const serverError = error.response.data.error;
        if (
          serverError.includes("Aucun utilisateur") ||
          serverError.includes("utilisateur trouvé")
        ) {
          errorMessage = "Code invalide";
        } else {
          errorMessage = "Code invalide";
        }
      } else if (error.message && error.message.includes("Network Error")) {
        errorMessage = "Erreur de connexion. Vérifiez votre internet.";
      }

      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {errorMessage}
        </span>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      return {
        valid: false,
        discount: 0,
        message: errorMessage,
      };
    }
  };

  // ==================== FONCTIONS FEDAPAY ====================

  const initializeFedaPay = (paymentData) => {
    const transactionId = `INAWO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const options = {
      public_key: FEDAPAY_CONFIG.public_key,
      transaction: {
        amount: paymentData.montant_payer,
        description: `Abonnement ${selectedFormule} - ${formatCategorieName(selectedCategorie)} - ${selectedPeriode}`,
      },
      currency: {
        iso: 'XOF'
      },
      customer: {
        firstname: userProfile?.nom || "Client",
        lastname: userProfile?.prenom || "INAWO",
        email: userProfile?.email || "client@inawo.com",
        phone_number: userProfile?.telephone || "+22500000000"
      },
      button: {
        class: 'btn btn-primary w-100',
        text: `Payer ${formatMontant(paymentData.montant_payer)} `
      },
      onComplete: async (response) => {
        console.log("Réponse FedaPay:", response);
        
        try {
          if (response.reason === 'completed' || response.reason === 'approved') {
            // Paiement réussi
            await handleSuccessfulPayment(response);
          } else if (response.reason === 'dialog_dismissed') {
            // Utilisateur a fermé la boîte de dialogue
            toast.info("Paiement annulé par l'utilisateur");
          } else {
            // Paiement échoué
            await handleFailedPayment(response);
          }
        } catch (error) {
          console.error("Erreur traitement réponse FedaPay:", error);
          toast.error("Erreur lors du traitement du paiement");
        }
      },
      onCancel: () => {
        toast.info("Paiement annulé");
      },
      onError: (error) => {
        console.error("Erreur FedaPay:", error);
        toast.error("Erreur lors du processus de paiement");
      }
    };

    setFedaPayOptions(options);
  };

  const handleSuccessfulPayment = async (response) => {
    setPaymentLoading(true);
    
    try {
      // Préparer les données de souscription
      const subscriptionData = prepareSubscriptionData(response);
      subscriptionData.methode_paiement = "fedapay";
      subscriptionData.transaction_id = response.transaction?.id || `TXN_${Date.now()}`;
      subscriptionData.etat = "succes";

      console.log("📦 Données d'abonnement à envoyer:", subscriptionData);

      // Envoyer les données au backend
      const result = await sendSubscriptionData(subscriptionData);

      if (result.success) {
        setPaymentSuccess(`
          Paiement confirmé ! 
          Abonnement ${selectedFormule} activé avec succès.
          ID Transaction: ${subscriptionData.transaction_id}
        `);

        setToastMessage(`Votre abonnement ${selectedFormule} a été activé avec succès`);
        setShowSuccessToast(true);

        // Recharger les données utilisateur
        await refreshUserData();

        // Fermer le modal après délai
        setTimeout(() => {
          setStep4ProcessusOpen(false);
          resetSubscriptionProcess();
          setForcedPaymentMode(false);
          setFromWelcomeModal(false);
        }, 3000);

        toast.success("🎉 Abonnement activé avec succès !");
      } else {
        throw new Error(result.message || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("❌ Erreur après paiement réussi:", error);
      toast.error("Erreur lors de l'activation de l'abonnement");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleFailedPayment = async (response) => {
    console.error("Paiement échoué:", response);
    
    try {
      const subscriptionData = prepareSubscriptionData(response);
      subscriptionData.methode_paiement = "fedapay";
      subscriptionData.transaction_id = response.transaction?.id || `TXN_${Date.now()}`;
      subscriptionData.etat = "echec";

      // Enregistrer l'échec (optionnel)
      await sendSubscriptionData(subscriptionData);
      
      toast.error(`Paiement échoué: ${response.reason || "Raison inconnue"}`);
    } catch (error) {
      console.error("Erreur enregistrement échec:", error);
      toast.error("Paiement échoué");
    }
  };

  // Fonction pour continuer après le code promo
  const handleContinueFromPromo = async () => {
    setCalculatingAmount(true);
    let finalAmount = paymentData.tarif_module;
    let reductionAppliquee = 0;
    let codeParrain = "";
    let codeAffilie = "";

    try {
      if (promoCode && promoCodeInput) {
        console.log("🎯 Vérification du code promo:", promoCodeInput);

        const verification = await verifyPromoCode(promoCodeInput);

        if (!verification.valid) {
          console.log("❌ Code invalide, arrêt du processus");
          return;
        }

        console.log("✅ Code valide, calcul du montant...");
        const calcul = await calculerMontantAvecCodePromo(
          paymentData.tarif_module,
          promoCodeInput
        );

        console.log("📋 Résultat calcul:", calcul);

        if (calcul.success) {
          setPromoCodeVerified(true);
          setPromoCodeDiscount(calcul.reduction);
          finalAmount = calcul.nouveau_montant;
          reductionAppliquee = calcul.reduction;

          if (promoCode === "parrainage") {
            codeParrain = promoCodeInput;
          } else if (promoCode === "affiliation") {
            codeAffilie = promoCodeInput;
          }

          if (calcul.reduction > 0) {
            toast.success(
              <span style={{ fontWeight: "bold", color: "green" }}>
                {calcul.message ||
                  `Réduction de ${calcul.reduction}% appliquée !`}
              </span>,
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
          } else {
            toast.info(
              <span style={{ fontWeight: "bold", color: "blue" }}>
                {calcul.message ||
                  "Code valide mais aucune réduction applicable"}
              </span>,
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
          }
        } else {
          setPromoCodeVerified(true);
          setPromoCodeDiscount(0);

          toast.info(
            <span style={{ fontWeight: "bold", color: "orange" }}>
              {calcul.message ||
                "Code valide mais erreur lors du calcul de la réduction"}
            </span>,
            {
              position: "top-right",
              autoClose: 3000,
            }
          );
        }
      } else {
        setPromoCodeVerified(false);
        setPromoCodeDiscount(0);
      }

      const updatedPaymentData = {
        ...paymentData,
        montant_payer: finalAmount,
        reduction_appliquee: reductionAppliquee,
        code_parrain: codeParrain,
        code_affilie: codeAffilie,
      };
      setPaymentData(updatedPaymentData);

      console.log("🚀 Passage à l'étape 4 avec données:", updatedPaymentData);

      setStep3PromoOpen(false);
      setStep4ProcessusOpen(true);

      // Initialiser FedaPay avec les nouvelles données
      initializeFedaPay(updatedPaymentData);

    } catch (error) {
      console.error("Erreur inattendue:", error);
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setCalculatingAmount(false);
    }
  };

  // ==================== FONCTIONS UTILITAIRES ====================

  const formatMontant = (montant) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant);
  };

  const formatCategorieName = (categorie) => {
    if (!categorie) return "N/A";
    const categorieValue =
      typeof categorie === "object"
        ? categorie.value || categorie.label || ""
        : String(categorie);
    switch (categorieValue.toUpperCase()) {
      case "ESSENTIEL":
        return "Essentiel";
      case "BUSINESS":
        return "Business";
      case "PROFESSIONNEL":
        return "Professionnel";
      default:
        return categorieValue;
    }
  };

  const getCategorieBadgeColor = (categorie) => {
    const categorieValue =
      typeof categorie === "object"
        ? categorie.value || categorie.label || ""
        : String(categorie);
    if (!categorieValue) return "secondary";
    switch (categorieValue.toUpperCase()) {
      case "ESSENTIEL":
        return "primary";
      case "BUSINESS":
        return "success";
      case "PROFESSIONNEL":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getAvailableCategories = () => {
    if (!selectedFormule || !tarifsModules.length) return [];
    const moduleName =
      selectedFormule === "Ventes"
        ? "InawoSales"
        : selectedFormule === "Stock"
        ? "InawoStock"
        : "Inawo Global";
    
    const categories = tarifsModules
      .filter((item) => item.module_nom === moduleName)
      .map((item) => item.categorie_nom);
    
    return [...new Set(categories)];
  };

  const getCategorieOptions = () => {
    const categories = getAvailableCategories();
    const options = [
      { value: "", label: "Choisir une catégorie", disabled: true },
    ];
    categories.forEach((categorie) => {
      options.push({
        value: categorie,
        label: formatCategorieName(categorie),
      });
    });
    return options;
  };

  const isCategorieGratuite = (formule, categorie) => {
    return false;
  };

// ==================== FONCTION CORRIGÉE POUR CALCULER LES TARIFS ====================

const calculateTarif = (periode, formule, categorie) => {
  if (!formule || !categorie || !tarifsModules.length) return 0;

  console.log("🔍 Recherche tarif:", { formule, categorie, periode });

  // Mapper les noms de formules aux noms de modules dans l'API
  const moduleName = 
    formule === "Ventes" ? "InawoSales" :
    formule === "Stock" ? "InawoStock" : 
    "Inawo Global";

  // Normaliser le nom de la catégorie
  const categorieApiName = categorie;

  console.log("📊 Paramètres de recherche:", {
    moduleName,
    categorieApiName,
    periode,
    totalTarifs: tarifsModules.length
  });

  // Filtrer tous les tarifs correspondants et exclure ceux avec prix à 0
  const tarifsCorrespondants = tarifsModules.filter(item => 
    item.module_nom === moduleName && 
    item.categorie_nom === categorieApiName
  );

  console.log("📋 Tous les tarifs correspondants:", tarifsCorrespondants);

  // Filtrer pour ne garder que les tarifs avec des prix non nuls
  const tarifsAvecPrix = tarifsCorrespondants.filter(item => {
    let prix = 0;
    switch (periode) {
      case "Mensuel": 
        prix = parseFloat(item.prix_cfa_mensuel) || 0; 
        break;
      case "Trimestriel": 
        prix = parseFloat(item.prix_cfa_trimestre) || 0; 
        break;
      case "Semestriel": 
        prix = parseFloat(item.prix_cfa_semestre) || 0; 
        break;
      case "Annuel": 
        prix = parseFloat(item.prix_cfa_annuel) || 0; 
        break;
      case "BiAnnuel": 
        prix = parseFloat(item.prix_cfa_biannuel) || 0; 
        break;
      default: 
        prix = 0;
    }
    return prix > 0;
  });

  console.log("✅ Tarifs avec prix non nul:", tarifsAvecPrix);

  if (tarifsAvecPrix.length === 0) {
    console.log("❌ Aucun tarif avec prix non nul trouvé");
    
    // Essayer de trouver un tarif de secours (même formule/catégorie mais module différent)
    const tarifsSecours = tarifsModules.filter(item => 
      item.categorie_nom === categorieApiName && 
      (
        (moduleName === "InawoSales" && item.module_nom === "InawoSales") ||
        (moduleName === "InawoStock" && item.module_nom === "InawoStock")
      )
    ).filter(item => {
      let prix = parseFloat(item.prix_cfa_mensuel) || 0;
      return prix > 0;
    });

    console.log("🔄 Tarifs de secours:", tarifsSecours);

    if (tarifsSecours.length > 0) {
      const tarifItem = tarifsSecours[0];
      let prix = 0;
      switch (periode) {
        case "Mensuel": 
          prix = parseFloat(tarifItem.prix_cfa_mensuel) || 0; 
          break;
        case "Trimestriel": 
          prix = parseFloat(tarifItem.prix_cfa_trimestre) || 0; 
          break;
        case "Semestriel": 
          prix = parseFloat(tarifItem.prix_cfa_semestre) || 0; 
          break;
        case "Annuel": 
          prix = parseFloat(tarifItem.prix_cfa_annuel) || 0; 
          break;
        case "BiAnnuel": 
          prix = parseFloat(tarifItem.prix_cfa_biannuel) || 0; 
          break;
        default: 
          prix = 0;
      }
      console.log("🎯 Utilisation du tarif de secours:", prix);
      return prix;
    }
    
    return 0;
  }

  // Prendre le premier tarif avec prix non nul
  const tarifItem = tarifsAvecPrix[0];

  let prix = 0;
  switch (periode) {
    case "Mensuel": 
      prix = parseFloat(tarifItem.prix_cfa_mensuel) || 0; 
      break;
    case "Trimestriel": 
      prix = parseFloat(tarifItem.prix_cfa_trimestre) || 0; 
      break;
    case "Semestriel": 
      prix = parseFloat(tarifItem.prix_cfa_semestre) || 0; 
      break;
    case "Annuel": 
      prix = parseFloat(tarifItem.prix_cfa_annuel) || 0; 
      break;
    case "BiAnnuel": 
      prix = parseFloat(tarifItem.prix_cfa_biannuel) || 0; 
      break;
    default: 
      prix = 0;
  }

  console.log("💰 Prix final calculé:", { periode, prix, tarifItem });

  return prix;
};


  const getPeriodiciteFormat = (periode) => {
  switch (periode.toLowerCase()) {
    case "mensuel":
    case "mensuelle":
      return "mensuel";
    case "trimestriel":
    case "trimestrielle":
      return "trimestriel";
    case "semestriel":
    case "semestrielle":
      return "semestriel";
    case "annuel":
    case "annuelle":
      return "annuel";
    case "biannuel":
    case "biannuelle":
      return "biannuel";
    default:
      // Retourner la valeur originale si non reconnue
      return periode.toLowerCase();
  }
};

  const getMethodePaiementFormat = (methode) => {
    switch (methode) {
      case "mobile_money":
        return "mobile_money";
      case "carte_bancaire":
        return "carte_bancaire";
      case "fedapay":
        return "fedapay";
      default:
        return "fedapay";
    }
  };

  const sendSubscriptionData = async (subscriptionData) => {
    try {
      console.log("Envoi des données d'abonnement:", subscriptionData);
      
      const response = await axiosInstance.post(
        "utilisateurs/abonnement_user/",
        subscriptionData
      );
      
      console.log("Réponse du backend:", response.data);

      if (response.data.success || response.data.id) {
        return {
          success: true,
          data: response.data,
          message: "Abonnement enregistré avec succès",
        };
      } else {
        throw new Error(
          response.data.message || "Erreur lors de l'enregistrement"
        );
      }
    } catch (error) {
      console.error("Erreur détaillée:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message:
          error.response?.data?.message || "Erreur lors de l'envoi des données",
      };
    }
  };

  const prepareSubscriptionData = (paymentResponse = null) => {
    const getModuleId = (formule) => {
      switch (formule) {
        case "Ventes":
          return 1;
        case "Stock":
          return 2;
        case "Global":
          return 3;
        default:
          return 3;
      }
    };

    const getCategorieId = (categorie) => {
      const categorieValue =
        typeof categorie === "object"
          ? categorie.value || categorie.label || ""
          : String(categorie);
      switch (categorieValue.toUpperCase()) {
        case "ESSENTIEL":
          return 1;
        case "BUSINESS":
          return 2;
        case "PROFESSIONNEL":
          return 3;
        default:
          return 1;
      }
    };

    let etatPaiement = "succes";
    let transactionId = "";
    let methodePaiement = "";

    if (paymentResponse) {
      if (
        paymentResponse.status === "approved" ||
        paymentResponse.status === "success"
      ) {
        etatPaiement = "succes";
      } else if (
        paymentResponse.status === "failed" ||
        paymentResponse.status === "error"
      ) {
        etatPaiement = "echec";
      }

      transactionId =
        paymentResponse.transaction_id ||
        paymentResponse.id ||
        `TXN_${Date.now()}`;
      methodePaiement =
        paymentResponse.payment_method || 
        getMethodePaiementFormat("fedapay");
    }

    const subscriptionData = {
      module: getModuleId(selectedFormule),
      categorie: getCategorieId(selectedCategorie),
      periodicite: getPeriodiciteFormat(selectedPeriode),
      tarif_module: paymentData.tarif_module,
      montant_payer: paymentData.montant_payer,
      reduction_appliquee: paymentData.reduction_appliquee || 0,
      methode_paiement: methodePaiement,
      transaction_id: transactionId,
      etat: etatPaiement,
      code_parrain: paymentData.code_parrain || "",
      code_affilie: paymentData.code_affilie || ""
    };

    console.log("Données préparées pour l'API:", subscriptionData);
    return subscriptionData;
  };

  const refreshUserData = async () => {
    try {
      if (userProfile?.id) {
        const response = await axiosInstance.get(
          `abonnements/abonnementuser/${userProfile.id}/`
        );
        setUserAbonnements(response.data);
      }
    } catch (error) {
      console.error("Erreur rechargement abonnements:", error);
    }
  };

  const checkPendingSubscriptions = async () => {
    const pending = localStorage.getItem("pending_subscription");
    if (pending) {
      try {
        const pendingData = JSON.parse(pending);
        const result = await sendSubscriptionData(pendingData);
        if (result.success) {
          localStorage.removeItem("pending_subscription");
          console.log("Abonnement en attente confirmé");
        }
      } catch (error) {
        console.error("Erreur confirmation abonnement en attente:", error);
      }
    }
  };

  useEffect(() => {
    checkPendingSubscriptions();
  }, []);

  // ==================== GESTION DU PROCESSUS ====================

  const startSubscriptionProcess = () => {
    setSelectedFormule("");
    setSelectedCategorie("");
    setSelectedPeriode("");
    setPromoCode("");
    setPromoCodeInput("");
    setPromoCodeVerified(false);
    setPromoCodeDiscount(0);
    setPaymentData({
      module: 1,
      categorie: 2,
      periodicite: "mensuel",
      tarif_module: 0,
      montant_payer: 0,
      reduction_appliquee: 0,
      methode_paiement: "",
      transaction_id: "",
      etat: "succes",
      code_parrain: "",
      code_affilie: ""
    });
    setStep1FormuleCategorieOpen(true);
  };

  const handleContinueToStep2 = () => {
    const categorieValue =
      typeof selectedCategorie === "object"
        ? selectedCategorie.value || selectedCategorie.label || ""
        : String(selectedCategorie);
    if (!selectedFormule || !categorieValue) {
      alert("Veuillez sélectionner une formule et une catégorie");
      return;
    }

    setStep1FormuleCategorieOpen(false);
    setStep2PeriodeOpen(true);
  };

  const handlePeriodeClick = async (periode) => {
    setSelectedPeriode(periode);
    const tarif = calculateTarif(periode, selectedFormule, selectedCategorie);
    const montantPayer = tarif;

    setPaymentData((prev) => ({
      ...prev,
      tarif_module: tarif,
      montant_payer: montantPayer,
      periodicite: getPeriodiciteFormat(periode),
    }));

    setStep2PeriodeOpen(false);
    setStep3PromoOpen(true);

    console.log("📊 Données de paiement préparées:", {
      formule: selectedFormule,
      categorie: selectedCategorie,
      periode: periode,
      periodicite: getPeriodiciteFormat(periode),
      tarif: tarif,
      fromWelcomeModal: fromWelcomeModal,
    });
  };

  const resetSubscriptionProcess = () => {
    setSelectedFormule("");
    setSelectedCategorie("");
    setSelectedPeriode("");
    setPromoCode("");
    setPromoCodeInput("");
    setPromoCodeVerified(false);
    setPromoCodeDiscount(0);
    setPaymentData({
      module: 1,
      categorie: 2,
      periodicite: "mensuel",
      tarif_module: 0,
      montant_payer: 0,
      reduction_appliquee: 0,
      methode_paiement: "",
      transaction_id: "",
      etat: "succes",
      code_parrain: "",
      code_affilie: ""
    });
  };

  // ==================== FONCTIONS UI ====================

  const toggleStep1 = () => {
    if (!forcedPaymentMode)
      setStep1FormuleCategorieOpen(!step1FormuleCategorieOpen);
  };
  const toggleStep2 = () => {
    if (!forcedPaymentMode) setStep2PeriodeOpen(!step2PeriodeOpen);
  };
  const toggleStep3 = () => {
    if (!forcedPaymentMode) setStep3PromoOpen(!step3PromoOpen);
  };
  const toggleStep4 = () => {
    if (!forcedPaymentMode) setStep4ProcessusOpen(!step4ProcessusOpen);
  };
  const toggleSuccessToast = () => setShowSuccessToast(!showSuccessToast);

  const getAbonnementStatus = () => {
    if (!userAbonnements || userAbonnements.length === 0)
      return "no_abonnement";
    const latestAbonnement = userAbonnements[0];
    const { statut, date_fin } = latestAbonnement;
    if (date_fin) {
      const today = new Date();
      const endDate = new Date(date_fin);
      if (endDate < today) return "expired";
    }
    return statut === "actif" ? "active" : "inactive";
  };

  const getButtonText = () => {
    const status = getAbonnementStatus();
    switch (status) {
      case "active":
        return "Se réabonner";
      case "inactive":
      case "expired":
      case "no_abonnement":
        return "S'abonner";
      default:
        return "S'abonner";
    }
  };

  const getButtonColor = () => {
    const status = getAbonnementStatus();
    switch (status) {
      case "active":
        return "info";
      case "inactive":
      case "expired":
      case "no_abonnement":
        return "success";
      default:
        return "success";
    }
  };

  const formatModuleName = (module) => {
    if (!module) return "N/A";
    switch (module.nom) {
      case "Inawo Global":
        return "Global";
      case "InawoSales":
        return "Ventes";
      case "InawoStock":
        return "Stock";
      default:
        return module.nom;
    }
  };

  const getPeriodeDisplay = (periode) => {
    const tarif = calculateTarif(periode, selectedFormule, selectedCategorie);
    return {
      prixNormal: tarif,
      displayReduction: promoCodeVerified ? `-${promoCodeDiscount}%` : "",
    };
  };

  const getPeriodeStyle = (name) => {
    const base = {
      padding: "1rem",
      borderRadius: "70px",
      fontSize: "1.0rem",
      border: "1px solid #014a92",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
      marginBottom: "0.5rem",
      height: "90px",
    };
    const isHovered = hoveredPeriode === name;
    return {
      ...base,
      backgroundColor: isHovered ? "#014a92" : "transparent",
      color: isHovered ? "white" : "#014a92",
    };
  };

  const getDureeTextStyle = (name) => {
    const isHovered = hoveredPeriode === name;
    const isSelected = selectedPeriode === name;
    return {
      fontSize: "0.7rem",
      color: isHovered || isSelected ? "rgba(255,255,255,0.9)" : "#6c757d",
      marginTop: "0.25rem",
    };
  };

  const getPriceStyle = (name) => {
    const isHovered = hoveredPeriode === name;
    const isSelected = selectedPeriode === name;
    return {
      fontSize: "0.8rem",
      fontWeight: "bold",
      color: isHovered || isSelected ? "white" : "#014a92",
      marginTop: "0.25rem",
    };
  };

  const handleDownloadPDF = () => {
    // Logique pour télécharger le PDF
  };

  if (showPricing) {
    return <Pricing onBack={() => setShowPricing(false)} />;
  }

  document.title = "Abonnement | INAWO - Suite de Gestion";

  return (
    <React.Fragment>
      {forcedPaymentMode && <ForcedPaymentOverlay />}
      <div
        className="main-content"
        style={{
          margin: "0",
          filter: forcedPaymentMode ? "blur(3px)" : "none",
          pointerEvents: forcedPaymentMode ? "none" : "auto",
        }}
      >
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                  <h4 className="mb-sm-0 fw-100">Abonnement</h4>
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <a
                          href="#"
                          className="text-decoration-none d-flex fs-6"
                        >
                          <span className="ms-2 me-2">
                            <i className="ri-secure-payment-fill"></i>
                          </span>
                          <span className="ms-1 me-1">&gt;</span>
                          <span className="ms-1 me-1">Inawo</span>
                          <span className="ms-1 me-1">&gt;</span>
                          <span className="ms-1 me-1">Tableau de bord</span>
                          <span className="ms-1 me-1">&gt;</span>
                        </a>
                      </li>
                      <li className="breadcrumb-item active">Abonnement</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                <div className="card" style={{ borderRadius: "70px" }}>
                  <div
                    className="card-header"
                    style={{
                      borderRadius: "70px 70px 70px 70px",
                      borderBottom: "none",
                      padding: "1rem 1.5rem",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <div
                        className="flex-grow-1"
                        style={{ maxWidth: "300px" }}
                      >
                        <div className="search-box position-relative">
                          <input
                            type="text"
                            className="form-control search"
                            placeholder="Chercher un abonnement . . ."
                            style={{
                              borderRadius: "50px",
                              paddingLeft: "40px",
                              width: "100%",
                            }}
                          />
                          <i
                            className="ri-search-line search-icon position-absolute"
                            style={{
                              left: "15px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          ></i>
                        </div>
                      </div>

                      <div className="d-flex gap-2 flex-wrap justify-content-end">
                        <button
                          className="btn btn-primary d-flex align-items-center"
                          style={{ borderRadius: "50px", whiteSpace: "nowrap" }}
                          onClick={() => setShowPricing(true)}
                        >
                          <i className="ri-exchange-line me-1"></i>Changer
                          formule
                        </button>

                        <button
                          className={`btn btn-${getButtonColor()} d-flex align-items-center`}
                          style={{ borderRadius: "50px", whiteSpace: "nowrap" }}
                          onClick={startSubscriptionProcess}
                        >
                          <i className="ri-file-add-line me-1"></i>
                          {getButtonText()}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="">
                <div
                  className="card"
                  id="contactList"
                  style={{ borderRadius: "20px" }}
                >
                  <div>
                    {loadingAbonnements ? (
                      <div className="text-center p-4">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Chargement...</span>
                        </div>
                        <p className="mt-2">Chargement de vos abonnements...</p>
                      </div>
                    ) : errorAbonnements ? (
                      <EmptyDataCard
                        title="Aucun abonnement récupérer"
                        description="Vérifier la connexion internet"
                      />
                    ) : userAbonnements.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover table-nowrap mb-0">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Formule</th>
                              <th>Catégorie</th>
                              <th>Prix</th>
                              <th>Date début</th>
                              <th>Date fin</th>
                              <th>Statut</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userAbonnements
                              .sort(
                                (a, b) =>
                                  new Date(b.date_debut) -
                                  new Date(a.date_debut)
                              )
                              .map((abonnement, index) => (
                                <tr key={abonnement.id}>
                                  <td>{userAbonnements.length - index}</td>
                                  <td>
                                    <span>
                                      {formatModuleName(abonnement.module)}
                                    </span>
                                  </td>
                                  <td>
                                    <span
                                      className={`badge rounded-pill bg-${getCategorieBadgeColor(
                                        abonnement.categorie
                                      )}`}
                                    >
                                      {formatCategorieName(
                                        abonnement.categorie
                                      )}
                                    </span>
                                  </td>
                                  <td>
                                    {abonnement.montant_payer?.toLocaleString(
                                      "fr-FR"
                                    ) || "0"}{" "}
                                    
                                  </td>
                                  <td>{abonnement.date_debut}</td>
                                  <td>{abonnement.date_fin}</td>
                                  <td>
                                    <span
                                      className={`badge badge-sm rounded-pill bg-${
                                        abonnement.statut === "actif"
                                          ? "success"
                                          : "secondary"
                                      }`}
                                    >
                                      {abonnement.statut === "actif"
                                        ? "Actif"
                                        : "Inactif"}
                                    </span>
                                  </td>
                                  <td>
                                    <Link
                                      to="#"
                                      className="text-info p-2"
                                      onClick={() =>
                                        handleDownloadPDF(abonnement)
                                      }
                                    >
                                      <i className="ri-download-2-fill fs-16"></i>
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <i className="ri-subtract-line display-5 text-muted"></i>
                        <h5 className="mt-3">Aucun abonnement trouvé</h5>
                        <p className="text-muted">
                          Vous n'avez pas encore souscrit à un abonnement.
                        </p>
                        <Button
                          color="primary"
                          onClick={startSubscriptionProcess}
                          style={{ borderRadius: "70px" }}
                        >
                          <i className="ri-file-add-line me-1"></i>S'abonner
                          maintenant
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* MODALS */}

                  {/* ÉTAPE 1 - Modal Formule et Catégorie */}
                  <Modal
                    isOpen={step1FormuleCategorieOpen}
                    toggle={toggleStep1}
                    centered
                    modalClassName="border-0"
                    contentClassName="rounded-4"
                  >
                    <ModalHeader
                      toggle={toggleStep1}
                      className="bg-info-subtle p-3 rounded-top-4"
                    >
                      <i className="ri-settings-3-line me-2"></i>Formules
                    </ModalHeader>
                    <ModalBody>
                      {loadingTarifs ? (
                        <div className="text-center p-4">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">
                              Chargement...
                            </span>
                          </div>
                          <p className="mt-2">
                            Chargement des formules disponibles...
                          </p>
                        </div>
                      ) : errorTarifs ? (
                        <Alert color="danger">{errorTarifs}</Alert>
                      ) : (
                        <div className="d-flex flex-column">
                          <div className="mb-3">
                            <Label className="form-label fw-bold">
                              <i className="ri-box-3-line me-2 text-primary"></i>
                              Sélectionnez une formule
                            </Label>
                            <CustomSelect
                              options={formuleOptions}
                              value={
                                formuleOptions.find(
                                  (opt) => opt.value === selectedFormule
                                ) || null
                              }
                              onChange={(selectedOption) => {
                                const value = selectedOption
                                  ? selectedOption.value
                                  : "";
                                setSelectedFormule(value);
                              }}
                              placeholder="Choisir une formule"
                            />
                          </div>

                          <div className="mb-3">
                            <Label className="form-label fw-bold">
                              <i className="ri-star-line me-2 text-warning"></i>
                              Sélectionnez une catégorie
                            </Label>
                            <CustomSelect
                              options={getCategorieOptions(selectedCategorie)}
                              value={
                                getCategorieOptions().find(
                                  (opt) => opt.value === selectedCategorie
                                ) || null
                              }
                              onChange={(selectedOption) => {
                                const value = selectedOption
                                  ? selectedOption.value
                                  : "";
                                setSelectedCategorie(value);
                              }}
                              placeholder="Choisir une catégorie"
                              disabled={!selectedFormule}
                            />
                          </div>
                        </div>
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="secondary"
                        style={{ borderRadius: "70px" }}
                        onClick={toggleStep1}
                      >
                        Annuler
                      </Button>
                      <Button
                        color="primary"
                        style={{ borderRadius: "70px" }}
                        onClick={handleContinueToStep2}
                        disabled={
                          !selectedFormule ||
                          !selectedCategorie ||
                          loadingTarifs
                        }
                      >
                        <i className="ri-arrow-right-line me-1"></i>
                        Continuer
                      </Button>
                    </ModalFooter>
                  </Modal>

                  {/* ÉTAPE 2 - Modal Période */}
                  <Modal
                    isOpen={step2PeriodeOpen}
                    toggle={forcedPaymentMode ? undefined : toggleStep2}
                    centered
                    modalClassName="border-0"
                    contentClassName="rounded-4"
                    style={{ maxWidth: "500px" }}
                    backdrop={forcedPaymentMode ? "static" : true}
                    keyboard={!forcedPaymentMode}
                  >
                    <ModalHeader
                      toggle={forcedPaymentMode ? undefined : toggleStep2}
                      className="bg-info-subtle p-3 rounded-top-4"
                    >
                      <div className="d-flex align-items-center">
                        <i className="ri-calendar-line me-2"></i>
                        <span>Période d'abonnement</span>
                      </div>
                    </ModalHeader>
                    <ModalBody className="text-center">
                      <div className="mb-4">
                        <p className="text-muted">
                          <strong>Formule sélectionnée :</strong>{" "}
                          {selectedFormule} -{" "}
                          {formatCategorieName(selectedCategorie)}
                        </p>
                      </div>
                      <div className="d-flex flex-column gap-2">
                        {periodeOptions.map((periode) => {
                          const { prixNormal, displayReduction } =
                            getPeriodeDisplay(periode);
                          return (
                            <div
                              key={periode}
                              style={getPeriodeStyle(periode)}
                              onClick={() => handlePeriodeClick(periode)}
                              onMouseEnter={() => setHoveredPeriode(periode)}
                              onMouseLeave={() => setHoveredPeriode(null)}
                            >
                              <div
                                style={{
                                  fontSize: "1.0rem",
                                  fontWeight: "bold",
                                }}
                              >
                                {periode}
                              </div>
                              <div style={getPriceStyle(periode)}>
                                {formatMontant(prixNormal)} 
                              </div>
                              <div style={getDureeTextStyle(periode)}>
                                {periode === "Mensuel"
                                  ? "1 mois"
                                  : periode === "Trimestriel"
                                  ? "3 mois"
                                  : periode === "Semestriel"
                                  ? "6 mois"
                                  : periode === "Annuel"
                                  ? "1 an"
                                  : "2 ans"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ModalBody>
                    <ModalFooter className="justify-content-center">
                      <Button
                        color="secondary"
                        style={{ borderRadius: "70px" }}
                        onClick={() => {
                          setStep2PeriodeOpen(false);
                          setStep1FormuleCategorieOpen(true);
                        }}
                      >
                        <i className="ri-arrow-left-line me-1"></i>Retour
                      </Button>
                    </ModalFooter>
                  </Modal>

                  {/* ÉTAPE 3 - Modal Code Promo */}
                  <Modal
                    isOpen={step3PromoOpen}
                    toggle={forcedPaymentMode ? undefined : toggleStep3}
                    centered
                    modalClassName="border-0"
                    contentClassName="rounded-4"
                    backdrop={forcedPaymentMode ? "static" : true}
                    keyboard={!forcedPaymentMode}
                  >
                    <ModalHeader
                      toggle={forcedPaymentMode ? undefined : toggleStep3}
                      className="bg-info-subtle p-3 rounded-top-4"
                    >
                      <i className="ri-coupon-line me-2"></i>Code Promo
                    </ModalHeader>
                    <ModalBody>
                      <div className="mb-3">
                        <p className="text-muted">
                          <strong>Sélection :</strong> {selectedFormule} -{" "}
                          {formatCategorieName(selectedCategorie)} -{" "}
                          {selectedPeriode}
                        </p>
                        <p className="text-muted">
                          <strong>Prix :</strong>{" "}
                          {formatMontant(paymentData.tarif_module)} 
                        </p>
                      </div>

                      <div className="mb-3">
                        <Label className="form-label fw-bold">
                          Type de code promo
                        </Label>
                        <CustomSelect
                          options={promoCodeOptions}
                          value={promoCode}
                          onChange={setPromoCode}
                          placeholder="Code Promo"
                        />
                      </div>

                      {promoCode && (
                        <div className="mb-1">
                          <Label className="form-label fw-bold">
                            Votre code{" "}
                            {promoCode === "affiliation"
                              ? "d'affiliation"
                              : "de parrainage"}
                          </Label>
                          <Input
                            type="text"
                            placeholder={`Entrez votre code ${
                              promoCode === "affiliation"
                                ? "d'affiliation"
                                : "de parrainage"
                            }`}
                            value={promoCodeInput}
                            onChange={(e) => setPromoCodeInput(e.target.value)}
                            style={{
                              borderRadius: "70px",
                              height: "45px",
                              paddingLeft: "20px",
                            }}
                          />
                        </div>
                      )}

                      {promoCodeVerified && (
                        <Alert color="success" className="mt-3">
                          <i className="ri-check-line me-2"></i>Code vérifié !
                          Réduction de {promoCodeDiscount}% appliquée.
                        </Alert>
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="secondary"
                        style={{ borderRadius: "70px" }}
                        onClick={() => {
                          setStep3PromoOpen(false);
                          setStep2PeriodeOpen(true);
                        }}
                      >
                        <i className="ri-arrow-left-line me-1"></i>Retour
                      </Button>
                      <Button
                        color="primary"
                        style={{ borderRadius: "70px" }}
                        onClick={handleContinueFromPromo}
                        disabled={calculatingAmount}
                      >
                        {calculatingAmount ? (
                          <>
                            <div
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            >
                              <span className="visually-hidden">Calcul...</span>
                            </div>
                            Calcul en cours...
                          </>
                        ) : (
                          <>
                            <i className="ri-arrow-right-line me-1"></i>
                            Continuer
                          </>
                        )}
                      </Button>
                    </ModalFooter>
                  </Modal>

                  {/* ÉTAPE 4 - Modal Récapitulatif et Paiement */}
                  <Modal
                    isOpen={step4ProcessusOpen}
                    toggle={forcedPaymentMode ? undefined : toggleStep4}
                    centered
                    modalClassName="border-0"
                    contentClassName="rounded-4"
                    backdrop={forcedPaymentMode ? "static" : true}
                    keyboard={!forcedPaymentMode}
                  >
                    <ModalHeader
                      toggle={forcedPaymentMode ? undefined : toggleStep4}
                      className="bg-info-subtle p-3 rounded-top-4"
                    >
                      <i className="ri-file-list-line me-2"></i>Récapitulatif de votre abonnement
                    </ModalHeader>
                    <ModalBody>
                      <div className="p-3 rounded bg-light mb-4">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>
                              <strong>Formule :</strong> {selectedFormule}
                            </h6>
                            <h6>
                              <strong>Catégorie :</strong>{" "}
                              {formatCategorieName(selectedCategorie)}
                            </h6>
                          </div>
                          <div className="col-md-6">
                            <h6>
                              <strong>Période :</strong> {selectedPeriode}
                            </h6>
                            <h6>
                              <strong>Durée :</strong>{" "}
                              {selectedPeriode === "Mensuel"
                                ? "1 mois"
                                : selectedPeriode === "Trimestriel"
                                ? "3 mois"
                                : selectedPeriode === "Semestriel"
                                ? "6 mois"
                                : selectedPeriode === "Annuel"
                                ? "1 an"
                                : "2 ans"}
                            </h6>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                            <span>Prix normal :</span>
                            <span className="fw-bold">
                              {formatMontant(paymentData.tarif_module)} 
                            </span>
                          </div>

                          {promoCodeVerified && (
                            <>
                              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mt-2">
                                <span>Réduction appliquée :</span>
                                <span className="text-success">
                                  -{promoCodeDiscount}% (-
                                  {formatMontant(
                                    Math.round(
                                      (paymentData.tarif_module * promoCodeDiscount) / 100
                                    )
                                  )}{" "}
                                  )
                                </span>
                              </div>
                            </>
                          )}

                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <h5 className="mb-0">Total à payer :</h5>
                            <h4 className="mb-0 text-success fw-bold">
                              {formatMontant(paymentData.montant_payer)} 
                            </h4>
                          </div>
                        </div>

                        {promoCodeVerified && (
                          <div className="mt-3 p-2 bg-success-subtle rounded">
                            <p className="mb-0">
                              <strong>Code promo appliqué :</strong>{" "}
                              <span className="badge bg-success text-white">
                                {promoCodeInput}
                              </span>
                              <span className="ms-2">
                                (
                                {promoCode === "affiliation"
                                  ? "Code d'affiliation"
                                  : "Code de parrainage"}
                                )
                              </span>
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Section Paiement FedaPay */}
                      <div className="mt-4">
                        <div className="text-center mb-3">
                          {/* <h5>Paiement sécurisé</h5> */}
                          <p className="text-muted">
                            Cliquez sur le bouton ci-dessous pour procéder au paiement
                          </p>
                        </div>

                        {fedaPayOptions && (
                          <div className="d-flex justify-content-center rounded-pill">
                            <FedaCheckoutButton 
                              options={fedaPayOptions}
                              // className="btn btn-primary btn-lg"
                              style={{ borderRadius: "70px" }}
                              // disabled={paymentLoading}
                            />
                          </div>
                        )}

                        <div className="mt-3 text-center">
                          <small className="text-muted">
                            <i className="ri-shield-check-line me-1"></i>
                            Paiement 100% sécurisé via FedaPay
                          </small>
                        </div>

                        {paymentLoading && (
                          <div className="text-center mt-3">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Traitement en cours...</span>
                            </div>
                            <p className="mt-2">Traitement du paiement...</p>
                          </div>
                        )}
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="secondary"
                        style={{ borderRadius: "70px" }}
                        onClick={() => {
                          setStep4ProcessusOpen(false);
                          setStep3PromoOpen(true);
                        }}
                        disabled={paymentLoading}
                      >
                        <i className="ri-arrow-left-line me-1"></i>Retour
                      </Button>
                      <Button
                        color="light"
                        onClick={toggleStep4}
                        style={{ borderRadius: "70px" }}
                        disabled={paymentLoading}
                      >
                        Annuler
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          minWidth: "300px",
        }}
      >
        <Toast isOpen={showSuccessToast} fade>
          <ToastHeader
            icon="success"
            toggle={toggleSuccessToast}
            style={{
              backgroundColor: "#d1edff",
              color: "#0f5132",
              borderBottom: "1px solid #0f5132",
            }}
          >
            <i className="ri-checkbox-circle-fill text-success me-2"></i>Succès
            !
          </ToastHeader>
          <ToastBody style={{ backgroundColor: "#d1edff" }}>
            <div className="d-flex align-items-center">
              <i className="ri-checkbox-circle-fill text-success me-2 fs-4"></i>
              <div>
                <strong className="text-success">Abonnement activé</strong>
                <p className="mb-0 text-dark">{toastMessage}</p>
              </div>
            </div>
          </ToastBody>
        </Toast>
      </div>
    </React.Fragment>
  );
};

export default Souscription;


// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useProfile } from "../../../../Components/Hooks/UserHooks";
// import Pricing from "../../Pricing/Pricing";
// import {
//   Card,
//   CardBody,
//   CardHeader,
//   Input,
//   Label,
//   Container,
//   Row,
//   Col,
//   Badge,
//   Alert,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Toast,
//   ToastHeader,
//   ToastBody,
// } from "reactstrap";
// import Flatpickr from "react-flatpickr";
// import { toast } from "react-toastify";
// import { CustomSelect } from "../../../../Components/Common/CustomSelectStyles";
// import EmptyDataCard from "../../../../Components/Common/EmptyDataCard";
// import { BaseUrl } from "../../../APIKey/ApiKey";

// // Configuration Axios centralisée
// const axiosInstance = axios.create({
//   baseURL: `${BaseUrl}`,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 30000,
// });

// // Composant Overlay pour le mode forcé
// const ForcedPaymentOverlay = () => (
//   <div
//     style={{
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       backgroundColor: "rgba(0, 0, 0, 0.5)",
//       zIndex: 9998,
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       color: "white",
//       fontSize: "18px",
//       fontWeight: "bold",
//     }}
//   >
//     <div className="text-center">
//       <div className="spinner-border text-light mb-3" role="status">
//         <span className="visually-hidden">Chargement...</span>
//       </div>
//       <div>Finalisation de votre abonnement...</div>
//     </div>
//   </div>
// );

// const Souscription = ({}) => {
//   const { userProfile, token } = useProfile();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [fromWelcomeModal, setFromWelcomeModal] = useState(false);
//   const [forcedPaymentMode, setForcedPaymentMode] = useState(false);

//   // États pour le toast de succès
//   const [showSuccessToast, setShowSuccessToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");

//   // États pour les abonnements utilisateur
//   const [userAbonnements, setUserAbonnements] = useState([]);
//   const [loadingAbonnements, setLoadingAbonnements] = useState(false);
//   const [errorAbonnements, setErrorAbonnements] = useState(null);

//   // États pour le processus d'abonnement
//   const [step1FormuleCategorieOpen, setStep1FormuleCategorieOpen] =
//     useState(false);
//   const [step2PeriodeOpen, setStep2PeriodeOpen] = useState(false);
//   const [step3PromoOpen, setStep3PromoOpen] = useState(false);
//   const [step4ProcessusOpen, setStep4ProcessusOpen] = useState(false);

//   // États pour les sélections
//   const [selectedFormule, setSelectedFormule] = useState("");
//   const [selectedCategorie, setSelectedCategorie] = useState("");
//   const [selectedPeriode, setSelectedPeriode] = useState("");
//   const [promoCode, setPromoCode] = useState("");
//   const [promoCodeInput, setPromoCodeInput] = useState("");
//   const [promoCodeVerified, setPromoCodeVerified] = useState(false);
//   const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
//   const [calculatingAmount, setCalculatingAmount] = useState(false);

//   // États pour l'UI
//   const [hoveredPeriode, setHoveredPeriode] = useState(null);
//   const [showPricing, setShowPricing] = useState(false);

//   // États pour le paiement
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [paymentError, setPaymentError] = useState("");
//   const [paymentSuccess, setPaymentSuccess] = useState("");
//   const [feexPayLoaded, setFeexPayLoaded] = useState(false);

//   // États pour les données
//   const [tarifsModules, setTarifsModules] = useState([]);
//   const [loadingTarifs, setLoadingTarifs] = useState(false);
//   const [errorTarifs, setErrorTarifs] = useState(null);

//   // Options pour les CustomSelect
//   const formuleOptions = [
//     { value: "", label: "Choisir une formule", disabled: true },
//     { value: "Ventes", label: "Ventes" },
//     { value: "Stock", label: "Stock" },
//     { value: "Global", label: "Global" },
//   ];

//   const promoCodeOptions = [
//     { value: "", label: "Code Promo", disabled: true },
//     { value: "affiliation", label: "Code D'affiliation" },
//     { value: "parrainage", label: "Code de parrainage" },
//   ];

//   const periodeOptions = [
//     "Mensuel",
//     "Trimestriel",
//     "Semestriel",
//     "Annuel",
//     "BiAnnuel",
//   ];

//   // Configuration FeexPay
//   const FEEXPAY_CONFIG = {
//     id: "6712276c8a9d35bd17a623eb",
//     token:
//       "fp_4RlUPkRHoqaEnW02oAKuXvT5UtPFarWovbig8WW1nZcd6AW4SEjfjUWUpASd0StA",
//     mode: "SANDBOX",
//     custom_button: true,
//     id_custom_button: "feexpay-payment-btn",
//   };

//   // État pour les données de paiement
//   const [paymentData, setPaymentData] = useState({
//     module: 1,
//     categorie: 2,
//     periodicite: "mensuel",
//     tarif_module: 0,
//     montant_payer: 0,
//     reduction_appliquee: 0,
//     methode_paiement: "",
//     transaction_id: "",
//     etat: "succes",
//     code_parrain: "",
//     code_affilie: ""
//   });

//   // ==================== EFFETS ====================

//   useEffect(() => {
//     const checkWelcomeModalRedirect = async () => {
//       const cameFromWelcomeModal = sessionStorage.getItem("fromWelcomeModal");
//       const userAbonnement = userProfile?.abonnement;

//       if (cameFromWelcomeModal && userAbonnement) {
//         console.log("🎯 Navigation depuis le modal de bienvenue détectée");
//         sessionStorage.removeItem("fromWelcomeModal");

//         const { module, categorie_nom } = userAbonnement;
//         let formule = "";
//         switch (module) {
//           case "InawoSales":
//             formule = "Ventes";
//             break;
//           case "InawoStock":
//             formule = "Stock";
//             break;
//           case "InawoGlobal":
//             formule = "Global";
//             break;
//           default:
//             formule = module;
//         }

//         setSelectedFormule(formule);
//         setSelectedCategorie(categorie_nom);
//         setFromWelcomeModal(true);

//         await new Promise((resolve) => setTimeout(resolve, 100));
//         setStep2PeriodeOpen(true);
//       }
//     };

//     checkWelcomeModalRedirect();
//   }, [userProfile, location]);

//   useEffect(() => {
//     if (userProfile?.abonnement) {
//       const cameFromWelcomeModal = sessionStorage.getItem("fromWelcomeModal");
//       if (cameFromWelcomeModal) {
//         sessionStorage.removeItem("fromWelcomeModal");
//         setTimeout(() => {
//           setStep2PeriodeOpen(true);
//         }, 500);
//       }
//     }
//   }, [userProfile]);

//   useEffect(() => {
//     if (token) {
//       const requestInterceptor = axiosInstance.interceptors.request.use(
//         (config) => {
//           if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//           }
//           return config;
//         },
//         (error) => Promise.reject(error)
//       );

//       const responseInterceptor = axiosInstance.interceptors.response.use(
//         (response) => response,
//         (error) => {
//           console.error("Erreur API:", error.response?.data || error.message);
//           return Promise.reject(error);
//         }
//       );

//       return () => {
//         axiosInstance.interceptors.request.eject(requestInterceptor);
//         axiosInstance.interceptors.response.eject(responseInterceptor);
//       };
//     }
//   }, [token]);

//   useEffect(() => {
//     const fetchUserAbonnements = async () => {
//       if (!userProfile?.id) return;

//       setLoadingAbonnements(true);
//       setErrorAbonnements(null);

//       try {
//         const response = await axiosInstance.get(
//           `abonnements/abonnementuser/${userProfile.id}/`
//         );
//         setUserAbonnements(response.data);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des abonnements:", error);
//         setErrorAbonnements("Erreur lors du chargement des abonnements");
//       } finally {
//         setLoadingAbonnements(false);
//       }
//     };

//     fetchUserAbonnements();
//   }, [userProfile?.id]);

//   useEffect(() => {
//     const fetchTarifsModules = async () => {
//       setLoadingTarifs(true);
//       setErrorTarifs(null);

//       try {
//         const response = await axiosInstance.get(`abonnements/tarifmodule/`);
//         setTarifsModules(response.data);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des tarifs:", error);
//         setErrorTarifs("Erreur lors du chargement des tarifs");
//       } finally {
//         setLoadingTarifs(false);
//       }
//     };

//     fetchTarifsModules();
//   }, []);

//   // ==================== FONCTIONS PRINCIPALES ====================

//   // Fonction pour calculer le montant avec code promo
//   const calculerMontantAvecCodePromo = async (montantInitial, code) => {
//     try {
//       console.log("🔍 Calcul du montant avec code:", { montantInitial, code });

//       const response = await axiosInstance.post(
//         "https://inawoapiv3.inawo.pro/abonnements/calculer-montant/",
//         {
//           montant: montantInitial,
//           code_parrainage: code || "",
//         }
//       );

//       console.log("📊 Réponse calcul montant:", response.data);

//       if (response.data && response.data.montant_final !== undefined) {
//         const reduction = response.data.reduction_appliquee || 0;
//         const nouveauMontant = response.data.montant_final;

//         return {
//           success: true,
//           nouveau_montant: nouveauMontant,
//           reduction: reduction,
//           message: response.data.message || "Réduction appliquée avec succès",
//         };
//       } else {
//         return {
//           success: false,
//           nouveau_montant: montantInitial,
//           reduction: 0,
//           message: response.data.message || "Aucune réduction applicable",
//         };
//       }
//     } catch (error) {
//       console.error("Erreur calcul montant:", error);
//       return {
//         success: false,
//         nouveau_montant: montantInitial,
//         reduction: 0,
//         message: error.response?.data?.message || "Erreur lors du calcul",
//       };
//     }
//   };

//   // Fonction pour vérifier le code promo
//   const verifyPromoCode = async (code) => {
//     try {
//       console.log("🔍 Vérification du code:", code);

//       const response = await axiosInstance.get(
//         `abonnements/verifier-code/?code=${code}`
//       );

//       console.log("📊 Réponse vérification:", response.data);

//       const isValid = !!response.data.utilisateur_id;

//       if (isValid) {
//         const userInfo = response.data;
//         const message = `Code ${userInfo.type_code} valide ! Utilisateur: ${userInfo.prenom} ${userInfo.nom}`;

//         toast.success(
//           <span style={{ fontWeight: "bold", color: "green" }}>{message}</span>,
//           {
//             position: "top-right",
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//           }
//         );

//         return {
//           valid: true,
//           discount: 0,
//           message: message,
//           userInfo: userInfo,
//         };
//       } else {
//         return {
//           valid: false,
//           discount: 0,
//           message: "Code invalide",
//         };
//       }
//     } catch (error) {
//       console.error("Erreur vérification code promo:", error);

//       let errorMessage = "Code invalide";

//       if (error.response?.status === 404) {
//         errorMessage = "Code non trouvé";
//       } else if (error.response?.status === 400) {
//         const serverMessage =
//           error.response.data.error || error.response.data.message || "";
//         if (
//           serverMessage.includes("Aucun utilisateur") ||
//           serverMessage.includes("utilisateur trouvé") ||
//           serverMessage.includes("Code inexistant")
//         ) {
//           errorMessage = "Code invalide";
//         } else if (serverMessage.includes("expiré")) {
//           errorMessage = "Code expiré";
//         } else if (serverMessage.includes("déjà utilisé")) {
//           errorMessage = "Code déjà utilisé";
//         } else {
//           errorMessage = "Code invalide";
//         }
//       } else if (error.response?.data?.error) {
//         const serverError = error.response.data.error;
//         if (
//           serverError.includes("Aucun utilisateur") ||
//           serverError.includes("utilisateur trouvé")
//         ) {
//           errorMessage = "Code invalide";
//         } else {
//           errorMessage = "Code invalide";
//         }
//       } else if (error.message && error.message.includes("Network Error")) {
//         errorMessage = "Erreur de connexion. Vérifiez votre internet.";
//       }

//       toast.error(
//         <span style={{ fontWeight: "bold", color: "red" }}>
//           {errorMessage}
//         </span>,
//         {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         }
//       );

//       return {
//         valid: false,
//         discount: 0,
//         message: errorMessage,
//       };
//     }
//   };

//   // Fonction pour continuer après le code promo
//   const handleContinueFromPromo = async () => {
//     setCalculatingAmount(true);
//     let finalAmount = paymentData.tarif_module;
//     let reductionAppliquee = 0;
//     let codeParrain = "";
//     let codeAffilie = "";

//     try {
//       if (promoCode && promoCodeInput) {
//         console.log("🎯 Vérification du code promo:", promoCodeInput);

//         const verification = await verifyPromoCode(promoCodeInput);

//         if (!verification.valid) {
//           console.log("❌ Code invalide, arrêt du processus");
//           return;
//         }

//         console.log("✅ Code valide, calcul du montant...");
//         const calcul = await calculerMontantAvecCodePromo(
//           paymentData.tarif_module,
//           promoCodeInput
//         );

//         console.log("📋 Résultat calcul:", calcul);

//         if (calcul.success) {
//           setPromoCodeVerified(true);
//           setPromoCodeDiscount(calcul.reduction);
//           finalAmount = calcul.nouveau_montant;
//           reductionAppliquee = calcul.reduction;

//           if (promoCode === "parrainage") {
//             codeParrain = promoCodeInput;
//           } else if (promoCode === "affiliation") {
//             codeAffilie = promoCodeInput;
//           }

//           if (calcul.reduction > 0) {
//             toast.success(
//               <span style={{ fontWeight: "bold", color: "green" }}>
//                 {calcul.message ||
//                   `Réduction de ${calcul.reduction}% appliquée !`}
//               </span>,
//               {
//                 position: "top-right",
//                 autoClose: 3000,
//               }
//             );
//           } else {
//             toast.info(
//               <span style={{ fontWeight: "bold", color: "blue" }}>
//                 {calcul.message ||
//                   "Code valide mais aucune réduction applicable"}
//               </span>,
//               {
//                 position: "top-right",
//                 autoClose: 3000,
//               }
//             );
//           }
//         } else {
//           setPromoCodeVerified(true);
//           setPromoCodeDiscount(0);

//           toast.info(
//             <span style={{ fontWeight: "bold", color: "orange" }}>
//               {calcul.message ||
//                 "Code valide mais erreur lors du calcul de la réduction"}
//             </span>,
//             {
//               position: "top-right",
//               autoClose: 3000,
//             }
//           );
//         }
//       } else {
//         setPromoCodeVerified(false);
//         setPromoCodeDiscount(0);
//       }

//       const updatedPaymentData = {
//         ...paymentData,
//         montant_payer: finalAmount,
//         reduction_appliquee: reductionAppliquee,
//         code_parrain: codeParrain,
//         code_affilie: codeAffilie,
//       };
//       setPaymentData(updatedPaymentData);

//       console.log("🚀 Passage à l'étape 4 avec données:", updatedPaymentData);

//       setStep3PromoOpen(false);
//       setStep4ProcessusOpen(true);

//       loadFeexPayScript()
//         .then(() => {
//           setTimeout(() => {
//             if (window.FeexPayButton) {
//               initializeFeexPay(updatedPaymentData);
//             }
//           }, 500);
//         })
//         .catch((error) => {
//           console.error("Erreur chargement FeexPay:", error);
//           toast.error("Erreur lors du chargement du système de paiement");
//         });
//     } catch (error) {
//       console.error("Erreur inattendue:", error);
//       toast.error("Une erreur inattendue est survenue");
//     } finally {
//       setCalculatingAmount(false);
//     }
//   };

//   // ==================== FONCTIONS DE PAIEMENT ====================

//   const handlePaymentResponseManually = async (response) => {
//     console.log("Traitement manuel du paiement:", response);
//     setPaymentLoading(true);
//     setPaymentError("");
//     setPaymentSuccess("");

//     try {
//       if (response.status === "success" || response.status === "successful") {
//         const subscriptionData = prepareSubscriptionData(response);
//         console.log("Envoi immédiat des données...");
//         const result = await sendSubscriptionData(subscriptionData);

//         if (result.success) {
//           setPaymentSuccess(`
//             Paiement confirmé ! 
//             Abonnement ${selectedFormule} activé.
//             ID Transaction: ${response.transaction_id}
//           `);

//           setForcedPaymentMode(false);
//           setFromWelcomeModal(false);

//           await refreshUserData();

//           setTimeout(() => {
//             setStep4ProcessusOpen(false);
//             resetSubscriptionProcess();
//           }, 5000);
//         } else {
//           throw new Error("Échec de l'enregistrement après paiement réussi");
//         }
//       } else if (response.status === "pending") {
//         setPaymentSuccess(`
//           Paiement en attente de confirmation...
//           Votre abonnement sera activé dès confirmation.
//         `);

//         const pendingData = prepareSubscriptionData(response);
//         localStorage.setItem(
//           "pending_subscription",
//           JSON.stringify(pendingData)
//         );
//       } else {
//         throw new Error(response.message || "Paiement échoué");
//       }
//     } catch (error) {
//       console.error("Erreur traitement paiement:", error);
//       setPaymentError(`
//         Erreur: ${error.message}
//         Contactez le support avec l'ID: ${response.transaction_id}
//       `);
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   const initializeFeexPay = (paymentData) => {
//     if (!window.FeexPayButton) {
//       console.error("FeexPay non chargé");
//       return;
//     }

//     const customId = `CMD_${Date.now()}_${Math.random()
//       .toString(36)
//       .substr(2, 9)}`;

//     const feexPayConfig = {
//       ...FEEXPAY_CONFIG,
//       amount: paymentData.montant_payer,
//       custom_id: customId,
//       description: `Abonnement ${selectedFormule} - INAWO`,
//       callback: async (response) => {
//         console.log("Réponse FeexPay (frontend):", response);
//         await handlePaymentResponseManually(response);
//       },
//     };

//     try {
//       window.FeexPayButton.init("feexpay-payment-btn", feexPayConfig);
//     } catch (error) {
//       console.error("Erreur initialisation FeexPay:", error);
//       setPaymentError("Erreur lors de l'initialisation du paiement");
//     }
//   };

//   const loadFeexPayScript = () => {
//     return new Promise((resolve, reject) => {
//       if (window.FeexPayButton) {
//         setFeexPayLoaded(true);
//         resolve();
//         return;
//       }

//       const existingScript = document.getElementById("feexpay-script");
//       if (existingScript) existingScript.remove();

//       const script = document.createElement("script");
//       script.id = "feexpay-script";
//       script.src = "https://cdn.feexpay.com/js/v1/feexpay-button.js";
//       script.async = true;

//       script.onload = () => {
//         setFeexPayLoaded(true);
//         resolve();
//       };

//       script.onerror = () => {
//         setPaymentError("Erreur lors du chargement du système de paiement");
//         reject(new Error("Failed to load FeexPay script"));
//       };

//       document.head.appendChild(script);
//     });
//   };

//   // ==================== FONCTIONS UTILITAIRES ====================

//   const formatMontant = (montant) => {
//     return new Intl.NumberFormat("fr-FR", {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(montant);
//   };

//   const formatCategorieName = (categorie) => {
//     if (!categorie) return "N/A";
//     const categorieValue =
//       typeof categorie === "object"
//         ? categorie.value || categorie.label || ""
//         : String(categorie);
//     switch (categorieValue.toUpperCase()) {
//       case "ESSENTIEL":
//         return "Essentiel";
//       case "BUSINESS":
//         return "Business";
//       case "PROFESSIONNEL":
//         return "Professionnel";
//       default:
//         return categorieValue;
//     }
//   };

//   const getCategorieBadgeColor = (categorie) => {
//     const categorieValue =
//       typeof categorie === "object"
//         ? categorie.value || categorie.label || ""
//         : String(categorie);
//     if (!categorieValue) return "secondary";
//     switch (categorieValue.toUpperCase()) {
//       case "ESSENTIEL":
//         return "primary";
//       case "BUSINESS":
//         return "success";
//       case "PROFESSIONNEL":
//         return "warning";
//       default:
//         return "secondary";
//     }
//   };

//   // FONCTION MODIFIÉE : Garde TOUTES les catégories (y compris Essentiel) mais toutes sont payantes
//   const getAvailableCategories = () => {
//     if (!selectedFormule || !tarifsModules.length) return [];
//     const moduleName =
//       selectedFormule === "Ventes"
//         ? "InawoSales"
//         : selectedFormule === "Stock"
//         ? "InawoStock"
//         : "Inawo Global";
    
//     // Inclure TOUTES les catégories, y compris Essentiel
//     const categories = tarifsModules
//       .filter((item) => item.module_nom === moduleName)
//       .map((item) => item.categorie_nom);
    
//     return [...new Set(categories)];
//   };

//   const getCategorieOptions = () => {
//     const categories = getAvailableCategories();
//     const options = [
//       { value: "", label: "Choisir une catégorie", disabled: true },
//     ];
//     categories.forEach((categorie) => {
//       options.push({
//         value: categorie,
//         label: formatCategorieName(categorie),
//       });
//     });
//     return options;
//   };

//   // FONCTION MODIFIÉE : Retourne toujours false pour désactiver les abonnements gratuits
//   const isCategorieGratuite = (formule, categorie) => {
//     // TOUTES les catégories sont maintenant payantes, y compris Essentiel
//     return false;
//   };

//   const calculateTarif = (periode, formule, categorie) => {
//     // Plus de vérification de gratuité - tous les abonnements sont payants
//     if (!formule || !categorie || !tarifsModules.length) return 0;

//     const moduleName =
//       formule === "Ventes"
//         ? "InawoSales"
//         : formule === "Stock"
//         ? "InawoStock"
//         : "Inawo Global";
//     const categorieValue =
//       typeof categorie === "object"
//         ? categorie.value || categorie.label || ""
//         : String(categorie);

//     const tarifItem = tarifsModules.find(
//       (item) =>
//         item.module_nom === moduleName &&
//         item.categorie_nom.toUpperCase() === categorieValue.toUpperCase()
//     );

//     if (!tarifItem) return 0;

//     switch (periode) {
//       case "Mensuel":
//         return parseFloat(tarifItem.prix_cfa_mensuel || 0);
//       case "Trimestriel":
//         return parseFloat(tarifItem.prix_cfa_trimestre || 0);
//       case "Semestriel":
//         return parseFloat(tarifItem.prix_cfa_semestre || 0);
//       case "Annuel":
//         return parseFloat(tarifItem.prix_cfa_annuel || 0);
//       case "BiAnnuel":
//         return parseFloat(tarifItem.prix_cfa_biannuel || 0);
//       default:
//         return 0;
//     }
//   };

//   // Fonction pour convertir la période au format API
//   const getPeriodiciteFormat = (periode) => {
//     switch (periode) {
//       case "Mensuel":
//         return "mensuel";
//       case "Trimestriel":
//         return "trimestriel";
//       case "Semestriel":
//         return "semestriel";
//       case "Annuel":
//         return "annuel";
//       case "BiAnnuel":
//         return "biannuel";
//       default:
//         return "mensuel";
//     }
//   };

//   // Fonction pour convertir la méthode de paiement
//   const getMethodePaiementFormat = (methode) => {
//     switch (methode) {
//       case "mobile_money":
//         return "mobile_money";
//       case "carte_bancaire":
//         return "carte_bancaire";
//       case "feexpay":
//         return "feexpay";
//       default:
//         return "feexpay";
//     }
//   };

//   const sendSubscriptionData = async (subscriptionData) => {
//     try {
//       console.log("Envoi des données d'abonnement:", subscriptionData);
      
//       // Utiliser le nouvel endpoint pour l'abonnement
//       const response = await axiosInstance.post(
//         "abonnements/abonnement_user/",
//         subscriptionData
//       );
      
//       console.log("Réponse du backend:", response.data);

//       if (response.data.success || response.data.id) {
//         return {
//           success: true,
//           data: response.data,
//           message: "Abonnement enregistré avec succès",
//         };
//       } else {
//         throw new Error(
//           response.data.message || "Erreur lors de l'enregistrement"
//         );
//       }
//     } catch (error) {
//       console.error("Erreur détaillée:", error.response?.data || error.message);
//       return {
//         success: false,
//         error: error.response?.data || error.message,
//         message:
//           error.response?.data?.message || "Erreur lors de l'envoi des données",
//       };
//     }
//   };

//   const prepareSubscriptionData = (paymentResponse = null) => {
//     const getModuleId = (formule) => {
//       switch (formule) {
//         case "Ventes":
//           return 1;
//         case "Stock":
//           return 2;
//         case "Global":
//           return 3;
//         default:
//           return 3;
//       }
//     };

//     const getCategorieId = (categorie) => {
//       const categorieValue =
//         typeof categorie === "object"
//           ? categorie.value || categorie.label || ""
//           : String(categorie);
//       switch (categorieValue.toUpperCase()) {
//         case "ESSENTIEL":
//           return 1;
//         case "BUSINESS":
//           return 2;
//         case "PROFESSIONNEL":
//           return 3;
//         default:
//           return 1;
//       }
//     };

//     let etatPaiement = "succes";
//     let transactionId = "";
//     let methodePaiement = "";

//     if (paymentResponse) {
//       if (
//         paymentResponse.status === "success" ||
//         paymentResponse.status === "successful"
//       ) {
//         etatPaiement = "succes";
//       } else if (
//         paymentResponse.status === "failed" ||
//         paymentResponse.status === "error"
//       ) {
//         etatPaiement = "echec";
//       }

//       transactionId =
//         paymentResponse.transaction_id ||
//         paymentResponse.custom_id ||
//         `TXN_${Date.now()}`;
//       methodePaiement =
//         paymentResponse.payment_method || 
//         paymentResponse.method || 
//         getMethodePaiementFormat("feexpay");
//     }

//     // Préparer les données selon le nouveau format JSON
//     const subscriptionData = {
//       module: getModuleId(selectedFormule),
//       categorie: getCategorieId(selectedCategorie),
//       periodicite: getPeriodiciteFormat(selectedPeriode),
//       tarif_module: paymentData.tarif_module,
//       montant_payer: paymentData.montant_payer,
//       reduction_appliquee: paymentData.reduction_appliquee || 0,
//       methode_paiement: methodePaiement,
//       transaction_id: transactionId,
//       etat: etatPaiement,
//       code_parrain: paymentData.code_parrain || "",
//       code_affilie: paymentData.code_affilie || ""
//     };

//     console.log("Données préparées pour l'API (nouveau format):", subscriptionData);
//     return subscriptionData;
//   };

//   const refreshUserData = async () => {
//     try {
//       if (userProfile?.id) {
//         const response = await axiosInstance.get(
//           `abonnements/abonnementuser/${userProfile.id}/`
//         );
//         setUserAbonnements(response.data);
//       }
//     } catch (error) {
//       console.error("Erreur rechargement abonnements:", error);
//     }
//   };

//   const checkPendingSubscriptions = async () => {
//     const pending = localStorage.getItem("pending_subscription");
//     if (pending) {
//       try {
//         const pendingData = JSON.parse(pending);
//         const result = await sendSubscriptionData(pendingData);
//         if (result.success) {
//           localStorage.removeItem("pending_subscription");
//           console.log("Abonnement en attente confirmé");
//         }
//       } catch (error) {
//         console.error("Erreur confirmation abonnement en attente:", error);
//       }
//     }
//   };

//   useEffect(() => {
//     checkPendingSubscriptions();
//   }, []);

//   // ==================== GESTION DU PROCESSUS ====================

//   const startSubscriptionProcess = () => {
//     setSelectedFormule("");
//     setSelectedCategorie("");
//     setSelectedPeriode("");
//     setPromoCode("");
//     setPromoCodeInput("");
//     setPromoCodeVerified(false);
//     setPromoCodeDiscount(0);
//     setPaymentData({
//       module: 1,
//       categorie: 2,
//       periodicite: "mensuel",
//       tarif_module: 0,
//       montant_payer: 0,
//       reduction_appliquee: 0,
//       methode_paiement: "",
//       transaction_id: "",
//       etat: "succes",
//       code_parrain: "",
//       code_affilie: ""
//     });
//     setStep1FormuleCategorieOpen(true);
//   };

//   // FONCTION MODIFIÉE : Plus de traitement spécial pour les abonnements gratuits
//   const handleContinueToStep2 = () => {
//     const categorieValue =
//       typeof selectedCategorie === "object"
//         ? selectedCategorie.value || selectedCategorie.label || ""
//         : String(selectedCategorie);
//     if (!selectedFormule || !categorieValue) {
//       alert("Veuillez sélectionner une formule et une catégorie");
//       return;
//     }

//     // TOUS les abonnements passent par le processus de paiement normal
//     // Y compris la catégorie Essentiel qui est maintenant payante
//     setStep1FormuleCategorieOpen(false);
//     setStep2PeriodeOpen(true);
//   };

//   const handlePeriodeClick = async (periode) => {
//     setSelectedPeriode(periode);
//     const tarif = calculateTarif(periode, selectedFormule, selectedCategorie);
//     const montantPayer = tarif;

//     setPaymentData((prev) => ({
//       ...prev,
//       tarif_module: tarif,
//       montant_payer: montantPayer,
//       periodicite: getPeriodiciteFormat(periode),
//     }));

//     setStep2PeriodeOpen(false);
//     setStep3PromoOpen(true);

//     console.log("📊 Données de paiement préparées:", {
//       formule: selectedFormule,
//       categorie: selectedCategorie,
//       periode: periode,
//       periodicite: getPeriodiciteFormat(periode),
//       tarif: tarif,
//       fromWelcomeModal: fromWelcomeModal,
//     });
//   };

//   const resetSubscriptionProcess = () => {
//     setSelectedFormule("");
//     setSelectedCategorie("");
//     setSelectedPeriode("");
//     setPromoCode("");
//     setPromoCodeInput("");
//     setPromoCodeVerified(false);
//     setPromoCodeDiscount(0);
//     setPaymentData({
//       module: 1,
//       categorie: 2,
//       periodicite: "mensuel",
//       tarif_module: 0,
//       montant_payer: 0,
//       reduction_appliquee: 0,
//       methode_paiement: "",
//       transaction_id: "",
//       etat: "succes",
//       code_parrain: "",
//       code_affilie: ""
//     });
//   };

//   // ==================== FONCTIONS UI ====================

//   const toggleStep1 = () => {
//     if (!forcedPaymentMode)
//       setStep1FormuleCategorieOpen(!step1FormuleCategorieOpen);
//   };
//   const toggleStep2 = () => {
//     if (!forcedPaymentMode) setStep2PeriodeOpen(!step2PeriodeOpen);
//   };
//   const toggleStep3 = () => {
//     if (!forcedPaymentMode) setStep3PromoOpen(!step3PromoOpen);
//   };
//   const toggleStep4 = () => {
//     if (!forcedPaymentMode) setStep4ProcessusOpen(!step4ProcessusOpen);
//   };
//   const toggleSuccessToast = () => setShowSuccessToast(!showSuccessToast);

//   const getAbonnementStatus = () => {
//     if (!userAbonnements || userAbonnements.length === 0)
//       return "no_abonnement";
//     const latestAbonnement = userAbonnements[0];
//     const { statut, date_fin } = latestAbonnement;
//     if (date_fin) {
//       const today = new Date();
//       const endDate = new Date(date_fin);
//       if (endDate < today) return "expired";
//     }
//     return statut === "actif" ? "active" : "inactive";
//   };

//   const getButtonText = () => {
//     const status = getAbonnementStatus();
//     switch (status) {
//       case "active":
//         return "Se réabonner";
//       case "inactive":
//       case "expired":
//       case "no_abonnement":
//         return "S'abonner";
//       default:
//         return "S'abonner";
//     }
//   };

//   const getButtonColor = () => {
//     const status = getAbonnementStatus();
//     switch (status) {
//       case "active":
//         return "info";
//       case "inactive":
//       case "expired":
//       case "no_abonnement":
//         return "success";
//       default:
//         return "success";
//     }
//   };

//   const formatModuleName = (module) => {
//     if (!module) return "N/A";
//     switch (module.nom) {
//       case "Inawo Global":
//         return "Global";
//       case "InawoSales":
//         return "Ventes";
//       case "InawoStock":
//         return "Stock";
//       default:
//         return module.nom;
//     }
//   };

//   const getPeriodeDisplay = (periode) => {
//     const tarif = calculateTarif(periode, selectedFormule, selectedCategorie);
//     return {
//       prixNormal: tarif,
//       displayReduction: promoCodeVerified ? `-${promoCodeDiscount}%` : "",
//     };
//   };

//   const getPeriodeStyle = (name) => {
//     const base = {
//       padding: "1rem",
//       borderRadius: "70px",
//       fontSize: "1.0rem",
//       border: "1px solid #014a92",
//       textAlign: "center",
//       cursor: "pointer",
//       transition: "all 0.3s ease-in-out",
//       marginBottom: "0.5rem",
//       height: "90px",
//     };
//     const isHovered = hoveredPeriode === name;
//     return {
//       ...base,
//       backgroundColor: isHovered ? "#014a92" : "transparent",
//       color: isHovered ? "white" : "#014a92",
//     };
//   };

//   const getDureeTextStyle = (name) => {
//     const isHovered = hoveredPeriode === name;
//     const isSelected = selectedPeriode === name;
//     return {
//       fontSize: "0.7rem",
//       color: isHovered || isSelected ? "rgba(255,255,255,0.9)" : "#6c757d",
//       marginTop: "0.25rem",
//     };
//   };

//   const getPriceStyle = (name) => {
//     const isHovered = hoveredPeriode === name;
//     const isSelected = selectedPeriode === name;
//     return {
//       fontSize: "0.8rem",
//       fontWeight: "bold",
//       color: isHovered || isSelected ? "white" : "#014a92",
//       marginTop: "0.25rem",
//     };
//   };

//   const handleDownloadPDF = () => {
//     // Logique pour télécharger le PDF
//   };

//   if (showPricing) {
//     return <Pricing onBack={() => setShowPricing(false)} />;
//   }

//   document.title = "Abonnement | INAWO - Suite de Gestion";

//   return (
//     <React.Fragment>
//       {forcedPaymentMode && <ForcedPaymentOverlay />}
//       <div
//         className="main-content"
//         style={{
//           margin: "0",
//           filter: forcedPaymentMode ? "blur(3px)" : "none",
//           pointerEvents: forcedPaymentMode ? "none" : "auto",
//         }}
//       >
//         <div className="page-content">
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-12">
//                 <div className="page-title-box d-sm-flex align-items-center justify-content-between">
//                   <h4 className="mb-sm-0 fw-100">Abonnement</h4>
//                   <div className="page-title-right">
//                     <ol className="breadcrumb m-0">
//                       <li className="breadcrumb-item">
//                         <a
//                           href="#"
//                           className="text-decoration-none d-flex fs-6"
//                         >
//                           <span className="ms-2 me-2">
//                             <i className="ri-secure-payment-fill"></i>
//                           </span>
//                           <span className="ms-1 me-1">&gt;</span>
//                           <span className="ms-1 me-1">Inawo</span>
//                           <span className="ms-1 me-1">&gt;</span>
//                           <span className="ms-1 me-1">Tableau de bord</span>
//                           <span className="ms-1 me-1">&gt;</span>
//                         </a>
//                       </li>
//                       <li className="breadcrumb-item active">Abonnement</li>
//                     </ol>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-lg-12">
//                 <div className="card" style={{ borderRadius: "70px" }}>
//                   <div
//                     className="card-header"
//                     style={{
//                       borderRadius: "70px 70px 70px 70px",
//                       borderBottom: "none",
//                       padding: "1rem 1.5rem",
//                     }}
//                   >
//                     <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
//                       <div
//                         className="flex-grow-1"
//                         style={{ maxWidth: "300px" }}
//                       >
//                         <div className="search-box position-relative">
//                           <input
//                             type="text"
//                             className="form-control search"
//                             placeholder="Chercher un abonnement . . ."
//                             style={{
//                               borderRadius: "50px",
//                               paddingLeft: "40px",
//                               width: "100%",
//                             }}
//                           />
//                           <i
//                             className="ri-search-line search-icon position-absolute"
//                             style={{
//                               left: "15px",
//                               top: "50%",
//                               transform: "translateY(-50%)",
//                             }}
//                           ></i>
//                         </div>
//                       </div>

//                       <div className="d-flex gap-2 flex-wrap justify-content-end">
//                         <button
//                           className="btn btn-primary d-flex align-items-center"
//                           style={{ borderRadius: "50px", whiteSpace: "nowrap" }}
//                           onClick={() => setShowPricing(true)}
//                         >
//                           <i className="ri-exchange-line me-1"></i>Changer
//                           formule
//                         </button>

//                         <button
//                           className={`btn btn-${getButtonColor()} d-flex align-items-center`}
//                           style={{ borderRadius: "50px", whiteSpace: "nowrap" }}
//                           onClick={startSubscriptionProcess}
//                         >
//                           <i className="ri-file-add-line me-1"></i>
//                           {getButtonText()}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="">
//                 <div
//                   className="card"
//                   id="contactList"
//                   style={{ borderRadius: "20px" }}
//                 >
//                   <div>
//                     {loadingAbonnements ? (
//                       <div className="text-center p-4">
//                         <div
//                           className="spinner-border text-primary"
//                           role="status"
//                         >
//                           <span className="visually-hidden">Chargement...</span>
//                         </div>
//                         <p className="mt-2">Chargement de vos abonnements...</p>
//                       </div>
//                     ) : errorAbonnements ? (
//                       <EmptyDataCard
//                         title="Aucun abonnement récupérer"
//                         description="Vérifier la connexion internet"
//                       />
//                     ) : userAbonnements.length > 0 ? (
//                       <div className="table-responsive">
//                         <table className="table table-hover table-nowrap mb-0">
//                           <thead>
//                             <tr>
//                               <th>#</th>
//                               <th>Formule</th>
//                               <th>Catégorie</th>
//                               <th>Prix</th>
//                               <th>Date début</th>
//                               <th>Date fin</th>
//                               <th>Statut</th>
//                               <th>Action</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {userAbonnements
//                               .sort(
//                                 (a, b) =>
//                                   new Date(b.date_debut) -
//                                   new Date(a.date_debut)
//                               )
//                               .map((abonnement, index) => (
//                                 <tr key={abonnement.id}>
//                                   <td>{userAbonnements.length - index}</td>
//                                   <td>
//                                     <span>
//                                       {formatModuleName(abonnement.module)}
//                                     </span>
//                                   </td>
//                                   <td>
//                                     <span
//                                       className={`badge rounded-pill bg-${getCategorieBadgeColor(
//                                         abonnement.categorie
//                                       )}`}
//                                     >
//                                       {formatCategorieName(
//                                         abonnement.categorie
//                                       )}
//                                     </span>
//                                   </td>
//                                   <td>
//                                     {abonnement.montant_payer?.toLocaleString(
//                                       "fr-FR"
//                                     ) || "0"}{" "}
//                                     
//                                   </td>
//                                   <td>{abonnement.date_debut}</td>
//                                   <td>{abonnement.date_fin}</td>
//                                   <td>
//                                     <span
//                                       className={`badge badge-sm rounded-pill bg-${
//                                         abonnement.statut === "actif"
//                                           ? "success"
//                                           : "secondary"
//                                       }`}
//                                     >
//                                       {abonnement.statut === "actif"
//                                         ? "Actif"
//                                         : "Inactif"}
//                                     </span>
//                                   </td>
//                                   <td>
//                                     <Link
//                                       to="#"
//                                       className="text-info p-2"
//                                       onClick={() =>
//                                         handleDownloadPDF(abonnement)
//                                       }
//                                     >
//                                       <i className="ri-download-2-fill fs-16"></i>
//                                     </Link>
//                                   </td>
//                                 </tr>
//                               ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     ) : (
//                       <div className="text-center p-4">
//                         <i className="ri-subtract-line display-5 text-muted"></i>
//                         <h5 className="mt-3">Aucun abonnement trouvé</h5>
//                         <p className="text-muted">
//                           Vous n'avez pas encore souscrit à un abonnement.
//                         </p>
//                         <Button
//                           color="primary"
//                           onClick={startSubscriptionProcess}
//                           style={{ borderRadius: "70px" }}
//                         >
//                           <i className="ri-file-add-line me-1"></i>S'abonner
//                           maintenant
//                         </Button>
//                       </div>
//                     )}
//                   </div>

//                   {/* MODALS */}

//                   {/* ÉTAPE 1 - Modal Formule et Catégorie */}
//                   <Modal
//                     isOpen={step1FormuleCategorieOpen}
//                     toggle={toggleStep1}
//                     centered
//                     modalClassName="border-0"
//                     contentClassName="rounded-4"
//                   >
//                     <ModalHeader
//                       toggle={toggleStep1}
//                       className="bg-info-subtle p-3 rounded-top-4"
//                     >
//                       <i className="ri-settings-3-line me-2"></i>Formules
//                     </ModalHeader>
//                     <ModalBody>
//                       {loadingTarifs ? (
//                         <div className="text-center p-4">
//                           <div
//                             className="spinner-border text-primary"
//                             role="status"
//                           >
//                             <span className="visually-hidden">
//                               Chargement...
//                             </span>
//                           </div>
//                           <p className="mt-2">
//                             Chargement des formules disponibles...
//                           </p>
//                         </div>
//                       ) : errorTarifs ? (
//                         <Alert color="danger">{errorTarifs}</Alert>
//                       ) : (
//                         <div className="d-flex flex-column">
//                           <div className="mb-3">
//                             <Label className="form-label fw-bold">
//                               <i className="ri-box-3-line me-2 text-primary"></i>
//                               Sélectionnez une formule
//                             </Label>
//                             <CustomSelect
//                               options={formuleOptions}
//                               value={
//                                 formuleOptions.find(
//                                   (opt) => opt.value === selectedFormule
//                                 ) || null
//                               }
//                               onChange={(selectedOption) => {
//                                 const value = selectedOption
//                                   ? selectedOption.value
//                                   : "";
//                                 setSelectedFormule(value);
//                               }}
//                               placeholder="Choisir une formule"
//                             />
//                           </div>

//                           <div className="mb-3">
//                             <Label className="form-label fw-bold">
//                               <i className="ri-star-line me-2 text-warning"></i>
//                               Sélectionnez une catégorie
//                             </Label>
//                             <CustomSelect
//                               options={getCategorieOptions(selectedCategorie)}
//                               value={
//                                 getCategorieOptions().find(
//                                   (opt) => opt.value === selectedCategorie
//                                 ) || null
//                               }
//                               onChange={(selectedOption) => {
//                                 const value = selectedOption
//                                   ? selectedOption.value
//                                   : "";
//                                 setSelectedCategorie(value);
//                               }}
//                               placeholder="Choisir une catégorie"
//                               disabled={!selectedFormule}
//                             />
//                           </div>
//                         </div>
//                       )}
//                     </ModalBody>
//                     <ModalFooter>
//                       <Button
//                         color="secondary"
//                         style={{ borderRadius: "70px" }}
//                         onClick={toggleStep1}
//                       >
//                         Annuler
//                       </Button>
//                       <Button
//                         color="primary"
//                         style={{ borderRadius: "70px" }}
//                         onClick={handleContinueToStep2}
//                         disabled={
//                           !selectedFormule ||
//                           !selectedCategorie ||
//                           loadingTarifs
//                         }
//                       >
//                         <i className="ri-arrow-right-line me-1"></i>
//                         Continuer
//                       </Button>
//                     </ModalFooter>
//                   </Modal>

//                   {/* ÉTAPE 2 - Modal Période */}
//                   <Modal
//                     isOpen={step2PeriodeOpen}
//                     toggle={forcedPaymentMode ? undefined : toggleStep2}
//                     centered
//                     modalClassName="border-0"
//                     contentClassName="rounded-4"
//                     style={{ maxWidth: "500px" }}
//                     backdrop={forcedPaymentMode ? "static" : true}
//                     keyboard={!forcedPaymentMode}
//                   >
//                     <ModalHeader
//                       toggle={forcedPaymentMode ? undefined : toggleStep2}
//                       className="bg-info-subtle p-3 rounded-top-4"
//                     >
//                       <div className="d-flex align-items-center">
//                         <i className="ri-calendar-line me-2"></i>
//                         <span>Période d'abonnement</span>
//                       </div>
//                     </ModalHeader>
//                     <ModalBody className="text-center">
//                       <div className="mb-4">
//                         <p className="text-muted">
//                           <strong>Formule sélectionnée :</strong>{" "}
//                           {selectedFormule} -{" "}
//                           {formatCategorieName(selectedCategorie)}
//                         </p>
//                       </div>
//                       <div className="d-flex flex-column gap-2">
//                         {periodeOptions.map((periode) => {
//                           const { prixNormal, displayReduction } =
//                             getPeriodeDisplay(periode);
//                           return (
//                             <div
//                               key={periode}
//                               style={getPeriodeStyle(periode)}
//                               onClick={() => handlePeriodeClick(periode)}
//                               onMouseEnter={() => setHoveredPeriode(periode)}
//                               onMouseLeave={() => setHoveredPeriode(null)}
//                             >
//                               <div
//                                 style={{
//                                   fontSize: "1.0rem",
//                                   fontWeight: "bold",
//                                 }}
//                               >
//                                 {periode}
//                               </div>
//                               <div style={getPriceStyle(periode)}>
//                                 {formatMontant(prixNormal)} 
//                               </div>
//                               <div style={getDureeTextStyle(periode)}>
//                                 {periode === "Mensuel"
//                                   ? "1 mois"
//                                   : periode === "Trimestriel"
//                                   ? "3 mois"
//                                   : periode === "Semestriel"
//                                   ? "6 mois"
//                                   : periode === "Annuel"
//                                   ? "1 an"
//                                   : "2 ans"}
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </ModalBody>
//                     <ModalFooter className="justify-content-center">
//                       <Button
//                         color="secondary"
//                         style={{ borderRadius: "70px" }}
//                         onClick={() => {
//                           setStep2PeriodeOpen(false);
//                           setStep1FormuleCategorieOpen(true);
//                         }}
//                       >
//                         <i className="ri-arrow-left-line me-1"></i>Retour
//                       </Button>
//                     </ModalFooter>
//                   </Modal>

//                   {/* ÉTAPE 3 - Modal Code Promo */}
//                   <Modal
//                     isOpen={step3PromoOpen}
//                     toggle={forcedPaymentMode ? undefined : toggleStep3}
//                     centered
//                     modalClassName="border-0"
//                     contentClassName="rounded-4"
//                     backdrop={forcedPaymentMode ? "static" : true}
//                     keyboard={!forcedPaymentMode}
//                   >
//                     <ModalHeader
//                       toggle={forcedPaymentMode ? undefined : toggleStep3}
//                       className="bg-info-subtle p-3 rounded-top-4"
//                     >
//                       <i className="ri-coupon-line me-2"></i>Code Promo
//                     </ModalHeader>
//                     <ModalBody>
//                       <div className="mb-3">
//                         <p className="text-muted">
//                           <strong>Sélection :</strong> {selectedFormule} -{" "}
//                           {formatCategorieName(selectedCategorie)} -{" "}
//                           {selectedPeriode}
//                         </p>
//                         <p className="text-muted">
//                           <strong>Prix :</strong>{" "}
//                           {formatMontant(paymentData.tarif_module)} 
//                         </p>
//                       </div>

//                       <div className="mb-3">
//                         <Label className="form-label fw-bold">
//                           Type de code promo
//                         </Label>
//                         <CustomSelect
//                           options={promoCodeOptions}
//                           value={promoCode}
//                           onChange={setPromoCode}
//                           placeholder="Code Promo"
//                         />
//                       </div>

//                       {promoCode && (
//                         <div className="mb-1">
//                           <Label className="form-label fw-bold">
//                             Votre code{" "}
//                             {promoCode === "affiliation"
//                               ? "d'affiliation"
//                               : "de parrainage"}
//                           </Label>
//                           <Input
//                             type="text"
//                             placeholder={`Entrez votre code ${
//                               promoCode === "affiliation"
//                                 ? "d'affiliation"
//                                 : "de parrainage"
//                             }`}
//                             value={promoCodeInput}
//                             onChange={(e) => setPromoCodeInput(e.target.value)}
//                             style={{
//                               borderRadius: "70px",
//                               height: "45px",
//                               paddingLeft: "20px",
//                             }}
//                           />
//                         </div>
//                       )}

//                       {promoCodeVerified && (
//                         <Alert color="success" className="mt-3">
//                           <i className="ri-check-line me-2"></i>Code vérifié !
//                           Réduction de {promoCodeDiscount}% appliquée.
//                         </Alert>
//                       )}
//                     </ModalBody>
//                     <ModalFooter>
//                       <Button
//                         color="secondary"
//                         style={{ borderRadius: "70px" }}
//                         onClick={() => {
//                           setStep3PromoOpen(false);
//                           setStep2PeriodeOpen(true);
//                         }}
//                       >
//                         <i className="ri-arrow-left-line me-1"></i>Retour
//                       </Button>
//                       <Button
//                         color="primary"
//                         style={{ borderRadius: "70px" }}
//                         onClick={handleContinueFromPromo}
//                         disabled={calculatingAmount}
//                       >
//                         {calculatingAmount ? (
//                           <>
//                             <div
//                               className="spinner-border spinner-border-sm me-2"
//                               role="status"
//                             >
//                               <span className="visually-hidden">Calcul...</span>
//                             </div>
//                             Calcul en cours...
//                           </>
//                         ) : (
//                           <>
//                             <i className="ri-arrow-right-line me-1"></i>
//                             Continuer
//                           </>
//                         )}
//                       </Button>
//                     </ModalFooter>
//                   </Modal>

//                   {/* ÉTAPE 4 - Modal Récapitulatif et Paiement */}
//                   <Modal
//                     isOpen={step4ProcessusOpen}
//                     toggle={forcedPaymentMode ? undefined : toggleStep4}
//                     centered
//                     modalClassName="border-0"
//                     contentClassName="rounded-4"
//                     backdrop={forcedPaymentMode ? "static" : true}
//                     keyboard={!forcedPaymentMode}
//                   >
//                     <ModalHeader
//                       toggle={forcedPaymentMode ? undefined : toggleStep4}
//                       className="bg-info-subtle p-3 rounded-top-4"
//                     >
//                       <i className="ri-file-list-line me-2"></i>Récapitulatif de
//                       votre abonnement
//                     </ModalHeader>
//                     <ModalBody>
//                       <div className="p-3 rounded bg-light">
//                         <div className="row">
//                           <div className="col-md-6">
//                             <h6>
//                               <strong>Formule :</strong> {selectedFormule}
//                             </h6>
//                             <h6>
//                               <strong>Catégorie :</strong>{" "}
//                               {formatCategorieName(selectedCategorie)}
//                             </h6>
//                           </div>
//                           <div className="col-md-6">
//                             <h6>
//                               <strong>Période :</strong> {selectedPeriode}
//                             </h6>
//                             <h6>
//                               <strong>Durée :</strong>{" "}
//                               {selectedPeriode === "Mensuel"
//                                 ? "1 mois"
//                                 : selectedPeriode === "Trimestriel"
//                                 ? "3 mois"
//                                 : selectedPeriode === "Semestriel"
//                                 ? "6 mois"
//                                 : selectedPeriode === "Annuel"
//                                 ? "1 an"
//                                 : "2 ans"}
//                             </h6>
//                           </div>
//                         </div>

//                         <div className="mt-3">
//                           <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
//                             <span>Prix normal :</span>
//                             <span className="fw-bold">
//                               {formatMontant(paymentData.tarif_module)} 
//                             </span>
//                           </div>

//                           {promoCodeVerified && (
//                             <>
//                               <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mt-2">
//                                 <span>Réduction appliquée :</span>
//                                 <span className="text-success">
//                                   -{promoCodeDiscount}% (-
//                                   {formatMontant(
//                                     Math.round(
//                                       (paymentData.tarif_module *
//                                         promoCodeDiscount) /
//                                         100
//                                     )
//                                   )}{" "}
//                                   )
//                                 </span>
//                               </div>
//                             </>
//                           )}

//                           <div className="d-flex justify-content-between align-items-center mt-3">
//                             <h5 className="mb-0">Total à payer :</h5>
//                             <h4 className="mb-0 text-success fw-bold">
//                               {formatMontant(paymentData.montant_payer)} 
//                             </h4>
//                           </div>
//                         </div>

//                         {promoCodeVerified && (
//                           <div className="mt-3 p-2 bg-success-subtle rounded">
//                             <p className="mb-0">
//                               <strong>Code promo appliqué :</strong>{" "}
//                               <span className="badge bg-success text-white">
//                                 {promoCodeInput}
//                               </span>
//                               <span className="ms-2">
//                                 (
//                                 {promoCode === "affiliation"
//                                   ? "Code d'affiliation"
//                                   : "Code de parrainage"}
//                                 )
//                               </span>
//                             </p>
//                           </div>
//                         )}
//                       </div>

//                       <div className="mt-4">
//                         <div
//                           id="feexpay-payment-btn"
//                           style={{
//                             cursor: "pointer",
//                             color: "white",
//                             backgroundColor: "#007bff",
//                             padding: "12px 20px",
//                             borderRadius: "70px",
//                             textAlign: "center",
//                             marginTop: "20px",
//                             border: "none",
//                             transition: "all 0.3s ease",
//                             display: feexPayLoaded ? "block" : "none",
//                             width: "100%",
//                           }}
//                           onMouseEnter={(e) =>
//                             (e.target.style.backgroundColor = "#0056b3")
//                           }
//                           onMouseLeave={(e) =>
//                             (e.target.style.backgroundColor = "#007bff")
//                           }
//                         >
//                           <i className="ri-secure-payment-line me-2"></i>Payer{" "}
//                           {formatMontant(paymentData.montant_payer)} 
//                         </div>
//                         <div className="mt-3 text-center">
//                           <small className="text-muted">
//                             <i className="ri-shield-check-line me-1"></i>
//                             Paiement sécurisé via FeexPay
//                           </small>
//                         </div>
//                       </div>
//                     </ModalBody>
//                     <ModalFooter>
//                       <Button
//                         color="secondary"
//                         style={{ borderRadius: "70px" }}
//                         onClick={() => {
//                           setStep4ProcessusOpen(false);
//                           setStep3PromoOpen(true);
//                         }}
//                         disabled={paymentLoading}
//                       >
//                         <i className="ri-arrow-left-line me-1"></i>Retour
//                       </Button>
//                       <Button
//                         color="light"
//                         onClick={toggleStep4}
//                         style={{ borderRadius: "70px" }}
//                         disabled={paymentLoading}
//                       >
//                         Annuler
//                       </Button>
//                     </ModalFooter>
//                   </Modal>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div
//         style={{
//           position: "fixed",
//           top: "20px",
//           right: "20px",
//           zIndex: 9999,
//           minWidth: "300px",
//         }}
//       >
//         <Toast isOpen={showSuccessToast} fade>
//           <ToastHeader
//             icon="success"
//             toggle={toggleSuccessToast}
//             style={{
//               backgroundColor: "#d1edff",
//               color: "#0f5132",
//               borderBottom: "1px solid #0f5132",
//             }}
//           >
//             <i className="ri-checkbox-circle-fill text-success me-2"></i>Succès
//             !
//           </ToastHeader>
//           <ToastBody style={{ backgroundColor: "#d1edff" }}>
//             <div className="d-flex align-items-center">
//               <i className="ri-checkbox-circle-fill text-success me-2 fs-4"></i>
//               <div>
//                 <strong className="text-success">Abonnement activé</strong>
//                 <p className="mb-0 text-dark">{toastMessage}</p>
//               </div>
//             </div>
//           </ToastBody>
//         </Toast>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Souscription;