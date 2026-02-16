// import React, { useState } from "react";
// import { Col, Container, Row } from "reactstrap";
// import '../../../../assets/scss/pages/_abn.scss';

// const Abonnement = () => {
//   document.title = "Abonnement | Velzon - React Admin & Dashboard Template";

//   const [rightColumn, setRightColumn] = useState(true);
//   const toggleRightColumn = () => {
//     setRightColumn(!rightColumn);
//   };

//   return (
//     <React.Fragment>
//       <div className="page-content bg-light">
//         <Container fluid>
//           <Row>

//             <div
//               className="w-100 d-flex flex-column align-items-center justify-content-center"
//               style={{ zIndex: 1050, height: "77vh" }}
//               id="b_abn"
//               >
//               <div
//                 className="bg-white p-4 text-center rounded-1 d-flex align-items-center justify-content-center flex-column "
//                 id="abn" >
//                   <div
//                     className="d-flex align-items-center justify-content-center rounded-circle text-white"
//                       style={{ width: "80px", height: "80px", background:'#0ab39c07' }}>
//                         <div
//                           className="d-flex align-items-center p-4 justify-content-center rounded-circle text-white"
//                           style={{ width: "30px", height: "30px", background:'#0ab39c', fontWeight:'bold' }}>
//                           <i className="ri-check-line fs-1 "></i>
//                         </div>

//                   </div>

//                   <div
//                       className="d-flex p-2 mt-1  flex-column gap-2 bg-white w-100 rounded-3 align-items-center justify-content-center d-flex flex-column"     style={{}} >
//                         <h5 className="" style={{ color:'rgb(97, 96, 96)' }}>INAWO GLOBAL</h5>
//                         <h5 className="" style={{ marginTop:'-4%',color:'rgb(112, 111, 111)' }}>FORMULE : PREMIUM</h5>
//                         <p  className="text-secondary " style={{fontSize:"85%", fontWeight:'600'}}>Du 01/01/2023 au 31/12/2023</p>
//                           <a href="#" className="p-2 text-decoration-none text-center text-white mt-3 w-50 rounded-1" style={{ background: '#0ab39c'}}>Changer de formule</a>

//                 </div>
//               </div>
//             </div>
//           </Row>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// };

// export default Abonnement;

// {
//   /* <Row>
//             <Col>
//               <div className="h-100">
//                 <Section rightClickBtn={toggleRightColumn} />
//                 <Row>
//                   <Widget />
//                 </Row>
//                 <Row>
//                   <Col xl={8}>
//                     <Revenue />
//                   </Col>
//                   <SalesByLocations />
//                 </Row>
//                 <Row>
//                   <BestSellingProducts />
//                   <TopSellers />
//                 </Row>
//                 <Row>
//                   <StoreVisits />
//                   <RecentOrders />
//                 </Row>
//               </div>
//             </Col>
//             <RecentActivity
//               rightColumn={rightColumn}
//               hideRightColumn={toggleRightColumn}
//             />
//           </Row> */
// }

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Flatpickr from "react-flatpickr";

// Composant CustomSelect
const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`custom-select-container ${className}`}>
      <div
        className={`custom-select-trigger ${disabled ? "disabled" : ""}`}
        style={{
          padding: "12px 16px",
          border: "1px solid #dee2e6",
          borderRadius: "70px",
          backgroundColor: disabled ? "#f8f9fa" : "white",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.3s ease",
        }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span style={{ color: selectedOption ? "#000" : "#6c757d" }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <i
          className={`ri-arrow-down-s-line ${isOpen ? "rotate-180" : ""}`}
          style={{ transition: "transform 0.3s ease" }}
        ></i>
      </div>

      {isOpen && !disabled && (
        <div
          className="custom-select-options"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #dee2e6",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
            marginTop: "4px",
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              className="custom-select-option"
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                borderBottom:
                  index < options.length - 1 ? "1px solid #f8f9fa" : "none",
                backgroundColor:
                  value === option.value ? "#014a92" : "transparent",
                color: value === option.value ? "white" : "#000",
                transition: "all 0.2s ease",
              }}
              onClick={() => handleSelect(option.value)}
              onMouseEnter={(e) => {
                if (value !== option.value) {
                  e.target.style.backgroundColor = "#f8f9fa";
                }
              }}
              onMouseLeave={(e) => {
                if (value !== option.value) {
                  e.target.style.backgroundColor = "transparent";
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Configuration Axios
const axiosInstance = axios.create({
  baseURL: "https://inawoapiv3.inawo.pro/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const Souscription = () => {
  const { userProfile } = useProfile();
  const location = useLocation();

  // États pour les abonnements utilisateur
  const [userAbonnements, setUserAbonnements] = useState([]);
  const [loadingAbonnements, setLoadingAbonnements] = useState(false);
  const [errorAbonnements, setErrorAbonnements] = useState(null);

  // États existants
  const [activeTab, setActiveTab] = useState("1");
  const [step1FormuleCategorieOpen, setStep1FormuleCategorieOpen] =
    useState(false);
  const [step2PeriodeOpen, setStep2PeriodeOpen] = useState(false);
  const [step3PromoOpen, setStep3PromoOpen] = useState(false);
  const [step4ProcessusOpen, setStep4ProcessusOpen] = useState(false);
  const [selectedFormule, setSelectedFormule] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoCodeVerified, setPromoCodeVerified] = useState(false);
  const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
  const [hoveredPeriode, setHoveredPeriode] = useState(null);
  const [showPricing, setShowPricing] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [feexPayLoaded, setFeexPayLoaded] = useState(false);
  const [tarifsModules, setTarifsModules] = useState([]);
  const [loadingTarifs, setLoadingTarifs] = useState(false);
  const [errorTarifs, setErrorTarifs] = useState(null);
  const [paymentType, setPaymentType] = useState("");
  const [paymentProvider, setPaymentProvider] = useState("");

  // Options pour les CustomSelect
  const formuleOptions = [
    { value: "", label: "Choisir une formule", disabled: true },
    { value: "Ventes", label: "Ventes" },
    { value: "Stock", label: "Stock" },
    { value: "Global", label: "Global" },
  ];

  const promoCodeOptions = [
    { value: "", label: "Code Promo (Facultatif)", disabled: true },
    { value: "affiliation", label: "Code D'affiliation" },
    { value: "parrainage", label: "Code de parrainage" },
  ];

  const periodeOptions = ["Trimestriel", "Semestriel", "Annuel", "BiAnnuel"];

  // Charger les abonnements de l'utilisateur
  useEffect(() => {
    const fetchUserAbonnements = async () => {
      if (!userProfile?.id) return;

      setLoadingAbonnements(true);
      setErrorAbonnements(null);

      try {
        const response = await axiosInstance.get(
          `abonnements/abonnementuser/${userProfile.id}/`
        );
        console.log("Abonnements récupérés:", response.data);
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

  // Fonctions pour déterminer l'état de l'abonnement
  const getAbonnementStatus = () => {
    if (!userAbonnements || userAbonnements.length === 0) {
      return "no_abonnement";
    }

    const latestAbonnement = userAbonnements[0];
    const { statut, date_fin } = latestAbonnement;

    if (date_fin) {
      const today = new Date();
      const endDate = new Date(date_fin);

      if (endDate < today) {
        return "expired";
      }
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

  // Fonction pour formater le nom du module
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

  // Fonction pour formater le nom de la catégorie
  const formatCategorieName = (categorie) => {
    if (!categorie) return "N/A";

    switch (categorie.toUpperCase()) {
      case "ESSENTIEL":
        return "Essentiel";
      case "BUSINESS":
        return "Business";
      case "PROFESSIONNEL":
        return "Professionnel";
      default:
        return categorie;
    }
  };

  // Fonction pour obtenir la couleur du badge de catégorie
  const getCategorieBadgeColor = (categorie) => {
    if (!categorie) return "secondary";

    switch (categorie.toUpperCase()) {
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

  // Fonction pour obtenir les options de catégorie disponibles
  const getCategorieOptions = () => {
    const categories = getAvailableCategories();

    const options = [
      { value: "", label: "Choisir une catégorie", disabled: true },
    ];

    categories.forEach((categorie) => {
      options.push({
        value: categorie,
        label: categorie,
      });
    });

    return options;
  };

  // Reste du code existant avec modifications pour la réduction
  const [paymentData, setPaymentData] = useState({
    categorie: 1,
    module: 2,
    tarif_module: 0,
    montant_payer: 0,
    code_parrain: "",
    code_affilie: "",
    date_fin: "",
    methode_paiement: "",
    etat: "en_attente",
    transaction_id: "",
  });

  // MODIFICATION : Calcul du tarif SANS réduction automatique
  // const calculateTarif = (periode, formule, categorie) => {
  //   if (!formule || !categorie || !tarifsModules.length) return 0;

  //   const moduleName = formule === "Ventes" ? "InawoSales" : formule === "Stock" ? "InawoStock" : "Inawo Global";

  //   const tarifItem = tarifsModules.find(
  //     (item) =>
  //       item.module_nom === moduleName &&
  //       item.categorie_nom.toUpperCase() === categorie.toUpperCase()
  //   );

  //   if (!tarifItem) {
  //     console.log("Tarif non trouvé pour:", { moduleName, categorie, periode });
  //     return 0;
  //   }

  //   switch (periode) {
  //     case "Trimestriel":
  //       return parseFloat(tarifItem.prix_cfa_trimestre || 0);
  //     case "Semestriel":
  //       return parseFloat(tarifItem.prix_cfa_semestre || 0);
  //     case "Annuel":
  //       return parseFloat(tarifItem.prix_cfa_annuel || 0);
  //     case "BiAnnuel":
  //       return parseFloat(tarifItem.prix_cfa_biannuel || 0);
  //     default:
  //       return 0;
  //   }
  // };

  // MODIFICATION : Gestion de la période sans appliquer de réduction automatique
  // const handlePeriodeClick = async (periode) => {
  //   setSelectedPeriode(periode);

  //   const tarif = calculateTarif(periode, selectedFormule, selectedCategorie);

  //   // NE PAS appliquer la réduction de 15% automatiquement
  //   const montantPayer = tarif; // Prix plein sans réduction

  //   setPaymentData((prev) => ({
  //     ...prev,
  //     tarif_module: tarif,
  //     montant_payer: montantPayer,
  //     date_fin: calculateEndDate(periode),
  //   }));

  //   setStep2PeriodeOpen(false);
  //   setStep3PromoOpen(true);
  // };

  // MODIFICATION : Vérification du code promo avant application de la réduction
  // const handleContinueFromPromo = async () => {
  //   let finalAmount = paymentData.tarif_module; // Commencer avec le prix plein
  //   let codeParrain = "";
  //   let codeAffilie = "";

  //   // Si un code promo est saisi, le vérifier
  //   if (promoCode && promoCodeInput) {
  //     const { valid, discount } = await verifyPromoCode(promoCodeInput);

  //     if (valid) {
  //       setPromoCodeVerified(true);
  //       setPromoCodeDiscount(discount);

  //       // Appliquer la réduction seulement si le code est valide
  //       finalAmount = Math.round(paymentData.tarif_module * (1 - discount / 100));

  //       if (promoCode === "parrainage") {
  //         codeParrain = promoCodeInput;
  //       } else if (promoCode === "affiliation") {
  //         codeAffilie = promoCodeInput;
  //       }
  //     } else {
  //       alert("Code promo invalide ou expiré");
  //       return;
  //     }
  //   } else {
  //     // Aucun code promo, garder le prix plein
  //     setPromoCodeVerified(false);
  //     setPromoCodeDiscount(0);
  //   }

  //   const updatedPaymentData = {
  //     ...paymentData,
  //     montant_payer: finalAmount,
  //     code_parrain: codeParrain,
  //     code_affilie: codeAffilie,
  //   };
  //   setPaymentData(updatedPaymentData);

  //   setStep3PromoOpen(false);
  //   setStep4ProcessusOpen(true);

  //   loadFeexPayScript()
  //     .then(() => {
  //       setTimeout(() => {
  //         if (window.FeexPayButton) {
  //           initializeFeexPay(updatedPaymentData);
  //         }
  //       }, 500);
  //     })
  //     .catch((error) => {
  //       console.error("Erreur chargement FeexPay:", error);
  //     });
  // };

  // MODIFICATION : Affichage du prix dans l'étape 2 sans réduction
  const getPeriodeDisplay = (periode) => {
    const tarif = calculateTarif(periode, selectedFormule, selectedCategorie);

    return {
      prixNormal: tarif,
      // Pas de réduction automatique, seulement si code promo valide
      prixReduit: tarif,
      displayReduction: promoCodeVerified
        ? `-${promoCodeDiscount}%`
        : "Aucune réduction",
    };
  };

  // Les autres fonctions restent similaires mais avec CustomSelect
  // const getAvailableCategories = () => {
  //   if (!selectedFormule || !tarifsModules.length) return [];

  //   const moduleName = selectedFormule === "Ventes" ? "InawoSales" : selectedFormule === "Stock" ? "InawoStock" : "Inawo Global";

  //   const categories = tarifsModules
  //     .filter((item) => {
  //       if (moduleName === "Inawo Global") return item.module_nom === moduleName;
  //       return item.module_nom === moduleName && item.categorie_nom !== "ESSENTIEL";
  //     })
  //     .map((item) => item.categorie_nom);

  //   return [...new Set(categories)];
  // };

  // const calculateEndDate = (periode) => {
  //   const now = new Date();
  //   let endDate = new Date(now);

  //   switch (periode) {
  //     case "Trimestriel":
  //       endDate.setMonth(now.getMonth() + 3);
  //       break;
  //     case "Semestriel":
  //       endDate.setMonth(now.getMonth() + 6);
  //       break;
  //     case "Annuel":
  //       endDate.setFullYear(now.getFullYear() + 1);
  //       break;
  //     case "BiAnnuel":
  //       endDate.setFullYear(now.getFullYear() + 2);
  //       break;
  //     default:
  //       break;
  //   }

  //   const year = endDate.getFullYear();
  //   const month = String(endDate.getMonth() + 1).padStart(2, "0");
  //   const day = String(endDate.getDate()).padStart(2, "0");

  //   return `${year}-${month}-${day}`;
  // };

  // const verifyPromoCode = async (code) => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `abonnements/verifier-code/?code=${code}`
  //     );
  //     return {
  //       valid: response.data.valid,
  //       discount: response.data.discount || 0,
  //     };
  //   } catch (error) {
  //     console.error("Erreur vérification code promo:", error);
  //     return { valid: false, discount: 0 };
  //   }
  // };

  // const handleContinueToStep2 = () => {
  //   if (!selectedFormule || !selectedCategorie) {
  //     alert("Veuillez sélectionner une formule et une catégorie");
  //     return;
  //   }

  //   setStep1FormuleCategorieOpen(false);
  //   setStep2PeriodeOpen(true);
  // };

  const initializeFeexPay = (paymentData) => {
    if (!window.FeexPayButton) {
      console.error("FeexPay not loaded");
      return;
    }

    const customId = `CMD_${new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "")}_${Date.now()}`;

    const feexPayConfig = {
      ...FEEXPAY_CONFIG,
      amount: paymentData.montant_payer,
      custom_id: customId,
      description: `Abonnement ${selectedFormule} ${selectedCategorie} ${selectedPeriode} - INAWO`,
      callback: (response) => {
        console.log("Réponse FeexPay brute:", response);
        let detectedType = "MOBILE";
        let detectedProvider = "";

        if (response.payment_method) {
          detectedProvider = response.payment_method;
          detectedType = getPaymentType(response.payment_method);
        } else if (response.method) {
          detectedProvider = response.method;
          detectedType = getPaymentType(response.method);
        } else if (response.type) {
          detectedType = response.type.toUpperCase();
          detectedProvider = response.provider || response.payment_method || "";
        } else if (response.callback_url || response.redirect_url) {
          const url = response.callback_url || response.redirect_url;
          if (
            url.includes("mobile") ||
            url.includes("mtn") ||
            url.includes("moov")
          ) {
            detectedType = "MOBILE";
          } else if (
            url.includes("card") ||
            url.includes("visa") ||
            url.includes("master")
          ) {
            detectedType = "CARD";
          } else if (url.includes("wallet") || url.includes("wave")) {
            detectedType = "WALLET";
          }
        }

        console.log(
          "Type détecté:",
          detectedType,
          "Provider:",
          detectedProvider
        );
        setPaymentType(detectedType);
        setPaymentProvider(detectedProvider);
        handlePaymentResponse({
          ...response,
          detected_type: detectedType,
          detected_provider: detectedProvider,
        });
      },
    };

    try {
      window.FeexPayButton.init("feexpay-payment-btn", feexPayConfig);
      console.log("FeexPay initialisé avec capture de type");
    } catch (error) {
      console.error("Erreur initialisation FeexPay:", error);
      setPaymentError("Erreur lors de l'initialisation du paiement");
    }
  };

  const handlePaymentResponse = async (response) => {
    console.log("Traitement de la réponse avec type:", response);
    setPaymentLoading(true);
    setPaymentError("");

    try {
      if (response.status === "success" || response.transaction_id) {
        const finalPaymentType =
          response.detected_type ||
          paymentType ||
          getPaymentType(response.payment_method) ||
          getPaymentType(response.method) ||
          "MOBILE";
        const finalProvider =
          response.detected_provider ||
          paymentProvider ||
          response.payment_method ||
          response.method ||
          "";
        const transactionId =
          response.transaction_id || response.custom_id || `TXN_${Date.now()}`;

        const moduleId =
          selectedFormule === "Ventes"
            ? 1
            : selectedFormule === "Stock"
            ? 2
            : 3;
        const categorieId =
          selectedCategorie === "ESSENTIEL"
            ? 1
            : selectedCategorie === "BUSINESS"
            ? 2
            : 3;

        const formattedDate = paymentData.date_fin.includes("T")
          ? paymentData.date_fin.split("T")[0]
          : paymentData.date_fin;

        const dataToSend = {
          module: moduleId,
          categorie: categorieId,
          tarif_module: paymentData.tarif_module,
          montant_payer: paymentData.montant_payer,
          code_parrain: paymentData.code_parrain,
          code_affilie: paymentData.code_affilie,
          date_fin: formattedDate,
          methode_paiement: finalPaymentType,
          provider_paiement: finalProvider,
          etat: response.status === "successful" ? "réussi" : "en_attente",
          transaction_id: transactionId,
          periode: selectedPeriode,
          formule: selectedFormule,
        };

        console.log("Données à envoyer à l'API:", dataToSend);

        const apiResponse = await axiosInstance.post(
          "utilisateurs/abonnement_user/",
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Réponse de l'API:", apiResponse.data);

        if (apiResponse.data.success) {
          setPaymentSuccess(
            `Paiement ${finalPaymentType} effectué avec succès ${
              finalProvider ? `via ${finalProvider}` : ""
            }! Votre abonnement ${selectedFormule} ${selectedCategorie} ${selectedPeriode} est maintenant actif.`
          );

          // Recharger les abonnements après un paiement réussi
          const updatedAbonnements = await axiosInstance.get(
            `abonnements/abonnementuser/${userProfile.id}/`
          );
          setUserAbonnements(updatedAbonnements.data);

          setTimeout(() => {
            setStep4ProcessusOpen(false);
            setPaymentSuccess("");
            resetSubscriptionProcess();
          }, 3000);
        } else {
          throw new Error(
            apiResponse.data.message || "Erreur lors de l'enregistrement"
          );
        }
      } else {
        throw new Error(response.message || "Paiement échoué");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setPaymentError(
        error.response?.data?.message ||
          error.message ||
          "Erreur lors de l'enregistrement de l'abonnement. Veuillez contacter le support."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const resetSubscriptionProcess = () => {
    setSelectedFormule("");
    setSelectedCategorie("");
    setSelectedPeriode("");
    setPromoCode("");
    setPromoCodeInput("");
    setPromoCodeVerified(false);
    setPromoCodeDiscount(0);
    setPaymentType("");
    setPaymentProvider("");
    setPaymentData({
      categorie: 1,
      module: 2,
      tarif_module: 0,
      montant_payer: 0,
      code_parrain: "",
      code_affilie: "",
      date_fin: "",
      methode_paiement: "",
      etat: "en_attente",
      transaction_id: "",
    });
  };

  // Charger les tarifs des modules
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

  const startSubscriptionProcess = () => {
    setSelectedFormule("");
    setSelectedCategorie("");
    setSelectedPeriode("");
    setPromoCode("");
    setPromoCodeInput("");
    setPromoCodeVerified(false);
    setPromoCodeDiscount(0);
    setPaymentData({
      categorie: 1,
      module: 2,
      tarif_module: 0,
      montant_payer: 0,
      code_parrain: "",
      code_affilie: "",
      date_fin: "",
      methode_paiement: "",
      etat: "en_attente",
      transaction_id: "",
    });

    setStep1FormuleCategorieOpen(true);
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
      .filter((item) => {
        if (moduleName === "Inawo Global")
          return item.module_nom === moduleName;
        return (
          item.module_nom === moduleName && item.categorie_nom !== "ESSENTIEL"
        );
      })
      .map((item) => item.categorie_nom);

    return [...new Set(categories)];
  };

  const calculateEndDate = (periode) => {
    const now = new Date();
    let endDate = new Date(now);

    switch (periode) {
      case "Trimestriel":
        endDate.setMonth(now.getMonth() + 3);
        break;
      case "Semestriel":
        endDate.setMonth(now.getMonth() + 6);
        break;
      case "Annuel":
        endDate.setFullYear(now.getFullYear() + 1);
        break;
      case "BiAnnuel":
        endDate.setFullYear(now.getFullYear() + 2);
        break;
      default:
        break;
    }

    const year = endDate.getFullYear();
    const month = String(endDate.getMonth() + 1).padStart(2, "0");
    const day = String(endDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const calculateTarif = (periode, formule, categorie) => {
    if (!formule || !categorie || !tarifsModules.length) return 0;

    const moduleName =
      formule === "Ventes"
        ? "InawoSales"
        : formule === "Stock"
        ? "InawoStock"
        : "Inawo Global";

    const tarifItem = tarifsModules.find(
      (item) =>
        item.module_nom === moduleName &&
        item.categorie_nom.toUpperCase() === categorie.toUpperCase()
    );

    if (!tarifItem) {
      console.log("Tarif non trouvé pour:", { moduleName, categorie, periode });
      return 0;
    }

    switch (periode) {
      case "Trimestriel":
        return parseFloat(tarifItem.prix_cfa_trimestre || 0);
      case "Semestriel":
        return parseFloat(tarifItem.prix_cfa_semestre || 0);
      case "Annuel":
        return parseFloat(tarifItem.prix_cfa_annuel || 0);
      case "BiAnnuel":
        return parseFloat(tarifItem.prix_cfa_biannuel || 0);
      default:
        return 0;
    }
  };

  const verifyPromoCode = async (code) => {
    try {
      const response = await axiosInstance.get(
        `abonnements/verifier-code/?code=${code}`
      );
      return {
        valid: response.data.valid,
        discount: response.data.discount || 0,
      };
    } catch (error) {
      console.error("Erreur vérification code promo:", error);
      return { valid: false, discount: 0 };
    }
  };

  const handleContinueToStep2 = () => {
    if (!selectedFormule || !selectedCategorie) {
      alert("Veuillez sélectionner une formule et une catégorie");
      return;
    }

    setStep1FormuleCategorieOpen(false);
    setStep2PeriodeOpen(true);
  };

  const handlePeriodeClick = async (periode) => {
    setSelectedPeriode(periode);

    const tarif = calculateTarif(periode, selectedFormule, selectedCategorie);
    const montantPayer = Math.round(tarif * 0.85);

    setPaymentData((prev) => ({
      ...prev,
      tarif_module: tarif,
      montant_payer: montantPayer,
      date_fin: calculateEndDate(periode),
    }));

    setStep2PeriodeOpen(false);
    setStep3PromoOpen(true);
  };

  const handleContinueFromPromo = async () => {
    let finalAmount = paymentData.montant_payer;
    let codeParrain = "";
    let codeAffilie = "";

    if (promoCode && promoCodeInput) {
      const { valid, discount } = await verifyPromoCode(promoCodeInput);
      if (!valid) {
        alert("Code promo invalide ou expiré");
        return;
      }

      setPromoCodeVerified(true);
      setPromoCodeDiscount(discount);
      finalAmount = Math.round(
        paymentData.montant_payer * (1 - discount / 100)
      );

      if (promoCode.includes("parainnage")) {
        codeParrain = promoCodeInput;
      } else if (promoCode.includes("affiliation")) {
        codeAffilie = promoCodeInput;
      }
    }

    const updatedPaymentData = {
      ...paymentData,
      montant_payer: finalAmount,
      code_parrain: codeParrain,
      code_affilie: codeAffilie,
    };
    setPaymentData(updatedPaymentData);

    setStep3PromoOpen(false);
    setStep4ProcessusOpen(true);

    loadFeexPayScript()
      .then(() => {
        setTimeout(() => {
          if (window.FeexPayButton) {
            initializeFeexPay(updatedPaymentData);
          }
        }, 500);
      })
      .catch((error) => {
        console.error("Erreur chargement FeexPay:", error);
      });
  };

  const loadFeexPayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.FeexPayButton) {
        setFeexPayLoaded(true);
        resolve();
        return;
      }

      const existingScript = document.getElementById("feexpay-script");
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.id = "feexpay-script";
      script.src = "https://cdn.feexpay.com/js/v1/feexpay-button.js";
      script.async = true;

      script.onload = () => {
        setFeexPayLoaded(true);
        resolve();
      };

      script.onerror = () => {
        setPaymentError("Erreur lors du chargement du système de paiement");
        reject(new Error("Failed to load FeexPay script"));
      };

      document.head.appendChild(script);
    });
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
    };

    const isHovered = hoveredPeriode === name;

    return {
      ...base,
      backgroundColor: isHovered ? "#014a92" : "transparent",
      color: isHovered ? "white" : "#014a92",
    };
  };

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleDownloadPDF = () => {
    // Logique pour éditer l'abonnement
  };

  // Rendu des modals avec CustomSelect
  return (
    <React.Fragment>
      <div className="main-content" style={{ margin: "0" }}>
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
                          <i className="ri-exchange-line me-1"></i>
                          Changer formule
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
                  <div className="card-body">
                    <div>
                      {loadingAbonnements ? (
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
                            Chargement de vos abonnements...
                          </p>
                        </div>
                      ) : errorAbonnements ? (
                        <Alert color="danger">{errorAbonnements}</Alert>
                      ) : userAbonnements.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-hover table-nowrap mb-0">
                            <thead>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Formule</th>
                                <th scope="col">Catégorie</th>
                                <th scope="col">Prix</th>
                                <th scope="col">Date début</th>
                                <th scope="col">Date fin</th>
                                <th scope="col">Statut</th>
                                <th scope="col">Action</th>
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
                                      ) || "0"}
                                    </td>
                                    <td>{abonnement.date_debut}</td>
                                    <td>{abonnement.date_fin}</td>
                                    <td>
                                      <span
                                        style={{ fontSize: "0.58" }}
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
                            <i className="ri-file-add-line me-1"></i>
                            S'abonner maintenant
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Les modals restent inchangés */}
                    {/* Modal Mon abonnement existant */}
                    <div
                      className="modal fade"
                      id="showModal"
                      tabIndex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4">
                          <div className="p-4">
                            <div className="d-flex flex-column align-items-center justify-content-center">
                              <div
                                className="bg-success-subtle d-flex align-items-center justify-content-center"
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  borderRadius: "50%",
                                }}
                              >
                                <i
                                  className="ri-check-line bg-success"
                                  style={{
                                    fontSize: "40px",
                                    color: "white",
                                    borderRadius: "50%",
                                    padding: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "50px",
                                    height: "50px",
                                  }}
                                />
                              </div>

                              <p className="text-center mt-2">
                                <h4>Inawo Global</h4>
                                <h4 style={{ fontWeight: "bold" }}>
                                  Formule : Premium
                                </h4>
                                <p
                                  className="fs-10 mt-2 text-secondary"
                                  style={{ fontWeight: "bold" }}
                                >
                                  Du 01/01/2024 au 31/12/2027
                                </p>
                                <Button
                                  onClick={() => setShowPricing(true)}
                                  data-bs-dismiss="modal"
                                  style={{ borderRadius: "70px" }}
                                >
                                  Changer de formule
                                </Button>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* ÉTAPE 1 - Modal Formule et Catégorie avec CustomSelect */}
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
                        <i className="ri-settings-3-line me-2"></i>
                        Formules
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
                                value={selectedFormule}
                                onChange={setSelectedFormule}
                                placeholder="Choisir une formule"
                              />
                            </div>

                            <div className="mb-3">
                              <Label className="form-label fw-bold">
                                <i className="ri-star-line me-2 text-warning"></i>
                                Sélectionnez une catégorie
                              </Label>
                              <CustomSelect
                                options={getCategorieOptions()}
                                value={selectedCategorie}
                                onChange={setSelectedCategorie}
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

                    {/* ÉTAPE 2 - Modal Période (modifié pour afficher prix sans réduction) */}
                    <Modal
                      isOpen={step2PeriodeOpen}
                      toggle={toggleStep2}
                      centered
                      modalClassName="border-0"
                      contentClassName="rounded-4"
                    >
                      <ModalHeader
                        toggle={toggleStep2}
                        className="bg-info-subtle p-1 rounded-top-4"
                      >
                        <i className="ri-calendar-line me-2"></i>
                        Période d'abonnement
                      </ModalHeader>
                      <ModalBody>
                        <div className="mb-3">
                          <p className="text-muted">
                            <strong>Formule sélectionnée :</strong>{" "}
                            {selectedFormule} - {selectedCategorie}
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
                                <div
                                  style={{
                                    fontSize: "0.8rem",
                                    marginTop: "0.25rem",
                                  }}
                                >
                                  <span className="fw-bold text-primary">
                                    {prixNormal.toLocaleString()} 
                                  </span>
                                  <div
                                    className="text-muted"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {periode === "Trimestriel"
                                      ? "3 mois"
                                      : periode === "Semestriel"
                                      ? "6 mois"
                                      : periode === "Annuel"
                                      ? "1 an"
                                      : "2 ans"}
                                    <span className="text-muted ms-2">
                                      ({displayReduction})
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="secondary"
                          style={{ borderRadius: "70px" }}
                          onClick={() => {
                            setStep2PeriodeOpen(false);
                            setStep1FormuleCategorieOpen(true);
                          }}
                        >
                          <i className="ri-arrow-left-line me-1"></i>
                          Retour
                        </Button>
                      </ModalFooter>
                    </Modal>

                    {/* ÉTAPE 3 - Modal Code Promo avec CustomSelect */}
                    <Modal
                      isOpen={step3PromoOpen}
                      toggle={toggleStep3}
                      centered
                      modalClassName="border-0"
                      contentClassName="rounded-4"
                    >
                      <ModalHeader
                        toggle={toggleStep3}
                        className="bg-info-subtle p-3 rounded-top-4"
                      >
                        <i className="ri-coupon-line me-2"></i>
                        Code Promo
                      </ModalHeader>
                      <ModalBody>
                        <div className="mb-3">
                          <p className="text-muted">
                            <strong>Sélection :</strong> {selectedFormule} -{" "}
                            {selectedCategorie} - {selectedPeriode}
                          </p>
                          <p className="text-muted">
                            <strong>Prix :</strong>{" "}
                            {paymentData.tarif_module?.toLocaleString()} 
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
                            placeholder="Code Promo (Facultatif)"
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
                              onChange={(e) =>
                                setPromoCodeInput(e.target.value)
                              }
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
                            <i className="ri-check-line me-2"></i>
                            Code vérifié ! Réduction de {promoCodeDiscount}%
                            appliquée.
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
                          <i className="ri-arrow-left-line me-1"></i>
                          Retour
                        </Button>
                        <Button
                          color="primary"
                          style={{ borderRadius: "70px" }}
                          onClick={handleContinueFromPromo}
                        >
                          <i className="ri-arrow-right-line me-1"></i>
                          Continuer
                        </Button>
                      </ModalFooter>
                    </Modal>

                    {/* ÉTAPE 4 - Modal Récapitulatif (montre la réduction seulement si code valide) */}
                    <Modal
                      isOpen={step4ProcessusOpen}
                      toggle={toggleStep4}
                      centered
                      modalClassName="border-0"
                      contentClassName="rounded-4"
                      size="lg"
                    >
                      <ModalHeader
                        toggle={toggleStep4}
                        className="bg-info-subtle p-3 rounded-top-4"
                      >
                        <i className="ri-file-list-line me-2"></i>
                        Récapitulatif de votre abonnement
                      </ModalHeader>
                      <ModalBody>
                           {paymentType && (
                                                <div className="mt-2 p-2 bg-success-subtle rounded">
                                                  <small>
                                                    <strong>Type de paiement détecté :</strong>
                                                    <span className="badge bg-success ms-2">
                                                      {paymentType === "MOBILE"
                                                        ? "Mobile Money"
                                                        : paymentType === "CARD"
                                                        ? "Carte Bancaire"
                                                        : paymentType === "WALLET"
                                                        ? "Portefeuille Électronique"
                                                        : paymentType}
                                                    </span>
                                                    {paymentProvider && (
                                                      <>
                                                        {" via "}
                                                        <span className="badge bg-info ms-1">
                                                          {paymentProvider}
                                                        </span>
                                                      </>
                                                    )}
                                                  </small>
                                                </div>
                                              )}
                                              {paymentError && (
                                                <Alert color="danger" className="mb-3">
                                                  <i className="ri-error-warning-line me-2"></i>
                                                  {paymentError}
                                                </Alert>
                                              )}
                                              {paymentSuccess && (
                                                <Alert color="success" className="mb-3">
                                                  <i className="ri-check-line me-2"></i>
                                                  {paymentSuccess}
                                                </Alert>
                                              )}
                        <div className="p-3 rounded bg-light">
                          <div className="row">
                            <div className="col-md-6">
                              <h6>
                                <strong>Formule :</strong> {selectedFormule}
                              </h6>
                              <h6>
                                <strong>Catégorie :</strong> {selectedCategorie}
                              </h6>
                            </div>
                            <div className="col-md-6">
                              <h6>
                                <strong>Période :</strong> {selectedPeriode}
                              </h6>
                              <h6>
                                <strong>Durée :</strong>{" "}
                                {selectedPeriode === "Trimestriel"
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
                                {paymentData.tarif_module?.toLocaleString()}{" "}
                                
                              </span>
                            </div>

                            {/* Afficher la réduction seulement si le code promo est vérifié */}
                            {promoCodeVerified && (
                              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mt-2">
                                <span>Réduction code promo :</span>
                                <span className="text-success">
                                  -{promoCodeDiscount}% (-
                                  {Math.round(
                                    (paymentData.tarif_module *
                                      promoCodeDiscount) /
                                      100
                                  ).toLocaleString()}{" "}
                                  )
                                </span>
                              </div>
                            )}

                            <div className="d-flex justify-content-between align-items-center mt-3">
                              <h5 className="mb-0">Total à payer :</h5>
                              <h4 className="mb-0 text-success fw-bold">
                                {paymentData.montant_payer?.toLocaleString()}{" "}
                                
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

                        <div className="mt-4">
                          {paymentLoading ? (
                            <div className="text-center p-4">
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Traitement...
                                </span>
                              </div>
                              <p className="mt-2">Traitement du paiement...</p>
                            </div>
                          ) : (
                            <>
                              {!feexPayLoaded && (
                                <div className="text-center p-3">
                                  <div
                                    className="spinner-border spinner-border-sm text-primary"
                                    role="status"
                                  >
                                    <span className="visually-hidden">
                                      Chargement...
                                    </span>
                                  </div>
                                  <p className="mt-2 text-muted">
                                    Chargement du système de paiement...
                                  </p>
                                </div>
                              )}

                              <div
                                id="feexpay-payment-btn"
                                style={{
                                  cursor: "pointer",
                                  color: "white",
                                  backgroundColor: "#007bff",
                                  padding: "12px 20px",
                                  borderRadius: "70px",
                                  textAlign: "center",
                                  marginTop: "20px",
                                  border: "none",
                                  transition: "all 0.3s ease",
                                  display: feexPayLoaded ? "block" : "none",
                                  width: "100%",
                                }}
                                onMouseEnter={(e) =>
                                  (e.target.style.backgroundColor = "#0056b3")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.backgroundColor = "#007bff")
                                }
                              >
                                <i className="ri-secure-payment-line me-2"></i>
                                Payer{" "}
                                {paymentData.montant_payer?.toLocaleString()}{" "}
                                
                              </div>

                              <div className="mt-3 text-center">
                                <small className="text-muted">
                                  <i className="ri-shield-check-line me-1"></i>
                                  Paiement sécurisé via FeexPay
                                </small>
                              </div>

                              {/* <div className="mt-2 text-center">
                              <small className="text-muted">
                                Méthodes acceptées : Mobile Money (MTN, MOOV,
                                WAVE), Cartes bancaires (VISA, Mastercard)
                              </small>
                            </div> */}
                            </>
                          )}
                        </div>
                      </ModalBody>
                      <Button
                        color="secondary"
                        style={{ borderRadius: "70px" }}
                        onClick={() => {
                          setStep4ProcessusOpen(false);
                          setStep3PromoOpen(true);
                        }}
                        disabled={paymentLoading}
                      >
                        <i className="ri-arrow-left-line me-1"></i>
                        Retour
                      </Button>
                      <Button
                        color="light"
                        onClick={toggleStep4}
                        style={{ borderRadius: "70px" }}
                        disabled={paymentLoading}
                      >
                        Annuler
                      </Button>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Souscription;








