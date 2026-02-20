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


const FichePaie = () => {
  const { entreprise } = useParams();
  const { generatePath } = useMenuLinks();
  
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
              setAvancePretList(avancePretList.filter(i => i.id !== itemToDelete.id));
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
                title="Voir détails"
              >
                <i className="ri-eye-fill fs-16"></i>
              </Link>
              <Link
                to={`/${entreprise}/fiche-edit/${collab.id}`}
                state={{ fichePaie: collab }}
                className="text-primary p-2"
                title="Modifier"
              >
                <i className="ri-pencil-fill fs-16"></i>
              </Link>
              <Link
                to="#"
                className="text-info p-2"
                title="Exporter"
                onClick={() => toast.info("Export non implémenté")}
              >
                <i className="ri-file-download-line fs-16"></i>
              </Link>
                <Link
                
                 to="#"
                 className="text-danger p-2"
                title="Supprimer"
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
    [currentPage, itemsPerPage, entreprise]
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
          title="&nbsp;Fiche de paie"
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
            searchPlaceholder="Chercher une fiche de paie..."
            showSearch={true}
            customButtons={[
              {
                text: "Lot de paie",
                icon: "ri-stack-line",
                className: "btn btn-info d-inline-flex align-items-center",
                onClick: () => toast.info("Fonctionnalité Lot de paie bientôt disponible"),
              },
            ]}
            // onExportClick={() => setIsExportCSV(true)}
            addButtonLink={generatePath("/:entreprise/fiche-add")}
            addButtonText="Nouvelle fiche de paie"
            addButtonIcon="ri-file-add-line"
            // showExportButton={true}
            showAddButton={true}
          />

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
                title="Aucune fiche de paie trouvée"
                description="Commencez par ajouter une fiche de paie ."
                actionButton={
                  <Link
                    to={generatePath("/:entreprise/fiche-add")}
                    className="btn btn-success add-btn"
                    style={{ borderRadius: "20px" }}
                  >
                    <i className="ri-user-add-line me-1"></i>
                    Ajouter une fiche de paie
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