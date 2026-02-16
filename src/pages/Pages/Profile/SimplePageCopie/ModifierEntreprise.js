import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Label,
  Button,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import smallImage9 from "../../../../assets/images/small/img-9.jpg";
import avatar1 from "../../../../assets/images/users/user-dummy-img.jpg";
import user from "../../../../assets/images/users/avatar-1.jpg";
import { CustomSelect } from "../../../../Components/Common/CustomSelectStyles";
import PhoneInput from "../../../../Components/ContactDeleteModal/CountryPhoneInput";
import { country } from "../../../../common/data";
import configBase from "../../../../configBase.js";
import { useProfile } from "../../../../Components/Hooks/UserHooks";
import { BaseUrl } from "../../../APIKey/ApiKey";
import { useTranslation } from "react-i18next";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

const FormulaireEntreprise = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedForme, setSelectedForme] = useState(null);
  const [selectedPays, setSelectedPays] = useState(null);
  const [phoneValue, setPhoneValue] = useState("");
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [userType, setUserType] = useState(""); // État pour le type d'utilisateur
  const { userProfile, token } = useProfile();

  const formeOptions = [
    { value: "Entreprise Individuelle", label: t("Entreprise Individuelle") },
    {
      value: "Société à Responsabilité Limitée(SARL)",
      label: t("Société à Responsabilité Limitée(SARL)"),
    },
    {
      value: "Société Unipersonnelle à Responsabilité Limitée(SARL)",
      label: t("Société Unipersonnelle à Responsabilité Limitée(SARL)"),
    },
    { value: "Société Anonyme(SA)", label: t("Société Anonyme(SA)") },
    {
      value: "Société en Nom Collectif(SNC)",
      label: t("Société en Nom Collectif(SNC)"),
    },
  ];

  const paysOptions = useMemo(() => {
    return country.map((c) => ({
      value: c.countryName,
      label: c.countryName,
      countryCode: c.countryCode,
      flagImg: c.flagImg,
    }));
  }, []);

  useEffect(() => {
    // Récupérer le type d'utilisateur connecté
    if (userProfile && userProfile.type_utilisateur) {
      setUserType(userProfile.type_utilisateur);
    }

    const fetchEntrepriseData = async () => {
      try {
        const entrepriseId = userProfile?.entreprise?.id;

        const response = await fetch(
          `${BaseUrl}/utilisateurs/updatedeleteentreprise/${entrepriseId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFormData(data);
          setPhoneValue(data.telephone || "");

          // Pré-sélectionner le pays et la forme juridique
          if (data.pays) {
            const paysOption = paysOptions.find(
              (option) => option.value === data.pays
            );
            if (paysOption) setSelectedPays(paysOption);
          }

          if (data.forme_juridique) {
            const formeOption = formeOptions.find(
              (option) => option.value === data.forme_juridique
            );
            if (formeOption) setSelectedForme(formeOption);
          }

          if (data.logo) setLogo(data.logo);
          if (data.photo) setPhoto(data.photo);
        }
      } catch (error) {
        toast.error(
          <span style={{ fontWeight: "bold", color: "red" }}>
            {t("Erreur lors du chargement des données")}
          </span>,
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    };

    fetchEntrepriseData();
  }, []);

  // Vérifier si l'utilisateur est administrateur
  const isAdmin = userProfile.type_utilisateur === "Administrateur";

  const handleLogoChange = (event) => {
    if (!isAdmin) {
      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {t("Seuls les administrateurs peuvent modifier le logo")}
        </span>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        setFormData((prev) => ({ ...prev, logo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoChange = (event) => {
    if (!isAdmin) {
      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {t("Seuls les administrateurs peuvent modifier la photo")}
        </span>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        setFormData((prev) => ({ ...prev, photo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPays = (selectedOption) => {
    if (!isAdmin) {
      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {t("Seuls les administrateurs peuvent modifier le pays")}
        </span>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }
    setSelectedPays(selectedOption);
    setFormData((prev) => ({
      ...prev,
      pays: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleSelectForme = (selectedOption) => {
    if (!isAdmin) {
      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {t("Seuls les administrateurs peuvent modifier la forme juridique")}
        </span>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }
    setSelectedForme(selectedOption);
    setFormData((prev) => ({
      ...prev,
      forme_juridique: selectedOption ? selectedOption.value : "",
    }));
  };

  const handlePhoneChange = (value) => {
    if (!isAdmin) {
      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {t("Seuls les administrateurs peuvent modifier le téléphone")}
        </span>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }
    setPhoneValue(value);
    setFormData((prev) => ({
      ...prev,
      telephone: value,
    }));
  };

  const handleInputChange = (field, value) => {
    if (!isAdmin) {
      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {t("Seuls les administrateurs peuvent modifier les informations")}
        </span>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {t(
            "Seuls les administrateurs peuvent modifier les informations de l'entreprise"
          )}
        </span>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }

    setLoading(true);

    try {
      const entrepriseId = userProfile?.entreprise?.id;

      if (!entrepriseId) {
        throw new Error(t("ID entreprise non trouvé"));
      }

      const formDataToSend = new FormData();

      // Ajout de tous les champs
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "logo" || key === "photo") {
          if (value instanceof File) {
            formDataToSend.append(key, value);
          } else if (value === null) {
            formDataToSend.append(key, "");
          }
        } else {
          formDataToSend.append(key, value || "");
        }
      });

      const response = await fetch(
        `${configBase.API_URL}/utilisateurs/updatedeleteentreprise/${entrepriseId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage =
          responseData.utilisateur?.[0] ||
          responseData.detail ||
          responseData.message ||
          "Erreur lors de la mise à jour";
        throw new Error(errorMessage);
      }

      toast.success(
        <span style={{ fontWeight: "bold", color: "#16a34a" }}>
          {t("Entreprise mise à jour avec succès!")}
        </span>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      navigate("/:entreprise/entreprise");
    } catch (error) {
    //   console.error("Erreur détaillée:", error);
      toast.error(
        <span style={{ fontWeight: "bold", color: "#16a34a" }}>
          {t(error.message)}
        </span>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  document.title = t("Modifier Entreprise") + " | INAWO - Suite de Gestion";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title={`${t("Modifier Entreprise")}`}
          pageTitle={
            <>
              <i className="ri-bank-line"></i>
              &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>
              &nbsp;&gt;
            </>
          }
        />
        <Row className="justify-content-center">
          <Col lg={3}>
            <div className="d-flex flex-column">
              <div
                className="card overflow-hidden flex-fill"
                style={{ borderRadius: "20px" }}
              >
                <div>
                  <img
                    src={photo || smallImage9}
                    alt={t("Couverture entreprise")}
                    className="img-fluid"
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  {isAdmin && (
                    <div>
                      <input
                        id="profile-foreground-img-file-input"
                        type="file"
                        className="profile-foreground-img-file-input d-none"
                        onChange={handlePhotoChange}
                        accept="image/*"
                      />
                      <label
                        htmlFor="profile-foreground-img-file-input"
                        className="profile-photo-edit btn btn-light btn-sm position-absolute end-0 top-0 m-3"
                        style={{ borderRadius: "20px" }}
                      >
                        <i className="ri-image-edit-line align-bottom me-1"></i>
                        {t("Changer image")}
                      </label>
                    </div>
                  )}
                </div>
                <div className="card-body pt-0 mt-n5">
                  <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                      <img
                        src={logo || avatar1}
                        className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                        alt={t("Logo entreprise")}
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                      {isAdmin && (
                        <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                          <input
                            id="profile-img-file-input"
                            type="file"
                            className="profile-img-file-input d-none"
                            onChange={handleLogoChange}
                            accept="image/*"
                          />
                          <label
                            htmlFor="profile-img-file-input"
                            className="profile-photo-edit avatar-xs"
                          >
                            <span className="avatar-title rounded-circle bg-light text-body">
                              <i className="ri-camera-fill"></i>
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                    <h5 className="fs-16 mb-1">
                      {formData.nom || "Nom entreprise"}
                    </h5>
                    <p className="text-muted mb-0">
                      {formData.forme_juridique || "Forme juridique"}
                    </p>
                    {!isAdmin && (
                      <div className="mt-2">
                        <span className="badge bg-warning">
                          <i className="ri-lock-line me-1"></i>
                          {t("Lecture seule")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col lg={9}>
            <Card style={{ borderRadius: "20px" }}>
              <CardBody className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title mb-0">
                    {t("Modifier les informations de l'entreprise")}
                    {!isAdmin && (
                      <span className="badge bg-warning ms-2">
                        <i className="ri-lock-line me-1"></i>
                        {t("Lecture seule")}
                      </span>
                    )}
                  </h4>
                  <Link
                    to="/:entreprise/entreprise"
                    className="btn btn-light"
                    style={{ borderRadius: "20px" }}
                  >
                    <i className="ri-arrow-left-line me-1"></i> {t("Retour")}
                  </Link>
                </div>

                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <Label htmlFor="nom" className="form-label">
                          {t("Nom Entreprise")}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="nom"
                          value={formData.nom}
                          onChange={(e) =>
                            handleInputChange("nom", e.target.value)
                          }
                          required
                          style={{ borderRadius: "20px" }}
                          disabled={!isAdmin}
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Label htmlFor="telephone" className="form-label">
                          {t("Téléphone")}
                          <span className="text-danger">*</span>
                        </Label>
                        <PhoneInput
                          name="telephone"
                          value={phoneValue}
                          onChange={handlePhoneChange}
                          countries={country}
                          defaultCountry="FR"
                          inputStyle={{ borderRadius: "20px", height: "38px" }}
                          containerStyle={{ borderRadius: "20px" }}
                          disabled={!isAdmin}
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Label htmlFor="email" className="form-label">
                          {t("Email")}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          required
                          style={{ borderRadius: "20px" }}
                          disabled={!isAdmin}
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Label htmlFor="adresse" className="form-label">
                          {t("Adresse")}
                        </Label>
                        <Input
                          type="text"
                          id="adresse"
                          value={formData.adresse}
                          onChange={(e) =>
                            handleInputChange("adresse", e.target.value)
                          }
                          style={{ borderRadius: "20px" }}
                          disabled={!isAdmin}
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Label htmlFor="forme_juridique" className="form-label">
                          {t("Forme Juridique")}
                          <span className="text-danger">*</span>
                        </Label>
                        <CustomSelect
                          value={selectedForme}
                          onChange={handleSelectForme}
                          options={formeOptions}
                          placeholder={t("Sélectionnez une forme juridique")}
                          isDisabled={!isAdmin}
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Label htmlFor="site_web" className="form-label">
                          {t("Site Web")}
                        </Label>
                        <Input
                          type="text"
                          id="site_web"
                          value={formData.site_web}
                          onChange={(e) =>
                            handleInputChange("site_web", e.target.value)
                          }
                          placeholder={t("Exemple.com")}
                          style={{ borderRadius: "20px" }}
                          disabled={!isAdmin}
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Label htmlFor="capital_social" className="form-label">
                          {t("Capital Social")}
                        </Label>
                        <Input
                          type="number"
                          id="capital_social"
                          value={formData.capital_social}
                          onChange={(e) =>
                            handleInputChange("capital_social", e.target.value)
                          }
                          style={{ borderRadius: "20px" }}
                          disabled={!isAdmin}
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Label
                          htmlFor="num_enreg_legal_1"
                          className="form-label"
                        >
                          {t("N° Legal 01")}
                        </Label>
                        <Input
                          type="text"
                          id="num_enreg_legal_1"
                          value={formData.num_enreg_legal_1}
                          onChange={(e) =>
                            handleInputChange(
                              "num_enreg_legal_1",
                              e.target.value
                            )
                          }
                          style={{ borderRadius: "20px" }}
                          disabled={!isAdmin}
                        />
                      </div>
                    </Col>

                    <Col lg={6}>
                      <div className="mb-3">
                        <Label
                          htmlFor="num_enreg_legal_2"
                          className="form-label"
                        >
                          {t("N° Legal 02")}
                        </Label>
                        <Input
                          type="text"
                          id="num_enreg_legal_2"
                          value={formData.num_enreg_legal_2}
                          onChange={(e) =>
                            handleInputChange(
                              "num_enreg_legal_2",
                              e.target.value
                            )
                          }
                          style={{ borderRadius: "20px" }}
                          disabled={!isAdmin}
                        />
                      </div>
                    </Col>

                    <Col lg={12}>
                      <div className="mb-3">
                        <Label htmlFor="objet_social" className="form-label">
                          {t("Objet Social")}
                        </Label>
                        <Input
                          type="textarea"
                          id="objet_social"
                          value={formData.objet_social}
                          onChange={(e) =>
                            handleInputChange("objet_social", e.target.value)
                          }
                          rows="4"
                          style={{ borderRadius: "20px" }}
                          disabled={!isAdmin}
                        />
                      </div>
                    </Col>
                  </Row>

                  {isAdmin ? (
                    <div className="text-end mt-4">
                      <Button
                        type="submit"
                        color="primary"
                        disabled={loading}
                        style={{ borderRadius: "20px", minWidth: "150px" }}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            {t("Enregistrement...")}
                          </>
                        ) : (
                          <>
                            <i className="ri-save-line me-2"></i>
                            {t("Enregistrer")}
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="alert alert-warning mt-4">
                      <i className="ri-error-warning-line me-2"></i>
                      {t(
                        "Seuls les administrateurs peuvent modifier les informations de l'entreprise."
                      )}
                    </div>
                  )}
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FormulaireEntreprise;
