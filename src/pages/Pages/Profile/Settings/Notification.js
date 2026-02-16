import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    CardBody,
    Row,
    Col,
    Card,
    Container,
    Button,
    CardHeader, 
} from "reactstrap";
import { Link } from "react-router-dom";
// Assurez-vous que ces chemins d'importation sont corrects pour votre projet
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import EmptyDataCard from "../../../../Components/Common/EmptyDataCard";
import Loader from "../../../../Components/Common/Loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import h1 from"../../../../assets/images/profils/P1.jpg"
import h2 from"../../../../assets/images/profils/P2.jpg"
import h3 from"../../../../assets/images/profils/P3.png"
import h4 from"../../../../assets/images/profils/P1.jpg"
import f1 from"../../../../assets/images/profils/P5.jpg"
import f2 from"../../../../assets/images/profils/P3.png"
// import f3 from"../../../../assets/images/profils/P7.jpg"

// =================================================================
// 1. DONNÉES FICTIVES DES NOTIFICATIONS (avec isRead)
// =================================================================
const fictiveNotifications = [
    // ... (Données de notification non modifiées)
    {
        id: 1,
        user: { name: "Antoine Dubois", photoUrl: h1 },
        action: "a aimé votre nouvelle photo de profil.",
        type: "like",
        timestamp: new Date(Date.now() - 3600000 * 2),
        isRead: false,
    },
    {
        id: 2,
        user: { name: "Sophie Martin", photoUrl: f2 },
        action: "a laissé un nouveau commentaire : 'Excellent travail !'",
        type: "comment",
        timestamp: new Date(Date.now() - 3600000),
        isRead: false,
    },
    {
        id: 3,
        user: { name: "Léa Dupont", photoUrl: f1 },
        action: "a commencé à vous suivre.",
        type: "follow",
        timestamp: new Date(Date.now() - 3600000 * 3),
        isRead: false,
    },
    {
        id: 4,
        user: { name: "Thomas Leroy", photoUrl: h2 },
        action: "vous a mentionné dans une publication de groupe.",
        type: "mention",
        timestamp: new Date(new Date().setHours(10, 30, 0, 0)),
        isRead: true,
    },
    {
        id: 5,
        user: { name: "Marc Moreau", photoUrl: h3 },
        action: "a aimé votre publication sur la conférence.",
        type: "like",
        timestamp: new Date(new Date().setHours(9, 0, 0, 0)),
        isRead: true,
    },
    {
        id: 6,
        user: { name: "Équipe INAWO", photoUrl: h4 },
        action: "a publié un nouveau résumé de l'événement Marketing Digital.",
        type: "update",
        timestamp: new Date(Date.now() - 3600000 * 48),
        isRead: true,
    },
    {
        id: 7,
        user: { name: "Chloé Petit", photoUrl: h1},
        action: "a aimé 3 autres de vos publications.",
        type: "like-group",
        timestamp: new Date(Date.now() - 3600000 * 60),
        isRead: true,
    },
    {
        id: 8,
        user: { name: "Admin", photoUrl: h2},
        action: "a mis à jour votre statut de compte.",
        type: "system",
        timestamp: new Date(Date.now() - 3600000 * 180),
        isRead: true,
    },
];

// =================================================================
// 2. FONCTIONS UTILITAIRES ET SOUS-COMPOSANTS
// =================================================================

const formatTimeAgo = (timestamp) => {
    // ... (Fonction formatTimeAgo non modifiée)
    const diff = Date.now() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "il y a qqs instants";
    if (minutes < 60) return `il y a ${minutes} min`;
    if (hours < 24) return `il y a ${hours} h`;
    if (days === 1) return `Hier`;
    if (days < 7) return `il y a ${days} j`;
    return timestamp.toLocaleDateString('fr-FR');
};

// Composant de Rendu d'une seule Notification (MIS À JOUR : Ajout de handleDelete)
const NotificationItem = ({ notification, isLastOverall, onDelete }) => {
    const { user, action, type, timestamp, isRead, id } = notification;

    const typeConfig = {
        'like': { icon: 'ri-heart-fill', color: 'danger' },
        'comment': { icon: 'ri-chat-4-fill', color: 'primary' },
        'follow': { icon: 'ri-user-add-fill', color: 'success' },
        'mention': { icon: 'ri-at-line', color: 'info' },
        'update': { icon: 'ri-newspaper-line', color: 'warning' },
        'like-group': { icon: 'ri-thumb-up-fill', color: 'danger' },
        'system': { icon: 'ri-settings-5-fill', color: 'secondary' },
    };
    const config = typeConfig[type] || { icon: 'ri-notification-3-line', color: 'secondary' };

    // RETRAIT DE LA BORDURE si c'est le tout dernier élément
    const borderClass = isLastOverall ? 'border-bottom-0' : 'border-bottom border-light';

    // Styles conditionnels pour les notifications NON LUES
    const itemClassName = `list-group-item p-3 ${borderClass} ${!isRead ? 'bg-soft-primary' : ''}`;
    const nameClassName = `text-dark ${!isRead ? 'fw-bold' : 'fw-medium'}`;

    return (
        <li className={itemClassName}>
            <div className="d-flex align-items-start">
                {/* 1. Photo de Profil (Avatar) */}
                <div className="me-3">
                    <img
                        src={user.photoUrl || "/images/default-user.jpg"}
                        alt={user.name}
                        className="rounded-circle avatar-sm object-fit-cover" 
                        onError={(e) => { e.target.onerror = null; e.target.src = "/images/default-user.jpg"; }}
                        style={{ width: '40px', height: '40px' }}
                    />
                </div>
                
                {/* 2. Contenu de la Notification */}
                <div className="flex-grow-1 overflow-hidden">
                    <p className="mb-0">
                        <strong className={nameClassName}>{user.name}</strong>{" "} 
                        <span className={`text-muted ${!isRead ? 'fw-medium' : ''}`}>{action}</span>
                    </p>
                    <small className="text-muted">
                        <i className={`${config.icon} text-${config.color} me-1`}></i>
                        {formatTimeAgo(timestamp)}
                    </small>
                </div>

                {/* 3. Bouton/Action (Ex: Supprimer) */}
                <div className="flex-shrink-0 ms-2">
                    <Button 
                        color="soft-danger" // Couleur danger pour la suppression
                        size="sm"
                        onClick={() => onDelete(id)} // Appel de la fonction de suppression
                        style={{borderRadius: '15px'}}
                    >
                        <i className="ri-delete-bin-line me-1"></i>
                        Supprimer
                    </Button>
                </div>
            </div>
        </li>
    );
};


// =================================================================
// 3. COMPOSANT PRINCIPAL (MarketingNotifications)
// =================================================================

const MarketingNotifications = () => {
  
    document.title = "Notifications | INAWO - Suite de Gestion";

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]); 

    const fetchNotifications = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Utilisation d'une copie pour s'assurer que les ID sont uniques si on les utilise pour la suppression
            setNotifications([...fictiveNotifications]);

        } catch (err) {
            console.error("ERREUR API:", err);
            const errorMsg = "Erreur lors du chargement des notifications";
            setError(errorMsg);
            toast.error("Erreur lors du chargement des données");
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // NOUVELLE FONCTION DE SUPPRESSION
    const handleDeleteNotification = useCallback((idToDelete) => {
        setNotifications(prevNotifications => {
            const newNotifications = prevNotifications.filter(n => n.id !== idToDelete);
            toast.success(`Notification n°${idToDelete} supprimée.`);
            return newNotifications;
        });
    }, []);

    const handleMarkAllAsRead = () => {
        const unreadCount = notifications.filter(n => !n.isRead).length;

        if (unreadCount === 0) {
            toast.info("Toutes les notifications sont déjà lues !");
            return;
        }

        const updatedNotifications = notifications.map(n => ({
            ...n,
            isRead: true
        }));
        
        setNotifications(updatedNotifications);
        toast.success(`${unreadCount} notifications marquées comme lues.`);
    };

    // LOGIQUE DE REGROUPEMENT PAR PÉRIODE (NON MODIFIÉ)
    const groupedNotifications = useMemo(() => {
        const sorted = [...notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        const groups = {};
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const sevenDays = 7 * oneDay;

        sorted.forEach(notif => {
            const timeDiff = now - notif.timestamp.getTime();
            let groupKey;

            if (timeDiff < oneDay / 2) {
                groupKey = "Plus Récentes";
            } else if (timeDiff < oneDay) {
                groupKey = "Aujourd'hui";
            } else if (timeDiff < sevenDays) {
                groupKey = "Cette Semaine";
            } else {
                groupKey = "Plus Ancien";
            }

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(notif);
        });

        return Object.entries(groups).map(([title, items]) => ({ title, items }));
    }, [notifications]);

    const unreadCount = useMemo(() => {
        return notifications.filter(n => !n.isRead).length;
    }, [notifications]);
    
    // Calcul de l'index de la dernière notification au total
    const totalNotifications = notifications.length;

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <ToastContainer position="top-right" autoClose={5000} />
                    
                    <BreadCrumb
                        title="&nbsp;NOTIFICATIONS"
                        pageTitle={
                            <>
                                <i className="ri-notification-4-line"></i>
                                &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
                            </>
                        }
                    />
                    
                    <Row>
                        <Col lg={12}>
                            {isLoading ? (
                                // ... (Rendu de chargement)
                                <div className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '300px' }}>
                                    <div className="text-center">
                                        <Loader />
                                        <p className="mt-3 text-muted">Chargement des notifications...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                // ... (Rendu d'erreur)
                                <div className="text-center my-5">
                                    <i className="ri-error-warning-line text-danger display-4"></i>
                                    <h5 className="mt-3 text-danger">Erreur de chargement</h5>
                                    <p className="text-muted">{error}</p>
                                    <Button 
                                        color="primary" 
                                        onClick={fetchNotifications}
                                        style={{ borderRadius: "20px" }}
                                    >
                                        <i className="ri-refresh-line me-1"></i>
                                        Réessayer
                                    </Button>
                                </div>
                            ) : notifications.length > 0 ? (
                                
                                <Row> 
                                    
                                    {/* COLONNE PRINCIPALE (NOTIFICATIONS - 12/12) */}
                                    <Col lg={12} className="mb-4">
                                        <Card style={{ borderRadius: "20px" }}>
                                            
                                            <CardHeader className="d-flex justify-content-between align-items-center p-3" style={{ borderRadius: "20px 20px 0 0" }}>
                                                <h5 className="mb-0 text-primary">
                                                    <i className="ri-sparkling-2-line me-2"></i> 
                                                    Notification Récentes ({notifications.length})
                                                </h5>
                                                
                                                {/* Bouton MARQUER TOUT COMME LU */}
                                                <Button 
                                                    color="light" 
                                                    size="sm"
                                                    onClick={handleMarkAllAsRead}
                                                    disabled={unreadCount === 0}
                                                    style={{ borderRadius: "15px" }}
                                                >
                                                    <i className={`ri-check-double-line me-1 ${unreadCount > 0 ? 'text-primary' : ''}`}></i>
                                                    Marquer tout comme lu
                                                </Button>
                                            </CardHeader>
                                            
                                            <CardBody className="p-0">
                                                <ul className="list-group list-group-flush">
                                                    {groupedNotifications.map((group, groupIndex) => (
                                                        <React.Fragment key={group.title}>
                                                            {/* Titre du Groupe (Regroupement) */}
                                                            <li className="list-group-item list-group-item-light fw-bold text-primary py-2 px-3 border-top border-light">
                                                                <i className="ri-time-line me-1"></i> 
                                                                {group.title}
                                                            </li>
                                                            {/* Notifications du groupe */}
                                                            {group.items.map((notif, itemIndex) => {
                                                                // Calcul de l'index global pour savoir si c'est la dernière notification du total
                                                                const isLastOverall = notif.id === notifications[totalNotifications - 1]?.id; 
                                                                
                                                                return (
                                                                    <NotificationItem 
                                                                        key={notif.id} 
                                                                        notification={notif} 
                                                                        isLastOverall={isLastOverall}
                                                                        onDelete={handleDeleteNotification} // PASSAGE DE LA FONCTION
                                                                    />
                                                                );
                                                            })}
                                                        </React.Fragment>
                                                    ))}
                                                </ul>
                                            </CardBody>
                                        </Card>
                                    </Col>

                                </Row>

                            ) : (
                                <EmptyDataCard
                                    title="Aucune notification"
                                    description="Votre boîte de notifications est vide. Tout est à jour !"
                                    actionButton={null}
                                />
                            )}
                        </Col>
                    </Row>
                    
                </Container>
            </div>
        </React.Fragment>
    );
};

export default MarketingNotifications;