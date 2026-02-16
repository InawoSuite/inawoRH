import { toast } from 'react-toastify';

// File d'attente pour gérer l'ordre
let toastQueue = [];
let isProcessing = false;
const MAX_VISIBLE = 3;

// Fonction pour traiter la file d'attente
const processQueue = () => {
  if (isProcessing || toastQueue.length === 0) return;
  
  const activeToasts = toast.getToasts?.()?.length || 0;
  
  if (activeToasts < MAX_VISIBLE) {
    isProcessing = true;
    const nextToast = toastQueue.shift();
    
    if (nextToast) {
      nextToast.show();
      
      // Attendre un peu avant de traiter le suivant
      setTimeout(() => {
        isProcessing = false;
        processQueue();
      }, 300);
    } else {
      isProcessing = false;
    }
  }
};

// Fonction utilitaire pour ajouter à la queue
const addToQueue = (showFn) => {
  toastQueue.push({ show: showFn });
  processQueue();
};

// Fonction pour éviter les doublons
let lastToastMessage = '';
let lastToastTime = 0;
const DUPLICATE_THRESHOLD = 2000; // 2 secondes

const isDuplicate = (message) => {
  const now = Date.now();
  if (message === lastToastMessage && (now - lastToastTime) < DUPLICATE_THRESHOLD) {
    return true;
  }
  lastToastMessage = message;
  lastToastTime = now;
  return false;
};

// ✅ FONCTIONS PUBLIQUES AMÉLIORÉES
export const showSuccess = (message, options = {}) => {
  if (isDuplicate(message)) return;
  
  addToQueue(() => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  });
};

export const showError = (message, options = {}) => {
  if (isDuplicate(message)) return;
  
  // Les erreurs ont la priorité - on les place en début de queue
  toastQueue.unshift({
    show: () => {
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        ...options,
      });
    }
  });
  processQueue();
};

export const showWarning = (message, options = {}) => {
  if (isDuplicate(message)) return;
  
  addToQueue(() => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  });
};

export const showInfo = (message, options = {}) => {
  if (isDuplicate(message)) return;
  
  addToQueue(() => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const clearAllToasts = () => {
  toast.dismiss();
  toastQueue = [];
  isProcessing = false;
  lastToastMessage = '';
  lastToastTime = 0;
};

// Fonction pour afficher un toast de chargement
export const showLoading = (message = "Chargement...") => {
  return toast.loading(message, {
    position: "top-right",
  });
};

// Fonction pour mettre à jour un toast de chargement
export const updateToast = (toastId, message, type = 'success') => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 3000,
  });
};