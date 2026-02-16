// src/desktop-integration.js
// Intégration desktop pour Suite Inawo

export class DesktopIntegration {
  constructor() {
    this.isElectron = !!(window.inawoDesktop);
    this.api = window.inawoDesktop;
    
    if (this.isElectron) {
      this.init();
    }
  }
  
  init() {
    console.log('🚀 Suite Inawo - Desktop Edition initialisée');
    
    // Ajouter des classes CSS pour desktop
    document.body.classList.add('desktop-app', 'electron-app');
    
    // Adapter le layout pour desktop
    this.adaptLayout();
    
    // Initialiser les fonctionnalités desktop
    this.initFeatures();
    
    // Configurer les événements
    this.setupEvents();
  }
  
  adaptLayout() {
    // Agrandir les conteneurs en desktop
    if (window.innerWidth >= 1400) {
      document.body.classList.add('wide-layout');
      
      // Adapter la sidebar si nécessaire
      const sidebar = document.querySelector('.vertical-menu, .sidebar');
      if (sidebar) {
        sidebar.style.width = '280px';
      }
    }
    
    // Désactiver certains comportements mobiles
    document.body.classList.add('no-touch-device');
  }
  
  initFeatures() {
    // Raccourcis clavier globaux
    this.setupKeyboardShortcuts();
    
    // Notifications desktop
    this.setupNotifications();
    
    // Gestion des fichiers
    this.setupFileHandling();
  }
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+S pour sauvegarder
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveCurrentDocument();
      }
      
      // Ctrl+P pour imprimer
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        this.printCurrent();
      }
      
      // F1 pour aide
      if (e.key === 'F1') {
        e.preventDefault();
        this.showHelp();
      }
    });
  }
  
  setupNotifications() {
    // Vous pouvez utiliser l'API de notification d'Electron ici
    if (this.api && this.api.features.showNotification) {
      window.showDesktopNotification = (title, options) => {
        this.api.features.showNotification(title, options);
      };
    }
  }
  
  setupFileHandling() {
    // Gestion des fichiers locaux
    window.openLocalFile = async (options = {}) => {
      if (this.api && this.api.features.showOpenDialog) {
        return await this.api.features.showOpenDialog(options);
      }
      return null;
    };
  }
  
  saveCurrentDocument() {
    // Logique de sauvegarde
    console.log('Sauvegarde demandée via Ctrl+S');
    // Émettre un événement que vos composants peuvent écouter
    window.dispatchEvent(new CustomEvent('desktop-save'));
  }
  
  printCurrent() {
    console.log('Impression demandée via Ctrl+P');
    window.dispatchEvent(new CustomEvent('desktop-print'));
  }
  
  showHelp() {
    console.log('Aide demandée via F1');
    window.open('https://inawo.pro/docs', '_blank');
  }
  
  setupEvents() {
    window.addEventListener('resize', () => this.adaptLayout());
    
    // Événements personnalisés
    window.addEventListener('desktop-save', () => {
      // Logique de sauvegarde
    });
    
    window.addEventListener('desktop-print', () => {
      // Logique d'impression
    });
  }
  
  // Méthodes utilitaires
  getPlatform() {
    return this.api ? this.api.platform : 'web';
  }
  
  isDevelopment() {
    return this.api ? this.api.isDev : process.env.NODE_ENV === 'development';
  }
  
  getAPI() {
    return this.api;
  }
}

// Initialisation automatique
let desktopIntegration = null;

export const initDesktopIntegration = () => {
  if (!desktopIntegration && window.inawoDesktop) {
    desktopIntegration = new DesktopIntegration();
  }
  return desktopIntegration;
};

// Hook React pour utiliser l'intégration desktop
export const useDesktop = () => {
  const [desktop, setDesktop] = useState(null);
  
  useEffect(() => {
    if (window.inawoDesktop) {
      const integration = initDesktopIntegration();
      setDesktop(integration);
    }
  }, []);
  
  return desktop;
};