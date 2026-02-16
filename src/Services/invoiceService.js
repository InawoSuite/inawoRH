export class InvoiceService {
  static async getFullInvoiceData(invoiceId) {
    const token = localStorage.getItem('token');
    
    try {
      // Récupérer les données de la facture
      const invoiceRes = await fetch(
        `https://inawoapiv3.inawo.pro/facture/factures/${invoiceId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!invoiceRes.ok) throw new Error('Facture introuvable');
      
      const factureData = await invoiceRes.json();
      
      // Récupérer les données de l'entreprise
      let enterprise = null;
      if (factureData.utilisateur) {
        const profileRes = await fetch(
          `https://inawoapiv3.inawo.pro/utilisateurs/update-profile/${factureData.utilisateur}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          enterprise = profileData.entreprise;
        }
      }
      
      // Récupérer et enrichir les articles
      let enrichedArticles = [];
      if (factureData.article_facture && factureData.article_facture.length > 0) {
        enrichedArticles = await this.enrichArticlesWithProductNames(factureData.article_facture);
      }
      
      // Récupérer la signature
      let signatureData = null;
      if (factureData.signataire || factureData.signanture) {
        const signatureId = factureData.signataire || factureData.signanture;
        signatureData = await this.fetchSignature(signatureId);
      }
      
      // Générer le QR Code
      const qrCodeUrl = this.generateQRCode(factureData);
      
      return {
        invoiceData: factureData,
        enterprise,
        enrichedArticles,
        signatureData,
        qrCodeUrl
      };
      
    } catch (error) {
      console.error('Erreur récupération données facture:', error);
      throw error;
    }
  }
  
  static async enrichArticlesWithProductNames(articles) {
    const token = localStorage.getItem('token');
    
    return Promise.all(
      articles.map(async (article) => {
        try {
          const response = await fetch(
            `https://inawoapiv3.inawo.pro/stocks/produits/${article.produit}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (response.ok) {
            const productData = await response.json();
            return {
              ...article,
              produit_nom: productData.nom || `Produit ID: ${article.produit}`
            };
          }
        } catch (error) {
          console.error(`Erreur produit ${article.produit}:`, error);
        }
        
        return {
          ...article,
          produit_nom: `Produit ID: ${article.produit}`
        };
      })
    );
  }
  
  static async fetchSignature(signatureId) {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `https://inawoapiv3.inawo.pro/facture/signatures/${signatureId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Erreur récupération signature:", error);
    }
    return null;
  }
  
  static generateQRCode(invoiceInfo) {
    const qrData = `FACTURE:${invoiceInfo.numero_facture}|MONTANT:${invoiceInfo.montant_total}|DATE:${invoiceInfo.date_emission}|MECEF:MECEF-${Date.now()}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
  }

}