import React, { useEffect, useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { Link } from "react-router-dom";

const QuickAddDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-bs-theme") || "light"
  );
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const quickAddItems = [
    {
      id: "contact",
      label: "Contacts",
      icon: "ri-user-add-line",
      link: "/:enreprise/contact",
    },
    {
      id: "product",
      label: "Produits",
      icon: "ri-shopping-basket-line",
      link: "/:enreprise/produit",
    },
    {
      id: "service",
      label: "Services",
      icon: "ri-service-line",
      link: "/:enreprise/produit",
    },
    {
      id: "category",
      label: "Catégories",
      icon: "ri-folder-add-line",
      link: "/:enreprise/categories",
    },
    {
      id: "commercial",
      label: "Commerciaux",
      icon: "ri-user-star-line",
      link: "/:entreprise/commercial",
    },
    {
      id: "user",
      label: "Utilisateurs",
      icon: "ri-user-add-line",
      link: "/:entreprise/utilisateur",
    },
    {
      id: "expense",
      label: "Ventes",
      icon: "ri-bank-line",
      link: "/:entreprise/vente",
    },
    {
      id: "branch",
      label: "Succursales",
      icon: "ri-building-line",
      link: "/:entreprise/succursale",
    },
    {
      id: "store",
      label: "Magasins",
      icon: "ri-store-2-line",
      link: "/:entreprise/magasin",
    },
    {
      id: "invoice",
      label: "Factures",
      icon: "ri-bill-line",
      link: "/:entreprise/facture",
    },
    {
      id: "quote",
      label: "Devis",
      icon: "ri-file-list-3-line",
      link: "/:entreprise/devis",
    },
  ];
  useEffect(() => {
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
  }, []);
  return (
    <React.Fragment>
     <Dropdown 
  isOpen={isOpen} 
  toggle={toggle} 
  className="topbar-head-dropdown ms-1 header-item"
  style={{ lineHeight: 'normal' }} 
>
      <DropdownToggle 
  tag="button" 
  type="button" 
  className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
  style={{ fontSize: '24px' }} 
>
  <i className="ri-add-circle-fill"
    style={{ 
      color: theme === "light" ? "#014a92" : "#fff",
      fontSize: '1.5em' 
    }}
  ></i>
</DropdownToggle>
      <DropdownMenu className="dropdown-menu-lg dropdown-menu-start p-0">
  <div
    // className="p-0"
    // style={{
    //   display: "grid",
    //   gridTemplateColumns: "1fr 1fr",
    //   gap: "0px",
    // }}
  >
    {quickAddItems.map((item, key) => (
      <Link
        key={key}
        to={item.link}
        className="dropdown-item d-flex align-items-center gap-0"
        style={{
        
          display: "flex",
          alignItems: "center",
          fontSize: "11px",
          padding: "1%",
          textDecoration: "none", // Supprime le soulignement par défaut
        }}
        onClick={toggle} // Ferme le dropdown après clic
      >
        <i
          className={item.icon + " fs-4"}
          style={{
            color: theme === "light" ? "#000" : "#fff",
          }}
        ></i>
        <span style={{ color: theme === "light" ? "#000" : "#fff" }}>
          {item.label}
        </span>
      </Link>
    ))}
  </div>
</DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default QuickAddDropdown;
