import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Input,
  ModalHeader,
  ModalBody,
  Label,
  ModalFooter,
  Modal,
  Form,
  FormFeedback,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import classnames from "classnames";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import * as moment from "moment";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { isEmpty } from "lodash";

// Import Images
import dummyImg from "../../../assets/images/users/user-dummy-img.jpg";

//Import actions
import {
  getLeads as onGetLeads,
  addNewLead as onAddNewLead,
  updateLead as onUpdateLead,
  deleteLead as onDeleteLead,
} from "../../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import CrmFilter from "./CrmFilter";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "../../../Components/Common/Loader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createSelector } from "reselect";
import { useTranslation } from 'react-i18next';

const CrmLeads = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState("");
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    validation.setFieldValue("category", e.target.value);
  };



  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      filterContacts(type);
    }
  };
  
  const filterContacts = (type) => {
    if (type === "all") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => contact.contactType === type);
      setFilteredContacts(filtered);
    }
  };



  const dispatch = useDispatch();

  const selectLayoutState = (state) => state.Crm;
  const crmleadsProperties = createSelector(
    selectLayoutState,
    (state) => ({
      leads: state.leads,
      isLeadsSuccess: state.isLeadsSuccess,
      error: state.error,
    })
  );
  // Inside your component
  const {
    leads, isLeadsSuccess, error
  } = useSelector(crmleadsProperties);

  useEffect(() => {
    if (leads && !leads.length) {
      dispatch(onGetLeads());
    }
  }, [dispatch, leads]);

  useEffect(() => {
    setLead(leads);
  }, [leads]);

  // useEffect(() => {
  //   if (!isEmpty(leads)) {
  //     setLead(leads);
  //     setIsEdit(false);
  //   }
  // }, [leads]);

  useEffect(() => {
    if (!isEmpty(leads)) {
      setContacts(leads);
      setFilteredContacts(leads);
      setIsEdit(false);
    }
  }, [leads]);


    const [sortBy, setsortBy] = useState("Owner");
    // const [modal, setModal] = useState(false);
  
    const handlesortBy = (sortBy) => {
      setsortBy(sortBy);
    };
  

  const [isEdit, setIsEdit] = useState(false);
  const [lead, setLead] = useState([]);

  //delete lead
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const [isInfoDetails, setIsInfoDetails] = useState(false);

  const [tag, setTag] = useState([]);
  const [assignTag, setAssignTag] = useState([]);

  const handlestag = (tags) => {
    setTag(tags);
    const assigned = tags.map((item) => item.value);
    setAssignTag(assigned);
  };

  const tags = [
    { label: "Particulier", value: "Exiting" },
    { label: "Société", value: "Lead" },
    { label: "Entreprise", value: "Long-term" },
    { label: "Institution", value: "Partner" },
    { label: "Association", value: "Partner" },
    { label: "Administration", value: "Partner" },
    { label: "ONG", value: "Partner" }
  ];

  const tagss = [
    { label: "Client", value: "Exiting" },
    { label: "Prospect", value: "Lead" },
    { label: "Fournisseur", value: "Long-term" },
    { label: "Partenaire", value: "Partner" }
  ];

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setLead(null);
    } else {
      setModal(true);
      setDate(defaultdate());
      setTag([]);
      setAssignTag([]);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteLead = () => {
    if (lead) {
      dispatch(onDeleteLead(lead._id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (lead) => {
    setLead(lead);
    setDeleteModal(true);
  };

  // Add Data
  const handleLeadClicks = () => {
    setLead("");
    setIsEdit(false);
    toggle();
  };

  const toggleInfo = () => {
    setIsInfoDetails(!isInfoDetails);
  };

  
  const sortbyname = [
    {
      options: [
        { label: "Owner", value: "Owner" },
        { label: "Company", value: "Company" },
        { label: "Location", value: "Location" },
      ],
    },
  ];


  // validation
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: (lead && lead.name) || '',
      company: (lead && lead.company) || '',
      score: (lead && lead.score) || '',
      phone: (lead && lead.phone) || '',
      location: (lead && lead.location) || '',
      date: (lead && lead.date) || '',
      tags: (lead && lead.tags) || '',
      type_contact: (lead && lead.contactType) || '', // Ajoutez le type de contact ici
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Name"),
      company: Yup.string().required("Please Enter Company"),
      score: Yup.string().required("Please Enter Score"),
      phone: Yup.string().required("Please Enter Phone"),
      location: Yup.string().required("Please Enter Location"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateLead = {
          _id: lead ? lead._id : 0,
          name: values.name,
          company: values.company,
          score: values.score,
          phone: values.phone,
          location: values.location,
          date: date,
          tags: assignTag,
          contactType: values.type_contact, // Ajoutez le type de contact ici
        };
        dispatch(onUpdateLead(updateLead));
        validation.resetForm();
      } else {
        const newLead = {
          _id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
          name: values["name"],
          company: values["company"],
          score: values["score"],
          phone: values["phone"],
          location: values["location"],
          date: date,
          tags: assignTag,
          contactType: values["type_contact"], // Ajoutez le type de contact ici
        };
        dispatch(onAddNewLead(newLead));
        setContacts([...contacts, newLead]); // Ajoutez le nouveau contact à la liste des contacts
        setFilteredContacts([...contacts, newLead]); // Mettez à jour les contacts filtrés
        validation.resetForm();
      }
      toggle();
    },
  });
  
  const createContact = async (contactData) => {
    try {
      setLoading(true);
      
      const response = await fetch('https://inawoapiv3.inawo.pro/utilisateurs/createlistecontacte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Si nécessaire
        },
        body: JSON.stringify(contactData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la création');
      }
  
      const newContact = await response.json();
      
      // Mise à jour optimiste de l'état local
      setContacts((prev) => [...prev, newContact]);
      setFilteredContacts((prev) => [...prev, newContact]);
      
      toast.success('Contact créé avec succès!');
      return newContact; // Retourne le contact créé si besoin
    } catch (error) {
      console.error('Erreur création contact:', error);
      toast.error(`Erreur: ${error.message}`);
      throw error; // Propage l'erreur pour gestion supplémentaire
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    if (!form.name || !form.email) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    // Appel de la fonction de création de contact
    await createContact(form);
  };


  // Fonction pour récupérer les contacts
  useEffect(() => {
    const getContacts = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://inawoapiv3.inawo.pro/utilisateurs/createlistecontacte');
        
        if (!response.ok) throw new Error('Problème de connexion');
        
        const data = await response.json();
        setContacts(data);
        setFilteredContacts(data);
      } catch (err) {
        setError(err.message);
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    getContacts();
  }, []);

  // Update Data
  const handleLeadClick = useCallback((arg) => {
    const lead = arg;

    setLead({
      _id: lead._id,
      name: lead.name,
      company: lead.company,
      score: lead.score,
      phone: lead.phone,
      location: lead.location,
      date: lead.date,
      tags: lead.tags,
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);

  const handleValidDate = date => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".leadsCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteLead(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".leadsCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Column
  const columns = useMemo(
    () => [
      {
        header: <input type="checkbox" className="form-check-input" id="checkBoxAll" onClick={() => checkedAll()} />,
        cell: (cell) => {
          return <input type="checkbox" className="leadsCheckBox form-check-input" value={cell.getValue()} onChange={() => deleteCheckbox()} />;
        },
        id: '#',
        enableSorting: false,
      },
       {
              header: "Image",
              accessorKey: "image",
              enableColumnFilter: false,
              cell: (cell) => (
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <img
                      src={dummyImg}
                      alt=""
                      className="avatar-xxs rounded-circle"
                    />
                  </div>
                </div>
              ),
            },
      {
        header: "Nom",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Type de contact",
        accessorKey: "contactType",
        enableColumnFilter: false,
      },
      
      {
        header: "Téléphone",
        accessorKey: "phone",
        enableColumnFilter: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Adresse",
        accessorKey: "address",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Call">
                <Link
                  to="#"
                  className="text-muted d-inline-block"
                >
                  <i className="ri-phone-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item edit" title="Message">
                <Link to="#" className="text-muted d-inline-block">
                  <i className="ri-question-answer-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="View">
                <Link to="#">
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link className="edit-item-btn" to="#"
                  onClick={() => { const LeadData = cellProps.row.original; handleLeadClick(LeadData); }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Delete">
                <Link
                  className="remove-item-btn"
                  onClick={() => { const LeadData = cellProps.row.original; onClickDelete(LeadData); }}
                  to="#"
                >
                  <i className="ri-delete-bin-fill align-bottom text-muted"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleLeadClick, checkedAll]
  );

  const defaultdate = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
  };

  const [date, setDate] = useState(defaultdate());

  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
  };


  document.title = "Leads | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteLead}
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
          <BreadCrumb title="Leads" pageTitle="CRM" />
          <Row>
            <Col lg={12}>
              <Card id="leadsList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <Col sm={3}>
                      <div className="search-box">
                        <Input
                          type="text"
                          className="form-control search"
                          placeholder="Search for..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <div className="col-sm-auto ms-auto">
                      <div className="hstack gap-2">
                        {isMultiDeleteButton && <button className="btn btn-soft-danger"
                          onClick={() => setDeleteModalMulti(true)}
                        ><i className="ri-delete-bin-2-line"></i></button>}
                        
                          <div className="d-flex align-items-center gap-2">
                          <span className="text-muted">Sort by: </span>
                          <Select
                            className="mb-0"
                            value={sortBy}
                            onChange={() => {
                              handlesortBy();
                            }}
                            options={sortbyname}
                            id="choices-single-default"
                            defaultInputValue="Owner"
                          ></Select>
                        </div>
                        
                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Leads
                        </button>
                        
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
  <Nav
                      className="nav-tabs nav-tabs-custom nav-success py-4"
                      role="tablist">
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
                          <i className="ri-store-2-fill me-1 align-bottom"></i>{" "}
                          All Contacts
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames(
                            { active: activeTab === "2" },
                            "fw-semibold"
                          )}
                          onClick={() => {
                            toggleTab("2", "Client");
                          }}
                          href="#"
                        >
                          <i className="ri-checkbox-circle-line me-1 align-bottom"></i>{" "}
                          Clients
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames(
                            { active: activeTab === "3" },
                            "fw-semibold"
                          )}
                          onClick={() => {
                            toggleTab("3", "Fournisseur");
                          }}
                          href="#"
                        >
                          <i className="ri-truck-line me-1 align-bottom"></i>{" "}
                          Fournisseurs
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames(
                            { active: activeTab === "4" },
                            "fw-semibold"
                          )}
                          onClick={() => {
                            toggleTab("4", "Commercial");
                          }}
                          href="#"
                        >
                          <i className="ri-arrow-left-right-fill me-1 align-bottom"></i>{" "}
                          Commercial
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames(
                            { active: activeTab === "5" },
                            "fw-semibold"
                          )}
                          onClick={() => {
                            toggleTab("5", "Partenaire");
                          }}
                          href="#"
                        >
                          <i className="ri-close-circle-line me-1 align-bottom"></i>{" "}
                          Partenaires
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames(
                            { active: activeTab === "6" },
                            "fw-semibold"
                          )}
                          onClick={() => {
                            toggleTab("6", "Prospect");
                          }}
                          href="#"
                        >
                          <i className="ri-close-circle-line me-1 align-bottom"></i>{" "}
                          Prospects
                        </NavLink>
                      </NavItem>
                    </Nav>

                    {isLeadsSuccess && leads.length ? (
                      <TableContainer
                        columns={columns}
                        data={(contacts || [])}
                        isGlobalFilter={false}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-0"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        handleLeadClick={handleLeadClicks}
                        isLeadsFilter={false}
                        SearchPlaceholder='Search for'
                      />
                    ) : (<Loader error={error} />)
                    }

                  </div>

                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered  style={{ borderRadius: '15px', overflow: 'hidden' }}
  contentClassName="rounded-modal" >
                        <ModalHeader className="bg-light p-3" toggle={toggle}>
                          {!!isEdit ? t("Edit Lead") : t("Add Lead")}
                        </ModalHeader>
                        <Form className="tablelist-form" onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}>
                          <ModalBody>
                            <Input type="hidden" id="id-field" />
                            <Row className="g-3">
                              <Col lg={12}>
                                <div className="text-center">
                                  <div className="position-relative d-inline-block">
                                    <div className="position-absolute bottom-0 end-0">
                                      <Label htmlFor="lead-image-input" className="mb-0">
                                        <div className="avatar-xs cursor-pointer">
                                          <div className="avatar-title bg-light border rounded-circle text-muted">
                                            <i className="ri-image-fill"></i>
                                          </div>
                                        </div>
                                      </Label>
                                      <Input className="form-control d-none" id="lead-image-input" type="file"
                                        accept="image/png, image/gif, image/jpeg"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.img || ""}
                                        invalid={
                                          validation.touched.img && validation.errors.img ? true : false
                                        }
                                      />
                                    </div>
                                    <div className="avatar-lg p-1">
                                      <div className="avatar-title bg-light rounded-circle">
                                        <img src={dummyImg} alt="dummyImg" id="lead-img" className="avatar-md rounded-circle object-fit-cover" />
                                      </div>
                                    </div>
                                  </div>
                                  <h5 className="fs-13 mt-3">Lead Image</h5>
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div>
                                  <Label htmlFor="type_contact" className="form-label font-size-13">
                                    {t("Type contact")} <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    className="form-select"
                                    type="select"
                                    id="type_contact"
                                    name="type_contact"
                                    value={validation.values.type_contact}
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    invalid={validation.touched.type_contact && validation.errors.type_contact ? true : false}
                                  >
                                    <option value="">{t("Sélectionner")}</option>
                                    <option value="Client">{t("Client")}</option>
                                    <option value="Prospect">{t("Prospect")}</option>
                                    <option value="Fournisseur">{t("Fournisseur")}</option>
                                    <option value="Partenaire">{t("Partenaire")}</option>
                                  </Input>
                                  {validation.touched.type_contact && validation.errors.type_contact ? (
                                    <FormFeedback type="invalid">{t(validation.errors.type_contact)}</FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div>
                                  <Label htmlFor="categoryinput-choices" className="form-label font-size-13">
                                    {t("Catégorie")} <span style={{ color: "red" }}>*</span>
                                  </Label>
                                  <Input
                                    className="form-select"
                                    type="select"
                                    id="category"
                                    value={validation.values.category}
                                    onChange={handleCategoryChange}
                                    onBlur={validation.handleBlur}
                                    invalid={validation.touched.category && validation.errors.category ? true : false}
                                  >
                                    <option value="">{t("Sélectionner")}</option>
                                    <option value="Particulier">{t("Particulier")}</option>
                                    <option value="Société">{t("Société")}</option>
                                    <option value="Entreprise">{t("Entreprise")}</option>
                                    <option value="Institution">{t("Institution")}</option>
                                    <option value="Association">{t("Association")}</option>
                                    <option value="Administration">{t("Administration")}</option>
                                    <option value="ONG">{t("ONG")}</option>
                                  </Input>
                                  {validation.touched.category && validation.errors.category ? (
                                    <FormFeedback type="invalid">{t(validation.errors.category)}</FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                                    
                              <Col lg={6}>
                                <div>
                                <Label htmlFor="name-field" className="form-label">
                                  Nom
                                </Label>
                                <Input
                                  name="name"
                                  id="name-field"
                                  className="form-control"
                                  placeholder="Entrez votre nom"
                                  type="text"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.name || ""}
                                  invalid={
                                    validation.touched.name && validation.errors.name ? true : false
                                  }
                                />
                                {validation.touched.name && validation.errors.name ? (
                                  <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div>
                                <Label htmlFor="company-field" className="form-label">
                                  Nom de l'entreprise
                                </Label>
                                <Input
                                  name="company"
                                  id="company-field"
                                  className="form-control"
                                  placeholder="Ex: Inawo"
                                  type="text"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.company || ""}
                                  invalid={
                                    validation.touched.company && validation.errors.company ? true : false
                                  }
                                />
                                {validation.touched.company && validation.errors.company ? (
                                  <FormFeedback type="invalid">{validation.errors.company}</FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                              <Col lg={6}>
                              <div>
                                <Label htmlFor="phone-field" className="form-label">
                                  Téléphone
                                </Label>
                                <Input
                                  name="phone"
                                  id="phone-field"
                                  className="form-control"
                                  placeholder="Ex: 344543656775"
                                  type="text"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.phone || ""}
                                  invalid={
                                    validation.touched.phone && validation.errors.phone ? true : false
                                  }
                                />
                                {validation.touched.phone && validation.errors.phone ? (
                                  <FormFeedback type="invalid">{validation.errors.phone}</FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div>
                                <Label htmlFor="phone2-field" className="form-label">
                                  Téléphone 2
                                </Label>
                                <Input
                                  name="phone2"
                                  id="phone2-field"
                                  className="form-control"
                                  placeholder="Ex: 344543656775"
                                  type="text"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.phone2 || ""}
                                  invalid={
                                    validation.touched.phone2 && validation.errors.phone2 ? true : false
                                  }
                                />
                                {validation.touched.phone2 && validation.errors.phone2 ? (
                                  <FormFeedback type="invalid">{validation.errors.phone2}</FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                                              <Col lg={6}>
                                <div>
                                  <Label htmlFor="email-field" className="form-label">
                                    Email
                                  </Label>
                                  <Input
                                    name="email"
                                    id="email-field"
                                    className="form-control"
                                    placeholder="Entrez votre email"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.email || ""}
                                    invalid={
                                      validation.touched.email && validation.errors.email ? true : false
                                    }
                                  />
                                  {validation.touched.email && validation.errors.email ? (
                                    <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                  ) : null}
                                </div>
                              </Col>                    
                              <Col lg={6}>
                                <div>
                                  <Label htmlFor="address-field" className="form-label">
                                    Adresse (Ville/Pays)
                                  </Label>
                                  <Input
                                    name="address"
                                    id="address-field"
                                    className="form-control"
                                    placeholder="Entrez votre adresse"
                                    type="text"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.address || ""}
                                    invalid={
                                      validation.touched.address && validation.errors.address ? true : false
                                    }
                                  />
                                  {validation.touched.address && validation.errors.address ? (
                                    <FormFeedback type="invalid">{validation.errors.address}</FormFeedback>
                                  ) : null}
                                </div>
                              </Col>
                              <Col lg={6}>
                                  <div>
                                    <Label htmlFor="revenue-field" className="form-label font-size-13">
                                      {t("Revenue")}
                                    </Label>
                                    <Input
                                      className="form-select"
                                      type="select"
                                      id="revenue-field"
                                      name="revenue" // Ajoutez le nom ici
                                      value={validation.values.revenue || ""}
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      invalid={validation.touched.revenue && validation.errors.revenue ? true : false}
                                    >
                                      <option value="">{t("Sélectionner")}</option>
                                      <option value="0-100000">{t("0 - 100000")}</option>
                                      <option value="100000-250000">{t("100000 - 250000")}</option>
                                      <option value="250000-500000">{t("250000 - 500000")}</option>
                                      <option value="500000-1000000">{t("500000 - 1000000")}</option>
                                      <option value="1000000-10000000">{t("1000000 - 10000000")}</option>
                                    </Input>
                                    {validation.touched.revenue && validation.errors.revenue ? (
                                      <FormFeedback type="invalid">{t(validation.errors.revenue)}</FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
    
                              {/* Conditional Fields */}
                              {category === "Particulier" && (
                                      <Col lg={6}>
                                        <div>
                                          <Label htmlFor="date-field" className="form-label">
                                            {t("Date")}
                                          </Label>
                                          <Flatpickr
                                            className="form-control"
                                            id="date-field"
                                            value={validation.values.date}
                                            onChange={(date) => setDate(date)}
                                            options={{
                                              dateFormat: "d M, Y",
                                            }}
                                          />
                                        </div>
                                      </Col>
                                    )}
                    
                                    {["Société", "Entreprise"].includes(category) && (
                                      <>
                                        <Col lg={6}>
                                          <div>
                                            <Label htmlFor="date-field" className="form-label">
                                              {t("Date")}
                                            </Label>
                                            <Flatpickr
                                              className="form-control"
                                              id="date-field"
                                              value={validation.values.date}
                                              onChange={(date) => setDate(date)}
                                              options={{
                                                dateFormat: "d M, Y",
                                              }}
                                            />
                                          </div>
                                        </Col>
                                        <Col lg={6}>
                                          <div>
                                            <Label htmlFor="legal-form-field" className="form-label">
                                              {t("Forme juridique")}
                                            </Label>
                                            <Input
                                              className="form-select"
                                              type="select"
                                              id="legal-form-field"
                                              value={validation.values.legal_form}
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              invalid={validation.touched.legal_form && validation.errors.legal_form ? true : false}
                                            >
                                              <option value="">{t("Sélectionner")}</option>
                                              <option value="Entreprise Individuelle">{t("Entreprise Individuelle")}</option>
                                              <option value="Entreprise Industrielle">{t("Entreprise Industrielle")}</option>
                                            </Input>
                                            {validation.touched.legal_form && validation.errors.legal_form ? (
                                              <FormFeedback type="invalid">{t(validation.errors.legal_form)}</FormFeedback>
                                            ) : null}
                                          </div>
                                        </Col>
                                        <Col lg={6}>
                                          <div>
                                            <Label htmlFor="website-field" className="form-label">
                                              {t("Site web")}
                                            </Label>
                                            <Input
                                              type="url"
                                              id="website-field"
                                              className="form-control"
                                              placeholder="https://example.com"
                                              value={validation.values.website}
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              invalid={validation.touched.website && validation.errors.website ? true : false}
                                            />
                                            {validation.touched.website && validation.errors.website ? (
                                              <FormFeedback type="invalid">{t(validation.errors.website)}</FormFeedback>
                                            ) : null}
                                          </div>
                                        </Col>
                                        <Col lg={6}>
                                          <div>
                                            <Label htmlFor="capital-field" className="form-label">
                                              {t("Capital social")}
                                            </Label>
                                            <Input
                                              type="number"
                                              id="capital-field"
                                              className="form-control"
                                              placeholder="Capital social"
                                              value={validation.values.capital}
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              invalid={validation.touched.capital && validation.errors.capital ? true : false}
                                            />
                                            {validation.touched.capital && validation.errors.capital ? (
                                              <FormFeedback type="invalid">{t(validation.errors.capital)}</FormFeedback>
                                            ) : null}
                                          </div>
                                        </Col>
                                        <Col lg={6}>
                                          <div>
                                            <Label htmlFor="legal-number-field" className="form-label">
                                              {t("Numéro légal")}
                                            </Label>
                                            <Input
                                              type="text"
                                              id="legal-number-field"
                                              className="form-control"
                                              placeholder="Numéro légal"
                                              value={validation.values.legal_number}
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              invalid={validation.touched.legal_number && validation.errors.legal_number ? true : false}
                                            />
                                            {validation.touched.legal_number && validation.errors.legal_number ? (
                                              <FormFeedback type="invalid">{t(validation.errors.legal_number)}</FormFeedback>
                                            ) : null}
                                          </div>
                                        </Col>
                                      </>
                                    )} 
    
                                    {["Institution", "Association", "Administration", "ONG"].includes(category) && (
                                      <>
                                        <Col lg={6}>
                                          <div>
                                            <Label htmlFor="date-field" className="form-label">
                                              {t("Date")}
                                            </Label>
                                            <Flatpickr
                                              className="form-control"
                                              id="date-field"
                                              value={validation.values.date}
                                              onChange={(date) => setDate(date)}
                                              options={{
                                                dateFormat: "d M, Y",
                                              }}
                                            />
                                          </div>
                                        </Col>
                                        <Col lg={6}>
                                          <div>
                                            <Label htmlFor="website-field" className="form-label">
                                              {t("Site web")}
                                            </Label>
                                            <Input
                                              type="url"
                                              id="website-field"
                                              className="form-control"
                                              placeholder="https://example.com"
                                              value={validation.values.website}
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              invalid={validation.touched.website && validation.errors.website ? true : false}
                                            />
                                            {validation.touched.website && validation.errors.website ? (
                                              <FormFeedback type="invalid">{t(validation.errors.website)}</FormFeedback>
                                            ) : null}
                                          </div>
                                        </Col>
                                        <Col lg={6}>
                                          <div>
                                            <Label htmlFor="legal-number-field" className="form-label">
                                              {t("Numéro légal")}
                                            </Label>
                                            <Input
                                              type="text"
                                              id="legal-number-field"
                                              className="form-control"
                                              placeholder="Numéro légal"
                                              value={validation.values.legal_number}
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              invalid={validation.touched.legal_number && validation.errors.legal_number ? true : false}
                                            />
                                            {validation.touched.legal_number && validation.errors.legal_number ? (
                                              <FormFeedback type="invalid">{t(validation.errors.legal_number)}</FormFeedback>
                                            ) : null}
                                          </div>
                                        </Col>
                                      </>
                                    )} 
                            <Col lg={6}>
                              <div className="mb-3">
                                <label htmlFor="contactDescription" className="form-label">Description</label>
                                <textarea className="form-control" id="contactDescription" rows="2"
                                  placeholder="Enter description" required></textarea>
                                <div className="invalid-feedback">
                                  Please add a description.
                                </div>
                              </div>
                              </Col>
                              </Row>
                        </ModalBody>
                        <ModalFooter>
                          <div className="hstack gap-2 justify-content-end">
                            <button type="button" className="btn btn-light" onClick={() => { setModal(false); }} > Close </button>
                            <button type="submit" className="btn btn-success" id="add-btn"> {!!isEdit ? "Update" : "Add Lead"} </button>
                          </div>
                        </ModalFooter>
                      </Form>
                    </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <CrmFilter
        show={isInfoDetails}
        onCloseClick={() => setIsInfoDetails(false)}
      />
    </React.Fragment >
  );
};

export default CrmLeads;

























