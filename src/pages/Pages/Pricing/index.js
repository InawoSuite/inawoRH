 {/* ÉTAPE 2 - Modal Période */}
                    {/* <Modal
                      isOpen={step2PeriodeOpen}
                      toggle={toggleStep1}
                      centered
                      modalClassName="border-0"
                      contentClassName="rounded-4"
                    >
                      <ModalHeader
                        toggle={toggleStep2}
                        className="bg-info-subtle p-1 rounded-top-4"
                      >
                        <i className="ri-calendar-line me-2"></i>
                        Période d'abonnement
                      </ModalHeader>
                      <ModalBody>
                        <div className="mb-4">
                          <p className="text-muted text-center mb-0"></p>
                        </div>

                        <div className="d-flex flex-column gap-2">
                          {periodeOptions.map((periode) => {
                            const tarif = calculateTarif(
                              periode,
                              selectedFormule,
                              selectedCategorie
                            );
                            const montantReduit = Math.round(tarif * 0.85); // 15% de réduction
                            const isGratuit = tarif === 0;

                            const dureeText =
                              periode === "Mensuel"
                                ? "1 mois"
                                : periode === "Trimestriel"
                                ? "3 mois"
                                : periode === "Semestriel"
                                ? "6 mois"
                                : periode === "Annuel"
                                ? "1 an"
                                : "2 ans";

                            return (
                              <div
                                key={periode}
                                style={getPeriodeStyle(periode)}
                                onClick={() => handlePeriodeClick(periode)}
                                onMouseEnter={() => setHoveredPeriode(periode)}
                                onMouseLeave={() => setHoveredPeriode(null)}
                                className="position-relative"
                              >
                                <div
                                  style={{
                                    fontSize: "1.0rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {periode}
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.8rem",
                                    marginTop: "0.25rem",
                                  }}
                                >
                                  <span className="text-muted text-decoration-line-through">
                                    {tarif.toLocaleString()}
                                  </span>
                                  {" → "}
                                  <span className="text-success fw-bold">
                                    {montantReduit.toLocaleString()} 
                                  </span>
                                  <div
                                    className="text-muted"
                                    style={{ fontSize: "0.7rem" }}
                                  >
                                    {dureeText}
                                    <span className="text-success ms-2">
                                      (-15%)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Légende */}
                        {/* <div className="mt-4 p-3 bg-light rounded">
    <div className="row text-center">
      <div className="col-4">
        <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#014a92" }}>Période</div>
        <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>Durée de l'abonnement</div>
      </div>
      <div className="col-4">
        <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#014a92" }}>Prix Original</div>
        <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>Avant réduction</div>
      </div>
      <div className="col-4">
        <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#014a92" }}>Prix Réduit</div>
        <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>Avec -15%</div>
      </div>
    </div>
  </div> */}
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="secondary"
                          style={{ borderRadius: "70px" }}
                          onClick={() => {
                            setStep2PeriodeOpen(false);
                            setStep1FormuleCategorieOpen(true);
                          }}
                        >
                          <i className="ri-arrow-left-line me-1"></i>
                          Retour
                        </Button>
                      </ModalFooter>
                    </Modal> */}













                    // Style pour les périodes - CORRIGÉ
const getPeriodeStyle = (name) => {
  const base = {
    padding: "0.75rem 1rem",
    borderRadius: "70px",
    fontSize: "1.0rem",
    border: "1px solid #014a92",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    marginBottom: "0.5rem",
    width: "100%", // Réduit la largeur
    maxWidth: "250px", // Largeur maximale réduite
    margin: "0 auto 0.5rem auto", // Centré
  };

  const isHovered = hoveredPeriode === name;
  const isSelected = selectedPeriode === name;
  
  return {
    ...base,
    backgroundColor: isHovered || isSelected ? "#014a92" : "transparent",
    color: isHovered || isSelected ? "white" : "#014a92",
  };
};

// Fonction pour obtenir le style du texte de durée - NOUVEAU
const getDureeTextStyle = (name) => {
  const isHovered = hoveredPeriode === name;
  const isSelected = selectedPeriode === name;
  
  return {
    fontSize: "0.7rem",
    color: isHovered || isSelected ? "rgba(255,255,255,0.9)" : "#6c757d",
    marginTop: "0.25rem",
  };
};

// Fonction pour obtenir le style du prix - NOUVEAU
const getPriceStyle = (name) => {
  const isHovered = hoveredPeriode === name;
  const isSelected = selectedPeriode === name;
  
  return {
    fontSize: "0.8rem",
    fontWeight: "bold",
    color: isHovered || isSelected ? "white" : "#014a92",
    marginTop: "0.25rem",
  };
};