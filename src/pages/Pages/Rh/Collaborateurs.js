import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import Loader from "../../../Components/Common/Loader";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import { toast } from "react-toastify";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SearchAndActionBar from "../../../Components/Common/SearchAndActionBar";
import EmptyDataCard from "../../../Components/Common/EmptyDataCard";
import Pagination from "../../../Components/Common/Pagination";
import { BaseUrl } from "../../APIKey/ApiKey";

const Collaborateurs = () => {
  const { userProfile, token } = useProfile();
  
  // États avec données statiques
  const [collaborateurList, setCollaborateurList] = useState([
    {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
      affiliation: "Mari",
      email: "jean.dupont@inawo.com",
      telephone: "+229 97 00 00 01",
      ville: "Cotonou",
      poste: "Directeur Général",
      departement: "Direction",
      typecontrat: "CDI",
      statut: "actif"
    },
    {
      id: 2,
      nom: "Martin",
      prenom: "Marie",
      affiliation: "Femme",
      email: "marie.martin@inawo.com",
      telephone: "+229 97 00 00 02",
      ville: "Porto-Novo",
      poste: "Responsable RH",
      departement: "Ressources humaines",
      statut: "inactif",
      typecontrat: "CDD"
    },
    {
      id: 3,
      nom: "Durant",
      prenom: "Pierre",
      affiliation: "Enfant",
      email: "pierre.durant@inawo.com",
      telephone: "+229 97 00 00 03",
      ville: "Parakou",
      poste: "Comptable",
      departement: "Finance",
      statut: "actif",
      typecontrat: "Stage professionnelle"
    },
    
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

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
          setCollaborateurList(Array.isArray(data) ? data : data.results || []);
        } else {
          throw new Error("Erreur lors de la récupération des collaborateurs");
        }
      } catch (err) {
        console.error("Erreur fetch collaborateurs:", err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborateurs();
  }, [token]);
  */

  // Onglets de navigation
  const navTabsData = useMemo(
    () => [
      {
        key: "1",
        label: "Tous les collaborateurs",
        icon: "ri-user-line",
        filterType: "all",
      },
      // {
      //   key: "2",
      //   label: "Info contrat",
      //   icon: "ri-file-text-line",
      //   filterType: "all",
      // },
      { 
        key: "2",
        label: "Actifs",
        icon: "ri-user-follow-line",
        filterType: "actif",
      },

      // {
      //   key: "3",
      //   label: "Expérience",
      //   icon: "ri-briefcase-line",
      //   filterType: "all",
      // },
      {
        key: "3",
        label: "Inactifs",
        icon: "ri-user-unfollow-line",
        filterType: "inactif",
      },

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
    ],
    []
  );

  // Filtrage des données
  const filteredData = useMemo(() => {
    let filtered = collaborateurList;

    const activeStatusFilter =
      activeTab === "2" ? "actif" : activeTab === "3" ? "inactif" : "all";

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

    if (activeStatusFilter !== "all") {
      filtered = filtered.filter(
        (item) => (item.statut || "").toLowerCase() === activeStatusFilter
      );
    }

    return filtered;
  }, [collaborateurList, searchTerm, activeTab]);

  // Pagination
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredData, currentPage, itemsPerPage]);

  // Colonnes du tableau
  const columns = useMemo(() => {
    if (activeTab === "1" || activeTab === "2" || activeTab === "3") {
      return [
        {
          header: "N°",
          accessorKey: "id",
          enableColumnFilter: false,
          cell: (cellProps) => {
            const index = cellProps.row.index;
            return (currentPage - 1) * itemsPerPage + index + 1;
          },
        },
        {
          header: "Nom",
          accessorKey: "nom",
          enableColumnFilter: false,
          cell: (cell) => (
            <div className="d-flex align-items-center gap-2">
              <i className="ri-user-fill text-primary"></i>
              {cell.getValue() || "Non défini"}
            </div>
          ),
        },
        {
          header: "Prénom",
          accessorKey: "prenom",
          enableColumnFilter: false,
          cell: (cell) => cell.getValue() || "Non défini",
        },
        {
          header: "Affiliation",
          accessorKey: "affiliation",
          enableColumnFilter: false,
          cell: (cell) => cell.getValue() || "Non défini",
        },
        {
          header: "Téléphone",
          accessorKey: "telephone",
          enableColumnFilter: false,
        },
        {
         header: "Poste",
        accessorKey: "poste",
        enableColumnFilter: false,
        cell: (cell) => cell.getValue() || "Non défini",
        },
           {
        header: "Statut",
        accessorKey: "statut",
        enableColumnFilter: false,
        cell: (cell) => {
          const status = cell.getValue();
          const normalizedStatus = (status || "").toLowerCase();
          const badgeClass =
            normalizedStatus === "actif"
              ? "badge bg-success rounded-pill"
              : normalizedStatus === "inactif"
              ? "badge bg-danger rounded-pill"
              : "badge bg-secondary rounded-pill";
          const label =
            normalizedStatus === "actif"
              ? "Actif"
              : normalizedStatus === "inactif"
              ? "Inactif"
              : "Inconnu";
          return <span className={badgeClass} style={{fontSize: "0.65rem", padding: "0.25rem 0.5rem"}}>{label}</span>;
        },
      },
      {
        header: "Actions",
        enableColumnFilter: false,
        cell: (cellProps) => {
          const collab = cellProps.row.original;

          return (
            <div className="gap-1">
              <Link
                to="/:entreprise/collaborateur-details"
                className="text-primary p-2"
                title="Voir détails"
              >
                <i className="ri-eye-fill fs-16"></i>
              </Link>
              <Link
                to={`/:entreprise/collaborateur-edit/${collab.id}`}
                className="text-warning p-2"
                title="Modifier"
              >
                <i className="ri-pencil-fill fs-16"></i>
              </Link>
              <Link
                to="#"
                className="text-danger p-2"
                title="Supprimer"
                onClick={() => {
                  if (window.confirm("Confirmer la suppression ?")) {
                    toast.info("Suppression non implémentée");
                  }
                }}
              >
                <i className="ri-delete-bin-5-fill fs-16"></i>
              </Link>
            </div>
          );
        },
      },

      ];
    }
    // if (activeTab === "4") {
    //   return [
    //     {
    //       header: "N°",
    //       accessorKey: "id",
    //       enableColumnFilter: false,
    //       cell: (cellProps) => {
    //         const index = cellProps.row.index;
    //         return (currentPage - 1) * itemsPerPage + index + 1;
    //       },
    //     },
    //     {
    //       header: "Poste",
    //       accessorKey: "poste",
    //       enableColumnFilter: false,
    //       cell: (cell) => cell.getValue() || "Non défini",
    //     },
    //     {
    //       header: "Departement",
    //       accessorKey: "departement",
    //       enableColumnFilter: false,
    //       cell: (cell) => cell.getValue() || "Non défini",
    //     },
    //   ];
    // }
    

    return [
      {
        header: "N°",
        accessorKey: "id",
        enableColumnFilter: false,
        cell: (cellProps) => {
          const index = cellProps.row.index;
          return (currentPage - 1) * itemsPerPage + index + 1;
        },
      },
      {
        header: "Nom complet",
        accessorKey: "nom",
        enableColumnFilter: false,
        cell: (cellProps) => {
          const collab = cellProps.row.original;
          const fullName = [collab.prenom, collab.nom].filter(Boolean).join(" ");
          return (
            <Link
              to="/:entreprise/collaborateur-details"
              className="fw-medium text-body"
            >
              {fullName || "Sans nom"}
            </Link>
          );
        },
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Téléphone",
        accessorKey: "telephone",
        enableColumnFilter: false,
      },
      {
        header: "Poste",
        accessorKey: "poste",
        enableColumnFilter: false,
        cell: (cell) => cell.getValue() || "Non défini",
      },
      {
        header: "Statut",
        accessorKey: "statut",
        enableColumnFilter: false,
        cell: (cell) => {
          const status = cell.getValue();
          const normalizedStatus = (status || "").toLowerCase();
          const badgeClass =
            normalizedStatus === "actif"
              ? "badge bg-success"
              : normalizedStatus === "inactif"
              ? "badge bg-danger"
              : "badge bg-secondary";
          const label =
            normalizedStatus === "actif"
              ? "Actif"
              : normalizedStatus === "inactif"
              ? "Inactif"
              : "Inconnu";
          return <span className={badgeClass}>{label}</span>;
        },
      },
      {
        header: "Actions",
        enableColumnFilter: false,
        cell: (cellProps) => {
          const collab = cellProps.row.original;

          return (
            <div className="gap-1">
              <Link
                to="/:entreprise/collaborateur-details"
                className="text-primary p-2"
                title="Voir détails"
              >
                <i className="ri-eye-fill fs-16"></i>
              </Link>
              <Link
                to={`/:entreprise/collaborateur-edit/${collab.id}`}
                className="text-warning p-2"
                title="Modifier"
              >
                <i className="ri-pencil-fill fs-16"></i>
              </Link>
              <Link
                to="#"
                className="text-danger p-2"
                title="Supprimer"
                onClick={() => {
                  if (window.confirm("Confirmer la suppression ?")) {
                    toast.info("Suppression non implémentée");
                  }
                }}
              >
                <i className="ri-delete-bin-5-fill fs-16"></i>
              </Link>
            </div>
          );
        },
      },
    ];
  }, [activeTab, currentPage, itemsPerPage]);

  // Gestion des onglets
  const handleTabChange = useCallback((tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
  }, []);

  document.title = "Collaborateurs | INAWO - Suite de Gestion";

  return (
    <div className="page-content">
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={filteredData}
      />
      <Container fluid>
        <BreadCrumb
          title="&nbsp;Collaborateurs"
          pageTitle={
            <>
              <i className="ri-team-line"></i>
              &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
            </>
          }
        />
        <Row>
          <SearchAndActionBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Chercher un collaborateur..."
            showSearch={true}
            addButtonLink="/:entreprise/collaborateur-add"
            addButtonText="Ajouter un collaborateur"
            addButtonIcon="ri-user-add-line"
            showAddButton={true}
            onExportClick={() => setIsExportCSV(true)}
            exportButtonText="Exporter"
            exportButtonIcon="ri-file-upload-line"
            showExportButton={true}
          />

          <Col lg={12}>
            {loading ? (
              <div className="d-flex justify-content-center my-5">
                <Loader />
              </div>
            ) : collaborateurList.length > 0 ? (
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
                title="Aucun collaborateur trouvé"
                description="Commencez par ajouter un collaborateur à votre équipe"
                actionButton={
                  <Link
                    to="/:entreprise/collaborateur-add"
                    className="btn btn-success add-btn"
                    style={{ borderRadius: "20px" }}
                  >
                    <i className="ri-user-add-line me-1"></i>
                    Ajouter un collaborateur
                  </Link>
                }
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Collaborateurs;