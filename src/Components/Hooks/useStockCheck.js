// src/Components/Hooks/useStockCheck.js
import { useState } from "react";
import { 
  showError, 
  showWarning, 
  showSuccess,
  showInfo 
} from "../../utils/toastManager"; // Adaptez le chemin selon votre structure
// import { BaseUrl } from "../APIKey/ApiKey";
import { BaseUrl } from "../../pages/APIKey/ApiKey";

export const useStockCheck = (token, options = {}) => {
  const [checkingStock, setCheckingStock] = useState(false);

  // Options de configuration
  const config = {
    showToast: true, // Afficher les toasts automatiquement
    toastPosition: "top-right",
    ...options
  };

  /**
   * Vérifie si la quantité demandée est disponible en stock
   * @param {number} productId - ID du produit/matériel/matière première
   * @param {number} requestedQuantity - Quantité demandée par l'utilisateur
   * @param {string} elementType - Type d'élément ('produit', 'materiel', 'matiere-premiere')
   * @param {Object} toastOptions - Options personnalisées pour le toast
   * @returns {Promise<{isAvailable: boolean, currentStock: number, message: string}>}
   */
  const checkStockAvailability = async (productId, requestedQuantity, elementType = 'produit', toastOptions = {}) => {
    if (!productId || !requestedQuantity || requestedQuantity <= 0) {
      return {
        isAvailable: false,
        currentStock: 0,
        message: "ID ou quantité invalide"
      };
    }

    setCheckingStock(true);
    
    try {
      // Appel à l'API pour obtenir le stock actuel
      const response = await fetch(
        `${BaseUrl}/stocks/stock-by-id/?id=${productId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      
      // Logique d'extraction du stock (adaptez selon votre API)
      let currentStock = 0;
      
      if (data.quantite !== undefined) {
        currentStock = data.quantite;
      } else if (data.stock !== undefined) {
        currentStock = data.stock;
      } else if (data.quantity !== undefined) {
        currentStock = data.quantity;
      } else {
        // Si la structure est différente
        currentStock = data[elementType]?.stock || data[elementType]?.quantity || 0;
      }

      // Comparaison avec la quantité demandée
      if (currentStock < requestedQuantity) {
        const message = `Stock insuffisant. Disponible: ${currentStock}, Demandé: ${requestedQuantity}`;
        
        if (config.showToast) {
          showWarning(message, {
            position: config.toastPosition,
            autoClose: 5000,
            ...toastOptions
          });
        }
        
        return {
          isAvailable: false,
          currentStock,
          requestedQuantity,
          message,
          deficit: requestedQuantity - currentStock
        };
      }

      const message = `Stock disponible: ${currentStock}`;
      
      // Optionnel: afficher un toast de succès si configuré
      if (config.showToast && toastOptions.showSuccess) {
        showSuccess(message, {
          position: config.toastPosition,
          autoClose: 3000,
          ...toastOptions
        });
      }

      return {
        isAvailable: true,
        currentStock,
        requestedQuantity,
        message
      };

    } catch (error) {
      console.error("Erreur lors de la vérification du stock:", error);
      const message = "Erreur lors de la vérification du stock";
      
      if (config.showToast) {
        showError(message, {
          position: config.toastPosition,
          autoClose: 4000,
          ...toastOptions
        });
      }
      
      return {
        isAvailable: false,
        currentStock: 0,
        requestedQuantity,
        message
      };
    } finally {
      setCheckingStock(false);
    }
  };

  /**
   * Vérifie le stock pour une liste d'éléments
   * @param {Array} items - Liste des items à vérifier
   * @param {Object} toastOptions - Options personnalisées pour les toasts
   * @returns {Promise<{allAvailable: boolean, results: Array, errors: Array}>}
   */
  const checkMultipleStocks = async (items, toastOptions = {}) => {
    const results = [];
    const errors = [];
    let allAvailable = true;

    for (const item of items) {
      try {
        const result = await checkStockAvailability(
          item.productId,
          item.quantity,
          item.type || 'produit',
          { ...toastOptions, showSuccess: false } // Ne pas montrer les succès individuels
        );

        results.push({
          ...item,
          ...result
        });

        if (!result.isAvailable) {
          allAvailable = false;
          errors.push({
            itemName: item.name || `Item ${item.productId}`,
            message: result.message,
            deficit: result.deficit
          });
        }
      } catch (error) {
        allAvailable = false;
        errors.push({
          itemName: item.name || `Item ${item.productId}`,
          message: "Erreur lors de la vérification"
        });
      }
    }

    // Afficher un résumé si nécessaire
    if (!allAvailable && config.showToast && errors.length > 0) {
      if (errors.length === 1) {
        showWarning(`${errors[0].itemName}: ${errors[0].message}`, {
          position: config.toastPosition,
          autoClose: 6000,
          ...toastOptions
        });
      } else {
        const errorCount = errors.length;
        const deficitTotal = errors.reduce((sum, error) => sum + (error.deficit || 0), 0);
        
        showError(`${errorCount} produits avec stock insuffisant (Total manquant: ${deficitTotal})`, {
          position: config.toastPosition,
          autoClose: 8000,
          ...toastOptions
        });
      }
    }

    return {
      allAvailable,
      results,
      errors
    };
  };

  /**
   * Vérifie le stock en temps réel et affiche une notification
   * @param {Object} item - Item à vérifier
   * @param {Function} onStockChange - Callback quand le stock change
   */
  const checkStockRealtime = async (item, onStockChange = null) => {
    if (!item.productId || item.quantity <= 0) return;

    const result = await checkStockAvailability(
      item.productId,
      item.quantity,
      item.type || 'produit',
      { autoClose: 3000 }
    );

    if (onStockChange) {
      onStockChange(result);
    }

    return result;
  };

  return {
    checkStockAvailability,
    checkMultipleStocks,
    checkStockRealtime,
    checkingStock
  };
};