import React from "react";
import { Input, Button } from "reactstrap";

const SearchAndActions = ({
  searchTerm,
  onSearchChange,
  activeTabTitle,
  filteredDataLength,
  onExportClick,
  onAddClick,
}) => {
  return (
    <div className="card rounded-4">
      <div className="card-body p-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          {/* Barre de recherche */}
          <div className="flex-grow-1">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="ri-search-line text-muted"></i>
              </span>
              <Input
                type="text"
                className="form-control border-start-0"
                placeholder={`Rechercher dans ${activeTabTitle.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ minWidth: "300px" }}
              />
              {searchTerm && (
                <Button
                  color="light"
                  onClick={() => onSearchChange("")}
                  className="border"
                >
                  <i className="ri-close-line"></i>
                </Button>
              )}
            </div>
          </div>

          {/* Informations */}
          <div className="d-flex align-items-center text-muted">
            <i className="ri-information-line me-1"></i>
            {filteredDataLength} élément
            {filteredDataLength !== 1 ? "s" : ""} trouvé
            {filteredDataLength !== 1 ? "s" : ""}
          </div>

          {/* Boutons d'action */}
          <div className="d-flex gap-2">
            <Button
              color="success"
              className="rounded-pill"
              onClick={onAddClick}
            >
              <i className="ri-file-add-line me-1"></i>
              Ajouter
            </Button>
            <Button
              color="outline-primary"
              className="rounded-pill"
              onClick={onExportClick}
            >
              <i className="ri-file-download-line me-1"></i>
              Exporter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndActions;