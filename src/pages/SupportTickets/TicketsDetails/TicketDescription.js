import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Label, Row } from 'reactstrap';

//SimpleBar
import SimpleBar from "simplebar-react";

//import images
import avatar8 from "../../../assets/images/users/avatar-8.jpg";
import avatar10 from "../../../assets/images/users/avatar-10.jpg";
import avatar6 from "../../../assets/images/users/avatar-6.jpg";
import image4 from "../../../assets/images/small/img-4.jpg";
import image5 from "../../../assets/images/small/img-5.jpg";
import { Link, useParams } from 'react-router-dom';
import TicketCodeExample from './TicketsDetailsCode';
import { useProfile } from '../../../Components/Hooks/UserHooks';
import userdummy from "../../../assets/images/users/user-dummy-img.jpg";
import axios from 'axios';
import { BaseUrl } from '../../APIKey/ApiKey';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TicketDescription = ({ id, token, ticket, getTicket }) => {
    const { userProfile } = useProfile();
    //console.log("user profile from ticket description", userProfile);
    //const [ticket, setTicket] = useState(ticket);
    //const { id } = useParams();
    const [messageTosend, setMessageToSend] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    /* const getTicket = async (id) => {
        try {
            const response = await axios.get(`${BaseUrl}/administration/ticket/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setTicket(response)
            if (response.document) {
                setFilename(response.document.split("/").pop())
            }

        } catch (error) {
            console.error("Error fetching ticketT:", error);
        }
    }; */

    useEffect(() => {
        const messageLu = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/administration/marquer_message_lu_abonne/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            } catch (error) {
                console.error("Error marking messages as read:", error);
            }
        }
        messageLu();
    }, [ticket]);

    useEffect(() => {
        getTicket(id);
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await axios.post(`${BaseUrl}/administration/responseabonne/${id}/`, {
                ticket: id,
                message: messageTosend,
                document: selectedFile
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            });
            console.log("Response from API:", response);
            getTicket(id);
            // Réinitialiser le champ de message après l'envoi
            setMessageToSend("");
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error(
                <span style={{ fontWeight: "bold", color: "red" }}>
                    Erreur lors de l'envoie {error.message}
                </span>, {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <React.Fragment>
            <Col lg={8}>
                <ToastContainer />
                <Card className='rounded-4'>
                    {/* <CardBody className="p-4">
                        <h6 className="fw-semibold text-uppercase mb-3">Ticket Discripation</h6>
                        <p className="text-muted">It would also help to know what the errors are - it could be something simple like a message saying delivery is not available which could be a problem with your shipping templates. Too much or too little spacing, as in the example below, can make things unpleasant for the reader. The goal is to make your text as comfortable to read as possible. On the note of consistency, color consistency is a MUST. If you’re not trying to create crazy contrast in your design, then a great idea would be for you to use a color palette throughout your entire design. It will subconsciously interest viewers and also is very pleasing to look at. <Link to="#" className="link-secondary text-decoration-underline">Example</Link></p>
                        <h6 className="fw-semibold text-uppercase mb-3">Create an Excellent UI for a Dashboard</h6>
                        <ul className="text-muted vstack gap-2 mb-4">
                            <li>Pick a Dashboard Type</li>
                            <li>Categorize information when needed</li>
                            <li>Provide Context</li>
                            <li>On using colors</li>
                            <li>On using the right graphs</li>
                        </ul>
                        <div className="mt-4">
                            <h6 className="fw-semibold text-uppercase mb-3">Here is the code you've requsted</h6>
                            <div>
                                <pre className="language-markup rounded-2"><code><TicketCodeExample /></code></pre>
                            </div>
                        </div>
                    </CardBody> */}
                    <CardBody className="p-4">
                        <h5 className="card-title mb-4">Discussions</h5>

                        <SimpleBar style={{ height: "300px" }} className="px-3 mx-n3">
                            {ticket && ticket.messages && ticket.messages.map((msg) => (
                                <div className="d-flex mb-4">
                                    <div className="flex-shrink-0">
                                        <img src={userProfile.photo || userdummy} alt="" className="avatar-xs rounded-circle" />
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h5 className="fs-13">{msg.utilisateur} <small className="text-muted">{msg && (
                                            `${new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: "short", year: "numeric" })} à ${new Date(msg.created_at).toLocaleTimeString('fr-FR')}`
                                        )}</small></h5>
                                        <p className="text-muted">{msg.message}</p>
                                        <Label htmlFor="exampleFormControlTextarea1" className="form-label badge text-muted bg-light"><i className="mdi mdi-reply"></i> Répondre</Label>
                                        {msg.reponse_admin && (
                                            msg.reponse_admin.map((rep) => (
                                                <div className="d-flex mt-4">
                                                    <div className="flex-shrink-0">
                                                        <img src={userdummy} alt="" className="avatar-xs rounded-circle" />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <h5 className="fs-13">{rep.utilisateur} <small className="text-muted">{new Date(rep.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: "short", year: "numeric" })} {new Date(rep.created_at).toLocaleTimeString('fr-FR')}</small></h5>
                                                        <p className="text-muted">{rep.message}</p>
                                                        <Link to="#" className="badge text-muted bg-light"><i className="mdi mdi-reply"></i> Reply</Link>
                                                    </div>
                                                </div>
                                            ))
                                        )}

                                    </div>
                                </div>
                            ))}


                            {/* <div className="d-flex mb-4">
                                <div className="flex-shrink-0">
                                    <img src={avatar6} alt="" className="avatar-xs rounded-circle" />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="fs-13">Donald Palmer <small className="text-muted">24 Dec 2021 - 05:20PM</small></h5>
                                    <p className="text-muted">If you have further questions, please contact Customer Support from the “Action Menu” on your <Link to="#" className="text-decoration-underline">Online Order Support</Link>.</p>
                                    <Link to="#" className="badge text-muted bg-light"><i className="mdi mdi-reply"></i> Reply</Link>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="flex-shrink-0">
                                    <img src={avatar10} alt="" className="avatar-xs rounded-circle" />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="fs-13">Alexis Clarke <small className="text-muted">26 min ago</small></h5>
                                    <p className="text-muted">Your <Link to="#" className="text-decoration-underline">Online Order Support</Link> provides you with the most current status of your order. To help manage your order refer to the “Action Menu” to initiate return, contact Customer Support and more.</p>
                                    <Row className="g-2 mb-3">
                                        <Col lg={1} sm={2} xs={6}>
                                            <img src={image4} alt="" className="img-fluid rounded" />
                                        </Col>
                                        <Col lg={1} sm={2} xs={6}>
                                            <img src={image5} alt="" className="img-fluid rounded" />
                                        </Col>
                                    </Row>
                                    <Link to="#" className="badge text-muted bg-light"><i className="mdi mdi-reply"></i> Reply</Link>
                                    <div className="d-flex mt-4">
                                        <div className="flex-shrink-0">
                                            <img src={avatar6} alt="" className="avatar-xs rounded-circle" />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h5 className="fs-13">Donald Palmer <small className="text-muted">8 sec ago</small></h5>
                                            <p className="text-muted">Other shipping methods are available at checkout if you want your purchase delivered faster.</p>
                                            <Link to="#" className="badge text-muted bg-light"><i className="mdi mdi-reply"></i> Reply</Link>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </SimpleBar>
                        <form onSubmit={handleSubmit} className="mt-3">
                            <Row className="g-3">
                                <Col lg={12}>
                                    <Label htmlFor="exampleFormControlTextarea1" className="form-label">Répondre au message</Label>
                                    <textarea value={messageTosend} required onChange={(e) => setMessageToSend(e.target.value)} className="form-control bg-light border-light" id="exampleFormControlTextarea1" rows="3" placeholder="Entrer votre message"></textarea>
                                </Col>
                                <Col lg={12}>
      <Label htmlFor="file-upload" className="form-label">
        Joindre un fichier (facultatif)
      </Label>
      <input
        type="file"
        id="file-upload"
        className="form-control bg-light border-light"
        onChange={(e) => setSelectedFile(e.target.files[0])}
        accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx,.zip"
      />
    </Col>
                                <Col lg={12} className="text-end">
                                    {loading ? (
                                        <button type="button" className="btn btn-success" disabled>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Envoi...
                                        </button>
                                    ) : (
                                        <button type='submit' className="btn btn-success">Envoyé</button>
                                    )}
                                </Col>
                            </Row>
                        </form>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default TicketDescription;