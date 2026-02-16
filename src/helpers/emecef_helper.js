import axios from "axios";
import { APIClient } from "./api_helper";
import { API_URL, EMECEF_API_URL } from "../config";

// Create a dedicated API client instance for e-MECeF
const emecefAPI = new APIClient(EMECEF_API_URL);

/**
 * Check if the e-MECeF API is available and connection is valid
 * @returns {Promise<boolean>} True if connected, throws an error otherwise
 */
export const checkEMecefStatus = async () => {
  try {
    const response = await emecefAPI.get("/health");
    return response.status === "UP";
  } catch (error) {
    console.error("e-MECeF API connection check failed:", error);
    throw new Error("e-MECeF API connection failed");
  }
};

/**
 * Get available invoice types from the e-MECeF API
 * @returns {Promise<Array>} List of invoice types
 */
export const getInvoiceTypes = async () => {
  try {
    const response = await emecefAPI.get("/reference/invoice-types");
    return response.data;
  } catch (error) {
    console.error("Failed to get invoice types:", error);
    return [];
  }
};

/**
 * Get available payment types from the e-MECeF API
 * @returns {Promise<Array>} List of payment types
 */
export const getPaymentTypes = async () => {
  try {
    const response = await emecefAPI.get("/reference/payment-types");
    return response.data;
  } catch (error) {
    console.error("Failed to get payment types:", error);
    return [];
  }
};

/**
 * Get available tax groups from the e-MECeF API
 * @returns {Promise<Array>} List of tax groups
 */
export const getTaxGroups = async () => {
  try {
    const response = await emecefAPI.get("/reference/tax-groups");
    return response.data;
  } catch (error) {
    console.error("Failed to get tax groups:", error);
    return [];
  }
};

/**
 * Generate a draft invoice in the e-MECeF system
 * @param {Object} invoiceData Invoice data
 * @returns {Promise<Object>} Draft invoice
 */
export const generateDraftInvoice = async (invoiceData) => {
  try {
    const response = await emecefAPI.post("/invoices/draft", invoiceData);
    return response.data;
  } catch (error) {
    console.error("Failed to generate draft invoice:", error);
    throw error;
  }
};

/**
 * Confirm a draft invoice in the e-MECeF system
 * @param {string} draftId Draft invoice ID
 * @returns {Promise<Object>} Confirmed invoice
 */
export const confirmInvoice = async (draftId) => {
  try {
    const response = await emecefAPI.post(`/invoices/confirm/${draftId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to confirm invoice:", error);
    throw error;
  }
};

/**
 * Get invoice details from the e-MECeF system
 * @param {string} invoiceId Invoice ID
 * @returns {Promise<Object>} Invoice details
 */
export const getInvoiceDetails = async (invoiceId) => {
  try {
    const response = await emecefAPI.get(`/invoices/${invoiceId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get invoice details:", error);
    throw error;
  }
};

/**
 * Get invoice QR code from the e-MECeF system
 * @param {string} invoiceId Invoice ID
 * @returns {Promise<Object>} Invoice QR code data
 */
export const getInvoiceQRCode = async (invoiceId) => {
  try {
    const response = await emecefAPI.get(`/invoices/${invoiceId}/qrcode`);
    return response.data;
  } catch (error) {
    console.error("Failed to get invoice QR code:", error);
    throw error;
  }
};

/**
 * Format item data for e-MECeF API
 * @param {Array} items List of items
 * @returns {Array} Formatted items
 */
const formatItemsForAPI = (items) => {
  return items.map(item => ({
    designation: item.name,
    quantity: item.quantity,
    price: item.price,
    taxGroup: item.tax_group,
    priceType: item.price_type
  }));
};

/**
 * Format payment data for e-MECeF API
 * @param {Array} payments List of payments
 * @returns {Array} Formatted payments
 */
const formatPaymentsForAPI = (payments) => {
  return payments.map(payment => ({
    type: payment.type,
    amount: payment.amount
  }));
};

/**
 * Format client data for e-MECeF API
 * @param {Object} client Client data
 * @returns {Object} Formatted client
 */
const formatClientForAPI = (client) => {
  return {
    ifu: client.ifu || undefined,
    name: client.name,
    contact: client.contact || undefined,
    address: client.address || undefined,
    email: client.email || undefined
  };
};

/**
 * Complete invoice process (draft, confirm, get details and QR code)
 * @param {Object} invoiceData Invoice data
 * @returns {Promise<Object>} Complete invoice process result
 */
export const completeInvoiceProcess = async (invoiceData) => {
  try {
    // Format data for API
    const formattedData = {
      reference: invoiceData.reference,
      type: invoiceData.type,
      date: invoiceData.date,
      client: formatClientForAPI(invoiceData.client),
      items: formatItemsForAPI(invoiceData.items),
      payments: formatPaymentsForAPI(invoiceData.payments)
    };

    // Step 1: Generate draft invoice
    const draftInvoice = await generateDraftInvoice(formattedData);

    if (!draftInvoice.id) {
      throw new Error("Draft invoice generation failed");
    }

    // Step 2: Confirm the invoice
    const confirmedInvoice = await confirmInvoice(draftInvoice.id);

    if (!confirmedInvoice.id) {
      throw new Error("Invoice confirmation failed");
    }

    // Step 3: Get invoice details
    const invoiceDetails = await getInvoiceDetails(confirmedInvoice.id);

    // Step 4: Get QR code
    const qrCodeData = await getInvoiceQRCode(confirmedInvoice.id);

    // Return complete result
    return {
      success: true,
      message: "Facture normalisée générée avec succès",
      invoice: {
        id: confirmedInvoice.id,
        uid: invoiceDetails.uid,
        reference: invoiceDetails.reference,
        date: invoiceDetails.date,
        qrCode: qrCodeData.qrCodeBase64
      }
    };
  } catch (error) {
    console.error("Invoice process failed:", error);
    return {
      success: false,
      message: error.message || "Échec de la génération de la facture normalisée",
      error
    };
  }
};

/**
 * Cancel an invoice in the e-MECeF system
 * @param {string} invoiceId Invoice ID
 * @param {string} reason Cancellation reason
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelInvoice = async (invoiceId, reason) => {
  try {
    const response = await emecefAPI.post(`/invoices/cancel/${invoiceId}`, { reason });
    return {
      success: true,
      message: "Facture annulée avec succès",
      data: response.data
    };
  } catch (error) {
    console.error("Failed to cancel invoice:", error);
    return {
      success: false,
      message: error.message || "Échec de l'annulation de la facture",
      error
    };
  }
};

/**
 * Search for invoices in the e-MECeF system
 * @param {Object} filters Search filters (reference, date, client, etc.)
 * @param {number} page Page number
 * @param {number} limit Items per page
 * @returns {Promise<Object>} Search results
 */
export const searchInvoices = async (filters, page = 1, limit = 20) => {
  try {
    const response = await emecefAPI.post("/invoices/search", {
      ...filters,
      page,
      limit
    });
    
    return {
      success: true,
      data: response.data,
      pagination: response.pagination
    };
  } catch (error) {
    console.error("Invoice search failed:", error);
    return {
      success: false,
      message: error.message || "Échec de la recherche de factures",
      error
    };
  }
};