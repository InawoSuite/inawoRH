import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CustomSelect } from "../../../../Components/Common/CustomSelectStyles";
import {
  Container,
  Row,
  Col,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
  Card,
  CardBody,
  CardHeader,
  Alert,
  Table,
  Badge,
} from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from "yup";
import { useFormik } from "formik";
import { useProfile } from "../../../../Components/Hooks/UserHooks";
import { BaseUrl } from '../../../APIKey/ApiKey';

// Types d'immobilisations selon les spécifications
const IMMOBILISATION_TYPES = [
  { value: "corporel", label: "Corporel" },
  { value: "incorporel", label: "Incorporel" },
  { value: "financier", label: "Financier" },
];

// Méthodes d'amortissement
const AMORTISEMENT_METHODS = [
  { value: "lineaire", label: "Linéaire" },
  { value: "degressif", label: "Dégressif" },
  { value: "exceptionnel", label: "Exceptionnel" },
];

// Comptes d'actif (classe 21X)
const ACTIF_ACCOUNTS = [
  { value: "211", label: "211 - Terrains" },
  { value: "212", label: "212 - Constructions" },
  { value: "213", label: "213 - Installations techniques" },
  { value: "214", label: "214 - Matériel industriel" },
  { value: "215", label: "215 - Matériel de bureau" },
  { value: "216", label: "216 - Matériel informatique" },
  { value: "217", label: "217 - Matériel de transport" },
  { value: "218", label: "218 - Autres immobilisations corporelles" },
  { value: "221", label: "221 - Immobilisations incorporelles" },
  { value: "241", label: "241 - Titres de participation" },
  { value: "242", label: "242 - Autres titres immobilisés" },
  { value: "2411", label: "2411 - Matériel industriel spécifique" },
  { value: "2441", label: "2441 - Matériel de bureau spécifique" },
];

// Comptes d'amortissement (classe 28X)
const AMORTISEMENT_ACCOUNTS = [
  { value: "281", label: "281 - Amortissements des constructions" },
  { value: "282", label: "282 - Amortissements des installations" },
  { value: "283", label: "283 - Amortissements du matériel industriel" },
  { value: "284", label: "284 - Amortissements du matériel de bureau" },
  { value: "285", label: "285 - Amortissements du matériel informatique" },
  { value: "286", label: "286 - Amortissements du matériel de transport" },
  { value: "287", label: "287 - Amortissements des autres immobilisations" },
  { value: "28154", label: "28154 - Amortissements matériel spécifique" },
];

// Comptes de charge (classe 68X)
const CHARGE_ACCOUNTS = [
  { value: "6811", label: "6811 - Dotations aux amortissements des immobilisations" },
  { value: "68111", label: "68111 - Dotations aux amortissements des constructions" },
  { value: "68112", label: "68112 - Dotations aux amortissements des installations" },
  { value: "68113", label: "68113 - Dotations aux amortissements du matériel industriel" },
  { value: "68114", label: "68114 - Dotations aux amortissements du matériel de bureau" },
  { value: "68115", label: "68115 - Dotations aux amortissements du matériel informatique" },
  { value: "68116", label: "68116 - Dotations aux amortissements du matériel de transport" },
  { value: "68117", label: "68117 - Dotations aux amortissements des autres immobilisations" },
];

const ImmobilisationCreate = ({ switchToList, immobilisationToEdit }) => {
  const { t } = useTranslation();
  
  const isEdit = !!immobilisationToEdit;
  const { userProfile, token } = useProfile();
  const [loading, setLoading] = useState(false);

  // ✅ Fonction pour calculer le taux d'amortissement automatique
  const calculateAmortissementRate = (duree) => {
    if (!duree || duree <= 0) return 0;
    return (100 / duree).toFixed(2);
  };

  // ✅ Fonction pour calculer l'amortissement annuel
  const calculateAnnualAmortissement = (valeur, taux) => {
    if (!valeur || !taux) return 0;
    return (valeur * (taux / 100)).toFixed(2);
  };

  // ✅ Validation du formulaire avec Yup selon les spécifications
  const validationSchema = Yup.object({
    designation: Yup.string()
      .required("Le nom de l'actif est obligatoire")
      .min(3, "Le nom doit contenir au moins 3 caractères")
      .max(200, "Le nom ne peut dépasser 200 caractères"),
    
    code: Yup.string()
      .required("Le code est obligatoire")
      .matches(/^[A-Z0-9-]+$/, "Le code doit être alphanumérique")
      .min(2, "Le code doit contenir au moins 2 caractères")
      .max(50, "Le code ne peut dépasser 50 caractères"),
    
    type_immobilisation: Yup.string()
      .required("Le type d'immobilisation est obligatoire")
      .oneOf(["corporel", "incorporel", "financier"], "Type d'immobilisation invalide"),
    
    compte_actif: Yup.string()
      .required("Le compte d'actif est obligatoire")
      .matches(/^2[0-9]+$/, "Le compte d'actif doit commencer par 2"),
    
    date_acquisition: Yup.date()
      .required("La date d'acquisition est obligatoire")
      .max(new Date(), "La date ne peut pas être dans le futur"),
    
    valeur_origine: Yup.number()
      .required("La valeur d'origine est obligatoire")
      .min(0.01, "La valeur doit être supérieure à 0")
      .typeError("Veuillez entrer un montant valide"),
    
    duree_amortissement: Yup.number()
      .required("La durée d'amortissement est obligatoire")
      .min(1, "La durée doit être d'au moins 1 an")
      .max(100, "La durée ne peut dépasser 100 ans")
      .integer("La durée doit être un nombre entier")
      .typeError("Veuillez entrer un nombre d'années valide"),
    
    taux_amortissement: Yup.number()
      .required("Le taux d'amortissement est obligatoire")
      .min(0.01, "Le taux doit être supérieur à 0%")
      .max(100, "Le taux ne peut dépasser 100%")
      .typeError("Veuillez entrer un pourcentage valide"),
    
    methode_amortissement: Yup.string()
      .required("La méthode d'amortissement est obligatoire")
      .oneOf(["lineaire", "degressif", "exceptionnel"], "Méthode d'amortissement invalide"),
    
    compte_amortissement: Yup.string()
      .required("Le compte d'amortissement est obligatoire")
      .matches(/^28[0-9]+$/, "Le compte d'amortissement doit commencer par 28"),
    
    compte_charge: Yup.string()
      .required("Le compte de charge est obligatoire")
      .matches(/^68[0-9]+$/, "Le compte de charge doit commencer par 68"),
    
    localisation: Yup.string()
      .max(200, "La localisation ne peut dépasser 200 caractères"),
    
    responsable: Yup.string()
      .max(100, "Le nom du responsable ne peut dépasser 100 caractères"),
    
    fournisseur: Yup.string()
      .max(200, "Le nom du fournisseur ne peut dépasser 200 caractères"),
    
    numero_serie: Yup.string()
      .max(100, "Le numéro de série ne peut dépasser 100 caractères"),
    
    observations: Yup.string()
      .max(500, "Les observations ne peuvent dépasser 500 caractères"),
  });

  // ✅ Formik pour la gestion du formulaire
  const formik = useFormik({
    initialValues: {
      designation: "",
      code: "",
      type_immobilisation: "",
      compte_actif: "",
      date_acquisition: new Date().toISOString().split('T')[0],
      valeur_origine: "",
      duree_amortissement: "",
      taux_amortissement: "",
      methode_amortissement: "",
      compte_amortissement: "",
      compte_charge: "",
      date_mise_service: "",
      localisation: "",
      responsable: "",
      fournisseur: "",
      numero_serie: "",
      observations: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      await handleSubmitImmobilisation(values, resetForm, setSubmitting);
    }
  });

  // ✅ Effet pour charger les données en mode édition
  useEffect(() => {
    if (immobilisationToEdit) {
      formik.setValues({
        designation: immobilisationToEdit.designation || "",
        code: immobilisationToEdit.code || "",
        type_immobilisation: immobilisationToEdit.type_immobilisation || "",
        compte_actif: immobilisationToEdit.compte_actif || "",
        date_acquisition: immobilisationToEdit.date_acquisition || new Date().toISOString().split('T')[0],
        valeur_origine: immobilisationToEdit.valeur_origine || "",
        duree_amortissement: immobilisationToEdit.duree_amortissement || "",
        taux_amortissement: immobilisationToEdit.taux_amortissement || "",
        methode_amortissement: immobilisationToEdit.methode_amortissement || "",
        compte_amortissement: immobilisationToEdit.compte_amortissement || "",
        compte_charge: immobilisationToEdit.compte_charge || "",
        date_mise_service: immobilisationToEdit.date_mise_service || "",
        localisation: immobilisationToEdit.localisation || "",
        responsable: immobilisationToEdit.responsable || "",
        fournisseur: immobilisationToEdit.fournisseur || "",
        numero_serie: immobilisationToEdit.numero_serie || "",
        observations: immobilisationToEdit.observations || "",
      });
    }
  }, [immobilisationToEdit]);

  // ✅ Effet pour calculer automatiquement le taux d'amortissement
  useEffect(() => {
    if (formik.values.duree_amortissement && !formik.values.taux_amortissement) {
      const taux = calculateAmortissementRate(parseFloat(formik.values.duree_amortissement));
      formik.setFieldValue('taux_amortissement', taux);
    }
  }, [formik.values.duree_amortissement]);

  // ✅ Fonction de soumission
  const handleSubmitImmobilisation = async (values, resetForm, setSubmitting) => {
    if (!token) {
      toast.error("Token d'authentification manquant");
      return;
    }

    setLoading(true);
    
    // Calculs complémentaires
    const tauxAmortissement = parseFloat(values.taux_amortissement) || 0;
    const valeurOrigine = parseFloat(values.valeur_origine) || 0;
    const amortissementAnnuel = calculateAnnualAmortissement(valeurOrigine, tauxAmortissement);
    
    const payload = {
      ...values,
      valeur_origine: valeurOrigine,
      taux_amortissement: tauxAmortissement,
      amortissement_annuel: amortissementAnnuel,
      cumul_amortissement: 0, // Initialisé à 0 pour une nouvelle immobilisation
      valeur_comptable: valeurOrigine, // Valeur comptable initiale = valeur d'origine
      statut: "actif", // Par défaut, l'immobilisation est active
      createur: userProfile?.username || "Utilisateur",
      date_creation: new Date().toISOString(),
      date_mise_service: values.date_mise_service || values.date_acquisition,
    };

    // ROUTE API pour créer/modifier une immobilisation
    const endpoint = `${BaseUrl}/immobilisations/`;
    const url = isEdit && immobilisationToEdit
      ? `${endpoint}${immobilisationToEdit.id}/`
      : endpoint;
    
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: "Erreur lors de la requête" 
        }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      toast.success(isEdit ? "Immobilisation modifiée avec succès!" : "Immobilisation créée avec succès!");
      
      resetForm();
      
      // Rediriger vers la liste après succès
      if (switchToList) {
        setTimeout(() => {
          switchToList();
        }, 1500);
      }
      
    } catch (err) {
      console.error(`Erreur lors de ${isEdit ? 'la modification' : 'la création'} de l'immobilisation:`, err);
      toast.error(err.message || `Erreur lors de ${isEdit ? 'la modification' : 'la création'} de l'immobilisation`);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  // ✅ Calcul de l'amortissement annuel pour affichage
  const amortissementAnnuel = useMemo(() => {
    const valeur = parseFloat(formik.values.valeur_origine) || 0;
    const taux = parseFloat(formik.values.taux_amortissement) || 0;
    return calculateAnnualAmortissement(valeur, taux);
  }, [formik.values.valeur_origine, formik.values.taux_amortissement]);

  // ✅ Formatage des montants
  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <BreadCrumb
            title={isEdit ? "Modifier une immobilisation" : "Créer une nouvelle immobilisation"}
            pageTitle={
              <>
                <i className="ri-building-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              <Form onSubmit={formik.handleSubmit}>
                {/* Section 1 : ÉLÉMENTS À CRÉER - Informations obligatoires */}
                <Card className="mb-4 border-0 shadow-sm rounded-4">
                  <CardHeader className="rounded-top-4">
                    <h5 className="mb-0">
                      {/* <i className="ri-add-circle-line me-2 text-success"></i> */}
                      ÉLÉMENTS À CRÉER
                      {/* <Badge color="danger" className="ms-2">Tous les champs sont obligatoires</Badge> */}
                    </h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      {/* Nom de l'actif */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="designation" className="form-label fw-semibold">
                            Nom de l'actif 
                          </Label>
                          <Input
                            id="designation"
                            name="designation"
                            type="text"
                            placeholder="Désignation complète (Ex: Véhicule utilitaire n°1, Serveur informatique principal...)"
                            className="rounded-pill"
                            value={formik.values.designation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.designation && Boolean(formik.errors.designation)}
                          />
                          {formik.touched.designation && formik.errors.designation && (
                            <FormFeedback>{formik.errors.designation}</FormFeedback>
                          )}
                          <small className="text-muted">Désignation complète de l'actif immobilisé</small>
                        </div>
                      </Col>

                      {/* Code */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="code" className="form-label fw-semibold">
                            Code 
                          </Label>
                          <Input
                            id="code"
                            name="code"
                            type="text"
                            placeholder="Référence interne unique (Ex: IMM-2024-001, VEH-001...)"
                            className="rounded-pill"
                            value={formik.values.code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.code && Boolean(formik.errors.code)}
                          />
                          {formik.touched.code && formik.errors.code && (
                            <FormFeedback>{formik.errors.code}</FormFeedback>
                          )}
                          <small className="text-muted">Référence interne unique alphanumérique</small>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      {/* Type d'immobilisation */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="type_immobilisation" className="form-label fw-semibold">
                            Type d'immobilisation 
                          </Label>
                          <CustomSelect
                            value={IMMOBILISATION_TYPES.find(opt => opt.value === formik.values.type_immobilisation) || null}
                            onChange={(selectedOption) => {
                              formik.setFieldValue('type_immobilisation', selectedOption ? selectedOption.value : '');
                            }}
                            options={IMMOBILISATION_TYPES}
                            placeholder="Choix entre corporel, incorporel, financier"
                            isClearable={false}
                          />
                          {formik.touched.type_immobilisation && formik.errors.type_immobilisation && (
                            <div className="invalid-feedback d-block">{formik.errors.type_immobilisation}</div>
                          )}
                          <small className="text-muted">Classification comptable de l'immobilisation</small>
                        </div>
                      </Col>

                      {/* Compte d'actif */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="compte_actif" className="form-label fw-semibold">
                            Compte d'actif (21X) 
                          </Label>
                          <CustomSelect
                            value={ACTIF_ACCOUNTS.find(opt => opt.value === formik.values.compte_actif) || null}
                            onChange={(selectedOption) => {
                              formik.setFieldValue('compte_actif', selectedOption ? selectedOption.value : '');
                            }}
                            options={ACTIF_ACCOUNTS}
                            placeholder="Ex: 2411 (Matériel industriel), 2441 (Matériel de bureau)"
                            isClearable={false}
                          />
                          {formik.touched.compte_actif && formik.errors.compte_actif && (
                            <div className="invalid-feedback d-block">{formik.errors.compte_actif}</div>
                          )}
                          <small className="text-muted">Compte de bilan (classe 2) pour l'enregistrement de l'actif</small>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      {/* Date d'acquisition */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="date_acquisition" className="form-label fw-semibold">
                            Date d'acquisition 
                          </Label>
                          <Input
                            id="date_acquisition"
                            name="date_acquisition"
                            type="date"
                            className="rounded-pill"
                            value={formik.values.date_acquisition}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.date_acquisition && Boolean(formik.errors.date_acquisition)}
                          />
                          {formik.touched.date_acquisition && formik.errors.date_acquisition && (
                            <FormFeedback>{formik.errors.date_acquisition}</FormFeedback>
                          )}
                          <small className="text-muted">Jour précis de l'entrée en fonction</small>
                        </div>
                      </Col>

                      {/* Valeur d'origine (HT) */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="valeur_origine" className="form-label fw-semibold">
                            Valeur d'origine (HT) 
                          </Label>
                          <div className="input-group">
                            <Input
                              id="valeur_origine"
                              name="valeur_origine"
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              className="rounded-start-pill"
                              value={formik.values.valeur_origine}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              invalid={formik.touched.valeur_origine && Boolean(formik.errors.valeur_origine)}
                            />
                            <span className="input-group-text rounded-end-pill"></span>
                          </div>
                          {formik.touched.valeur_origine && formik.errors.valeur_origine && (
                            <FormFeedback>{formik.errors.valeur_origine}</FormFeedback>
                          )}
                          <small className="text-muted">Le montant qui sera amorti (hors taxes)</small>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      {/* Durée d'amortissement */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="duree_amortissement" className="form-label fw-semibold">
                            Durée d'amortissement 
                          </Label>
                          <div className="input-group">
                            <Input
                              id="duree_amortissement"
                              name="duree_amortissement"
                              type="number"
                              min="1"
                              placeholder="5"
                              className="rounded-start-pill"
                              value={formik.values.duree_amortissement}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              invalid={formik.touched.duree_amortissement && Boolean(formik.errors.duree_amortissement)}
                            />
                            <span className="input-group-text rounded-end-pill">années</span>
                          </div>
                          {formik.touched.duree_amortissement && formik.errors.duree_amortissement && (
                            <FormFeedback>{formik.errors.duree_amortissement}</FormFeedback>
                          )}
                          <small className="text-muted">Durée de vie utile de l'actif (Ex: 5 ans, 10 ans)</small>
                        </div>
                      </Col>

                      {/* Taux d'amortissement */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="taux_amortissement" className="form-label fw-semibold">
                            Taux d'amortissement 
                          </Label>
                          <div className="input-group">
                            <Input
                              id="taux_amortissement"
                              name="taux_amortissement"
                              type="number"
                              step="0.01"
                              min="0.01"
                              max="100"
                              placeholder="20.00"
                              className="rounded-start-pill"
                              value={formik.values.taux_amortissement}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              invalid={formik.touched.taux_amortissement && Boolean(formik.errors.taux_amortissement)}
                            />
                            <span className="input-group-text rounded-end-pill">%</span>
                          </div>
                          {formik.touched.taux_amortissement && formik.errors.taux_amortissement && (
                            <FormFeedback>{formik.errors.taux_amortissement}</FormFeedback>
                          )}
                          <small className="text-muted">
                            Calcul automatique : 1/Durée = {calculateAmortissementRate(parseFloat(formik.values.duree_amortissement) || 0)}% pour {formik.values.duree_amortissement || "?"} ans
                          </small>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      {/* Méthode d'amortissement */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="methode_amortissement" className="form-label fw-semibold">
                            Méthode d'amortissement 
                          </Label>
                          <CustomSelect
                            value={AMORTISEMENT_METHODS.find(opt => opt.value === formik.values.methode_amortissement) || null}
                            onChange={(selectedOption) => {
                              formik.setFieldValue('methode_amortissement', selectedOption ? selectedOption.value : '');
                            }}
                            options={AMORTISEMENT_METHODS}
                            placeholder="Ex: Linéaire (le plus courant), Dégressif"
                            isClearable={false}
                          />
                          {formik.touched.methode_amortissement && formik.errors.methode_amortissement && (
                            <div className="invalid-feedback d-block">{formik.errors.methode_amortissement}</div>
                          )}
                          <small className="text-muted">Méthode de calcul de l'amortissement</small>
                        </div>
                      </Col>

                      {/* Compte d'amortissement */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="compte_amortissement" className="form-label fw-semibold">
                            Compte d'amortissement (28X) 
                          </Label>
                          <CustomSelect
                            value={AMORTISEMENT_ACCOUNTS.find(opt => opt.value === formik.values.compte_amortissement) || null}
                            onChange={(selectedOption) => {
                              formik.setFieldValue('compte_amortissement', selectedOption ? selectedOption.value : '');
                            }}
                            options={AMORTISEMENT_ACCOUNTS}
                            placeholder="Compte de bilan (Ex: 28154)"
                            isClearable={false}
                          />
                          {formik.touched.compte_amortissement && formik.errors.compte_amortissement && (
                            <div className="invalid-feedback d-block">{formik.errors.compte_amortissement}</div>
                          )}
                          <small className="text-muted">Compte de contrepartie pour l'amortissement</small>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      {/* Compte de charge */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="compte_charge" className="form-label fw-semibold">
                            Compte de charge (68X) 
                          </Label>
                          <CustomSelect
                            value={CHARGE_ACCOUNTS.find(opt => opt.value === formik.values.compte_charge) || null}
                            onChange={(selectedOption) => {
                              formik.setFieldValue('compte_charge', selectedOption ? selectedOption.value : '');
                            }}
                            options={CHARGE_ACCOUNTS}
                            placeholder="Compte de résultat (Ex: 6811)"
                            isClearable={false}
                          />
                          {formik.touched.compte_charge && formik.errors.compte_charge && (
                            <div className="invalid-feedback d-block">{formik.errors.compte_charge}</div>
                          )}
                          <small className="text-muted">Compte de résultat pour les dotations aux amortissements</small>
                        </div>
                      </Col>

                      {/* Date de mise en service */}
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="date_mise_service" className="form-label fw-semibold">
                            Date de mise en service
                          </Label>
                          <Input
                            id="date_mise_service"
                            name="date_mise_service"
                            type="date"
                            className="rounded-pill"
                            value={formik.values.date_mise_service}
                            onChange={formik.handleChange}
                          />
                          <small className="text-muted">Date effective d'utilisation (par défaut = date d'acquisition)</small>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                {/* Section 2 : Informations complémentaires */}
                {/* <Card className="mb-4 border-0 shadow-sm">
                  <CardHeader className="bg-light">
                    <h5 className="mb-0">
                      <i className="ri-information-line me-2 text-info"></i>
                      INFORMATIONS COMPLÉMENTAIRES (Optionnelles)
                    </h5>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="localisation" className="form-label fw-semibold">
                            Localisation
                          </Label>
                          <Input
                            id="localisation"
                            name="localisation"
                            type="text"
                            placeholder="Ex: Siège social, Service informatique, Agence de Libreville..."
                            className="rounded-pill"
                            value={formik.values.localisation}
                            onChange={formik.handleChange}
                          />
                          <small className="text-muted">Emplacement physique de l'immobilisation</small>
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="responsable" className="form-label fw-semibold">
                            Responsable
                          </Label>
                          <Input
                            id="responsable"
                            name="responsable"
                            type="text"
                            placeholder="Ex: Jean Dupont, Service comptabilité..."
                            className="rounded-pill"
                            value={formik.values.responsable}
                            onChange={formik.handleChange}
                          />
                          <small className="text-muted">Personne en charge de l'immobilisation</small>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="fournisseur" className="form-label fw-semibold">
                            Fournisseur
                          </Label>
                          <Input
                            id="fournisseur"
                            name="fournisseur"
                            type="text"
                            placeholder="Ex: Toyota Gabon, Dell Technologies..."
                            className="rounded-pill"
                            value={formik.values.fournisseur}
                            onChange={formik.handleChange}
                          />
                          <small className="text-muted">Entreprise ou vendeur de l'immobilisation</small>
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="numero_serie" className="form-label fw-semibold">
                            Numéro de série / Immatriculation
                          </Label>
                          <Input
                            id="numero_serie"
                            name="numero_serie"
                            type="text"
                            placeholder="Ex: VH-2024-001, SRV-001, BAT-A1..."
                            className="rounded-pill"
                            value={formik.values.numero_serie}
                            onChange={formik.handleChange}
                          />
                          <small className="text-muted">Identifiant unique du matériel</small>
                        </div>
                      </Col>
                    </Row>

                    <div className="mb-3">
                      <Label htmlFor="observations" className="form-label fw-semibold">
                        Observations
                      </Label>
                      <Input
                        id="observations"
                        name="observations"
                        type="textarea"
                        rows="3"
                        placeholder="Notes complémentaires, spécifications techniques, garantie, maintenance..."
                        className="rounded"
                        value={formik.values.observations}
                        onChange={formik.handleChange}
                      />
                      <small className="text-muted">Informations supplémentaires importantes</small>
                    </div>
                  </CardBody>
                </Card> */}

                Section 3 : Récapitulatif et calculs
                <Card className="mb-4 border-0 shadow-sm rounded-4">
                  <CardHeader className="rounded-top-4">
                    <h5 className="mb-0">
                      {/* <i className="ri-calculator-line me-2 text-warning"></i> */}
                      RÉCAPITULATIF ET CALCULS AUTOMATIQUES
                    </h5>
                  </CardHeader>
                  <CardBody>
                    {formik.values.valeur_origine && formik.values.taux_amortissement && (
                      <div className="alert alert-success">
                        <h6 className="alert-heading">
                          <i className="ri-checkbox-circle-line me-2"></i>
                          Calculs d'amortissement
                        </h6>
                        <Table bordered size="sm" className="mb-0">
                          <tbody>
                            <tr>
                              <td><strong>Valeur d'origine :</strong></td>
                              <td className="text-end fw-bold">{formatMontant(parseFloat(formik.values.valeur_origine))} </td>
                            </tr>
                            <tr>
                              <td><strong>Taux d'amortissement :</strong></td>
                              <td className="text-end fw-bold">{parseFloat(formik.values.taux_amortissement).toFixed(2)}%</td>
                            </tr>
                            <tr>
                              <td><strong>Amortissement annuel :</strong></td>
                              <td className="text-end fw-bold">{formatMontant(parseFloat(amortissementAnnuel))} </td>
                            </tr>
                            <tr>
                              <td><strong>Durée d'amortissement :</strong></td>
                              <td className="text-end fw-bold">{formik.values.duree_amortissement} années</td>
                            </tr>
                            <tr className="table-active">
                              <td><strong>Valeur résiduelle après amortissement :</strong></td>
                              <td className="text-end fw-bold">0 </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    )}
                    
                    {/* Informations de comptabilité */}
                    {/* <div className="alert alert-info rounded-4">
                      <h6 className="alert-heading">
                        <i className="ri-information-line me-2"></i>
                        Impact comptable de cette immobilisation
                      </h6>
                      <ul className="mb-0">
                        <li><strong>Au bilan :</strong> Compte {formik.values.compte_actif || "2xxx"} (Actif immobilisé)</li>
                        <li><strong>Contrepartie :</strong> Compte {formik.values.compte_amortissement || "28xxx"} (Amortissements cumulés)</li>
                        <li><strong>Au compte de résultat :</strong> Dotation annuelle de {formatMontant(parseFloat(amortissementAnnuel))}  au compte {formik.values.compte_charge || "68xxx"}</li>
                        <li><strong>Effet fiscal :</strong> Réduction du résultat imposable de {formatMontant(parseFloat(amortissementAnnuel))}  par an</li>
                      </ul>
                    </div> */}
                  </CardBody>
                </Card>

                {/* Boutons d'action */}
                <div className="d-flex justify-content-between g-2 mt-4 mb-4">
                  <Button
                    type="button"
                    className="btn btn-light rounded-pill"
                    onClick={switchToList}
                  >
                    <i className="ri-arrow-left-line me-1"></i>
                    Retour à la liste
                  </Button>
                  
                  <div className="d-flex g-2">
                    <Button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill me-2"
                      onClick={() => formik.resetForm()}
                      disabled={loading}
                    >
                      <i className="ri-eraser-line me-1"></i>
                      Réinitialiser le formulaire
                    </Button>
                    
                    <Button
                      type="submit"
                      className="btn btn-success rounded-pill"
                      disabled={loading || !formik.isValid || formik.isSubmitting}
                    >
                      {loading || formik.isSubmitting ? (
                        <>
                          <i className="ri-loader-4-line me-1 spinner"></i>
                          {isEdit ? "Modification en cours..." : "Création en cours..."}
                        </>
                      ) : (
                        <>
                          <i className={isEdit ? "ri-save-line me-1" : "ri-add-line me-1"}></i>
                          {isEdit ? "Enregistrer les modifications" : "Créer l'immobilisation"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ImmobilisationCreate;