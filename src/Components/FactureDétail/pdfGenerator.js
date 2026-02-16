import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

/**
 * Génère et télécharge un PDF optimisé à partir d'un élément HTML
 */
export const generatePDF = async (options = {}) => {
  const {
    elementId,
    filename = 'document',
    watermarkText = 'Généré par www.inawo.pro',
    onSuccess,
    onError
  } = options;

  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Élément avec l'ID "${elementId}" non trouvé`);
    }

    // Options optimisées pour html2canvas
    const canvasOptions = {
      scale: 2, // Haute qualité pour le texte
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800, // Largeur fixe pour la cohérence
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      // Options pour améliorer le rendu du texte
      letterRendering: true,
      imageTimeout: 0,
      removeContainer: true
    };

    console.log('🎨 Génération canvas avec options:', canvasOptions);

    // Génération du canvas avec retry en cas d'échec
    let canvas;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        canvas = await html2canvas(element, canvasOptions);
        break;
      } catch (canvasError) {
        attempts++;
        console.warn(`⚠️ Tentative ${attempts} échouée:`, canvasError);
        if (attempts >= maxAttempts) {
          throw canvasError;
        }
        // Attendre avant la prochaine tentative
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!canvas) {
      throw new Error('Impossible de générer le canvas');
    }

    console.log('✅ Canvas généré:', {
      width: canvas.width,
      height: canvas.height,
      dataLength: canvas.toDataURL().length
    });

    // Configuration PDF optimisée
    const imgWidth = 210; // A4 width en mm
    const pageHeight = 297; // A4 height en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF({
    //   orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true // Compression pour réduire la taille
    });
    
    // Conversion en image avec qualité optimisée
    const imgData = canvas.toDataURL('image/jpeg', 0.85); // Qualité 85% pour équilibrer taille/qualité
    
    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 1;
    
    // Première page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
    
    // Pages supplémentaires si nécessaire
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
      pageCount++;
    }
    
    console.log(`📄 PDF généré avec ${pageCount} page(s)`);
    
    // Ajout du filigrane sur toutes les pages
    if (watermarkText) {
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150); // Gris clair
        pdf.text(
          watermarkText,
          10,
          pdf.internal.pageSize.getHeight() - 8
        );
      }
    }
    
    // Téléchargement
    pdf.save(`${filename}.pdf`);
    
    console.log('💾 PDF téléchargé:', filename);
    
    // Callback de succès
    if (onSuccess) {
      onSuccess(pdf);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération PDF:', error);
    
    // Callback d'erreur
    if (onError) {
      onError(error);
    } else {
      toast.error('Erreur lors de la génération du PDF');
    }
  }
};

/**
 * Fonction pour générer un PDF avec délai et préparation
 */
export const generatePDFWithDelay = async (options, delay = 1000) => {
  const { elementId } = options;
  
  return new Promise((resolve, reject) => {
    // Préparer l'élément pour le rendu PDF
    const element = document.getElementById(elementId);
    if (element) {
      // S'assurer que l'élément est visible pour html2canvas
      const originalStyle = {
        position: element.style.position,
        left: element.style.left,
        top: element.style.top,
        zIndex: element.style.zIndex
      };
      
      // Rendre temporairement visible mais hors écran
      element.style.position = 'fixed';
      element.style.left = '0';
      element.style.top = '0';
      element.style.zIndex = '-1';
      element.style.width = '800px';
      element.style.backgroundColor = 'white';
      
      setTimeout(async () => {
        try {
          await generatePDF({
            ...options,
            onSuccess: (pdf) => {
              // Restaurer le style original
              Object.assign(element.style, originalStyle);
              
              if (options.onSuccess) options.onSuccess(pdf);
              resolve(pdf);
            },
            onError: (error) => {
              // Restaurer le style original
              Object.assign(element.style, originalStyle);
              
              if (options.onError) options.onError(error);
              reject(error);
            }
          });
        } catch (error) {
          // Restaurer le style original
          Object.assign(element.style, originalStyle);
          reject(error);
        }
      }, delay);
    } else {
      reject(new Error(`Élément ${elementId} non trouvé`));
    }
  });
};

/**
 * Fonction spécialisée pour les factures avec options optimisées
 */
export const generateInvoicePDF = async (invoiceData, elementId = null) => {
  const filename = `facture-${invoiceData.numero_facture || 'sans-numero'}`;
  
  await generatePDFWithDelay({
    elementId: elementId || 'invoice-to-print',
    filename,
    watermarkText: 'Facture générée par www.inawo.pro',
    onSuccess: () => {
      toast.success('PDF de facture généré avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de la génération du PDF de facture');
      console.error('Erreur PDF facture:', error);
    }
  }, 1200); // Délai plus long pour s'assurer du rendu complet
};