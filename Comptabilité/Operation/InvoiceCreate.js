  import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
  import TableContainer from "../../../../Components/Common/TableContainer";
  import { Link } from "react-router-dom";
  import { useTranslation } from "react-i18next";
  import Loader from "../../../../Components/Common/Loader";
  import EmptyDataCard from "../../../../Components/Common/EmptyDataCard";
  import DeleteModal from "../../../../Components/Common/DeleteModal";
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
    Badge,
    Table,
    Card,
    CardBody,
    CardHeader,
  } from "reactstrap";
  import BreadCrumb from "../../../../Components/Common/BreadCrumb";
  import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
  import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
  import Pagination from "../../../../Components/Common/Pagination";
  import { toast, ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import * as Yup from "yup";
  import { useFormik } from "formik";
  import { useProfile } from "../../../../Components/Hooks/UserHooks";
  import { BaseUrl } from '../../../APIKey/ApiKey';

  // Statuts des opérations
  const OPERATION_STATUS = [
    { value: "brouillon", label: "Brouillon" },
    { value: "valide", label: "Validé" },
    { value: "annule", label: "Annulé" },
  ];

  // Types de journaux
  const JOURNAL_TYPES = [
    { value: "ACH", label: "Achats" },
    { value: "VTE", label: "Ventes" },
    { value: "BQ1", label: "Banque" },
    { value: "OD", label: "Opérations diverses" },
    { value: "CSH", label: "Caisse" },
  ];

  // Comptes prédéfinis
  const PREDEFINED_ACCOUNTS = [
    { value: "411", label: "411 - Clients" },
    { value: "401", label: "401 - Fournisseurs" },
    { value: "601", label: "601 - Achats de marchandises" },
    { value: "701", label: "701 - Ventes de marchandises" },
    { value: "512", label: "512 - Banque" },
    { value: "531", label: "531 - Caisse" },
    { value: "4452", label: "4452 - TVA collectée" },
    { value: "4456", label: "4456 - TVA déductible" },
    { value: "681", label: "681 - Dotations aux amortissements" },
    { value: "101", label: "101 - Capital" },
  ];

  const InvoiceCreate = ({ switchToList, operationToEdit }) => {
    const { t } = useTranslation();
    
    // États principaux
    const [InvoiceCreateData, setInvoiceCreateData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userProfile, token } = useProfile();
    
    // États pour les lignes d'écriture (partie double)
    const [lignesEcriture, setLignesEcriture] = useState([
      { id: 1, compte: "", libelle: "", debit: "", credit: "" },
      { id: 2, compte: "", libelle: "", debit: "", credit: "" }
    ]);

    const fileInputRef = useRef(null);
    const isEdit = !!operationToEdit;

    // ✅ Options pour les journaux (format CustomSelect)
    const journalOptions = useMemo(() => 
      JOURNAL_TYPES.map(journal => ({
        value: journal.value,
        label: `${journal.value} - ${journal.label}`
      }))
    , []);

    // ✅ Options pour les comptes (format CustomSelect)
    const compteOptions = useMemo(() => 
      PREDEFINED_ACCOUNTS.map(account => ({
        value: account.value,
        label: account.label
      }))
    , []);

    // ✅ Chargement initial des données de l'opération à modifier
    useEffect(() => {
      if (operationToEdit) {
        // Charger les données de l'opération à modifier
        formik.setValues({
          date: operationToEdit.date || new Date().toISOString().split('T')[0],
          code_journal: operationToEdit.code_journal || '',
          reference: operationToEdit.reference || '',
          libelle: operationToEdit.libelle || '',
          piece_jointe: operationToEdit.piece_jointe || null,
        });
        
        // Charger les lignes d'écriture si disponibles
        if (operationToEdit.lignes_ecriture && Array.isArray(operationToEdit.lignes_ecriture)) {
          setLignesEcriture(operationToEdit.lignes_ecriture.map((ligne, index) => ({
            id: index + 1,
            compte: ligne.compte || '',
            libelle: ligne.libelle || '',
            debit: ligne.debit || '',
            credit: ligne.credit || '',
          })));
        } else {
          // Sinon, créer une ligne débit et une ligne crédit à partir des données de base
          setLignesEcriture([
            { 
              id: 1, 
              compte: operationToEdit.compte || '', 
              libelle: operationToEdit.libelle || '', 
              debit: operationToEdit.debit || '', 
              credit: '' 
            },
            { 
              id: 2, 
              compte: '', 
              libelle: 'Contrepartie', 
              debit: '', 
              credit: operationToEdit.credit || '' 
            }
          ]);
        }
      }
    }, [operationToEdit]);

    //  Validation du formulaire avec Yup
    const validationSchema = Yup.object({
      date: Yup.date()
        .required("La date de l'écriture est requise"),
      code_journal: Yup.string()
        .required("Le journal est requis")
        .oneOf(JOURNAL_TYPES.map(j => j.value), "Journal invalide"),
      reference: Yup.string()
        .required("La référence est requise")
        .min(3, "La référence doit contenir au moins 3 caractères"),
      libelle: Yup.string()
        .required("Le libellé est requis")
        .min(5, "Le libellé doit contenir au moins 5 caractères"),
    });

    //  Formik pour la gestion du formulaire
    const formik = useFormik({
      initialValues: {
        date: new Date().toISOString().split('T')[0], // Date du jour par défaut
        code_journal: '',
        reference: '',
        libelle: '',
        piece_jointe: null,
      },
      validationSchema,
      enableReinitialize: true,
      onSubmit: async (values, { resetForm, setSubmitting }) => {
        await handleSubmitOperation(values, resetForm, setSubmitting);
      }
    });

    // ✅ Fonction pour ajouter une ligne d'écriture
    const addLigneEcriture = () => {
      const newId = lignesEcriture.length > 0 ? Math.max(...lignesEcriture.map(l => l.id)) + 1 : 1;
      setLignesEcriture([...lignesEcriture, { 
        id: newId, 
        compte: "", 
        libelle: "", 
        debit: "", 
        credit: "" 
      }]);
    };

    // ✅ Fonction pour supprimer une ligne d'écriture
    const removeLigneEcriture = (id) => {
      if (lignesEcriture.length > 2) {
        setLignesEcriture(lignesEcriture.filter(ligne => ligne.id !== id));
      } else {
        toast.warning("Une opération doit avoir au moins deux lignes d'écriture (débit et crédit)");
      }
    };

    // ✅ Fonction pour mettre à jour une ligne d'écriture
    const updateLigneEcriture = (id, field, value) => {
      setLignesEcriture(lignesEcriture.map(ligne => 
        ligne.id === id ? { ...ligne, [field]: value } : ligne
      ));
    };

    // ✅ Vérifier l'équilibre débit/crédit
    const verifierEquilibre = useCallback(() => {
      const totalDebit = lignesEcriture.reduce((sum, ligne) => sum + (parseFloat(ligne.debit) || 0), 0);
      const totalCredit = lignesEcriture.reduce((sum, ligne) => sum + (parseFloat(ligne.credit) || 0), 0);
      
      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return {
          equilibre: false,
          message: `Déséquilibre détecté : Débit = ${formatMontant(totalDebit)}, Crédit = ${formatMontant(totalCredit)}`
        };
      }
      
      return { 
        equilibre: true, 
        totalDebit, 
        totalCredit,
        message: `Équilibre vérifié : Débit = Crédit = ${formatMontant(totalDebit)}`
      };
    }, [lignesEcriture]);

    // ✅ Fonction de soumission optimisée
    const handleSubmitOperation = async (values, resetForm, setSubmitting) => {
      if (!token) {
        toast.error("Token d'authentification manquant");
        return;
      }

      // Vérifier l'équilibre débit/crédit
      const equilibre = verifierEquilibre();
      if (!equilibre.equilibre) {
        toast.error(equilibre.message);
        return;
      }

      // Vérifier qu'il y a au moins 2 lignes
      if (lignesEcriture.length < 2) {
        toast.error("Une opération doit avoir au moins deux lignes d'écriture (débit et crédit)");
        return;
      }

      const payload = {
        ...values,
        lignes_ecriture: lignesEcriture.map(ligne => ({
          compte: ligne.compte,
          libelle: ligne.libelle,
          debit: parseFloat(ligne.debit) || 0,
          credit: parseFloat(ligne.credit) || 0,
        })),
        total_debit: equilibre.totalDebit,
        total_credit: equilibre.totalCredit,
        statut: "brouillon", // Par défaut, toutes les écritures sont au brouillon
        createur: userProfile?.username || "Utilisateur",
        date_creation: new Date().toISOString(),
      };

      // ROUTE API pour créer/modifier une opération
      const endpoint = `${BaseUrl}/compta/operations/`;
      const url = isEdit && operationToEdit
        ? `${endpoint}${operationToEdit.id}/`
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

        toast.success(isEdit ? "Opération modifiée avec succès!" : "Opération ajoutée avec succès!");
        resetForm();
        setLignesEcriture([
          { id: 1, compte: "", libelle: "", debit: "", credit: "" },
          { id: 2, compte: "", libelle: "", debit: "", credit: "" }
        ]);
        
        // Rediriger vers la liste après succès
        if (switchToList) {
          switchToList();
        }
        
      } catch (err) {
        console.error(`Erreur lors de ${isEdit ? 'la modification' : 'l\'ajout'} de l'opération:`, err);
        toast.error(err.message || `Erreur lors de ${isEdit ? 'la modification' : 'l\'ajout'} de l'opération`);
      } finally {
        setSubmitting(false);
      }
    };

    // ✅ Fonction pour formater les montants
    const formatMontant = useCallback((montant) => {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(montant || 0);
    }, []);

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
              title={isEdit ? "Modifier une opération" : "Créer une nouvelle opération"}
              pageTitle={
                <>
                  <i className="ri-file-list-3-line me-1 align-bottom"></i>
                  &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
                </>
              }
            />

            <Row>
              <Col lg={12}>
                <Form onSubmit={formik.handleSubmit}>
                  {/* Section 1 : Informations générales */}
                  <Card className="mb-4 border-0 shadow-sm rounded-4">
                    <CardHeader className="rounded-top-4">
                      <h5 className="mb-0">
                        {/* <i className="ri-information-line me-2"></i> */}
                        {isEdit ? "Modifier l'opération" : "Créer une nouvelle opération"}
                      </h5>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md={4}>
                          <div className="mb-3">
                            <Label htmlFor="date" className="form-label fw-semibold">
                              Date de l'écriture <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="date"
                              name="date"
                              type="date"
                              className="rounded-pill"
                              value={formik.values.date}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              invalid={formik.touched.date && Boolean(formik.errors.date)}
                            />
                            {formik.touched.date && formik.errors.date && (
                              <FormFeedback>{formik.errors.date}</FormFeedback>
                            )}
                          </div>
                        </Col>
                        
                        <Col md={4}>
                          <div className="mb-3">
                            <Label htmlFor="code_journal" className="form-label fw-semibold">
                              Journal <span className="text-danger">*</span>
                            </Label>
                            <CustomSelect
                              value={journalOptions.find(opt => opt.value === formik.values.code_journal) || null}
                              onChange={(selectedOption) => {
                                formik.setFieldValue('code_journal', selectedOption ? selectedOption.value : '');
                              }}
                              options={journalOptions}
                              placeholder="Sélectionnez un journal"
                              isClearable={false}
                            />
                            {formik.touched.code_journal && formik.errors.code_journal && (
                              <div className="invalid-feedback d-block">{formik.errors.code_journal}</div>
                            )}
                          </div>
                        </Col>
                        
                        <Col md={4}>
                          <div className="mb-3">
                            <Label htmlFor="reference" className="form-label fw-semibold">
                              Référence / N° de pièce <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="reference"
                              name="reference"
                              type="text"
                              placeholder="Ex: FAC2025-001, CHQ-001"
                              className="rounded-pill"
                              value={formik.values.reference}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              invalid={formik.touched.reference && Boolean(formik.errors.reference)}
                            />
                            {formik.touched.reference && formik.errors.reference && (
                              <FormFeedback>{formik.errors.reference}</FormFeedback>
                            )}
                          </div>
                        </Col>                   
                      </Row>

                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <Label className="form-label fw-semibold">
                              Importer un document justificatif
                            </Label>
                            <Input
                              type="file"
                              innerRef={fileInputRef}
                              className="rounded-pill"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  formik.setFieldValue('piece_jointe', file);
                                }
                              }}
                            />
                            <small className="text-muted">
                              Formats acceptés : PDF, JPG, PNG, DOC, XLS (Max 10MB)
                            </small>
                          </div>
                        </Col>

                        <Col md={6}>
                          <div className="mb-3">
                            <Label htmlFor="libelle" className="form-label fw-semibold">
                              Libellé de l'écriture <span className="text-danger">*</span>
                            </Label>
                            <Input
                              id="libelle"
                              name="libelle"
                              type="textarea"
                              rows="1"
                              placeholder="Description concise et explicite de l'opération..."
                              className="rounded-pill"
                              value={formik.values.libelle}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              invalid={formik.touched.libelle && Boolean(formik.errors.libelle)}
                            />
                            {formik.touched.libelle && formik.errors.libelle && (
                              <FormFeedback>{formik.errors.libelle}</FormFeedback>
                            )}
                            <small className="text-muted">
                              Ex: "Facture 2025-01-25", "Virement Salaire Mars", "Achat fournitures de bureau"
                            </small>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>

                  {/* Section 2 : Lignes d'écriture (Partie double) */}
                  <Card className="mb-4 border-0 shadow-sm rounded-4">
                    <CardHeader className="rounded-top-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                          {/* <i className="ri-file-list-2-line me-2"></i> */}
                          Lignes d'écriture (Partie double) - Minimum 2 lignes
                        </h5>
                        <Button
                          type="button"
                          color="success"
                          size="md"
                          onClick={addLigneEcriture}
                          className="rounded-pill"
                        >
                          <i className="ri-add-line me-1"></i>
                          Ajouter une ligne
                        </Button>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <div className="table-responsive rounded-4">
                        <Table bordered className="mb-0 rounded-4">
                          <thead className="table-light">
                            <tr>
                              <th width="50">N°</th>
                              <th width="200">N° Compte <span className="text-danger">*</span></th>
                              <th>Libellé <span className="text-danger">*</span></th>
                              <th width="150" className="text-center">Débit () <span className="text-danger">*</span></th>
                              <th width="150" className="text-center">Crédit () <span className="text-danger">*</span></th>
                              <th width="50">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lignesEcriture.map((ligne, index) => (
                              <tr key={ligne.id}>
                                <td className="text-center fw-bold">{index + 1}</td>
                                <td>
                                  <div className="mb-2">
                                    <CustomSelect
                                      value={compteOptions.find(opt => opt.value === ligne.compte) || null}
                                      onChange={(selectedOption) => {
                                        updateLigneEcriture(ligne.id, 'compte', selectedOption ? selectedOption.value : '');
                                      }}
                                      options={compteOptions}
                                      placeholder="Sélectionnez un compte"
                                      isClearable={false}
                                      className="react-select-container"
                                      classNamePrefix="react-select"
                                    />
                                  </div>
                                  {ligne.compte === "autre" && (
                                    <Input
                                      type="text"
                                      placeholder="Entrez le numéro de compte"
                                      className="rounded-pill"
                                      onChange={(e) => updateLigneEcriture(ligne.id, 'compte', e.target.value)}
                                    />
                                  )}
                                </td>
                                <td>
                                  <Input
                                    type="text"
                                    placeholder="Description de la ligne..."
                                    className="rounded-pill"
                                    value={ligne.libelle}
                                    onChange={(e) => updateLigneEcriture(ligne.id, 'libelle', e.target.value)}
                                  />
                                </td>
                                <td>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="rounded-pill text-end"
                                    value={ligne.debit}
                                    onChange={(e) => updateLigneEcriture(ligne.id, 'debit', e.target.value)}
                                  />
                                </td>
                                <td>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    className="rounded-pill text-end"
                                    value={ligne.credit}
                                    onChange={(e) => updateLigneEcriture(ligne.id, 'credit', e.target.value)}
                                  />
                                </td>
                                <td className="text-center">
                                  {lignesEcriture.length > 2 && (
                                    <Button
                                      type="button"
                                      color="danger"
                                      size="sm"
                                      onClick={() => removeLigneEcriture(ligne.id)}
                                      className="rounded-circle"
                                    >
                                      <i className="ri-delete-bin-line"></i>
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="table-active">
                            <tr>
                              <th colSpan="3" className="text-end">TOTAUX :</th>
                              <th className="text-center text-success fw-bold">
                                {formatMontant(lignesEcriture.reduce((sum, ligne) => sum + (parseFloat(ligne.debit) || 0), 0))} 
                              </th>
                              <th className="text-center text-danger fw-bold">
                                {formatMontant(lignesEcriture.reduce((sum, ligne) => sum + (parseFloat(ligne.credit) || 0), 0))} 
                              </th>
                              <th></th>
                            </tr>
                          </tfoot>
                        </Table>
                      </div>
                      
                      {/* Vérification de l'équilibre */}
                      {(() => {
                        const equilibre = verifierEquilibre();
                        return (
                          <div className={`alert ${equilibre.equilibre ? 'alert-success' : 'alert-danger'} border-0 mt-3`}>
                            <i className={`ri-${equilibre.equilibre ? 'check' : 'close'}-circle-line me-2`}></i>
                            {equilibre.message}
                          </div>
                        );
                      })()}
                      
                      {/* Exemple d'opération */}
                      {/* <div className="alert alert-info border-0 mt-3 rounded-4">
                        <h6 className="alert-heading">
                          <i className="ri-lightbulb-flash-line me-2"></i>
                          Exemple : Achat de marchandise (250 F TTC, TVA 18%)
                        </h6>
                        <Table size="sm" className="mb-0">
                          <thead>
                            <tr>
                              <th>N°</th>
                              <th>N° Compte</th>
                              <th>Libellé</th>
                              <th>Débit</th>
                              <th>Crédit</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>6011</td>
                              <td>S/achat marchandise</td>
                              <td>205</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>4452</td>
                              <td>S/achat marchandise (TVA)</td>
                              <td>45</td>
                              <td></td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>4011</td>
                              <td>S/Facture fournisseur</td>
                              <td></td>
                              <td>250</td>
                            </tr>
                            <tr className="table-active">
                              <td colSpan="3" className="text-end"><strong>TOTAUX :</strong></td>
                              <td><strong>250</strong></td>
                              <td><strong>250</strong></td>
                            </tr>
                          </tbody>
                        </Table>
                      </div> */}
                    </CardBody>
                  </Card>

                  {/* Boutons d'action */}
                  <div className="d-flex justify-content-end g-2 mt-4 mb-4">
                    <Button
                      type="button"
                      className="btn btn-light rounded-pill me-2"
                      onClick={switchToList}
                    >
                      <i className="ri-arrow-left-line me-1"></i>
                      Retour à la liste
                    </Button>
                    <Button
                      type="submit"
                      className="btn btn-success rounded-pill"
                      disabled={formik.isSubmitting || !verifierEquilibre().equilibre || lignesEcriture.length < 2}
                    >
                      {formik.isSubmitting ? (
                        <>
                          <i className="ri-loader-4-line me-1 spinner"></i>
                          {isEdit ? "Modification..." : "Enregistrement..."}
                        </>
                      ) : (
                        <>
                          <i className={isEdit ? "ri-save-line me-1" : "ri-add-line me-1"}></i>
                          {isEdit ? "Enregistrer les modifications" : "Enregistrer l'opération"}
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  };

  export default InvoiceCreate;