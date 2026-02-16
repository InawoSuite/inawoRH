import React, { Fragment, useEffect, useState, useMemo } from "react";
import { Card, CardBody, Col, Row, Table, Nav, NavItem, NavLink, Button, ButtonGroup } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';

import { rankItem } from '@tanstack/match-sorter-utils';

// ✅ NOUVEAU : Composant pour la ligne de totaux
const TotalRow = ({ 
  data, 
  columns, 
  totalConfig = {},
  showTotal = true,
  className = "",
  style = {}
}) => {
  if (!showTotal || !data || !data.length) return null;

  const {
    totalLabel = "Total",
    totalLabelColumn = 0,
    columnsToSum = [], // Tableau des clés de colonnes à sommer
    formatValues = {}, // Ex: { 'montant': (val) => formatNumber(val) }
    textColor = "text-dark",
    fontWeight = "fw-bold",
    bgColor = "table-active",
    align = "end", // 'start', 'center', 'end'
  } = totalConfig;

  // Calculer les totaux pour chaque colonne
  const totals = useMemo(() => {
    const result = {};
    
    columnsToSum.forEach(colKey => {
      result[colKey] = data.reduce((sum, row) => {
        const value = row[colKey];
        return sum + (typeof value === 'number' ? value : 0);
      }, 0);
    });
    
    return result;
  }, [data, columnsToSum]);

  // Obtenir l'alignement CSS
  const getAlignmentClass = (align) => {
    switch (align) {
      case 'start': return 'text-start';
      case 'center': return 'text-center';
      case 'end': return 'text-end';
      default: return 'text-end';
    }
  };

  return (
    <tfoot>
      <tr className={`${bgColor} ${className}`} style={style}>
        {columns.map((column, index) => {
          const accessorKey = column.accessorKey || column.id;
          const isTotalLabelCol = index === totalLabelColumn;
          const shouldSum = columnsToSum.includes(accessorKey);
          
          return (
            <td 
              key={index} 
              className={`${getAlignmentClass(align)} ${textColor} ${fontWeight}`}
              style={{ padding: '12px 8px' }}
            >
              {isTotalLabelCol ? (
                <span className="d-flex align-items-center justify-content-start">
                  {/* <i className="ri-calculator-line me-2"></i> */}
                  {totalLabel}
                </span>
              ) : shouldSum ? (
                <span>
                  {formatValues[accessorKey] 
                    ? formatValues[accessorKey](totals[accessorKey])
                    : totals[accessorKey].toLocaleString('fr-FR')
                  }
                </span>
              ) : null}
            </td>
          );
        })}
      </tr>
    </tfoot>
  );
};

// Column Filter
const Filter = ({ column }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '')}
        onChange={event => column.setFilterValue(event && event.target ? event.target.value : event)}
        placeholder="Search..."
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
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
      if (typeof onChange === 'function') {
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
      onChange={e => {
        if (e && e.target && typeof e.target.value !== 'undefined') {
          setValue(e.target.value);
        } else if (typeof e === 'string') {
          setValue(e);
        }
      }}
    />
  );
};

// Composant de filtrage par date
const DateFilter = ({ 
  selectedFilter, 
  onFilterChange, 
  dateField = "created_at",
  customFilters = null,
  showCounts = true,
  data = [],
  buttonSize = "sm",
  buttonStyle = {}
}) => {
  // Filtres par défaut
  const defaultFilters = [
    {
      key: 'all',
      label: 'Tous',
      icon: 'ri-list-check',
      filter: () => true
    },
    {
      key: 'today',
      label: "Aujourd'hui",
      icon: 'ri-calendar-today-line',
      filter: (item) => isToday(new Date(item[dateField]))
    },
    {
      key: 'recent',
      label: 'Récent (7j)',
      icon: 'ri-time-line',
      filter: (item) => isLastNDays(new Date(item[dateField]), 7)
    },
    {
      key: 'month',
      label: 'Ce mois',
      icon: 'ri-calendar-line',
      filter: (item) => isThisMonth(new Date(item[dateField]))
    },
    {
      key: 'year',
      label: 'Cette année',
      icon: 'ri-calendar-2-line',
      filter: (item) => isThisYear(new Date(item[dateField]))
    }
  ];

  const filters = customFilters || defaultFilters;

  // Calculer les compteurs pour chaque filtre
  const getCounts = () => {
    if (!showCounts || !data.length) return {};
    
    const counts = {};
    filters.forEach(filter => {
      counts[filter.key] = data.filter(filter.filter).length;
    });
    return counts;
  };

  const counts = useMemo(() => getCounts(), [data, filters]);

  return (
    <div className="d-flex flex-wrap gap-2 mb-3">
      <ButtonGroup size={buttonSize}>
        {filters.map((filter) => (
          <Button
            key={filter.key}
            color={selectedFilter === filter.key ? "primary" : "light"}
            outline={selectedFilter !== filter.key}
            onClick={() => onFilterChange(filter.key)}
            className="d-flex align-items-center"
            style={{
              borderRadius: selectedFilter === filter.key ? "20px" : "20px",
              transition: "all 0.3s ease",
              ...buttonStyle
            }}
          >
            {filter.icon && <i className={`${filter.icon} me-1`}></i>}
            {filter.label}
            {showCounts && counts[filter.key] !== undefined && (
              <span 
                className={`badge ms-2 ${
                  selectedFilter === filter.key 
                    ? 'bg-light text-primary' 
                    : 'bg-primary text-white'
                }`}
                style={{ 
                  borderRadius: "10px",
                  fontSize: "0.7rem",
                  padding: "2px 6px"
                }}
              >
                {counts[filter.key]}
              </span>
            )}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

// Fonctions utilitaires pour les filtres de date
const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const isLastNDays = (date, days) => {
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= days;
};

const isThisMonth = (date) => {
  const now = new Date();
  return date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
};

const isThisYear = (date) => {
  const now = new Date();
  return date.getFullYear() === now.getFullYear();
};

const TableContainerTotal = ({
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
  
  // Props pour le filtrage par date
  showDateFilter = false,
  dateFilterField = "created_at",
  dateFilterPosition = "top",
  customDateFilters = null,
  showDateCounts = true,
  onDateFilterChange,
  
  // ✅ NOUVEAU : Props pour la ligne de totaux
  showTotalRow = false,
  totalConfig = {},
  totalData = null, // Optionnel : données spécifiques pour le total
  
  // Props pour le style intégré
  containerStyle = {},
  
  children
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  // État pour le filtre de date
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  // Filtrer les données selon le filtre de date sélectionné
  const getDateFilteredData = useMemo(() => {
    if (!showDateFilter || selectedDateFilter === 'all') {
      return data;
    }

    const filters = customDateFilters || [
      {
        key: 'all',
        label: 'Tous',
        icon: 'ri-list-check',
        filter: () => true
      },
      {
        key: 'today',
        label: "Aujourd'hui",
        icon: 'ri-calendar-today-line',
        filter: (item) => isToday(new Date(item[dateFilterField]))
      },
      {
        key: 'recent',
        label: 'Récent (7j)',
        icon: 'ri-time-line',
        filter: (item) => isLastNDays(new Date(item[dateFilterField]), 7)
      },
      {
        key: 'month',
        label: 'Ce mois',
        icon: 'ri-calendar-line',
        filter: (item) => isThisMonth(new Date(item[dateFilterField]))
      },
      {
        key: 'year',
        label: 'Cette année',
        icon: 'ri-calendar-2-line',
        filter: (item) => isThisYear(new Date(item[dateFilterField]))
      }
    ];

    const currentFilter = filters.find(f => f.key === selectedDateFilter);
    if (!currentFilter) return data;

    return data.filter(currentFilter.filter);
  }, [data, selectedDateFilter, showDateFilter, dateFilterField, customDateFilters]);

  const table = useReactTable({
    columns,
    data: getDateFilteredData,
    filterFns: { fuzzy: fuzzyFilter },
    state: { columnFilters, globalFilter },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel()
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
    getState
  } = table;

  useEffect(() => {
    if (customPageSize) setPageSize(customPageSize);
  }, [customPageSize, setPageSize]);

  // Gérer le changement de filtre de date
  const handleDateFilterChange = (filterKey) => {
    setSelectedDateFilter(filterKey);
    
    // Appeler le callback si fourni
    if (onDateFilterChange) {
      onDateFilterChange(filterKey, getDateFilteredData);
    }
  };

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
                style={{ cursor: 'pointer' }}
              >
                {tab.icon && <i className={`${tab.icon} me-1 align-bottom`}></i>}
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

  // Rendu du filtre de date
  const renderDateFilter = () => {
    if (!showDateFilter) return null;

    return (
      <DateFilter
        selectedFilter={selectedDateFilter}
        onFilterChange={handleDateFilterChange}
        dateField={dateFilterField}
        customFilters={customDateFilters}
        showCounts={showDateCounts}
        data={data}
      />
    );
  };

  const TableContent = () => (
    <Fragment>
      {isGlobalFilter && (
        <Row className="mb-3">
          {/* Filtre global si nécessaire */}
        </Row>
      )}
      
      {/* Afficher le filtre de date en position "top" */}
      {dateFilterPosition === "top" && renderDateFilter()}
      
      <div className={divClass} style={{ marginTop: 0 }}>
        <Table hover className={tableClass} style={{ marginBottom: 0 }}>
          <thead className={theadClass}>
            {getHeaderGroups().map((headerGroup) => (
              <tr className={trClass} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={thClass} {...{
                    onClick: header.column.getToggleSortingHandler(),
                  }}>
                    {header.isPlaceholder ? null : (
                      <React.Fragment>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' ',
                          desc: ' ',
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
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          
          {/* ✅ NOUVEAU : Ligne de totaux */}
          {showTotalRow && (
            <TotalRow
              data={totalData || getDateFilteredData}
              columns={columns}
              totalConfig={totalConfig}
            />
          )}
        </Table>
      </div>
      
      {/* Afficher le filtre de date en position "bottom" */}
      {dateFilterPosition === "bottom" && renderDateFilter()}
      
      {/* Contenu supplémentaire (pagination, etc.) */}
      {children && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </Fragment>
  );

  // Style pour le conteneur principal
  const mainContainerStyle = {
    borderRadius: "20px",
    overflow: "hidden",
    marginBottom: "1rem",
    ...containerStyle
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
        <div style={{ 
          paddingTop: 0, 
          paddingBottom: children ? '1rem' : '0',
          marginLeft: "1rem",
          marginRight: "1rem",
          ...cardBodyStyle 
        }}>
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
          paddingBottom: children ? '1rem' : '0',
          ...cardBodyStyle 
        }}
      >
        <TableContent />
      </CardBody>
    </Card>
  );
};

export default TableContainerTotal;