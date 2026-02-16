// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   Card,
//   CardBody,
//   CardHeader,
//   Col,
//   Container,
//   Nav,
//   NavItem,
//   NavLink,
//   Row,
//   Input,
//   Alert,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Label,
// } from "reactstrap";
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import axios from "axios";
// import { useProfile } from "../../../Components/Hooks/UserHooks";
// import { pricing1 } from "../../../common/data";
// import { CustomSelect } from "../../../Components/Common/CustomSelectStyles";
// import { toast } from "react-toastify";

// // Import des composants FedaPay
// import { FedaCheckoutButton } from "fedapay-reactjs";

// // Configuration Axios
// const axiosInstance = axios.create({
//   baseURL: "https://inawoapiv3.inawo.pro/",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   timeout: 30000,
// });

// // Intercepteur pour ajouter le token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Intercepteur pour les réponses
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("Erreur API:", error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// const Pricing = () => {
//   const { userProfile, token } = useProfile();

//   // États pour les onglets
//   const [activeTab, setActiveTab] = useState("1");

//   // États pour les modaux
//   const [step1PeriodeOpen, setStep1PeriodeOpen] = useState(false);
//   const [step2PromoOpen, setStep2PromoOpen] = useState(false);
//   const [step3PaiementOpen, setStep3PaiementOpen] = useState(false);

//   // États pour les sélections
//   const [selectedFormule, setSelectedFormule] = useState("");
//   const [selectedCategorie, setSelectedCategorie] = useState("");
//   const [selectedPeriode, setSelectedPeriode] = useState("");
//   const [promoCode, setPromoCode] = useState("");
//   const [promoCodeInput, setPromoCodeInput] = useState("");
//   const [promoCodeVerified, setPromoCodeVerified] = useState(false);
//   const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
//   const [showAnnualPricing, setShowAnnualPricing] = useState(false);

// // Ajouter cette fonction pour basculer entre mensuel/annuel
// const togglePricingPeriod = () => {
//     setShowAnnualPricing(!showAnnualPricing);
// };


//   // États pour l'affichage
//   const [hoveredPeriode, setHoveredPeriode] = useState(null);

//   // États pour le paiement
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [paymentError, setPaymentError] = useState("");
//   const [paymentSuccess, setPaymentSuccess] = useState("");
//   const [fedaPayOptions, setFedaPayOptions] = useState(null);

//   // États pour les données
//   const [tarifsModules, setTarifsModules] = useState([]);
//   const [loadingTarifs, setLoadingTarifs] = useState(false);
//   const [errorTarifs, setErrorTarifs] = useState(null);

//   // Données de paiement selon le nouveau format JSON
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
//     code_affilie: "",
//   });

//   // Options
//   const periodeOptions = [
//     "Mensuel",
//     "Trimestriel",
//     "Semestriel",
//     "Annuel",
//     "BiAnnuel",
//   ];

//   const promoCodeOptions = [
//     { value: "", label: "Code Promo", disabled: true },
//     { value: "affiliation", label: "Code D'affiliation" },
//     { value: "parrainage", label: "Code de parrainage" },
//   ];

//   // Configuration FedaPay
//   const FEDAPAY_CONFIG = {
//     public_key: "pk_live_JI6d6PNOhmt5z5eiZ9i-BC0S", // Remplacez par votre clé publique
//     environment: "sandbox", // "live" pour la production
//   };

//   // Fonctions toggle
//   const toggleStep1 = () => setStep1PeriodeOpen(!step1PeriodeOpen);
//   const toggleStep2 = () => setStep2PromoOpen(!step2PromoOpen);
//   const toggleStep3 = () => setStep3PaiementOpen(!step3PaiementOpen);

//   // Charger les tarifs
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

//   // ==================== FONCTIONS UTILITAIRES ====================

//   // Fonction pour formater les montants
//   const formatMontant = (montant) => {
//     if (typeof montant === "string") {
//       montant = parseFloat(montant) || 0;
//     }

//     return new Intl.NumberFormat("fr-FR", {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(montant);
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
//       case "fedapay":
//         return "fedapay";
//       default:
//         return "fedapay";
//     }
//   };

//   // ==================== FONCTIONS POUR L'ENVOI AU BACKEND ====================

//   // Fonction pour envoyer les données d'abonnement
//   const sendSubscriptionData = async (subscriptionData) => {
//     try {
//       console.log("Envoi des données d'abonnement:", subscriptionData);

//       // Utiliser le nouvel endpoint pour l'abonnement
//       const response = await axiosInstance.post(
//         "abonnements/souscrire/",
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

//   // Fonction pour préparer les données selon le nouveau format JSON
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
//       switch (categorie) {
//         case "Essentiel":
//           return 1;
//         case "Business":
//           return 2;
//         case "Professionnel":
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
//         paymentResponse.status === "approved" ||
//         paymentResponse.status === "success"
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
//         paymentResponse.id ||
//         `TXN_${Date.now()}`;

//       methodePaiement =
//         paymentResponse.payment_method || getMethodePaiementFormat("fedapay");
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
//       code_affilie: paymentData.code_affilie || "",
//     };

//     console.log("Données préparées pour l'API:", subscriptionData);
//     return subscriptionData;
//   };

//   // ==================== FONCTIONS FEDAPAY ====================

//   const initializeFedaPay = (paymentData) => {
//     const transactionId = `INAWO_${Date.now()}_${Math.random()
//       .toString(36)
//       .substr(2, 9)}`;

//     const options = {
//       public_key: FEDAPAY_CONFIG.public_key,
//       transaction: {
//         amount: paymentData.montant_payer,
//         description: `Abonnement ${selectedFormule} - ${selectedCategorie} - ${selectedPeriode}`,
//       },
//       currency: {
//         iso: "XOF",
//       },
//       customer: {
//         firstname: userProfile?.nom || "Client",
//         lastname: userProfile?.prenom || "INAWO",
//         email: userProfile?.email || "client@inawo.com",
//         phone_number: userProfile?.telephone || "+22500000000",
//       },
//       button: {
//         class: "btn btn-primary w-100",
//         text: `Payer ${formatMontant(paymentData.montant_payer)}`,
//       },
//       onComplete: async (response) => {
//         console.log("Réponse FedaPay:", response);

//         try {
//           if (
//             response.reason === "completed" ||
//             response.reason === "approved"
//           ) {
//             // Paiement réussi
//             await handleSuccessfulPayment(response);
//           } else if (response.reason === "dialog_dismissed") {
//             // Utilisateur a fermé la boîte de dialogue
//             toast.info("Paiement annulé par l'utilisateur");
//           } else {
//             // Paiement échoué
//             await handleFailedPayment(response);
//           }
//         } catch (error) {
//           console.error("Erreur traitement réponse FedaPay:", error);
//           toast.error("Erreur lors du traitement du paiement");
//         }
//       },
//       onCancel: () => {
//         toast.info("Paiement annulé");
//       },
//       onError: (error) => {
//         console.error("Erreur FedaPay:", error);
//         toast.error("Erreur lors du processus de paiement");
//       },
//     };

//     setFedaPayOptions(options);
//   };

//   const handleSuccessfulPayment = async (response) => {
//     setPaymentLoading(true);

//     try {
//       // Préparer les données de souscription
//       const subscriptionData = prepareSubscriptionData(response);
//       subscriptionData.methode_paiement = "fedapay";
//       subscriptionData.transaction_id =
//         response.transaction?.id || `TXN_${Date.now()}`;
//       subscriptionData.etat = "succes";

//       console.log("📦 Données d'abonnement à envoyer:", subscriptionData);

//       // Envoyer les données au backend
//       const result = await sendSubscriptionData(subscriptionData);

//       if (result.success) {
//         setPaymentSuccess(`
//           Paiement confirmé ! 
//           Abonnement ${selectedFormule} activé avec succès.
//           ID Transaction: ${subscriptionData.transaction_id}
//         `);

//         // Fermer le modal après délai
//         setTimeout(() => {
//           setStep3PaiementOpen(false);
//           resetSubscriptionProcess();
//         }, 5000);

//         toast.success("🎉 Abonnement activé avec succès !");
//       } else {
//         throw new Error(result.message || "Erreur lors de l'enregistrement");
//       }
//     } catch (error) {
//       console.error("❌ Erreur après paiement réussi:", error);
//       setPaymentError("Erreur lors de l'activation de l'abonnement");
//       toast.error("Erreur lors de l'activation de l'abonnement");
//     } finally {
//       setPaymentLoading(false);
//     }
//   };

//   const handleFailedPayment = async (response) => {
//     console.error("Paiement échoué:", response);

//     try {
//       const subscriptionData = prepareSubscriptionData(response);
//       subscriptionData.methode_paiement = "fedapay";
//       subscriptionData.transaction_id =
//         response.transaction?.id || `TXN_${Date.now()}`;
//       subscriptionData.etat = "echec";

//       // Enregistrer l'échec (optionnel)
//       await sendSubscriptionData(subscriptionData);

//       toast.error(`Paiement échoué: ${response.reason || "Raison inconnue"}`);
//     } catch (error) {
//       console.error("Erreur enregistrement échec:", error);
//       toast.error("Paiement échoué");
//     }
//   };

//   // ==================== FONCTIONS DE GESTION DU PROCESSUS ====================

//   // Démarrer le processus d'abonnement avec les paramètres exacts
//   const startSubscriptionProcess = (formule, categorie) => {
//     console.log("🎯 Démarrage processus abonnement:", { formule, categorie });

//     setSelectedFormule(formule);
//     setSelectedCategorie(categorie);
//     setSelectedPeriode("");
//     setPromoCode("");
//     setPromoCodeInput("");
//     setPromoCodeVerified(false);
//     setPromoCodeDiscount(0);

//     // Calculer le tarif mensuel par défaut
//     const tarifMensuel = calculateTarif("Mensuel", formule, categorie);

//     setPaymentData({
//       module: 1,
//       categorie: 2,
//       periodicite: "mensuel",
//       tarif_module: tarifMensuel,
//       montant_payer: tarifMensuel,
//       reduction_appliquee: 0,
//       methode_paiement: "",
//       transaction_id: "",
//       etat: "succes",
//       code_parrain: "",
//       code_affilie: "",
//     });

//     setStep1PeriodeOpen(true);
//   };

// // Fonction améliorée pour calculer les tarifs
// const calculateTarif = (periode, formule, categorie) => {
//   if (!formule || !categorie || !tarifsModules.length) return 0;

//   console.log("🔍 Recherche tarif:", { formule, categorie, periode });

//   // Mapper les noms de formules aux noms de modules dans l'API
//   const moduleName =
//     formule === "Ventes"
//       ? "InawoSales"
//       : formule === "Stock"
//       ? "InawoStock"
//       : "Inawo Global";

//   // Chercher TOUS les tarifs correspondants
//   const tarifsCorrespondants = tarifsModules.filter(
//     (item) =>
//       item.module_nom === moduleName && item.categorie_nom === categorie
//   );

//   console.log("📋 Tarifs correspondants trouvés:", tarifsCorrespondants);

//   let tarifItem = null;
//   let prix = 0;

//   // Si on trouve des tarifs correspondants
//   if (tarifsCorrespondants.length > 0) {
//     // Chercher d'abord un tarif avec prix non nul pour la période demandée
//     tarifItem = tarifsCorrespondants.find(item => {
//       let prixPeriode = 0;
//       switch (periode) {
//         case "Mensuel": prixPeriode = parseFloat(item.prix_cfa_mensuel) || 0; break;
//         case "Trimestriel": prixPeriode = parseFloat(item.prix_cfa_trimestre) || 0; break;
//         case "Semestriel": prixPeriode = parseFloat(item.prix_cfa_semestre) || 0; break;
//         case "Annuel": prixPeriode = parseFloat(item.prix_cfa_annuel) || 0; break;
//         case "BiAnnuel": prixPeriode = parseFloat(item.prix_cfa_biannuel) || 0; break;
//         default: prixPeriode = 0;
//       }
//       return prixPeriode > 0;
//     });

//     // Si aucun tarif avec prix non nul, prendre le premier
//     if (!tarifItem) {
//       tarifItem = tarifsCorrespondants[0];
//     }
//   }

//   // Calculer le prix selon la période
//   if (tarifItem) {
//     switch (periode) {
//       case "Mensuel":
//         prix = parseFloat(tarifItem.prix_cfa_mensuel) || 0;
//         break;
//       case "Trimestriel":
//         prix = parseFloat(tarifItem.prix_cfa_trimestre) || 0;
//         break;
//       case "Semestriel":
//         prix = parseFloat(tarifItem.prix_cfa_semestre) || 0;
//         break;
//       case "Annuel":
//         prix = parseFloat(tarifItem.prix_cfa_annuel) || 0;
//         break;
//       case "BiAnnuel":
//         prix = parseFloat(tarifItem.prix_cfa_biannuel) || 0;
//         break;
//       default:
//         prix = 0;
//     }
//   }

//   // Si le prix est toujours 0, utiliser les prix par défaut
//   if (prix === 0) {
//     console.log("💰 Utilisation des prix par défaut pour calcul");
    
//     const prixMensuelParDefaut = {
//       "Ventes": {
//         "Essentiel": 1500,
//         "Professionnel": 3500,
//         "Business": 10500
//       },
//       "Stock": {
//         "Essentiel": 1500,
//         "Professionnel": 3500,
//         "Business": 10500
//       },
//       "Global": {
//         "Essentiel": 6500,
//         "Professionnel": 9500,
//         "Business": 28500
//       }
//     };

//     const prixMensuelDefaut = prixMensuelParDefaut[formule]?.[categorie] || 0;
    
//     // Calculer le prix selon la période basé sur le prix mensuel par défaut
//     switch (periode) {
//       case "Mensuel": prix = prixMensuelDefaut; break;
//       case "Trimestriel": prix = prixMensuelDefaut * 3; break;
//       case "Semestriel": prix = prixMensuelDefaut * 6; break;
//       case "Annuel": prix = prixMensuelDefaut * 12; break;
//       case "BiAnnuel": prix = prixMensuelDefaut * 24; break;
//       default: prix = prixMensuelDefaut;
//     }
//   }

//   console.log("💰 Prix calculé:", { periode, formule, categorie, prix });

//   return prix;
// };

// // Fonction améliorée pour obtenir le prix mensuel selon la formule active et la catégorie de la carte
// const getPrixMensuel = (formuleActive, categorieCarte) => {
//     if (!formuleActive || !categorieCarte) return "0";
    
//     // Prix selon le document PDF
//     const prixParDefaut = {
//         "Ventes": {
//             "Essentiel": 0,      // Gratuit
//             "Professionnel": 3500,
//             "Business": 10500
//         },
//         "Stock": {
//             "Essentiel": 0,      // Gratuit
//             "Professionnel": 3500,
//             "Business": 10500
//         },
//         "Global": {
//             "Essentiel": 6500,
//             "Professionnel": 9500,
//             "Business": 28500
//         }
//     };

//     // Obtenir le prix selon la formule active
//     const prix = prixParDefaut[formuleActive]?.[categorieCarte] || 0;
    
//     return formatMontant(prix);
// };

// // Fonction pour obtenir le prix annuel
// const getPrixAnnuel = (formuleActive, categorieCarte) => {
//     if (!formuleActive || !categorieCarte) return "0";
    
//     // Prix annuels selon le document PDF
//     const prixAnnuelParDefaut = {
//         "Ventes": {
//             "Essentiel": 0,      // Gratuit
//             "Professionnel": 35000,
//             "Business": 105000
//         },
//         "Stock": {
//             "Essentiel": 0,      // Gratuit
//             "Professionnel": 35000,
//             "Business": 105000
//         },
//         "Global": {
//             "Essentiel": 65000,
//             "Professionnel": 95000,
//             "Business": 285000
//         }
//     };

//     const prix = prixAnnuelParDefaut[formuleActive]?.[categorieCarte] || 0;
//     return formatMontant(prix);
// };

// const getDisplayPrice = (formuleActive, categorieCarte) => {
//     if (showAnnualPricing) {
//         return getPrixAnnuel(formuleActive, categorieCarte);
//     }
//     return getPrixMensuel(formuleActive, categorieCarte);
// };

// // Fonction pour calculer le tarif selon la période
// // const calculateTarif = (periode, formule, categorie) => {
// //     // Obtenir le prix mensuel de base
// //     const prixMensuel = getPrixMensuel(formule, categorie);
    
// //     // Convertir en nombre
// //     const prixMensuelNum = parseFloat(prixMensuel.replace(/[^0-9.-]+/g, "")) || 0;
    
// //     // Multiplier selon la période
// //     switch (periode) {
// //         case "Mensuel": 
// //             return prixMensuelNum;
// //         case "Trimestriel": 
// //             return prixMensuelNum * 3;
// //         case "Semestriel": 
// //             return prixMensuelNum * 6;
// //         case "Annuel": 
// //             return prixMensuelNum * 12;
// //         case "BiAnnuel": 
// //             return prixMensuelNum * 24;
// //         default: 
// //             return prixMensuelNum;
// //     }
// // };

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

//   // Vérifier le code promo
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

//   // Étape 1: Sélection de la période
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

//     setTimeout(() => {
//       setStep1PeriodeOpen(false);
//       setStep2PromoOpen(true);
//     }, 300);
//   };

//   // Étape 2: Gestion du code promo
//   const handleContinueFromPromo = async () => {
//     let finalAmount = paymentData.tarif_module;
//     let reductionAppliquee = 0;
//     let codeParrain = "";
//     let codeAffilie = "";

//     const promoCodeValue =
//       promoCode && typeof promoCode === "object" ? promoCode.value : promoCode;

//     if (promoCodeValue && promoCodeInput) {
//       const verification = await verifyPromoCode(promoCodeInput);

//       if (!verification.valid) {
//         return; // Arrêter le processus si le code est invalide
//       }

//       console.log("✅ Code valide, calcul du montant...");
//       const calcul = await calculerMontantAvecCodePromo(
//         paymentData.tarif_module,
//         promoCodeInput
//       );

//       console.log("📋 Résultat calcul:", calcul);

//       if (calcul.success) {
//         setPromoCodeVerified(true);
//         setPromoCodeDiscount(calcul.reduction);
//         finalAmount = calcul.nouveau_montant;
//         reductionAppliquee = calcul.reduction;

//         if (promoCodeValue === "parrainage") {
//           codeParrain = promoCodeInput;
//         } else if (promoCodeValue === "affiliation") {
//           codeAffilie = promoCodeInput;
//         }

//         if (calcul.reduction > 0) {
//           toast.success(
//             <span style={{ fontWeight: "bold", color: "green" }}>
//               {calcul.message ||
//                 `Réduction de ${calcul.reduction}% appliquée !`}
//             </span>,
//             {
//               position: "top-right",
//               autoClose: 3000,
//             }
//           );
//         } else {
//           toast.info(
//             <span style={{ fontWeight: "bold", color: "blue" }}>
//               {calcul.message || "Code valide mais aucune réduction applicable"}
//             </span>,
//             {
//               position: "top-right",
//               autoClose: 3000,
//             }
//           );
//         }
//       } else {
//         setPromoCodeVerified(true);
//         setPromoCodeDiscount(0);

//         toast.info(
//           <span style={{ fontWeight: "bold", color: "orange" }}>
//             {calcul.message ||
//               "Code valide mais erreur lors du calcul de la réduction"}
//           </span>,
//           {
//             position: "top-right",
//             autoClose: 3000,
//           }
//         );
//       }
//     } else {
//       setPromoCodeVerified(false);
//       setPromoCodeDiscount(0);
//     }

//     const updatedPaymentData = {
//       ...paymentData,
//       montant_payer: finalAmount,
//       reduction_appliquee: reductionAppliquee,
//       code_parrain: codeParrain,
//       code_affilie: codeAffilie,
//     };
//     setPaymentData(updatedPaymentData);

//     setStep2PromoOpen(false);
//     setStep3PaiementOpen(true);

//     // Initialiser FedaPay avec les nouvelles données
//     initializeFedaPay(updatedPaymentData);
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
//       code_affilie: "",
//     });
//   };

//   // ==================== FONCTIONS UI ====================

//   // Style pour les périodes
//   const getPeriodeStyle = (name) => {
//     const base = {
//       padding: "1rem",
//       borderRadius: "70px",
//       fontSize: "1.0rem",
//       border: "1px solid #014a92",
//       textAlign: "center",
//       cursor: "pointer",
//       transition: "all 0.3s ease-in-out",
//       margin: "0.5rem",
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

//   // Fonction pour obtenir le texte de durée
//   const getDureeText = (periode) => {
//     switch (periode) {
//       case "Mensuel":
//         return "1 mois";
//       case "Trimestriel":
//         return "3 mois";
//       case "Semestriel":
//         return "6 mois";
//       case "Annuel":
//         return "1 an";
//       case "BiAnnuel":
//         return "2 ans";
//       default:
//         return "";
//     }
//   };

//   // Fonctions pour les onglets
//   const toggleTab = (tab) => {
//     if (activeTab !== tab) setActiveTab(tab);
//   };

//   const getActiveFormule = () => {
//     switch (activeTab) {
//       case "1":
//         return "Ventes";
//       case "2":
//         return "Stock";
//       case "3":
//         return "Global";
//       default:
//         return "Ventes";
//     }
//   };

//   const getCategorieFromCard = (cardType) => {
//     switch (cardType) {
//       case "Essentiel":
//         return "Essentiel";
//       case "Professionnel":
//         return "Professionnel";
//       case "Business":
//         return "Business";
//       default:
//         return "Essentiel";
//     }
//   };

//   // Recharger les tarifs quand l'onglet change
//   useEffect(() => {
//     if (tarifsModules.length > 0) {
//       console.log(
//         "🔄 Mise à jour des prix selon l'onglet:",
//         getActiveFormule()
//       );
//       // Forcer le re-rendu des cartes
//     }
//   }, [activeTab, tarifsModules]);

//   document.title = "Changement formule | INAWO - Suite de Gestion";

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid>
//           <BreadCrumb
//             title="Formule"
//             pageTitle={
//               <>
//                 <i className="ri-account-circle-line me-1 align-bottom"></i>
//                 &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>
//                 &nbsp;&gt;&nbsp;
//               </>
//             }
//           />

//           <Row className="justify-content-center mt-4 mb-3">
//             <Col lg={5}>
//               <div className="text-center mb-4">
//                 <h4 className="fw-semibold fs-22">
//                   Choisissez le plan qui vous convient le mieux
//                 </h4>
//                 <p className="text-muted mb-4 fs-15">
//                   Tarification simple. Pas de frais cachés. Des fonctionnalités
//                   avancées pour votre entreprise.
//                 </p>
//               </div>
//             </Col>
//           </Row>

//           <div className="d-flex justify-content-center mb-4">
//             <Nav
//               className="nav-pills arrow-navtabs plan-nav rounded mb-3 p-1 d-flex gap-2"
//               id="pills-tab"
//               role="tablist"
//             >
//               <NavItem>
//                 <NavLink
//                   href="#"
//                   onClick={() => toggleTab("1")}
//                   className={`fw-semibold px-4 py-2 rounded-pill ${
//                     activeTab === "1" ? "text-white" : "text-dark"
//                   }`}
//                   style={{
//                     backgroundColor: activeTab === "1" ? "#014a92" : "#f1f1f1",
//                     borderRadius: "70px",
//                     border: "1px solid #ccc",
//                     transition: "all 0.3s ease",
//                   }}
//                 >
//                   Ventes et Facturation
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   href="#"
//                   onClick={() => toggleTab("2")}
//                   className={`fw-semibold px-4 py-2 rounded-pill ${
//                     activeTab === "2" ? "text-white" : "text-dark"
//                   }`}
//                   style={{
//                     backgroundColor: activeTab === "2" ? "#014a92" : "#f1f1f1",
//                     borderRadius: "70px",
//                     border: "1px solid #ccc",
//                     transition: "all 0.3s ease",
//                   }}
//                 >
//                   Stock et Approvisionnement
//                 </NavLink>
//               </NavItem>
//               <NavItem>
//                 <NavLink
//                   href="#"
//                   onClick={() => toggleTab("3")}
//                   className={`fw-semibold px-4 py-2 rounded-pill ${
//                     activeTab === "3" ? "text-white" : "text-dark"
//                   }`}
//                   style={{
//                     backgroundColor: activeTab === "3" ? "#014a92" : "#f1f1f1",
//                     borderRadius: "70px",
//                     border: "1px solid #ccc",
//                     transition: "all 0.3s ease",
//                   }}
//                 >
//                   InawoGlobal
//                 </NavLink>
//               </NavItem>
//             </Nav>
//           </div>

//           <Row className="justify-content-center">
//             {(pricing1 || []).map((price1, key) => {
//               const formuleActive = getActiveFormule();
//               const categorieCarte = price1.type; // "Essentiel", "Professionnel", "Business"

//               // Obtenir le prix mensuel réel selon la formule active et la catégorie de la carte
//               const prixReel = getPrixMensuel(formuleActive, categorieCarte);

//               return (
//                 <Col xxl={3} lg={3} key={key}>
//                   <Card className="pricing-box ribbon-box right rounded-5">
//                     {price1.ribbon === true ? (
//                       <div className="ribbon-two ribbon-two-danger">
//                         <span>Popular</span>
//                       </div>
//                     ) : (
//                       ""
//                     )}
//                     <CardBody className="bg-light m-2 p-4 rounded-5">
//                       <div className="d-flex align-items-center mb-3">
//                         <div className="flex-grow-1">
//                           <h5 className="mb-0 fw-semibold">{price1.type}</h5>
//                           <p className="text-muted mb-0">{price1.purpose}</p>
//                         </div>
//                       </div>

//                       <div className="ms-auto">
//                         <h5 className="annual mb-0">
//                           <sup className="h3 m-0 mx-narrow">
//                             {prixReel}
//                             <small className="fs-13 text-muted">/Mois</small>
//                           </sup>
//                         </h5>
//                       </div>

//                       <p className="text-muted">{price1.description}</p>

//                       {/* Le reste du contenu de la carte reste inchangé */}
//                       <ul className="list-unstyled vstack gap-2">
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">
//                               Nombre d'utilisateurs <b>{price1.projects}</b>
//                             </div>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">
//                               <b>{price1.Customers}</b> Analyse en temps réel
//                             </div>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">Tableau de bord</div>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">
//                               Gestion des contacts :
//                               <b>{price1.GestionContacts}</b>
//                             </div>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">
//                               Gestion des produits/services illimitée
//                             </div>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">
//                               Factures illimitées
//                             </div>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">Gestion de ventes</div>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">
//                               Gestion des dépenses
//                             </div>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">
//                               Gestion des Taches
//                             </div>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">
//                               Gestion des stocks
//                             </div>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">Collaboration</div>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">
//                               Notification de relances commerciales
//                             </div>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">
//                               Rapports (Exportez vos données en PDF)
//                             </div>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="d-flex">
//                             <div className="flex-shrink-0 text-success me-1">
//                               <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
//                             </div>
//                             <div className="flex-grow-1">
//                               Assistance et Support
//                             </div>
//                           </div>
//                         </li>
//                       </ul>
//                       <div className="mt-3 pt-2">
//                         <Button
//                           color={price1.planButtonClassname}
//                           className="w-100 rounded-pill"
//                           onClick={() =>
//                             startSubscriptionProcess(
//                               formuleActive,
//                               categorieCarte
//                             )
//                           }
//                         >
//                           {price1.btntxt}
//                         </Button>
//                       </div>
//                     </CardBody>
//                   </Card>
//                 </Col>
//               );
//             })}
//           </Row>
//         </Container>
//       </div>

//       {/* MODALS DU PROCESSUS D'ABONNEMENT */}

//       {/* ÉTAPE 1 - Modal Période */}
//       <Modal
//         isOpen={step1PeriodeOpen}
//         toggle={toggleStep1}
//         centered
//         modalClassName="border-0"
//         contentClassName="rounded-4"
//       >
//         <ModalHeader
//           toggle={toggleStep1}
//           className="bg-info-subtle p-3 rounded-top-4"
//         >
//           <i className="ri-calendar-line me-2"></i>
//           Choisissez votre période d'abonnement
//         </ModalHeader>
//         <ModalBody>
//           <div className="mb-4">
//             <p className="text-muted text-center">
//               <strong>Formule :</strong> {selectedFormule} -{" "}
//               <strong>Catégorie :</strong> {selectedCategorie}
//             </p>
//           </div>

//           {loadingTarifs ? (
//             <div className="text-center p-4">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Chargement...</span>
//               </div>
//               <p className="mt-2">Chargement des tarifs...</p>
//             </div>
//           ) : (
//             <div className="d-flex flex-column gap-2">
//               {periodeOptions.map((periode) => {
//                 const tarif = calculateTarif(
//                   periode,
//                   selectedFormule,
//                   selectedCategorie
//                 );
//                 const dureeText = getDureeText(periode);

//                 return (
//                   <div
//                     key={periode}
//                     style={getPeriodeStyle(periode)}
//                     onClick={() => handlePeriodeClick(periode)}
//                     onMouseEnter={() => setHoveredPeriode(periode)}
//                     onMouseLeave={() => setHoveredPeriode(null)}
//                     className="position-relative"
//                   >
//                     <div style={{ fontSize: "1.0rem", fontWeight: "bold" }}>
//                       {periode}
//                     </div>
//                     <div style={getPriceStyle(periode)}>
//                       {formatMontant(tarif)}
//                     </div>
//                     <div style={getDureeTextStyle(periode)}>{dureeText}</div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             color="secondary"
//             style={{ borderRadius: "70px" }}
//             onClick={toggleStep1}
//           >
//             Annuler
//           </Button>
//         </ModalFooter>
//       </Modal>

//       {/* ÉTAPE 2 - Modal Code Promo */}
//       <Modal
//         isOpen={step2PromoOpen}
//         toggle={toggleStep2}
//         centered
//         modalClassName="border-0"
//         contentClassName="rounded-4"
//       >
//         <ModalHeader
//           toggle={toggleStep2}
//           className="bg-info-subtle p-3 rounded-top-4"
//         >
//           <i className="ri-coupon-line me-2"></i>
//           Code Promo
//         </ModalHeader>
//         <ModalBody>
//           <div className="mb-3">
//             <p className="text-muted">
//               <strong>Sélection :</strong> {selectedFormule} -{" "}
//               {selectedCategorie} - {selectedPeriode}
//             </p>
//             <p className="text-muted">
//               <strong>Prix :</strong> {formatMontant(paymentData.tarif_module)}{" "}
             
//             </p>
//           </div>

//           <div className="mb-3">
//             <Label className="form-label fw-bold">Type de code promo</Label>
//             <CustomSelect
//               options={promoCodeOptions}
//               value={
//                 promoCodeOptions.find(
//                   (opt) => opt.value === (promoCode?.value || promoCode)
//                 ) || null
//               }
//               onChange={(selectedOption) => setPromoCode(selectedOption)}
//               placeholder="Code Promo"
//             />
//           </div>

//           {promoCode && (
//             <div className="mb-3">
//               <Label className="form-label fw-bold">
//                 Votre code{" "}
//                 {promoCode.value === "affiliation"
//                   ? "d'affiliation"
//                   : "de parrainage"}
//               </Label>
//               <Input
//                 type="text"
//                 placeholder={`Entrez votre code ${
//                   promoCode.value === "affiliation"
//                     ? "d'affiliation"
//                     : "de parrainage"
//                 }`}
//                 value={promoCodeInput}
//                 onChange={(e) => setPromoCodeInput(e.target.value)}
//                 style={{
//                   borderRadius: "70px",
//                   height: "45px",
//                   paddingLeft: "20px",
//                 }}
//               />
//             </div>
//           )}

//           {promoCodeVerified && (
//             <Alert color="success" className="mt-3">
//               <i className="ri-check-line me-2"></i>
//               Code vérifié ! Réduction de {promoCodeDiscount}% appliquée.
//             </Alert>
//           )}
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             color="secondary"
//             style={{ borderRadius: "70px" }}
//             onClick={() => {
//               setStep2PromoOpen(false);
//               setStep1PeriodeOpen(true);
//             }}
//           >
//             <i className="ri-arrow-left-line me-1"></i>
//             Retour
//           </Button>
//           <Button
//             color="primary"
//             style={{ borderRadius: "70px" }}
//             onClick={handleContinueFromPromo}
//           >
//             <i className="ri-arrow-right-line me-1"></i>
//             Continuer
//           </Button>
//         </ModalFooter>
//       </Modal>

//       {/* ÉTAPE 3 - Modal Paiement */}
//       <Modal
//         isOpen={step3PaiementOpen}
//         toggle={toggleStep3}
//         centered
//         modalClassName="border-0"
//         contentClassName="rounded-4"
//       >
//         <ModalHeader
//           toggle={toggleStep3}
//           className="bg-info-subtle p-3 rounded-top-4"
//         >
//           <i className="ri-file-list-line me-2"></i>
//           Récapitulatif de votre abonnement
//         </ModalHeader>
//         <ModalBody>
//           {paymentError && (
//             <Alert color="danger" className="mb-3">
//               <i className="ri-error-warning-line me-2"></i>
//               {paymentError}
//             </Alert>
//           )}

//           {paymentSuccess && (
//             <Alert color="success" className="mb-3">
//               <i className="ri-check-line me-2"></i>
//               {paymentSuccess}
//             </Alert>
//           )}

//           <div className="p-3 rounded bg-light mb-4">
//             <div className="row">
//               <div className="col-md-6">
//                 <h6>
//                   <strong>Formule :</strong> {selectedFormule}
//                 </h6>
//                 <h6>
//                   <strong>Catégorie :</strong> {selectedCategorie}
//                 </h6>
//               </div>
//               <div className="col-md-6">
//                 <h6>
//                   <strong>Période :</strong> {selectedPeriode}
//                 </h6>
//                 <h6>
//                   <strong>Durée :</strong> {getDureeText(selectedPeriode)}
//                 </h6>
//               </div>
//             </div>

//             <div className="mt-3">
//               <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
//                 <span>Prix normal :</span>
//                 <span className="fw-bold">
//                   {formatMontant(paymentData.tarif_module)}
//                 </span>
//               </div>

//               {promoCodeVerified && (
//                 <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mt-2">
//                   <span>Réduction code promo :</span>
//                   <span className="text-success">
//                     -{promoCodeDiscount}% (-
//                     {formatMontant(
//                       Math.round(
//                         (paymentData.tarif_module * promoCodeDiscount) / 100
//                       )
//                     )}{" "}
//                    )
//                   </span>
//                 </div>
//               )}

//               <div className="d-flex justify-content-between align-items-center mt-3">
//                 <h5 className="mb-0">Total à payer :</h5>
//                 <h4 className="mb-0 text-success fw-bold">
//                   {formatMontant(paymentData.montant_payer)}
//                 </h4>
//               </div>
//             </div>

//             {promoCodeVerified && (
//               <div className="mt-3 p-2 bg-success-subtle rounded">
//                 <p className="mb-0">
//                   <strong>Code promo appliqué :</strong>{" "}
//                   <span className="badge bg-success text-white">
//                     {promoCodeInput}
//                   </span>
//                   <span className="ms-2">
//                     (
//                     {promoCode.value === "affiliation"
//                       ? "Code d'affiliation"
//                       : "Code de parrainage"}
//                     )
//                   </span>
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Section Paiement FedaPay */}
//           <div className="mt-4">
//             <div className="text-center mb-3">
//               <h5>Paiement sécurisé</h5>
//               <p className="text-muted">
//                 Cliquez sur le bouton ci-dessous pour procéder au paiement
//               </p>
//             </div>

//             {fedaPayOptions && (
//               <div className="d-flex justify-content-center rounded-pill">
//                 <FedaCheckoutButton options={fedaPayOptions} />
//               </div>
//             )}

//             <div className="mt-3 text-center">
//               <small className="text-muted">
//                 <i className="ri-shield-check-line me-1"></i>
//                 Paiement 100% sécurisé via FedaPay
//               </small>
//             </div>

//             {paymentLoading && (
//               <div className="text-center mt-3">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">
//                     Traitement en cours...
//                   </span>
//                 </div>
//                 <p className="mt-2">Traitement du paiement...</p>
//               </div>
//             )}
//           </div>
//         </ModalBody>
//         <ModalFooter>
//           <Button
//             color="secondary"
//             style={{ borderRadius: "70px" }}
//             onClick={() => {
//               setStep3PaiementOpen(false);
//               setStep2PromoOpen(true);
//             }}
//             disabled={paymentLoading}
//           >
//             <i className="ri-arrow-left-line me-1"></i>
//             Retour
//           </Button>
//           <Button
//             color="light"
//             onClick={toggleStep3}
//             style={{ borderRadius: "70px" }}
//             disabled={paymentLoading}
//           >
//             Annuler
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </React.Fragment>
//   );
// };

// export default Pricing;



import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  Input,
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Form,
  FormGroup,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import axios from "axios";
import { useProfile } from "../../../Components/Hooks/UserHooks";
// Dans Pricing.js
import { pricing1, pricingStock, pricingGlobal } from "../../../common/data/pagesData";
import { CustomSelect } from "../../../Components/Common/CustomSelectStyles";
import { toast } from "react-toastify";

// Import des composants FedaPay
import { FedaCheckoutButton } from "fedapay-reactjs";

// Configuration Axios
const axiosInstance = axios.create({
  baseURL: "https://inawoapiv3.inawo.pro/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
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

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const Pricing = () => {
  const { userProfile, token } = useProfile();

  // États pour les onglets
  const [activeTab, setActiveTab] = useState("1");

  // États pour les modaux
  const [step1PeriodeOpen, setStep1PeriodeOpen] = useState(false);
  const [step2PromoOpen, setStep2PromoOpen] = useState(false);
  const [step3PaiementOpen, setStep3PaiementOpen] = useState(false);

  // États pour les sélections
  const [selectedFormule, setSelectedFormule] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoCodeVerified, setPromoCodeVerified] = useState(false);
  const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
  const [showAnnualPricing, setShowAnnualPricing] = useState(false);

  // Ajouter cette fonction pour basculer entre mensuel/annuel
  const togglePricingPeriod = () => {
    setShowAnnualPricing(!showAnnualPricing);
  };

  // États pour l'affichage
  const [hoveredPeriode, setHoveredPeriode] = useState(null);

  // États pour le paiement
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [fedaPayOptions, setFedaPayOptions] = useState(null);

  // États pour les données
  const [tarifsModules, setTarifsModules] = useState([]);
  const [loadingTarifs, setLoadingTarifs] = useState(false);
  const [errorTarifs, setErrorTarifs] = useState(null);

  // Données de paiement selon le nouveau format JSON
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
    code_affilie: "",
  });

  // Options
  const periodeOptions = [
    "Mensuel",
    "Trimestriel",
    "Semestriel",
    "Annuel",
    "BiAnnuel",
  ];

  const promoCodeOptions = [
    { value: "", label: "Code Promo", disabled: true },
    { value: "affiliation", label: "Code D'affiliation" },
    { value: "parrainage", label: "Code de parrainage" },
  ];

  // Configuration FedaPay
  const FEDAPAY_CONFIG = {
    public_key: "pk_live_JI6d6PNOhmt5z5eiZ9i-BC0S", // Remplacez par votre clé publique
    environment: "sandbox", // "live" pour la production
  };

  // Fonctions toggle
  const toggleStep1 = () => setStep1PeriodeOpen(!step1PeriodeOpen);
  const toggleStep2 = () => setStep2PromoOpen(!step2PromoOpen);
  const toggleStep3 = () => setStep3PaiementOpen(!step3PaiementOpen);

  // Charger les tarifs
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

  // ==================== FONCTIONS UTILITAIRES ====================

  // Fonction pour formater les montants
  const formatMontant = (montant) => {
    if (typeof montant === "string") {
      montant = parseFloat(montant.replace(/[^0-9.-]+/g, "")) || 0;
    }

    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant);
  };

  // Fonction pour convertir la période au format API
  const getPeriodiciteFormat = (periode) => {
    switch (periode) {
      case "Mensuel":
        return "mensuel";
      case "Trimestriel":
        return "trimestriel";
      case "Semestriel":
        return "semestriel";
      case "Annuel":
        return "annuel";
      case "BiAnnuel":
        return "biannuel";
      default:
        return "mensuel";
    }
  };

  // Fonction pour convertir la méthode de paiement
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

  // ==================== FONCTIONS POUR L'ENVOI AU BACKEND ====================

  // Fonction pour envoyer les données d'abonnement
  const sendSubscriptionData = async (subscriptionData) => {
    try {
      console.log("Envoi des données d'abonnement:", subscriptionData);

      // Utiliser le nouvel endpoint pour l'abonnement
      const response = await axiosInstance.post(
        "abonnements/souscrire/",
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

  // Fonction pour préparer les données selon le nouveau format JSON
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
      switch (categorie) {
        case "Essentiel":
          return 1;
        case "Business":
          return 2;
        case "Professionnel":
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
        paymentResponse.payment_method || getMethodePaiementFormat("fedapay");
    }

    // Préparer les données selon le nouveau format JSON
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
      code_affilie: paymentData.code_affilie || "",
    };

    console.log("Données préparées pour l'API:", subscriptionData);
    return subscriptionData;
  };

  // ==================== FONCTIONS FEDAPAY ====================

  const initializeFedaPay = (paymentData) => {
    const transactionId = `INAWO_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const options = {
      public_key: FEDAPAY_CONFIG.public_key,
      transaction: {
        amount: paymentData.montant_payer,
        description: `Abonnement ${selectedFormule} - ${selectedCategorie} - ${selectedPeriode}`,
      },
      currency: {
        iso: "XOF",
      },
      customer: {
        firstname: userProfile?.nom || "Client",
        lastname: userProfile?.prenom || "INAWO",
        email: userProfile?.email || "client@inawo.com",
        phone_number: userProfile?.telephone || "+22500000000",
      },
      button: {
        class: "btn btn-primary w-100",
        text: `Payer ${formatMontant(paymentData.montant_payer)}`,
      },
      onComplete: async (response) => {
        console.log("Réponse FedaPay:", response);

        try {
          if (
            response.reason === "completed" ||
            response.reason === "approved"
          ) {
            // Paiement réussi
            await handleSuccessfulPayment(response);
          } else if (response.reason === "dialog_dismissed") {
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
      },
    };

    setFedaPayOptions(options);
  };

  const handleSuccessfulPayment = async (response) => {
    setPaymentLoading(true);

    try {
      // Préparer les données de souscription
      const subscriptionData = prepareSubscriptionData(response);
      subscriptionData.methode_paiement = "fedapay";
      subscriptionData.transaction_id =
        response.transaction?.id || `TXN_${Date.now()}`;
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

        // Fermer le modal après délai
        setTimeout(() => {
          setStep3PaiementOpen(false);
          resetSubscriptionProcess();
        }, 5000);

        toast.success("🎉 Abonnement activé avec succès !");
      } else {
        throw new Error(result.message || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("❌ Erreur après paiement réussi:", error);
      setPaymentError("Erreur lors de l'activation de l'abonnement");
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
      subscriptionData.transaction_id =
        response.transaction?.id || `TXN_${Date.now()}`;
      subscriptionData.etat = "echec";

      // Enregistrer l'échec (optionnel)
      await sendSubscriptionData(subscriptionData);

      toast.error(`Paiement échoué: ${response.reason || "Raison inconnue"}`);
    } catch (error) {
      console.error("Erreur enregistrement échec:", error);
      toast.error("Paiement échoué");
    }
  };

  // ==================== FONCTIONS DE GESTION DU PROCESSUS ====================

  // Démarrer le processus d'abonnement avec les paramètres exacts
  const startSubscriptionProcess = (formule, categorie) => {
    console.log("🎯 Démarrage processus abonnement:", { formule, categorie });

    setSelectedFormule(formule);
    setSelectedCategorie(categorie);
    setSelectedPeriode("");
    setPromoCode("");
    setPromoCodeInput("");
    setPromoCodeVerified(false);
    setPromoCodeDiscount(0);

    // Calculer le tarif mensuel par défaut
    const tarifMensuel = calculateTarif("Mensuel", formule, categorie);

    setPaymentData({
      module: 1,
      categorie: 2,
      periodicite: "mensuel",
      tarif_module: tarifMensuel,
      montant_payer: tarifMensuel,
      reduction_appliquee: 0,
      methode_paiement: "",
      transaction_id: "",
      etat: "succes",
      code_parrain: "",
      code_affilie: "",
    });

    setStep1PeriodeOpen(true);
  };

  // Fonction améliorée pour calculer les tarifs
  const calculateTarif = (periode, formule, categorie) => {
    if (!formule || !categorie) return 0;

    console.log("🔍 Calcul du tarif:", { formule, categorie, periode });

    // Prix selon le document PDF
    const prixParDefaut = {
      "Ventes": {
        "Essentiel": { mensuel: 1500, annuel: 15000 },
        "Professionnel": { mensuel: 3500, annuel: 35000 },
        "Business": { mensuel: 10500, annuel: 105000 }
      },
      "Stock": {
        "Essentiel": { mensuel: 1500, annuel: 15000 },
        "Professionnel": { mensuel: 3500, annuel: 35000 },
        "Business": { mensuel: 10500, annuel: 105000 }
      },
      "Global": {
        "Essentiel": { mensuel: 6500, annuel: 65000 },
        "Professionnel": { mensuel: 9500, annuel: 95000 },
        "Business": { mensuel: 28500, annuel: 285000 }
      }
    };

    // Obtenir le prix mensuel selon la formule active
    const prixMensuel = prixParDefaut[formule]?.[categorie]?.mensuel || 0;
    const prixAnnuel = prixParDefaut[formule]?.[categorie]?.annuel || 0;

    // Calculer le prix selon la période et l'affichage (mensuel/annuel)
    if (showAnnualPricing) {
      // Si on affiche les prix annuels, utiliser le prix annuel comme base
      switch (periode) {
        case "Mensuel": 
          return Math.round(prixAnnuel / 12);
        case "Trimestriel": 
          return Math.round(prixAnnuel / 4);
        case "Semestriel": 
          return Math.round(prixAnnuel / 2);
        case "Annuel": 
          return prixAnnuel;
        case "BiAnnuel": 
          return prixAnnuel * 2;
        default: 
          return prixAnnuel;
      }
    } else {
      // Si on affiche les prix mensuels, utiliser le prix mensuel comme base
      switch (periode) {
        case "Mensuel": 
          return prixMensuel;
        case "Trimestriel": 
          return prixMensuel * 3;
        case "Semestriel": 
          return prixMensuel * 6;
        case "Annuel": 
          return prixMensuel * 12;
        case "BiAnnuel": 
          return prixMensuel * 24;
        default: 
          return prixMensuel;
      }
    }
  };

  // Fonction pour obtenir le prix mensuel selon la formule active et la catégorie de la carte
  const getPrixMensuel = (formuleActive, categorieCarte) => {
    if (!formuleActive || !categorieCarte) return "0";
    
    // Prix selon le document PDF
    const prixParDefaut = {
      "Ventes": {
        "Essentiel": 1500,      // Gratuit
        "Professionnel": 3500,
        "Business": 10500
      },
      "Stock": {
        "Essentiel": 1500,      // Gratuit
        "Professionnel": 3500,
        "Business": 10500
      },
      "Global": {
        "Essentiel": 6500,
        "Professionnel": 9500,
        "Business": 28500
      }
    };

    // Obtenir le prix selon la formule active
    const prix = prixParDefaut[formuleActive]?.[categorieCarte] || 0;
    
    return formatMontant(prix);
  };

  // Fonction pour obtenir le prix annuel
  const getPrixAnnuel = (formuleActive, categorieCarte) => {
    if (!formuleActive || !categorieCarte) return "0";
    
    // Prix annuels selon le document PDF
    const prixAnnuelParDefaut = {
      "Ventes": {
        "Essentiel": 15000,      // Gratuit
        "Professionnel": 35000,
        "Business": 105000
      },
      "Stock": {
        "Essentiel": 15000,      // Gratuit
        "Professionnel": 35000,
        "Business": 105000
      },
      "Global": {
        "Essentiel": 65000,
        "Professionnel": 95000,
        "Business": 285000
      }
    };

    const prix = prixAnnuelParDefaut[formuleActive]?.[categorieCarte] || 0;
    return formatMontant(prix);
  };

  const getDisplayPrice = (formuleActive, categorieCarte) => {
    if (showAnnualPricing) {
      return getPrixAnnuel(formuleActive, categorieCarte);
    }
    return getPrixMensuel(formuleActive, categorieCarte);
  };

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

  // Vérifier le code promo
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

  // Étape 1: Sélection de la période
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

    setTimeout(() => {
      setStep1PeriodeOpen(false);
      setStep2PromoOpen(true);
    }, 300);
  };

  // Étape 2: Gestion du code promo
  const handleContinueFromPromo = async () => {
    let finalAmount = paymentData.tarif_module;
    let reductionAppliquee = 0;
    let codeParrain = "";
    let codeAffilie = "";

    const promoCodeValue =
      promoCode && typeof promoCode === "object" ? promoCode.value : promoCode;

    if (promoCodeValue && promoCodeInput) {
      const verification = await verifyPromoCode(promoCodeInput);

      if (!verification.valid) {
        return; // Arrêter le processus si le code est invalide
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

        if (promoCodeValue === "parrainage") {
          codeParrain = promoCodeInput;
        } else if (promoCodeValue === "affiliation") {
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
              {calcul.message || "Code valide mais aucune réduction applicable"}
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

    setStep2PromoOpen(false);
    setStep3PaiementOpen(true);

    // Initialiser FedaPay avec les nouvelles données
    initializeFedaPay(updatedPaymentData);
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
      code_affilie: "",
    });
  };

  // ==================== FONCTIONS UI ====================

  // Style pour les périodes
  const getPeriodeStyle = (name) => {
    const base = {
      padding: "1rem",
      borderRadius: "70px",
      fontSize: "1.0rem",
      border: "1px solid #014a92",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
      margin: "0.5rem",
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

  // Fonction pour obtenir le texte de durée
  const getDureeText = (periode) => {
    switch (periode) {
      case "Mensuel":
        return "1 mois";
      case "Trimestriel":
        return "3 mois";
      case "Semestriel":
        return "6 mois";
      case "Annuel":
        return "1 an";
      case "BiAnnuel":
        return "2 ans";
      default:
        return "";
    }
  };

  // Fonctions pour les onglets
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const getActiveFormule = () => {
    switch (activeTab) {
      case "1":
        return "Ventes";
      case "2":
        return "Stock";
      case "3":
        return "Global";
      default:
        return "Ventes";
    }
  };

  const getCategorieFromCard = (cardType) => {
    switch (cardType) {
      case "Essentiel":
        return "Essentiel";
      case "Professionnel":
        return "Professionnel";
      case "Business":
        return "Business";
      default:
        return "Essentiel";
    }
  };

  // Fonction pour obtenir les données de tarification selon l'onglet actif
  const getPricingData = () => {
    switch (activeTab) {
      case "1":
        return pricing1;
      case "2":
        return pricingStock;
      case "3":
        return pricingGlobal;
      default:
        return pricing1;
    }
  };

  // Fonction pour obtenir le nombre d'utilisateurs selon le document PDF
  const getUsersByPlan = (formule, planType) => {
    const usersConfig = {
      "Ventes": {
        "Essentiel": "1 utilisateur",
        "Professionnel": "Jusqu'à 5 utilisateurs",
        "Business": "Jusqu'à 20 utilisateurs"
      },
      "Stock": {
        "Essentiel": "1 utilisateur",
        "Professionnel": "Jusqu'à 5 utilisateurs",
        "Business": "Jusqu'à 20 utilisateurs"
      },
      "Global": {
        "Essentiel": "5 utilisateurs",
        "Professionnel": "Jusqu'à 10 utilisateurs",
        "Business": "Jusqu'à 25 utilisateurs"
      }
    };
    
    return usersConfig[formule]?.[planType] || "0 utilisateur";
  };

  // Fonction pour obtenir le nombre de contacts selon le document PDF
  const getContactsByPlan = (formule, planType) => {
    const contactsConfig = {
      "Ventes": {
        "Essentiel": "100 contacts",
        "Professionnel": "500 contacts",
        "Business": "Illimité"
      },
      "Stock": {
        "Essentiel": "100 contacts",
        "Professionnel": "500 contacts",
        "Business": "Illimité"
      },
      "Global": {
        "Essentiel": "500 contacts",
        "Professionnel": "Illimité",
        "Business": "Illimité"
      }
    };
    
    return contactsConfig[formule]?.[planType] || "100 contacts";
  };

  // Fonction pour obtenir la gestion des opportunités selon le document PDF
  const getOpportunitesByPlan = (formule, planType) => {
    const opportunitesConfig = {
      "Ventes": {
        "Essentiel": "-",
        "Professionnel": "500",
        "Business": "Illimité"
      },
      "Stock": {
        "Essentiel": "-",
        "Professionnel": "-",
        "Business": "-"
      },
      "Global": {
        "Essentiel": "100",
        "Professionnel": "500",
        "Business": "Illimité"
      }
    };
    
    return opportunitesConfig[formule]?.[planType] || "-";
  };

  // Fonction pour obtenir les comptes d'entreprises selon le document PDF
  const getComptesEntreprisesByPlan = (formule, planType) => {
    const comptesConfig = {
      "Ventes": {
        "Essentiel": "1",
        "Professionnel": "1",
        "Business": "Jusqu'à 2"
      },
      "Stock": {
        "Essentiel": "1",
        "Professionnel": "1",
        "Business": "Jusqu'à 2"
      },
      "Global": {
        "Essentiel": "Jusqu'à 2",
        "Professionnel": "Jusqu'à 3",
        "Business": "Jusqu'à 5"
      }
    };
    
    return comptesConfig[formule]?.[planType] || "1";
  };

  // Fonction pour vérifier si une fonctionnalité est disponible selon le document PDF
  const hasFeature = (formule, planType, feature) => {
    const featuresConfig = {
      "Ventes": {
        "Essentiel": {
          "collaboration": false,
          "gestionCommandes": false,
          "gestionFournisseurs": false
        },
        "Professionnel": {
          "collaboration": true,
          "gestionCommandes": false,
          "gestionFournisseurs": false
        },
        "Business": {
          "collaboration": true,
          "gestionCommandes": false,
          "gestionFournisseurs": false
        }
      },
      "Stock": {
        "Essentiel": {
          "collaboration": false,
          "gestionCommandes": true,
          "gestionFournisseurs": true
        },
        "Professionnel": {
          "collaboration": true,
          "gestionCommandes": true,
          "gestionFournisseurs": true
        },
        "Business": {
          "collaboration": true,
          "gestionCommandes": true,
          "gestionFournisseurs": true
        }
      },
      "Global": {
        "Essentiel": {
          "collaboration": true,
          "gestionCommandes": true,
          "gestionFournisseurs": true
        },
        "Professionnel": {
          "collaboration": true,
          "gestionCommandes": true,
          "gestionFournisseurs": true
        },
        "Business": {
          "collaboration": true,
          "gestionCommandes": true,
          "gestionFournisseurs": true
        }
      }
    };
    
    return featuresConfig[formule]?.[planType]?.[feature] || false;
  };

  // Recharger les tarifs quand l'onglet change
  useEffect(() => {
    if (tarifsModules.length > 0) {
      console.log(
        "🔄 Mise à jour des prix selon l'onglet:",
        getActiveFormule()
      );
      // Forcer le re-rendu des cartes
    }
  }, [activeTab, tarifsModules]);

  document.title = "Changement formule | INAWO - Suite de Gestion";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Formule"
            pageTitle={
              <>
                <i className="ri-account-circle-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>
                &nbsp;&gt;&nbsp;
              </>
            }
          />

          <Row className="justify-content-center mt-4 mb-3">
            <Col lg={5}>
              <div className="text-center mb-4">
                <h4 className="fw-semibold fs-22">
                  Choisissez le plan qui vous convient le mieux
                </h4>
                <p className="text-muted mb-4 fs-15">
                  Tarification simple. Pas de frais cachés. Des fonctionnalités
                  avancées pour votre entreprise.
                </p>
              </div>
            </Col>
          </Row>

          {/* Sélecteur de période (Mensuel/Annuel) */}
          <Row className="justify-content-center mb-4">
            <Col lg={4}>
              <div className="text-center">
                <div className="btn-group" role="group">
                  <Button
                    type="button"
                    className={`btn ${!showAnnualPricing ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setShowAnnualPricing(false)}
                    style={{ borderRadius: '70px 0 0 70px' }}
                  >
                    Mensuel
                  </Button>
                  <Button
                    type="button"
                    className={`btn ${showAnnualPricing ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setShowAnnualPricing(true)}
                    style={{ borderRadius: '0 70px 70px 0' }}
                  >
                    Annuel
                  </Button>
                </div>
                {showAnnualPricing && (
                  <p className="text-muted mt-2">
                    <small>Économisez jusqu'à 20% avec un abonnement annuel !</small>
                  </p>
                )}
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-center mb-4">
            <Nav
              className="nav-pills arrow-navtabs plan-nav rounded mb-3 p-1 d-flex gap-2"
              id="pills-tab"
              role="tablist"
            >
              <NavItem>
                <NavLink
                  href="#"
                  onClick={() => toggleTab("1")}
                  className={`fw-semibold px-4 py-2 rounded-pill ${
                    activeTab === "1" ? "text-white" : "text-dark"
                  }`}
                  style={{
                    backgroundColor: activeTab === "1" ? "#014a92" : "#f1f1f1",
                    borderRadius: "70px",
                    border: "1px solid #ccc",
                    transition: "all 0.3s ease",
                  }}
                >
                  Ventes et Facturation
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="#"
                  onClick={() => toggleTab("2")}
                  className={`fw-semibold px-4 py-2 rounded-pill ${
                    activeTab === "2" ? "text-white" : "text-dark"
                  }`}
                  style={{
                    backgroundColor: activeTab === "2" ? "#014a92" : "#f1f1f1",
                    borderRadius: "70px",
                    border: "1px solid #ccc",
                    transition: "all 0.3s ease",
                  }}
                >
                  Stock et Approvisionnement
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="#"
                  onClick={() => toggleTab("3")}
                  className={`fw-semibold px-4 py-2 rounded-pill ${
                    activeTab === "3" ? "text-white" : "text-dark"
                  }`}
                  style={{
                    backgroundColor: activeTab === "3" ? "#014a92" : "#f1f1f1",
                    borderRadius: "70px",
                    border: "1px solid #ccc",
                    transition: "all 0.3s ease",
                  }}
                >
                  InawoGlobal
                </NavLink>
              </NavItem>
            </Nav>
          </div>

          <Row className="justify-content-center">
            {getPricingData().map((price, key) => {
              const formuleActive = getActiveFormule();
              const categorieCarte = price.type; // "Essentiel", "Professionnel", "Business"

              // Obtenir le prix réel selon la période (mensuel/annuel)
              const prixReel = getDisplayPrice(formuleActive, categorieCarte);
              
              // Obtenir les informations spécifiques selon le document PDF
              const usersText = getUsersByPlan(formuleActive, categorieCarte);
              const contactsText = getContactsByPlan(formuleActive, categorieCarte);
              const opportunitesText = getOpportunitesByPlan(formuleActive, categorieCarte);
              const comptesEntreprisesText = getComptesEntreprisesByPlan(formuleActive, categorieCarte);
              
              // Vérifier les fonctionnalités spécifiques
              const hasCollaboration = hasFeature(formuleActive, categorieCarte, "collaboration");
              const hasGestionCommandes = hasFeature(formuleActive, categorieCarte, "gestionCommandes");
              const hasGestionFournisseurs = hasFeature(formuleActive, categorieCarte, "gestionFournisseurs");

              return (
                <Col xxl={4} lg={4} key={key}>
                  <Card className="pricing-box ribbon-box right rounded-5 h-100">
                    {price.ribbon === true ? (
                      <div className="ribbon-two ribbon-two-danger">
                        <span>Popular</span>
                      </div>
                    ) : (
                      ""
                    )}
                    <CardBody className="bg-light m-2 p-4 rounded-5 d-flex flex-column h-100">
                      <div className="d-flex align-items-center mb-3">
                        <div className="flex-grow-1">
                          <h5 className="mb-0 fw-semibold">{price.type}</h5>
                          <p className="text-muted mb-0">{price.purpose}</p>
                        </div>
                      </div>

                      <div className="text-center mb-4">
                        <h2 className="annual mb-0">
                          {prixReel} 
                          <small className="fs-16 text-muted">
                            {showAnnualPricing ? "/An" : "/Mois"}
                          </small>
                        </h2>
                        {showAnnualPricing && categorieCarte !== "Essentiel" && (
                          <p className="text-success mb-0">
                            <small>Économisez sur le prix mensuel !</small>
                          </p>
                        )}
                      </div>

                      <div className="flex-grow-1">
                        <ul className="list-unstyled vstack gap-2">
                          {/* Nombre d'utilisateurs */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                <b>{usersText}</b>
                              </div>
                            </div>
                          </li>

                          {/* Analyse en temps réel */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                Analyse en temps réel
                              </div>
                            </div>
                          </li>

                          {/* Tableau de bord */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                Tableau de bord
                              </div>
                            </div>
                          </li>

                          {/* Gestion des contacts */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                Gestion des contacts : <b>{contactsText}</b>
                              </div>
                            </div>
                          </li>

                          {/* Gestion des produits/services */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                Gestion des produits/services illimitée
                              </div>
                            </div>
                          </li>

                          {/* Factures */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                Factures illimitées
                              </div>
                            </div>
                          </li>

                          {/* Devis/Pro forma */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                Devis/Pro forma/Bon de commande/Bon de livraison illimités
                              </div>
                            </div>
                          </li>

                          {/* Gestion des ventes */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                Gestion des ventes
                              </div>
                            </div>
                          </li>

                          {/* Gestion des dépenses */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                Gestion des dépenses
                              </div>
                            </div>
                          </li>

                          {/* Gestion des stocks */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                Gestion des stocks
                              </div>
                            </div>
                          </li>

                          {/* Gestion des opportunités (uniquement pour Ventes et Global) */}
                          {(formuleActive === "Ventes" || formuleActive === "Global") && (
                            <li>
                              <div className="d-flex">
                                <div className={`flex-shrink-0 ${opportunitesText === "-" ? "text-muted" : "text-success"} me-1`}>
                                  <i className={`${opportunitesText === "-" ? "ri-close-circle-fill" : "ri-checkbox-circle-fill"} fs-15 align-middle`}></i>
                                </div>
                                <div className="flex-grow-1">
                                  Gestion des opportunités : <b>{opportunitesText}</b>
                                </div>
                              </div>
                            </li>
                          )}

                          {/* Gestion des commandes (uniquement pour Stock et Global) */}
                          {(formuleActive === "Stock" || formuleActive === "Global") && hasGestionCommandes && (
                            <li>
                              <div className="d-flex">
                                <div className="flex-shrink-0 text-success me-1">
                                  <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                                </div>
                                <div className="flex-grow-1">
                                  Gestion des commandes
                                </div>
                              </div>
                            </li>
                          )}

                          {/* Gestion des fournisseurs (uniquement pour Stock et Global) */}
                          {(formuleActive === "Stock" || formuleActive === "Global") && hasGestionFournisseurs && (
                            <li>
                              <div className="d-flex">
                                <div className="flex-shrink-0 text-success me-1">
                                  <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                                </div>
                                <div className="flex-grow-1">
                                  Gestion des fournisseurs
                                </div>
                              </div>
                            </li>
                          )}

                          {/* Collaboration */}
                          <li>
                            <div className="d-flex">
                              <div className={`flex-shrink-0 ${hasCollaboration ? "text-success" : "text-muted"} me-1`}>
                                <i className={`${hasCollaboration ? "ri-checkbox-circle-fill" : "ri-close-circle-fill"} fs-15 align-middle`}></i>
                              </div>
                              <div className="flex-grow-1">
                                Collaboration
                              </div>
                            </div>
                          </li>

                          {/* Notification de relances commerciales */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                Notification de relances commerciales
                              </div>
                            </div>
                          </li>

                          {/* Comptes d'entreprises */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                Compte d'entreprises : <b>{comptesEntreprisesText}</b>
                              </div>
                            </div>
                          </li>

                          {/* Rapports */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                Rapports (Exportez vos données en PDF ou Excel)
                              </div>
                            </div>
                          </li>

                          {/* Assistance et Support */}
                          <li>
                            <div className="d-flex">
                              <div className="flex-shrink-0 text-success me-1">
                                <i className="ri-checkbox-circle-fill fs-15 align-middle"></i>
                              </div>
                              <div className="flex-grow-1">
                                Assistance et Support
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-3 pt-2">
                        <Button
                          color={price.planButtonClassname}
                          className="w-100 rounded-pill"
                          onClick={() =>
                            startSubscriptionProcess(
                              formuleActive,
                              categorieCarte
                            )
                          }
                        >
                          {price.btntxt}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>

      {/* MODALS DU PROCESSUS D'ABONNEMENT */}

      {/* ÉTAPE 1 - Modal Période */}
      <Modal
        isOpen={step1PeriodeOpen}
        toggle={toggleStep1}
        centered
        modalClassName="border-0"
        contentClassName="rounded-4"
      >
        <ModalHeader
          toggle={toggleStep1}
          className="bg-info-subtle p-3 rounded-top-4"
        >
          <i className="ri-calendar-line me-2"></i>
          Choisissez votre période d'abonnement
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <p className="text-muted text-center">
              <strong>Formule :</strong> {selectedFormule} -{" "}
              <strong>Catégorie :</strong> {selectedCategorie}
            </p>
            <p className="text-muted text-center">
              <strong>Affichage :</strong> {showAnnualPricing ? "Prix annuels" : "Prix mensuels"}
            </p>
          </div>

          <div className="d-flex flex-column gap-2">
            {periodeOptions.map((periode) => {
              const tarif = calculateTarif(
                periode,
                selectedFormule,
                selectedCategorie
              );
              const dureeText = getDureeText(periode);

              return (
                <div
                  key={periode}
                  style={getPeriodeStyle(periode)}
                  onClick={() => handlePeriodeClick(periode)}
                  onMouseEnter={() => setHoveredPeriode(periode)}
                  onMouseLeave={() => setHoveredPeriode(null)}
                  className="position-relative"
                >
                  <div style={{ fontSize: "1.0rem", fontWeight: "bold" }}>
                    {periode}
                  </div>
                  <div style={getPriceStyle(periode)}>
                    {formatMontant(tarif)}
                  </div>
                  <div style={getDureeTextStyle(periode)}>{dureeText}</div>
                </div>
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            style={{ borderRadius: "70px" }}
            onClick={toggleStep1}
          >
            Annuler
          </Button>
        </ModalFooter>
      </Modal>

      {/* ÉTAPE 2 - Modal Code Promo */}
      <Modal
        isOpen={step2PromoOpen}
        toggle={toggleStep2}
        centered
        modalClassName="border-0"
        contentClassName="rounded-4"
      >
        <ModalHeader
          toggle={toggleStep2}
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
              <strong>Prix :</strong> {formatMontant(paymentData.tarif_module)}{" "}
             
            </p>
          </div>

          <div className="mb-3">
            <Label className="form-label fw-bold">Type de code promo</Label>
            <CustomSelect
              options={promoCodeOptions}
              value={
                promoCodeOptions.find(
                  (opt) => opt.value === (promoCode?.value || promoCode)
                ) || null
              }
              onChange={(selectedOption) => setPromoCode(selectedOption)}
              placeholder="Code Promo"
            />
          </div>

          {promoCode && (
            <div className="mb-3">
              <Label className="form-label fw-bold">
                Votre code{" "}
                {promoCode.value === "affiliation"
                  ? "d'affiliation"
                  : "de parrainage"}
              </Label>
              <Input
                type="text"
                placeholder={`Entrez votre code ${
                  promoCode.value === "affiliation"
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
              <i className="ri-check-line me-2"></i>
              Code vérifié ! Réduction de {promoCodeDiscount}% appliquée.
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            style={{ borderRadius: "70px" }}
            onClick={() => {
              setStep2PromoOpen(false);
              setStep1PeriodeOpen(true);
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

      {/* ÉTAPE 3 - Modal Paiement */}
      <Modal
        isOpen={step3PaiementOpen}
        toggle={toggleStep3}
        centered
        modalClassName="border-0"
        contentClassName="rounded-4"
      >
        <ModalHeader
          toggle={toggleStep3}
          className="bg-info-subtle p-3 rounded-top-4"
        >
          <i className="ri-file-list-line me-2"></i>
          Récapitulatif de votre abonnement
        </ModalHeader>
        <ModalBody>
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

          <div className="p-3 rounded bg-light mb-4">
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
                  <strong>Durée :</strong> {getDureeText(selectedPeriode)}
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
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mt-2">
                  <span>Réduction code promo :</span>
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
                    {promoCode.value === "affiliation"
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
              <h5>Paiement sécurisé</h5>
              <p className="text-muted">
                Cliquez sur le bouton ci-dessous pour procéder au paiement
              </p>
            </div>

            {fedaPayOptions && (
              <div className="d-flex justify-content-center rounded-pill">
                <FedaCheckoutButton options={fedaPayOptions} />
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
                  <span className="visually-hidden">
                    Traitement en cours...
                  </span>
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
              setStep3PaiementOpen(false);
              setStep2PromoOpen(true);
            }}
            disabled={paymentLoading}
          >
            <i className="ri-arrow-left-line me-1"></i>
            Retour
          </Button>
          <Button
            color="light"
            onClick={toggleStep3}
            style={{ borderRadius: "70px" }}
            disabled={paymentLoading}
          >
            Annuler
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default Pricing;