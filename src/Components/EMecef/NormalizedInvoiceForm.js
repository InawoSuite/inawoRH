import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Container, Row, Form, FormFeedback, Input, Label, Button, Alert, Spinner } from "reactstrap";
import BreadCrumb from "../Common/BreadCrumb";
import Select from "react-select";

// Import the e-MECeF API helper functions
import { 
  checkEMecefStatus, 
  getInvoiceTypes, 
  getPaymentTypes, 
  getTaxGroups, 
  completeInvoiceProcess 
} from "../../helpers/emecef_helper";

const NormalizedInvoiceForm = () => {
  // States for form data
  const [invoiceData, setInvoiceData] = useState({
    reference: "",
    type: "FV", // Default to "Facture de Vente"
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    client: {
      ifu: "",
      name: "",
      contact: "",
      address: "",
      email: ""
    },
    items: [
      {
        name: "",
        price: 0,
        quantity: 1,
        tax_group: "A", // Default tax group
        price_type: "HT" // Default price type (Hors Taxe)
      }
    ],
    payments: [
      {
        type: "ESP", // Default to "Espèces" (Cash)
        amount: 0
      }
    ]
  });

  // State for API status and reference data
  const [apiStatus, setApiStatus] = useState({ connected: false, checking: true });
  const [referenceData, setReferenceData] = useState({
    invoiceTypes: [],
    paymentTypes: [],
    taxGroups: []
  });

  // States for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Fetch API status and reference data on component mount
  useEffect(() => {
    // Check API connection
    checkEMecefStatus()
      .then(() => setApiStatus({ connected: true, checking: false }))
      .catch(() => setApiStatus({ connected: false, checking: false }));

    // Load reference data
    Promise.all([
      getInvoiceTypes(),
      getPaymentTypes(),
      getTaxGroups()
    ])
      .then(([invoiceTypes, paymentTypes, taxGroups]) => {
        setReferenceData({
          invoiceTypes: invoiceTypes?.map(type => ({ value: type.code, label: type.name })) || [],
          paymentTypes: paymentTypes?.map(type => ({ value: type.code, label: type.name })) || [],
          taxGroups: taxGroups?.map(group => ({ value: group.code, label: `${group.name} (${group.rate}%)` })) || []
        });
      })
      .catch(error => {
        console.error("Failed to load reference data:", error);
      });
  }, []);

  // Calculate total amount
  const calculateTotal = () => {
    return invoiceData.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Update invoice data
  const handleInputChange = (e, field, subField = null, index = null) => {
    const { name, value } = e.target;

    setInvoiceData(prevData => {
      if (field === "client") {
        return {
          ...prevData,
          client: {
            ...prevData.client,
            [name]: value
          }
        };
      } else if (field === "items" && index !== null) {
        const updatedItems = [...prevData.items];
        updatedItems[index] = {
          ...updatedItems[index],
          [name]: name === "price" || name === "quantity" ? parseFloat(value) : value
        };
        return {
          ...prevData,
          items: updatedItems
        };
      } else if (field === "payments" && index !== null) {
        const updatedPayments = [...prevData.payments];
        updatedPayments[index] = {
          ...updatedPayments[index],
          [name]: name === "amount" ? parseFloat(value) : value
        };
        
        // Automatically update payment amount to match total
        if (name !== "amount") {
          updatedPayments[index].amount = calculateTotal();
        }
        
        return {
          ...prevData,
          payments: updatedPayments
        };
      } else {
        return {
          ...prevData,
          [name]: value
        };
      }
    });
  };

  // Handle select changes (for dropdowns)
  const handleSelectChange = (option, field, index = null) => {
    if (field === "type") {
      setInvoiceData({ ...invoiceData, type: option.value });
    } else if (field === "items" && index !== null) {
      const updatedItems = [...invoiceData.items];
      if (option.name === "tax_group") {
        updatedItems[index].tax_group = option.value;
      } else if (option.name === "price_type") {
        updatedItems[index].price_type = option.value;
      }
      setInvoiceData({ ...invoiceData, items: updatedItems });
    } else if (field === "payments" && index !== null) {
      const updatedPayments = [...invoiceData.payments];
      updatedPayments[index].type = option.value;
      setInvoiceData({ ...invoiceData, payments: updatedPayments });
    }
  };

  // Add a new item to the invoice
  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          name: "",
          price: 0,
          quantity: 1,
          tax_group: "A",
          price_type: "HT"
        }
      ]
    });
  };

  // Remove an item from the invoice
  const removeItem = (index) => {
    const updatedItems = [...invoiceData.items];
    updatedItems.splice(index, 1);
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  // Add a new payment to the invoice
  const addPayment = () => {
    setInvoiceData({
      ...invoiceData,
      payments: [
        ...invoiceData.payments,
        {
          type: "ESP",
          amount: 0
        }
      ]
    });
  };

  // Remove a payment from the invoice
  const removePayment = (index) => {
    const updatedPayments = [...invoiceData.payments];
    updatedPayments.splice(index, 1);
    setInvoiceData({ ...invoiceData, payments: updatedPayments });
  };

  // Validate the form
  const validateForm = () => {
    const errors = {};

    if (!invoiceData.reference) {
      errors.reference = "La référence est requise";
    }

    if (!invoiceData.client.name) {
      errors.clientName = "Le nom du client est requis";
    }

    let hasInvalidItems = false;
    invoiceData.items.forEach((item, index) => {
      if (!item.name) {
        hasInvalidItems = true;
        errors[`itemName${index}`] = "Le nom de l'article est requis";
      }
      if (item.price <= 0) {
        hasInvalidItems = true;
        errors[`itemPrice${index}`] = "Le prix doit être supérieur à 0";
      }
      if (item.quantity <= 0) {
        hasInvalidItems = true;
        errors[`itemQuantity${index}`] = "La quantité doit être supérieure à 0";
      }
    });

    if (hasInvalidItems) {
      errors.items = "Veuillez corriger les erreurs dans les articles";
    }

    let hasInvalidPayments = false;
    invoiceData.payments.forEach((payment, index) => {
      if (payment.amount <= 0) {
        hasInvalidPayments = true;
        errors[`paymentAmount${index}`] = "Le montant doit être supérieur à 0";
      }
    });

    if (hasInvalidPayments) {
      errors.payments = "Veuillez corriger les erreurs dans les paiements";
    }

    // Check if total payments match total items
    const totalItems = calculateTotal();
    const totalPayments = invoiceData.payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    if (Math.abs(totalItems - totalPayments) > 0.01) { // Allow for small floating point differences
      errors.totalMismatch = "Le total des paiements doit être égal au total des articles";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const result = await completeInvoiceProcess(invoiceData);
      setSubmissionResult(result);
      
      if (result.success) {
        // Reset form if successful
        setInvoiceData({
          reference: "",
          type: "FV",
          date: new Date().toISOString().split('T')[0],
          client: {
            ifu: "",
            name: "",
            contact: "",
            address: "",
            email: ""
          },
          items: [
            {
              name: "",
              price: 0,
              quantity: 1,
              tax_group: "A",
              price_type: "HT"
            }
          ],
          payments: [
            {
              type: "ESP",
              amount: 0
            }
          ]
        });
      }
    } catch (error) {
      setSubmissionResult({
        success: false,
        message: "Une erreur est survenue lors de la soumission",
        error
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Price type options
  const priceTypeOptions = [
    { value: "HT", label: "Hors Taxe (HT)" },
    { value: "TTC", label: "Toutes Taxes Comprises (TTC)" }
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Facture Normalisée" pageTitle="e-MECeF" />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                {/* API Status */}
                {apiStatus.checking ? (
                  <Alert color="info">
                    Vérification de la connexion à l'API e-MECeF...
                  </Alert>
                ) : apiStatus.connected ? (
                  <Alert color="success">
                    Connecté à l'API e-MECeF
                  </Alert>
                ) : (
                  <Alert color="danger">
                    Impossible de se connecter à l'API e-MECeF. Veuillez vérifier votre configuration.
                  </Alert>
                )}

                {/* Submission Result */}
                {submissionResult && (
                  <Alert color={submissionResult.success ? "success" : "danger"}>
                    {submissionResult.message}
                    {submissionResult.success && submissionResult.invoice?.uid && (
                      <div className="mt-2">
                        <strong>UID de la facture:</strong> {submissionResult.invoice.uid}
                      </div>
                    )}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="mb-4">
                    <Col md={4}>
                      <Label htmlFor="reference" className="form-label">Référence *</Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="reference"
                        name="reference"
                        value={invoiceData.reference}
                        onChange={(e) => handleInputChange(e)}
                        invalid={!!formErrors.reference}
                      />
                      {formErrors.reference && <FormFeedback>{formErrors.reference}</FormFeedback>}
                    </Col>
                    <Col md={4}>
                      <Label className="form-label">Type de Facture</Label>
                      <Select
                        id="type"
                        name="type"
                        value={referenceData.invoiceTypes.find(option => option.value === invoiceData.type)}
                        onChange={(option) => handleSelectChange(option, "type")}
                        options={referenceData.invoiceTypes}
                        className="select2-selection"
                        isDisabled={referenceData.invoiceTypes.length === 0}
                      />
                    </Col>
                    <Col md={4}>
                      <Label htmlFor="date" className="form-label">Date</Label>
                      <Input
                        type="date"
                        className="form-control"
                        id="date"
                        name="date"
                        value={invoiceData.date}
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Col>
                  </Row>

                  <h5 className="mb-3">Informations Client</h5>
                  <Row className="mb-4">
                    <Col md={4}>
                      <Label htmlFor="client.ifu" className="form-label">IFU/NIU Client</Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="client.ifu"
                        name="ifu"
                        value={invoiceData.client.ifu}
                        onChange={(e) => handleInputChange(e, "client")}
                      />
                    </Col>
                    <Col md={4}>
                      <Label htmlFor="client.name" className="form-label">Nom du Client *</Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="client.name"
                        name="name"
                        value={invoiceData.client.name}
                        onChange={(e) => handleInputChange(e, "client")}
                        invalid={!!formErrors.clientName}
                      />
                      {formErrors.clientName && <FormFeedback>{formErrors.clientName}</FormFeedback>}
                    </Col>
                    <Col md={4}>
                      <Label htmlFor="client.contact" className="form-label">Contact Client</Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="client.contact"
                        name="contact"
                        value={invoiceData.client.contact}
                        onChange={(e) => handleInputChange(e, "client")}
                      />
                    </Col>
                    <Col md={6} className="mt-3">
                      <Label htmlFor="client.address" className="form-label">Adresse Client</Label>
                      <Input
                        type="text"
                        className="form-control"
                        id="client.address"
                        name="address"
                        value={invoiceData.client.address}
                        onChange={(e) => handleInputChange(e, "client")}
                      />
                    </Col>
                    <Col md={6} className="mt-3">
                      <Label htmlFor="client.email" className="form-label">Email Client</Label>
                      <Input
                        type="email"
                        className="form-control"
                        id="client.email"
                        name="email"
                        value={invoiceData.client.email}
                        onChange={(e) => handleInputChange(e, "client")}
                      />
                    </Col>
                  </Row>

                  <h5 className="mb-3">Articles</h5>
                  {formErrors.items && <Alert color="danger">{formErrors.items}</Alert>}
                  {invoiceData.items.map((item, index) => (
                    <Row key={index} className="mb-3 align-items-end">
                      <Col md={4}>
                        <Label htmlFor={`items[${index}].name`} className="form-label">Désignation *</Label>
                        <Input
                          type="text"
                          className="form-control"
                          id={`items[${index}].name`}
                          name="name"
                          value={item.name}
                          onChange={(e) => handleInputChange(e, "items", null, index)}
                          invalid={!!formErrors[`itemName${index}`]}
                        />
                        {formErrors[`itemName${index}`] && <FormFeedback>{formErrors[`itemName${index}`]}</FormFeedback>}
                      </Col>
                      <Col md={2}>
                        <Label htmlFor={`items[${index}].price`} className="form-label">Prix Unitaire *</Label>
                        <Input
                          type="number"
                          className="form-control"
                          id={`items[${index}].price`}
                          name="price"
                          value={item.price}
                          onChange={(e) => handleInputChange(e, "items", null, index)}
                          min="0"
                          step="0.01"
                          invalid={!!formErrors[`itemPrice${index}`]}
                        />
                        {formErrors[`itemPrice${index}`] && <FormFeedback>{formErrors[`itemPrice${index}`]}</FormFeedback>}
                      </Col>
                      <Col md={1}>
                        <Label htmlFor={`items[${index}].quantity`} className="form-label">Quantité *</Label>
                        <Input
                          type="number"
                          className="form-control"
                          id={`items[${index}].quantity`}
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => handleInputChange(e, "items", null, index)}
                          min="1"
                          invalid={!!formErrors[`itemQuantity${index}`]}
                        />
                        {formErrors[`itemQuantity${index}`] && <FormFeedback>{formErrors[`itemQuantity${index}`]}</FormFeedback>}
                      </Col>
                      <Col md={2}>
                        <Label className="form-label">Groupe TVA</Label>
                        <Select
                          id={`items[${index}].tax_group`}
                          name="tax_group"
                          value={referenceData.taxGroups.find(option => option.value === item.tax_group)}
                          onChange={(option) => handleSelectChange({ ...option, name: "tax_group" }, "items", index)}
                          options={referenceData.taxGroups}
                          className="select2-selection"
                          isDisabled={referenceData.taxGroups.length === 0}
                        />
                      </Col>
                      <Col md={2}>
                        <Label className="form-label">Type de Prix</Label>
                        <Select
                          id={`items[${index}].price_type`}
                          name="price_type"
                          value={priceTypeOptions.find(option => option.value === item.price_type)}
                          onChange={(option) => handleSelectChange({ ...option, name: "price_type" }, "items", index)}
                          options={priceTypeOptions}
                          className="select2-selection"
                        />
                      </Col>
                      <Col md={1} className="d-flex align-items-end">
                        {index > 0 && (
                          <Button
                            color="danger"
                            outline
                            type="button"
                            onClick={() => removeItem(index)}
                            className="btn-sm"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </Button>
                        )}
                      </Col>
                    </Row>
                  ))}
                  <Row className="mb-4">
                    <Col>
                      <Button
                        color="primary"
                        outline
                        type="button"
                        onClick={addItem}
                        className="btn-sm"
                      >
                        <i className="ri-add-line align-bottom"></i> Ajouter un Article
                      </Button>
                    </Col>
                    <Col className="text-end">
                      <h5>Total: {calculateTotal().toFixed(2)} </h5>
                    </Col>
                  </Row>

                  <h5 className="mb-3">Paiements</h5>
                  {formErrors.payments && <Alert color="danger">{formErrors.payments}</Alert>}
                  {formErrors.totalMismatch && <Alert color="warning">{formErrors.totalMismatch}</Alert>}
                  {invoiceData.payments.map((payment, index) => (
                    <Row key={index} className="mb-3 align-items-end">
                      <Col md={6}>
                        <Label className="form-label">Mode de Paiement</Label>
                        <Select
                          id={`payments[${index}].type`}
                          name="type"
                          value={referenceData.paymentTypes.find(option => option.value === payment.type)}
                          onChange={(option) => handleSelectChange(option, "payments", index)}
                          options={referenceData.paymentTypes}
                          className="select2-selection"
                          isDisabled={referenceData.paymentTypes.length === 0}
                        />
                      </Col>
                      <Col md={5}>
                        <Label htmlFor={`payments[${index}].amount`} className="form-label">Montant *</Label>
                        <Input
                          type="number"
                          className="form-control"
                          id={`payments[${index}].amount`}
                          name="amount"
                          value={payment.amount}
                          onChange={(e) => handleInputChange(e, "payments", null, index)}
                          min="0"
                          step="0.01"
                          invalid={!!formErrors[`paymentAmount${index}`]}
                        />
                        {formErrors[`paymentAmount${index}`] && <FormFeedback>{formErrors[`paymentAmount${index}`]}</FormFeedback>}
                      </Col>
                      <Col md={1} className="d-flex align-items-end">
                        {index > 0 && (
                          <Button
                            color="danger"
                            outline
                            type="button"
                            onClick={() => removePayment(index)}
                            className="btn-sm"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </Button>
                        )}
                      </Col>
                    </Row>
                  ))}
                  <Row className="mb-4">
                    <Col>
                      <Button
                        color="primary"
                        outline
                        type="button"
                        onClick={addPayment}
                        className="btn-sm"
                      >
                        <i className="ri-add-line align-bottom"></i> Ajouter un Paiement
                      </Button>
                    </Col>
                  </Row>

                  <div className="text-end mt-4">
                    <Button color="primary" type="submit" disabled={isSubmitting || !apiStatus.connected}>
                      {isSubmitting ? (
                        <>
                          <Spinner size="sm" className="me-1" /> Génération en cours...
                        </>
                      ) : (
                        "Générer Facture Normalisée"
                      )}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NormalizedInvoiceForm;