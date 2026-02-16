import React, { useEffect, useState } from "react";

import {
  CardBody,
  Row,
  Col,
  Card,
  Container,
  Form,
  Input,
  Label,
  Table,
  FormFeedback,
} from "reactstrap";

import { Link, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import Select from "react-select";

import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

//redux
import { useDispatch } from "react-redux";
import { addNewInvoice as onAddNewInvoice } from "../../slices/thunks";

const InvoiceCreate = () => {

  const [quantite, setQuantite] = useState(1);
  const [prix, setPrix] = useState(0);
  const [remise, setRemise] = useState(0);
  const [taxe, setTaxe] = useState(0);
  const [montant, setMontant] = useState(0);
  const dispatch = useDispatch();
  const history = useNavigate();
  const handleIncrement = () => setQuantite((prev) => prev + 1);
  const handleDecrement = () => setQuantite((prev) => (prev > 0 ? prev - 1 : 0));

  const [items, setItems] = useState([
    {
      productName: "",
      quantite: 0,
      prix: 0,
      remise: 0,
      taxe: 0,
      montant: 0,
      option: "option1",
    },
  ]);

  const [totalMontant, setTotalMontant] = useState(0);

  // Fonction pour gérer les changements de champ
  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === "productName" || field === "option"
      ? value
      : parseFloat(value) || 0;

    // Recalcul du montant
    const { quantite, prix, remise, taxe } = updatedItems[index];
    updatedItems[index].montant = (quantite * prix) - remise + taxe;

    setItems(updatedItems);
  };

  // Supprimer une ligne
  const deleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  // Ajouter une ligne
  const addItem = () => {
    setItems([
      ...items,
      {
        productName: "",
        quantite: 0,
        prix: 0,
        remise: 0,
        taxe: 0,
        montant: 0,
        option: "option1",
      },
    ]);
  };

  // Calculer le total
  useEffect(() => {
    const total = items.reduce((acc, item) => acc + item.montant, 0);
    setTotalMontant(total);
  }, [items]);

  
  
  

  const [ispaymentDetails, setispaymentDetails] = useState(null);
  const [isCurrency, setisCurrency] = useState("$");

  function handleispaymentDetails(ispaymentDetails) {
    setispaymentDetails(ispaymentDetails);
  }

  function handleisCurrency(isCurrency) {
    setisCurrency(isCurrency);
  }

  const paymentdetails = [
    {
      options: [
        { label: "Payment Method", value: "Payment Method" },
        { label: "Mastercard", value: "Mastercard" },
        { label: "Credit Card", value: "Credit Card" },
        { label: "Visa", value: "Visa" },
        { label: "Paypal", value: "Paypal" },
      ],
    },
  ];

  const allstatus = [
    {
      options: [
        { label: "Select Payment Status", value: "Select Payment Status" },
        { label: "Paid", value: "Paid" },
        { label: "Unpaid", value: "Unpaid" },
        { label: "Refund", value: "Refund" },
      ],
    },
  ];

  const allcurrency = [
    {
      options: [
        { label: "$", value: "($)" },
        { label: "£", value: "(£)" },
        { label: "₹", value: "(₹)" },
        { label: "€", value: "(€)" },
      ],
    },
  ];

  const [count, setCount] = useState(0);
  const [rate, setRate] = useState(0);
  const [tax, setTax] = useState(0);
  const [dis, setDis] = useState(0);
  const [charge, setCharge] = useState(0);

  useEffect(() => {
    const calcul = (quantite * prix) - remise + taxe;
    setMontant(calcul);
  }, [quantite, prix, remise, taxe]);

  const dateFormat = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
  };



  document.title = "Create Invoice | Velzon - React Admin & Dashboard Template";

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      postalcode: "",
      registration: "",
      email: "",
      website: "",
      contact: "",
      invoiceId: "",
      date: "",
      name: "",
      status: "",
      country: "",
      amount: "",
      billing_address: "",
      billing_phone: "",
      billing_taxno: "",
      shipping_name: "",
      shipping_address: "",
      shipping_phone: "",
      shipping_taxno: "",
      product_name: "",
    },
    validationSchema: Yup.object({
      postalcode: Yup.string().required("This field is required"),
      registration: Yup.string().required("Please Enter a registration no"),
      email: Yup.string().required("Please Enter a Email"),
      website: Yup.string().required("Please Enter a website"),
      contact: Yup.string().required("Please Enter a contact number"),
      invoiceId: Yup.string().required("This field is required"),
      name: Yup.string().required("Please Enter a Full name"),
      // country: Yup.string().required("Please Enter a Country"),
      billing_address: Yup.string().required("Please Enter a Address"),
      billing_phone: Yup.string().required("Please Enter a Phone Number"),
      billing_taxno: Yup.string().required("Please Enter a tax Number"),
      shipping_name: Yup.string().required("Please Enter a Full name"),
      shipping_address: Yup.string().required("Please Enter a Address"),
      shipping_phone: Yup.string().required("Please Enter a Phone Number"),
      shipping_taxno: Yup.string().required("Please enter a tax Number"),
      product_name: Yup.string().required("Please Enter a product Name"),
    }),
    onSubmit: (values) => {
      const newInvoice = {
        _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
        postalcode: values.postalcode,
        registration: values.registration,
        email: values.email,
        website: values.website,
        contact: values.contact,
        invoiceId: values.invoiceId,
        date: date,
        name: values.name,
        status: values.status,
        country: "United States of America",
        amount: Math.round(rate * count + tax + charge - dis),
        billing_address: values.billing_address,
        billing_phone: values.billing_phone,
        billing_taxno: values.billing_taxno,
        shipping_name: values.shipping_name,
        shipping_address: values.shipping_address,
        shipping_phone: values.shipping_phone,
        shipping_taxno: values.shipping_taxno,
        product_name: values.product_name,
      };
      dispatch(onAddNewInvoice(newInvoice));
      history("/apps-invoices-list");
      validation.resetForm();
    },
  });

  return (
    <div className="page-content">
              <Container fluid>
              
                <BreadCrumb title="Creer commande " pageTitle="Inawo >>" />
                <div className="card ">
                  <div className="card-body">
                    <form>
                      
                          <div className="row">
                              <div className="row mb-3">
                                
                                <div className="col-md-4">
                                  <label>Id de l'approvisionnement<span className="text-danger"> *</span></label>
                                  <input
                                    type="text"
                                    name="sellingPrice"
                                    className="form-control border border-2"
                                    placeholder=""
                                    
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label>Nom du fournisseur<span className="text-danger"> *</span></label>
                                  <input
                                    type="text"
                                    name="sellingPrice"
                                    className="form-control border border-2"
                                    placeholder=""
                                    
                                  />
                                </div>
                                <div className="col-md-4">
                                  <label>Date d'achat<span className="text-danger"> *</span></label>
                                  <div className="input-group">
                                  <input
                                    type="text"
                                    name="category"
                                    className="form-control border border-2"
                                    placeholder=""
                                    
                                  />
                                  
                                  </div>
                                </div>
                                
                              </div>
                              <div className="row mb-3">
                                  <div className="col-md-4">
                                    <label>Référence<span className="text-danger"> *</span></label>
                                    <input
                                      type="number"
                                      name="quantity"
                                      className="form-control border border-2"
                                      placeholder=""
                                      
                                    />
                                  </div>
                                 
                                  
                                  
                                   <div className="col-md-4">
                                    <label>N facture fournissseur<span className="text-danger"> *</span></label>
                                    <input
                                      type="number"
                                      name="quantity"
                                      className="form-control border border-2"
                                      placeholder=""
                                      
                                    />
                                  </div>
                                  
                                  <div className="col-md-4">
                                    <label>Date de reception<span className="text-danger"> *</span></label>
                                    <input
                                      type="number"
                                      name="quantity"
                                      className="form-control border border-2"
                                      placeholder=""
                                      
                                    />
                                  </div>
                                  
                              </div>
                              
                              
                              <div className="card-body p-4">
                                  <div className="table-responsive">
                                    <table className="invoice-table table table-borderless table-nowrap mb-0">
                                      <thead className="align-middle">
                                        <tr className="table-active">
                                          <th scope="col" >#</th>
                                          <th scope="col">Produit/Service</th>
                                          
                                          <th scope="col" >Quantité</th>
                                          <th scope="col" >Unité</th>
                                          <th scope="col" >Prix</th>
                                          <th scope="col" >Remise</th>
                                          <th scope="col" >Taxe</th>
                                          
                                          <th scope="col" >Montant</th>
                                          <th scope="col" >Source</th>
                                          <th scope="col" ></th>
                                          <th scope="col" className="text-end" ></th>
                                        </tr>
                                      </thead>
                                      <tbody id="newlink">
                                      {items.map((item, index) => (
                                       <tr key={index}>
                                                                          <td>{index + 1}</td>
                                                                          <td>
                                                                            <input
                                                                              type="text"
                                                                              className="form-control"
                                                                              value={item.productName}
                                                                              onChange={(e) =>
                                                                                handleChange(index, "productName", e.target.value)
                                                                              }
                                                                            />
                                                                          </td>
                                                                          <td>
                                                                            <input
                                                                              type="number"
                                                                              className="form-control"
                                                                              value={item.quantite}
                                                                              onChange={(e) =>
                                                                                handleChange(index, "quantite", e.target.value)
                                                                              }
                                                                            />
                                                                          </td>
                                                                          <td>
                                                                            <input
                                                                              type="number"
                                                                              className="form-control"
                                                                              value={item.prix}
                                                                              onChange={(e) =>
                                                                                handleChange(index, "prix", e.target.value)
                                                                              }
                                                                            />
                                                                          </td>
                                                                          <td>
                                                                            <input
                                                                              type="number"
                                                                              className="form-control"
                                                                              value={item.remise}
                                                                              onChange={(e) =>
                                                                                handleChange(index, "remise", e.target.value)
                                                                              }
                                                                            />
                                                                          </td>
                                                                          <td>
                                                                            <input
                                                                              type="number"
                                                                              className="form-control"
                                                                              value={item.taxe}
                                                                              onChange={(e) =>
                                                                                handleChange(index, "taxe", e.target.value)
                                                                              }
                                                                            />
                                                                          </td>
                                                                          <td>
                                                                            <input
                                                                              type="text"
                                                                              className="form-control"
                                                                              value={`$${item.montant.toFixed(2)}`}
                                                                              readOnly
                                                                            />
                                                                          </td>
                                                                          <td>
                                                                            <select
                                                                              className="form-control"
                                                                              value={item.option}
                                                                              onChange={(e) =>
                                                                                handleChange(index, "option", e.target.value)
                                                                              }
                                                                            >
                                                                              <option value="option1">Option 1</option>
                                                                              <option value="option2">Option 2</option>
                                                                              <option value="option3">Option 3</option>
                                                                              <option value="option4">Option 4</option>
                                                                            </select>
                                                                          </td>
                                                                          <td>
                                                                            <button
                                                                              className="btn btn-danger"
                                                                              onClick={() => deleteItem(index)}
                                                                            >
                                                                              Supprimer
                                                                            </button>
                                                                          </td>
                                        </tr>
                                      ))}
                                        <tr>
                                            <td colspan="5">
                                            <button type="button" className="btn btn-primary" onClick={addItem}>Ajouter une ligne</button>
                                            </td>
                                        </tr>
                                        <tr className="border-top border-top-dashed mt-2">
                                          <td colSpan="100%">
                                            <div className="row">
                                              {/* Première colonne : 9/12 */}
                                              <div className="col-lg-9">
                                                <div className="row mb-3">
                                                  <div className="col-md-4">
                                                    <label>Signature name</label>
                                                    <input
                                                      type="text"
                                                      name="signature_name"
                                                      className="form-control border border-2"
                                                      placeholder=""
                                                    />
                                                  </div>
                                                  <div className="col-md-4">
                                                    <label>Notes</label>
                                                    <input
                                                      type="text"
                                                      name="notes"
                                                      className="form-control border border-2"
                                                      placeholder=""
                                                    />
                                                  </div>
                                                </div>
                                                <div className="row">
                                                  <div className="col-md-4">
                                                    <label>Signature</label>
                                                    <input
                                                      type="text"
                                                      name="signature"
                                                      className="form-control border border-2"
                                                      placeholder=""
                                                    />
                                                  </div>
                                                  <div className="col-md-4">
                                                    <label>Termes et conditions</label>
                                                    <input
                                                      type="text"
                                                      name="terms"
                                                      className="form-control border border-2"
                                                      placeholder=""
                                                    />
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Deuxième colonne : 3/12 */}
                                              <div className="col-lg-3 ">
                                                <table className="table table-borderless table-sm table-nowrap align-middle mb-0">
                                                  <tbody>
                                                    <tr>
                                                      <th scope="row">Montant Total</th>
                                                      <td>
                                                        <input
                                                          type="text"
                                                          className="form-control bg-light border-0"
                                                          id="cart-subtotal"
                                                          placeholder="$0.00"
                                                          value={`$${totalMontant.toFixed(2)}`}
                                                          readOnly
                                                        />
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <th scope="row">Remise</th>
                                                      <td>
                                                        <input
                                                          type="text"
                                                          className="form-control bg-light border-0"
                                                          id="cart-discount"
                                                          placeholder="$0.00"
                                                          readOnly
                                                        />
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <th scope="row">Montant à Payer</th>
                                                      <td>
                                                        <input
                                                          type="text"
                                                          className="form-control bg-light border-0"
                                                          id="cart-tax"
                                                          placeholder="$0.00"
                                                          readOnly
                                                        />
                                                      </td>
                                                    </tr>
                                                    <tr>
                                                      <th scope="row">Montant Payé</th>
                                                      <td>
                                                        <input
                                                          type="text"
                                                          className="form-control bg-light border-0"
                                                          id="cart-shipping"
                                                          placeholder="$0.00"
                                                          readOnly
                                                        />
                                                      </td>
                                                    </tr>
                                                    <tr className="border-top border-top-dashed">
                                                      <th scope="row">Montant Restant</th>
                                                      <td>
                                                        <input
                                                          type="text"
                                                          className="form-control bg-light border-0"
                                                          id="cart-total"
                                                          placeholder="$0.00"
                                                          readOnly
                                                        />
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>

                                        
                                      </tbody>
                                    </table>
                                  </div>

                              </div>

                          </div>
                      
    
                          <div className="col-12 text-end">
                            <button type="reset" className="btn btn-secondary me-2">
                              Retour
                            </button>
                            <button type="submit" className="btn btn-primary">
                              Ajouter produit
                            </button>
                          </div>
                    </form>
                  </div>
                </div>
              </Container>
            </div>
  );
};

export default InvoiceCreate;
