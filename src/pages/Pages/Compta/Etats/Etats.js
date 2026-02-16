// Etats.js - Version simplifiée
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEtatsData } from "./hooks/useEtatsData";
import NavigationTabs from "./components/NavigationTabs";
import SearchAndActions from "./components/SearchAndActions";
import EmptyDataCard from "../../../../Components/Common/EmptyDataCard";
import Loader from "../../../../Components/Common/Loader";
import ExportCSVModal from "../../../../Components/Common/ExportCSVModal";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";


// Import des composants de tableaux
import Note1 from "./tables/Note1";
// import Note2Table from "./components/tables/Note2Table";
// import TFTTable from "./components/tables/TFTTable";
// import Fiche4Table from "./components/tables/Fiche4Table";
// import BilanTable from "./components/tables/BilanTable";
// import ResultatTable from "./components/tables/ResultatTable";
// import NomenclatureTable from "./components/tables/NomenclatureTable";
// import CodesTable from "./components/tables/CodesTable";
// import FicheR3Table from "./components/tables/FicheR3Table";
// import Note17_35Table from "./components/tables/Note17_35Table";

const Etats = () => {
  // États principaux
  const [activeTab, setActiveTab] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Hook personnalisé pour la gestion des données
  const {
    loading,
    currentData,
    filteredData,
    exportData,
    formatAmount,
    fetchData,
    getActiveTabTitle
  } = useEtatsData(activeTab, searchTerm);

  // Chargement initial
  useEffect(() => {
    document.title = "États Comptables | INAWO - Suite de Gestion";
    fetchData();
  }, [activeTab]);

  // Gestionnaire de suppression
  const handleDeleteItem = async () => {
    if (!itemToDelete?.id) return;
    
    setTimeout(() => {
      // TODO: Implémenter la suppression réelle
      setDeleteModal(false);
      setItemToDelete(null);
    }, 600);
  };

  // Rendu du tableau selon l'onglet actif
  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: "300px" }}>
          <div className="text-center">
            <Loader />
            <p className="mt-3 text-muted">Chargement des données...</p>
          </div>
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <EmptyDataCard
          title="Aucune donnée trouvée"
          description={
            searchTerm
              ? `Aucun résultat pour "${searchTerm}". Essayez avec d'autres termes.`
              : "Aucune donnée disponible pour cet état comptable."
          }
          actionButton={
            <button
              className="btn btn-success rounded-pill"
              onClick={() => setSearchTerm("")}
            >
              <i className="ri-refresh-line me-1"></i>
              Réinitialiser la recherche
            </button>
          }
        />
      );
    }

    // Sélection du composant de tableau selon l'onglet
    const tableComponents = {
    //   "1": <CodesTable data={filteredData} formatAmount={formatAmount} />,
    //   "2": <NomenclatureTable data={filteredData} formatAmount={formatAmount} />,
    //   "3": <FicheR3Table data={filteredData} formatAmount={formatAmount} />,
    //   "4": <BilanTable data={filteredData} formatAmount={formatAmount} type="complet" />,
    //   "5": <BilanTable data={filteredData} formatAmount={formatAmount} type="actif" />,
    //   "6": <BilanTable data={filteredData} formatAmount={formatAmount} type="passif" />,
    //   "7": <ResultatTable data={filteredData} formatAmount={formatAmount} />,
    //   "8": <TFTTable data={filteredData} formatAmount={formatAmount} />,
    //   "9": <Fiche4Table data={filteredData} formatAmount={formatAmount} />,
      "10": <Note1 data={filteredData} formatAmount={formatAmount} />,
    //   "11": <Note2Table data={filteredData} formatAmount={formatAmount} />,
      // Pour les notes 12 à 16, vous pourriez créer un composant générique
      // Pour les notes 17 à 35, utiliser un composant configurable
    //   "37": <Note17_35Table data={filteredData} formatAmount={formatAmount} type="engagements" />,
    //   "38": <Note17_35Table data={filteredData} formatAmount={formatAmount} type="devises" />,
      // ... etc pour les autres onglets
    };

    return tableComponents[activeTab] || (
      <div className="alert alert-warning">
        Composant pour l'onglet {activeTab} non implémenté
      </div>
    );
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
            style={{ marginTop: "70px" }}
          />

          {/* Modals */}
          <ExportCSVModal
            show={isExportCSV}
            onCloseClick={() => setIsExportCSV(false)}
            data={exportData}
            filename={`${getActiveTabTitle.replace(/ /g, "_")}_${
              new Date().toISOString().split("T")[0]
            }`}
          />

          <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteItem}
            onCloseClick={() => {
              setDeleteModal(false);
              setItemToDelete(null);
            }}
            deleteMessage="Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
          />

          {/* Breadcrumb */}
          <BreadCrumb
            title={getActiveTabTitle}
            pageTitle={
              <>
                <i className="ri-file-text-line me-1 align-bottom"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de bord</Link>&nbsp;&gt;
              </>
            }
          />

          {/* Barre de recherche et actions */}
          <Row>
            <Col lg={12}>
              <SearchAndActions
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                activeTabTitle={getActiveTabTitle}
                filteredDataLength={filteredData.length}
                onExportClick={() => setIsExportCSV(true)}
                onAddClick={() => {}} // Si nécessaire
              />
            </Col>
          </Row>

          {/* Contenu principal */}
          <Row className="mb-3">
            <Col lg={12}>
              <div className="card rounded-4">
                <div className="card-body p-0">
                  {/* Navigation par onglets */}
                  <NavigationTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />

                  {/* Contenu de l'onglet */}
                  <div className="p-3">
                    {renderTableContent()}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Etats;