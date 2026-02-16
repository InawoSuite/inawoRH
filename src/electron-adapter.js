// Adapter Inawo pour Electron
export const initElectronAdapter = () => {
  if (window.inawoDesktop) {
    console.log('🚀 Inawo Desktop Edition initialisée');
    
    // Adapter le layout pour desktop
    const adaptLayoutForDesktop = () => {
      // Agrandir la sidebar en desktop
      if (window.innerWidth >= 1200) {
        document.body.classList.add('layout-fullwidth', 'desktop-mode');
        
        // Augmenter la largeur de la sidebar
        const sidebar = document.querySelector('.vertical-menu');
        if (sidebar) {
          sidebar.style.width = '260px';
        }
      }
      
      // Désactiver certains comportements mobiles
      if (typeof window.TouchEvent === 'undefined') {
        document.body.classList.add('no-touch');
      }
    };
    
    // Initialiser
    adaptLayoutForDesktop();
    window.addEventListener('resize', adaptLayoutForDesktop);
    
    // Exposer l'API desktop aux composants Inawo
    window.InawoDesktop = window.inawoDesktop;
    
    return window.inawoDesktop;
  }
  
  return null;
};

// Hook React pour utiliser les fonctionnalités Electron
export const useElectron = () => {
  const [isElectron, setIsElectron] = useState(false);
  const [desktopAPI, setDesktopAPI] = useState(null);

  useEffect(() => {
    const hasElectron = !!(window.inawoDesktop);
    setIsElectron(hasElectron);
    
    if (hasElectron) {
      setDesktopAPI(window.inawoDesktop);
      
      // Initialiser les fonctionnalités desktop
      initElectronAdapter();
      
      // Log pour débogage
      console.log('Electron API disponible:', window.inawoDesktop.getAppInfo());
    }
  }, []);

  return { isElectron, desktopAPI };
};