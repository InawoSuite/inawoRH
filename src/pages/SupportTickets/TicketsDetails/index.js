import React, { useEffect, useState } from 'react';
import { Container, Row } from 'reactstrap';

import Section from './Section';
import TicketDescription from './TicketDescription';
import TicketDetails from './TicketDetails';
import axios from 'axios';
import { useProfile } from '../../../Components/Hooks/UserHooks';
import { useParams } from 'react-router-dom';
import { BaseUrl } from '../../APIKey/ApiKey';


const TicketsDetaiks = () => {
    const [ticket, setTicket] = useState(null);
    const { id } = useParams();
    const { userProfile, token } = useProfile();
    const [filename, setFilename] = useState("");
    const [consecutiveErrors, setConsecutiveErrors] = useState(0);

    const getTicket = async (ticketId) => {
        try {
            // Vérification du token avant la requête
            if (!token) {
                console.warn('[TicketDetails] Token manquant, polling suspendu');
                return;
            }

            const response = await axios.get(`${BaseUrl}/administration/ticket/${ticketId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                timeout: 10000 // timeout 10s
            });
            setTicket(response)
            console.log("[TicketDetails] Ticket details fetched:", response);
            if (response.document) {
                setFilename(response.document.split("/").pop())
            }
            
            // Réinitialiser le compteur d'erreurs en cas de succès
            setConsecutiveErrors(0);

        } catch (error) {
            const newErrorCount = consecutiveErrors + 1;
            setConsecutiveErrors(newErrorCount);
            console.error(`[TicketDetails] Erreur requête (tentative ${newErrorCount}):`, error.message || error);
            
            if (newErrorCount >= 5) {
                console.warn('[TicketDetails] 5+ erreurs consécutives, polling réduira la fréquence');
            }
        }
    };

    useEffect(() => {
        if (!token) return;
        getTicket(id);
    }, [id, token]);

    // Polling avec backoff exponentiel (initial 30s, max 5min)
    useEffect(() => {
        if (!token) return; // Ne pas poll si pas de token
        
        getTicket(id);

        // Calculer l'intervalle basé sur les erreurs consécutives
        const baseInterval = 30000; // 30 secondes
        const backoffMultiplier = Math.min(Math.pow(2, Math.max(0, consecutiveErrors - 3)), 10); // cap à 10x
        const interval = Math.min(baseInterval * backoffMultiplier, 5 * 60 * 1000); // max 5 minutes
        
        console.log(`[TicketDetails] Polling lancé (intervalle: ${interval / 1000}s, erreurs: ${consecutiveErrors})`);
        
        const timerId = setInterval(() => {
            getTicket(id);
        }, interval);

        return () => clearInterval(timerId); // Nettoyage
    }, [id, token, consecutiveErrors]);

    document.title = "Ticket Details | Velzon - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Section />
                    </Row>
                    <Row>
                        <TicketDescription id={id} token={token} ticket={ticket} getTicket={getTicket} />
                        <TicketDetails ticket={ticket} />
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default TicketsDetaiks;