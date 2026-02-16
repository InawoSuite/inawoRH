import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const allTabs = [
    { id: "1", icon: "ri-code-line", label: "Note 36 (Codes)" },
    { id: "2", icon: "ri-list-check-2", label: "Note 36 (Nomenclature)" },
    { id: "3", icon: "ri-user-fill", label: "Fiche R3" },
    { id: "4", icon: "ri-file-chart-line", label: "Bilan Complet" },
    { id: "5", icon: "ri-arrow-up-circle-line", label: "Actif" },
    { id: "6", icon: "ri-arrow-down-circle-line", label: "Passif" },
    { id: "7", icon: "ri-calculator-line", label: "Résultat" },
    { id: "8", icon: "ri-exchange-dollar-line", label: "TFT" },
    { id: "9", icon: "ri-building-4-line", label: "Fiche R4" },
    { id: "10", icon: "ri-bar-chart-line", label: "Note 1" },
    { id: "11", icon: "ri-line-chart-line", label: "Note 2" },
    { id: "12", icon: "ri-money-dollar-circle-line", label: "Note 3A" },
    // ... tous les autres onglets
  ];

  return (
    <div className="nav-tabs-horizontal-container" style={{ position: "relative", borderBottom: "1px solid #dee2e6" }}>
      <div className="nav-tabs-horizontal-scroll" style={{
        overflowX: "auto",
        overflowY: "hidden",
        whiteSpace: "nowrap",
        padding: "0 15px",
        WebkitOverflowScrolling: "touch",
      }}>
        <Nav tabs className="nav-tabs-custom" style={{
          display: "inline-flex",
          flexWrap: "nowrap",
          minWidth: "100%",
        }}>
          {allTabs.map((tab) => (
            <NavItem key={tab.id} style={{ display: "inline-block", float: "none" }}>
              <NavLink
                className={classnames({
                  active: activeTab === tab.id,
                  "text-success": activeTab === tab.id,
                })}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  cursor: "pointer",
                  color: activeTab === tab.id ? "#198754" : "#6c757d",
                  backgroundColor: activeTab === tab.id ? "rgba(25, 135, 84, 0.1)" : "transparent",
                  borderColor: activeTab === tab.id ? "#198754 transparent transparent" : "transparent",
                  padding: "0.75rem 1rem",
                  marginRight: "1px",
                  borderBottom: activeTab === tab.id ? "2px solid #198754" : "none",
                  display: "inline-flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                }}
              >
                <i className={`${tab.icon} me-1`}></i>
                {tab.label}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default NavigationTabs;