import React, { useState, useEffect } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Input,
  Label,
  FormFeedback,
  Form,
  Spinner,
} from "reactstrap";

// Redux
import { useDispatch } from "react-redux";
import { addNewProduct as onAddNewProduct } from "../../../slices/thunks";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import classnames from "classnames";
import Dropzone from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

// Import React FilePond
import { registerPlugin } from "react-filepond";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EcommerceAddProduct = ({
  isEditMode = false,
  initialFormData = {},
  onSubmit,
}) => {
  const [loadingApis, setLoadingApis] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "20px",
      border: "2px solid #dee2e6",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#dee2e6",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "20px",
      border: "2px solid #dee2e6",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#405189" : "white",
      color: state.isSelected ? "white" : "#212529",
      "&:hover": {
        backgroundColor: "#f8f9fa",
      },
    }),
  };

  // fonctions utilitaires pour générer un code aléatoire
  const generateRandomCode = (length = 8) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // génère et remplit le code barre
  const handleGenerateBarcode = () => {
    const code = generateRandomCode(12);
    setFormData({ ...formData, barcode: code });
  };

  // génère et remplit le code service
  const handleGenerateProductCode = () => {
    const code = generateRandomCode(10);
    setFormData({ ...formData, productCode: code });
  };

  const history = useNavigate();
  const dispatch = useDispatch();

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const [selectedFiles, setselectedFiles] = useState([]);
  const [selectedVisibility, setselectedVisibility] = useState(null);

  const [categoriesOptions, setCategoriesOptions] = useState([]);
  const [taxOptions, setTaxOptions] = useState([]);
  const [unitsOptions, setUnitsOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // --- nouveaux états pour groupes/magasins ---
  const [groupOptions, setGroupOptions] = useState([]);
  const [magasinsOptions, setMagasinsOptions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [image, setImage] = useState(null);

  // étendre formData pour stocker groupId et magasinId
  const [formData, setFormData] = useState({
    itemType: "product",
    productName: "",
    productCode: "",
    category: "",
    sellingPrice: "",
    purchasePrice: "",
    quantity: "",
    units: "",
    discountType: "",
    barcode: "",
    alertQuantity: "",
    tax: "",
    description: "<p>Describe the service you offer...</p>",
    productImage: null,
    groupId: "",
    magasinId: "",
    date_debut: "",
  });

  // Premier useEffect pour initialiser le formulaire avec les données initiales
  useEffect(() => {
    if (initialFormData && Object.keys(initialFormData).length > 0) {
      console.log("Initializing form with:", initialFormData);
      setFormData({
        itemType: initialFormData.itemType || "product",
        productName: initialFormData.productName || "",
        productCode: initialFormData.productCode || "",
        category: initialFormData.category || "",
        sellingPrice: initialFormData.sellingPrice || "",
        purchasePrice: initialFormData.purchasePrice || "",
        quantity: initialFormData.quantity || "",
        units: initialFormData.units || "",
        discountType: initialFormData.discountType || "",
        barcode: initialFormData.barcode || "",
        alertQuantity: initialFormData.alertQuantity || "",
        tax: initialFormData.tax || "",
        description: initialFormData.description || "<p>Describe the service you offer...</p>",
        productImage: initialFormData.productImage || null,
        groupId: initialFormData.groupId || "",
        magasinId: initialFormData.magasinId || "",
        date_debut: initialFormData.date_debut || "",
      });

      if (initialFormData.productImage) {
        setImage(
          typeof initialFormData.productImage === "string"
            ? `https://inawoapiv3.inawo.pro${initialFormData.productImage}`
            : initialFormData.productImage
        );
      }
    }
  }, [initialFormData]);

  // Second useEffect pour charger les données des APIs
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingApis(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Données locales immédiates
      setGroupOptions(
        user.groupes?.map((g) => ({ value: g.id, label: g.nom })) || []
      );
      setMagasinsOptions(
        user.magasins?.map((m) => ({ value: m.id, label: m.nom })) || []
      );
      setLoadingProgress(30);

      try {
        // Chargement en parallèle avec suivi de progression
        const [categories, taxes, units] = await Promise.all([
          fetch("https://inawoapiv3.inawo.pro/stocks/createlistecategories/", {
            headers,
          })
            .then((res) => res.json())
            .then((data) => {
              setLoadingProgress(60);
              return data;
            }),
          fetch("https://inawoapiv3.inawo.pro/facture/taxe/", { headers })
            .then((res) => res.json())
            .then((data) => {
              setLoadingProgress(80);
              return data;
            }),
          fetch("https://inawoapiv3.inawo.pro/stocks/unites/", { headers })
            .then((res) => res.json())
            .then((data) => {
              setLoadingProgress(90);
              return data;
            }),
        ]);

        setCategoriesOptions(
          categories.map((item) => ({ value: item.id, label: item.nom }))
        );
        setTaxOptions(
          taxes.map((item) => ({ value: item.id, label: item.nom }))
        );
        setUnitsOptions(
          units.map((item) => ({ value: item.id, label: item.nom }))
        );
      } catch (err) {
        console.error("Erreur fetch listes :", err);
      } finally {
        setLoadingProgress(100);
        setTimeout(() => setLoadingApis(false), 300);
      }
    };

    loadData();
  }, []);

  const handleSelectGroup = (opt) => {
    setSelectedGroup(opt);
    setFormData((fd) => ({ ...fd, groupId: opt.value, magasinId: "" }));
  };

  const handleSelectMagasin = (opt) => {
    setSelectedGroup(null);
    setFormData((fd) => ({ ...fd, magasinId: opt.value, groupId: "" }));
  };

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  function handleSelectVisibility(selectedVisibility) {
    setselectedVisibility(selectedVisibility);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const dateFormat = () => {
    let d = new Date(),
      months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
    let h = d.getHours() % 12 || 12;
    let ampm = d.getHours() < 12 ? "AM" : "PM";
    return (
      d.getDate() +
      " " +
      months[d.getMonth()] +
      ", " +
      d.getFullYear() +
      ", " +
      h +
      ":" +
      d.getMinutes() +
      " " +
      ampm
    ).toString();
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const dateString = e.toString().split(" ");
    let time = dateString[4];
    let H = +time.substr(0, 2);
    let h = H % 12 || 12;
    h = h <= 9 ? (h = "0" + h) : h;
    let ampm = H < 12 ? "AM" : "PM";
    time = h + time.substr(2, 3) + " " + ampm;

    const date = dateString[2] + " " + dateString[1] + ", " + dateString[3];
    const orderDate = (date + ", " + time).toString();
    setDate(orderDate);
  };

  const handleImageChange = React.useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setFormData((fd) => ({ ...fd, productImage: file }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditMode && onSubmit) {
        await onSubmit(formData);
      } else {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token non trouvé");

        const formDataToSend = new FormData();

        // Ajoutez toutes les données du formulaire
        formDataToSend.append("code", formData.productCode);
        formDataToSend.append("nom", formData.productName);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("codebare", formData.barcode);
        formDataToSend.append("prix_achat", formData.purchasePrice);
        formDataToSend.append("unite", formData.units);
        formDataToSend.append("seuil", formData.alertQuantity);
        formDataToSend.append("statut", "disponible");
        formDataToSend.append("remise", formData.discountType || "0");
        formDataToSend.append("taxe", formData.tax);
        formDataToSend.append("categorie", formData.category);

        if (formData.magasinId) {
          formDataToSend.append("magasin", formData.magasinId);
        } else if (formData.groupId) {
          formDataToSend.append("groupe", formData.groupId);
        }

        formDataToSend.append(
          "quantite",
          formData.itemType === "service" ? 0 : formData.quantity
        );
        formDataToSend.append("prix_vente", formData.sellingPrice);
        formDataToSend.append("date_debut", formData.date_debut || "");
        formDataToSend.append("date_fin", "2025-12-31");
        formDataToSend.append("type_article", formData.itemType);

        if (formData.productImage) {
          formDataToSend.append("image_principale", formData.productImage);
        }

        selectedFiles.forEach((file) => {
          formDataToSend.append("produit_image", file);
        });

        const response = await fetch(
          "https://inawoapiv3.inawo.pro/stocks/produits/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erreur lors de l'ajout");
        }

        const result = await response.json();
        navigate("/suite.inawo.pro/mon_entreprise/services");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert(`Erreur lors de l'${isEditMode ? 'modification' : 'ajout'} du service: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Modifiez le titre du BreadCrumb
  document.title = isEditMode
    ? "Modifier Service | INAWO - Suite de Gestion"
    : "Créer Service | INAWO - Suite de Gestion";

  const productVisibility = [
    {
      options: [
        { label: "Hidden", value: "Hidden" },
        { label: "Public", value: "Public" },
      ],
    },
  ];
  const [selectedOption, setSelectedOption] = useState("");

  console.log("Initial Form Data:", initialFormData);
  console.log("Current Form Data:", formData);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      price: "",
      stock: "",
      orders: "",
      category: "",
      publishedDate: "",
      status: "",
      rating: 4.5,
      manufacturer_name: "",
      manufacturer_brand: "",
      product_discount: "",
      meta_title: "",
      meta_keyword: "",
      product_tags: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter a Product Title"),
      price: Yup.string().required("Please Enter a Product Price"),
      stock: Yup.string().required("Please Enter a Product stock"),
      orders: Yup.string().required("Please Enter a Product orders"),
      category: Yup.string().required("Please Enter a Product category"),
      status: Yup.string().required("Please Enter a Product status"),
      manufacturer_name: Yup.string().required(
        "Please Enter a Manufacturer Name"
      ),
      manufacturer_brand: Yup.string().required(
        "Please Enter a Manufacturer Brand"
      ),
      product_discount: Yup.string().required(
        "Please Enter a Product Discount"
      ),
      meta_title: Yup.string().required("Please Enter a Meta Title"),
      meta_keyword: Yup.string().required("Please Enter a Meta Keyword"),
      product_tags: Yup.string().required("Please Enter a Product Tags"),
    }),
    onSubmit: (values) => {
      const newProduct = {
        _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
        name: values.name,
        price: values.price,
        stock: values.stock,
        orders: values.orders,
        category: values.category,
        publishedDate: date,
        status: values.status,
        rating: 4.5,
      };
      dispatch(onAddNewProduct(newProduct));
      history("/apps-ecommerce-products");
      validation.resetForm();
    },
  });

  if (loadingApis) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          zIndex: 9999,
        }}
      >
        <div className="text-center">
          <Spinner
            color="primary"
            style={{
              width: "3rem",
              height: "3rem",
              borderWidth: "0.3em",
            }}
          />
          <p className="mt-2">Chargement des données nécessaires...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="page-content">
      <Container fluid>
           <>
                          <BreadCrumb
                            title='&nbsp;{isEditMode ? "Modifier Service" : "Créer Service"}' // &nbsp; avant "Contact"
                            pageTitle={
                              <>
                                <i className="ri-shopping-bag-3-line"></i>
                                &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                              </>
                            }
                          />
                        </>
        <div className="card " style={{ borderRadius: "20px" }}>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="row align-items-center mb-3">
                  <div className="col-md-4">
                    <label>
                      Item Type <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex gap-3">
                      <div
                        className="border border-2 px-3 py-1 rounded d-flex align-items-center "
                        style={{ width: "45%" }}
                      >
                        <label className="custom_radio text-nowrap mt-1 mb-1">
                          <input
                            type="radio"
                            name="itemType"
                            value="product"
                            checked={formData.itemType === "product"}
                            onChange={handleChange}
                            className=" me-2"
                            style={{ borderRadius: "20px" }}
                          />
                          <span className="checkmark">Produit</span>
                        </label>
                      </div>

                      <div
                        className="border border-2 px-3 py-1 rounded d-flex align-items-center "
                        style={{ width: "49%" }}
                      >
                        <label className="custom_radio text-nowrap mt-1 mb-1">
                          <input
                            type="radio"
                            name="itemType"
                            value="service"
                            checked={formData.itemType === "service"}
                            onChange={handleChange}
                            className=" me-2"
                            style={{ borderRadius: "20px" }}
                          />
                          <span className="checkmark">Service</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4  " style={{ width: "32%" }}>
                    <label>
                      Nom<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="productName"
                      className="form-control border border-2"
                      value={formData.productName}
                      onChange={handleChange}
                      style={{ borderRadius: "20px" }}
                    />
                  </div>
                  <div className="col-md-4" style={{ width: "33%" }}>
                    <label>Code Service</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control border border-2"
                        name="productCode"
                        value={formData.productCode}
                        onChange={handleChange}
                        style={{ borderRadius: "20px 0 0 20px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleGenerateProductCode}
                        style={{ borderRadius: "0 20px 20px 0 " }}
                      >
                        Générer
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label>
                        Prix de Vente <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        name="sellingPrice"
                        className="form-control border border-2"
                        placeholder="Enter Selling Price"
                        value={formData.sellingPrice}
                        onChange={handleChange}
                        style={{ borderRadius: "20px" }}
                      />
                    </div>
                    <div className="col-md-4">
                      <label>
                        Date Création<span className="text-danger"> *</span>
                      </label>
                      <input
                        type="date"
                        name="date_debut"
                        className="form-control border border-2"
                        placeholder="Enter Creation Date"
                        value={formData.date_debut}
                        onChange={handleChange}
                        style={{ borderRadius: "20px" }}
                      />
                    </div>
                   <div className="col-md-4">
                      <label>
                        Categorie <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={categoriesOptions}
                        value={
                          categoriesOptions.find(
                            (opt) => opt.value == formData.category
                          ) || null
                        }
                        onChange={(opt) =>
                          setFormData({ ...formData, category: opt.value })
                        }
                        placeholder="Select Catégorie"
                        isDisabled={formData.itemType === "service"}
                        styles={customSelectStyles}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label>
                        Quantite <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        className="form-control border border-2"
                        placeholder="Enter Quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        disabled={formData.itemType === "service"}
                        style={{
                          borderRadius: "20px",
                          opacity: formData.itemType === "service" ? 0.5 : 1,
                        }}
                      />
                    </div>

                    <div className="col-md-4">
                      <div className="input-block mb-3">
                        <label>Discount Type</label>

                        <select
                          className="form-select mb-3"
                          aria-label="Default select example"
                          name="discountType"
                          value={formData.discountType}
                          onChange={handleChange}
                          style={{ borderRadius: "20px" }}
                        >
                          <option value="">Select Discount Type</option>
                          <option value="0">None (0)</option>{" "}
                          {/* Example if 0 is a valid remise */}
                          <option value="1">
                            Declined Payment (Placeholder)
                          </option>
                          <option value="2">
                            Delivery Error (Placeholder)
                          </option>
                          <option value="3">Wrong Amount (Placeholder)</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4" style={{ borderRadius: "20px" }}>
                      <label>Unité</label>
                      <Select
                        options={unitsOptions}
                        value={
                          unitsOptions.find(
                            (opt) => opt.value === formData.units
                          ) || null
                        }
                        onChange={(opt) =>
                          setFormData({ ...formData, units: opt.value })
                        }
                        placeholder="Select Unité"
                        isDisabled={formData.itemType === "service"}
                        styles={customSelectStyles}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label>prix_achat</label>
                      <input
                        type="text"
                        name="purchasePrice" // Changed name to purchasePrice
                        className="form-control border border-2"
                        placeholder="Enter Purchase Price" // Changed placeholder
                        value={formData.purchasePrice} // Changed value to formData.purchasePrice
                        onChange={handleChange}
                        style={{ borderRadius: "20px" }}
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Stock d'alerte</label>
                      <input
                        type="number"
                        name="alertQuantity" // Changed name to alertQuantity
                        className="form-control border border-2"
                        placeholder="Enter Alert Quantity" // Changed placeholder
                        value={formData.alertQuantity} // Changed value to formData.alertQuantity
                        onChange={handleChange} // Use handleChange
                        disabled={formData.itemType === "service"}
                        style={{
                          borderRadius: "20px",
                          opacity: formData.itemType === "service" ? 0.5 : 1,
                        }}
                      />
                    </div>

                    <div className="col-md-4">
                      <label>Taxe</label>
                      <Select
                        options={taxOptions}
                        value={
                          taxOptions.find((opt) => opt.value == formData.tax) ||
                          null
                        }
                        onChange={(opt) =>
                          setFormData({ ...formData, tax: opt.value })
                        }
                        placeholder="Select Taxe"
                        styles={customSelectStyles}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label>
                        Succursale <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={groupOptions}
                        value={
                          groupOptions.find(
                            (opt) => opt.value === formData.groupId
                          ) || null
                        }
                        onChange={handleSelectGroup}
                        placeholder="Select Succursale"
                        styles={customSelectStyles}
                        isDisabled={!!formData.magasinId}
                      />
                    </div>

                    <div className="col-md-4">
                      <label>
                        Magasin <span className="text-danger">*</span>
                      </label>
                      <Select
                        options={magasinsOptions}
                        value={
                          magasinsOptions.find(
                            (opt) => opt.value === formData.magasinId
                          ) || null
                        }
                        onChange={handleSelectMagasin}
                        styles={customSelectStyles}
                        placeholder="Select Magasin"
                        isDisabled={!!formData.groupId}
                      />
                    </div>

                    <div className="col-md-4">
                      <label>Code Barre</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control border border-2"
                          name="barcode" // Added name attribute
                          value={formData.barcode} // Bind to formData.barcode
                          onChange={handleChange} // Use handleChange
                          style={{ borderRadius: "20px 0 0 20px " }}
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleGenerateBarcode}
                          style={{ borderRadius: "0 20px 20px 0 " }}
                        >
                          Générer
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <div className="card h-100 border border-2">
                        <div className="card-body">
                          <label>
                            Service Description{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <CKEditor
                            editor={ClassicEditor}
                            data={formData.description}
                            style={{ borderRadius: "20px" }}
                            onChange={(event, editor) => {
                              const data = editor.getData();
                              setFormData((fd) => ({
                                ...fd,
                                description: data,
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="card h-100 border border-2">
                        <div className="card-body">
                          <h5 className="fs-14 mb-1">Image Principale</h5>
                          <p className="text-muted">
                            Ajoutez l’image principale du Service.
                          </p>
                          <div className="text-center">
                            <div className="position-relative d-inline-block">
                              <input
                                type="file"
                                id="product-image-input"
                                accept="image/png, image/jpeg, image/gif"
                                className="d-none"
                                onChange={handleImageChange}
                                style={{ borderRadius: "20px" }}
                              />
                              <label
                                htmlFor="product-image-input"
                                className="position-absolute top-100 start-100 translate-middle cursor-pointer"
                              >
                                <div className="avatar-xs">
                                  <div className="avatar-title bg-light border rounded-circle text-muted">
                                    <i className="ri-image-fill"></i>
                                  </div>
                                </div>
                              </label>

                              <div className="avatar-lg">
                                <div className="avatar-title bg-light rounded">
                                  {image ? (
                                    <img
                                      src={
                                        typeof image === "string"
                                          ? image
                                          : URL.createObjectURL(image)
                                      }
                                      alt="Service"
                                      className="avatar-md h-auto rounded"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                          "/path/to/default/image.jpg";
                                      }}
                                    />
                                  ) : (
                                    <p className="text-muted">
                                      Aucune image sélectionnée
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card h-100 border border-2">
                        <div className="card-body">
                          <div className="mb-4">
                            <h5 className="fs-14 mb-1">Image secondaire</h5>
                            <p className="text-muted">
                              Add Product main Image.
                            </p>
                          </div>
                          <div>
                            <Dropzone
                              onDrop={(acceptedFiles) => {
                                handleAcceptedFiles(acceptedFiles);
                              }}
                            >
                              {({ getRootProps, getInputProps }) => (
                                <div className="dropzone dz-clickable">
                                  <div
                                    className="dz-message needsclick"
                                    {...getRootProps()}
                                  >
                                    <input {...getInputProps()} />
                                    <div className="mb-3">
                                      <i className="display-4 text-muted ri-upload-cloud-2-fill"></i>
                                    </div>
                                    <h5>Drop files here or click to upload.</h5>
                                  </div>
                                </div>
                              )}
                            </Dropzone>
                            <ul
                              className="list-unstyled mb-0"
                              id="dropzone-preview"
                            >
                              {selectedFiles.map((f, i) => {
                                return (
                                  <li className="mt-2" key={i + "-file"}>
                                    <div className="border rounded">
                                      <div className="d-flex p-2">
                                        <div className="flex-shrink-0 me-3">
                                          <div className="avatar-sm bg-light rounded">
                                            <img
                                              data-dz-thumbnail=""
                                              className="img-fluid rounded d-block"
                                              src={f.preview}
                                              alt={f.name}
                                            />
                                          </div>
                                        </div>
                                        <div className="flex-grow-1">
                                          <div className="pt-1">
                                            <h5
                                              className="fs-14 mb-1"
                                              data-dz-name=""
                                            >
                                              {f.name}
                                            </h5>
                                            <p
                                              className="fs-13 text-muted mb-0"
                                              data-dz-size=""
                                            >
                                              {f.formattedSize}
                                            </p>
                                            <strong
                                              className="error text-danger"
                                              data-dz-errormessage=""
                                            ></strong>
                                          </div>
                                        </div>
                                        <div className="flex-shrink-0 ms-3">
                                          <button
                                            data-dz-remove=""
                                            className="btn btn-sm btn-danger"
                                            onClick={() => {
                                              const newSelectedFiles = [
                                                ...selectedFiles,
                                              ];
                                              newSelectedFiles.splice(i, 1);
                                              setselectedFiles(
                                                newSelectedFiles
                                              );
                                            }}
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 text-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() =>
                    navigate("http://inawoapiv3.inawo.pro/facture/service/")
                  }
                  style={{ borderRadius: "20px" }}
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ borderRadius: "20px" }}
                >
                  {submitting ? <Spinner size="sm" className="me-2" /> : null}
                  {isEditMode ? "Mettre à jour" : "Ajouter Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EcommerceAddProduct;
