import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from 'reactstrap';
import img from "../../../assets/images/companies/img-4.png";
import { useProfile } from '../../../Components/Hooks/UserHooks';
import { BaseUrl } from '../../APIKey/ApiKey';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Section = () => {
    const { userProfile, token } = useProfile();
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);

    const getTicket = async (id) => {
        try {
            const response = await axios.get(`${BaseUrl}/administration/ticket/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setTicket(response)
        } catch (error) {
            console.error("Error fetching ticketT:", error);
        }
    };
    useEffect(() => {
        getTicket(id);
    }, [id]);
    return (
        <React.Fragment>
            <Col lg={12}>
                <Card className="mt-n4 mx-n4 mb-n5">
                    <div className="bg-warning-subtle">
                        <CardBody className="pb-4 mb-5">
                            <Row>
                                <div className="col-md">
                                    <Row className="align-items-center">
                                        <div className="col-md-auto">
                                            <div className="avatar-md mb-md-0 mb-4">
                                                <div className="avatar-title bg-white rounded-circle">
                                                    <img src={img} alt="" className="avatar-sm" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md">
                                            {ticket && (
                                                <h4 className="fw-semibold" id="ticket-title">{ticket && `TCK-${String(ticket.ticket_id).padStart(3, "0")}`} - Créé le {new Date(ticket.created_at).toLocaleDateString("fr-FR", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })}</h4>
                                            )}

                                            <div className="hstack gap-3 flex-wrap">
                                                <div className="text-muted"><i className="ri-building-line align-bottom me-1"></i> <span id="ticket-client">{ticket && ticket.formule}</span></div>
                                                <div className="vr"></div>
                                                <div className="text-muted">Date de Création : <span className="fw-medium" id="create-date">{ticket && new Date(ticket.created_at).toLocaleDateString("fr-FR", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}</span></div>
                                                <div className="vr"></div>
                                                <div className="text-muted">Date de cloture : <span className="fw-medium" id="due-date">{ticket && ticket.date_cloture ? ticket.date_cloture : "-"}</span></div>
                                                <div className="vr"></div>
                                                <div className="badge rounded-pill bg-info fs-12" id="ticket-status">{ticket && ticket.statut}</div>
                                                <div className="badge rounded-pill bg-danger fs-12" id="ticket-priority">{ticket && ticket.priorite}</div>
                                            </div>
                                        </div>
                                    </Row>
                                </div>
                                <div className="col-md-auto mt-md-0 mt-4">
                                    <div className="hstack gap-1 flex-wrap">
                                        <button type="button" className="btn avatar-xs mt-n1 p-0 favourite-btn active">
                                            <span className="avatar-title bg-transparent fs-15">
                                                <i className="ri-star-fill"></i>
                                            </span>
                                        </button>
                                        <UncontrolledDropdown >
                                            <DropdownToggle tag="button" type="button" className="btn py-0 fs-16 text-body">
                                                <i className="ri-share-line"></i>
                                            </DropdownToggle>

                                            <DropdownMenu>
                                                <li><DropdownItem><i className="ri-eye-fill align-bottom me-2 text-muted"></i> View</DropdownItem></li>
                                                <li><DropdownItem><i className="ri-share-forward-fill align-bottom me-2 text-muted"></i> Share with</DropdownItem></li>
                                                <li><DropdownItem><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete</DropdownItem></li>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                        <button type="button" className="btn py-0 fs-16 text-body">
                                            <i className="ri-flag-line"></i>
                                        </button>
                                    </div>
                                </div>
                            </Row>
                        </CardBody>
                    </div>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default Section;