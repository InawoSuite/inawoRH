import React, { useState, useMemo, useCallback } from "react";
import { Col, Container, Row, Badge } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import Loader from "../../../../Components/Common/Loader";
import { toast } from "react-toastify";
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
import SearchAndActionBar from "../../../../Components/Common/SearchAndActionBar";
import EmptyDataCard from "../../../../Components/Common/EmptyDataCard";
import Pagination from "../../../../Components/Common/Pagination";
import { useMenuLinks } from "../../../../Components/Hooks/useMenuLinks";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import jsPDF from "jspdf";
import logoDark from "../../../../assets/images/logo-dark.png";
import { useTranslation } from "react-i18next";


const FichePaie = () => {
  const { t } = useTranslation();
  const { entreprise } = useParams();
  const { generatePath } = useMenuLinks();

  const parseAmount = useCallback((value) => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    const normalized = String(value).replace(/\s/g, "").replace(/,/g, ".").replace(/[^\d.\-]/g, "");
    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }, []);

  const formatAmount = useCallback((value) => {
    const amount = Math.round(Number(value) || 0);
    return amount.toString();
  }, []);

  const computeITS = useCallback((baseImposable) => {
    const taxable = Math.max(0, Math.round(baseImposable));
    const brackets = [
      { limit: 60000, rate: 0 },
      { limit: 150000, rate: 0.1 },
      { limit: 250000, rate: 0.15 },
      { limit: 500000, rate: 0.19 },
      { limit: Number.POSITIVE_INFINITY, rate: 0.3 },
    ];

    let previousLimit = 0;
    let total = 0;

    brackets.forEach(({ limit, rate }) => {
      if (taxable <= previousLimit) return;
      const tranche = Math.min(taxable, limit) - previousLimit;
      if (tranche > 0) {
        total += tranche * rate;
      }
      previousLimit = limit;
    });

    return Math.round(total);
  }, []);

  const computeTaxeRadiophonique = useCallback((salaireBrut, periode) => {
    const monthMap = {
      janvier: 1,
      fevrier: 2,
      "février": 2,
      mars: 3,
      avril: 4,
      mai: 5,
      juin: 6,
      juillet: 7,
      aout: 8,
      "août": 8,
      septembre: 9,
      octobre: 10,
      novembre: 11,
      decembre: 12,
      "décembre": 12,
    };

    const month = monthMap[String(periode || "").trim().toLowerCase()] || null;
    if (month === 3) return 1000;
    if (month === 6) {
      return salaireBrut <= 60000 ? 0 : 3000;
    }
    return 0;
  }, []);

  const loadImageAsDataUrl = useCallback((src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Impossible de charger le contexte canvas"));
          return;
        }
        context.drawImage(image, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      image.onerror = () => reject(new Error("Impossible de charger le logo"));
      image.src = src;
    });
  }, []);

  const generatePayslipPdf = useCallback(async (collab) => {
    const salaireBase = parseAmount(collab?.salaire_base);
    const remunerationTotale = parseAmount(collab?.remuneration_totale);

    const prime = Math.max(remunerationTotale - salaireBase, 0);
    const indemnites = 0;
    const heuresSupplementaires = 0;
    const autresAvantages = 0;

    const salaireBrut = salaireBase + prime + indemnites + heuresSupplementaires + autresAvantages;
    const cnss = Math.round(salaireBrut * 0.036);
    const baseImposable = Math.max(salaireBrut - cnss, 0);
    const its = computeITS(baseImposable);
    const salaireNet = Math.max(0, salaireBrut - cnss - its);
    const taxeRadiophonique = computeTaxeRadiophonique(salaireBrut, collab?.periode);

    const doc = new jsPDF({ unit: "mm", format: "a4" });

    try {
      const logoDataUrl = await loadImageAsDataUrl(logoDark);
      doc.addImage(logoDataUrl, "PNG", 14, 9, 34, 14);
    } catch (e) {
      console.warn("Logo Inawo indisponible pour le PDF:", e);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Adresse : Kindonou, Cotonou", 14, 28);
    doc.text("Téléphone : +229 01 61 00 00 00", 14, 33);
    doc.text("IFU : INW000000000", 14, 38);

    doc.setFillColor(170, 18, 37);
    doc.rect(110, 20, 86, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("BULLETIN DE PAIE", 153, 27, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.rect(14, 44, 58, 24);
    doc.setFillColor(170, 18, 37);
    doc.rect(14, 44, 58, 5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Type de contrat", 16, 48);
    doc.text("CDI", 67, 48, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text("Ancienneté :", 16, 54);
    doc.text("7 mois", 67, 54, { align: "right" });
    doc.text("Mode de paiement :", 16, 60);
    doc.text("Espèces", 67, 60, { align: "right" });
    doc.text("Date de paiement :", 16, 66);
    doc.text(new Date().toLocaleDateString("fr-FR"), 67, 66, { align: "right" });

    doc.rect(110, 35, 86, 33);
    doc.setFillColor(170, 18, 37);
    doc.rect(110, 35, 86, 5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("Nom et prénom(s)", 112, 39);
    doc.text(`${collab?.nom || ""} ${collab?.prenom || ""}`.trim() || "N/A", 194, 39, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text("Matricule :", 112, 46);
    doc.text(String(collab?.id || ""), 194, 46, { align: "right" });
    doc.text("N° CNSS :", 112, 52);
    doc.text("-", 194, 52, { align: "right" });
    const fonctionCollaborateur =
      collab?.fonction ||
      collab?.poste ||
      collab?.emploi ||
      collab?.job_title ||
      "Employé";
    doc.text("Fonction :", 112, 58);
    doc.text(fonctionCollaborateur, 194, 58, { align: "right" });
    doc.text("Période :", 112, 64);
    doc.text(String(collab?.periode || "-"), 194, 64, { align: "right" });

    const tableX = 14;
    const tableY = 78;
    const tableWidth = 182;
    const rowHeight = 7;

    const col1 = tableX;
    const col2 = tableX + 84;
    const col3 = tableX + 126;
    const col4 = tableX + 154;
    const colEnd = tableX + tableWidth;

    doc.setFillColor(170, 18, 37);
    doc.rect(tableX, tableY, tableWidth, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("LIBELLÉS", col1 + 24, tableY + 4.7, { align: "center" });
    doc.text("Base", col2 + 21, tableY + 4.7, { align: "center" });
    doc.text("Taux", col3 + 14, tableY + 4.7, { align: "center" });
    doc.text("Montant", col4 + 19, tableY + 4.7, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const rows = [
      { label: "Salaire de base", base: salaireBase, taux: "", montant: salaireBase },
      { label: "Primes", base: "", taux: "", montant: prime },
      { label: "Indemnités", base: "", taux: "", montant: indemnites },
      { label: "Heures supplémentaires", base: "", taux: "", montant: heuresSupplementaires },
      { label: "Autres avantages", base: "", taux: "", montant: autresAvantages },
      { label: "Salaire brut", base: salaireBrut, taux: "", montant: salaireBrut, highlight: true },
      { label: "Cotisation CNSS", base: salaireBrut, taux: "3,6%", montant: cnss },
      { label: "ITS", base: baseImposable, taux: "Progressif", montant: its },
      { label: "Salaire net", base: "", taux: "", montant: salaireNet, highlight: true },
    ];

    rows.forEach((row, index) => {
      const y = tableY + 7 + index * rowHeight;
      if (row.highlight) {
        doc.setFillColor(240, 240, 240);
        doc.rect(tableX, y, tableWidth, rowHeight, "F");
      }

      doc.text(row.label, col1 + 1.5, y + 4.5);
      doc.text(row.base === "" ? "" : formatAmount(row.base), col3 - 1.5, y + 4.5, { align: "right" });
      doc.text(String(row.taux || ""), col4 - 1.5, y + 4.5, { align: "right" });
      doc.text(formatAmount(row.montant), colEnd - 1.5, y + 4.5, { align: "right" });
    });

    const tableBottom = tableY + 7 + rows.length * rowHeight;
    doc.setDrawColor(0, 0, 0);
    [col1, col2, col3, col4, colEnd].forEach((x) => {
      doc.line(x, tableY, x, tableBottom);
    });
    doc.line(tableX, tableY, colEnd, tableY);
    doc.line(tableX, tableBottom, colEnd, tableBottom);

    for (let i = 0; i <= rows.length; i += 1) {
      const y = tableY + 7 + i * rowHeight;
      doc.line(tableX, y, colEnd, y);
    }

    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(
      `Taxe radiophonique (${String(collab?.periode || "-")}): ${formatAmount(taxeRadiophonique)} FCFA (information, non déduite du salaire net)`,
      14,
      tableBottom + 10
    );
    doc.text("Conservez ce bulletin de paie sans limitation de durée.", 14, 285);

    doc.save(`bulletin_paie_${(collab?.nom || "employe").toLowerCase()}_${collab?.id || ""}.pdf`);
  }, [computeITS, computeTaxeRadiophonique, formatAmount, loadImageAsDataUrl, parseAmount]);

  // États avec données statiques
  const [employeList, setEmployeList] = useState([
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      periode: "Mai",
      lot_de_paie: "Lot 1",
      remuneration_totale: "500 000 ",
      salaire_base: "400 000 ",
      statut: "actif",
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Marie",
      periode: "Juin",
      lot_de_paie: "Lot 2",
      remuneration_totale: "600 000 ",
      salaire_base: "500 000 ",
      statut: "actif",

    },
    {
      id: 3,
      nom: "Durant",
      prenom: "Pierre",
      periode: "Juillet",
      lot_de_paie: "Lot 3",
      remuneration_totale: "550 000 ",
      salaire_base: "450 000 ",
      statut: "inactif",
    },


  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);


  // ✅ Fonction pour obtenir le label du statut
  const getStatusLabel = useCallback((statusValue) => {
    const statusLabels = {
      'actif': 'Actif',
      'inactif': 'Inactif'
    };
    return statusLabels[statusValue] || 'Inconnu';
  }, []);

  // ✅ Fonction pour obtenir la couleur du statut
  const getStatusColor = useCallback((statusValue) => {
    const statusColors = {
      'actif': 'success',
      'inactif': 'danger'
    };
    return statusColors[statusValue] || 'secondary';
  }, []);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      setEmployeList((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      toast.success("Suppression effectuée avec succès");
      setDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleDeleteClose = () => {
    setDeleteModal(false);
    setItemToDelete(null);
  };

  // Récupération des collaborateurs (désactivé - utilisation de données statiques)
  /*
  useEffect(() => {
    const fetchCollaborateurs = async () => {
      if (!token) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${BaseUrl}/utilisateurs/collaborateurs/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setEmployeList(Array.isArray(data) ? data : data.results || []);
        } else {
          throw new Error("Erreur lors de la récupération des employés");
        }
      } catch (err) {
        console.error("Erreur fetch employés:", err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployes();
  }, [token]);
  */

  // Onglets de navigation
  //   const navTabsData = useMemo(
  //     () => [
  //       {
  //         key: "1",
  //         label: "Tous les employés",
  //         icon: "ri-user-line",
  //         filterType: "all",
  //       },
  // {
  //   key: "2",
  //   label: "Info contrat",
  //   icon: "ri-file-text-line",
  //   filterType: "all",
  // },
  //   { 
  //     key: "2",
  //     label: "Actifs",
  //     icon: "ri-user-follow-line",
  //     filterType: "actif",
  //   },

  // {
  //   key: "3",
  //   label: "Expérience",
  //   icon: "ri-briefcase-line",
  //   filterType: "all",
  // },
  //   {
  //     key: "3",
  //     label: "Inactifs",
  //     icon: "ri-user-unfollow-line",
  //     filterType: "inactif",
  //   },

  // {
  //   key: "4",
  //   label: "Affectation",
  //   icon: "ri-building-line",
  //   filterType: "all",
  // },
  // {
  //   key: "5",
  //   label: "Historique",
  //   icon: "ri-history-line",
  //   filterType: "all",
  // },
  // {
  //   key: "6",
  //   label: "Fiche de paie",
  //   icon: "ri-money-dollar-circle-line",
  //   filterType: "all",
  // },
  // {
  //   key: "7",
  //   label: "Présences",
  //   icon: "ri-calendar-check-line",
  //   filterType: "all",
  // },
  //     ],
  //     []
  //   );

  // Filtrage des données
  const filteredData = useMemo(() => {
    let filtered = employeList;

    // Filtre par recherche uniquement
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered;
  }, [employeList, searchTerm]);

  // Pagination
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredData, currentPage, itemsPerPage]);

  // Colonnes du tableau
  const columns = useMemo(
    () => [
      {
        header: "N°",
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => {
          const index = cellProps.row.index;
          return (currentPage - 1) * itemsPerPage + index + 1;
        },
      },
      {
        header: "Nom-Prénom",
        accessorKey: "nom",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => {
          const fiche = cellProps.row.original;
          return (
            <Link
              to={`/${entreprise}/fiche-details/${fiche.id}`}
              state={{ fichePaie: fiche }}
              className="d-flex align-items-center gap-2 text-body fw-medium"
            >
              <i className="ri-user-fill text-primary"></i>
              {cellProps.getValue() || "Non défini"}
            </Link>
          );
        },
      },

      {
        header: "Période",
        accessorKey: "periode",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell) => cell.getValue() || "Non défini",
      },

      {
        header: "Lot de paie",
        accessorKey: "lot_de_paie",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell) => cell.getValue() || "Non défini",
      },
      {
        header: "Remunération totale",
        accessorKey: "remuneration_totale",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell) => cell.getValue() || "Non défini",
      },
      {
        header: "Salaire de base",
        accessorKey: "salaire_base",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell) => cell.getValue() || "Non défini",
      },

      {
        header: "Statut",
        accessorKey: "statut",
        enableColumnFilter: false,
        cell: (cell) => {
          const statusValue = cell.getValue();
          return (
            <Badge
              color={getStatusColor(statusValue)}
              className="rounded-pill"
            >
              {getStatusLabel(statusValue)}
            </Badge>
          );
        },
      },



      {
        header: "Actions",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => {
          const collab = cellProps.row.original;

          return (
            <div className="gap-1">
              <Link
                to={`/${entreprise}/fiche-details/${collab.id}`}
                state={{ fichePaie: collab }}
                className="text-info"
                title={t("Voir détails")}
              >
                <i className="ri-eye-fill fs-16"></i>
              </Link>
              <Link
                to={`/${entreprise}/fiche-edit/${collab.id}`}
                state={{ fichePaie: collab }}
                className="text-primary p-2"
                title={t("Modifier")}
              >
                <i className="ri-pencil-fill fs-16"></i>
              </Link>
              <Link
                to="#"
                className="text-info p-2"
                title={t("Exporter")}
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    await generatePayslipPdf(collab);
                    toast.success(t("Bulletin de paie téléchargé avec succès"));
                  } catch (err) {
                    console.error("Erreur lors de la génération du bulletin:", err);
                    toast.error(t("Erreur lors de la génération du bulletin de paie"));
                  }
                }}
              >
                <i className="ri-file-download-line fs-16"></i>
              </Link>
              <Link

                to="#"
                className="text-danger p-2"
                title={t("Supprimer")}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteClick(cellProps.row.original);
                }}
              >
                <i className="ri-delete-bin-5-fill fs-16"></i>
              </Link>
            </div>
          );
        },
      },
    ],
    [currentPage, itemsPerPage, entreprise, getStatusColor, getStatusLabel, generatePayslipPdf]
  );

  document.title = "Fiche de Paie| INAWO - Suite de Gestion";

  return (
    <div className="page-content">
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={filteredData}
      />
      <Container fluid>
        <BreadCrumb
          title={`\u00a0${t("Fiche de paie")}`}
          pageTitle={
            <>
              <i className="ri-team-line"></i>
              &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>&nbsp;&gt;
            </>
          }
        />
        <Row>
          <Col lg={12}>
            <SearchAndActionBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder={t("Chercher une fiche de paie...")}
              showSearch={true}
              customButtons={[
                {
                  text: t("Lot de paie"),
                  icon: "ri-stack-line",
                  className: "btn btn-info d-inline-flex align-items-center",
                  onClick: () => toast.info(t("Fonctionnalité Lot de paie bientôt disponible")),
                },
              ]}
              // onExportClick={() => setIsExportCSV(true)}
              addButtonLink={generatePath("/:entreprise/fiche-add")}
              addButtonText={t("Nouvelle fiche de paie")}
              addButtonIcon="ri-file-add-line"
              // showExportButton={true}
              showAddButton={true}
            />
          </Col>



          <Col lg={12}>
            {loading ? (
              <div className="d-flex justify-content-center my-5">
                <Loader />
              </div>
            ) : employeList.length > 0 ? (
              <TableContainer
                columns={columns}
                data={currentItems}
                isGlobalFilter={false}
                customPageSize={itemsPerPage}
                showNavTabs={false}
                containerStyle={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
                }}
              >
                <Pagination
                  data={filteredData}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  perPageData={itemsPerPage}
                  alwaysShow={true}
                  showInfo={true}
                />
              </TableContainer>
            ) : (
              <EmptyDataCard
                title={t("Aucune fiche de paie trouvée")}
                description={t("Commencez par ajouter une fiche de paie")}
                actionButton={
                  <Link
                    to={generatePath("/:entreprise/fiche-add")}
                    className="btn btn-success add-btn"
                    style={{ borderRadius: "20px" }}
                  >
                    <i className="ri-user-add-line me-1"></i>
                    {t("Ajouter une fiche de paie")}
                  </Link>
                }
              />
            )}
          </Col>
        </Row>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteConfirm}
          onCloseClick={handleDeleteClose}
        />
      </Container>
    </div>
  );
};

export default FichePaie;