<<<<<<< HEAD
// // Exemple 1: Page des employés
// <SearchAndActionBar
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder="Chercher un employé..."
//   onAddClick={() => openEmployeeModal()}
//   addButtonText="Ajouter un employé"
//   addButtonIcon="ri-user-add-line"
//   onExportClick={() => setIsExportCSV(true)}
//   exportButtonText="Exporter les employés"
// />

// // Exemple 2: Page des produits avec boutons personnalisés
// <SearchAndActionBar
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder="Chercher un produit..."
//   onAddClick={() => openProductModal()}
//   addButtonText="Nouveau produit"
//   addButtonIcon="ri-shopping-bag-line"
//   addButtonClass="btn btn-primary add-btn"
  
//   // Boutons personnalisés
//   customButtons={[
//     {
//       text: "Importer",
//       icon: "ri-file-download-line",
//       className: "btn btn-warning",
//       onClick: () => setImportModal(true)
//     },
//     {
//       text: "Catégories",
//       icon: "ri-list-check",
//       className: "btn btn-secondary",
//       onClick: () => navigate('/categories')
//     }
//   ]}
  
//   onExportClick={() => setIsExportCSV(true)}
// />

// // Exemple 3: Page en lecture seule (sans bouton d'ajout)
// <SearchAndActionBar
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder="Chercher dans les rapports..."
//   showAddButton={false}
//   onExportClick={() => exportReports()}
//   exportButtonText="Télécharger rapport"
// />

// // Exemple 4: Page simple sans export
// <SearchAndActionBar
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder="Chercher un client..."
//   onAddClick={() => openClientModal()}
//   addButtonText="Ajouter client"
//   showExportButton={false}
// />

// // Exemple 5: Page sans recherche (seulement actions)
// <SearchAndActionBar
//   showSearch={false}
//   onAddClick={() => createNew()}
//   addButtonText="Créer nouveau"
//   customButtons={[
//     {
//       text: "Paramètres",
//       icon: "ri-settings-line",
//       className: "btn btn-outline-secondary",
//       onClick: () => openSettings()
//     }
//   ]}
//   showExportButton={false}
// />

// // Exemple 6: Personnalisation complète du style
// <SearchAndActionBar
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder="Recherche avancée..."
  
//   // Styles personnalisés
//   cardStyle={{ borderRadius: "15px", backgroundColor: "#f8f9fa" }}
//   headerStyle={{ borderRadius: "15px 15px 0 0", backgroundColor: "#e9ecef" }}
//   inputStyle={{ borderRadius: "25px", border: "2px solid #007bff" }}
//   buttonStyle={{ borderRadius: "15px" }}
  
//   onAddClick={() => openModal()}
//   addButtonText="Créer"
//   addButtonClass="btn btn-success add-btn"
  
//   onExportClick={() => exportData()}
// />

// // Exemple 7: Page avec plusieurs actions complexes
// <SearchAndActionBar
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder="Chercher une commande..."
  
//   onAddClick={() => createOrder()}
//   addButtonText="Nouvelle commande"
//   addButtonIcon="ri-shopping-cart-line"
  
//   customButtons={[
//     {
//       text: "Brouillons",
//       icon: "ri-draft-line",
//       className: "btn btn-outline-info",
//       onClick: () => showDrafts(),
//       disabled: drafts.length === 0
//     },
//     {
//       text: "Archiver",
//       icon: "ri-archive-line",
//       className: "btn btn-outline-warning",
//       onClick: () => archiveSelected(),
//       disabled: selectedItems.length === 0,
//       title: "Archiver les éléments sélectionnés"
//     },
//     {
//       text: "Synchroniser",
//       icon: "ri-refresh-line",
//       className: "btn btn-outline-primary",
//       onClick: () => syncData()
//     }
//   ]}
  
//   onExportClick={() => exportOrders()}
//   exportButtonText="Export Excel"
//   exportButtonIcon="ri-file-excel-line"
// />

// // Exemple 8: Page avec recherche désactivée temporairement
// <SearchAndActionBar
//   showSearch={!isLoading}
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder={isLoading ? "Chargement..." : "Chercher..."}
  
//   onAddClick={!isLoading ? () => openModal() : undefined}
//   addButtonText="Ajouter"
//   showAddButton={!isLoading}
  
//   showExportButton={data.length > 0}
//   onExportClick={() => exportData()}
=======
// // Exemple 1: Page des employés
// <SearchAndActionBar
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder="Chercher un employé..."
//   onAddClick={() => openEmployeeModal()}
//   addButtonText="Ajouter un employé"
//   addButtonIcon="ri-user-add-line"
//   onExportClick={() => setIsExportCSV(true)}
//   exportButtonText="Exporter les employés"
// />

// // Exemple 2: Page des produits avec boutons personnalisés
// <SearchAndActionBar
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder="Chercher un produit..."
//   onAddClick={() => openProductModal()}
//   addButtonText="Nouveau produit"
//   addButtonIcon="ri-shopping-bag-line"
//   addButtonClass="btn btn-primary add-btn"
  
//   // Boutons personnalisés
//   customButtons={[
//     {
//       text: "Importer",
//       icon: "ri-file-download-line",
//       className: "btn btn-warning",
//       onClick: () => setImportModal(true)
//     },
//     {
//       text: "Catégories",
//       icon: "ri-list-check",
//       className: "btn btn-secondary",
//       onClick: () => navigate('/categories')
//     }
//   ]}
  
//   onExportClick={() => setIsExportCSV(true)}
// />

// // Exemple 3: Page en lecture seule (sans bouton d'ajout)
// <SearchAndActionBar
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder="Chercher dans les rapports..."
//   showAddButton={false}
//   onExportClick={() => exportReports()}
//   exportButtonText="Télécharger rapport"
// />

// // Exemple 4: Page simple sans export
// <SearchAndActionBar
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder="Chercher un client..."
//   onAddClick={() => openClientModal()}
//   addButtonText="Ajouter client"
//   showExportButton={false}
// />

// // Exemple 5: Page sans recherche (seulement actions)
// <SearchAndActionBar
//   showSearch={false}
//   onAddClick={() => createNew()}
//   addButtonText="Créer nouveau"
//   customButtons={[
//     {
//       text: "Paramètres",
//       icon: "ri-settings-line",
//       className: "btn btn-outline-secondary",
//       onClick: () => openSettings()
//     }
//   ]}
//   showExportButton={false}
// />

// // Exemple 6: Personnalisation complète du style
// <SearchAndActionBar
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder="Recherche avancée..."
  
//   // Styles personnalisés
//   cardStyle={{ borderRadius: "15px", backgroundColor: "#f8f9fa" }}
//   headerStyle={{ borderRadius: "15px 15px 0 0", backgroundColor: "#e9ecef" }}
//   inputStyle={{ borderRadius: "25px", border: "2px solid #007bff" }}
//   buttonStyle={{ borderRadius: "15px" }}
  
//   onAddClick={() => openModal()}
//   addButtonText="Créer"
//   addButtonClass="btn btn-success add-btn"
  
//   onExportClick={() => exportData()}
// />

// // Exemple 7: Page avec plusieurs actions complexes
// <SearchAndActionBar
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder="Chercher une commande..."
  
//   onAddClick={() => createOrder()}
//   addButtonText="Nouvelle commande"
//   addButtonIcon="ri-shopping-cart-line"
  
//   customButtons={[
//     {
//       text: "Brouillons",
//       icon: "ri-draft-line",
//       className: "btn btn-outline-info",
//       onClick: () => showDrafts(),
//       disabled: drafts.length === 0
//     },
//     {
//       text: "Archiver",
//       icon: "ri-archive-line",
//       className: "btn btn-outline-warning",
//       onClick: () => archiveSelected(),
//       disabled: selectedItems.length === 0,
//       title: "Archiver les éléments sélectionnés"
//     },
//     {
//       text: "Synchroniser",
//       icon: "ri-refresh-line",
//       className: "btn btn-outline-primary",
//       onClick: () => syncData()
//     }
//   ]}
  
//   onExportClick={() => exportOrders()}
//   exportButtonText="Export Excel"
//   exportButtonIcon="ri-file-excel-line"
// />

// // Exemple 8: Page avec recherche désactivée temporairement
// <SearchAndActionBar
//   showSearch={!isLoading}
//   searchTerm={searchTerm}
//   onSearchChange={setSearchTerm}
//   searchPlaceholder={isLoading ? "Chargement..." : "Chercher..."}
  
//   onAddClick={!isLoading ? () => openModal() : undefined}
//   addButtonText="Ajouter"
//   showAddButton={!isLoading}
  
//   showExportButton={data.length > 0}
//   onExportClick={() => exportData()}
>>>>>>> origin/aurel
// />