/**
 * Service de gestion des erreurs d'abonnement
 * Utilise un pattern Event Emitter pour communiquer avec le contexte React
 */

class SubscriptionErrorService {
  constructor() {
    this.listeners = new Set();
    this.lastError = null;
    this.lastErrorTime = null;
    // Délai minimum entre deux affichages du même message (en ms)
    this.debounceDelay = 5000;
  }

  /**
   * Ajouter un listener pour les erreurs d'abonnement
   * @param {Function} callback - Fonction appelée avec le message d'erreur
   * @returns {Function} - Fonction pour retirer le listener
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Émettre une erreur d'abonnement
   * @param {string} message - Le message d'erreur
   */
  emit(message) {
    const now = Date.now();
    
    // Éviter les doublons rapprochés
    if (
      this.lastError === message && 
      this.lastErrorTime && 
      (now - this.lastErrorTime) < this.debounceDelay
    ) {
      return;
    }

    this.lastError = message;
    this.lastErrorTime = now;

    // Notifier tous les listeners
    this.listeners.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        console.error('[SubscriptionErrorService] Erreur dans le listener:', error);
      }
    });
  }

  /**
   * Vérifier si une erreur est une erreur d'abonnement expiré
   * @param {Object} error - L'objet erreur de la réponse
   * @returns {boolean}
   */
  isSubscriptionExpiredError(error) {
    if (!error?.response) return false;
    
    const { status, data } = error.response;
    
    // Vérifier le code 403
    if (status !== 403) return false;
    
    // Vérifier le message d'erreur - DOIT contenir explicitement une référence à l'abonnement
    const errorMessage = data?.error || data?.message || data?.detail || '';
    const errorString = errorMessage.toLowerCase();
    
    // Mots-clés qui indiquent SPÉCIFIQUEMENT une erreur d'abonnement
    // Doit contenir "abonnement" ou "subscription" ET un mot indiquant l'expiration
    const hasSubscriptionWord = errorString.includes('abonnement') || errorString.includes('subscription');
    const hasExpirationWord = errorString.includes('expir') || errorString.includes('renouveler') || errorString.includes('renew');
    
    // Retourner true SEULEMENT si c'est clairement une erreur d'abonnement expiré
    return hasSubscriptionWord && hasExpirationWord;
  }

  /**
   * Extraire le message d'erreur d'une réponse
   * @param {Object} error - L'objet erreur
   * @returns {string}
   */
  extractMessage(error) {
    const data = error?.response?.data;
    return data?.error || data?.message || data?.detail || 'Votre abonnement a expiré. Veuillez le renouveler.';
  }

  /**
   * Gérer une erreur 403
   * @param {Object} error - L'objet erreur Axios
   * @returns {boolean} - true si c'est une erreur d'abonnement gérée
   */
  handle403Error(error) {
    if (this.isSubscriptionExpiredError(error)) {
      const message = this.extractMessage(error);
      this.emit(message);
      return true;
    }
    return false;
  }
}

// Instance singleton
const subscriptionErrorService = new SubscriptionErrorService();

export default subscriptionErrorService;
