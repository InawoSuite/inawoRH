// import React, { useState, useEffect, useCallback } from "react";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
// import { Collapse } from "reactstrap";
// import navdata from "../LayoutMenuData";
// import { withTranslation } from "react-i18next";
// import withRouter from "../../Components/Common/withRouter";
// import { useSelector } from "react-redux";
// import { createSelector } from "reselect";
// import logoDark from "../../assets/images/iCone (01) Inawo.png";
// import logoLight from "../../assets/images/iCone (02) Inawo.png";
// import inawoLight from "../../assets/images/logo (01) Inawo 2025-01.png";
// import inawoDark from "../../assets/images/logo (01) Inawo 2025-02.png";
// import { getAuthData } from "../../utils/authUtils";
// import ProfileDropdown from "../../Components/Common/ProfileDropdown";
// import  getMenuItems  from '../LayoutMenuData';

// const VerticalLayout = (props) => {
//   // const navData = navdata().props.children;
//     const menuItems = getMenuItems(t, activeMenu, setActiveMenu, navigate, setActiveTab);
//   const path = props.router.location.pathname;
//   const [theme, setTheme] = useState(
//     document.documentElement.getAttribute("data-bs-theme") || "light"
//   );
//   const [activeMenu, setActiveMenu] = useState("");
//   const [activeMenuIcon, setActiveMenuIcon] = useState("");
//   const [openMenu, setOpenMenu] = useState(null);
//   const [openSubMenu, setOpenSubMenu] = useState(null);

//   const selectLayoutState = (state) => state.Layout;
//   const selectLayoutProperties = createSelector(
//     selectLayoutState,
//     (layout) => ({
//       leftsidbarSizeType: layout.leftsidbarSizeType,
//       sidebarVisibilitytype: layout.sidebarVisibilitytype,
//       layoutType: layout.layoutType,
//     })
//   );

//   const { leftsidbarSizeType, sidebarVisibilitytype, layoutType } = useSelector(
//     selectLayoutProperties
//   );

//   // Fonction pour activer le dropdown parent
//   function activateParentDropdown(item) {
//     item.classList.add("active");
//     let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

//     if (parentCollapseDiv) {
//       parentCollapseDiv.classList.add("show");
//       parentCollapseDiv.parentElement.children[0].classList.add("active");
//       parentCollapseDiv.parentElement.children[0].setAttribute(
//         "aria-expanded",
//         "true"
//       );
//       if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
//         parentCollapseDiv.parentElement
//           .closest(".collapse")
//           .classList.add("show");
//         if (
//           parentCollapseDiv.parentElement.closest(".collapse")
//             .previousElementSibling
//         )
//           parentCollapseDiv.parentElement
//             .closest(".collapse")
//             .previousElementSibling.classList.add("active");
//         if (
//           parentCollapseDiv.parentElement
//             .closest(".collapse")
//             .previousElementSibling.closest(".collapse")
//         ) {
//           parentCollapseDiv.parentElement
//             .closest(".collapse")
//             .previousElementSibling.closest(".collapse")
//             .classList.add("show");
//           parentCollapseDiv.parentElement
//             .closest(".collapse")
//             .previousElementSibling.closest(".collapse")
//             .previousElementSibling.classList.add("active");
//         }
//       }
//       return false;
//     }
//     return false;
//   }

//   // Fonction pour supprimer l'activation des items
//   const removeActivation = (items) => {
//     let actiItems = items.filter((x) => x.classList.contains("active"));

//     actiItems.forEach((item) => {
//       if (item.classList.contains("menu-link")) {
//         if (!item.classList.contains("active")) {
//           item.setAttribute("aria-expanded", false);
//         }
//         if (item.nextElementSibling) {
//           item.nextElementSibling.classList.remove("show");
//         }
//       }
//       if (item.classList.contains("nav-link")) {
//         if (item.nextElementSibling) {
//           item.nextElementSibling.classList.remove("show");
//         }
//         item.setAttribute("aria-expanded", false);
//       }
//       item.classList.remove("active");
//     });
//   };

//   // Fonction pour trouver un sous-item par son lien
//   function findSubItemByLink(linkText) {
//     if (!navData) return null;

//     for (const item of navData) {
//       if (item.subItems) {
//         for (const subItem of item.subItems) {
//           if (subItem.link === linkText) {
//             return item;
//           }
//         }
//       }
//     }
//     return null;
//   }

//   // Fonction pour redimensionner la sidebar
//   const resizeSidebarMenu = useCallback(() => {
//     var windowSize = document.documentElement.clientWidth;
//     if (windowSize >= 1025) {
//       if (document.documentElement.getAttribute("data-layout") === "vertical") {
//         document.documentElement.setAttribute(
//           "data-sidebar-size",
//           leftsidbarSizeType
//         );
//       }
//       if (document.documentElement.getAttribute("data-layout") === "semibox") {
//         document.documentElement.setAttribute(
//           "data-sidebar-size",
//           leftsidbarSizeType
//         );
//       }
//       if (
//         (sidebarVisibilitytype === "show" ||
//           layoutType === "vertical" ||
//           layoutType === "twocolumn") &&
//         document.querySelector(".hamburger-icon")
//       ) {
//         var hamburgerIcon = document.querySelector(".hamburger-icon");
//         if (hamburgerIcon !== null) {
//           hamburgerIcon.classList.remove("open");
//         }
//       } else {
//         var hamburgerIcon = document.querySelector(".hamburger-icon");
//         if (hamburgerIcon !== null) {
//           hamburgerIcon.classList.add("open");
//         }
//       }
//     } else if (windowSize < 1025 && windowSize > 767) {
//       document.body.classList.remove("twocolumn-panel");
//       if (document.documentElement.getAttribute("data-layout") === "vertical") {
//         document.documentElement.setAttribute("data-sidebar-size", "sm");
//       }
//       if (document.documentElement.getAttribute("data-layout") === "semibox") {
//         document.documentElement.setAttribute("data-sidebar-size", "sm");
//       }
//       if (document.querySelector(".hamburger-icon")) {
//         document.querySelector(".hamburger-icon").classList.add("open");
//       }
//     } else if (windowSize <= 767) {
//       document.body.classList.remove("vertical-sidebar-enable");
//       if (
//         document.documentElement.getAttribute("data-layout") !== "horizontal"
//       ) {
//         document.documentElement.setAttribute("data-sidebar-size", "lg");
//       }
//       if (document.querySelector(".hamburger-icon")) {
//         document.querySelector(".hamburger-icon").classList.add("open");
//       }
//     }
//   }, [leftsidbarSizeType, sidebarVisibilitytype, layoutType]);

//   // Fonction d'initialisation du menu
//   const initMenu = useCallback(() => {
//     const pathName = process.env.PUBLIC_URL + path;
//     const ul = document.getElementById("navbar-nav");
//     const items = ul.getElementsByTagName("a");
//     let itemsArray = [...items];
//     removeActivation(itemsArray);

//     let matchingMenuItem = itemsArray.find((x) => {
//       return x.pathname === pathName;
//     });

//     const foundSubItem = findSubItemByLink(pathName);
//     if (foundSubItem) {
//       setActiveMenu(foundSubItem.label);
//       setActiveMenuIcon(foundSubItem.icon);
//       foundSubItem.click({ preventDefault: () => {} });
//     }

//     if (matchingMenuItem) {
//       activateParentDropdown(matchingMenuItem);
//     }
//   }, [path, removeActivation, findSubItemByLink]);

//   // Effet pour observer les changements de thème
//   useEffect(() => {
//     const observer = new MutationObserver((mutations) => {
//       mutations.forEach((mutation) => {
//         if (mutation.attributeName === "data-bs-theme") {
//           setTheme(document.documentElement.getAttribute("data-bs-theme"));
//         }
//       });
//     });

//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["data-bs-theme"],
//     });

//     return () => observer.disconnect();
//   }, []);

//   // Effet pour le redimensionnement
//   useEffect(() => {
//     window.addEventListener("resize", resizeSidebarMenu, true);
//     return () => {
//       window.removeEventListener("resize", resizeSidebarMenu, true);
//     };
//   }, [resizeSidebarMenu]);

//   // Effet pour initialiser le menu
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     if (props.layoutType === "vertical") {
//       initMenu();
//     }
//   }, [path, props.layoutType, initMenu]);

//   return (
//     <div
//       style={{
//         borderRight: "1px solid rgba(0, 0, 0, 0.05)",
//         position: "relative",
//         zIndex: 10,
//         height: "100vh",
//         // Ombre en bas pour séparer du footer
//         // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//       }}
//     >
//       <React.Fragment>
//         {/* En-tête du menu - Logo et nom du système côte à côte */}
//         <div
//           style={{
//             display: "flex",
//             // alignItems: "center",
//             justifyContent: "flex-start",
//             padding: "7px 0px 10px 10px",
//             gap: "10px",
//             background: "transparent",
//           }}
//         >
//           {/* Logo à gauche */}
//           <Link
//             to="#"
//             className="logo"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               minWidth: "35px",
//               background: "white",
//             }}
//           >
//             <img
//               src={theme === "dark" ? inawoDark : inawoLight}
//               alt="Nom Inawo"
//               style={{
//                 height: "30px",
//                 maxWidth: "80%",
//                 objectFit: "contain",
//                 transition: "all 0.3s ease",
//               }}
//             />
//           </Link>
//         </div>
//         {/* ProfileDropdown modifié pour occuper toute la largeur */}
//         {/* <div
//           style={{
//             width: "100%",
//             padding: "0 10px",
//             marginBottom: "10px",
//             borderRadius:"20px",
//           }}
//         >
//           <ProfileDropdown />
//         </div> */}
//         {/* Items du menu */}
//         <ul
//           className="navbar-nav"
//           id="navbar-nav"
//           style={{
//             listStyle: "none",
//             paddingLeft: 0,
//             paddingRight: 0,
//             margin: 0,
//             width: "100%",
//           }}
//         >
//           {(navData || []).map((item, key) => {
//             return (
//               <React.Fragment key={key}>
//                 {item["isHeader"] ? null : item.subItems ? ( // Suppression complète de l'affichage des menu-title
//                   <li
//                     className="nav-item"
//                     style={{
//                       listStyle: "none",
//                       listStyleType: "none",
//                       paddingLeft: "30px",
//                       margin: 0,
//                       // WebkitPaddingStart: 0,
//                     }}
//                   >
//                     <Link
//                       onClick={(e) => {
//                         e.preventDefault();
//                         setOpenMenu(openMenu === key ? null : key);
//                       }}
//                       className={`nav-link menu-link${
//                         openMenu === key ? " active-custom" : ""
//                       }`}
//                       to={item.link ? item.link : "/#"}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         padding: "10px 0 10px 25px", // padding gauche plus important
//                         margin: "2px 0",
//                         background:
//                           openMenu === key ? "#014a92" : "transparent",
//                         color: openMenu === key ? "#fff" : "#475569",
//                         fontWeight: openMenu === key ? 600 : 400,
//                         boxShadow:
//                           openMenu === key ? "0 0 0 0 #014a92" : "none",
//                         transition: "background 0.2s, color 0.2s",
//                       }}
//                     >
//                       <i
//                         className={item.icon}
//                         style={{
//                           color: openMenu === key ? "#fff" : "#475569",
//                           fontSize: "17px",
//                           marginRight: "5px",
//                           minWidth: "18px",
//                           textAlign: "center",
//                         }}
//                       ></i>
//                       <span style={{ whiteSpace: "nowrap" }}>
//                         {props.t(item.label)}
//                       </span>
//                       {item.badgeName ? (
//                         <span
//                           className={"badge badge-pill bg-" + item.badgeColor}
//                           data-key="t-new"
//                         >
//                           {item.badgeName}
//                         </span>
//                       ) : null}
//                     </Link>
//                     <Collapse
//                       className="menu-dropdown"
//                       isOpen={openMenu === key}
//                       id={`sidebarApps-${key}`}
//                     >
//                       <ul
//                         className="nav nav-sm flex-column test"
//                         style={{
//                           listStyle: "none",
//                           // Décalage vers la droite (intérieur) pour les sous-menus
//                           paddingLeft: "30px",
//                           margin: "0",
//                         }}
//                       >
//                         {item.subItems &&
//                           (item.subItems || []).map((subItem, key) => (
//                             <React.Fragment key={key}>
//                               {!subItem.isChildItem ? (
//                                 <li
//                                   className="nav-item"
//                                   style={{ listStyleType: "none" }}
//                                 >
//                                   <Link
//                                     to={subItem.link ? subItem.link : "/#"}
//                                     className="nav-link"
//                                     style={{
//                                       // Style pour les sous-menus - décalage vers la droite
//                                       fontSize: "14px",
//                                       opacity: "0.9",
//                                       paddingLeft: "30px", // Décalage supplémentaire vers la droite
//                                       paddingTop: "4px", // Réduit de 10px à 4px
//                                       paddingBottom: "4px", // Réduit de 10px à 4px
//                                       margin: "0", // Changé de "2px 0" à "0"
//                                     }}
//                                   >
//                                     <div
//                                       style={{
//                                         display: "flex",
//                                         alignItems: "center",
//                                       }}
//                                     >
//                                       <i
//                                         className={subItem.icon}
//                                         style={{
//                                           fontSize: "14px",
//                                           // marginRight: "8px",
//                                         }}
//                                       ></i>
//                                       {props.t(subItem.label)}
//                                     </div>
//                                     {subItem.badgeName ? (
//                                       <span
//                                         className={
//                                           "badge badge-pill bg-" +
//                                           subItem.badgeColor
//                                         }
//                                         data-key="t-new"
//                                       >
//                                         {subItem.badgeName}
//                                       </span>
//                                     ) : null}
//                                   </Link>
//                                 </li>
//                               ) : (
//                                 <li
//                                   className="nav-item"
//                                   style={{ listStyleType: "none" }}
//                                 >
//                                   <Link
//                                     onClick={subItem.click}
//                                     className="nav-link"
//                                     to="/#"
//                                     style={{
//                                       fontSize: "14px",
//                                       opacity: "0.9",
//                                       paddingLeft: "30px", // Décalage vers la droite
//                                       paddingTop: "4px", // Réduit de 10px à 4px
//                                       paddingBottom: "4px", // Réduit de 10px à 4px
//                                       margin: "0", // Changé de "2px 0" à "0"
//                                     }}
//                                   >
//                                     <div
//                                       style={{
//                                         display: "flex",
//                                         alignItems: "center",
//                                       }}
//                                     >
//                                       <i
//                                         className={subItem.icon}
//                                         style={{
//                                           fontSize: "14px",
//                                           // marginRight: "8px",
//                                         }}
//                                       ></i>
//                                       {props.t(subItem.label)}
//                                     </div>
//                                     {subItem.badgeName ? (
//                                       <span
//                                         className={
//                                           "badge badge-pill bg-" +
//                                           subItem.badgeColor
//                                         }
//                                         data-key="t-new"
//                                       >
//                                         {subItem.badgeName}
//                                       </span>
//                                     ) : null}
//                                   </Link>
//                                   <Collapse
//                                     className="menu-dropdown"
//                                     isOpen={subItem.stateVariables}
//                                     id="sidebarEcommerce"
//                                   >
//                                     <ul
//                                       className="nav nav-sm flex-column"
//                                       style={{ paddingLeft: "30px" }}
//                                     >
//                                       {subItem.childItems &&
//                                         (subItem.childItems || []).map(
//                                           (childItem, key) => (
//                                             <React.Fragment key={key}>
//                                               {!childItem.childItems ? (
//                                                 <li className="nav-item">
//                                                   <Link
//                                                     to={
//                                                       childItem.link
//                                                         ? childItem.link
//                                                         : "/#"
//                                                     }
//                                                     className="nav-link"
//                                                   >
//                                                     <div
//                                                       style={{
//                                                         display: "flex",
//                                                         alignItems: "center",
//                                                       }}
//                                                     >
//                                                       <i
//                                                         className={subItem.icon}
//                                                         style={{}}
//                                                       ></i>
//                                                       {props.t(childItem.label)}
//                                                     </div>
//                                                   </Link>
//                                                 </li>
//                                               ) : (
//                                                 <li className="nav-item">
//                                                   <Link
//                                                     to="/#"
//                                                     className="nav-link"
//                                                     onClick={childItem.click}
//                                                   >
//                                                     {props.t(childItem.label)}
//                                                   </Link>
//                                                   <Collapse
//                                                     className="menu-dropdown"
//                                                     isOpen={
//                                                       childItem.stateVariables
//                                                     }
//                                                     id="sidebaremailTemplates"
//                                                   >
//                                                     <ul
//                                                       className="nav nav-sm flex-column"
//                                                       style={{
//                                                         paddingLeft: "30px",
//                                                       }}
//                                                     >
//                                                       {childItem.childItems.map(
//                                                         (subChildItem, key) => (
//                                                           <li
//                                                             className="nav-item"
//                                                             key={key}
//                                                           >
//                                                             <Link
//                                                               to={
//                                                                 subChildItem.link
//                                                               }
//                                                               className="nav-link"
//                                                               data-key="t-basic-action"
//                                                             >
//                                                               {props.t(
//                                                                 subChildItem.label
//                                                               )}{" "}
//                                                             </Link>
//                                                           </li>
//                                                         )
//                                                       )}
//                                                     </ul>
//                                                   </Collapse>
//                                                 </li>
//                                               )}
//                                             </React.Fragment>
//                                           )
//                                         )}
//                                     </ul>
//                                   </Collapse>
//                                 </li>
//                               )}
//                             </React.Fragment>
//                           ))}
//                       </ul>
//                     </Collapse>
//                   </li>
//                 ) : (
//                   <li className="nav-item">
//                     <Link
//                       onClick={(e) => {
//                         e.preventDefault();
//                         setOpenMenu(openMenu === key ? null : key);
//                       }}
//                       className={`nav-link menu-link${
//                         openMenu === key ? " active-custom" : ""
//                       }`}
//                       to={item.link ? item.link : "/#"}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         padding: "10px 0 10px 16px", // padding gauche plus important
//                         margin: "2px 0",
//                         background:
//                           openMenu === key ? "#014a92" : "transparent",
//                         color: openMenu === key ? "#fff" : "#475569",
//                         fontWeight: openMenu === key ? 600 : 400,
//                         boxShadow:
//                           openMenu === key ? "0 0 0 0 #014a92" : "none",
//                         transition: "background 0.2s, color 0.2s",
//                       }}
//                     >
//                       <i
//                         className={item.icon}
//                         style={{
//                           color: openMenu === key ? "#fff" : "#475569",
//                           fontSize: "17px",
//                           marginRight: "5px",
//                           minWidth: "18px",
//                           textAlign: "center",
//                         }}
//                       ></i>
//                       <span style={{ whiteSpace: "nowrap" }}>
//                         {props.t(item.label)}
//                       </span>
//                       {item.badgeName ? (
//                         <span
//                           className={"badge badge-pill bg-" + item.badgeColor}
//                           data-key="t-new"
//                         >
//                           {item.badgeName}
//                         </span>
//                       ) : null}
//                     </Link>
//                   </li>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </ul>
//       </React.Fragment>
//     </div>
//   );
// };

// VerticalLayout.propTypes = {
//   location: PropTypes.object,
//   t: PropTypes.any,
// };

// export default withRouter(withTranslation()(VerticalLayout));