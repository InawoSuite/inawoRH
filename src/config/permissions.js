// config/permissions.js
export const PERMISSIONS = {
  // Gestion des utilisateurs
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',

  // Contacts
  VIEW_CONTACTS: 'view_contacts',
  CREATE_CONTACTS: 'create_contacts',
  EDIT_CONTACTS: 'edit_contacts',
  DELETE_CONTACTS: 'delete_contacts',

  // Produits/Services
  VIEW_PRODUCTS: 'view_products',
  CREATE_PRODUCTS: 'create_products',
  EDIT_PRODUCTS: 'edit_products',
  DELETE_PRODUCTS: 'delete_products',

  // Factures
  VIEW_INVOICES: 'view_invoices',
  CREATE_INVOICES: 'create_invoices',
  EDIT_INVOICES: 'edit_invoices',
  DELETE_INVOICES: 'delete_invoices',

  // Ventes
  VIEW_SALES: 'view_sales',
  CREATE_SALES: 'create_sales',
  EDIT_SALES: 'edit_sales',
  DELETE_SALES: 'delete_sales',

  // Stocks
  VIEW_STOCK: 'view_stock',
  MANAGE_STOCK: 'manage_stock',

  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_DASHBOARD_CRM: 'view_dashboard_crm',
  VIEW_DASHBOARD_VENTE: 'view_dashboard_vente',
  VIEW_DASHBOARD_STOCK: 'view_dashboard_stock',

  // Comptabilité
  VIEW_COMPTA: 'view_compta',
  VIEW_JOURNAUX: 'view_journaux',
  CREATE_JOURNAUX: 'create_journaux',
  EDIT_JOURNAUX: 'edit_journaux',
  DELETE_JOURNAUX: 'delete_journaux',
  VIEW_OPERATIONS: 'view_operations',
  CREATE_OPERATIONS: 'create_operations',
  EDIT_OPERATIONS: 'edit_operations',
  DELETE_OPERATIONS: 'delete_operations',
  VIEW_IMMOBILISATIONS: 'view_immobilisations',
  CREATE_IMMOBILISATIONS: 'create_immobilisations',
  EDIT_IMMOBILISATIONS: 'edit_immobilisations',
  DELETE_IMMOBILISATIONS: 'delete_immobilisations',
  VIEW_BALANCE: 'view_balance',
  VIEW_GRAND_LIVRE: 'view_grand_livre',
  VIEW_ETATS_FINANCIERS: 'view_etats_financiers',
  VIEW_PLAN_COMPTABLE: 'view_plan_comptable',
  EDIT_PLAN_COMPTABLE: 'edit_plan_comptable',
  VIEW_PIECES_COMPTABLES: 'view_pieces_comptables',
  
  // Autres modules
  VIEW_CATALOGUE: 'view_catalogue',
  VIEW_AGENDA: 'view_agenda',
  VIEW_TACHES: 'view_tasks',
  VIEW_REPORTS: 'view_reports'
};

export const ROLE_PERMISSIONS = {
  administrateur: Object.values(PERMISSIONS), // Toutes les permissions
  
  collaborateur: [
    PERMISSIONS.VIEW_CONTACTS,
    PERMISSIONS.CREATE_CONTACTS,
    PERMISSIONS.EDIT_CONTACTS,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.VIEW_INVOICES,
    PERMISSIONS.VIEW_SALES,
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CATALOGUE,
    PERMISSIONS.VIEW_AGENDA,
    PERMISSIONS.VIEW_TACHES
  ],
  
  observateur: [
    PERMISSIONS.VIEW_CONTACTS,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.VIEW_INVOICES,
    PERMISSIONS.VIEW_SALES,
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CATALOGUE
  ],
  
  // Nouveau rôle : Comptable (accès uniquement à la comptabilité)
  comptable: [
    PERMISSIONS.VIEW_DASHBOARD, // Dashboard de base
    PERMISSIONS.VIEW_COMPTA,
    PERMISSIONS.VIEW_JOURNAUX,
    PERMISSIONS.CREATE_JOURNAUX,
    PERMISSIONS.EDIT_JOURNAUX,
    PERMISSIONS.DELETE_JOURNAUX,
    PERMISSIONS.VIEW_OPERATIONS,
    PERMISSIONS.CREATE_OPERATIONS,
    PERMISSIONS.EDIT_OPERATIONS,
    PERMISSIONS.DELETE_OPERATIONS,
    PERMISSIONS.VIEW_IMMOBILISATIONS,
    PERMISSIONS.CREATE_IMMOBILISATIONS,
    PERMISSIONS.EDIT_IMMOBILISATIONS,
    PERMISSIONS.DELETE_IMMOBILISATIONS,
    PERMISSIONS.VIEW_BALANCE,
    PERMISSIONS.VIEW_GRAND_LIVRE,
    PERMISSIONS.VIEW_ETATS_FINANCIERS,
    PERMISSIONS.VIEW_PLAN_COMPTABLE,
    PERMISSIONS.EDIT_PLAN_COMPTABLE,
    PERMISSIONS.VIEW_PIECES_COMPTABLES
  ],
  
  // Stagiaire comptable (accès en lecture seule à la comptabilité)
  stagiaire_comptable: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_COMPTA,
    PERMISSIONS.VIEW_JOURNAUX,
    PERMISSIONS.VIEW_OPERATIONS,
    PERMISSIONS.VIEW_IMMOBILISATIONS,
    PERMISSIONS.VIEW_BALANCE,
    PERMISSIONS.VIEW_GRAND_LIVRE,
    PERMISSIONS.VIEW_ETATS_FINANCIERS,
    PERMISSIONS.VIEW_PLAN_COMPTABLE,
    PERMISSIONS.VIEW_PIECES_COMPTABLES
  ]
};