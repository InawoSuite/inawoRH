import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Label,
  Input,
  Button,
  Spinner,
  FormGroup,
} from "reactstrap";
import { CustomSelect } from "../Common/CustomSelectStyles";

// Composant Input stable
const StableInput = React.forwardRef(({ value, onChange, type, ...props }, ref) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    let newValue = e.target.value;

    if (type === "text" && (props.name === "quantiter" || props.name === "prix_achat" || props.name === "prix_vente")) {
      const numericPattern = /^[0-9]*\.?[0-9]*$/;
      if (!numericPattern.test(newValue) && newValue !== "") return;
    }

    setInternalValue(newValue);
    if (onChange) onChange(e);
  };

  return <Input {...props} ref={ref} type={type} value={internalValue} onChange={handleChange} style={{ borderRadius: "20px" }} />;
});

const StockFormModal = ({
  isOpen,
  toggle,
  mode = "entree", // "entree" ou "sortie"
  onSubmit,
  loading = false,
  formData,
  onFormChange,
  onSelectChange,
  formErrors,
  unites = [],
  magasins = [],
  groupes = [],
  departements = [],
  produits = [],
  materiels = [],
  matieresPremieres = [],
  selectedItem,
  onItemSelect,
  getSelectedValue,
  getTypeOptions,
  destinationType,
  setDestinationType,
}) => {
  const nomInputRef = useRef(null);
  const quantiteInputRef = useRef(null);
  const prixAchatRef = useRef(null);
  const prixVenteRef = useRef(null);

  // Options pour les selects
  const typeOptions = [
    { value: "Produit", label: "Produit" },
    { value: "Materiel", label: "Matériel équipement" },
    { value: "Matiere Premiere", label: "Matière première" },
  ];

  const raisonOptions = mode === "entree" 
    ? [
        { value: "Achat", label: "Achat/Approvisionnement" },
        { value: "Don/Dotation", label: "Don/Dotation" },
        { value: "Retour client", label: "Retour client" },
        { value: "Retour service interne", label: "Retour de service interne" },
        { value: "Production Interne", label: "Production Interne" },
        { value: "Transformation", label: "Transformation" },
        { value: "Regularisation", label: "Régularisation ou inventaire" },
        { value: "Recuperation", label: "Récupération" },
        { value: "Retour Location", label: "Retour Location" },
        { value: "Sous-Traitance", label: "Sous-Traitance" },
        { value: "Consignation", label: "Consignation" },
        { value: "Reintegration", label: "Reintegration" },
        { value: "Retour Pret-Tiers", label: "Retour Pret-Tiers" },
        { value: "Transfert", label: "Transfert" },
      ]
    : [
        { value: "Vente", label: "Vente" },
        { value: "Consommation interne", label: "Consommation interne" },
        { value: "Pret a tiers", label: "Prêt à tiers" },
        { value: "location", label: "Location" },
        { value: "Perte ou avarie", label: "Perte ou avarie" },
        { value: "Retour founisseur", label: "Retour fournisseur" },
        { value: "Regularisation", label: "Regularisation" },
        { value: "Recyclage", label: "Recyclage" },
        { value: "Transfert", label: "Transfert" },
        { value: "Donation/Echantillon", label: "Donation/Echantillon" },
        { value: "Production/Transformation", label: "Production/Transformation" },
        { value: "Pret à Tiers", label: "Pret à Tiers" },
        { value: "Stock en Consignation", label: "Stock en Consignation" },
      ];

  const uniteOptions = [
    { value: "", label: "Sélectionner une unité" },
    ...unites.map((unite) => ({
      value: String(unite.id),
      label: `${unite.nom}${unite.symbole ? ` (${unite.symbole})` : ""}`,
    })),
  ];

  const magasinOptions = [
    { value: "", label: "Sélectionner un magasin" },
    ...magasins.map((magasin) => ({
      value: String(magasin.id),
      label: magasin.nom,
    })),
  ];

  const groupeOptions = [
    { value: "", label: "Sélectionner une succursale" },
    ...groupes.map((groupe) => ({
      value: String(groupe.id),
      label: groupe.nom,
    })),
  ];

  const departementOptions = [
    { value: "", label: "Sélectionner un département" },
    ...departements.map((departement) => ({
      value: String(departement.id),
      label: departement.nom,
    })),
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDestinationTypeChange = (e) => {
    const { value } = e.target;
    setDestinationType(value);
    // Réinitialiser les autres champs de destination
    onSelectChange("magasin", null);
    onSelectChange("succursale", null);
    onSelectChange("departement", null);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered contentClassName="custom-rounded-modal">
      <ModalHeader className="bg-light p-3 rounded-top-20" toggle={toggle} style={{ borderBottom: "none" }}>
        {mode === "entree" ? "Nouvelle entrée de stock" : "Nouvelle sortie de stock"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          {/* Champ Type */}
          <div className="mb-3">
            <Label htmlFor="type">Type <span className="text-danger">*</span></Label>
            <div style={{ border: formErrors.type ? "1px solid #dc3545" : "none", borderRadius: "20px" }}>
              <CustomSelect
                options={typeOptions}
                value={getSelectedValue("type", typeOptions)}
                onChange={(selected) => onSelectChange("type", selected)}
                placeholder="Sélectionner un type"
                className="border-0 rounded-pill"
              />
            </div>
            {formErrors.type && <div className="text-danger small mt-1">Le type est obligatoire</div>}
          </div>

          {/* Item sélection */}
          {formData.type && (
            <div className="mb-3">
              <Label htmlFor="item">
                Sélectionner un {formData.type.toLowerCase()} <span className="text-danger">*</span>
              </Label>
              <div style={{ border: formErrors.nom ? "1px solid #dc3545" : "none", borderRadius: "20px" }}>
                <CustomSelect
                  options={getTypeOptions()}
                  value={getSelectedValue("item", getTypeOptions())}
                  onChange={(selected) => {
                    onSelectChange("item", selected);
                    onItemSelect(selected);
                  }}
                  placeholder={`Sélectionner un ${formData.type.toLowerCase()}`}
                  className="border-0 rounded-pill"
                  isSearchable={true}
                />
              </div>
              {formErrors.nom && <div className="text-danger small mt-1">Veuillez sélectionner un item</div>}
            </div>
          )}

          {/* Nom (lecture seule) */}
          <div className="mb-3">
            <Label htmlFor="nom">Nom <span className="text-danger">*</span></Label>
            <StableInput
              type="text"
              name="nom"
              value={formData.nom}
              onChange={onFormChange}
              className={formErrors.nom ? "is-invalid" : ""}
              style={{ borderRadius: "20px", backgroundColor: "#f8f9fa" }}
              placeholder="Sélectionnez d'abord un item"
              readOnly={true}
              ref={nomInputRef}
            />
          </div>

          {/* Code (lecture seule) */}
          <div className="mb-3">
            <Label htmlFor="code">Code</Label>
            <StableInput
              type="text"
              name="code"
              value={formData.code}
              onChange={onFormChange}
              readOnly={true}
              style={{ borderRadius: "20px", backgroundColor: "#f8f9fa" }}
            />
          </div>

          {/* Unité */}
          <div className="mb-3">
            <Label htmlFor="unite">Unité <span className="text-danger">*</span></Label>
            <div style={{ border: formErrors.unite ? "1px solid #dc3545" : "none", borderRadius: "20px" }}>
              <CustomSelect
                options={uniteOptions}
                value={getSelectedValue("unite", uniteOptions)}
                onChange={(selected) => onSelectChange("unite", selected)}
                placeholder="Sélectionner une unité"
                className="border-0 rounded-pill"
              />
            </div>
            {formErrors.unite && <div className="text-danger small mt-1">L'unité est obligatoire</div>}
          </div>

          {/* Quantité */}
          <div className="mb-3">
            <Label htmlFor="quantiter">Quantité <span className="text-danger">*</span></Label>
            <StableInput
              type="text"
              name="quantiter"
              value={formData.quantiter}
              onChange={onFormChange}
              className={formErrors.quantiter ? "is-invalid" : ""}
              style={{ borderRadius: "20px" }}
              placeholder="Entrer la quantité"
              ref={quantiteInputRef}
            />
            {formErrors.quantiter && <div className="invalid-feedback d-block">La quantité est obligatoire</div>}
          </div>

          {/* Prix d'achat (seulement pour les entrées) */}
          {mode === "entree" && (
            <div className="mb-3">
              <Label htmlFor="prix_achat">Prix d'achat <span className="text-danger">*</span></Label>
              <StableInput
                type="text"
                name="prix_achat"
                value={formData.prix_achat}
                onChange={onFormChange}
                className={formErrors.prix_achat ? "is-invalid" : ""}
                style={{ borderRadius: "20px" }}
                placeholder="000"
                ref={prixAchatRef}
              />
              {formErrors.prix_achat && <div className="invalid-feedback d-block">Le prix d'achat est obligatoire</div>}
            </div>
          )}

          {/* Prix de vente */}
          <div className="mb-3">
            <Label htmlFor="prix_vente">Prix de vente <span className="text-danger">*</span></Label>
            <StableInput
              type="text"
              name="prix_vente"
              value={formData.prix_vente}
              onChange={onFormChange}
              className={formErrors.prix_vente ? "is-invalid" : ""}
              style={{ borderRadius: "20px" }}
              placeholder="000"
              ref={prixVenteRef}
            />
            {formErrors.prix_vente && <div className="invalid-feedback d-block">Le prix de vente est obligatoire</div>}
          </div>

          {/* Raison */}
          <div className="mb-3">
            <Label htmlFor="raison">Raison <span className="text-danger">*</span></Label>
            <div style={{ border: formErrors.raison ? "1px solid #dc3545" : "none", borderRadius: "20px" }}>
              <CustomSelect
                options={raisonOptions}
                value={getSelectedValue("raison", raisonOptions)}
                onChange={(selected) => onSelectChange("raison", selected)}
                placeholder="Sélectionner une raison"
                className="border-0 rounded-pill"
              />
            </div>
            {formErrors.raison && <div className="text-danger small mt-1">La raison est obligatoire</div>}
          </div>

          {/* Section Destination */}
          <div className="mb-3">
            <Label className="form-label">Destination <span className="text-danger">*</span></Label>
            <div className="d-flex gap-3 mb-2 flex-wrap">
              <FormGroup check>
                <Input
                  type="radio"
                  name="destinationType"
                  id="magasin"
                  value="magasins"
                  checked={destinationType === "magasins"}
                  onChange={handleDestinationTypeChange}
                />
                <Label check for="magasin" className="ms-2">Magasin</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="radio"
                  name="destinationType"
                  id="succursale"
                  value="succursales"
                  checked={destinationType === "succursales"}
                  onChange={handleDestinationTypeChange}
                />
                <Label check for="succursale" className="ms-2">Succursale</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="radio"
                  name="destinationType"
                  id="departement"
                  value="departements"
                  checked={destinationType === "departements"}
                  onChange={handleDestinationTypeChange}
                />
                <Label check for="departement" className="ms-2">Département</Label>
              </FormGroup>
            </div>

            {/* Sélecteur conditionnel */}
            {destinationType === 'magasins' && (
              <div style={{ border: formErrors.magasin ? "1px solid #dc3545" : "none", borderRadius: "20px" }}>
                <CustomSelect
                  options={magasinOptions}
                  value={getSelectedValue("magasin", magasinOptions)}
                  onChange={(selected) => onSelectChange("magasin", selected)}
                  placeholder="Sélectionner un magasin"
                  className="border-0 rounded-pill"
                />
                {formErrors.magasin && <div className="text-danger small mt-1">La sélection d'un magasin est requise</div>}
              </div>
            )}

            {destinationType === 'succursales' && (
              <div style={{ border: formErrors.succursale ? "1px solid #dc3545" : "none", borderRadius: "20px" }}>
                <CustomSelect
                  options={groupeOptions}
                  value={getSelectedValue("succursale", groupeOptions)}
                  onChange={(selected) => onSelectChange("succursale", selected)}
                  placeholder="Sélectionner une succursale"
                  className="border-0 rounded-pill"
                />
                {formErrors.succursale && <div className="text-danger small mt-1">La sélection d'une succursale est requise</div>}
              </div>
            )}

            {destinationType === 'departements' && (
              <div style={{ border: formErrors.departement ? "1px solid #dc3545" : "none", borderRadius: "20px" }}>
                <CustomSelect
                  options={departementOptions}
                  value={getSelectedValue("departement", departementOptions)}
                  onChange={(selected) => onSelectChange("departement", selected)}
                  placeholder="Sélectionner un département"
                  className="border-0 rounded-pill"
                />
                {formErrors.departement && <div className="text-danger small mt-1">La sélection d'un département est requise</div>}
              </div>
            )}

            {formErrors.destination && <div className="text-danger small mt-1">Le type de destination est requis</div>}
          </div>

          {/* Boutons */}
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button color="light" onClick={toggle} disabled={loading} style={{ borderRadius: "20px" }}>
              Annuler
            </Button>
            <Button color="primary" type="submit" disabled={loading} style={{ borderRadius: "20px" }}>
              {loading ? <><Spinner size="sm" className="me-2" />Enregistrement...</> : "Enregistrer"}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default StockFormModal;