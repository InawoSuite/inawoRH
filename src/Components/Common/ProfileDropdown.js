// ProfileDropdown.js - Version avec photo de profil corrigée
import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import userdummy from "../../assets/images/users/user-dummy-img.jpg";
import { useUser } from "../../contexts/UserContext";
import { useProfile } from "../../Components/Hooks/UserHooks";

const ProfileDropdown = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const { userProfile: profileFromHook, token } = useProfile();
  const { userData, refreshUserData, loading } = useUser();
  
  // Récupération des données d'abonnement
  const abonnement = JSON.parse(localStorage.getItem("abonnement")) || {};

  // Rafraîchir les données utilisateur quand le dropdown s'ouvre
  useEffect(() => {
    if (isProfileDropdown && profileFromHook?.id) {
      refreshUserData(profileFromHook.id, token);
    }
  }, [isProfileDropdown, profileFromHook?.id, token, refreshUserData]);

  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  // Utiliser les données du contexte ou du localStorage en fallback
  // const displayUser = userData || JSON.parse(localStorage.getItem("user")) || {};
  const displayUser = userData || profileFromHook || {};

  return (
    <Dropdown
      isOpen={isProfileDropdown}
      toggle={toggleProfileDropdown}
      className="ms-sm-3 header-item topbar-user"
    >
      <DropdownToggle tag="button" type="button" className="btn">
        <span className="d-flex align-items-center">
          <img
            className="rounded-circle header-profile-user"
            src={displayUser.photo || userdummy}
            alt="Photo de profil"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = userdummy;
            }}
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'cover',
              objectPosition: 'center',
              border: '2px solid #e9ecef',
              flexShrink: 0
            }}
          />
          <span className="text-start ms-xl-2">
            <div>
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {displayUser.nom} {displayUser.prenom}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                {displayUser.fonction}
              </span>
            </div>
          </span>
        </span>
      </DropdownToggle>
      <DropdownMenu
        className="dropdown-menu-end"
        style={{ width: "100%", padding: 0 }}
      >
        <h6 className="dropdown-header">
          {t("Bienvenue")} {displayUser.prenom || profileFromHook.prenom}!
        </h6>

        <DropdownItem
          className="d-flex align-items-center"
          style={{ height: "40px" }}
          onClick={() => navigate("/:entreprise/profil/")}
        >
          <i
            className="mdi mdi-account-circle text-muted"
            style={{ fontSize: "17px", marginLeft: "-11px" }}
          />
          <span style={{ color: "#474444" }}>{t("Profil")}</span>
        </DropdownItem>

        {profileFromHook.type_utilisateur !== "Administrateur" && (
          <DropdownItem
            className="d-flex align-items-center"
            style={{ height: "40px" }}
            onClick={() => navigate(`/:entreprise/profil/${profileFromHook.id}/`)}
          >
            <i
              className="mdi mdi-cog-outline text-muted"
              style={{ fontSize: "17px", marginLeft: "-11px" }}
            />
            <span style={{ color: "#474444" }}>{t("Paramètres")}</span>
          </DropdownItem>
        )}

        {abonnement && (
          <DropdownItem
            className="d-flex align-items-center"
            style={{ height: "40px" }}
            onClick={() => navigate("/:entreprise/abonnement")}
          >
            <i
              className="ri-secure-payment-line text-muted"
              style={{ fontSize: "17px", marginLeft: "-11px" }}
            />
            <span style={{ color: "#474444" }}>{t("Abonnement")}</span>
          </DropdownItem>
        )}

        <DropdownItem
          className="d-flex align-items-center"
          style={{ height: "40px" }}
          onClick={() => navigate("/:entreprise/supportClient")}
        >
          <i
            className="ri-message-3-line text-muted"
            style={{ fontSize: "17px", marginLeft: "-11px" }}
          />
          <span style={{ color: "#474444" }}>{t("Assistance")}</span>
        </DropdownItem>

        <DropdownItem
          className="d-flex align-items-center"
          style={{ height: "40px" }}
          onClick={() => navigate("/logout")}
        >
          <i
            className="mdi mdi-logout text-muted"
            style={{ fontSize: "17px", marginLeft: "-11px" }}
          />
          <span style={{ color: "#474444" }}>{t("Déconnexion")}</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;