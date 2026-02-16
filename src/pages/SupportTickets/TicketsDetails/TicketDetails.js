import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Table } from 'reactstrap';

import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import avatar10 from "../../../assets/images/users/avatar-10.jpg";
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import { useProfile } from '../../../Components/Hooks/UserHooks';
import axios from 'axios';
import { BaseUrl } from '../../APIKey/ApiKey';

const TicketDetails = ({ticket}) => {
    const { userProfile, token } = useProfile();
    const { id } = useParams();
    //const [ticket, setTicket] = React.useState(null);
    const [filename, setFilename] = useState("");
    const [documentTicket, setDocumentTicket] = useState(null);


    return (
        <React.Fragment>
            <Col lg={4}>
                <Card className='rounded-4'>
                    <CardHeader style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>
                        <h5 className="card-title mb-0">Ticket Details</h5>
                    </CardHeader>
                    <CardBody>
                        <div className="table-responsive table-card">
                            <Table className="table-borderless align-middle mb-0">
                                <tbody>
                                    <tr>
                                        <td className="fw-medium">Ticket</td>
                                        <td>{ticket && `TCK-${String(ticket.ticket_id).padStart(3, "0")}`}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-medium">Formule</td>
                                        <td id="t-client">{ticket && ticket.formule}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-medium">Sujet</td>
                                        <td>{ticket && ticket.sujet}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-medium">Assigné</td>
                                        <td>
                                            {ticket && ticket.assignation.statut}
                                            {/* <div className="avatar-group">
                                                <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover" data-bs-original-title="Erica Kernan">
                                                    <img src={avatar4} alt="" className="rounded-circle avatar-xs" />
                                                </Link>
                                                <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover" data-bs-original-title="Alexis Clarke">
                                                    <img src={avatar10} alt="" className="rounded-circle avatar-xs" />
                                                </Link>
                                                <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover" data-bs-original-title="James Price">
                                                    <img src={avatar3} alt="" className="rounded-circle avatar-xs" />
                                                </Link>
                                                <Link to="#" className="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" data-bs-original-title="Add Members">
                                                    <div className="avatar-xs">
                                                        <div className="avatar-title fs-16 rounded-circle bg-light border-dashed border text-primary">
                                                            +
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div> */}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fw-medium">Status:</td>
                                        <td>
                                            {ticket && ticket.statut}
                                            {/* <select className="form-select" id="t-status" data-choices data-choices-search-false aria-label="Default select example">
                                                <option value>Stauts</option>
                                                <option defaultValue="New">New</option>
                                                <option value="Open">Open</option>
                                                <option value="Inprogress">Inprogress</option>
                                                <option value="Closed">Closed</option>
                                            </select> */}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fw-medium">Priority</td>
                                        <td>
                                            <span className="badge bg-danger" id="t-priority">{ticket && ticket.priorite}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="fw-medium">Créé le</td>
                                        <td id="c-date">{ticket && new Date(ticket.created_at).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-medium">Date cloture</td>
                                        <td id="d-date">{ticket && ticket.date_cloture ? ticket.date_cloture : "-"}</td>
                                    </tr>
                                    {/* <tr>
                                        <td className="fw-medium">Last Activity</td>
                                        <td>14 min ago</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-medium">Labels</td>
                                        <td className="hstack text-wrap gap-1">
                                            <span className="badge bg-primary-subtle text-primary">Admin</span>
                                            <span className="badge bg-primary-subtle text-primary">UI</span>
                                            <span className="badge bg-primary-subtle text-primary">Dashboard</span>
                                            <span className="badge bg-primary-subtle text-primary">Design</span>
                                        </td>
                                    </tr> */}
                                </tbody>
                            </Table>
                        </div>
                    </CardBody>
                </Card>
                <Card className='rounded-4'>
                    <CardHeader style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>
                        <h6 className="card-title fw-semibold mb-0">Fichiers attachés</h6>
                    </CardHeader>
                    <CardBody>
                        {/* All document des messages */}
                        {ticket && Array.isArray(ticket.all_message_documents) && (
                            ticket.all_message_documents.map((doc, index) => (
                                <div key={index} className="d-flex flex-wrap align-items-center border border-dashed p-2 rounded">
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="mb-1">
                                            <Link to={`${BaseUrl}/${doc.url}`} target="_blank" rel="noopener noreferrer">
                                                {doc.filename.substring(doc.filename.indexOf("_") + 1)}
                                            </Link>
                                        </h6>
                                    </div>
                                </div>
                            ))
                        )}

                        {ticket && ticket.document && (
                            <div className="d-flex flex-wrap align-items-center border border-dashed p-2 rounded">
                                <div className="flex-grow-1 ms-3">
                                    <h6 className="mb-1"><Link to={`${BaseUrl}/${ticket.document}`} target='_blanc'>{filename}</Link></h6>
                                    {/* <small className="text-muted">3.2 MB</small> */}
                                </div>
                            </div>
                        )}
                        {ticket && !ticket.document && ticket.all_message_documents.lenght == 0 && (
                            <div className="text-muted">Aucun fichier attaché</div>
                        )}
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default TicketDetails;