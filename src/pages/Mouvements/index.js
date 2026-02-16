import React, { useEffect, useState, useMemo } from "react";
import { Col, Row, Container } from "reactstrap";
import { Link } from "react-router-dom";
import TableContainer from "../../Components/Common/TableContainer";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import SearchAndActionBar from "../../Components/Common/SearchAndActionBar";
import Pagination from "../../Components/Common/Pagination";
import EmptyDataCard from "../../Components/Common/EmptyDataCard";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { BaseUrl } from "../APIKey/ApiKey";

const MouvementsStock = () => {
  const { t } = useTranslation();
  const [mouvements, setMouvements] = useState([]);
  const [filteredMouvements, setFilteredMouvements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const { token } = useProfile();
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [activeTab, setActiveTab] = useState("1"); // Tab actif

  // Fonction pour récupérer les mouvements depuis l'API
  const fetchMouvements = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BaseUrl}/stocks/mouvement/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Mouvements reçus de l'API:", data);

      setMouvements(data);
      setFilteredMouvements(data);
    } catch (err) {
      console.error("Erreur lors de la récupération des mouvements:", err);
      setError(err.message);
      toast.error("Erreur lors du chargement des mouvements");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  // Configuration des onglets avec compteurs
  const navTabsData = useMemo(() => {
    const tousCount = mouvements.length;
    const materielCount = mouvements.filter(m => m.type === "Matériel Équipement").length;
    const matierePremiereCount = mouvements.filter(m => m.type === "Matière Première").length;
    const produitFiniCount = mouvements.filter(m => m.type === "Produit Fini").length;

    return [
      {
        key: "1",
        label: `Tous`,
        icon: "ri-list-check",
        filterType: "all",
      },
      {
        key: "2",
        label: `Matériel Équipement`,
        icon: "ri-tools-line",
        filterType: "Materiel",
      },
      {
        key: "3",
        label: `Matière Première`,
        icon: "ri-flask-line",
        filterType: "Matière Première",
      },
      {
        key: "4",
        label: `Produit`,
        icon: "ri-box-3-line",
        filterType: "Produit",
      },
    ];
  }, [mouvements]);

  // Filtrer les données en fonction de l'onglet actif et du terme de recherche
  useEffect(() => {
    let filtered = mouvements;

    // Filtrage par type (onglet actif)
    const activeTabData = navTabsData.find(tab => tab.key === activeTab);
    if (activeTabData && activeTabData.filterType !== "all") {
      filtered = filtered.filter(mouvement => mouvement.type === activeTabData.filterType);
    }

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (mouvement) =>
          mouvement.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mouvement.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mouvement.raison?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mouvement.mouvement?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMouvements(filtered);
  }, [searchTerm, mouvements, activeTab, navTabsData]);

  // Fonction pour exporter les données
  const handleExport = () => {
    setIsExportCSV(true);
    // Ici vous pouvez ajouter la logique d'export
    console.log("Export des mouvements:", filteredMouvements);
    toast.success("Export des mouvements en cours...");
    
    // Simuler l'export (à remplacer par votre logique réelle)
    setTimeout(() => {
      setIsExportCSV(false);
      toast.success("Export terminé avec succès");
    }, 2000);
  };

  useEffect(() => {
    if (token) {
      fetchMouvements();
    }
  }, [token]);

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Colonnes du tableau
  const columns = useMemo(
    () => [
      {
        header: "Date",
        accessorKey: "date",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="text-muted">{formatDate(cell.getValue())}</span>
        ),
      },
      {
        header: "Désignation",
        accessorKey: "nom",
        enableColumnFilter: false,
        cell: (cell) => (
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <span className="fw-medium">{cell.getValue()}</span>
            </div>
          </div>
        ),
      },
      {
        header: "Type",
        accessorKey: "type",
        enableColumnFilter: false,
      },
      {
        header: "Raison",
        accessorKey: "raison",
        enableColumnFilter: false,
      },
      {
        header: "Mouvement",
        accessorKey: "mouvement",
        enableColumnFilter: false,
        cell: (cell) => {
          const mouvement = cell.getValue();
          const isEntree = mouvement === "Entrée";
          
          return (
            <span 
              style={{ fontSize: "0.58rem" }}
              className={`badge rounded-pill ${
                isEntree ? "bg-success" : "bg-danger"
              } text-white`}
            >
              <i
                className={`ri-${
                  isEntree ? "arrow-up-line" : "arrow-down-line"
                } align-middle me-1`}
              ></i>
              {mouvement}
            </span>
          );
        },
      },
      {
        header: "Quantité",
        accessorKey: "quantite",
        enableColumnFilter: false,
        cell: (cell) => (
          <span
            className={`fw-bold ${
              cell.row.original.mouvement === "Entrée"
                ? "text-success"
                : "text-danger"
            }`}
          >
            {cell.row.original.mouvement === "Entrée" ? "+" : "-"}
            {cell.getValue() != null ? cell.getValue().toLocaleString("fr-FR") : ""}
          </span>
        ),
      },
      {
        header: "Stock Disponible",
        accessorKey: "stock_disponible",
        enableColumnFilter: false,
        cell: (cell) => (
          <div className="text-center">
            <span className="fw-bold">
              {cell.getValue() != null ? cell.getValue().toLocaleString("fr-FR") : ""}
            </span>
            {cell.row.original.alerte && (
              <div className="text-danger small">
                <i className="ri-alarm-warning-line align-middle me-1"></i>
                Stock faible
              </div>
            )}
          </div>
        ),
      },
      {
        header: "Seuil",
        accessorKey: "seuil",
        enableColumnFilter: false,
        cell: (cell) => (
          <span className="text-muted">
            {cell.getValue() != null ? cell.getValue().toLocaleString("fr-FR") : "N/A"}
          </span>
        ),
      }
    ],
    [t]
  );

  // Données paginées
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMouvements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  document.title = "Mouvements de Stock | INAWO - Suite de Gestion";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <ToastContainer closeButton={false} limit={1} />

          <BreadCrumb
            title="&nbsp;Mouvements de Stock"
            pageTitle={
              <>
                <i className="ri-arrow-left-right-line"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
              </>
            }
          />

          <Row>
            <Col lg={12}>
              {/* Barre de recherche et actions */}
              <SearchAndActionBar
                // Props pour la recherche
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Rechercher un mouvement..."
                showSearch={true}
                
                // Props pour le bouton d'actualisation
                onAddClick={fetchMouvements}
                addButtonText="Actualiser"
                addButtonIcon="ri-refresh-line"
                showAddButton={true}
                
                // Props pour le bouton d'export
                onExportClick={handleExport}
                exportButtonText="Exporter"
                exportButtonIcon="ri-file-download-line"
                showExportButton={true}
                
                // État de chargement pour l'export
                exportLoading={isExportCSV}
              />

              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "300px" }}
                >
                  <Loader />
                </div>
              ) : mouvements.length > 0 ? (
                <TableContainer
                  columns={columns}
                  data={currentItems}
                  isGlobalFilter={false}
                  customPageSize={itemsPerPage}
                  showNavTabs={true}
                  navTabs={navTabsData}
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  navTabsClass="nav-tabs nav-tabs-custom nav-success py-4 mb-0 rounded-top-20"
                  containerStyle={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
                  }}
                  groupByDate={true}  // ← create_at sera détecté automatiquement
                  showGroupHeaders={true}
                >
                  {filteredMouvements.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">
                        {searchTerm 
                          ? `Aucun mouvement trouvé pour "${searchTerm}"` 
                          : "Aucun mouvement dans cette catégorie"
                        }
                      </p>
                    </div>
                  ) : (
                    <Pagination
                      style={{ marginLeft: "10px" }}
                      data={filteredMouvements}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      perPageData={itemsPerPage}
                      alwaysShow={true}
                      showInfo={true}
                    />
                  )}
                </TableContainer>
              ) : (
                // Carte vide avec design cohérent
                <EmptyDataCard
                  title="Aucun mouvement trouvé"
                  description="Aucun mouvement de stock n'a été enregistré pour le moment"
                  icon="ri-arrow-left-right-line"
                  actionButton={
                    <button
                      className="btn btn-success"
                      onClick={fetchMouvements}
                      style={{ borderRadius: "20px" }}
                    >
                      <i className="ri-refresh-line me-1"></i>
                      Actualiser
                    </button>
                  }
                />
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MouvementsStock;