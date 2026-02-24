import React, { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import param_img from "../../src/assets/images/param_img.svg";
import classnames from "classnames";
// import { useContact } from "../contexts/ContactContext";
import { useSidebar } from "../contexts/SidebarContext";
import { useMenuLinks } from "../Components/Hooks/useMenuLinks";

const activeStyle = {
  backgroundColor: "#f0f0f0",
  fontWeight: "bold",
  color: "#0056b3",
};

const Navdata = () => {
  // const [activeMenu, setActiveMenu] = useState("contacts-all"); // Valeur par défaut
  const { activeMenu, setActiveMenu } = useSidebar();
  const navigate = useNavigate();

   // Fermer le menu mobile après navigation
  const handleMobileMenuClose = () => {
    if (window.innerWidth <= 991) {
      setIsMobileMenuOpen(false);
      document.body.classList.remove('vertical-sidebar-enable');
    }
  };

   const handleContactMenuClick = (type, menuId) => {
    setActiveMenu(menuId);
    navigate(`/contact?type=${type}`);

    // Déclenchez également le changement d'onglet dans le composant contact
    if (window.handleContactTabChange) {
      const tabKey = getTabKeyFromType(type);
      window.handleContactTabChange(tabKey, { filterType: type, menuId });
    }
  };

  const getTabKeyFromType = (type) => {
  const tabMap = {
    'all': '1',
    'Client': '2', 
    'Fournisseur': '3',
    'Prospect': '5',
    'Partenaire': '6'
  };
  return tabMap[type] || '1';
};

  const { t } = useTranslation();
  const history = useNavigate();
  const { generatePath } = useMenuLinks();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isCompte, setIsCompte] = useState(false);
  const [isContact, setIsContact] = useState(false);
  const [isCatalogue, setIsCatalogue] = useState(false);
  const [isVentes, setIsVentes] = useState(false);
  const [isDepenses, setIsDepenses] = useState(false);
  const [isFacturation, setIsFacturation] = useState(false);
  const [isStockManage, setIsStockManage] = useState(false);
  const [isOpportunities, setIsOpportunities] = useState(false);
  const [isProjectManagement, setIsProjectManagement] = useState(false);
  const [isHumanResources, setIsHumanResources] = useState(false);
  const [IsCompta, setIsCompta] = useState(false);
  const [IsDocument, setIsDocument] = useState(false);

  const [isApps, setIsApps] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isPages, setIsPages] = useState(false);
  const [isBaseUi, setIsBaseUi] = useState(false);
  const [isAdvanceUi, setIsAdvanceUi] = useState(false);
  const [isForms, setIsForms] = useState(false);
  const [isTables, setIsTables] = useState(false);
  const [isCharts, setIsCharts] = useState(false);
  const [isIcons, setIsIcons] = useState(false);
  const [isMaps, setIsMaps] = useState(false);
  const [isSettings, setIsSettings] = useState(false);

  const [isMenu_profil, setIsMenu_profil] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);

  //Calender
  const [isCalender, setCalender] = useState(false);

  // Apps
  const [isEmail, setEmail] = useState(false);
  const [isSubEmail, setSubEmail] = useState(false);
  const [isEcommerce, setIsEcommerce] = useState(false);
  const [isProjects, setIsProjects] = useState(false);
  const [isTasks, setIsTasks] = useState(false);
  const [isCRM, setIsCRM] = useState(false);
  const [isCrypto, setIsCrypto] = useState(false);
  const [isInvoices, setIsInvoices] = useState(false);
  const [isSupportTickets, setIsSupportTickets] = useState(false);
  const [isNFTMarketplace, setIsNFTMarketplace] = useState(false);
  const [isJobs, setIsJobs] = useState(false);
  const [isJobList, setIsJobList] = useState(false);
  const [isCandidateList, setIsCandidateList] = useState(false);

  // Authentication
  const [isSignIn, setIsSignIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isPasswordCreate, setIsPasswordCreate] = useState(false);
  const [isLockScreen, setIsLockScreen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [isError, setIsError] = useState(false);

  // Pages
  const [isProfile, setIsProfile] = useState(false);
  const [isLanding, setIsLanding] = useState(false);
  const [isBlog, setIsBlog] = useState(false);

  // Charts
  const [isApex, setIsApex] = useState(false);

  // Multi Level
  const [isLevel1, setIsLevel1] = useState(false);
  const [isLevel2, setIsLevel2] = useState(false);

  // Sous menu
  const [isExp, setIsExp] = useState(false);
  const [isDep, setIsDep] = useState(false);
  const [isFin, setIsFin] = useState(false);
  const [isInv, setIsInv] = useState(false);
  const [isGen, setIsGen] = useState(false);
  const [isPers, setIsPers] = useState(false);

  //Menu type_contact

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Compte") {
      setIsCompte(false);
    }
    if (iscurrentState !== "Contact") {
      setIsContact(false);
    }
    if (iscurrentState !== "Catalogue") {
      setIsCatalogue(false);
    }
    if (iscurrentState !== "Ventes") {
      setIsVentes(false);
    }
    if (iscurrentState !== "Depenses") {
      setIsDepenses(false);
    }
    if (iscurrentState !== "Facturation") {
      setIsFacturation(false);
    }
    if (iscurrentState !== "StockManage") {
      setIsStockManage(false);
    }
    if (iscurrentState !== "Opportunities") {
      setIsOpportunities(false);
    }
    if (iscurrentState !== "ProjectManagement") {
      setIsProjectManagement(false);
    }
    if (iscurrentState !== "HumanResources") {
      setIsHumanResources(false);
    }

    if (iscurrentState !== "Compta") {
      setIsCompta(false);
    }

    if (iscurrentState !== "Document") {
      setIsDocument(false);
    }

    if (iscurrentState !== "Apps") {
      setIsApps(false);
    }
    if (iscurrentState !== "Auth") {
      setIsAuth(false);
    }
    if (iscurrentState !== "Pages") {
      setIsPages(false);
    }
    if (iscurrentState !== "BaseUi") {
      setIsBaseUi(false);
    }
    if (iscurrentState !== "AdvanceUi") {
      setIsAdvanceUi(false);
    }
    if (iscurrentState !== "Forms") {
      setIsForms(false);
    }
    if (iscurrentState !== "Tables") {
      setIsTables(false);
    }
    if (iscurrentState !== "Charts") {
      setIsCharts(false);
    }
    if (iscurrentState !== "Icons") {
      setIsIcons(false);
    }
    if (iscurrentState !== "Maps") {
      setIsMaps(false);
    }
    if (iscurrentState !== "Settings") {
      setIsSettings(false);
    }
    if (iscurrentState !== "Menu_profil") {
      setIsMenu_profil(false);
    }
    if (iscurrentState !== "Menu_profil") {
      setIsMenu_profil(false);
    }
    if (iscurrentState !== "MuliLevel") {
      setIsMultiLevel(false);
    }
    if (iscurrentState === "Widgets") {
      history("/widgets");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState !== "Landing") {
      setIsLanding(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isApps,
    isAuth,
    isPages,
    isBaseUi,
    isAdvanceUi,
    isForms,
    isTables,
    isCharts,
    isIcons,
    isMaps,
    isMultiLevel,
    isSettings,
    isMenu_profil,
  ]);

    const handleMenuClick = (clickFunction) => (e) => {
    clickFunction(e);
    // Ne ferme pas le menu principal, seulement lors de la navigation vers un sous-item
  };

  const menuItems = [
    {
      id: "Dashboard",
      label: "Tableau de bord",
      icon: "ri-dashboard-line",
      link: "/",
      img: "param_img.svg",
      modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
      stateVariables: isDashboard,
      click: handleMenuClick(  function (e) {
        e.preventDefault();
        // setIsDashboard( !isDashboard );
        setIsDashboard(true);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
        // window.href = "/dashboard";
      }),
     
      subItems: [
        {
          id: "analytique",
          icon: "ri-bar-chart-line",
          label: "analytique",
          link: generatePath("/dashboard"),
          parentId: "Dashboard",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
          utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
          onClick: handleMobileMenuClose,
        },

          {
          id: "dashboard-rh",
          icon: "ri-dashboard-line",
          label: "Dashboard RH",
          link: generatePath("/dashboard-rh"),
          parentId: "HumanResources",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
          utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
          onClick: handleMobileMenuClose,
        },
      ],
    },
    {
      id: "HumanResources",
      label: "Ressources humaines",
      icon: "ri-briefcase-4-line",
      link: "/#",
      img: "param_img.svg",
      modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
      stateVariables: isHumanResources,
      click: handleMenuClick(function (e) {
        e.preventDefault();
        setIsHumanResources(true);
        setIscurrentState("HumanResources");
        updateIconSidebar(e);
      }),
      subItems: [
      
        {
          id: "collaborateur",
          icon: "ri-team-line",
          label: "Collaborateur",
          link: generatePath("/collaborateurs"),
          parentId: "HumanResources",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
          utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
          onClick: handleMobileMenuClose,
        },
        {
          id: "recrutement",
          icon: "ri-team-line",
          label: "Recrutement",
          link: generatePath("/recrutements"),
          parentId: "HumanResources",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
          utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
          onClick: handleMobileMenuClose,
        },

        {
          id: "Fiche de paie",
          icon: "ri-file-text-line",
          label: "Fiche de paie",
          link: generatePath("/fiche-paie"),
          parentId: "HumanResources",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
          utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
          onClick: handleMobileMenuClose,
        },
        {
          id: "Recrutement",
          icon: "ri-user-search-line",
          label: "Recrutement",
          link: generatePath("/recrutements"),
          parentId: "HumanResources",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
          utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
          onClick: handleMobileMenuClose,
        },
        {
          id: "Avance et Pret",
          icon: "ri-user-search-line",
          label: "Avance et Prêt",
          link: generatePath("/avance-et-pret"),
          parentId: "HumanResources",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
          utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
          onClick: handleMobileMenuClose,
        },
        {
          id: "Contrats",
          icon: "ri-file-text-line",
          label: "Contrats",
          link: generatePath("/contrats"),
          parentId: "HumanResources",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
          utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
          onClick: handleMobileMenuClose,
        },
        
        {
          id : "Pointages",
          icon: "ri-timer-line",
          label: "Pointages",
          link: generatePath("/pointage"),
          parentId: "HumanResources",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
          utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
          onClick: handleMobileMenuClose,
        }
      ],
    },
    
    // Paramètres
    {
      id: "Settings",
      label: "Paramètres",
      icon: "ri-settings-5-line",
      link: "/#",
      img: "param_img.svg",
      modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
      stateVariables: isSettings,
      click: handleMenuClick(function (e) {
        e.preventDefault();
        setIsSettings(true);
        setIscurrentState("Settings");
        updateIconSidebar(e);
      }),
      subItems: [
        // {
        //   id: "profil",
        //   icon: "ri-user-settings-line",
        //   label: "Profil",
        //   link: generatePath("/profil"),
        //   parentId: "Settings",
        //   modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
        //   utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
        //   onClick: handleMobileMenuClose,
        // },

        // {
        //   id: "notification",
        //   icon: "ri-notification-3-line",
        //   label: "Notifications",
        //   link: generatePath("/notification"),
        //   parentId: "Settings",
        //   modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
        //   utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
        //   onClick: handleMobileMenuClose,
        // },
        // {
        //   id: "preference",
        //   icon: "ri-thumb-up-line",
        //   label: "Préférences",
        //   link: generatePath("/preference"),
        //   parentId: "Settings",
        //   modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
        //   utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
        //   onClick: handleMobileMenuClose,
        // },
        {
          id: "pointage",
          icon: "ri-timer-line",
          label: "Pointage",
          link: generatePath("/pointage-param"),
          parentId: "Settings",
          modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
          utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
          onClick: handleMobileMenuClose,
        },
      ],
    },
  
    // Documents
    // {
    //   id: "documents",
    //   label: "Documents",
    //   icon: "ri-folder-open-line",
    //   img: "param_img.svg",
    //   modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDocument(true);
    //     setIscurrentState("Document");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: IsDocument,
    //   subItems: [
    //     {
    //       id: "Piece",
    //       label: "Picèces comptable",
    //       icon: "ri-file-pdf-2-line",
    //       link: generatePath("/piece"),
    //       parentId: "Documents",
    //       modules: ["INAWOSTOCK", "INAWOGLOBAL", "INAWOSALES"],
    //       utilisateur: ["Administrateur", "Collaborateur", "Observateur"],
    //     },
    //   ],
    // },
  ];
  return menuItems;
};

export default Navdata;