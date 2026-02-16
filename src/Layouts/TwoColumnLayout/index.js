import React, { useCallback, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Collapse, Container } from "reactstrap";
import withRouter from "../../Components/Common/withRouter";
import { useSelector } from "react-redux";
import logoDark from "../../assets/images/iCone (01) Inawo.png";
import logoLight from "../../assets/images/iCone (02) Inawo.png";
import { withTranslation } from "react-i18next";
import navdata from "../LayoutMenuData";
import Simplebar from "simplebar-react";
import { changeSidebarVisibility } from "../../slices/thunks";
import { useDispatch } from "react-redux";
import { getAuthData } from "../../utils/authUtils";
import { useProfile } from "../../Components/Hooks/UserHooks";
import styled from "@emotion/styled";
import "../../App.css";
import { useNavigate } from 'react-router-dom';

// Import des images pour la discussion (ajustez selon votre structure)
import P1 from "../../assets/images/profils/P1.jpg";
import P2 from "../../assets/images/profils/P2.jpg";
import P3 from "../../assets/images/profils/P3.png";
import P4 from "../../assets/images/profils/P4.webp";
import P5 from "../../assets/images/profils/P5.jpg";

const TwoColumnLayout = (props) => {
  const dispatch = useDispatch();
  const navData = navdata().props.children;
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-bs-theme") || "light"
  );
  const [activeSubMenu, setActiveSubMenu] = useState("");
  const [activeMenu, setActiveMenu] = useState("");
  const [activeMenuIcon, setActiveMenuIcon] = useState("");
  const [selectedMainMenu, setSelectedMainMenu] = useState("Dashboard");
  const { userProfile, token } = useProfile();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [openMenus, setOpenMenus] = useState({});
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const [showUpgradeCard, setShowUpgradeCard] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [trialStatus, setTrialStatus] = useState(null);
  const navigate = useNavigate();

  // États pour les tooltips
  const [hoveredMenuTitle, setHoveredMenuTitle] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // État pour détecter la taille d'écran
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // GESTION DES AUTORISATIONS ET FILTRES DE MENU - AJOUTÉ DE L'ANCIENNE VERSION
  const auth = useSelector((state) => state.auth || {});
  const users = auth.users || getAuthData().user;

  // Normalise le module utilisateur pour la comparaison
  const userModule = String(users?.abonnement?.module || "INOWOGLOBAL")
    .toUpperCase()
    .replace(/\s+/g, "");

  // Récupère le type d'utilisateur (ex: "Administrateur", "Collaborateur", "Observateur")
  const userType = users?.type_utilisateur || "Collaborateur";

  const allMenus = navdata().props.children;

  // FILTRE LES MENUS SELON LES AUTORISATIONS UTILISATEUR (MODULE + TYPE) - AJOUTÉ DE L'ANCIENNE VERSION
  const filteredMenu = allMenus
    .filter((menu) => {
      return !menu.modules || menu.modules.includes(userModule);
    })
    .map((menu) => {
      const filteredSubItems = menu.subItems?.filter((sub) => {
        const moduleAccess = !sub.modules || sub.modules.includes(userModule);
        const userTypeAccess = !sub.utilisateur || sub.utilisateur.includes(userType);
        return moduleAccess && userTypeAccess;
      });

      return {
        ...menu,
        subItems: filteredSubItems,
      };
    });

  const handleUpgradeClick = () => {
    navigate('/:entreprise/abonnement', { 
      state: { openUpgradeModal: true } 
    });
  };

  // Fonction pour calculer les jours d'essai restants
  const calculateTrialDays = useCallback(() => {
    if (!userProfile?.abonnement) return;
    
    const abonnement = userProfile.abonnement;
    const module = abonnement.module;
    const categorie = abonnement.categorie_nom;
    const dateDebut = abonnement.date_debut;
    const montantPayer = abonnement.montant_payer;
    
    const isEligibleForTrial = 
      categorie === "Essentiel" && 
      (module === "InawoSales" || module === "InawoStock") &&
      montantPayer === 0;
    
    if (!isEligibleForTrial) {
      setTrialStatus('none');
      return;
    }
    
    const startDate = new Date(dateDebut);
    const today = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 21);
    
    const timeDiff = endDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff > 0) {
      setDaysRemaining(daysDiff);
      setTrialStatus('active');
    } else {
      setDaysRemaining(0);
      setTrialStatus('expired');
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile?.abonnement) {
      calculateTrialDays();
    }
  }, [userProfile, calculateTrialDays]);

  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("https")) return path;
    return `${process.env.REACT_APP_API_URL || ''}${path}`;
  };

  // Détection du mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        document.documentElement.setAttribute("data-layout", "vertical");
      } else {
        document.documentElement.setAttribute("data-layout", "twocolumn");
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Appel initial
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (menuId) => {
    setOpenMenus((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
      [menuId]: !prev[menuId],
    }));
  };

  const handleMouseEnter = (menuTitle, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top + rect.height / 2
    });
    setHoveredMenuTitle(menuTitle);
  };

  const handleMouseLeave = () => {
    setHoveredMenuTitle("");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userProfile?.id) {
          const response = await fetch(
            `https://inawoapiv3.inawo.pro/utilisateurs/update-profile/${userProfile.id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

          const userData = await response.json();
          setData(userData);
          if (userData.entreprise?.logo) {
            setCoverPhoto(buildImageUrl(userData.entreprise.logo));
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userProfile?.id]);

  useEffect(() => {
    dispatch(changeSidebarVisibility("show"));
    document.body.classList.remove("twocolumn-panel");

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
  }, []);

  const sidebarStyle = {
    background: theme === "dark" ? "#090b31" : "white",
    color: theme === "dark" ? "white" : "#212529",
    transition: "all 0.3s ease",
    boxShadow: "4px 0 6px -4px rgba(0, 0, 0, 0.2)",
  };

  const simplebarStyle = {
    background: theme === "dark" ? "#070940" : "white",
    color: theme === "dark" ? "white" : "#212529",
    transition: "all 0.3s ease",
  };

  const activateParentDropdown = useCallback((item) => {
    if (!item) return;
    
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");
    if (parentCollapseDiv) {
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute(
        "aria-expanded",
        "true"
      );
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        parentCollapseDiv.parentElement
          .closest(".collapse")
          .classList.add("show");
        const parentParentCollapse =
          parentCollapseDiv.parentElement.closest(
            ".collapse"
          ).previousElementSibling;
        if (parentParentCollapse) {
          parentParentCollapse.classList.add("active");
          if (parentParentCollapse.closest(".collapse.menu-dropdown")) {
            parentParentCollapse
              .closest(".collapse.menu-dropdown")
              .classList.add("show");
          }
        }
      }
      return false;
    }
    return false;
  }, []);

  const path = props.router.location.pathname;

  function findSubItemByLink(linkText) {
    if (!navData) return null;

    for (const item of navData) {
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (subItem.link === linkText) {
            return item;
          }
        }
      }
    }
    return null;
  }

  const initMenu = useCallback(() => {
    const pathName = process.env.PUBLIC_URL + path;
    const ul = document.getElementById("navbar-nav");
    
    if (!ul) {
      setTimeout(initMenu, 50);
      return;
    }
    
    const items = ul.getElementsByTagName("a");
    let itemsArray = [...items];
    removeActivation(itemsArray);
    let matchingMenuItem = itemsArray.find((x) => {
      return x.pathname === pathName;
    });

    const foundSubItem = findSubItemByLink(pathName);
    if (foundSubItem) {
      setActiveMenu(foundSubItem.label);
      setActiveMenuIcon(foundSubItem.icon);
      if (foundSubItem.click) {
        foundSubItem.click({ preventDefault: () => { } });
      }
    }

    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path, activateParentDropdown]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    initMenu();
  }, [path, initMenu]);

  function activateIconSidebarActive(id) {
    var menu = document.querySelector(
      "#two-column-menu .simplebar-content-wrapper a[subitems='" +
      id +
      "'].nav-icon"
    );
    if (menu !== null) {
      menu.classList.add("active");
    }
  }

  const removeActivation = (items) => {
    let activeItems = items.filter((x) => x.classList.contains("active"));
    activeItems.forEach((item) => {
      if (item.classList.contains("menu-link")) {
        if (!item.classList.contains("active")) {
          item.setAttribute("aria-expanded", false);
        }
        item.nextElementSibling.classList.remove("show");
      }
      if (item.classList.contains("nav-link")) {
        if (item.nextElementSibling) {
          item.nextElementSibling.classList.remove("show");
        }
        item.setAttribute("aria-expanded", false);
      }
      item.classList.remove("active");
    });

    const ul = document.getElementById("two-column-menu");
    if (!ul) return;
    
    const iconItems = ul.getElementsByTagName("a");
    let itemsArray = [...iconItems];
    let activeIconItems = itemsArray.filter((x) =>
      x.classList.contains("active")
    );
    activeIconItems.forEach((item) => {
      item.classList.remove("active");
      var id = item.getAttribute("subitems");
      if (document.getElementById(id))
        document.getElementById(id).classList.remove("show");
    });
  };

  const mainMenus = [
    {
      id: "Dashboard",
      label: "Tableau de bord",
      icon: "ri-dashboard-line",
      title: "Suite Inawo",
    },
  ];

  const getSubMenusForMainMenu = (menuId) => {
    if (menuId === "Recrutement") {
      const recrutementMenu = filteredMenu.find(
        (menu) => menu.label === "Recrutement"
      );
      return recrutementMenu?.subItems || [];
    } else if (menuId === "Paramètres") {
      const settingsMenu = filteredMenu.find(
        (menu) => menu.label === "Paramètres"
      );
      return settingsMenu?.subItems || [];
    } else if (menuId === "Documentations") {
      return [
        {
          id: "Support Client",
          label: "Supports Clients",
          icon: "ri-message-3-line",
          link: "/:entreprise/supportClient",
          parentId: "Documentations",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
        },
        {
          id: "Guide d'utilisation",
          label: "Guide d'utilisation",
          icon: "ri-book-line",
          link: "/:entreprise/guideUtilisation",
          parentId: "Documentations",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
        },
        {
          id: "Tutoriels vidéos",
          label: "Tutoriels vidéos",
          icon: "ri-tv-line",
          link: "/:entreprise/tutoriels",
          parentId: "Documentations",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
        },
      ];
       } else if (menuId === "Discussion") {
      return [
        {
          id: "marie-dubois",
          label: "Marie Dubois",
          icon: "ri-user-line",
          image: P1,
          link: "/:entreprise/discussion?contact=marie-dubois",
          parentId: "Discussion",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
          status: "online",
          statusColor: "#28a745",
          unread: 2,
          lastMessage: "Bonjour, j'ai reçu la commande, merci !",
          role: "Commerciale",
        },
        {
          id: "pierre-martin",
          label: "Pierre Martin",
          icon: "ri-user-line",
          image: P2,
          link: "/:entreprise/discussion?contact=pierre-martin",
          parentId: "Discussion",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
          status: "offline",
          statusColor: "#6c757d",
          unread: 0,
          lastMessage: "Le devis me convient parfaitement",
          role: "Responsable Achats",
        },
        {
          id: "sophie-lambert",
          label: "Sophie Lambert",
          icon: "ri-user-line",
          image: P3,
          link: "/:entreprise/discussion?contact=sophie-lambert",
          parentId: "Discussion",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
          status: "online",
          statusColor: "#28a745",
          unread: 1,
          lastMessage: "Quand sera la prochaine livraison ?",
          role: "Logisticienne",
        },
        {
          id: "thomas-bernard",
          label: "Thomas Bernard",
          icon: "ri-user-line",
          image: P4,
          link: "/:entreprise/discussion?contact=thomas-bernard",
          parentId: "Discussion",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
          status: "away",
          statusColor: "#ffc107",
          unread: 0,
          lastMessage: "Merci pour votre réactivité",
          role: "Directeur Technique",
        },
        {
          id: "alice-moreau",
          label: "Alice Moreau",
          icon: "ri-user-line",
          image: P5,
          link: "/:entreprise/discussion?contact=alice-moreau",
          parentId: "Discussion",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOCRM"],
          status: "online",
          statusColor: "#28a745",
          unread: 0,
          lastMessage: "Le rendez-vous est confirmé pour demain",
          role: "Assistante",
        },
      ];
    }
    return [];
  };

  // FONCTION POUR RENDRER LES MENUS DU DASHBOARD (TOUS SAUF LES MENUS SPÉCIAUX) - AVEC FILTRES
  const renderDashboardMenuItems = () => {
    return (filteredMenu || [])
      .filter(
        (item) =>
          item.label !== "Recrutement" &&
          item.label !== "Paramètres" &&
          item.label !== "Documentations" &&
          item.label !== "Discussion"
      )
      .map((item, key) => (
        <React.Fragment key={key}>
          {item.subItems && item.subItems.length > 0 ? (
            <li className="nav-item" style={{ listStyle: "none", paddingLeft: 0 }}>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu(item.label);
                  setActiveMenuIcon(item.icon);
                  toggleMenu(item.id);
                  if (item.click) item.click(e);
                }}
                className={`nav-icon menu-item-hover ${openMenus[item.id] ? "active" : ""}`}
                to="#"
                style={{
                  fontSize: "13px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 15px 10px 20px",
                  textTransform: "none",
                  backgroundColor: openMenus[item.id]
                    ? "#014a92"
                    : "transparent",
                  color: openMenus[item.id]
                    ? "#fff"
                    : theme === "light"
                    ? "var(--vz-vertical-menu-sub-item-color)"
                    : "#fff",
                  transition: "all 0.3s ease",
                }}
              >
                <i
                  className={item.icon}
                  style={{
                    marginRight: "8px",
                    textAlign: "center",
                    fontSize: "18px",
                    color: openMenus[item.id]
                      ? "#fff"
                      : theme === "light"
                      ? "var(--vz-vertical-menu-sub-item-color)"
                      : "#fff",
                  }}
                />
                {props.t(item.label)}
              </Link>
              <Collapse
                className="menu-dropdown"
                isOpen={openMenus[item.id]}
                id={item.id}
              >
                <ul className="nav nav-sm flex-column" style={{ listStyle: "none", paddingLeft: 0 }}>
                  {(item.subItems || []).map((subItem, subKey) => (
                    <li key={subKey} className="nav-item" style={{ paddingLeft: 13 }}>
                      <Link
                        to={subItem.link || "/#"}
                        className={`nav-link submenu-item-hover ${activeSubMenu === subItem.link ? "active" : ""}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          height: "40px",
                          backgroundColor: activeSubMenu === subItem.link
                            ? "#f3f6f9"
                            : "transparent",
                          color: activeSubMenu === subItem.link
                            ? "#014a92"
                            : theme === "light"
                            ? "var(--vz-vertical-menu-sub-item-color)"
                            : "#fff",
                          transition: "all 0.3s ease",
                        }}
                        onClick={() => setActiveSubMenu(subItem.link)}
                      >
                        <i
                          className={subItem.icon}
                          style={{
                            marginRight: "12px",
                            width: "24px",
                            textAlign: "center",
                            color: activeSubMenu === subItem.link
                              ? "#014a92"
                              : theme === "light"
                              ? "#62748e"
                              : "#fff",
                          }}
                        />
                        {props.t(subItem.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>
          ) : (
            <li className="nav-item" style={{ listStyle: "none", paddingLeft: 0 }}>
              <Link
                to={item.link || "#"}
                className="nav-link"
                style={{
                  fontSize: "13px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 15px 10px 20px",
                  color: theme === "light" 
                    ? "var(--vz-vertical-menu-sub-item-color)" 
                    : "#fff",
                }}
              >
                <i
                  className={item.icon}
                  style={{
                    marginRight: "8px",
                    fontSize: "18px",
                  }}
                />
                {props.t(item.label)}
              </Link>
            </li>
          )}
        </React.Fragment>
      ));
  };

  const renderTrialText = () => {
    if (trialStatus === 'active') {
      return (
        <div style={{
          margin: "0",
          padding: "0",
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "11px",
            // fontWeight: "500",
            color: theme === "dark" ? "#bfdbfe" : "#1e40af",
            margin: "0",
            lineHeight: "1.5"
          }}>
            Vous êtes en version d'Essai
          </div>
          <div style={{
            fontSize: "11px",
            // fontWeight: "600",
            color: theme === "dark" ? "#60a5fa" : "#1d4ed8",
            margin: "0",
            lineHeight: "1.5"
          }}>
            Il vous reste {daysRemaining} jour{daysRemaining > 1 ? 's' : ''}
          </div>
        </div>
      );
    } else if (trialStatus === 'expired') {
      return (
        <div style={{
          margin: "4px 0 0 0",
          padding: "4px 8px",
          backgroundColor: theme === "dark" ? "#7f1d1d" : "#fee2e2",
          borderRadius: "6px",
          border: `1px solid ${theme === "dark" ? "#991b1b" : "#fca5a5"}`,
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "10px",
            fontWeight: "500",
            color: theme === "dark" ? "#fecaca" : "#dc2626",
            margin: "0",
            lineHeight: "1"
          }}>
            Vos 21 jours d'essai sont expirés
          </div>
          <div style={{
            fontSize: "9px",
            color: theme === "dark" ? "#fca5a5" : "#ef4444",
            margin: "0",
            lineHeight: "1"
          }}>
            Veuillez vous abonner
          </div>
        </div>
      );
    }
    return null;
  };

  // Le reste du code reste identique à votre nouvelle version...
  // [Rendu mobile et desktop identique à votre nouvelle version]

  // Rendu pour mobile
  const renderMobileMenu = () => (
    <div style={{ 
      background: theme === "dark" ? "#090b31" : "white",
      color: theme === "dark" ? "white" : "#212529",
      height: "100vh",
      overflow: "hidden"
    }}>
      {/* Header mobile */}
      <div style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 15px",
        borderBottom: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
        background: theme === "dark" ? "#090b31" : "white"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={theme === "dark" ? logoLight : logoDark}
            alt="Logo Inawo"
            height="30"
          />
          <h5 style={{ 
            color: theme === "dark" ? "white" : "slategray", 
            margin: 0,
            fontSize: "16px"
          }}>
            {activeMenu}
          </h5>
        </div>
        
        {/* Menu hamburger pour mobile */}
        <div style={{
          display: "flex",
          gap: "10px",
          alignItems: "center"
        }}>
          {mainMenus.map((item, key) => (
            <Link
              key={key}
              onClick={(e) => {
                e.preventDefault();
                setSelectedMainMenu(item.id);
                setActiveMenu(item.label);
                setActiveMenuIcon(item.icon);
              }}
              className={`nav-icon ${selectedMainMenu === item.id ? "active" : ""}`}
              to="#"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "3px",
                backgroundColor: selectedMainMenu === item.id
                  ? theme === "dark" ? "#2a3042" : "#f3f6f9"
                  : "transparent",
                color: selectedMainMenu === item.id
                  ? theme === "dark" ? "#fff" : "#014a92"
                  : theme === "dark" ? "#9ca3af" : "#878a99",
              }}
            >
              <i className={item.icon} style={{ fontSize: "20px" }} />
            </Link>
          ))}
        </div>
      </div>

      {/* Contenu mobile scrollable */}
      <Simplebar style={{ height: "calc(100vh - 60px)" }}>
        <div style={{ padding: "15px" }}>
          {selectedMainMenu === "Dashboard"
            ? renderDashboardMenuItems()
            : getSubMenusForMainMenu(selectedMainMenu).map((subItem, key) => (
                <Link
                  key={key}
                  to={subItem.link ? subItem.link : "/#"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 15px",
                    backgroundColor: activeSubMenu === subItem.link
                      ? "#f3f6f9"
                      : "transparent",
                    color: activeSubMenu === subItem.link
                      ? "#014a92"
                      : theme === "dark" ? "#fff" : "#212529",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "14px",
                    marginBottom: "5px"
                  }}
                  onClick={() => setActiveSubMenu(subItem.link)}
                >
                  <i 
                    className={subItem.icon} 
                    style={{ 
                      marginRight: "10px",
                      fontSize: "18px"
                    }} 
                  />
                  {props.t(subItem.label)}
                </Link>
              ))}
          
          {/* Carte upgrade mobile */}
          {showUpgradeCard && trialStatus !== 'none' && (
            <div style={{
              margin: "20px 0",
              borderRadius: "15px",
              border: `2px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
              textAlign: "center",
              overflow: "hidden",
              backgroundColor: theme === "dark" ? "#1a1d21" : "white"
            }}>
              <div style={{
                backgroundColor: theme === "dark" ? "#070940" : "#f8f9ff",
                padding: "20px 20px 15px 20px"
              }}>
                <div style={{
                  width: "45px",
                  height: "45px",
                  backgroundColor: "#6366f1",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto"
                }}>
                  <i className="ri-rocket-line" style={{ fontSize: "20px", color: "white" }} />
                </div>
              </div>
              <div style={{ padding: "15px 20px 20px 20px" }}>
                <h6 style={{
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: theme === "dark" ? "#fff" : "#1f2937"
                }}>
                  Passer au Premium
                </h6>
                
                <div style={{ marginBottom: "12px" }}>
                  <p style={{
                    margin: "0",
                    fontSize: "11px",
                    color: theme === "dark" ? "#9ca3af" : "#6b7280",
                    lineHeight: "1.1"
                  }}>
                    Débloquez toutes les fonctionnalités avancées
                  </p>
                  
                  {renderTrialText()}
                </div>
                
                <button
                  onClick={handleUpgradeClick}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    backgroundColor: trialStatus === 'expired' ? "#dc2626" : "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  <i className={trialStatus === 'expired' ? "ri-alarm-warning-line" : "ri-vip-crown-line"} style={{ marginRight: "5px" }} />
                  {trialStatus === 'expired' ? 'S\'abonner maintenant' : 'Mettre à niveau'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Simplebar>
    </div>
  );

  // Rendu pour desktop
  const renderDesktopMenu = () => (
    <div id="scrollbar" style={{ ...sidebarStyle, listStyle: "none" }}>
      <Container fluid>
        <div id="two-column-menu" style={{ ...sidebarStyle, listStyle: "none" }}>
          <Simplebar className="twocolumn-iconview" style={{ ...simplebarStyle, listStyle: "none" }}>
            <Link to="#" className="logo">
              <div style={{
                padding: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                margin: "10px 0",
              }}>
                <img
                  src={theme === "dark" ? logoLight : logoDark}
                  alt="Logo Inawo"
                  height="35"
                  style={{
                    maxWidth: "100%",
                    objectFit: "contain",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>
            </Link>

            {mainMenus.map((item, key) => (
              <div key={key} style={{
                padding: "2px 0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedMainMenu(item.id);
                    setActiveMenu(item.label);
                    setActiveMenuIcon(item.icon);
                  }}
                  className={`nav-icon ${selectedMainMenu === item.id ? "active" : ""}`}
                  to="#"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1px 0",
                    width: "40px",
                    height: "40px",
                    borderRadius: "3px",
                    backgroundColor: selectedMainMenu === item.id
                      ? theme === "dark" ? "#2a3042" : "#f3f6f9"
                      : "transparent",
                    color: selectedMainMenu === item.id
                      ? theme === "dark" ? "#fff" : "#014a92"
                      : theme === "dark" ? "#9ca3af" : "#878a99",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => handleMouseEnter(item.title, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <i className={item.icon} style={{ fontSize: "22px" }} />
                </Link>
              </div>
            ))}
          </Simplebar>

          {hoveredMenuTitle && (
            <div style={{
              position: "fixed",
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: "translateY(-50%)",
              zIndex: 9999,
              backgroundColor: "#495057",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "70px",
              fontSize: "12px",
              fontWeight: "500",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              border: "1px solid #495057",
            }}>
              {hoveredMenuTitle}
            </div>
          )}
        </div>

        <Simplebar id="navbar-nav" className="navbar-nav">
          <div style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: theme === "dark" ? "#090b31" : "#ffffff",
            padding: "17px",
            paddingLeft: "15px",
            marginLeft: "0.6px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                display: "flex",
                backgroundColor: "#f3f6f9",
                border: "none",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                alignItems: "center",
                justifyContent: "center",
                background: theme === "light" ? "#f3f6f9" : "#f3f6f967",
              }}>
                <i className={activeMenuIcon} style={{
                  color: theme === "light" ? "slategray" : "white",
                  fontSize: "21px",
                  fontWeight: "normal",
                }} />
              </div>
              <h5 style={{ color: "slategray", margin: 0 }}>
                {activeMenu}
              </h5>
            </div>
          </div>

          {selectedMainMenu === "Dashboard"
            ? renderDashboardMenuItems()
            : getSubMenusForMainMenu(selectedMainMenu).map((subItem, key) => (
                <li key={key} className="nav-item hov-mylink" style={{ paddingLeft: 13, WebkitPaddingStart: 0 }}>
                  <Link
                    to={subItem.link ? subItem.link : "/#"}
                    className={`nav-link submenu-item-hover ${activeSubMenu === subItem.link ? "active" : ""}`}
                    style={{
                      backgroundColor: activeSubMenu === subItem.link ? "#f3f6f9" : "transparent",
                      color: activeSubMenu === subItem.link ? "#014a92" : theme === "light" ? "var(--vz-vertical-menu-sub-item-color)" : "#fff",
                    }}
                    onClick={() => setActiveSubMenu(subItem.link)}
                  >
                    <div style={{ display: "flex", alignItems: "center", paddingLeft: "20px" }}>
                      <i className={subItem.icon} style={{ marginRight: "12px", width: "24px", textAlign: "center" }} />
                      {props.t(subItem.label)}
                    </div>
                  </Link>
                </li>
              ))}
          
          {/* Carte upgrade desktop */}
          {showUpgradeCard && trialStatus !== 'none' && (
            <div style={{
              margin: "20px 5px",
              borderRadius: "15px",
              border: `2px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
              textAlign: "center",
              overflow: "hidden",
              backgroundColor: theme === "dark" ? "#1a1d21" : "white"
            }}>
              <div style={{
                backgroundColor: theme === "dark" ? "#070940" : "#f8f9ff",
                padding: "20px 20px 15px 20px"
              }}>
                <div style={{
                  width: "45px",
                  height: "45px",
                  backgroundColor: "#6366f1",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto"
                }}>
                  <i className="ri-rocket-line" style={{ fontSize: "20px", color: "white" }} />
                </div>
              </div>
              <div style={{ padding: "15px 20px 20px 20px" }}>
                <h6 style={{
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: theme === "dark" ? "#fff" : "#1f2937"
                }}>
                  Passer au Premium
                </h6>
                
                <div style={{ marginBottom: "12px" }}>
                  <div style={{
                    margin: "0",
                    fontSize: "11px",
                    color: theme === "dark" ? "#9ca3af" : "#6b7280",
                    lineHeight: "1.5"
                  }}>
                    Débloquez toutes les fonctionnalités avancées.
                  </div>
                  
                  {renderTrialText()}
                </div>
                
                <button
                  onClick={handleUpgradeClick}
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    backgroundColor: trialStatus === 'expired' ? "#dc2626" : "#6366f1",
                    color: "white",
                    border: "none",
                    borderRadius: "25px",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  <i className={trialStatus === 'expired' ? "ri-alarm-warning-line" : "ri-vip-crown-line"} style={{ marginRight: "5px" }} />
                  {trialStatus === 'expired' ? 'S\'abonner maintenant' : 'Mettre à niveau'}
                </button>
              </div>
            </div>
          )}
        </Simplebar>
      </Container>
    </div>
  );

  return (
    <React.Fragment>
      {isMobile ? renderMobileMenu() : renderDesktopMenu()}
    </React.Fragment>
  );
};

TwoColumnLayout.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(TwoColumnLayout));