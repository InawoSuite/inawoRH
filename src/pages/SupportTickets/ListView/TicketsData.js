// import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
// import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row, UncontrolledDropdown } from 'reactstrap';
// //redux
// import { useSelector, useDispatch } from "react-redux";
// import TableContainer from '../../../Components/Common/TableContainer';
// import { getTicketsList, addNewTicket, updateTicket, deleteTicket } from "../../../slices/thunks";

// import { TicketsId, Title, Client, AssignedTo, CreateDate, DueDate, Status, Priority } from "./TicketCol";
// //Import Flatepicker
// import Flatpickr from "react-flatpickr";

// import { isEmpty, set } from "lodash";

// // Formik
// import * as Yup from "yup";
// import { useFormik } from "formik";

// import DeleteModal from "../../../Components/Common/DeleteModal";

// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Loader from "../../../Components/Common/Loader";
// import { createSelector } from 'reselect';
// import axios from 'axios';
// import { BaseUrl } from '../../APIKey/ApiKey';
// import { useProfile } from '../../../Components/Hooks/UserHooks';
// import EmptyDataCard from '../../../Components/Common/EmptyDataCard';
// import { Link, useNavigate } from "react-router-dom";

// const TicketsData = () => {
//     const dispatch = useDispatch();


//     const selectLayoutState = (state) => state.Tickets;
//     const selectLayoutProperties = createSelector(
//         selectLayoutState,
//         (state) => ({
//             ticketsList: state.ticketsList,
//             isTicketSuccess: state.isTicketSuccess,
//             error: state.error,
//         })
//     );
//     const navigate = useNavigate();
//     const fileInputRef = useRef(null);
//     const [orders, setOrders] = useState([]);
//     const [orderList, setOrderList] = useState([]);
//     const [order, setOrder] = useState([]);
//     const [staticTickets, setStaticTickets] = useState([]);
//     /* const staticTickets = [
//         {
//             _id: "1",
//             id: "TCK-001",
//             title: "Problème de connexion",
//             client: "Client A",
//             assigned: "Support",
//             create: "10 Jul, 2025",
//             due: "12 Jul, 2025",
//             status: "Fermé",
//             priority: "High"

//         },
//         {
//             _id: "2",
//             id: "TCK-002",
//             title: "Erreur de facturation",
//             client: "Client B",
//             assigned: "Comptabilité",
//             create: "11 Jul, 2025",
//             due: "13 Jul, 2025",
//             status: "Ouvert",
//             priority: "Medium"
//         },
//     ]; */

//     // Inside your component
//     const {
//         ticketsList, isTicketSuccess, error
//     } = useSelector(selectLayoutProperties);

//     const toggleModal = () => setModalOpen(!modalOpen);
//     const toggleSujet = () => setSujetOpen(!sujetOpen);
//     const toggleAss = () => setAssOpen(!assOpen);
//     const [isEdit, setIsEdit] = useState(false);
//     const [ticket, setTicket] = useState([]);

//     const [assurance, setAssurance] = useState("");
//     const [promoCode, setPromoCode] = useState("");
//     const availablePromoCodes = [
//         " Assistance à l'utilisateur ",
//         "Probmene technique /Bugs",
//         "Fonctionnalitées manquantes",
//         "Gestion des utilistateurs et acceès",
//         "Facturation et abonnements",
//     ];
//     const availableAssurances = [
//         "Normal",
//         "Important",
//         "Urgent",

//     ];

//     // Delete Tickets
//     const [deleteModal, setDeleteModal] = useState(false);
//     const [deleteModalMulti, setDeleteModalMulti] = useState(false);
//     const [modal, setModal] = useState(false)
//     const [modalOpen, setModalOpen] = useState(false);
//     const [sujetOpen, setSujetOpen] = useState(false);
//     const [assOpen, setAssOpen] = useState(false);
//     const [myloading, setMyloading] = useState(false);
//     const toggle = useCallback(() => {
//         if (modal) {
//             setModal(false);
//             setTicket(null);
//         } else {
//             setModal(true);
//             setcreDate(dateFormat());
//             setdueDate(dateFormat());
//         }
//     }, [modal]);
//     const { userProfile, token } = useProfile();

//     const AllTicketData = async () => {
//         const reponse = await axios.get(`${BaseUrl}/administration/tickets/`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         })

//         //Reconstruction des données pour correspondre au format attendu par le tableau
//         const tickets = reponse.reverse().map((ticket, index) => ({
//             _id: ticket.ticket_id.toString(),
//             id: `TCK-${String(ticket.ticket_id).padStart(3, "0")}`, // ex: TCK-001
//             title: ticket.sujet,
//             client: ticket.formule,
//             assigned: ticket.assignation?.statut || "NON ASSIGNÉ",
//             create: new Date(ticket.created_at).toLocaleDateString("fr-FR", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//             }), // format date
//             due: null, // ⚠️ pas dans ton API → tu peux mettre une date fictive ou le calculer
//             status: ticket.statut === "OUVERT" ? "Ouvert" : "Fermé",
//             priority:
//                 ticket.priorite === "Urgent"
//                     ? "High"
//                     : ticket.priorite === "Important"
//                         ? "Medium"
//                         : "Low",
//         }));

//         setStaticTickets(tickets);

//     }
//     useEffect(() => {
//         AllTicketData();
//     }, []);

//     // validation
//     const validation = useFormik({

//         // enableReinitialize : use this flag when initial values needs to be changed
//         enableReinitialize: true,

//         initialValues: {
//             id: (ticket && ticket.id) || '',
//             title: (ticket && ticket.title) || '',
//             client: (ticket && ticket.client) || '',
//             assigned: (ticket && ticket.assigned) || '',
//             create: (ticket && ticket.create) || '',
//             due: (ticket && ticket.due) || '',
//             status: (ticket && ticket.status) || '',
//             priority: (ticket && ticket.priority) || '',
//             formule: (ticket && ticket.formule) || '',
//             message: (ticket && ticket.message) || '',
//             document : null,
//         },
//         /* validationSchema: Yup.object({
//             //id: Yup.string().required("Please Enter id"),
//             title: Yup.string().required("Entrez le titre de la facture"),
//             formule: Yup.string().required("Sélectionner la formule"),
//             message: Yup.string().required("Veuillez saisir votre message"),
//             //client: Yup.string().required("Please Enter Client Name"),
//             //assigned: Yup.string().required("Please Enter Assigned Name"),
//             // create: Yup.string().required("Please Enter Create Date"),
//             // due: Yup.string().required("Please Enter Your Due Date"),
//             //status: Yup.string().required("Please Enter Your Joining status"),
//             priority: Yup.string().required("Please Enter Your Priority")
//         }), */
//         onSubmit: async (values) => {
//             if (values["title"] === "") {

//                 toast.error(
//                     <span style={{ fontWeight: "bold", color: "red" }}>
//                         Veuillez sélectionner un sujet pour votre demande.
//                     </span>, {
//                     position: "top-center",
//                     autoClose: 4000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                 });
//                 return
//             }
//             else if (values["formule"] === "") {

//                 toast.error(
//                     <span style={{ fontWeight: "bold", color: "red" }}>
//                         Veuillez sélectionner une formule pour votre demande.
//                     </span>, {
//                     position: "top-center",
//                     autoClose: 4000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                 });
//                 return
//             }
//             else if (values["message"] === "") {

//                 toast.error(
//                     <span style={{ fontWeight: "bold", color: "red" }}>
//                         Veuillez mettre un message pour votre demande.
//                     </span>, {
//                     position: "top-center",
//                     autoClose: 4000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                 });
//                 return
//             }
//             else if (values["priority"] === "") {

//                 toast.error(
//                     <span style={{ fontWeight: "bold", color: "red" }}>
//                         Veuillez sélectionner une priorité pour votre demande.
//                     </span>, {
//                     position: "top-center",
//                     autoClose: 4000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                 });
//                 return
//             }

//             if (isEdit) {
//                 const updateTickets = {
//                     _id: ticket ? ticket._id : 0,
//                     id: values.id,
//                     title: values.title,
//                     client: values.client,
//                     assigned: values.assigned,
//                     create: credate,
//                     due: duedate,
//                     status: values.status,
//                     priority: values.priority,
//                 };
//                 // update ticket
//                 dispatch(updateTicket(updateTickets));
//                 validation.resetForm();
//             } else {

//                 const newTicket = {
//                     //_id: (Math.floor(Math.random() * (30 - 20)) + 20).toString(),
//                     //id: values["id"],
//                     formule: values["formule"],
//                     message: values["message"],
//                     sujet: values["title"],
//                     //client: values["client"],
//                     //assigned: values["assigned"],
//                     //create: credate,
//                     //due: duedate,
//                     //status: values["status"],
//                     priorite: values["priority"],
//                     document : values["document"],
//                 };
//                 console.log(" Les données de ticket à envoyer", newTicket);
//                 try {
//                     setMyloading(true);
//                     const response = await axios.post(`${BaseUrl}/administration/createticket/`, newTicket, {
//                         headers: {
//                             'Authorization': `Bearer ${token}`,
//                             'Content-Type': 'multipart/form-data',
//                         }
//                     });

//                     toast.success(
//                         <span style={{ fontWeight: "bold", color: "#28a745" }}>
//                             {response.message}
//                         </span>, {
//                         position: "top-center",
//                         autoClose: 4000,
//                         hideProgressBar: false,
//                         closeOnClick: true,
//                         pauseOnHover: true,
//                         draggable: true,
//                     });
//                     AllTicketData();
//                 } catch (error) {
//                     console.error("Erreur lors de la création du ticket :", error);
//                 } finally {
//                     setMyloading(false);
//                     setAssOpen(false);
//                     setModal(false);
//                 }
//                 // save new ticket
//                 //dispatch(addNewTicket(newTicket));
//                 validation.resetForm();
//             }
//             //toggle();
//         },
//     });

//     // Delete Data
//     const onClickDelete = (ticket) => {
//         setTicket(ticket);
//         setDeleteModal(true);
//     };

//     const handleDeleteTicket = () => {
//         if (ticket) {
//             dispatch(deleteTicket(ticket._id));
//             setDeleteModal(false);
//         }
//     };

//     // Update Data
//     const handleTicketsClick = useCallback((arg) => {
//         const ticket = arg;

//         setTicket({
//             _id: ticket._id,
//             id: ticket.id,
//             title: ticket.title,
//             client: ticket.client,
//             assigned: ticket.assigned,
//             create: ticket.create,
//             due: ticket.due,
//             status: ticket.status,
//             priority: ticket.priority
//         });

//         setIsEdit(true);
//         toggle();
//     }, [toggle]);

//     // useEffect( () =>

//     // {
//     //     if ( ticketsList && !ticketsList.length )
//     //     {
//     //         dispatch( getTicketsList() );
//     //     }
//     // }, [ dispatch, ticketsList ] );
//     useEffect(() => {
//         // fetchDepartments(); // API désactivée temporairement
//         setOrders(staticTickets);
//         setOrderList(staticTickets);
//     }, []);


//     useEffect(() => {
//         setTicket(ticketsList);
//     }, [ticketsList]);

//     useEffect(() => {
//         if (!isEmpty(ticketsList)) {
//             setTicket(ticketsList);
//             setIsEdit(false);
//         }
//     }, [ticketsList]);

//     // Add Data
//     const handleTicketsClicks = () => {
//         setTicket("");
//         setIsEdit(false);
//         toggle();
//     };

//     // Node API 
//     // useEffect(() => {
//     //   if (isTicketCreated) {
//     //     setTicket(null);
//     //     dispatch(getTicketsList());
//     //   }
//     // }, [
//     //   dispatch,
//     //   isTicketCreated,
//     // ]);

//     // Checked All
//     const checkedAll = useCallback(() => {
//         const checkall = document.getElementById("checkBoxAll");
//         const ele = document.querySelectorAll(".ticketCheckBox");

//         if (checkall.checked) {
//             ele.forEach((ele) => {
//                 ele.checked = true;
//             });
//         } else {
//             ele.forEach((ele) => {
//                 ele.checked = false;
//             });
//         }
//         deleteCheckbox();
//     }, []);

//     // Delete Multiple
//     const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
//     const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

//     const deleteMultiple = () => {
//         const checkall = document.getElementById("checkBoxAll");
//         selectedCheckBoxDelete.forEach((element) => {
//             dispatch(deleteTicket(element.value));
//             setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
//         });
//         setIsMultiDeleteButton(false);
//         checkall.checked = false;
//     };

//     const deleteCheckbox = () => {
//         const ele = document.querySelectorAll(".ticketCheckBox:checked");
//         ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
//         setSelectedCheckBoxDelete(ele);
//     };

//     const columns = useMemo(
//         () => [

//             {
//                 header: "ID",
//                 accessorKey: "id",
//                 enableColumnFilter: false,
//                 cell: (cell) => {
//                     return <TicketsId {...cell} />;
//                 },
//             },
//             {
//                 header: "Titre",
//                 accessorKey: "title",
//                 enableColumnFilter: false,
//                 cell: (cell) => {
//                     return <Title {...cell} />;
//                 },
//             },
//             {
//                 header: "Catégorie",
//                 accessorKey: "client",
//                 enableColumnFilter: false,
//                 cell: (cell) => {
//                     return <Client {...cell} />;
//                 },
//             },
//             {
//                 header: "Date de création",
//                 accessorKey: "create",
//                 enableColumnFilter: false,
//                 cell: (cell) => {
//                     return <AssignedTo {...cell} />;
//                 },
//             },
//             {
//                 header: "Date de cloture",
//                 accessorKey: "due",
//                 enableColumnFilter: false,
//                 cell: (cell) => {
//                     const value = cell.getValue();
//                     return <div className='text-center'>{value ? <CreateDate {...cell} /> : "-"}</div>;
//                 }
//             },
//             {
//                 header: "Status",
//                 accessorKey: "status",
//                 enableColumnFilter: false,
//                 cell: (cell) => {
//                     return <Status {...cell} />;
//                 },
//             },

//             {
//                 header: "Priorité",
//                 accessorKey: "priority",
//                 enableColumnFilter: false,
//                 cell: (cell) => {
//                     return <Priority {...cell} />

//                 },
//             },
//             {
//                 header: "Actions",
//                 cell: (cell) => {
//                     const ticketData = cell.row.original;
//                     return (
//                         <div className="d-flex" style={{ cursor: "pointer", justifyContent: "center"}}>
//                             <i onClick={() => { navigate(`/apps-tickets-details/${ticketData._id}`); }} className="ri-eye-fill align-bottom me-1"></i>
//                         </div>
//                     );
//                 },
//             },
//         ],
//         [checkedAll]
//     );


//     const dateFormat = () => {
//         let d = new Date(),
//             months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//         return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
//     };

//     const [credate, setcreDate] = useState(dateFormat());
//     const [duedate, setdueDate] = useState(dateFormat());

//     const credateformate = (e) => {
//         const date = e.toString().split(" ");
//         const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
//         setcreDate(joinDate);
//     };

//     const duedateformate = (e) => {
//         const date = e.toString().split(" ");
//         const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
//         setdueDate(joinDate);
//     };

//     return (
//         <React.Fragment>

//             <Row>
//                 <ToastContainer />
//                 <DeleteModal
//                     show={deleteModal}
//                     onDeleteClick={handleDeleteTicket}
//                     onCloseClick={() => setDeleteModal(false)}
//                 />
//                 <DeleteModal
//                     show={deleteModalMulti}
//                     onDeleteClick={() => {
//                         deleteMultiple();
//                         setDeleteModalMulti(false);
//                     }}
//                     onCloseClick={() => setDeleteModalMulti(false)}
//                 />
//                 <Col lg={12}>


//                     <div className="card-header" style={{ borderRadius: "70px" }}  >
//                         <div className="d-flex justify-content-between align-items-center mb-3 p-3 rounded-pill shadow-sm" style={{ background: "#fff" }} >
//                             <div className="search-box" style={{ width: "300px" }}>
//                                 <input
//                                     type="text"
//                                     className="form-control search"
//                                     placeholder="Rechercher un ticket..."
//                                     style={{ borderRadius: "20px" }}

//                                 />
//                                 <i className="ri-search-line search-icon"></i>
//                             </div>
//                             <div className="flex-shrink-0">
//                                 <div className="d-flex flex-wrap gap-2 ">
//                                     <button className="btn btn-danger add-btn rounded-pill" onClick={() => { setIsEdit(false); toggle(); }}><i className="ri-add-line align-bottom "></i> Créé un ticket</button>
//                                     {" "}{isMultiDeleteButton && <button className="btn btn-soft-danger"
//                                         onClick={() => setDeleteModalMulti(true)}
//                                     ><i className="ri-delete-bin-2-line"></i></button>}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="card" style={{ borderRadius: "20px" }}>
//                         <div className="card-header" style={{ borderRadius: "20px" }}>    {Array.isArray(staticTickets) && staticTickets.length > 0 ? (
//                             <TableContainer
//                                 columns={columns}
//                                 data={staticTickets}
//                                 isGlobalFilter={true}
//                                 isAddUserList={false}
//                                 customPageSize={8}
//                                 divClass="table-responsive table-card mb-1"
//                                 tableClass="align-middle table-nowrap"
//                                 handleTicketClick={handleTicketsClicks}
//                                 theadClass="text-muted"
//                                 isTicketsListFilter={true}
//                                 SearchPlaceholder='Search for ticket details or something...'
//                             />
//                         ) : (
//                             <EmptyDataCard
//                                 title="Aucun ticket trouvé"
//                                 description="Commencer par ajouter un ticket."
//                                 actionButton={
//                                     <button
//                                         className="btn btn-success"
//                                         onClick={() => {
//                                             setIsEdit(false);
//                                             toggle();
//                                         }}
//                                         style={{ borderRadius: "20px" }}
//                                     >
//                                         <i className="ri-file-add-line me-1"></i>
//                                         Contactez le Support Client
//                                     </button>
//                                 }
//                             />
//                         )}
//                             {/* <ToastContainer closeButton={false} limit={1} /> */}
//                         </div>
//                     </div>
//                     {/* <CardBody className='pt-0'>
//     {Array.isArray(staticTickets) && staticTickets.length > 0 ? (
//         <TableContainer
//             columns={columns}
//             data={staticTickets}
//             isGlobalFilter={true}
//             isAddUserList={false}
//             customPageSize={8}
//             divClass="table-responsive table-card mb-1"
//             tableClass="align-middle table-nowrap"
//             handleTicketClick={handleTicketsClicks}
//             theadClass="text-muted"
//             isTicketsListFilter={true}
//             SearchPlaceholder='Search for ticket details or something...'
//         />
//     ) : (
//         <Loader error={error} />
//     )}
//     <ToastContainer closeButton={false} limit={1} />
// </CardBody> */}

//                 </Col>
//             </Row>

//             <Modal
//                 isOpen={modal}
//                 toggle={toggle}
//                 centered modalClassName="border-0" contentClassName="rounded-4"
//             >

//                 <ModalHeader toggle={toggle} className="bg-info-subtle p-3 rounded-top-4">
//                     {!!isEdit ? "Edit Ticket" : "Ajouter un Ticket"}
//                 </ModalHeader>

//                 <ModalBody>
//                     <Row className="g-3">

//                         <Col lg={12}>
//                             <Label htmlFor="priority-field" className="form-label">Selectionner le service concerné</Label>
//                             <Input
//                                 id='formule'
//                                 name="formule"
//                                 type="select"
//                                 className="form-select rounded-pill"
//                                 onChange={validation.handleChange}
//                                 onBlur={validation.handleBlur}
//                                 value={
//                                     validation.values.formule || ""
//                                 }
//                             >
//                                 <option value="">Sélectionner une formule</option>
//                                 <option value="InawoSales">InawoSales</option>
//                                 <option value="InawoStock">InawoStock</option>
//                                 <option value="Inawo Global">Inawo Global</option>


//                             </Input>
//                             {validation.touched.formule &&                  
//                                 validation.errors.formule ? (
//                                 <FormFeedback type="invalid">
//                                     {validation.errors.formule}
//                                 </FormFeedback>
//                             ) : null}
//                         </Col>
//                     </Row>

//                 </ModalBody>
//                 <div className="modal-footer">
//                     <div className="hstack gap-2 justify-content-end">
//                         <button onClick={() => setModal(false)} type="button" className="btn btn-light rounded-pill" data-bs-dismiss="modal">Fermer</button>
//                         <button
//                             type="button"
//                             className="btn btn-success rounded-pill"
//                             id="add-btn"
//                             onClick={() => {
//                                 setModal(false);
//                                 setModalOpen(true);
//                             }}
//                         >
//                             Suivant
//                         </button>
//                     </div>
//                 </div>


//             </Modal>
//             <Modal isOpen={modalOpen} toggle={toggleModal} centered modalClassName="border-0" contentClassName="rounded-4">
//                 <ModalHeader toggle={toggleModal} className="bg-info-subtle p-3 rounded-top-4">
//                     Message
//                 </ModalHeader>
//                 <ModalBody>
//                     <Col lg={12}>
//                         <div
//                             className="p-3 mb-3 rounded-4 shadow-sm d-flex align-items-center"
//                             style={{ borderLeft: "4px solid #0d6efd", background: "#fff" }}
//                         >
//                             <i className="ri-question-answer-line fs-4 text-primary me-2"></i>
//                             <div>
//                                 Bonjour ! Notre équipe est disponible pour répondre à vos questions et résoudre vos problèmes.
//                                 <span className="fw-semibold ms-2">Comment peut-on vous aider ?</span>
//                             </div>
//                         </div>
//                         <div className="mb-3">
//                             <Input
//                                 id="message"
//                                 name="message"
//                                 onChange={validation.handleChange}
//                                 onBlur={validation.handleBlur}
//                                 value={
//                                     validation.values.message || ""
//                                 }
//                                 type="textarea"
//                                 placeholder="Votre message ..... "
//                                 style={{
//                                     borderRadius: "30px",
//                                     height: "120px",
//                                     resize: "none",
//                                     paddingTop: "10px",
//                                     background: "#fff",
//                                     boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
//                                 }}
//                             />
//                             {validation.touched.message &&
//                                 validation.errors.message ? (
//                                 <FormFeedback type="invalid">
//                                     {validation.errors.message}
//                                 </FormFeedback>
//                             ) : null}
//                         </div>
//                         <div className="mb-3 p-3 rounded-4 shadow-sm" style={{ background: "#fff" }}>
//                             <Label htmlFor="file-field" className="form-label">
//                                 Déposez votre pièce jointe
//                             </Label>
//                             <Input
//                                 name="document"
//                                 id="document-field"
//                                 className="form-control"
//                                 type="file"
//                                 style={{ borderRadius: "20px" }}
//                                 onChange={(event) => {
//                                     const file = event.currentTarget.files[0];
//                                     validation.setFieldValue("document", file);
//                                  }}
//                             />
//                             {validation.touched.document && validation.errors.document ? (
//                                 <FormFeedback type="invalid">
//                                     {validation.errors.document}
//                                 </FormFeedback>
//                             ) : null}
//                         </div>
//                     </Col>
//                 </ModalBody>
//                 <div className="modal-footer">
//                     <button
//                         type="button"
//                         className="btn btn-light rounded-pill"
//                         onClick={() => {
//                             setModalOpen(false);
//                             setModal(true);
//                         }}
//                     >
//                         Retour
//                     </button>
//                     <button
//                         type="button"
//                         className="btn btn-success rounded-pill"
//                         onClick={() => {
//                             setModalOpen(false);
//                             setSujetOpen(true);
//                         }}
//                     >
//                         Suivant
//                     </button>
//                 </div>
//             </Modal>
//             <Modal isOpen={sujetOpen} toggle={toggleSujet} centered modalClassName="border-0" contentClassName="rounded-4">
//                 <ModalHeader toggle={toggleSujet} className="bg-info-subtle p-3 rounded-top-4">Sujet de Votre demande </ModalHeader>
//                 <ModalBody>
//                     <div className="mb-3">
//                         <Input
//                             id='title'
//                             type="select"
//                             onChange={validation.handleChange}
//                             onBlur={validation.handleBlur}
//                             value={
//                                 validation.values.title || ""
//                             }
//                             style={{ borderRadius: "70px" }}

//                         >
//                             <option value="">Sélectionner un sujet</option>
//                             {availablePromoCodes.map((code, index) => (
//                                 <option key={index} value={code}>{code}</option>
//                             ))}

//                         </Input>
//                         {validation.touched.title &&
//                             validation.errors.title ? (
//                             <FormFeedback type="invalid">
//                                 {validation.errors.title}
//                             </FormFeedback>
//                         ) : null}
//                     </div>

//                 </ModalBody>
//                 <div className="modal-footer">
//                     <button
//                         type="button"
//                         className="btn btn-light rounded-pill"
//                         onClick={() => {
//                             setSujetOpen(false);
//                             setModalOpen(true);
//                         }}
//                     >
//                         Retour
//                     </button>
//                     <button
//                         type="button"
//                         className="btn btn-success rounded-pill"
//                         onClick={() => {
//                             setSujetOpen(false);
//                             setAssOpen(true);
//                         }}
//                     >
//                         Suivant
//                     </button>
//                 </div>

//             </Modal>

//             <Modal isOpen={assOpen} toggle={toggleAss} centered modalClassName="border-0" contentClassName="rounded-4">
//                 <ModalHeader toggle={toggleAss} className="bg-info-subtle p-3 rounded-top-4">Type d'assistance </ModalHeader>
//                 <Form className="tablelist-form" onSubmit={(e) => {
//                     e.preventDefault();

//                     validation.handleSubmit();
//                     return false;
//                 }}>
//                     <ModalBody>
//                         <div className="mb-3">
//                             <Input
//                                 id='priority'
//                                 type="select"
//                                 value={validation.values.priority || ""}
//                                 onChange={validation.handleChange}
//                                 onBlur={validation.handleBlur}
//                                 style={{ borderRadius: "70px" }}

//                             >
//                                 <option value="" >Sélectionner le type d'assistance</option>
//                                 {availableAssurances.map((code, index) => (
//                                     <option key={index} value={code.toUpperCase()}>{code}</option>
//                                 ))}

//                             </Input>
//                         </div>

//                     </ModalBody>
//                     <div className="modal-footer">
//                         <button

//                             type="button"
//                             className="btn btn-light rounded-pill"

//                             onClick={() => {
//                                 setSujetOpen(true);
//                                 setAssOpen(false);
//                             }}
//                         >
//                             Retour
//                         </button>

//                         <button
//                             type="submit"
//                             className="btn btn-success rounded-pill"
//                         >
//                             {myloading ? (
//                                 <span className="d-flex align-items-center">
//                                     <span className="me-2">Envoi...</span>
//                                     <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//                                 </span>
//                             ) : "Envoyer"}
//                         </button>
//                     </div>
//                 </Form>
//             </Modal>
//         </React.Fragment>
//     );
// };

// export default TicketsData;


import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Card, CardBody, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import axios from 'axios';
import { BaseUrl } from '../../APIKey/ApiKey';
import { useProfile } from '../../../Components/Hooks/UserHooks';
import { Link, useNavigate } from "react-router-dom";

// Import des nouveaux composants
import SearchAndActionBar from '../../../Components/Common/SearchAndActionBar';
import EmptyDataCard from '../../../Components/Common/EmptyDataCard';
import Pagination from '../../../Components/Common/Pagination';
import TableContainer from '../../../Components/Common/TableContainer';
import { CustomSelect } from '../../../Components/Common/CustomSelectStyles';
import DeleteModal from "../../../Components/Common/DeleteModal";
import Loader from "../../../Components/Common/Loader";

// Import des colonnes
import { TicketsId, Title, Client, AssignedTo, CreateDate, DueDate, Status, Priority } from "./TicketCol";

// Toast
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TicketsData = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { userProfile, token } = useProfile();

    // États principaux
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    // États pour les modals
    const [modal, setModal] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [sujetOpen, setSujetOpen] = useState(false);
    const [assOpen, setAssOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    
    // États pour le formulaire
    const [isEdit, setIsEdit] = useState(false);
    const [currentTicketId, setCurrentTicketId] = useState(null);
    const [myloading, setMyloading] = useState(false);
    const [ticketToDelete, setTicketToDelete] = useState(null);

    // Données pour les selects
    const availablePromoCodes = [
        "Assistance à l'utilisateur",
        "Problème technique / Bugs",
        "Fonctionnalités manquantes",
        "Gestion des utilisateurs et accès",
        "Facturation et abonnements",
    ];

    const availableAssurances = [
        "Normal",
        "Important",
        "Urgent",
    ];

    const formulesOptions = [
        { value: "", label: "Sélectionner une formule" },
        { value: "InawoSales", label: "InawoSales" },
        { value: "InawoStock", label: "InawoStock" },
        { value: "Inawo Global", label: "Inawo Global" },
    ];

    const prioritesOptions = [
        { value: "", label: "Sélectionner la priorité" },
        { value: "NORMAL", label: "Normal" },
        { value: "IMPORTANT", label: "Important" },
        { value: "URGENT", label: "Urgent" },
    ];

    const sujetsOptions = [
        { value: "", label: "Sélectionner un sujet" },
        ...availablePromoCodes.map((sujet, index) => ({
            value: sujet,
            label: sujet
        }))
    ];

    // Données du formulaire
    const [formData, setFormData] = useState({
        formule: "",
        message: "",
        title: "",
        priority: "",
        document: null
    });

    const [formErrors, setFormErrors] = useState({
        formule: false,
        message: false,
        title: false,
        priority: false
    });

    // Toggle functions
    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
            resetForm();
        } else {
            setModal(true);
        }
    }, [modal]);

    const toggleModal = () => setModalOpen(!modalOpen);
    const toggleSujet = () => setSujetOpen(!sujetOpen);
    const toggleAss = () => setAssOpen(!assOpen);

    // Récupération des tickets
    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BaseUrl}/administration/tickets/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Reconstruction des données pour correspondre au format attendu par le tableau
            const ticketsData = Array.isArray(response.data) ? response.data : [];
            const formattedTickets = ticketsData.reverse().map((ticket, index) => ({
                _id: ticket.ticket_id.toString(),
                id: `TCK-${String(ticket.ticket_id).padStart(3, "0")}`,
                title: ticket.sujet,
                client: ticket.formule,
                assigned: ticket.assignation?.statut || "NON ASSIGNÉ",
                create: new Date(ticket.created_at).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
                due: null,
                status: ticket.statut === "OUVERT" ? "Ouvert" : "Fermé",
                priority: ticket.priorite === "Urgent" ? "High" : ticket.priorite === "Important" ? "Medium" : "Low",
            }));

            setTickets(formattedTickets);
        } catch (error) {
            console.error("Erreur lors de la récupération des tickets:", error);
            toast.error(
                <span style={{ fontWeight: "bold", color: "red" }}>
                    Impossible de charger les tickets
                </span>, {
                position: "top-center",
                autoClose: 4000,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    // Filtrage des données avec searchTerm
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return tickets;

        return tickets.filter((item) =>
            Object.values(item).some(
                (value) =>
                    value &&
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [tickets, searchTerm]);

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Réinitialiser la page lors de la recherche
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Gestion du formulaire
    const resetForm = () => {
        setFormData({
            formule: "",
            message: "",
            title: "",
            priority: "",
            document: null
        });
        setFormErrors({
            formule: false,
            message: false,
            title: false,
            priority: false
        });
        setIsEdit(false);
        setCurrentTicketId(null);
    };

    const clearFieldError = (fieldName) => {
        setFormErrors((prev) => ({
            ...prev,
            [fieldName]: false,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        clearFieldError(name);
    };

    // Gestion des CustomSelect
    const handleFormuleChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            formule: selectedOption ? selectedOption.value : "",
        }));
        clearFieldError("formule");
    };

    const handleSujetChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            title: selectedOption ? selectedOption.value : "",
        }));
        clearFieldError("title");
    };

    const handlePrioriteChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            priority: selectedOption ? selectedOption.value : "",
        }));
        clearFieldError("priority");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({
            ...prev,
            document: file
        }));
    };

    // Fonctions pour obtenir les valeurs sélectionnées
    const getSelectedFormule = () => {
        if (!formData.formule) return formulesOptions[0];
        return formulesOptions.find((opt) => opt.value === formData.formule) || formulesOptions[0];
    };

    const getSelectedSujet = () => {
        if (!formData.title) return sujetsOptions[0];
        return sujetsOptions.find((opt) => opt.value === formData.title) || sujetsOptions[0];
    };

    const getSelectedPriorite = () => {
        if (!formData.priority) return prioritesOptions[0];
        return prioritesOptions.find((opt) => opt.value === formData.priority) || prioritesOptions[0];
    };

    // Validation du formulaire
    const validateForm = () => {
        const errors = {
            formule: !formData.formule || formData.formule.trim() === "",
            message: !formData.message || formData.message.trim() === "",
            title: !formData.title || formData.title.trim() === "",
            priority: !formData.priority || formData.priority.trim() === "",
        };

        setFormErrors(errors);
        return !Object.values(errors).some((error) => error === true);
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error(
                <span style={{ fontWeight: "bold", color: "red" }}>
                    Veuillez remplir tous les champs obligatoires
                </span>, {
                position: "top-center",
                autoClose: 4000,
            });
            return;
        }

        try {
            setMyloading(true);
            const formDataToSend = new FormData();
            formDataToSend.append('formule', formData.formule);
            formDataToSend.append('message', formData.message);
            formDataToSend.append('sujet', formData.title);
            formDataToSend.append('priorite', formData.priority);
            if (formData.document) {
                formDataToSend.append('document', formData.document);
            }

            const response = await axios.post(`${BaseUrl}/administration/createticket/`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            toast.success(
                <span style={{ fontWeight: "bold", color: "#28a745" }}>
                    Ticket créé avec succès!
                </span>, {
                position: "top-center",
                autoClose: 4000,
            });

            await fetchTickets();
            resetForm();
            setAssOpen(false);
            setModal(false);
            setModalOpen(false);
            setSujetOpen(false);

        } catch (error) {
            console.error("Erreur lors de la création du ticket :", error);
            toast.error(
                <span style={{ fontWeight: "bold", color: "red" }}>
                    Erreur lors de la création du ticket
                </span>, {
                position: "top-center",
                autoClose: 4000,
            });
        } finally {
            setMyloading(false);
        }
    };

    // Suppression d'un ticket
    const confirmDeleteTicket = (id) => {
        setTicketToDelete(id);
        setDeleteModal(true);
    };

    const handleDeleteTicket = async () => {
        if (!ticketToDelete) return;

        try {
            await axios.delete(`${BaseUrl}/administration/tickets/${ticketToDelete}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setTickets(tickets.filter((ticket) => ticket._id !== ticketToDelete));
            toast.success(
                <span style={{ fontWeight: "bold", color: "#28a745" }}>
                    Ticket supprimé avec succès!
                </span>, {
                position: "top-center",
                autoClose: 4000,
            });
        } catch (error) {
            console.error("Erreur lors de la suppression du ticket:", error);
            toast.error(
                <span style={{ fontWeight: "bold", color: "red" }}>
                    Erreur lors de la suppression du ticket
                </span>, {
                position: "top-center",
                autoClose: 4000,
            });
        } finally {
            setDeleteModal(false);
            setTicketToDelete(null);
        }
    };

    // Définition des colonnes pour TableContainer
    const columns = useMemo(
        () => [
            {
                header: "ID",
                accessorKey: "id",
                enableColumnFilter: false,
                cell: (cell) => {
                    return <TicketsId {...cell} />;
                },
            },
            {
                header: "Titre",
                accessorKey: "title",
                enableColumnFilter: false,
                cell: (cell) => {
                    return <Title {...cell} />;
                },
            },
            {
                header: "Catégorie",
                accessorKey: "client",
                enableColumnFilter: false,
                cell: (cell) => {
                    return <Client {...cell} />;
                },
            },
            {
                header: "Date de création",
                accessorKey: "create",
                enableColumnFilter: false,
                cell: (cell) => {
                    return <AssignedTo {...cell} />;
                },
            },
            {
                header: "Date de cloture",
                accessorKey: "due",
                enableColumnFilter: false,
                cell: (cell) => {
                    const value = cell.getValue();
                    return <div className='text-center'>{value ? <CreateDate {...cell} /> : "-"}</div>;
                }
            },
            {
                header: "Status",
                accessorKey: "status",
                enableColumnFilter: false,
                cell: (cell) => {
                    return <Status {...cell} />;
                },
            },
            {
                header: "Priorité",
                accessorKey: "priority",
                enableColumnFilter: false,
                cell: (cell) => {
                    return <Priority {...cell} />
                },
            },
            {
                header: "Actions",
                cell: (cell) => {
                    const ticketData = cell.row.original;
                    return (
                        <div className="d-flex" style={{ cursor: "pointer", justifyContent: "center"}}>
                            <i 
                                onClick={() => { navigate(`/apps-tickets-details/${ticketData._id}`); }} 
                                className="ri-eye-fill align-bottom me-1 text-primary"
                                title="Voir les détails"
                            ></i>
                        </div>
                    );
                },
            },
        ],
        []
    );

    return (
        <React.Fragment>
            <ToastContainer />
            
            {/* Modal de suppression */}
            <DeleteModal
                show={deleteModal}
                onCloseClick={() => setDeleteModal(false)}
                onDeleteClick={handleDeleteTicket}
            />

            {/* <div className="page-content"> */}
                <Row>
                    {/* SearchAndActionBar */}
                    <SearchAndActionBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        searchPlaceholder="Chercher un ticket..."
                        showSearch={true}
                        onAddClick={() => {
                            resetForm();
                            setModal(true);
                        }}
                        addButtonText="Créer un ticket"
                        addButtonIcon="ri-file-add-line"
                        showAddButton={true}
                        onExportClick={() => {/* Fonction d'export si nécessaire */}}
                        exportButtonText="Exporter"
                        exportButtonIcon="ri-file-upload-line"
                        showExportButton={false} // Désactivé pour l'instant
                    />
                </Row>

                {/* Tableau avec TableContainer */}
                <Row>
                    <Col lg={12}>
                        {loading ? (
                            <div className="d-flex justify-content-center my-5">
                                <Loader />
                            </div>
                        ) : filteredData.length > 0 ? (
                            <Card style={{ borderRadius: "20px" }}>
                                <CardBody className="p-0">
                                    <TableContainer
                                        columns={columns}
                                        data={currentItems}
                                        isGlobalFilter={false}
                                        customPageSize={itemsPerPage}
                                        divClass="table-responsive table-card mb-1"
                                        tableClass="align-middle table-nowrap"
                                        theadClass="text-muted"
                                    />
                                    <Pagination
                                        data={filteredData}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        perPageData={itemsPerPage}
                                        alwaysShow={true}
                                        showInfo={true}
                                    />
                                </CardBody>
                            </Card>
                        ) : (
                            <EmptyDataCard
                                title="Aucun ticket trouvé"
                                description="Commencer par créer un ticket"
                                actionButton={
                                    <button
                                        className="btn btn-success"
                                        onClick={() => {
                                            resetForm();
                                            setModal(true);
                                        }}
                                        style={{ borderRadius: "20px" }}
                                    >
                                        <i className="ri-file-add-line me-1"></i>
                                        Contactez le Support Client
                                    </button>
                                }
                            />
                        )}
                    </Col>
                </Row>

                {/* Modal Étape 1 - Formule */}
                <Modal isOpen={modal} toggle={toggle} centered modalClassName="border-0" contentClassName="rounded-4">
                    <ModalHeader toggle={toggle} className="bg-info-subtle p-3 rounded-top-4">
                        Sélectionner le service concerné
                    </ModalHeader>
                    <ModalBody>
                        <div className="mb-3">
                            <Label htmlFor="formule" className="form-label">
                                Formule <span className="text-danger">*</span>
                            </Label>
                            <div style={{
                                border: formErrors.formule ? "1px solid #dc3545" : "none",
                                borderRadius: "20px",
                            }}>
                                <CustomSelect
                                    options={formulesOptions}
                                    value={getSelectedFormule()}
                                    onChange={handleFormuleChange}
                                    placeholder="Sélectionner une formule"
                                    className="border-0 rounded-pill"
                                    isSearchable={true}
                                />
                            </div>
                            {formErrors.formule && (
                                <div className="text-danger" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                                    La formule est obligatoire
                                </div>
                            )}
                        </div>
                    </ModalBody>
                    <div className="modal-footer">
                        <div className="hstack gap-2 justify-content-end">
                            <button onClick={toggle} type="button" className="btn btn-light rounded-pill">
                                Fermer
                            </button>
                            <button
                                type="button"
                                className="btn btn-success rounded-pill"
                                onClick={() => {
                                    if (!formData.formule) {
                                        setFormErrors(prev => ({ ...prev, formule: true }));
                                        return;
                                    }
                                    setModal(false);
                                    setModalOpen(true);
                                }}
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* Modal Étape 2 - Message */}
                <Modal isOpen={modalOpen} toggle={toggleModal} centered modalClassName="border-0" contentClassName="rounded-4">
                    <ModalHeader toggle={toggleModal} className="bg-info-subtle p-3 rounded-top-4">
                        Message
                    </ModalHeader>
                    <ModalBody>
                        <div
                            className="p-3 mb-3 rounded-4 shadow-sm d-flex align-items-center"
                            style={{ borderLeft: "4px solid #0d6efd", background: "#fff" }}
                        >
                            <i className="ri-question-answer-line fs-4 text-primary me-2"></i>
                            <div>
                                Bonjour ! Notre équipe est disponible pour répondre à vos questions et résoudre vos problèmes.
                                <span className="fw-semibold ms-2">Comment peut-on vous aider ?</span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <Label htmlFor="message" className="form-label">
                                Votre message <span className="text-danger">*</span>
                            </Label>
                            <Input
                                id="message"
                                name="message"
                                onChange={handleChange}
                                value={formData.message}
                                type="textarea"
                                placeholder="Votre message ....."
                                className={formErrors.message ? "is-invalid" : ""}
                                style={{
                                    borderRadius: "20px",
                                    height: "120px",
                                    resize: "none",
                                    paddingTop: "10px",
                                    background: "#fff",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                    borderColor: formErrors.message ? "#dc3545" : ""
                                }}
                            />
                            {formErrors.message && (
                                <div className="invalid-feedback d-block">
                                    Le message est obligatoire
                                </div>
                            )}
                        </div>
                        <div className="mb-3 p-3 rounded-4 shadow-sm" style={{ background: "#fff" }}>
                            <Label htmlFor="document" className="form-label">
                                Déposez votre pièce jointe
                            </Label>
                            <Input
                                name="document"
                                id="document"
                                className="form-control"
                                type="file"
                                onChange={handleFileChange}
                                style={{ borderRadius: "20px" }}
                            />
                        </div>
                    </ModalBody>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-light rounded-pill"
                            onClick={() => {
                                setModalOpen(false);
                                setModal(true);
                            }}
                        >
                            Retour
                        </button>
                        <button
                            type="button"
                            className="btn btn-success rounded-pill"
                            onClick={() => {
                                if (!formData.message) {
                                    setFormErrors(prev => ({ ...prev, message: true }));
                                    return;
                                }
                                setModalOpen(false);
                                setSujetOpen(true);
                            }}
                        >
                            Suivant
                        </button>
                    </div>
                </Modal>

                {/* Modal Étape 3 - Sujet */}
                <Modal isOpen={sujetOpen} toggle={toggleSujet} centered modalClassName="border-0" contentClassName="rounded-4">
                    <ModalHeader toggle={toggleSujet} className="bg-info-subtle p-3 rounded-top-4">
                        Sujet de votre demande
                    </ModalHeader>
                    <ModalBody>
                        <div className="mb-3">
                            <Label htmlFor="title" className="form-label">
                                Sujet <span className="text-danger">*</span>
                            </Label>
                            <div style={{
                                border: formErrors.title ? "1px solid #dc3545" : "none",
                                borderRadius: "20px",
                            }}>
                                <CustomSelect
                                    options={sujetsOptions}
                                    value={getSelectedSujet()}
                                    onChange={handleSujetChange}
                                    placeholder="Sélectionner un sujet"
                                    className="border-0 rounded-pill"
                                    isSearchable={true}
                                />
                            </div>
                            {formErrors.title && (
                                <div className="text-danger" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                                    Le sujet est obligatoire
                                </div>
                            )}
                        </div>
                    </ModalBody>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-light rounded-pill"
                            onClick={() => {
                                setSujetOpen(false);
                                setModalOpen(true);
                            }}
                        >
                            Retour
                        </button>
                        <button
                            type="button"
                            className="btn btn-success rounded-pill"
                            onClick={() => {
                                if (!formData.title) {
                                    setFormErrors(prev => ({ ...prev, title: true }));
                                    return;
                                }
                                setSujetOpen(false);
                                setAssOpen(true);
                            }}
                        >
                            Suivant
                        </button>
                    </div>
                </Modal>

                {/* Modal Étape 4 - Priorité */}
                <Modal isOpen={assOpen} toggle={toggleAss} centered modalClassName="border-0" contentClassName="rounded-4">
                    <ModalHeader toggle={toggleAss} className="bg-info-subtle p-3 rounded-top-4">
                        Type d'assistance
                    </ModalHeader>
                    <Form onSubmit={handleSubmit}>
                        <ModalBody>
                            <div className="mb-3">
                                <Label htmlFor="priority" className="form-label">
                                    Priorité <span className="text-danger">*</span>
                                </Label>
                                <div style={{
                                    border: formErrors.priority ? "1px solid #dc3545" : "none",
                                    borderRadius: "20px",
                                }}>
                                    <CustomSelect
                                        options={prioritesOptions}
                                        value={getSelectedPriorite()}
                                        onChange={handlePrioriteChange}
                                        placeholder="Sélectionner la priorité"
                                        className="border-0 rounded-pill"
                                        isSearchable={true}
                                    />
                                </div>
                                {formErrors.priority && (
                                    <div className="text-danger" style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
                                        La priorité est obligatoire
                                    </div>
                                )}
                            </div>
                        </ModalBody>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-light rounded-pill"
                                onClick={() => {
                                    setAssOpen(false);
                                    setSujetOpen(true);
                                }}
                            >
                                Retour
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success rounded-pill"
                                disabled={myloading}
                            >
                                {myloading ? (
                                    <span className="d-flex align-items-center">
                                        <span className="me-2">Envoi...</span>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    </span>
                                ) : "Envoyer"}
                            </button>
                        </div>
                    </Form>
                </Modal>
            {/* </div> */}
        </React.Fragment>
    );
};

export default TicketsData;