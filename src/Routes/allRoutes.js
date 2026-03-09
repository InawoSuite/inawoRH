import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import RouteWrapper from "../Components/RouteWrapper";

// Modifier authProtectedRoutes pour wrapper chaque route
const wrapWithEntreprise = (routes) => {
  return routes.map((route) => ({
    ...route,
    component: <RouteWrapper>{route.component}</RouteWrapper>,
  }));
};

//Dashboard
// import DashboardAnalytics from "../pages/DashboardAnalytics";
import DashboardCrm from "../pages/DashboardCrm";
import DashboardEcommerce from "../pages/DashboardEcommerce";
import DashboardVente from "../pages/DashboardVente";
import DashboardStock from "../pages/DashboardStock";
import DashboardRecrue from "../pages/DashboardRecrue";

import DashboardCrypto from "../pages/DashboardCrypto";
import DashboardProject from "../pages/DashboardProject";
import DashboardNFT from "../pages/DashboardNFT";
import DashboardJob from "../pages/DashboardJob/";

//Calendar
import Calendar from "../pages/Calendar/Maincalender";
import MonthGrid from "../pages/Calendar/MonthGrid";

import ProfileEdit from "../pages/Pages/Profile/Settings/Profile/ProfileEdit";
import ModifierEntreprise from "../pages/Pages/Profile/SimplePageCopie/ModifierEntreprise.js";

// Email box
import MailInbox from "../pages/EmailInbox";
import BasicAction from "../pages/Email/EmailTemplates/BasicAction";
import EcommerceAction from "../pages/Email/EmailTemplates/EcommerceAction";

//Chat
import Chat from "../pages/Chat";

// Project
import ProjectList from "../pages/Projects/ProjectList";
import ProjectOverview from "../pages/Projects/ProjectOverview";
import CreateProject from "../pages/Projects/CreateProject";

//Task
import TaskDetails from "../pages/Tasks/TaskDetails";
import TaskList from "../pages/Tasks/TaskList";
import Kanbanboard from "../pages/Tasks/KanbanBoard";

//Transactions
import Transactions from "../pages/Crypto/Transactions";
import BuySell from "../pages/Crypto/BuySell";
import CryproOrder from "../pages/Crypto/CryptoOrder";
import MyWallet from "../pages/Crypto/MyWallet";
import ICOList from "../pages/Crypto/ICOList";
import KYCVerification from "../pages/Crypto/KYCVerification";

//Crm Pages
import CrmCompanies from "../pages/Crm/CrmCompanies";
import CrmContacts from "../pages/Crm/CrmContacts";
// Support Tickets
import ListView from "../pages/SupportTickets/ListView";
import TicketsDetails from "../pages/SupportTickets/TicketsDetails";

import EcommerceCart from "../pages/Ecommerce/EcommerceCart";
import EcommerceCheckout from "../pages/Ecommerce/EcommerceCheckout";

// NFT Marketplace Pages
import Marketplace from "../pages/NFTMarketplace/Marketplace";
import Collections from "../pages/NFTMarketplace/Collections";
import CreateNFT from "../pages/NFTMarketplace/CreateNFT";
import Creators from "../pages/NFTMarketplace/Creators";
import ExploreNow from "../pages/NFTMarketplace/ExploreNow";
import ItemDetails from "../pages/NFTMarketplace/Itemdetails";
import LiveAuction from "../pages/NFTMarketplace/LiveAuction";
import Ranking from "../pages/NFTMarketplace/Ranking";
import WalletConnect from "../pages/NFTMarketplace/WalletConnect";

// Base Ui
import UiAlerts from "../pages/BaseUi/UiAlerts/UiAlerts";
import UiBadges from "../pages/BaseUi/UiBadges/UiBadges";
import UiButtons from "../pages/BaseUi/UiButtons/UiButtons";
import UiColors from "../pages/BaseUi/UiColors/UiColors";
import UiCards from "../pages/BaseUi/UiCards/UiCards";
import UiCarousel from "../pages/BaseUi/UiCarousel/UiCarousel";
import UiDropdowns from "../pages/BaseUi/UiDropdowns/UiDropdowns";
import UiGrid from "../pages/BaseUi/UiGrid/UiGrid";
import UiImages from "../pages/BaseUi/UiImages/UiImages";
import UiTabs from "../pages/BaseUi/UiTabs/UiTabs";
import UiAccordions from "../pages/BaseUi/UiAccordion&Collapse/UiAccordion&Collapse";
import UiModals from "../pages/BaseUi/UiModals/UiModals";
import UiOffcanvas from "../pages/BaseUi/UiOffcanvas/UiOffcanvas";
import UiPlaceholders from "../pages/BaseUi/UiPlaceholders/UiPlaceholders";
import UiProgress from "../pages/BaseUi/UiProgress/UiProgress";
import UiNotifications from "../pages/BaseUi/UiNotifications/UiNotifications";
import UiMediaobject from "../pages/BaseUi/UiMediaobject/UiMediaobject";
import UiEmbedVideo from "../pages/BaseUi/UiEmbedVideo/UiEmbedVideo";
import UiTypography from "../pages/BaseUi/UiTypography/UiTypography";
import UiList from "../pages/BaseUi/UiLists/UiLists";
import UiGeneral from "../pages/BaseUi/UiGeneral/UiGeneral";
import UiRibbons from "../pages/BaseUi/UiRibbons/UiRibbons";
import UiUtilities from "../pages/BaseUi/UiUtilities/UiUtilities";

// Advance Ui
import UiNestableList from "../pages/AdvanceUi/UiNestableList/UiNestableList";
import UiScrollbar from "../pages/AdvanceUi/UiScrollbar/UiScrollbar";
import UiAnimation from "../pages/AdvanceUi/UiAnimation/UiAnimation";
import UiSwiperSlider from "../pages/AdvanceUi/UiSwiperSlider/UiSwiperSlider";
import UiRatings from "../pages/AdvanceUi/UiRatings/UiRatings";
import UiHighlight from "../pages/AdvanceUi/UiHighlight/UiHighlight";

// Widgets
import Widgets from "../pages/Widgets/Index";

//Forms
import BasicElements from "../pages/Forms/BasicElements/BasicElements";
import FormSelect from "../pages/Forms/FormSelect/FormSelect";
import FormEditor from "../pages/Forms/FormEditor/FormEditor";
import CheckBoxAndRadio from "../pages/Forms/CheckboxAndRadio/CheckBoxAndRadio";
import Masks from "../pages/Forms/Masks/Masks";
import FileUpload from "../pages/Forms/FileUpload/FileUpload";
import FormPickers from "../pages/Forms/FormPickers/FormPickers";
import FormRangeSlider from "../pages/Forms/FormRangeSlider/FormRangeSlider";
import Formlayouts from "../pages/Forms/FormLayouts/Formlayouts";
import FormValidation from "../pages/Forms/FormValidation/FormValidation";
import FormWizard from "../pages/Forms/FormWizard/FormWizard";
import FormAdvanced from "../pages/Forms/FormAdvanced/FormAdvanced";
import Select2 from "../pages/Forms/Select2/Select2";

//Tables
import BasicTables from "../pages/Tables/BasicTables/BasicTables";
import ListTables from "../pages/Tables/ListTables/ListTables";
import ReactTable from "../pages/Tables/ReactTables";

//Icon pages
import RemixIcons from "../pages/Icons/RemixIcons/RemixIcons";
import BoxIcons from "../pages/Icons/BoxIcons/BoxIcons";
import MaterialDesign from "../pages/Icons/MaterialDesign/MaterialDesign";
import FeatherIcons from "../pages/Icons/FeatherIcons/FeatherIcons";
import LineAwesomeIcons from "../pages/Icons/LineAwesomeIcons/LineAwesomeIcons";
import CryptoIcons from "../pages/Icons/CryptoIcons/CryptoIcons";

//Maps
import GoogleMaps from "../pages/Maps/GoogleMaps/GoogleMaps";

//AuthenticationInner pages
import BasicSignIn from "../pages/AuthenticationInner/Login/BasicSignIn";
import CoverSignIn from "../pages/AuthenticationInner/Login/CoverSignIn";
import BasicSignUp from "../pages/AuthenticationInner/Register/BasicSignUp";
import CoverSignUp from "../pages/AuthenticationInner/Register/CoverSignUp";
import BasicPasswReset from "../pages/AuthenticationInner/PasswordReset/BasicPasswReset";

//pages
import Starter from "../pages/Pages/Starter/Starter";
import SimplePage from "../pages/Pages/Profile/SimplePage/SimplePage";
import SimplePageCopie from "../pages/Pages/Profile/SimplePageCopie/entreprise";
import Notification from "../pages/Pages/Profile/Settings/Notification";
import Preference from "../pages/Pages/Profile/Settings/Preference";

import Timeline from "../pages/Pages/Timeline/Timeline";
import Faqs from "../pages/Pages/Faqs/Faqs";
import Pricing from "../pages/Pages/Pricing/Pricing";
import Gallery from "../pages/Pages/Gallery/Gallery";
import Maintenance from "../pages/Pages/Maintenance/Maintenance";
import ComingSoon from "../pages/Pages/ComingSoon/ComingSoon";
import SiteMap from "../pages/Pages/SiteMap/SiteMap";
import SearchResults from "../pages/Pages/SearchResults/SearchResults";

import CoverPasswReset from "../pages/AuthenticationInner/PasswordReset/CoverPasswReset";
import BasicLockScreen from "../pages/AuthenticationInner/LockScreen/BasicLockScr";
import CoverLockScreen from "../pages/AuthenticationInner/LockScreen/CoverLockScr";
import BasicLogout from "../pages/AuthenticationInner/Logout/BasicLogout";
import CoverLogout from "../pages/AuthenticationInner/Logout/CoverLogout";
import BasicSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/BasicSuccessMsg";
import CoverSuccessMsg from "../pages/AuthenticationInner/SuccessMessage/CoverSuccessMsg";
import BasicTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/BasicTwosVerify";
import CoverTwosVerify from "../pages/AuthenticationInner/TwoStepVerification/CoverTwosVerify";
import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";

import BasicPasswCreate from "../pages/AuthenticationInner/PasswordCreate/BasicPasswCreate";
import CoverPasswCreate from "../pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

//APi Key
import APIKey from "../pages/APIKey/index";

//login
import Login from "../pages/Authentication/Login";
import ChangePassword from "../pages/Authentication/ChangePassword";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

//Charts
import LineCharts from "../pages/Charts/ApexCharts/LineCharts";
import AreaCharts from "../pages/Charts/ApexCharts/AreaCharts";
import ColumnCharts from "../pages/Charts/ApexCharts/ColumnCharts";
import BarCharts from "../pages/Charts/ApexCharts/BarCharts";
import MixedCharts from "../pages/Charts/ApexCharts/MixedCharts";
import TimelineCharts from "../pages/Charts/ApexCharts/TimelineCharts";
import CandlestickChart from "../pages/Charts/ApexCharts/CandlestickChart";
import BoxplotCharts from "../pages/Charts/ApexCharts/BoxplotCharts";
import BubbleChart from "../pages/Charts/ApexCharts/BubbleChart";
import ScatterCharts from "../pages/Charts/ApexCharts/ScatterCharts";
import HeatmapCharts from "../pages/Charts/ApexCharts/HeatmapCharts";
import TreemapCharts from "../pages/Charts/ApexCharts/TreemapCharts";
import PieCharts from "../pages/Charts/ApexCharts/PieCharts";
import RadialbarCharts from "../pages/Charts/ApexCharts/RadialbarCharts";
import RadarCharts from "../pages/Charts/ApexCharts/RadarCharts";
import PolarCharts from "../pages/Charts/ApexCharts/PolarCharts";
import ChartsJs from "../pages/Charts/ChartsJs/index";
import Echarts from "../pages/Charts/ECharts/index";

//Job pages
import Statistics from "../pages/Jobs/Statistics";
import JobList from "../pages/Jobs/JobList/List";
import JobGrid from "../pages/Jobs/JobList/Grid";
import JobOverview from "../pages/Jobs/JobList/Overview";
import CandidateList from "../pages/Jobs/CandidateList/ListView";
import CandidateGrid from "../pages/Jobs/CandidateList/GridView";
import NewJobs from "../pages/Jobs/NewJob";
import JobCategories from "../pages/Jobs/JobCategories";
import Application from "../pages/Jobs/Application";
import CompaniesList from "../pages/Jobs/CompaniesList";

// Landing Index
import OnePage from "../pages/Landing/OnePage";
import NFTLanding from "../pages/Landing/NFTLanding";

import PrivecyPolicy from "../pages/Pages/PrivacyPolicy";
import TermsCondition from "../pages/Pages/TermsCondition";
import JobLanding from "../pages/Job_Landing/Job";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";
import Collaborateurs from "../pages/Pages/Rh/collaborateur/Collaborateurs";
import CollaborateurAdd from "../pages/Pages/Rh/collaborateur/CollaborateurAdd";
import CollaborateurEdit from "../pages/Pages/Rh/collaborateur/CollaborateurEdit";
import Recrutements from "../pages/Pages/Rh/recrutement/Recrutements";
import OffreAdd from "../pages/Pages/Rh/recrutement/OffreAdd";
import DetailsOffre from "../pages/Pages/Rh/recrutement/DetailsOffre";
import DetailsCandidature from "../pages/Pages/Rh/recrutement/DetailsCandidature";
import EditProfile from "../pages/Pages/Rh/EditProfile";
import DetailsCollaborateur from "../pages/Pages/Rh/collaborateur/DetailsCollaborateur";
import DashboardRH from "../pages/Pages/Rh/dashboard-rh/DashboardRH";
import FichePaie from "../pages/Pages/Rh/fiche-paie/FichePaie";
import FicheAdd from "../pages/Pages/Rh/fiche-paie/FicheAdd";
import FicheDetail from "../pages/Pages/Rh/fiche-paie/FicheDetail";
import FicheEdit from "../pages/Pages/Rh/fiche-paie/FicheEdit";
import AvanceEtPret from "../pages/Pages/Rh/avance-et-pret/AvanceEtPret";
import AvanceEtPretForm from "../pages/Pages/Rh/avance-et-pret/AvanceEtPretForm";
import AvanceEtPretAdd from "../pages/Pages/Rh/avance-et-pret/AvanceEtPretAdd";
import AvanceEtPretEdit from "../pages/Pages/Rh/avance-et-pret/AvanceEtPretEdit";
import Contrat from "../pages/Pages/Rh/Contrats/Contract";
// import DetailsCollaborateur from "../pages/Pages/Rh/DetailsCollaborateur";
// import DashboardRH from "../pages/Pages/Rh/DashboardRH";
// import FichePaie from "../pages/Pages/Rh/FichePaie";
// import FicheDetail from "../pages/Pages/Rh/FicheDetail";
// import FicheAdd from "../pages/Pages/Rh/FicheAdd";
// import AvanceEtPret from "../pages/Pages/Rh/AvanceEtPret";
// import AvanceEtPretForm from "../pages/Pages/Rh/AvanceEtPretForm";
// import AvanceEtPretAdd from "../pages/Pages/Rh/AvanceEtPretAdd";
// import AvanceEtPretEdit from "../pages/Pages/Rh/AvanceEtPretEdit";
import CongeEtAbsence from "../pages/Pages/Rh/conges-et-absences/CongeEtAbsence";
import CongeEtAbsenceForm from "../pages/Pages/Rh/conges-et-absences/CongeEtAbsenceForm";
import CongeEtAbsenceAdd from "../pages/Pages/Rh/conges-et-absences/CongeEtAbsenceAdd";
import CongeEtAbsenceEdit from "../pages/Pages/Rh/conges-et-absences/CongeEtAbsenceEdit";
import Evaluation from "../pages/Pages/Rh/evaluations/Evaluation";
import EvaluationForm from "../pages/Pages/Rh/evaluations/EvaluationForm";
import EvaluationAdd from "../pages/Pages/Rh/evaluations/EvaluationAdd";
import EvaluationEdit from "../pages/Pages/Rh/evaluations/EvaluationEdit";
import PaieEtAvances from "../pages/Pages/Rh/PaieEtAvances";
import PresenceEtAbsence from "../pages/Pages/Rh/PresenceEtAbsence";

import Poste from "../pages/Pages/Rh/postes/Poste";
import PosteForm from "../pages/Pages/Rh/postes/PosteForm";
import PosteAdd from "../pages/Pages/Rh/postes/PosteAdd";
import PosteEdit from "../pages/Pages/Rh/postes/PosteEdit";

import AddContract from "../pages/Pages/Rh/Contrats/AddContract";
import EditContract from "../pages/Pages/Rh/Contrats/EditContract";
import Pointage from "../pages/Pages/Rh/Pointage/Pointage";
import PointageParam from "../pages/Pages/Parametres/PointageParam";
import DetailContract from "../pages/Pages/Rh/Contrats/DetailContract";
import Settings from "../pages/Pages/Profile/Settings/Profile/Settings";
import FileManager from "../pages/FileManager";
import ToDoList from "../pages/ToDo";
import RangeArea from "../pages/Charts/ApexCharts/RangeAreaCharts/Index";
import FunnelChart from "../pages/Charts/ApexCharts/FunnelCharts/Index";
import UiLink from "../pages/BaseUi/UiLinks/UiLinks";
import DashboardBlog from "../pages/DashboardBlog";
import SlopeCharts from "../pages/Charts/ApexCharts/SlopeCharts";
import BlogListView from "../pages/Pages/Blogs/ListView";
import BlogGridView from "../pages/Pages/Blogs/GridView";
import PageBlogOverview from "../pages/Pages/Blogs/Overview";

import Unauthorized from "../pages/Pages/Profile/Settings/Unauthorized.js";
// import EcommerceDepartment from "../pages/Ecommerce/Departements/index.js";

import Journaux from "../pages/Pages/Compta/Journaux/index.js";
import Operation from "../pages/Pages/Compta/Operation/index.js";
import Immobilisations from "../pages/Pages/Compta/Immobilisations/index.js";
import Balance from "../pages/Pages/Compta/Balance/Balance.js";
import PlanComptable from "../pages/Pages/Profile/Settings/Plan.js";
import Caisse from "../pages/Caisse/index.js";
import Banque from "../pages/Banque/index.js";
import Budget from "../pages/Budget/index.js";
import GrandLivre from "../pages/Pages/Compta/Livre/Index.js";
import Rappprochement from "../pages/Rapprochement/index.js";
import FinancementsEmprunts from "../pages/Financement/index.js";
import Piece from "../pages/Piece/index.js";
import Etats from "../pages/Pages/Compta/Etats/Index.js";
// import FicheAdd from "../pages/Pages/Rh/FicheAdd.js";

const authProtectedRoutes = [
  { path: "/unauthorized", component: <Unauthorized /> },

  { path: "/dashboard-analytics", component: <DashboardEcommerce /> },
  { path: "/dashboard-crm", component: <DashboardCrm /> },
  {
    path: "/:entreprise/dashboard",
    component: (
      <RouteWrapper>
        <DashboardEcommerce />
      </RouteWrapper>
    ),
  },
  // { path: "/dashboard-vente", component: <DashboardVente /> },
  {
    path: "/:entreprise/dashboard-vente",
    component: (
      <RouteWrapper>
        <DashboardVente />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/dashboard-stock",
    component: (
      <RouteWrapper>
        <DashboardStock />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/dashboard-recrue",
    component: (
      <RouteWrapper>
        <DashboardRecrue />
      </RouteWrapper>
    ),
  },
  { path: "/index", component: <DashboardEcommerce /> },
  { path: "/dashboard-crypto", component: <DashboardCrypto /> },
  { path: "/dashboard-projects", component: <DashboardProject /> },
  { path: "/dashboard-nft", component: <DashboardNFT /> },
  { path: "/dashboard-job", component: <DashboardJob /> },
  {
    path: "/:entreprise/profile-edit",
    component: (
      <RouteWrapper>
        <ProfileEdit />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/collaborateurs",
    component: (
      <RouteWrapper>
        <Collaborateurs />
      </RouteWrapper>
    ),
  },

  {
    path: "/:entreprise/collaborateur-add",
    component: (
      <RouteWrapper>
        <CollaborateurAdd />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/collaborateur-details/:id",
    component: (
      <RouteWrapper>
        <DetailsCollaborateur />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/collaborateur-edit/:id",
    component: (
      <RouteWrapper>
        <CollaborateurEdit />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/dashboard-rh",
    component: (
      <RouteWrapper>
        <DashboardRH />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/fiche-paie",
    component: (
      <RouteWrapper>
        <FichePaie />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/fiche-details/:id",
    component: (
      <RouteWrapper>
        <FicheDetail />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/fiche-add",
    component: (
      <RouteWrapper>
        <FicheAdd />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/fiche-edit/:id",
    component: (
      <RouteWrapper>
        <FicheEdit />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/contrats",
    component: (
      <RouteWrapper>
        <Contrat />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/contrat-add",
    component: (
      <RouteWrapper>
        <AddContract />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/contrat-details/:id",
    component: (
      <RouteWrapper>
        <DetailContract />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/contrat-edit/:id",
    component: (
      <RouteWrapper>
        <EditContract />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/pointage",
    component: (
      <RouteWrapper>
        <Pointage />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/pointage-param",
    component: (
      <RouteWrapper>
        <PointageParam />
      </RouteWrapper>
    ),
  },

  { path: "/apps-calendar", component: <Calendar /> },
  { path: "/apps-calendar-month-grid", component: <MonthGrid /> },
  { path: "/apps-ecommerce-cart", component: <EcommerceCart /> },
  { path: "/apps-ecommerce-checkout", component: <EcommerceCheckout /> },

  { path: "/apps-file-manager", component: <FileManager /> },
  { path: "/apps-todo", component: <ToDoList /> },

  //Chat
  { path: "/apps-chat", component: <Chat /> },

  //EMail
  { path: "/apps-mailbox", component: <MailInbox /> },
  { path: "/apps-email-basic", component: <BasicAction /> },
  { path: "/apps-email-ecommerce", component: <EcommerceAction /> },

  //Projects
  { path: "/apps-projects-list", component: <ProjectList /> },
  { path: "/apps-projects-overview", component: <ProjectOverview /> },
  { path: "/apps-projects-create", component: <CreateProject /> },

  //Task
  { path: "/apps-tasks-list-view", component: <TaskList /> },
  { path: "/apps-tasks-details", component: <TaskDetails /> },
  { path: "/apps-tasks-kanban", component: <Kanbanboard /> },

  //Api Key
  { path: "/apps-api-key", component: <APIKey /> },

  //Crm
  { path: "/apps-crm-contacts", component: <CrmContacts /> },
  { path: "/apps-crm-companies", component: <CrmCompanies /> },

  {
    path: "/:entreprise/profil",
    component: (
      <RouteWrapper>
        <Settings />
      </RouteWrapper>
    ),
  },
  //  { path: "/:entreprise/dashboard-stock", component: <RouteWrapper><DashboardStock /></RouteWrapper> },
  {
    path: "/:entreprise/caisse",
    component: (
      <RouteWrapper>
        <Caisse />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/rapprochement",
    component: (
      <RouteWrapper>
        <Rappprochement />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/banque",
    component: (
      <RouteWrapper>
        <Banque />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/budget",
    component: (
      <RouteWrapper>
        <Budget />
      </RouteWrapper>
    ),
  },

  {
    path: "/:entreprise/financement",
    component: (
      <RouteWrapper>
        <FinancementsEmprunts />
      </RouteWrapper>
    ),
  },

  {
    path: "/:entreprise/piece",
    component: (
      <RouteWrapper>
        <Piece />
      </RouteWrapper>
    ),
  },


  //Supports Tickets
  {
    path: "/:entreprise/apps-tickets-list",
    component: (
      <RouteWrapper>
        <ListView />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/apps-tickets-details",
    component: (
      <RouteWrapper>
        <TicketsDetails />
      </RouteWrapper>
    ),
  },

  //transactions
  { path: "/apps-crypto-transactions", component: <Transactions /> },
  { path: "/apps-crypto-buy-sell", component: <BuySell /> },
  { path: "/apps-crypto-orders", component: <CryproOrder /> },
  { path: "/apps-crypto-wallet", component: <MyWallet /> },
  { path: "/apps-crypto-ico", component: <ICOList /> },
  { path: "/apps-crypto-kyc", component: <KYCVerification /> },
  {
    path: "/:entreprise/supportClient",
    component: (
      <RouteWrapper>
        <ListView />
      </RouteWrapper>
    ),
  },

  // NFT Marketplace
  { path: "/apps-nft-marketplace", component: <Marketplace /> },
  { path: "/apps-nft-collections", component: <Collections /> },
  { path: "/apps-nft-create", component: <CreateNFT /> },
  { path: "/apps-nft-creators", component: <Creators /> },
  { path: "/apps-nft-explore", component: <ExploreNow /> },
  { path: "/apps-nft-item-details", component: <ItemDetails /> },
  { path: "/apps-nft-auction", component: <LiveAuction /> },
  { path: "/apps-nft-ranking", component: <Ranking /> },
  { path: "/apps-nft-wallet", component: <WalletConnect /> },

  //charts
  { path: "/charts-apex-line", component: <LineCharts /> },
  { path: "/charts-apex-area", component: <AreaCharts /> },
  { path: "/charts-apex-column", component: <ColumnCharts /> },
  { path: "/charts-apex-bar", component: <BarCharts /> },
  { path: "/charts-apex-mixed", component: <MixedCharts /> },
  { path: "/charts-apex-timeline", component: <TimelineCharts /> },
  { path: "/charts-apex-range-area", component: <RangeArea /> },
  { path: "/charts-apex-funnel", component: <FunnelChart /> },
  { path: "/charts-apex-candlestick", component: <CandlestickChart /> },
  { path: "/charts-apex-boxplot", component: <BoxplotCharts /> },
  { path: "/charts-apex-bubble", component: <BubbleChart /> },
  { path: "/charts-apex-scatter", component: <ScatterCharts /> },
  { path: "/charts-apex-heatmap", component: <HeatmapCharts /> },
  { path: "/charts-apex-treemap", component: <TreemapCharts /> },
  { path: "/charts-apex-pie", component: <PieCharts /> },
  { path: "/charts-apex-radialbar", component: <RadialbarCharts /> },
  { path: "/charts-apex-radar", component: <RadarCharts /> },
  { path: "/charts-apex-polar", component: <PolarCharts /> },
  { path: "/charts-apex-slope", component: <SlopeCharts /> },

  { path: "/charts-chartjs", component: <ChartsJs /> },
  { path: "/charts-echarts", component: <Echarts /> },

  // Base Ui
  { path: "/ui-alerts", component: <UiAlerts /> },
  { path: "/ui-badges", component: <UiBadges /> },
  { path: "/ui-buttons", component: <UiButtons /> },
  { path: "/ui-colors", component: <UiColors /> },
  { path: "/ui-cards", component: <UiCards /> },
  { path: "/ui-carousel", component: <UiCarousel /> },
  { path: "/ui-dropdowns", component: <UiDropdowns /> },
  { path: "/ui-grid", component: <UiGrid /> },
  { path: "/ui-images", component: <UiImages /> },
  { path: "/ui-tabs", component: <UiTabs /> },
  { path: "/ui-accordions", component: <UiAccordions /> },
  { path: "/ui-modals", component: <UiModals /> }, //
  { path: "/ui-offcanvas", component: <UiOffcanvas /> },
  { path: "/ui-placeholders", component: <UiPlaceholders /> },
  { path: "/ui-progress", component: <UiProgress /> },
  { path: "/ui-notifications", component: <UiNotifications /> },
  { path: "/ui-media", component: <UiMediaobject /> },
  { path: "/ui-embed-video", component: <UiEmbedVideo /> },
  { path: "/ui-typography", component: <UiTypography /> },
  { path: "/ui-lists", component: <UiList /> },
  { path: "/ui-links", component: <UiLink /> },
  { path: "/ui-general", component: <UiGeneral /> },
  { path: "/ui-ribbons", component: <UiRibbons /> },
  { path: "/ui-utilities", component: <UiUtilities /> },

  // Advance Ui
  { path: "/advance-ui-nestable", component: <UiNestableList /> },
  { path: "/advance-ui-scrollbar", component: <UiScrollbar /> },
  { path: "/advance-ui-animation", component: <UiAnimation /> },
  { path: "/advance-ui-swiper", component: <UiSwiperSlider /> },
  { path: "/advance-ui-ratings", component: <UiRatings /> },
  { path: "/advance-ui-highlight", component: <UiHighlight /> },

  // Widgets
  { path: "/widgets", component: <Widgets /> },

  // Forms
  { path: "/forms-elements", component: <BasicElements /> },
  { path: "/forms-select", component: <FormSelect /> },
  { path: "/forms-editors", component: <FormEditor /> },
  { path: "/forms-checkboxes-radios", component: <CheckBoxAndRadio /> },
  { path: "/forms-masks", component: <Masks /> },
  { path: "/forms-file-uploads", component: <FileUpload /> },
  { path: "/forms-pickers", component: <FormPickers /> },
  { path: "/forms-range-sliders", component: <FormRangeSlider /> },
  { path: "/forms-layouts", component: <Formlayouts /> },
  { path: "/forms-validation", component: <FormValidation /> },
  { path: "/forms-wizard", component: <FormWizard /> },
  { path: "/forms-advanced", component: <FormAdvanced /> },
  { path: "/forms-select2", component: <Select2 /> },

  //Tables
  { path: "/tables-basic", component: <BasicTables /> },
  { path: "/tables-listjs", component: <ListTables /> },
  { path: "/tables-react", component: <ReactTable /> },

  //Icons
  { path: "/icons-remix", component: <RemixIcons /> },
  { path: "/icons-boxicons", component: <BoxIcons /> },
  { path: "/icons-materialdesign", component: <MaterialDesign /> },
  { path: "/icons-feather", component: <FeatherIcons /> },
  { path: "/icons-lineawesome", component: <LineAwesomeIcons /> },
  { path: "/icons-crypto", component: <CryptoIcons /> },
  //Maps
  { path: "/maps-google", component: <GoogleMaps /> },

  //Pages
  { path: "/pages-starter", component: <Starter /> },
  {
    path: "/:entreprise/profil",
    component: (
      <RouteWrapper>
        <SimplePage />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/entreprise",
    component: (
      <RouteWrapper>
        <SimplePageCopie />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/modifier_entreprise",
    component: (
      <RouteWrapper>
        <ModifierEntreprise />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/preference",
    component: (
      <RouteWrapper>
        <Preference />
      </RouteWrapper>
    ),
  },
  { path: "/pages-timeline", component: <Timeline /> },
  { path: "/pages-faqs", component: <Faqs /> },
  { path: "/pages-gallery", component: <Gallery /> },
  { path: "/pages-pricing", component: <Pricing /> },
  { path: "/pages-sitemap", component: <SiteMap /> },
  { path: "/pages-search-results", component: <SearchResults /> },
  { path: "/pages-privacy-policy", component: <PrivecyPolicy /> },
  { path: "/pages-terms-condition", component: <TermsCondition /> },
  { path: "/pages-blog-list", component: <BlogListView /> },
  { path: "/pages-blog-grid", component: <BlogGridView /> },
  { path: "/pages-blog-overview", component: <PageBlogOverview /> },

  //Job pages
  { path: "/apps-job-statistics", component: <Statistics /> },
  { path: "/apps-job-lists", component: <JobList /> },
  { path: "/apps-job-grid-lists", component: <JobGrid /> },
  { path: "/apps-job-details", component: <JobOverview /> },
  { path: "/apps-job-candidate-lists", component: <CandidateList /> },
  { path: "/apps-job-candidate-grid", component: <CandidateGrid /> },
  { path: "/apps-job-application", component: <Application /> },
  { path: "/apps-job-new", component: <NewJobs /> },
  { path: "/apps-job-companies-lists", component: <CompaniesList /> },
  { path: "/apps-job-categories", component: <JobCategories /> },

  //User Profile
  {
    path: "/:entreprise/profile",
    component: (
      <RouteWrapper>
        <UserProfile />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/preference",
    component: (
      <RouteWrapper>
        <Preference />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/notification",
    component: (
      <RouteWrapper>
        <Notification />
      </RouteWrapper>
    ),
  },
  {
    path: "/",
    exact: true,
    component: (
      <RouteWrapper>
        <Navigate to="/:entreprise/dashboard" />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/recrutements",
    component: (
      <RouteWrapper>
        <Recrutements />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/paie-et-avances",
    component: (
      <RouteWrapper>
        <PaieEtAvances />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/presence-et-absence",
    component: (
      <RouteWrapper>
        <PresenceEtAbsence />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/offre-add",
    component: (
      <RouteWrapper>
        <OffreAdd />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/offre-details/:id",
    component: (
      <RouteWrapper>
        <DetailsOffre />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/candidature-details/:id",
    component: (
      <RouteWrapper>
        <DetailsCandidature />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/edit-profile",
    component: (
      <RouteWrapper>
        <EditProfile />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/avance-et-pret",
    component: (
      <RouteWrapper>
        <AvanceEtPret />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/avance-et-pret-form",
    component: (
      <RouteWrapper>
        <AvanceEtPretForm />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/avance-et-pret-add",
    component: (
      <RouteWrapper>
        <AvanceEtPretAdd />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/avance-et-pret-edit/:id",
    component: (
      <RouteWrapper>
        <AvanceEtPretEdit />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/conge-et-absence",
    component: (
      <RouteWrapper>
        <CongeEtAbsence />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/conge-et-absence-form",
    component: (
      <RouteWrapper>
        <CongeEtAbsenceForm />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/conge-et-absence-add",
    component: (
      <RouteWrapper>
        <CongeEtAbsenceAdd />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/conge-et-absence-edit/:id",
    component: (
      <RouteWrapper>
        <CongeEtAbsenceEdit />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/evaluation",
    component: (
      <RouteWrapper>
        <Evaluation />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/evaluation-form",
    component: (
      <RouteWrapper>
        <EvaluationForm />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/evaluation-add",
    component: (
      <RouteWrapper>
        <EvaluationAdd />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/evaluation-edit/:id",
    component: (
      <RouteWrapper>
        <EvaluationEdit />
      </RouteWrapper>
    ),
  },

  { path: "*", component: <Navigate to="/:entreprise/dashboard" /> },

  //Compta
  {
    path: "/:entreprise/journaux",
    component: (
      <RouteWrapper>
        <Journaux />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/operations",
    component: (
      <RouteWrapper>
        <Operation />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/immobilisations",
    component: (
      <RouteWrapper>
        <Immobilisations />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/balance",
    component: (
      <RouteWrapper>
        <Balance />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/etats",
    component: (
      <RouteWrapper>
        <Etats />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/plan",
    component: (
      <RouteWrapper>
        <PlanComptable />
      </RouteWrapper>
    ),
  },
  {
    path: "/:entreprise/livre",
    component: (
      <RouteWrapper>
        <GrandLivre />
      </RouteWrapper>
    ),
  },
];

const publicRoutes = [
  { path: "/unauthorized", component: <Unauthorized /> },
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/fr/connexion", component: <Login /> },
  { path: "/en/connexion", component: <Login /> },
  { path: "/:lang/connexion", component: <Login /> },
  { path: "/:lang/motpasseoublie", component: <ForgetPasswordPage /> },
  { path: "/password-reset-confirm/:token", component: <ChangePassword /> },
  { path: "/register", component: <Register /> },

  //AuthenticationInner pages
  { path: "/auth-signin-basic", component: <BasicSignIn /> },
  { path: "/auth-signin-cover", component: <CoverSignIn /> },
  { path: "/auth-signup-basic", component: <BasicSignUp /> },
  { path: "/auth-signup-cover", component: <CoverSignUp /> },
  { path: "/auth-pass-reset-basic", component: <BasicPasswReset /> },
  { path: "/auth-pass-reset-cover", component: <CoverPasswReset /> },
  { path: "/auth-lockscreen-basic", component: <BasicLockScreen /> },
  { path: "/auth-lockscreen-cover", component: <CoverLockScreen /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  { path: "/auth-logout-cover", component: <CoverLogout /> },
  { path: "/auth-success-msg-basic", component: <BasicSuccessMsg /> },
  { path: "/auth-success-msg-cover", component: <CoverSuccessMsg /> },
  { path: "/auth-twostep-basic", component: <BasicTwosVerify /> },
  { path: "/auth-twostep-cover", component: <CoverTwosVerify /> },
  { path: "/auth-404-basic", component: <Basic404 /> },
  { path: "/auth-404-cover", component: <Cover404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> },
  { path: "/pages-maintenance", component: <Maintenance /> },
  { path: "/pages-coming-soon", component: <ComingSoon /> },

  { path: "/landing", component: <OnePage /> },
  { path: "/nft-landing", component: <NFTLanding /> },
  { path: "/job-landing", component: <JobLanding /> },

  { path: "/auth-pass-change-basic", component: <BasicPasswCreate /> },
  { path: "/auth-pass-change-cover", component: <CoverPasswCreate /> },
  { path: "/auth-offline", component: <Offlinepage /> },
];

export { authProtectedRoutes, publicRoutes };
