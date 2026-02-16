import React, { useState, useEffect, useMemo } from "react";
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
import smallImage9 from "../../../../../assets/images/small/img-9.jpg";
import avatar1 from "../../../../../assets/images/users/user-dummy-img.jpg";
import { useProfile } from "../../../../../Components/Hooks/UserHooks";
import { useUser } from "../../../../../contexts/UserContext";
import { BaseUrl } from "../../../../APIKey/ApiKey";
import PhoneInput from "../../../../../Components/ContactDeleteModal/CountryPhoneInput";
import { CustomSelect } from "../../../../../Components/Common/CustomSelectStyles";
import { country } from "../../../../../common/data";
import { useTranslation } from "react-i18next";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";

const ProfileEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(avatar1);
  const [coverPhoto, setCoverPhoto] = useState(smallImage9);
  const { userProfile, token } = useProfile();
  const { updateUserData, refreshUserData } = useUser();

  // États pour les sélections
  const [selectedPays, setSelectedPays] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState("FR"); // Code par défaut

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    fonction: "",
    pays: "",
    photo: null,
    photo_couverture: null,
    photoPreview: "",
    couverturePreview: "",
  });

  // Options pour les pays
  const paysOptions = useMemo(() => {
    return country.map((c) => ({
      value: c.countryName,
      label: c.countryName,
      countryCode: c.countryCode,
      flagImg: c.flagImg,
    }));
  }, []);

  // Charger les données initiales
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userProfile?.id) {
          toast.error(
            <span style={{ fontWeight: "bold", color: "red" }}>
              {t("Utilisateur non authentifié.")}
            </span>,
            {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${BaseUrl}/utilisateurs/update-profile/${userProfile.id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Trouver le pays sélectionné dans les options
          const paysSelectionne = paysOptions.find(
            (option) => option.value === data.pays
          );

          setFormData({
            nom: data.nom || "",
            prenom: data.prenom || "",
            telephone: data.telephone || "",
            email: data.email || "",
            fonction: data.fonction || "",
            pays: data.pays || "",
            photo: null,
            photo_couverture: null,
          });

          // Mettre à jour les sélections
          setSelectedPays(paysSelectionne);
          if (paysSelectionne) {
            setSelectedCountryCode(paysSelectionne.countryCode);
          }

          // Charger les photos si disponibles
          // if (data.photo) {
          //   setProfilePhoto(data.photo);
          //   setFormData((prev) => ({ ...prev, photoPreview: data.photo }));
          // }

          // Charger les photos si disponibles
          if (data.photo) {
            const fullPhotoUrl = data.photo.startsWith("http")
              ? data.photo
              : `${BaseUrl}${
                  data.photo.startsWith("/") ? data.photo : "/" + data.photo
                }`;

            setProfilePhoto(fullPhotoUrl);
            setFormData((prev) => ({ ...prev, photoPreview: fullPhotoUrl }));
          }

          if (data.photo_couverture_url) {
            const fullCoverUrl = data.photo_couverture_url.startsWith("http")
              ? data.photo_couverture_url
              : `${BaseUrl}${
                  data.photo_couverture_url.startsWith("/")
                    ? data.photo_couverture_url
                    : "/" + data.photo_couverture_url
                }`;

            setCoverPhoto(fullCoverUrl);
            setFormData((prev) => ({
              ...prev,
              couverturePreview: fullCoverUrl,
            }));
          }
        }
      } catch (error) {
        // console.error("Erreur:", error);
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

    fetchUserData();
  }, [navigate, userProfile?.id, token, paysOptions]);

  // Gestionnaire de sélection du pays
  const handleSelectPays = (selectedOption) => {
    setSelectedPays(selectedOption);

    if (selectedOption) {
      setSelectedCountryCode(selectedOption.countryCode);
      setFormData((prev) => ({
        ...prev,
        pays: selectedOption.value,
      }));
    } else {
      setSelectedCountryCode("FR"); // Retour au défaut
      setFormData((prev) => ({
        ...prev,
        pays: "",
      }));
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo: file,
          photoPreview: reader.result,
        }));
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photo_couverture: file,
          couverturePreview: reader.result,
        }));
        setCoverPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.pays) {
      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {t("Veuillez sélectionner un pays")}
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
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      // Ajout des champs texte
      form.append("nom", formData.nom.trim());
      form.append("prenom", formData.prenom.trim());
      form.append("telephone", formData.telephone || "");
      form.append("fonction", formData.fonction.trim());
      form.append("pays", formData.pays);

      // Ajout des photos si modifiées
      if (formData.photo) {
        form.append("photo", formData.photo);
      }
      if (formData.photo_couverture) {
        form.append("photo_couverture", formData.photo_couverture);
      }

      const response = await fetch(
        `${BaseUrl}/utilisateurs/update-profile/${userProfile.id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      if (response.ok) {
        const updatedData = await response.json();

        // Mettre à jour le contexte global
        updateUserData({
          nom: updatedData.nom,
          prenom: updatedData.prenom,
          telephone: updatedData.telephone,
          fonction: updatedData.fonction,
          pays: updatedData.pays,
          photo: updatedData.photo,
        });

        // Rafraîchir les données depuis l'API
        await refreshUserData(userProfile.id, token);

        toast.success(
          <span style={{ fontWeight: "bold", color: "#16a34a" }}>
            {t("Profil mis à jour avec succès !")}
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
        navigate("/:entreprise/profil");
      } else {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      // console.error("Erreur:", error);
      toast.error(
        <span style={{ fontWeight: "bold", color: "red" }}>
          {t(error.message || "Erreur lors de la mise à jour")}
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

  document.title = t("Modifier Profil") + " | INAWO - Suite de Gestion";

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          title={`${t("Modifier profil")}`}
          pageTitle={
            <>
              <i className="ri-contacts-book-line me-1 align-bottom"></i>
              &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>
              &nbsp;&gt;&nbsp;
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
                    src={formData.couverturePreview || coverPhoto}
                    alt="Couverture"
                    className="img-fluid"
                    style={{
                      height: "150px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                  <div>
                    <input
                      id="profile-foreground-img-file-input"
                      type="file"
                      className="profile-foreground-img-file-input d-none"
                      onChange={handleCoverPhotoChange}
                      accept="image/*"
                    />
                    <label
                      htmlFor="profile-foreground-img-file-input"
                      className="profile-photo-edit btn btn-light btn-sm position-absolute end-0 top-0 m-3"
                    >
                      <i className="ri-image-edit-line align-bottom me-1"></i>
                      {t("Changer image de couverture")}
                    </label>
                  </div>
                </div>
                <div className="card-body pt-0 mt-n5">
                  <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                      <img
                        src={formData.photoPreview || profilePhoto}
                        className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                        alt="user-profile"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <input
                          id="profile-img-file-input"
                          type="file"
                          className="profile-img-file-input d-none"
                          onChange={handleProfilePhotoChange}
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
                    </div>
                    <h5 className="fs-16 mb-1">
                      {formData.nom} {formData.prenom}
                    </h5>
                    <p className="text-muted mb-0">{formData.fonction}</p>
                    <h6 className="text-muted mb-0">
                      {userProfile.type_utilisateur}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={9}>
            <Card style={{ borderRadius: "20px" }}>
              <CardBody className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="card-title mb-0">{t("Modifier le profil")}</h4>
                  <Link
                    to="/:entreprise/profil"
                    className="btn btn-light"
                    style={{ borderRadius: "20px" }}
                  >
                    {t("Retour")}
                  </Link>
                </div>
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label htmlFor="nom">
                          {t("Nom")}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          style={{ borderRadius: "20px" }}
                          required
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label htmlFor="prenom">
                          {t("Prénom")}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="prenom"
                          value={formData.prenom}
                          onChange={handleInputChange}
                          style={{ borderRadius: "20px" }}
                          required
                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-3">
                        <Label htmlFor="pays">
                          {t("Pays")}
                          <span className="text-danger">*</span>
                        </Label>
                        <CustomSelect
                          value={selectedPays}
                          onChange={handleSelectPays}
                          options={paysOptions}
                          formatOptionLabel={(option) => (
                            <div className="d-flex align-items-center">
                              <img
                                src={option.flagImg}
                                alt={option.label}
                                className="me-2"
                                style={{ width: "20px", height: "15px" }}
                              />
                              {option.label}
                            </div>
                          )}
                          placeholder={t("Sélectionnez votre pays")}
                          className="rounded-pill"
                          isSearchable
                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-3">
                        <Label htmlFor="telephone">{t("Téléphone")}</Label>
                        <PhoneInput
                          name="telephone"
                          value={formData.telephone || ""}
                          onChange={(value) => {
                            const phoneValue = value ? String(value) : "";
                            setFormData((prev) => ({
                              ...prev,
                              telephone: phoneValue,
                            }));
                          }}
                          countries={country}
                          defaultCountry={selectedCountryCode}
                          placeholder={t("Entrez votre numéro")}
                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-3">
                        <Label htmlFor="fonction">
                          {t("Fonction")}
                          <span className="text-danger">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="fonction"
                          value={formData.fonction}
                          onChange={handleInputChange}
                          style={{ borderRadius: "20px" }}
                          required
                        />
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-3">
                        <Label htmlFor="email">{t("Email")}</Label>
                        <Input
                          type="email"
                          id="email"
                          value={formData.email}
                          // disabled
                          style={{
                            borderRadius: "20px",
                            backgroundColor: "#f8f9fa",
                          }}
                          className="text-muted"
                        />
                        <div className="form-text">
                          {t("L'email ne peut pas être modifié")}
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="text-end mt-4">
                    <Button
                      type="submit"
                      color="primary"
                      disabled={
                        loading ||
                        !formData.nom ||
                        !formData.prenom ||
                        !formData.fonction ||
                        !formData.pays
                      }
                      style={{ borderRadius: "20px" }}
                    >
                      {loading
                        ? t("Enregistrement...")
                        : t("Enregistrer les modifications")}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfileEdit;
