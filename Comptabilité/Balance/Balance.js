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

// Classes de comptes
const ACCOUNT_CLASSES = [
  { value: "1", label: "Classe 1 - Capitaux" },
  { value: "2", label: "Classe 2 - Immobilisations" },
  { value: "3", label: "Classe 3 - Stocks" },
  { value: "4", label: "Classe 4 - Tiers" },
  { value: "5", label: "Classe 5 - Trésorerie" },
  { value: "6", label: "Classe 6 - Charges" },
  { value: "7", label: "Classe 7 - Produits" },
  { value: "8", label: "Classe 8 - Comptes spéciaux" },
];

// Exemple de données de balance
const demoBalanceData = [
  {
    id: 1,
    numero_compte: "101",
    intitule_compte: "Capital social",
    total_debit: 0,
    total_credit: 10000,
    solde_debiteur: 0,
    solde_crediteur: 10000,
    classe_compte: "1",
    classe_label: "Capitaux",
  },
  {
    id: 2,
    numero_compte: "2411",
    intitule_compte: "Matériel industriel",
    total_debit: 6000,
    total_credit: 0,
    solde_debiteur: 6000,
    solde_crediteur: 0,
    classe_compte: "2",
    classe_label: "Immobilisations",
  },
  {
    id: 3,
    numero_compte: "4011",
    intitule_compte: "Fournisseurs",
    total_debit: 4000,
    total_credit: 0,
    solde_debiteur: 4000,
    solde_crediteur: 0,
    classe_compte: "4",
    classe_label: "Tiers",
  },
  {
    id: 4,
    numero_compte: "512",
    intitule_compte: "Banque",
    total_debit: 0,
    total_credit: 5000,
    solde_debiteur: 0,
    solde_crediteur: 5000,
    classe_compte: "5",
    classe_label: "Trésorerie",
  },
  {
    id: 5,
    numero_compte: "601",
    intitule_compte: "Achats de marchandises",
    total_debit: 15000,
    total_credit: 0,
    solde_debiteur: 15000,
    solde_crediteur: 0,
    classe_compte: "6",
    classe_label: "Charges",
  },
  {
    id: 6,
    numero_compte: "701",
    intitule_compte: "Ventes de marchandises",
    total_debit: 0,
    total_credit: 25000,
    solde_debiteur: 0,
    solde_crediteur: 25000,
    classe_compte: "7",
    classe_label: "Produits",
  },
  {
    id: 7,
    numero_compte: "4457",
    intitule_compte: "TVA à décaisser",
    total_debit: 0,
    total_credit: 1500,
    solde_debiteur: 0,
    solde_crediteur: 1500,
    classe_compte: "4",
    classe_label: "Tiers",
  },
  {
    id: 8,
    numero_compte: "531",
    intitule_compte: "Caisse",
    total_debit: 5000,
    total_credit: 0,
    solde_debiteur: 5000,
    solde_crediteur: 0,
    classe_compte: "5",
    classe_label: "Trésorerie",
  },
  {
    id: 9,
    numero_compte: "411",
    intitule_compte: "Clients",
    total_debit: 12000,
    total_credit: 0,
    solde_debiteur: 12000,
    solde_crediteur: 0,
    classe_compte: "4",
    classe_label: "Tiers",
  },
  {
    id: 10,
    numero_compte: "681",
    intitule_compte: "Dotations aux amortissements",
    total_debit: 3000,
    total_credit: 0,
    solde_debiteur: 3000,
    solde_crediteur: 0,
    classe_compte: "6",
    classe_label: "Charges",
  },
];

const Balance = () => {
  const { t } = useTranslation();

  // États principaux
  const [balanceData, setBalanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedClass, setSelectedClass] = useState("all");
  const { userProfile, token } = useProfile();

  const itemsPerPage = 10;

  // ✅ Filtrage optimisé des comptes
  const filteredData = useMemo(() => {
    let filtered = balanceData;

    // Filtre par classe de compte
    if (selectedClass !== "all") {
      filtered = filtered.filter(
        (compte) => compte.classe_compte === selectedClass
      );
    }

    // Filtre par recherche
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((compte) =>
        Object.values(compte).some(
          (value) =>
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(searchLower)
        )
      );
    }

    return filtered;
  }, [balanceData, selectedClass, searchTerm]);

  // ✅ Pagination optimisée
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // ✅ Calculer les totaux pour la ligne de total
  const totals = useMemo(() => {
    return filteredData.reduce((acc, compte) => {
      acc.totalDebit += compte.total_debit || 0;
      acc.totalCredit += compte.total_credit || 0;
      acc.totalSoldeDebiteur += compte.solde_debiteur || 0;
      acc.totalSoldeCrediteur += compte.solde_crediteur || 0;
      return acc;
    }, { 
      totalDebit: 0, 
      totalCredit: 0, 
      totalSoldeDebiteur: 0,
      totalSoldeCrediteur: 0
    });
  }, [filteredData]);

  // ✅ Fonction pour récupérer la balance
  const fetchBalance = useCallback(async () => {
    setLoading(true);

    if (!token) {
      toast.error(
        "Token d'authentification manquant. Veuillez vous reconnecter."
      );
      setLoading(false);
      setBalanceData(demoBalanceData);

      const exportDataFormatted = demoBalanceData.map((compte) => ({
        "N° Compte": compte.numero_compte,
        "Intitulé du Compte": compte.intitule_compte,
        "Totaux Débit": compte.total_debit.toLocaleString("fr-FR"),
        "Totaux Crédit": compte.total_credit.toLocaleString("fr-FR"),
        "Solde Débiteur": compte.solde_debiteur.toLocaleString("fr-FR"),
        "Solde Créditeur": compte.solde_crediteur.toLocaleString("fr-FR"),
        Classe: compte.classe_label,
      }));
      setExportData(exportDataFormatted);

      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${BaseUrl}/compta/balance/?exercice=${selectedPeriod}`,
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
        setBalanceData(data);
        const exportDataFormatted = data.map((compte) => ({
          "N° Compte": compte.numero_compte,
          "Intitulé du Compte": compte.intitule_compte,
          "Totaux Débit": compte.total_debit?.toLocaleString("fr-FR") || "0",
          "Totaux Crédit": compte.total_credit?.toLocaleString("fr-FR") || "0",
          "Solde Débiteur":
            compte.solde_debiteur?.toLocaleString("fr-FR") || "0",
          "Solde Créditeur":
            compte.solde_crediteur?.toLocaleString("fr-FR") || "0",
          Classe:
            ACCOUNT_CLASSES.find((c) => c.value === compte.classe_compte)
              ?.label || compte.classe_compte,
        }));
        setExportData(exportDataFormatted);
      } else {
        setBalanceData(demoBalanceData);
        const exportDataFormatted = demoBalanceData.map((compte) => ({
          "N° Compte": compte.numero_compte,
          "Intitulé du Compte": compte.intitule_compte,
          "Totaux Débit": compte.total_debit.toLocaleString("fr-FR"),
          "Totaux Crédit": compte.total_credit.toLocaleString("fr-FR"),
          "Solde Débiteur": compte.solde_debiteur.toLocaleString("fr-FR"),
          "Solde Créditeur": compte.solde_crediteur.toLocaleString("fr-FR"),
          Classe: compte.classe_label,
        }));
        setExportData(exportDataFormatted);
        toast.info("Données de démonstration chargées");
      }
    } catch (err) {
      console.error("Erreur fetchBalance:", err);
      setBalanceData(demoBalanceData);
      const exportDataFormatted = demoBalanceData.map((compte) => ({
        "N° Compte": compte.numero_compte,
        "Intitulé du Compte": compte.intitule_compte,
        "Totaux Débit": compte.total_debit.toLocaleString("fr-FR"),
        "Totaux Crédit": compte.total_credit.toLocaleString("fr-FR"),
        "Solde Débiteur": compte.solde_debiteur.toLocaleString("fr-FR"),
        "Solde Créditeur": compte.solde_crediteur.toLocaleString("fr-FR"),
        Classe: compte.classe_label,
      }));
      setExportData(exportDataFormatted);
      toast.info("Données de démonstration chargées");
    } finally {
      setLoading(false);
    }
  }, [token, selectedPeriod]);

  // ✅ Chargement initial
  useEffect(() => {
    document.title = "Balance Générale | INAWO - Suite de Gestion";
    fetchBalance();
  }, [fetchBalance]);

  // ✅ Reset de la pagination lors du filtrage
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedClass]);

  // ✅ Fonction pour formater les montants
  const formatMontant = useCallback((montant) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant || 0);
  }, []);

  // ✅ Fonction pour obtenir la couleur de la classe - SANS FOND
  const getClasseColor = useCallback((classeValue) => {
    const classeColors = {
      1: "text-primary", // Capitaux
      2: "text-info", // Immobilisations
      3: "text-success", // Stocks
      4: "text-warning", // Tiers
      5: "text-danger", // Trésorerie
      6: "text-secondary", // Charges
      7: "text-dark", // Produits
      8: "text-muted", // Comptes spéciaux
    };
    return classeColors[classeValue] || "text-secondary";
  }, []);

  // ✅ Fonction pour obtenir le label de la classe
  const getClasseLabel = useCallback((classeValue) => {
    const classeObj = ACCOUNT_CLASSES.find((c) => c.value === classeValue);
    return classeObj ? classeObj.label : `Classe ${classeValue}`;
  }, []);

  // ✅ Options pour les classes de comptes
  const classOptions = useMemo(
    () => [
      { value: "all", label: "Toutes les classes" },
      ...ACCOUNT_CLASSES.map((classe) => ({
        value: classe.value,
        label: classe.label,
      })),
    ],
    []
  );

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
        header: "N° Compte",
        accessorKey: "numero_compte",
        enableColumnFilter: false,
        cell: (cell) => {
          const row = cell.row.original;
          return (
            <div>
              <span className={`fw-bold ${getClasseColor(row.classe_compte)}`}>
                {cell.getValue() || "N/A"}
              </span>
              <div className="small text-muted">
                {getClasseLabel(row.classe_compte)}
              </div>
            </div>
          );
        },
        size: 120,
      },
      {
        header: "Intitulé du Compte",
        accessorKey: "intitule_compte",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="fw-medium">{cell.getValue() || "N/A"}</span>
        ),
        size: 200,
      },
      {
        header: "Totaux Débit",
        accessorKey: "total_debit",
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
        header: "Totaux Crédit",
        accessorKey: "total_credit",
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
        header: "Solde Débiteur",
        accessorKey: "solde_debiteur",
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
        header: "Solde Créditeur",
        accessorKey: "solde_crediteur",
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
    ],
    [currentPage, itemsPerPage, formatMontant, getClasseColor, getClasseLabel]
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
            title={`Balance Générale - Exercice ${selectedPeriod}`}
            pageTitle={
              <>
                <i className="ri-scales-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              <SearchAndActionBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Rechercher un compte..."
                showSearch={true}
                showAddButton={false}
                onExportClick={() => setIsExportCSV(true)}
                exportButtonText="Exporter"
                exportButtonIcon="ri-file-download-line"
                showExportButton={true}
                additionalInfo={
                  <div className="d-flex align-items-center text-muted">
                    <i className="ri-information-line me-1"></i>
                    {filteredData.length} compte
                    {filteredData.length !== 1 ? "s" : ""} trouvé
                    {filteredData.length !== 1 ? "s" : ""}
                  </div>
                }
              />

              {/* Filtres */}
              <Col lg={12} className="mb-4">
                <div className="d-flex align-items-center gap-3 flex-wrap rounded-pill" style={{background:"white", padding:"1%"}}>
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
                        classOptions.find(
                          (opt) => opt.value === selectedClass
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        setSelectedClass(
                          selectedOption ? selectedOption.value : "all"
                        );
                      }}
                      options={classOptions}
                      placeholder="Filtrer par classe"
                      isClearable={false}
                      className="w-auto"
                    />
                  </div>
                </div>
              </Col>

              <Col lg={12}>
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center my-5"
                    style={{ minHeight: "300px" }}
                  >
                    <div className="text-center">
                      <Loader />
                      <p className="mt-3 text-muted">
                        Chargement de la balance...
                      </p>
                    </div>
                  </div>
                ) : filteredData.length > 0 ? (
                  <div>
                    {/*  NOUVEAU : TableContainerTotal avec ligne de totaux */}
                    <TableContainerTotal
                      columns={columns}
                      data={paginatedData}
                      isGlobalFilter={false}
                      customPageSize={itemsPerPage}
                      cardStyle={{ borderRadius: "20px", overflow: "hidden" }}
                      
                      //  NOUVEAU : Ajoutez ces props pour la ligne de totaux
                      showTotalRow={true}
                      totalConfig={{
                        totalLabel: "Total Balance",
                        totalLabelColumn: 1, 
                        columnsToSum: ['total_debit', 'total_credit', 'solde_debiteur', 'solde_crediteur'],
                        formatValues: {
                          'total_debit': (val) => `${formatMontant(val)} `,
                          'total_credit': (val) => `${formatMontant(val)} `,
                          'solde_debiteur': (val) => `${formatMontant(val)} `,
                          'solde_crediteur': (val) => `${formatMontant(val)} `,
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
                    
                  
                  </div>
                ) : (
                  <EmptyDataCard
                    title="Aucun compte trouvé"
                    description={
                      searchTerm || selectedClass !== "all"
                        ? `Aucun résultat pour vos critères de recherche.`
                        : "Aucun compte enregistré pour cet exercice."
                    }
                    actionButton={
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedClass("all");
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

export default Balance;