// src/contexts/NotificationContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [pageAlerts, setPageAlerts] = useState([]);

  // Notification toast (pour les messages temporaires)
  const showToast = useCallback((message, type = 'info', options = {}) => {
    const toastOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      case 'info':
        toast.info(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
    }
  }, []);

  // Alertes de page (pour les messages persistants sur la page)
  const showPageAlert = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now().toString();
    const alert = {
      id,
      message,
      type,
      ...options
    };

    setPageAlerts(prev => [...prev, alert]);

    // Auto-remove si durée spécifiée
    if (options.autoRemove) {
      setTimeout(() => {
        removePageAlert(id);
      }, options.duration || 5000);
    }

    return id;
  }, []);

  const removePageAlert = useCallback((id) => {
    setPageAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearPageAlerts = useCallback(() => {
    setPageAlerts([]);
  }, []);

  // Notification combinée (toast + alert si nécessaire)
  const notify = useCallback((message, type = 'info', options = {}) => {
    const { useToast = true, usePageAlert = false, ...notificationOptions } = options;

    if (useToast) {
      showToast(message, type, notificationOptions);
    }

    if (usePageAlert) {
      return showPageAlert(message, type, notificationOptions);
    }

    return null;
  }, [showToast, showPageAlert]);

  const value = {
    // Méthodes principales
    notify,
    showToast,
    showPageAlert,
    removePageAlert,
    clearPageAlerts,
    
    // Méthodes raccourcis
    success: (message, options) => notify(message, 'success', options),
    error: (message, options) => notify(message, 'error', options),
    warning: (message, options) => notify(message, 'warning', options),
    info: (message, options) => notify(message, 'info', options),
    
    // Données
    pageAlerts
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </NotificationContext.Provider>
  );
};