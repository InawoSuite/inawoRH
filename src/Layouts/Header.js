import React, { useEffect, useState } from "react";
import { useOnboarding } from "../contexts/OnboardingContext";

//import Components
import SearchOption from "../Components/Common/SearchOption";
import LanguageDropdown from "../Components/Common/LanguageDropdown";
import WebAppsDropdown from "../Components/Common/WebAppsDropdown";
import MyCartDropdown from "../Components/Common/MyCartDropdown";
import FullScreenDropdown from "../Components/Common/FullScreenDropdown";
import NotificationDropdown from "../Components/Common/NotificationDropdown";
import ProfileDropdown from "../Components/Common/ProfileDropdown";
import LightDark from "../Components/Common/LightDark";
import QuickAddDropdown from "../Components/Common/QuickAddDropdown";
import { useSidebar } from '../contexts/SidebarContext';

import { changeSidebarVisibility } from "../slices/thunks";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import NewChat from "../Components/Common/NewChat";
import ButtonWhatsApp from "../Components/Whatsapp/ButtonWhatsApp";

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {

  const { onboardingState } = useOnboarding();
  const { spotlightMode, spotlightTarget } = onboardingState;
  const dispatch = useDispatch();

  const selectDashboardData = createSelector(
    (state) => state.Layout,
    (state) => ({
      sidebarVisibilitytype: state.sidebarVisibilitytype,
    })
  );
  // Inside your component
  const { sidebarVisibilitytype } = useSelector(selectDashboardData);

  const [search, setSearch] = useState(false);
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-bs-theme") || "light"
  );
  
  // État pour les tooltips
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const toogleSearch = () => {
    setSearch(!search);
  };

  const toogleMenuBtn = () => {
    var windowSize = document.documentElement.clientWidth;
    dispatch(changeSidebarVisibility("show"));

    if (windowSize > 767)
      document.querySelector(".hamburger-icon").classList.toggle("open");

    //For collapse horizontal menu
    if (document.documentElement.getAttribute("data-layout") === "horizontal") {
      document.body.classList.contains("menu")
        ? document.body.classList.remove("menu")
        : document.body.classList.add("menu");
    }

    //For collapse vertical and semibox menu
    if (
      sidebarVisibilitytype === "show" &&
      (document.documentElement.getAttribute("data-layout") === "vertical" ||
        document.documentElement.getAttribute("data-layout") === "semibox")
    ) {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "sm"
          ? document.documentElement.setAttribute("data-sidebar-size", "")
          : document.documentElement.setAttribute("data-sidebar-size", "sm");
      } else if (windowSize > 1025) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "lg"
          ? document.documentElement.setAttribute("data-sidebar-size", "sm")
          : document.documentElement.setAttribute("data-sidebar-size", "lg");
      } else if (windowSize <= 767) {
        document.body.classList.add("vertical-sidebar-enable");
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
    }

    //Two column menu
    if (document.documentElement.getAttribute("data-layout") === "twocolumn") {
      document.body.classList.contains("twocolumn-panel")
        ? document.body.classList.remove("twocolumn-panel")
        : document.body.classList.add("twocolumn-panel");
    }
  };

  // Fonction pour gérer le survol des menus
  const handleMouseEnter = (menuName, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom - 2 // Rapproché du menu (était +5, maintenant -2)
    });
    setHoveredMenu(menuName);
  };

  const handleMouseLeave = () => {
    setHoveredMenu(null);
  };

  // Fonction pour obtenir le texte du tooltip
  const getTooltipText = (menuName) => {
    switch (menuName) {
      case 'language':
        return 'Langue';
      case 'webapps':
        return 'Solutions Inawo';
      case 'fullscreen':
        return 'Mode plein écran';
      case 'quickadd':
        return 'Plus';
      case 'chat':
        return 'Support Client';
      case 'lightdark':
        return theme === 'dark' ? 'Mode clair' : 'Mode sombre';
      case 'notifications':
        return 'Notifications';
      default:
        return '';
    }
  };

  useEffect(() => {
    dispatch(changeSidebarVisibility("show"));
    document.body.classList.add("twocolumn-panel");

    // Mettre à jour le thème quand l'attribut data-bs-theme change
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-bs-theme") {
          setTheme(document.documentElement.getAttribute("data-bs-theme"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-bs-theme"],
    });

    return () => observer.disconnect();
  }, [dispatch]);

 const { isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    
    if (newState) {
      document.body.classList.add('vertical-sidebar-enable');
    } else {
      document.body.classList.remove('vertical-sidebar-enable');
    }
  };

  return (
    <React.Fragment>
      <header
        id="page-topbar"
        className={headerClass}
        style={{
          backgroundColor: theme === "light" ? "#FFF" : "#070940",
          borderBottom: theme === "dark" ? "none" : undefined,
        }}
      >
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex">
              {/* <button
                onClick={toogleMenuBtn}
                type="button"
                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                id="topnav-hamburger-icon"
                style={{ opacity: "0" }}
              >
                <span className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button> */}
               <button
              type="button"
              className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
              id="topnav-hamburger-icon"
              onClick={toggleMobileMenu}
            >
              <span className="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
            </div>

            <div className="d-flex align-items-center">
             {/* LanguageDropdown avec attribut pour le spotlight */}
              <div 
                className="header-item"
                onMouseEnter={(e) => handleMouseEnter('language', e)}
                onMouseLeave={handleMouseLeave}
                data-onboarding-target="language-dropdown"
                style={{
                  // Mise en valeur quand c'est la cible du spotlight
                  ...(spotlightMode && spotlightTarget === 'language-dropdown' ? {
                    zIndex: 1042,
                    position: 'relative',
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease'
                  } : {})
                }}
              >
                <LanguageDropdown />
              </div>

              {/* WebAppsDropdown */}
              <div 
                className="header-item"
                onMouseEnter={(e) => handleMouseEnter('webapps', e)}
                onMouseLeave={handleMouseLeave}
              >
                <WebAppsDropdown />
              </div>

              {/* FullScreenDropdown */}
              <div 
                className="header-item"
                onMouseEnter={(e) => handleMouseEnter('fullscreen', e)}
                onMouseLeave={handleMouseLeave}
              >
                <FullScreenDropdown />
              </div>

              {/* QuickAdd Dropdown */}
              <div
                className="header-item quick-add-dropdown"
                style={{ display: "flex", alignItems: "center" }}
                onMouseEnter={(e) => handleMouseEnter('quickadd', e)}
                onMouseLeave={handleMouseLeave}
              >
                <QuickAddDropdown />
              </div>

              {/* Chat Icon */}
              <div 
                className="header-item"
                onMouseEnter={(e) => handleMouseEnter('chat', e)}
                onMouseLeave={handleMouseLeave}
              >
                <NewChat />
              </div>

              {/* Dark/Light Mode set */}
              <div 
                className="header-item"
                onMouseEnter={(e) => handleMouseEnter('lightdark', e)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="d-flex align-items-center justify-content-center">
                  <LightDark
                    layoutMode={layoutModeType}
                    onChangeLayoutMode={onChangeLayoutMode}
                    className="logstyleok"
                  />
                </div>
              </div>

              {/* NotificationDropdown */}
              <div 
                className="header-item"
                onMouseEnter={(e) => handleMouseEnter('notifications', e)}
                onMouseLeave={handleMouseLeave}
              >
                <NotificationDropdown />
              </div>

              {/* ProfileDropdown */}
              <div className="header-item ">
                <ProfileDropdown />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tooltip avec flèche pointant vers le haut */}
      {hoveredMenu && (
        <div
          className="custom-tooltip"
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%)',
            zIndex: 9999,
            backgroundColor: '#495057',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '70px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            // boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
            // marginTop: '8px' // Espace entre le menu et le tooltip
          }}
        >
          {getTooltipText(hoveredMenu)}
          {/* Flèche pointant vers le haut (vers le menu) */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid #495057' // Flèche avec la même couleur que le tooltip
            }}
          />
        </div>
      )}

      <ButtonWhatsApp/>

      <style>
        {`
          .header-item i {
            color: ${theme === "light" ? "white" : "white"} ;
          }
          .header-item  {
            color: ${theme === "light" ? "white" : "black"} !important;
          }

          .dropdown-menu {
            background-color: ${
              theme === "light" ? "white" : "#040521"
            } !important;
             color: ${theme === "light" ? "black" : "red"} !important;
          }

          .dropdown-item {
            color: ${theme === "light" ? "black" : "white"} !important;
          }

          .dropdown-item:hover {
            background-color: ${
              theme === "light"
                ? "var(--vz-body-bg)"
                : "rgba(255, 255, 255, 0.1)"
            } !important;
          } 

          .header-item {
            color: ${theme === "light" ? "black" : "white"} !important;
            cursor: pointer;
          }

          .header-profile-user {
            border: 2px solid ${theme === "dark" ? "#374151" : "#e5e7eb"};
          }
          
          .topbar-user .btn {
            background-color: transparent !important;
            border: none !important;
          }
          
          .topbar-user .btn:hover {
            background-color: ${theme === "dark" ? "#070940" : "#f3f6f9"} !important;
          }

          /* Styles spécifiques pour le QuickAdd Dropdown */
          .quick-add-dropdown .dropdown-menu {
            min-width: 160px !important;
            width: 160px !important;
            padding: 4px 0 !important;
            margin-top: 56px !important;
            right: 0 !important;
            left: auto !important;
            transform: translateX(-10px) !important;
          }

          .quick-add-dropdown .dropdown-item {
            display: flex !important;
            align-items: center !important;
            padding: 6px 12px !important;
            font-size: 13px !important;
            border: none !important;
            background: none !important;
            white-space: nowrap !important;
          }

          .quick-add-dropdown .dropdown-item i {
            width: 16px !important;
            height: 16px !important;
            margin-right: 8px !important;
            font-size: 14px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: ${theme === "light" ? "#6c757d" : "#adb5bd"} !important;
          }

          .quick-add-dropdown .dropdown-item:hover {
            background-color: ${
              theme === "light" ? "#f8f9fa" : "rgba(255, 255, 255, 0.1)"
            } !important;
          }

          .quick-add-dropdown .dropdown-item:hover i {
            color: ${theme === "light" ? "#495057" : "#ffffff"} !important;
          }
        `}
      </style>
    </React.Fragment>
  );
};

export default Header;