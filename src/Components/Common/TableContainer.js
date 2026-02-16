import React, { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Table,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import { rankItem } from "@tanstack/match-sorter-utils";
import { getRelativeDateLabel } from '../../utils/dateFilters';

// Fonction utilitaire pour détecter le champ de date
const detectDateField = (data) => {
  if (!data || data.length === 0) return "created_at";

  const firstItem = data[0];

  // Priorité des champs de date
  const dateFields = [
    "created_at", // Priorité 1
    "date_commande", // ← AJOUTEZ CECI
    "create_at", // Priorité 3 (pour entrées/sorties)
    "date_creation", // Priorité 4
    "date", // Priorité 5
    "createdAt",
    "date_echeance", // ← ET CECI
    "update_at", // Priorité 7
  ];

  // Trouver le premier champ de date qui existe dans les données
  const foundField = dateFields.find((field) => firstItem[field] !== undefined);

  // Si rien trouvé, chercher dans raw
  if (!foundField && firstItem.raw) {
    const foundInRaw = dateFields.find((field) => firstItem.raw[field] !== undefined);
    if (foundInRaw) {
      console.log("🔍 Champ de date trouvé dans raw:", foundInRaw);
      return foundInRaw;
    }
  }

  console.log(
    "🔍 Champ de date détecté:",
    foundField,
    "dans les données:",
    firstItem
  );
  return foundField || "created_at";
};

// Fonction utilitaire pour formater les dates de regroupement basée sur created_at
const formatGroupDate = (dateString) => {
  return getRelativeDateLabel(dateString);
};


// Fonction pour grouper les données par période avec détection automatique
// Fonction améliorée pour grouper les données
const groupDataByDate = (data, dateField = "auto") => {
  const actualDateField =
    dateField === "auto" ? detectDateField(data) : dateField;

  console.log("📅 Regroupement avec le champ:", actualDateField);

  const grouped = {};

  data.forEach((item) => {
    const dateValue = item[actualDateField];

    if (!dateValue) {
      console.warn(
        "❌ Champ de date manquant:",
        actualDateField,
        "dans l'item:",
        item
      );
      return;
    }

    const groupKey = formatGroupDate(dateValue);
    if (!grouped[groupKey]) {
      grouped[groupKey] = [];
    }
    grouped[groupKey].push(item);
  });

  // Trier les groupes par ordre chronologique avec TOUTES les possibilités
  const sortedGroups = {};
  
  // Ordre de priorité des groupes
  const groupPriority = [
    "À l'instant",
    // Minutes (dynamiques)
    ...Array.from({ length: 59 }, (_, i) => `Il y a ${i + 1} min`),
    // Heures (dynamiques)
    ...Array.from({ length: 23 }, (_, i) => `Il y a ${i + 1} heure${i > 0 ? 's' : ''}`),
    "Aujourd'hui",
    "Hier",
    // Jours (2-7)
    ...Array.from({ length: 6 }, (_, i) => `Il y a ${i + 2} jours`),
    // Semaines (1-4)
    ...Array.from({ length: 4 }, (_, i) => `Il y a ${i + 1} semaine${i > 0 ? 's' : ''}`),
    // Mois
    ...Array.from({ length: 12 }, (_, i) => `Il y a ${i + 1} mois`)
  ];

  // Ajouter les groupes dans l'ordre de priorité
  groupPriority.forEach((group) => {
    if (grouped[group]) {
      sortedGroups[group] = grouped[group];
    }
  });

  // Ajouter les groupes restants non prévus
  Object.keys(grouped).forEach((group) => {
    if (!sortedGroups[group]) {
      sortedGroups[group] = grouped[group];
    }
  });

  return sortedGroups;
};

// Column Filter
const Filter = ({ column }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={columnFilterValue ?? ""}
        onChange={(event) =>
          column.setFilterValue(
            event && event.target ? event.target.value : event
          )
        }
        placeholder="Search..."
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
};

// Global Filter
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (typeof onChange === "function") {
        onChange(value);
      }
    }, debounce);
    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <input
      {...props}
      value={value}
      id="search-bar-0"
      className="form-control search"
      onChange={(e) => {
        if (e && e.target && typeof e.target.value !== "undefined") {
          setValue(e.target.value);
        } else if (typeof e === "string") {
          setValue(e);
        }
      }}
    />
  );
};

const TableContainer = ({
  columns,
  data,
  customPageSize,
  tableClass = "align-middle table-nowrap",
  theadClass = "text-muted",
  trClass,
  thClass,
  divClass = "table-responsive table-card mb-1",
  SearchPlaceholder,
  isGlobalFilter,

  // Nouvelles props pour le regroupement par date
  groupByDate = false,
  dateField = "auto", // ← Changé à 'auto' pour détection automatique
  showGroupHeaders = true,

  // Props pour la Card
  cardStyle = { borderRadius: "20px" },
  cardBodyClass = "",
  cardBodyStyle = {},
  showCard = true,

  // Props pour les NavItems
  showNavTabs = false,
  navTabs = [],
  activeTab = "1",
  onTabChange,
  navTabsClass = "nav-tabs nav-tabs-custom nav-success py-4 mb-0",
  navContainerStyle = {},
  
  //  NOUVEAU : Props pour le filtrage par date
  showDateFilter = false,
  dateFilterField = "created_at",
  dateFilterPosition = "top",
  customDateFilters = null,
  showDateCounts = true,
  onDateFilterChange,
  
  // Props pour le style intégré
  containerStyle = {},

  children,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  const table = useReactTable({
    columns,
    data,
    filterFns: { fuzzy: fuzzyFilter },
    state: { columnFilters, globalFilter },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    getPageOptions,
    setPageIndex,
    nextPage,
    previousPage,
    setPageSize,
    getState,
  } = table;

  useEffect(() => {
    if (customPageSize) setPageSize(customPageSize);
  }, [customPageSize, setPageSize]);

  // Grouper les données si groupByDate est activé
  const groupedData = groupByDate ? groupDataByDate(data, dateField) : null;
  const groupKeys = groupedData ? Object.keys(groupedData) : [];

  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (tabKey, tabData) => {
    if (onTabChange) {
      onTabChange(tabKey, tabData);
    }
  };

  // Rendu des NavTabs
  const renderNavTabs = () => {
    if (!showNavTabs || !navTabs?.length) return null;

    return (
      <div style={navContainerStyle}>
        <Nav className={navTabsClass} role="tablist">
          {navTabs.map((tab, index) => (
            <NavItem key={tab.key || index}>
              <NavLink
                className={classnames({
                  active: activeTab === tab.key,
                })}
                onClick={() => handleTabChange(tab.key, tab)}
                style={{ cursor: "pointer" }}
              >
                {tab.icon && (
                  <i className={`${tab.icon} me-1 align-bottom`}></i>
                )}
                {tab.label}
                {tab.count !== undefined && (
                  <span className="badge bg-secondary ms-1">{tab.count}</span>
                )}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>
    );
  };

  // Rendu du tableau normal
  const renderNormalTable = () => (
    <Table hover className={tableClass} style={{ marginBottom: 0 }}>
      <thead className={theadClass}>
        {getHeaderGroups().map((headerGroup) => (
          <tr className={trClass} key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className={thClass}
                {...{
                  onClick: header.column.getToggleSortingHandler(),
                }}
              >
                {header.isPlaceholder ? null : (
                  <React.Fragment>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " ",
                      desc: " ",
                    }[header.column.getIsSorted()] ?? null}
                    {header.column.getCanFilter() ? (
                      <div>
                        <Filter column={header.column} table={table} />
                      </div>
                    ) : null}
                  </React.Fragment>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );

// Rendu du tableau groupé SANS les séparateurs rouges
const renderGroupedTable = () => (
  <div>
    <Table hover className={tableClass} style={{ marginBottom: 0 }}>
      <thead className={theadClass}>
        {getHeaderGroups().map((headerGroup) => (
          <tr className={trClass} key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className={thClass}>
                {header.isPlaceholder ? null : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {groupKeys.map((groupKey) => (
          <React.Fragment key={groupKey}>
            {/* En-tête de groupe SANS bordure inférieure */}
            {showGroupHeaders && (
              <tr>
                <td 
                  colSpan={columns.length}
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderLeft: '4px solid #405189',
                    padding: '6px 8px',
                    fontSize: '0.70rem',
                    fontWeight: '200',
                    color: '#405189',
                    borderTop: '2px solid #dee2e6',
                    // SUPPRIMER la bordure inférieure qui crée la ligne rouge
                    borderBottom: 'none'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <i className="ri-time-line me-2"></i>
                    {groupKey}
                  </div>
                </td>
              </tr>
            )}
            
            {/* Données du groupe */}
            {groupedData[groupKey].map((rowData, rowIndex) => (
              <tr key={`${groupKey}-${rowIndex}`} className="group-data-row">
                {columns.map((column, colIndex) => {
                  const cellContext = {
                    row: {
                      original: rowData,
                      index: rowIndex
                    },
                    getValue: () => rowData[column.accessorKey]
                  };
                  
                  return (
                    <td key={column.accessorKey || colIndex}>
                      {column.cell ? 
                        column.cell(cellContext) : 
                        rowData[column.accessorKey]
                      }
                    </td>
                  );
                })}
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  </div>
);

  const TableContent = () => (
    <Fragment>
      {isGlobalFilter && (
        <Row className="mb-3">
          {/* Ici, vous pouvez ajouter le composant de filtre global si besoin */}
        </Row>
      )}

      <div className={divClass} style={{ marginTop: 0 }}>
        {groupByDate ? renderGroupedTable() : renderNormalTable()}
      </div>

      {/* Contenu supplémentaire (pagination, etc.) */}
      {children && <div className="mt-3">{children}</div>}
    </Fragment>
  );

  // Style pour le conteneur principal
  const mainContainerStyle = {
    borderRadius: "20px",
    overflow: "hidden",
    marginBottom: "1rem",
    ...containerStyle,
  };

  // Si pas de Card et pas de NavTabs, retourner le contenu simple
  if (!showCard && !showNavTabs) {
    return <TableContent />;
  }

  // Si NavTabs activés, créer un conteneur intégré
  if (showNavTabs) {
    return (
      <div className="card" style={mainContainerStyle}>
        {renderNavTabs()}
        <div
          style={{
            paddingTop: 0,
            paddingBottom: children ? "1rem" : "0",
            marginLeft: "1rem",
            marginRight: "1rem",
            ...cardBodyStyle,
          }}
        >
          <TableContent />
        </div>
      </div>
    );
  }

  // Retourner avec la Card wrapper classique
  return (
    <Card style={cardStyle}>
      <CardBody
        className={cardBodyClass}
        style={{
          paddingTop: 0,
          paddingBottom: children ? "1rem" : "0",
          ...cardBodyStyle,
        }}
      >
        <TableContent />
      </CardBody>
    </Card>
  );
};

export default TableContainer;
