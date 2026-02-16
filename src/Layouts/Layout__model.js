import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
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
  ]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: "ri-home-4-line",
      link: "/#",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },   
    },
    {
      id: "apps",
      label: "Compte",
      icon: "ri-account-circle-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
      subItems: [
        {
          id: "profile",
          label: "Profil",
          icon: "ri-account-circle-line",
          link: "/suite.inawo.pro/mon_entreprise/profil",
          parentId: "apps",
        },
        {
          id: "users",
          label: "Utilisateurs",
          icon: "ri-user-3-line",
          link: "/suite.inawo.pro/mon_entreprise/utilisateur",
          parentId: "apps",
        },
        {
          id: "company",
          label: "Entreprise",
          icon: "bx bxs-calendar",
          link: "/#",
          parentId: "apps",
          isChildItem: true,
          click: function (e) {
            e.preventDefault();
            setCalender(!isCalender);
          },
          stateVariables: isCalender,
          childItems: [
            {
              id: 1,
              label: "Entreprise",
              link: "/suite.inawo.pro/mon_entreprise/entreprise",
              icon: "bx bx-calendar-star",
              parentId: "apps",
            },
            {
              id: 2,
              label: "Succursale",
              icon: "bx bx-calendar-exclamation",
              link: "/suite.inawo.pro/mon_entreprise/Succursale",
              parentId: "apps",
            },
            {
              id: 3,
              label: "Département",
              icon: "bx bx-calendar-exclamation",
              link: "/suite.inawo.pro/mon_entreprise/departement",
              parentId: "apps",
            },
            {
              id: 4,
              label: "Taxe",
              icon: "bx bx-calendar-exclamation",
              link: "/suite.inawo.pro/mon_entreprise/taxe",
              parentId: "apps",
            },
          ],
        },
        // {
        //   id: "mailbox",
        //   label: "Email",
        //   icon: "bx bx-envelope",

        //   link: "/#",
        //   parentId: "apps",
        //   isChildItem: true,
        //   click: function (e) {
        //     e.preventDefault();
        //     setEmail(!isEmail);
        //   },
        //   stateVariables: isEmail,
        //   childItems: [
        //     {
        //       id: 1,
        //       label: "Mailbox",
        //       link: "/apps-mailbox",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 2,
        //       label: "Email Templates",
        //       link: "/#",
        //       parentId: "apps",
        //       isChildItem: true,
        //       stateVariables: isSubEmail,
        //       click: function (e) {
        //         e.preventDefault();
        //         setSubEmail(!isSubEmail);
        //       },
        //       childItems: [
        //         {
        //           id: 2,
        //           label: "Basic Action",
        //           link: "/apps-email-basic",
        //           parentId: "apps",
        //         },
        //         {
        //           id: 3,
        //           label: "Ecommerce Action",
        //           link: "/apps-email-ecommerce",
        //           parentId: "apps",
        //         },
        //       ],
        //     },
        //   ],
        // },
        // {
        //   id: "appsecommerce",
        //   label: "Ecommerce",
        //   icon: "bx bx-cart",
        //   link: "/#",
        //   isChildItem: true,
        //   click: function (e) {
        //     e.preventDefault();
        //     setIsEcommerce(!isEcommerce);
        //   },
        //   parentId: "apps",
        //   stateVariables: isEcommerce,
        //   childItems: [
        //     {
        //       id: 1,
        //       label: "Products",
        //       link: "/apps-ecommerce-products",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 2,
        //       label: "Product Details",
        //       link: "/apps-ecommerce-product-details",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 3,
        //       label: "Create Product",
        //       link: "/apps-ecommerce-add-product",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 4,
        //       label: "Orders",
        //       link: "/apps-ecommerce-orders",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 5,
        //       label: "Order Details",
        //       link: "/apps-ecommerce-order-details",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 6,
        //       label: "Customers",
        //       link: "/apps-ecommerce-customers",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 7,
        //       label: "Shopping Cart",
        //       icon: "bx bx-cart",
        //       link: "/apps-ecommerce-cart",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 8,
        //       label: "Checkout",
        //       link: "/apps-ecommerce-checkout",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 9,
        //       label: "Sellers",
        //       link: "/apps-ecommerce-sellers",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 10,
        //       label: "Seller Details",
        //       link: "/apps-ecommerce-seller-details",
        //       parentId: "apps",
        //     },
        //   ],
        // },
        // {
        //   id: "appsprojects",
        //   label: "Projects",
        //   icon: "ri-apps-2-line",

        //   link: "/#",
        //   isChildItem: true,
        //   click: function (e) {
        //     e.preventDefault();
        //     setIsProjects(!isProjects);
        //   },
        //   parentId: "apps",
        //   stateVariables: isProjects,
        //   childItems: [
        //     {
        //       id: 1,
        //       label: "List",
        //       link: "/apps-projects-list",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 2,
        //       label: "Overview",
        //       link: "/apps-projects-overview",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 3,
        //       label: "Create Project",
        //       link: "/apps-projects-create",
        //       parentId: "apps",
        //     },
        //   ],
        // },
        // {
        //   id: "tasks",
        //   label: "Tasks",
        //   icon: "bx bx-task",
        //   link: "/#",
        //   isChildItem: true,
        //   click: function (e) {
        //     e.preventDefault();
        //     setIsTasks(!isTasks);
        //   },
        //   parentId: "apps",
        //   stateVariables: isTasks,
        //   childItems: [
        //     {
        //       id: 1,
        //       label: "Kanban Board",
        //       link: "/apps-tasks-kanban",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 2,
        //       label: "List View",
        //       link: "/apps-tasks-list-view",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 3,
        //       label: "Task Details",
        //       link: "/apps-tasks-details",
        //       parentId: "apps",
        //     },
        //   ],
        // },
        // {
        //   id: "appscrm",
        //   label: "CRM",
        //   icon: "bx bx-task",
        //   link: "/#",
        //   isChildItem: true,
        //   click: function (e) {
        //     e.preventDefault();
        //     setIsCRM(!isCRM);
        //   },
        //   parentId: "apps",
        //   stateVariables: isCRM,
        //   childItems: [
        //     { id: 1, label: "Contacts", link: "/apps-crm-contacts" },
        //     { id: 2, label: "Companies", link: "/apps-crm-companies" },
        //     { id: 3, label: "Deals", link: "/apps-crm-deals" },
        //     { id: 4, label: "Leads", link: "/apps-crm-leads" },
        //   ],
        // },
        // {
        //   id: "appscrypto",
        //   label: "Crypto",
        //   icon: "las la-home",
        //   link: "/#",
        //   isChildItem: true,
        //   click: function (e) {
        //     e.preventDefault();
        //     setIsCrypto(!isCrypto);
        //   },
        //   parentId: "apps",
        //   stateVariables: isCrypto,
        //   childItems: [
        //     { id: 1, label: "Transactions", link: "/apps-crypto-transactions" },
        //     { id: 2, label: "Buy & Sell", link: "/apps-crypto-buy-sell" },
        //     { id: 3, label: "Orders", link: "/apps-crypto-orders" },
        //     { id: 4, label: "My Wallet", link: "/apps-crypto-wallet" },
        //     { id: 5, label: "ICO List", link: "/apps-crypto-ico" },
        //     { id: 6, label: "KYC Application", link: "/apps-crypto-kyc" },
        //   ],
        // },
        // {
        //   id: "invoices",
        //   label: "Invoices",
        //   icon: "bx bx-book-reader",
        //   link: "/#",
        //   isChildItem: true,
        //   click: function (e) {
        //     e.preventDefault();
        //     setIsInvoices(!isInvoices);
        //   },
        //   parentId: "apps",
        //   stateVariables: isInvoices,
        //   childItems: [
        //     { id: 1, label: "List View", link: "/apps-invoices-list" },
        //     { id: 2, label: "Details", link: "/apps-invoices-details" },
        //     { id: 3, label: "Create Invoice", link: "/apps-invoices-create" },
        //   ],
        // },
        // {
        //   id: "supportTickets",
        //   label: "Support Tickets",
        //   icon: "bx bx-support",
        //   link: "/#",
        //   isChildItem: true,
        //   click: function (e) {
        //     e.preventDefault();
        //     setIsSupportTickets(!isSupportTickets);
        //   },
        //   parentId: "apps",
        //   stateVariables: isSupportTickets,
        //   childItems: [
        //     { id: 1, label: "List View", link: "/apps-tickets-list" },
        //     { id: 2, label: "Ticket Details", link: "/apps-tickets-details" },
        //   ],
        // },
        // {
        //   id: "NFTMarketplace",
        //   label: "NFT Marketplace",
        //   icon: "ri-gift-2-line",
        //   link: "/#",
        //   isChildItem: true,
        //   click: function (e) {
        //     e.preventDefault();
        //     setIsNFTMarketplace(!isNFTMarketplace);
        //   },
        //   parentId: "apps",
        //   stateVariables: isNFTMarketplace,
        //   childItems: [
        //     { id: 1, label: "Marketplace", link: "/apps-nft-marketplace" },
        //     { id: 2, label: "Explore Now", link: "/apps-nft-explore" },
        //     { id: 3, label: "Live Auction", link: "/apps-nft-auction" },
        //     { id: 4, label: "Item Details", link: "/apps-nft-item-details" },
        //     { id: 5, label: "Collections", link: "/apps-nft-collections" },
        //     { id: 6, label: "Creators", link: "/apps-nft-creators" },
        //     { id: 7, label: "Ranking", link: "/apps-nft-ranking" },
        //     { id: 8, label: "Wallet Connect", link: "/apps-nft-wallet" },
        //     { id: 9, label: "Create NFT", link: "/apps-nft-create" },
        //   ],
        // },
        // {
        //   id: "filemanager",
        //   label: "File Manager",
        //   icon: "bx bx-folder",
        //   link: "/apps-file-manager",
        //   parentId: "apps",
        // },
        // {
        //   id: "todo",
        //   label: "To Do",
        //   icon: "bx bx-list-ul",
        //   link: "/apps-todo",
        //   parentId: "apps",
        // },
        // {
        //   id: "job",
        //   label: "Jobs",
        //   icon: "bx bx-wallet-alt",
        //   link: "/#",
        //   parentId: "apps",
        //   // badgeName: "New",
        //   // badgeColor: "success",
        //   isChildItem: true,
        //   click: function (e) {
        //     e.preventDefault();
        //     setIsJobs(!isJobs);
        //   },
        //   stateVariables: isJobs,
        //   childItems: [
        //     {
        //       id: 1,
        //       label: "Statistics",
        //       icon: "bx bx-stats",
        //       link: "/apps-job-statistics",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 2,
        //       label: "Job Lists",
        //       link: "/#",

        //       parentId: "apps",
        //       isChildItem: true,
        //       stateVariables: isJobList,
        //       click: function (e) {
        //         e.preventDefault();
        //         setIsJobList(!isJobList);
        //       },
        //       childItems: [
        //         {
        //           id: 1,
        //           label: "List",
        //           link: "/apps-job-lists",
        //           parentId: "apps",
        //         },
        //         {
        //           id: 2,
        //           label: "Grid",
        //           link: "/apps-job-grid-lists",
        //           parentId: "apps",
        //         },
        //         {
        //           id: 3,
        //           label: "Overview",
        //           link: "/apps-job-details",
        //           parentId: "apps",
        //         },
        //       ],
        //     },
        //     {
        //       id: 3,
        //       label: "Candidate Lists",
        //       link: "/#",
        //       parentId: "apps",
        //       isChildItem: true,
        //       stateVariables: isCandidateList,
        //       click: function (e) {
        //         e.preventDefault();
        //         setIsCandidateList(!isCandidateList);
        //       },
        //       childItems: [
        //         {
        //           id: 1,
        //           label: "List View",
        //           link: "/apps-job-candidate-lists",
        //           parentId: "apps",
        //         },
        //         {
        //           id: 2,
        //           label: "Grid View",
        //           link: "/apps-job-candidate-grid",
        //           parentId: "apps",
        //         },
        //       ],
        //     },
        //     {
        //       id: 4,
        //       label: "Application",
        //       link: "/apps-job-application",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 5,
        //       label: "New Job",
        //       link: "/apps-job-new",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 6,
        //       label: "Companies List",
        //       link: "/apps-job-companies-lists",
        //       parentId: "apps",
        //     },
        //     {
        //       id: 7,
        //       label: "Job Categories",
        //       link: "/apps-job-categories",
        //       parentId: "apps",
        //     },
        //   ],
        // },
        // {
        //   id: "apikey",
        //   label: "API Key",
        //   icon: "bx bx-key",
        //   link: "/apps-api-key",
        //   parentId: "apps",
        //   // badgeName: "New",
        //   // badgeColor: "success"
        // },
      ],
    },
    // {
    //   label: "pages",
    //   isHeader: true,
    // },
    {
      id: "contact",
      label: "Contact",
      icon: "ri-contacts-book-2-line",
      link: "/#",
    },
    {
      id: "catalogue",
      label: "Catalogue",
      icon: "ri-apps-2-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsPages(!isPages);
        setIscurrentState("Pages");
        updateIconSidebar(e);
      },
      stateVariables: isPages,
      subItems: [
        {
          id: "categories",
          icon: "bx bx-category",
          label: "Catégories",
          link: "/#",
          parentId: "pages",
        },
        {
          id: "products",
          icon: "ri-profile-line",
          label: "Produits",
          link: "/#",
          parentId: "pages",
        },
        {
          id: "services",
          icon: "ri-service-line",
          label: "Services",
          link: "/#",
          parentId: "pages",
        },
      ],
    },
    {
      id: "sales",
      label: "Ventes",
      icon: "ri-gift-line",
      link: "/#",
    },
    {
      id: "expenses",
      label: "Dépenses",
      icon: "ri-money-dollar-circle-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsTables(!isTables);
        setIscurrentState("Tables");
        updateIconSidebar(e);
      },
      stateVariables: isTables,
      subItems: [
        {
          id: "orders",
          icon: "ri-user-3-line",
          label: "Commandes",
          link: "/#",
          parentId: "tables",
        },
        {
          id: "supply",
          icon: "ri-user-3-line",
          label: "Approvisionnement",
          link: "/#",
          parentId: "tables",
        },
        {
          id: "operating-expenses",
          icon: "ri-user-3-line",
          label: "Frais d’exploitation",
          link: "/#",
          parentId: "tables",
        },
      ],
    },
    {
      id: "charts",
      label: "Facturation",
      icon: "ri-bill-line",
      link: "/",
      click: function (e) {
        e.preventDefault();
        setIsCharts(!isCharts);
        setIscurrentState("Charts");
        updateIconSidebar(e);
      },
      stateVariables: isCharts,
      subItems: [
        {
          id: "invoice",
          label: "Facture",
          icon: "bx bx-user-plus",
          link: "/#",
          parentId: "charts",
        },
        {
          id: "standard-invoice",
          icon: "bx bx-user-check",
          label: "Facture normalisée",
          link: "/#",
          parentId: "charts",
        },
        {
          id: "quote",
          icon: "bx bx-user-check",
          label: "Devis",
          link: "/#",
          parentId: "charts",
        },
        {
          id: "proforma",
          icon: "bx bx-user-check",
          label: "Facture proforma",
          link: "/#",
          parentId: "charts",
        },
        {
          id: "purchase-order",
          icon: "bx bx-user-check",
          label: "Bon de commande",
          link: "/#",
          parentId: "charts",
        },
        {
          id: "delivery-note",
          icon: "bx bx-message-square-add",
          label: "Bon de livraison",
          link: "/#",
          parentId: "charts",
        },
        {
          id: "receipt-note",
          icon: "bx bx-message-square-add",
          label: "Bon de réception",
          link: "/#",
          parentId: "charts",
        },
        {
          id: "credit-note",
          icon: "bx bx-message-square-add",
          label: "Bon d'avoir",
          link: "/#",
          parentId: "charts",
        },
      ],
    },
    {
      id: "icons",
      label: "Gestion de stock",
      icon: "ri-box-3-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsIcons(!isIcons);
        setIscurrentState("Icons");
        updateIconSidebar(e);
      },
      stateVariables: isIcons,
      subItems: [
        {
          id: "sortie",
          label: "Sortie",
          icon: "ri-text-wrap",
          link: "/#",
          parentId: "icons",
        },
        {
          id: "permanent-inventory",
          icon: "ri-store-2-line",

          label: "Inventaire Permanent",
          link: "/#",
          parentId: "icons",
        },
        {
          id: "magasin",
          icon: "bx bx-store",
          label: "Magasin",
          link: "/#",
          parentId: "icons",
        },
        {
          id: "movements",
          icon: "ri-arrow-left-right-line",
          label: "Mouvements",
          link: "/#",
          parentId: "icons",
        },
      ],
    },
    {
      id: "opportunities",
      label: "Opportunités",
      icon: "ri-lightbulb-flash-line",
      link: "/#",
    },
    {
      id: "maps",
      label: "Gestion de projets",
      icon: "ri-projector-line",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsMaps(!isMaps);
        setIscurrentState("Maps");
        updateIconSidebar(e);
      },
      stateVariables: isMaps,
      subItems: [
        {
          id: "agenda",
          label: "Agenda",
          icon: "ri-calendar-2-line",
          link: "/ui-alerts",
          parentId: "maps",
        },
        {
          id: "tasks",
          label: "Tâches",
          icon: "ri-list-check-3",
          link: "/ui-badges",
          parentId: "maps",
        },
        {
          id: "projects",
          label: "Projets",
          icon: "ri-projector-line",
          link: "/ui-modals",
          parentId: "maps",
        },
      ],
    },

    {
      id: "Settings",
      label: "Paramètre",
      icon: "ri-settings-5-line",
      link: "/pages-profile-settings",
      click: function (e) {
        e.preventDefault();
        // setIsMaps(!isMaps);
        // setIscurrentState("Maps");

        setIsSettings(!isSettings);
        setIscurrentState("Settings");
        updateIconSidebar(e);
      },
      stateVariables: isSettings,
      subItems: [
        {
          id: "Langue",
          label: "Langue",
          icon: "ri-earth-line",
          link: "/langue",
          parentId: "Settings",
        },
        {
          id: "Devise",
          label: "Devise",
          icon: "ri-money-cny-circle-line",
          link: "/devise",
          parentId: "Settings",
        },
        {
          id: "Signature",
          label: "Signature",
          icon: "ri-sketching",
          link: "/signature",
          parentId: "Settings",
        },

        {
          id: "Unité",
          label: "Unité",
          icon: "ri-ruler-line",
          link: "/unit",
          parentId: "Settings",
        },
        {
          id: "Notification",
          label: "Notification",
          icon: "ri-notification-2-line",
          link: "/notification",
          parentId: "Settings",
        },
        // {
        //   id: "DelAccount",
        //   label: "Delete Account",
        //   icon:"ri-notification-2-line",
        //   link: "#",
        //   parentId: "Settings",
        // },

        {
          id: "activities",
          label: "Activités",
          icon: "ri-pulse-line",
          link: "/#",
           parentId: "Settings",
        },
        {
          id: "reports",
          label: "Rapports",
          icon: "ri-file-chart-line",
          link: "/#",
           parentId: "Settings",
        },
        {
          id: "files",
          label: "Fichiers",
          icon: "ri-folders-line",
          link: "/#",
           parentId: "Settings",
        },
        {
          id: "user-guide",
          label: "Guide d'utilisation",
          icon: "ri-book-read-line",
          link: "/pages-faqs",
           parentId: "Settings",
        },
      ],
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
