import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import TableContainerTotal from "../../../../Components/Common/TableContainerTotal"; // NOUVEAU : TableContainer avec totaux
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
  Modal,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  Button,
  FormFeedback,
  Badge,
  Table,
} from "reactstrap";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
import Pagination from "../../../../Components/Common/Pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useProfile } from "../../../../Components/Hooks/UserHooks";
import { BaseUrl } from "../../../APIKey/ApiKey";

// Périodes fiscales
const FISCAL_PERIODS = [
  { value: "2024", label: "Exercice 2024" },
  { value: "2023", label: "Exercice 2023" },
  { value: "2022", label: "Exercice 2022" },
  { value: "2021", label: "Exercice 2021" },
  { value: "2020", label: "Exercice 2020" },
];

// Options pour les journaux
const JOURNAL_OPTIONS = [
  { value: "all", label: "Tous les journaux" },
  { value: "VTE", label: "Ventes" },
  { value: "ACH", label: "Achats" },
  { value: "BQ", label: "Banque" },
  { value: "OD", label: "Opérations Diverses" },
  { value: "REPORT", label: "Report à nouveau" },
];

// Exemple de données de Grand Livre
const demoGrandLivreData = [
  {
    id: 1,
    date_operation: "01/01/2025",
    journal: "REPORT",
    numero_piece: "000",
    libelle_ecriture: "Solde d'ouverture 01/01",
    compte_partenaire: "",
    debit: 5000,
    credit: 0,
    solde_cumule: 5000,
    compte_numero: "512",
    compte_intitule: "Banque",
  },
  {
    id: 2,
    date_operation: "05/01/2025",
    journal: "VTE",
    numero_piece: "F001",
    libelle_ecriture: "Règlement facture client X",
    compte_partenaire: "411101",
    debit: 1200,
    credit: 0,
    solde_cumule: 6200,
    compte_numero: "512",
    compte_intitule: "Banque",
  },
  {
    id: 3,
    date_operation: "08/01/2025",
    journal: "ACH",
    numero_piece: "A005",
    libelle_ecriture: "Règlement fournisseur y (loyer)",
    compte_partenaire: "401101",
    debit: 0,
    credit: 800,
    solde_cumule: 5400,
    compte_numero: "512",
    compte_intitule: "Banque",
  },
  {
    id: 4,
    date_operation: "02/01/2025",
    journal: "ACH",
    numero_piece: "A001",
    libelle_ecriture: "Achat marchandises",
    compte_partenaire: "601",
    debit: 5000,
    credit: 0,
    solde_cumule: 5000,
    compte_numero: "401101",
    compte_intitule: "Fournisseurs",
  },
  {
    id: 5,
    date_operation: "10/01/2025",
    journal: "VTE",
    numero_piece: "F002",
    libelle_ecriture: "Vente produits finis",
    compte_partenaire: "701",
    debit: 0,
    credit: 3000,
    solde_cumule: 3000,
    compte_numero: "411101",
    compte_intitule: "Clients",
  },
  {
    id: 6,
    date_operation: "15/01/2025",
    journal: "BQ",
    numero_piece: "CH001",
    libelle_ecriture: "Virement salaires",
    compte_partenaire: "421",
    debit: 0,
    credit: 2500,
    solde_cumule: 500,
    compte_numero: "512",
    compte_intitule: "Banque",
  },
  {
    id: 7,
    date_operation: "20/01/2025",
    journal: "OD",
    numero_piece: "ND001",
    libelle_ecriture: "Achat petit matériel",
    compte_partenaire: "6063",
    debit: 350,
    credit: 0,
    solde_cumule: 350,
    compte_numero: "401102",
    compte_intitule: "Fournisseurs divers",
  },
];

const GrandLivre = () => {
  const { t } = useTranslation();

  // États principaux
  const [grandLivreData, setGrandLivreData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedJournal, setSelectedJournal] = useState("all");
  const [accountOptions, setAccountOptions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const { userProfile, token } = useProfile();

  const itemsPerPage = 10;

  // ✅ Filtrage optimisé des écritures
  const filteredData = useMemo(() => {
    let filtered = grandLivreData;

    // Filtre par journal
    if (selectedJournal !== "all") {
      filtered = filtered.filter((ligne) => ligne.journal === selectedJournal);
    }

    // Filtre par compte
    if (selectedAccount !== "all") {
      filtered = filtered.filter(
        (ligne) => ligne.compte_numero === selectedAccount
      );
    }

    // Filtre par recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((ligne) =>
        Object.values(ligne).some(
          (value) =>
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(searchLower)
        )
      );
    }

    return filtered;
  }, [grandLivreData, selectedJournal, selectedAccount, searchTerm]);

  // ✅ Pagination optimisée
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ✅ Calculer les totaux pour la ligne de total
  const totals = useMemo(() => {
    return filteredData.reduce((acc, ligne) => {
      acc.totalDebit += ligne.debit || 0;
      acc.totalCredit += ligne.credit || 0;
      acc.totalSolde += ligne.solde_cumule || 0;
      return acc;
    }, { 
      totalDebit: 0, 
      totalCredit: 0, 
      totalSolde: 0 
    });
  }, [filteredData]);

  // ✅ Fonction pour récupérer le Grand Livre
  const fetchGrandLivre = useCallback(async () => {
    setLoading(true);

    if (!token) {
      toast.error(
        "Token d'authentification manquant. Veuillez vous reconnecter."
      );
      setLoading(false);
      setGrandLivreData(demoGrandLivreData);

      // Extraire les comptes uniques pour les options
      const uniqueAccounts = [
        ...new Set(demoGrandLivreData.map((item) => item.compte_numero)),
      ];
      const accountOpts = uniqueAccounts.map((num) => {
        const compte = demoGrandLivreData.find(
          (item) => item.compte_numero === num
        );
        return {
          value: num,
          label: `${num} - ${compte?.compte_intitule || "Non spécifié"}`,
        };
      });
      setAccountOptions([
        { value: "all", label: "Tous les comptes" },
        ...accountOpts,
      ]);

      const exportDataFormatted = demoGrandLivreData.map((ligne) => ({
        Date: ligne.date_operation,
        Journal: ligne.journal,
        "N° Pièce": ligne.numero_piece,
        Libellé: ligne.libelle_ecriture,
        Compte: `${ligne.compte_numero} - ${ligne.compte_intitule}`,
        "Compte Partenaire": ligne.compte_partenaire,
        Débit: ligne.debit.toLocaleString("fr-FR"),
        Crédit: ligne.credit.toLocaleString("fr-FR"),
        "Solde Cumulé": ligne.solde_cumule.toLocaleString("fr-FR"),
      }));
      setExportData(exportDataFormatted);

      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${BaseUrl}/compta/grand-livre/?exercice=${selectedPeriod}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setGrandLivreData(data);

        // Extraire les comptes uniques pour les options
        const uniqueAccounts = [
          ...new Set(data.map((item) => item.compte_numero)),
        ];
        const accountOpts = uniqueAccounts.map((num) => {
          const compte = data.find((item) => item.compte_numero === num);
          return {
            value: num,
            label: `${num} - ${compte?.compte_intitule || "Non spécifié"}`,
          };
        });
        setAccountOptions([
          { value: "all", label: "Tous les comptes" },
          ...accountOpts,
        ]);

        const exportDataFormatted = data.map((ligne) => ({
          Date: ligne.date_operation,
          Journal: ligne.journal,
          "N° Pièce": ligne.numero_piece,
          Libellé: ligne.libelle_ecriture,
          Compte: `${ligne.compte_numero} - ${ligne.compte_intitule}`,
          "Compte Partenaire": ligne.compte_partenaire,
          Débit: ligne.debit?.toLocaleString("fr-FR") || "0",
          Crédit: ligne.credit?.toLocaleString("fr-FR") || "0",
          "Solde Cumulé": ligne.solde_cumule?.toLocaleString("fr-FR") || "0",
        }));
        setExportData(exportDataFormatted);
      } else {
        setGrandLivreData(demoGrandLivreData);

        const uniqueAccounts = [
          ...new Set(demoGrandLivreData.map((item) => item.compte_numero)),
        ];
        const accountOpts = uniqueAccounts.map((num) => {
          const compte = demoGrandLivreData.find(
            (item) => item.compte_numero === num
          );
          return {
            value: num,
            label: `${num} - ${compte?.compte_intitule || "Non spécifié"}`,
          };
        });
        setAccountOptions([
          { value: "all", label: "Tous les comptes" },
          ...accountOpts,
        ]);

        const exportDataFormatted = demoGrandLivreData.map((ligne) => ({
          Date: ligne.date_operation,
          Journal: ligne.journal,
          "N° Pièce": ligne.numero_piece,
          Libellé: ligne.libelle_ecriture,
          Compte: `${ligne.compte_numero} - ${ligne.compte_intitule}`,
          "Compte Partenaire": ligne.compte_partenaire,
          Débit: ligne.debit.toLocaleString("fr-FR"),
          Crédit: ligne.credit.toLocaleString("fr-FR"),
          "Solde Cumulé": ligne.solde_cumule.toLocaleString("fr-FR"),
        }));
        setExportData(exportDataFormatted);
        toast.info("Données de démonstration chargées");
      }
    } catch (err) {
      console.error("Erreur fetchGrandLivre:", err);
      setGrandLivreData(demoGrandLivreData);

      const uniqueAccounts = [
        ...new Set(demoGrandLivreData.map((item) => item.compte_numero)),
      ];
      const accountOpts = uniqueAccounts.map((num) => {
        const compte = demoGrandLivreData.find(
          (item) => item.compte_numero === num
        );
        return {
          value: num,
          label: `${num} - ${compte?.compte_intitule || "Non spécifié"}`,
        };
      });
      setAccountOptions([
        { value: "all", label: "Tous les comptes" },
        ...accountOpts,
      ]);

      const exportDataFormatted = demoGrandLivreData.map((ligne) => ({
        Date: ligne.date_operation,
        Journal: ligne.journal,
        "N° Pièce": ligne.numero_piece,
        Libellé: ligne.libelle_ecriture,
        Compte: `${ligne.compte_numero} - ${ligne.compte_intitule}`,
        "Compte Partenaire": ligne.compte_partenaire,
        Débit: ligne.debit.toLocaleString("fr-FR"),
        Crédit: ligne.credit.toLocaleString("fr-FR"),
        "Solde Cumulé": ligne.solde_cumule.toLocaleString("fr-FR"),
      }));
      setExportData(exportDataFormatted);
      toast.info("Données de démonstration chargées");
    } finally {
      setLoading(false);
    }
  }, [token, selectedPeriod]);

  // ✅ Chargement initial
  useEffect(() => {
    document.title = "Grand Livre | INAWO - Suite de Gestion";
    fetchGrandLivre();
  }, [fetchGrandLivre]);

  // ✅ Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedJournal, selectedAccount]);

  // ✅ Fonction pour formater les montants
  const formatMontant = useCallback((montant) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant || 0);
  }, []);

  // ✅ Fonction pour obtenir la couleur du journal - SANS FOND
  const getJournalColor = useCallback((journal) => {
    const journalColors = {
      VTE: "text-success", // Ventes - vert
      ACH: "text-danger", // Achats - rouge
      BQ: "text-primary", // Banque - bleu
      OD: "text-warning", // Opérations Diverses - orange
      REPORT: "text-info", // Report - cyan
    };
    return journalColors[journal] || "text-secondary";
  }, []);

  // ✅ Colonnes du tableau
  const columns = useMemo(
    () => [
      {
        header: "N°",
        accessorKey: "id",
        enableColumnFilter: false,
        cell: (cell) => {
          const globalIndex =
            (currentPage - 1) * itemsPerPage + cell.row.index + 1;
          return <span className="fw-medium">{globalIndex}</span>;
        },
        size: 60,
      },
      {
        header: "Date",
        accessorKey: "date_operation",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="fw-semibold">{cell.getValue() || "N/A"}</span>
        ),
        size: 100,
      },
      {
        header: "Journal",
        accessorKey: "journal",
        enableColumnFilter: false,
        cell: (cell) => {
          const journal = cell.getValue();
          return (
            <span className={`fw-medium ${getJournalColor(journal)}`}>
              {journal || "N/A"}
            </span>
          );
        },
        size: 80,
      },
      {
        header: "N° Pièce",
        accessorKey: "numero_piece",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="text-muted">{cell.getValue() || "-"}</span>
        ),
        size: 100,
      },
      {
        header: "Libellé",
        accessorKey: "libelle_ecriture",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="fw-medium">{cell.getValue() || "N/A"}</span>
        ),
        size: 250,
      },
      {
        header: "Compte",
        accessorKey: "compte_numero",
        enableColumnFilter: false,
        cell: (cell) => {
          const row = cell.row.original;
          return (
            <span className="text-primary fw-medium">
              {row.compte_numero} - {row.compte_intitule}
            </span>
          );
        },
        size: 150,
      },
      {
        header: "Débit",
        accessorKey: "debit",
        enableColumnFilter: false,
        cell: (cell) => {
          const value = cell.getValue();
          return value > 0 ? (
            <span className="text-success fw-bold">
              {formatMontant(value)} 
            </span>
          ) : (
            <span className="text-muted">-</span>
          );
        },
        size: 120,
      },
      {
        header: "Crédit",
        accessorKey: "credit",
        enableColumnFilter: false,
        cell: (cell) => {
          const value = cell.getValue();
          return value > 0 ? (
            <span className="text-primary fw-bold">
              {formatMontant(value)} 
            </span>
          ) : (
            <span className="text-muted">-</span>
          );
        },
        size: 120,
      },
      {
        header: "Solde Cumulé",
        accessorKey: "solde_cumule",
        enableColumnFilter: false,
        cell: (cell) => {
          const value = cell.getValue();
          const color = value >= 0 ? "text-success" : "text-danger";
          return (
            <span className={`fw-bold ${color}`}>
              {formatMontant(value)} 
            </span>
          );
        },
        size: 120,
      },
    ],
    [currentPage, itemsPerPage, formatMontant, getJournalColor]
  );

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

          {/* Export CSV Modal */}
          <ExportCSVModal
            show={isExportCSV}
            onCloseClick={() => setIsExportCSV(false)}
            data={exportData}
          />

          <BreadCrumb
            title={`Grand Livre - Exercice ${selectedPeriod}`}
            pageTitle={
              <>
                <i className="ri-book-2-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              <SearchAndActionBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Rechercher une écriture..."
                showSearch={true}
                showAddButton={false}
                onExportClick={() => setIsExportCSV(true)}
                exportButtonText="Exporter"
                exportButtonIcon="ri-file-download-line"
                showExportButton={true}
                additionalInfo={
                  <div className="d-flex align-items-center text-muted">
                    <i className="ri-information-line me-1"></i>
                    {filteredData.length} écriture
                    {filteredData.length !== 1 ? "s" : ""} trouvée
                    {filteredData.length !== 1 ? "s" : ""}
                  </div>
                }
              />

              {/* Filtres */}
              <Row className="mb-3">
                <Col lg={12}>
                  <div
                    className="d-flex align-items-center gap-3 flex-wrap rounded-pill"
                    style={{ background: "white", padding: "1%" }}
                  >
                    <div>
                      <CustomSelect
                        value={
                          FISCAL_PERIODS.find(
                            (opt) => opt.value === selectedPeriod
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          setSelectedPeriod(
                            selectedOption ? selectedOption.value : "2024"
                          );
                        }}
                        options={FISCAL_PERIODS}
                        placeholder="Sélectionnez un exercice"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>
                    <div>
                      <CustomSelect
                        value={
                          JOURNAL_OPTIONS.find(
                            (opt) => opt.value === selectedJournal
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          setSelectedJournal(
                            selectedOption ? selectedOption.value : "all"
                          );
                        }}
                        options={JOURNAL_OPTIONS}
                        placeholder="Filtrer par journal"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>
                    <div>
                      <CustomSelect
                        value={
                          accountOptions.find(
                            (opt) => opt.value === selectedAccount
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          setSelectedAccount(
                            selectedOption ? selectedOption.value : "all"
                          );
                        }}
                        options={accountOptions}
                        placeholder="Filtrer par compte"
                        isClearable={false}
                        className="w-auto"
                      />
                    </div>
                  </div>
                </Col>
              </Row>

              <Col lg={12}>
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center my-5"
                    style={{ minHeight: "300px" }}
                  >
                    <div className="text-center">
                      <Loader />
                      <p className="mt-3 text-muted">
                        Chargement du Grand Livre...
                      </p>
                    </div>
                  </div>
                ) : filteredData.length > 0 ? (
                  <div>
                    {/* ✅ NOUVEAU : TableContainerTotal avec ligne de totaux */}
                    <TableContainerTotal
                      columns={columns}
                      data={paginatedData}
                      isGlobalFilter={false}
                      customPageSize={itemsPerPage}
                      cardStyle={{ borderRadius: "20px", overflow: "hidden" }}
                      
                      //  NOUVEAU : Ajoutez ces props pour la ligne de totaux
                      showTotalRow={true}
                      totalConfig={{
                        totalLabel: "Total",
                        totalLabelColumn: 1, 
                        columnsToSum: ['debit', 'credit', 'solde_cumule'],
                        formatValues: {
                          'debit': (val) => `${formatMontant(val)} `,
                          'credit': (val) => `${formatMontant(val)} `,
                          'solde_cumule': (val) => `${formatMontant(val)} `,
                        },
                        textColor: "text-primary",
                        fontWeight: "fw-bold",
                        // bgColor: "table-active",
                        align: "start",
                      }}
                    >
                      <Pagination
                        data={filteredData}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        alwaysShow={true}
                        showInfo={true}
                      />
                    </TableContainerTotal>
                    
                    {/*  Résumé détaillé des totaux */}
                    <div className="alert alert-light border mt-3" style={{ borderRadius: "15px" }}>
                      <h6 className="mb-3 text-primary">
                        <i className="ri-calculator-line me-2"></i>
                        Résumé des Écritures
                      </h6>
                      
                      <Row className="text-center">
                        <Col md={4}>
                          <div className="border-end pe-3">
                            <h6 className="mb-1 text-muted">Total Débit</h6>
                            <p className="fs-5 fw-bold text-success mb-0">
                              {formatMontant(totals.totalDebit)} 
                            </p>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="border-end pe-3">
                            <h6 className="mb-1 text-muted">Total Crédit</h6>
                            <p className="fs-5 fw-bold text-primary mb-0">
                              {formatMontant(totals.totalCredit)} 
                            </p>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div>
                            <h6 className="mb-1 text-muted">Balance</h6>
                            <p className={`fs-5 fw-bold mb-0 ${
                              totals.totalDebit === totals.totalCredit 
                                ? 'text-success' 
                                : 'text-danger'
                            }`}>
                              {formatMontant(Math.abs(totals.totalDebit - totals.totalCredit))} 
                              <span className="ms-2 fw-normal text-muted fs-6">
                                ({totals.totalDebit === totals.totalCredit 
                                  ? 'Équilibré' 
                                  : totals.totalDebit > totals.totalCredit 
                                    ? 'Excédent débit' 
                                    : 'Excédent crédit'})
                              </span>
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    
                    {/* ✅ Statistiques supplémentaires */}
                    <div className="row mt-2">
                      <Col md={3}>
                        <div className="alert alert-success border-0 rounded text-center">
                          <h6 className="mb-1">
                            <i className="ri-file-list-line me-2"></i>
                            Écritures Débit
                          </h6>
                          <p className="fs-4 fw-bold mb-0">
                            {filteredData.filter(ligne => ligne.debit > 0).length}
                          </p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="alert alert-primary border-0 rounded text-center">
                          <h6 className="mb-1">
                            <i className="ri-file-list-line me-2"></i>
                            Écritures Crédit
                          </h6>
                          <p className="fs-4 fw-bold mb-0">
                            {filteredData.filter(ligne => ligne.credit > 0).length}
                          </p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="alert alert-info border-0 rounded text-center">
                          <h6 className="mb-1">
                            <i className="ri-book-2-line me-2"></i>
                            Journaux différents
                          </h6>
                          <p className="fs-4 fw-bold mb-0">
                            {[...new Set(filteredData.map(ligne => ligne.journal))].length}
                          </p>
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="alert alert-warning border-0 rounded text-center">
                          <h6 className="mb-1">
                            <i className="ri-bank-card-2-line me-2"></i>
                            Comptes différents
                          </h6>
                          <p className="fs-4 fw-bold mb-0">
                            {[...new Set(filteredData.map(ligne => ligne.compte_numero))].length}
                          </p>
                        </div>
                      </Col>
                    </div>
                  </div>
                ) : (
                  <EmptyDataCard
                    title="Aucune écriture trouvée"
                    description={
                      searchTerm ||
                      selectedJournal !== "all" ||
                      selectedAccount !== "all"
                        ? `Aucun résultat pour vos critères de recherche.`
                        : "Aucune écriture enregistrée pour cet exercice."
                    }
                    actionButton={
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedJournal("all");
                          setSelectedAccount("all");
                        }}
                        style={{ borderRadius: "20px" }}
                      >
                        <i className="ri-refresh-line me-1"></i>
                        Réinitialiser les filtres
                      </button>
                    }
                    secondaryAction={
                      searchTerm && (
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => setSearchTerm("")}
                          style={{ borderRadius: "20px" }}
                        >
                          <i className="ri-close-line me-1"></i>
                          Effacer la recherche
                        </button>
                      )
                    }
                  />
                )}
              </Col>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default GrandLivre;