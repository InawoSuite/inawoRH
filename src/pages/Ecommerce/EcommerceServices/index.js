// import React, { useState, useEffect } from "react"; // Added useEffect
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardHeader,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Form,
//   Input,
//   Label,
//   ButtonGroup,
//   Button,
//   Spinner // Added Spinner
// } from "reactstrap";
// import BreadCrumb from "../../../Components/Common/BreadCrumb";
// import { Link } from "react-router-dom";

// const EcommerceProducts = () => {
//   // États
//   const [products, setProducts] = useState([]); // To store products from API
//   const [loading, setLoading] = useState(true); // For loading state
//   const [modal, setModal] = useState(false);
//   const [search, setSearch] = useState("");
//   const [isEdit, setIsEdit] = useState(false);
//   const [isExportCSV, setIsExportCSV] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [activeTab, setActiveTab] = useState("all");
//   const [formData, setFormData] = useState({
//     nom: "",
//     categorie: "",
//     type: "",
//     unite: "",
//     prixVente: ""
//   });

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const userString = localStorage.getItem("user");

//       if (!token || !userString) {
//         console.error("User data or token not found in localStorage");
//         setLoading(false);
//         // Potentially redirect to login or show an error message
//         return;
//       }

//       try {
//         const user = JSON.parse(userString);
//         const userId = user.id;

//         if (!userId) {
//           console.error("User ID not found in user data");
//           setLoading(false);
//           return;
//         }

//         const response = await fetch(`https://inawoapiv3.inawo.pro/stocks/produits/utilisateur/${userId}/`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Failed to fetch products:", error);
//         // Handle error (e.g., show error message to user)
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Gestion des sélections
//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedItems(filteredData.map(item => item.id));
//     } else {
//       setSelectedItems([]);
//     }
//   };

//   const handleSelectItem = (itemId) => {
//     if (selectedItems.includes(itemId)) {
//       setSelectedItems(selectedItems.filter(id => id !== itemId));
//     } else {
//       setSelectedItems([...selectedItems, itemId]);
//     }
//   };

//   // Filtrage des données
//   const filteredData = products.filter(item => { // Changed staticData to products
//     const itemPrixVente = item.grilles_tarifaires && item.grilles_tarifaires.length > 0 ? item.grilles_tarifaires[0].prix_vente : "N/A";
//     const itemCategorie = item.categorie ? item.categorie.toString() : "N/A"; // Assuming categorie is an ID for now
//     const itemUnite = item.unite ? item.unite.toString() : "N/A"; // Assuming unite is an ID for now

//     const searchString = `${item.nom} ${itemCategorie} ${itemUnite} ${itemPrixVente} ${item.created_at}`.toLowerCase();
//     const matchesSearch = searchString.includes(search.toLowerCase());

//     // const matchesSearch = Object.values(item).some( // Original search logic might need adjustment for nested data
//     //   value => value.toString().toLowerCase().includes(search.toLowerCase())
//     // );
//     const matchesTab = activeTab === "all"; // Simplified tab logic for now, adjust if status is used
//     return matchesSearch && matchesTab;
//   });

//   // Toggle modal
//   const toggle = () => setModal(!modal);

//   document.title = "Produits | INAWO - Suite de Gestion"

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <BreadCrumb title="Produits" pageTitle="Stock" />

//         <Row>
//           <div className="col-lg-12" >
//             <div className="card" style={{ borderRadius: "70px" }}>
//               <div className="card-header" style={{
//                 borderRadius: "70px 70px 70px 70px",
//                 borderBottom: "none"
//               }}>
//                 <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
//                   <div className="col-md-4">
//                     <div className="search-box">
//                       <input
//                         type="text"
//                         className="form-control search"
//                         placeholder="Liste des Produits"
//                         style={{ borderRadius: "20px" }}
//                         // value={searchTerm}
//                         // onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                       <i className="ri-search-line search-icon"></i>
//                     </div>
//                   </div>

//                   <div className="flex-shrink-0">
//                     <div className="hstack text-nowrap gap-1">
//                       <div className="flex-grow-1">
//                         {/* <button
//                           className="btn btn-info add-btn"
//                           data-bs-target="#showModal"
//                           style={{ borderRadius: '20px' }}
//                           onClick={() => { setIsEdit(false); toggle(); }}                        >
//                           <i className="ri-file-add-line me-1  align-bottom"></i>
//                           Nouveau Service
//                         </button> */}
//                         <Link to="/apps-ecommerce-add-product" className="btn btn-success">
//                   <i className="ri-add-line align-bottom me-1"></i>
//                   Nouveau Service
//                 </Link>
//                       </div>

//                       <button
//                         className="btn btn-success add-btn"
//                         data-bs-toggle=""
//                         data-bs-target="#showModal"
//                         type="button" onClick={() => setIsExportCSV(true)} style={{ borderRadius: '20px', overflow: 'hidden' }}
//                         contentClassName="rounded-modal"
//                       >
//                         <i className="ri-file-upload-line me-1 align-bottom"></i>
//                         Exporter
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <Col lg={12}>
//             <Card style={{borderRadius:"20px"}}>

//               <div className="card-body">
//                 {loading ? (
//                   <div className="text-center">
//                     <Spinner color="primary" />
//                     <p>Chargement des produits...</p>
//                   </div>
//                 ) : (
//                 <div className="table-responsive">
//                   <table className="table table-hover align-middle">
//                     <thead className="table-light">
//                       <tr>
//                         <th style={{width: "40px"}}>

//                         </th>
//                         <th>N°</th>
//                         <th>Nom</th>
//                         <th>Catégorie </th>
//                         {/* <th>Type</th> Type is not in API response */}
//                         <th>Unité </th>
//                         <th>Prix de vente</th>
//                         <th>Date de création</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredData.map((item) => (
//                         <tr key={item.id}>
//                           <td>

//                           </td>
//                           <td>{item.id}</td>
//                           <td>{item.nom}</td>
//                           <td>{item.categorie}</td> {/* Displaying ID, needs mapping for name */}
//                           {/* <td>{item.type}</td> Type removed */}
//                           <td>{item.unite}</td> {/* Displaying ID, needs mapping for name */}
//                           <td>
//                             {(item.grilles_tarifaires && item.grilles_tarifaires.length > 0
//                               ? parseFloat(item.grilles_tarifaires[0].prix_vente).toLocaleString()
//                               : "N/A") + " "}
//                           </td>
//                           <td>{new Date(item.created_at).toLocaleDateString()}</td>
//                           <td>
//                             <ButtonGroup>
//                               <Button color="primary" size="sm" className="btn-soft-primary">
//                                 <i className="ri-pencil-fill"></i>
//                               </Button>
//                               <Button color="danger" size="sm" className="btn-soft-danger">
//                                 <i className="ri-delete-bin-line"></i>
//                               </Button>
//                             </ButtonGroup>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 )}
//               </div>
//             </Card>
//           </Col>
//         </Row>

//       </Container>
//     </div>
//   );
// };

// export default EcommerceProducts;

import React, { useEffect, useState, useMemo } from "react";

import {
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Nav,
  NavItem,
  NavLink,
  UncontrolledCollapse,
  Row,
  Card,
  CardHeader,
  Spinner,
  Button,
  Col,
  Input,
} from "reactstrap";
import classnames from "classnames";

// RangeSlider
import Nouislider from "nouislider-react";
import DeleteModal from "../../../Components/Common/DeleteModal";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
// import { Rating, Published, Price } from "./EcommerceProductCol";
//Import data
import { productsData } from "../../../common/data";

//Import actions
import {
  getProducts as onGetProducts,
  deleteProducts,
} from "../../../slices/thunks";
import { isEmpty } from "lodash";
import Select from "react-select";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { createSelector } from "reselect";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import { Hd24Filled } from "@fluentui/react-icons";

const SingleOptions = [
  { value: "Watches", label: "Watches" },
  { value: "Headset", label: "Headset" },
  { value: "Sweatshirt", label: "Sweatshirt" },
  { value: "20% off", label: "20% off" },
  { value: "4 star", label: "4 star" },
];

const EcommerceProducts = (props) => {
  const dispatch = useDispatch();

  const selectecomproductData = createSelector(
    (state) => state.Ecommerce,
    (products) => products.products
  );
  // Inside your component
  const products = useSelector(selectecomproductData);

  const [productList, setProductList] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedMulti, setselectedMulti] = useState(null);
  const [product, setProduct] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const [produitsList, setProduitsList] = useState([]);
  const [loadingProduits, setLoadingProduits] = useState(true);
  const [errorProduits, setErrorProduits] = useState(null);
  const { userProfile, token } = useProfile();
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
  });

  useEffect(() => {
    if (produitsList.length > 0) {
      setStats({
        total: produitsList.length,
        published: produitsList.filter((p) => p.publier === true).length,
        draft: produitsList.filter((p) => p.publier !== true).length,
      });
      setProductList(produitsList);
    }
  }, [produitsList]);

  function handleMulti(selectedMulti) {
    setselectedMulti(selectedMulti);
  }

  // useEffect(() => {
  //   if (products && !products.length) {
  //     dispatch(onGetProducts());
  //   }
  // }, [dispatch, products]);

  // useEffect(() => {
  //   setProductList(products);
  // }, [products]);

  // useEffect(() => {
  //   if (!isEmpty(products)) setProductList(products);
  // }, [products]);

  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      let filteredProducts = produitsList; // Utilisez produitsList au lieu de products

      if (type === "published") {
        filteredProducts = produitsList.filter(
          (product) => product.publier === true
        );
      }
      setProductList(filteredProducts);
    }
  };

  const [cate, setCate] = useState("all");

  const categories = (category) => {
    let filteredProducts = products;
    if (category !== "all") {
      filteredProducts = products.filter(
        (product) => product.category === category
      );
    }
    setProductList(filteredProducts);
    setCate(category);
  };

  console.log("Les catégories sont:", categoriesList);
  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoadingCategories(true);
      const response = await fetch(
        "https://inawoapiv3.inawo.pro/stocks/createlistecategories/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Erreur de chargement des catégories");
      const data = await response.json();
      setCategoriesList(data);
      setLoadingCategories(false);
    } catch (error) {
      setErrorCategories(error.message);
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  console.log("Token", token);

  console.log("Les produits sont:", produitsList);
  const fetchProduits = async () => {
    const token = localStorage.getItem("token");
    console.log("Token", token);
    try {
      setLoadingProduits(true);
      const response = await fetch(
        "https://inawoapiv3.inawo.pro/facture/service_utilisateur/" +
          userProfile.id +
          "/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Erreur de chargement des produits");
      const data = await response.json();
      setProduitsList(data);
      setLoadingProduits(false);
    } catch (error) {
      setErrorProduits(error.message);
      setLoadingProduits(false);
    }
  };

  useEffect(() => {
    if (userProfile?.id) {
      fetchProduits();
    }
  }, [userProfile?.id]);

  const [ratingvalues, setRatingvalues] = useState([]);

  const onChangeRating = (value) => {
    setProductList(productsData.filter((product) => product.rating >= value));

    var modifiedRating = [...ratingvalues];
    modifiedRating.push(value);
    setRatingvalues(modifiedRating);
  };

  const onUncheckMark = (value) => {
    var modifiedRating = [...ratingvalues];
    const modifiedData = (modifiedRating || []).filter((x) => x !== value);
    /*
    find min values
    */
    var filteredProducts = productsData;
    if (modifiedData && modifiedData.length && value !== 1) {
      var minValue = Math.min(...modifiedData);
      if (minValue && minValue !== Infinity) {
        filteredProducts = productsData.filter(
          (product) => product.rating >= minValue
        );
        setRatingvalues(modifiedData);
      }
    } else {
      filteredProducts = productsData;
    }
    setProductList(filteredProducts);
  };

  //delete order
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const onClickDelete = (product) => {
    setProduct(product);
    setDeleteModal(true);
  };

  const handleDeleteProduct = () => {
    if (product) {
      dispatch(deleteProducts(product._id));
      setDeleteModal(false);
    }
  };

  const [dele, setDele] = useState(0);

  // Displat Delete Button
  const displayDelete = () => {
    const ele = document.querySelectorAll(".productCheckBox:checked");
    const del = document.getElementById("selection-element");
    setDele(ele.length);
    if (ele.length === 0) {
      del.style.display = "none";
    } else {
      del.style.display = "block";
    }
  };

  // Delete Multiple
  const deleteMultiple = () => {
    const ele = document.querySelectorAll(".productCheckBox:checked");
    const del = document.getElementById("selection-element");
    ele.forEach((element) => {
      dispatch(deleteProducts(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
      del.style.display = "none";
    });
  };

  // const columns = useMemo(
  //   () => [
  //     {
  //       header: "#",
  //       accessorKey: "id",
  //       enableColumnFilter: false,
  //       enableSorting: false,
  //       cell: (cell) => {
  //         return (
  //           <input
  //             type="checkbox"
  //             className="productCheckBox form-check-input"
  //             value={cell.getValue()}
  //             onClick={() => displayDelete()}
  //           />
  //         );
  //       },
  //     },
  //     {
  //       header: "Product",
  //       accessorKey: "name",
  //       enableColumnFilter: false,
  //       cell: (cell) => (
  //         <>
  //           <div className="d-flex align-items-center">
  //             <div className="flex-shrink-0 me-3">
  //               <div className="avatar-sm bg-light rounded p-1">
  //                 <img
  //                   src={
  //                     process.env.REACT_APP_API_URL +
  //                     "/images/products/" +
  //                     cell.row.original.image
  //                   }
  //                   alt=""
  //                   className="img-fluid d-block"
  //                 />
  //               </div>
  //             </div>
  //             <div className="flex-grow-1">
  //               <h5 className="fs-14 mb-1">
  //                 <Link
  //                   to="/apps-ecommerce-product-details"
  //                   className="text-body"
  //                 >
  //                   {" "}
  //                   {cell.getValue()}
  //                 </Link>
  //               </h5>
  //               <p className="text-muted mb-0">
  //                 Category :{" "}
  //                 <span className="fw-medium">
  //                   {" "}
  //                   {cell.row.original.category}
  //                 </span>
  //               </p>
  //             </div>
  //           </div>
  //         </>
  //       ),
  //     },
  //     {
  //       header: "Stock",
  //       accessorKey: "stock",
  //       enableColumnFilter: false,
  //     },
  //     {
  //       header: "Price",
  //       accessorKey: "price",
  //       enableColumnFilter: false,
  //       cell: (cell) => {
  //         return <Price {...cell} />;
  //       },
  //     },
  //     {
  //       header: "Orders",
  //       accessorKey: "orders",
  //       enableColumnFilter: false,
  //     },
  //     {
  //       header: "Rating",
  //       accessorKey: "rating",
  //       enableColumnFilter: false,
  //       cell: (cell) => {
  //         return <Rating {...cell} />;
  //       },
  //     },
  //     {
  //       header: "Published",
  //       accessorKey: "publishedDate",
  //       enableColumnFilter: false,
  //       cell: (cell) => {
  //         return <Published {...cell} />;
  //       },
  //     },
  //     {
  //       header: "Action",
  //       cell: (cell) => {
  //         return (
  //           <UncontrolledDropdown>
  //             <DropdownToggle
  //               href="#"
  //               className="btn btn-soft-secondary btn-sm"
  //               tag="button"
  //             >
  //               <i className="ri-more-fill" />
  //             </DropdownToggle>
  //             <DropdownMenu className="dropdown-menu-end">
  //               <DropdownItem href="apps-ecommerce-product-details">
  //                 <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
  //                 View
  //               </DropdownItem>

  //               <DropdownItem href="apps-ecommerce-add-product">
  //                 <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
  //                 Edit
  //               </DropdownItem>

  //               <DropdownItem divider />
  //               <DropdownItem
  //                 href="#"
  //                 onClick={() => {
  //                   const productData = cell.row.original;
  //                   onClickDelete(productData);
  //                 }}
  //               >
  //                 <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
  //                 Delete
  //               </DropdownItem>
  //             </DropdownMenu>
  //           </UncontrolledDropdown>
  //         );
  //       },
  //     },
  //   ],
  //   []
  // );

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell) => {
          return (
            <input
              type="checkbox"
              className="productCheckBox form-check-input"
              value={cell.getValue()}
              onClick={() => displayDelete()}
            />
          );
        },
      },
      {
        header: "Service",
        accessorKey: "nom",
        enableColumnFilter: false,
        cell: (cell) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="avatar-sm bg-light rounded p-1">
                  {cell.row.original.image_principale ? (
                    <img
                      src={cell.row.original.image_principale}
                      alt=""
                      className="img-fluid d-block"
                    />
                  ) : (
                    <div className="avatar-title bg-light rounded">
                      <i className="ri-image-line fs-20 text-muted"></i>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-grow-1">
                <h5 className="fs-14 mb-1">
                  <Link to="#" className="text-body">
                    {cell.getValue()}
                  </Link>
                </h5>
                <p className="text-muted mb-0">
                  Code:{" "}
                  <span className="fw-medium">
                    {cell.row.original.code || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </>
        ),
      },
      {
        header: "Type",
        accessorKey: "statut",
        enableColumnFilter: false,
      },
      {
        header: "Prix",
        enableColumnFilter: false,
        cell: (cell) => {
          const prix =
            cell.row.original.grilles_tarifaires?.[0]?.prix_vente || "N/A";
          return (
            <span>
              {prix !== "N/A"
                ? new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "XOF",
                  }).format(prix)
                : prix}
            </span>
          );
        },
      },
      {
        header: "Statut",
        accessorKey: "publier",
        enableColumnFilter: false,
        cell: (cell) => {
          const isPublished = cell.getValue();
          return (
            <span
              className={`badge ${isPublished ? "bg-success" : "bg-secondary"}`}
            >
              {isPublished ? "Publié" : "Non Publié"}
            </span>
          );
        },
      },
      {
        header: "Seuil",
        accessorKey: "seuil",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cell) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle
                href="#"
                className="btn btn-soft-secondary btn-sm"
                tag="button"
              >
                <i className="ri-more-fill" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem
                  tag={Link}
                  to={`/apps-ecommerce-product-details/${cell.row.original.id}`}
                >
                  <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
                  Voir
                </DropdownItem>
                <DropdownItem
                  tag={Link}
                  to={`/apps-ecommerce-add-product?id=${cell.row.original.id}`}
                >
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                  Modifier
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => onClickDelete(cell.row.original)}>
                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                  Supprimer
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        },
      },
    ],
    []
  );

  document.title = "Produits | INAWO - Suite de Gestion";

  return (
    <div className="page-content">
      <ToastContainer closeButton={false} limit={1} />

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProduct}
        onCloseClick={() => setDeleteModal(false)}
      />
      <DeleteModal
        show={deleteModalMulti}
        onDeleteClick={() => {
          deleteMultiple();
          setDeleteModalMulti(false);
        }}
        onCloseClick={() => setDeleteModalMulti(false)}
      />
      <Container fluid>
        <>
          <BreadCrumb
            title="&nbsp;Service" // &nbsp; avant "Contact"
            pageTitle={
              <>
                <i className="ri-shopping-bag-3-line"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
              </>
            }
          />
        </>
        <Row>
          <Col xl={3} lg={4} style={{ borderRadius: "20px" }}>
            <Card style={{ borderRadius: "20px" }}>
              <div className="accordion accordion-flush">
                <div className="card-body border-bottom">
                  <div>
                    <p className="text-muted text-uppercase fs-12 fw-medium mb-2">
                      Catégories
                    </p>
                    <ul className="list-unstyled mb-0 filter-list">
                      {categoriesList.map((category) => (
                        <li key={category.id}>
                          {" "}
                          {/* Assurez-vous que chaque catégorie a un id unique */}
                          <Link
                            to="#"
                            className={
                              cate === category.name
                                ? "active d-flex py-1 align-items-center"
                                : "d-flex py-1 align-items-center"
                            }
                            onClick={() => categories(category.nom)}
                          >
                            <div className="flex-grow-1">
                              <h6 className="fs-13 mb-0 listname">
                                {category.nom}
                              </h6>
                            </div>
                            {category.count && (
                              <div className="flex-shrink-0 ms-2">
                                <span className="badge bg-light text-muted">
                                  {category.count}
                                </span>
                              </div>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* <div className="card-body border-bottom">
                  <p className="text-muted text-uppercase fs-12 fw-medium mb-4">
                    Price
                  </p>

                  <Nouislider
                    range={{ min: 0, max: 2000 }}
                    start={[0, 2000]}
                    connect
                    onSlide={onUpdate}
                    data-slider-color="primary"
                    id="product-price-range"
                  />
                  <div className="formCost d-flex gap-2 align-items-center mt-3">
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      id="minCost"
                      readOnly
                    />
                    <span className="fw-semibold text-muted">to</span>
                    <Input
                      className="form-control form-control-sm"
                      type="text"
                      id="maxCost"
                      readOnly
                    />
                  </div>
                </div> */}

                {/* <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button bg-transparent shadow-none"
                      type="button"
                      id="flush-headingBrands"
                    >
                      <span className="text-muted text-uppercase fs-12 fw-medium">
                        Brands
                      </span>{" "}
                      <span className="badge bg-success rounded-pill align-middle ms-1">
                        2
                      </span>
                    </button>
                  </h2>
                  <UncontrolledCollapse
                    toggler="#flush-headingBrands"
                    defaultOpen
                  >
                    <div
                      id="flush-collapseBrands"
                      className="accordion-collapse collapse show"
                      aria-labelledby="flush-headingBrands"
                    >
                      <div className="accordion-body text-body pt-0">
                        <div className="search-box search-box-sm">
                          <input
                            type="text"
                            className="form-control bg-light border-0"
                            placeholder="Search Brands..."
                          />
                          <i className="ri-search-line search-icon"></i>
                        </div>
                        <div className="d-flex flex-column gap-2 mt-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productBrandRadio5"
                              defaultChecked
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productBrandRadio5"
                            >
                              Boat
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productBrandRadio4"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productBrandRadio4"
                            >
                              OnePlus
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productBrandRadio3"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productBrandRadio3"
                            >
                              Realme
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productBrandRadio2"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productBrandRadio2"
                            >
                              Sony
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productBrandRadio1"
                              defaultChecked
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productBrandRadio1"
                            >
                              JBL
                            </label>
                          </div>

                          <div>
                            <button
                              type="button"
                              className="btn btn-link text-decoration-none text-uppercase fw-medium p-0"
                            >
                              1,235 More
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </UncontrolledCollapse>
                </div> */}

                {/* <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button bg-transparent shadow-none collapsed"
                      type="button"
                      id="flush-headingDiscount"
                    >
                      <span className="text-muted text-uppercase fs-12 fw-medium">
                        Discount
                      </span>{" "}
                      <span className="badge bg-success rounded-pill align-middle ms-1">
                        1
                      </span>
                    </button>
                  </h2>
                  <UncontrolledCollapse toggler="#flush-headingDiscount">
                    <div
                      id="flush-collapseDiscount"
                      className="accordion-collapse collapse show"
                    >
                      <div className="accordion-body text-body pt-1">
                        <div className="d-flex flex-column gap-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productdiscountRadio6"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productdiscountRadio6"
                            >
                              50% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productdiscountRadio5"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productdiscountRadio5"
                            >
                              40% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productdiscountRadio4"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productdiscountRadio4"
                            >
                              30% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productdiscountRadio3"
                              defaultChecked
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productdiscountRadio3"
                            >
                              20% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productdiscountRadio2"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productdiscountRadio2"
                            >
                              10% or more
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productdiscountRadio1"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productdiscountRadio1"
                            >
                              Less than 10%
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </UncontrolledCollapse>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button bg-transparent shadow-none collapsed"
                      type="button"
                      id="flush-headingRating"
                    >
                      <span className="text-muted text-uppercase fs-12 fw-medium">
                        Rating
                      </span>{" "}
                      <span className="badge bg-success rounded-pill align-middle ms-1">
                        1
                      </span>
                    </button>
                  </h2>

                  <UncontrolledCollapse toggler="#flush-headingRating">
                    <div
                      id="flush-collapseRating"
                      className="accordion-collapse collapse show"
                      aria-labelledby="flush-headingRating"
                    >
                      <div className="accordion-body text-body">
                        <div className="d-flex flex-column gap-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productratingRadio4"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChangeRating(4);
                                } else {
                                  onUncheckMark(4);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productratingRadio4"
                            >
                              <span className="text-muted">
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star"></i>
                              </span>{" "}
                              4 & Above
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productratingRadio3"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChangeRating(3);
                                } else {
                                  onUncheckMark(3);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productratingRadio3"
                            >
                              <span className="text-muted">
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                              </span>{" "}
                              3 & Above
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productratingRadio2"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productratingRadio2"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChangeRating(2);
                                } else {
                                  onUncheckMark(2);
                                }
                              }}
                            >
                              <span className="text-muted">
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                              </span>{" "}
                              2 & Above
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="productratingRadio1"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  onChangeRating(1);
                                } else {
                                  onUncheckMark(1);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="productratingRadio1"
                            >
                              <span className="text-muted">
                                <i className="mdi mdi-star text-warning"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                                <i className="mdi mdi-star"></i>
                              </span>{" "}
                              1
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </UncontrolledCollapse>
                </div> */}
              </div>
            </Card>
          </Col>

          <Col xl={9} lg={8}>
            <div>
              <Card style={{ borderRadius: "20px" }}>
                <div
                  class="card-header border-0"
                  style={{ borderRadius: "20px" }}
                >
                  <div class="row g-4">
                    <div class="col-sm-auto">
                      <div>
                        <Link
                          style={{ borderRadius: "20px" }}
                          to="/apps-ecommerce-add-product"
                          className="btn btn-success"
                        >
                          <i className="ri-add-line align-bottom me-1"></i>
                          Nouveau Service
                        </Link>
                        {/* <a href="/apps-ecommerce-add-product" className="btn btn-success" class="btn btn-success" id="addproduct-btn"><i class="ri-add-line align-bottom me-1"></i> Add Product</a> */}
                      </div>
                    </div>
                    <div class="col-sm">
                      <div class="d-flex justify-content-sm-end">
                        <div class="search-box ms-2">
                          <input
                            style={{ borderRadius: "20px" }}
                            type="text"
                            class="form-control"
                            id="searchProductList"
                            placeholder="Search service..."
                          />
                          <i class="ri-search-line search-icon"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-header border-0">
                  <Row className=" align-items-center">
                    <Col>
                      <Nav
                        className="nav-tabs-custom card-header-tabs border-bottom-0"
                        role="tablist"
                      >
                        <NavItem>
                          <NavLink
                            className={classnames(
                              { active: activeTab === "1" },
                              "fw-semibold"
                            )}
                            onClick={() => {
                              toggleTab("1", "all");
                            }}
                            href="#"
                          >
                            Tout{" "}
                            <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1">
                              {stats.total}
                            </span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames(
                              { active: activeTab === "2" },
                              "fw-semibold"
                            )}
                            onClick={() => {
                              toggleTab("2", "published");
                            }}
                            href="#"
                          >
                            Publié{" "}
                            <span className="badge bg-danger-subtle text-danger align-middle rounded-pill ms-1">
                              {stats.published}
                            </span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </Col>
                    {/* <div className="col-auto">
                      <div id="selection-element">
                        <div className="my-n1 d-flex align-items-center text-muted">
                          Select{" "}
                          <div
                            id="select-content"
                            className="text-body fw-semibold px-1"
                          >
                            {dele}
                          </div>{" "}
                          Result{" "}
                          <button
                            type="button"
                            className="btn btn-link link-danger p-0 ms-3"
                            onClick={() => setDeleteModalMulti(true)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div> */}
                  </Row>
                </div>
                <div className="card-body pt-0">
                  {loadingProduits ? (
                    <div className="text-center py-4">
                      <Spinner color="primary" />
                      <p>Chargement des produits...</p>
                    </div>
                  ) : errorProduits ? (
                    <div className="text-center py-4 text-danger">
                      <i className="ri-error-warning-line fs-3"></i>
                      <p>{errorProduits}</p>
                      <Button color="primary" onClick={fetchProduits}>
                        Réessayer
                      </Button>
                    </div>
                  ) : produitsList.length > 0 ? (
                   <TableContainer
  columns={columns}
  data={productList} // Utilisez productList ici
  isGlobalFilter={true}
  isAddUserList={false}
  customPageSize={10}
  divClass="table-responsive mb-1"
  tableClass="mb-0 align-middle table-borderless"
  theadClass="table-light text-muted"
  isProductsFilter={true}
  SearchPlaceholder="Rechercher des produits..."
/>
                  ) : (
                    <div className="py-4 text-center">
                      <div>
                        <lord-icon
                          src="https://cdn.lordicon.com/msoeawqm.json"
                          trigger="loop"
                          colors="primary:#405189,secondary:#0ab39c"
                          style={{ width: "72px", height: "72px" }}
                        ></lord-icon>
                      </div>
                      <div className="mt-4">
                        <h5>Aucun Service trouvé</h5>
                        <p className="text-muted">
                          Commencez par ajouter un nouveau Service
                        </p>
                        <Link
                          to="/apps-ecommerce-add-product"
                          className="btn btn-success"
                        >
                          <i className="ri-add-line align-bottom me-1"></i>
                          Ajouter un Service
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* <div className="card-body">
                  <TabContent className="text-muted">
                    <TabPane>
                      <div
                        id="table-product-list-all"
                        className="table-card gridjs-border-none pb-2"
                      >
                      </div>
                    </TabPane>
                  </TabContent>
                </div> */}
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceProducts;
