import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Container,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import messWall from "../../assets/images/mes-wall/wall2.jpg";
// import messWall from "../../assets/images/mes-wall/wall-inw3.jpg";
import wall from "../../assets/images/p2.jpg";

// Import des images de profil
import P1 from "../../assets/images/profils/P1.jpg";
import P2 from "../../assets/images/profils/P2.jpg";
import P3 from "../../assets/images/profils/P3.png";
import P4 from "../../assets/images/profils/P4.webp";
import P6 from "../../assets/images/profils/P6.webp";

// Données fictives pour les discussions 
const initialDiscussions = [
  {
    id: 1,
    name: "Marie Dubois",
    lastMessage: "Bonjour, j'ai reçu la commande, merci !",
    timestamp: "10:23",
    unread: 2,
    avatar: "MD",
    image: P6,
    status: "online",
    contactId: "marie-dubois",
    messages: [
      { id: 1, text: "Bonjour, je suis intéressé par votre produit", sender: "them", time: "09:15" },
      { id: 2, text: "Bien sûr, je peux vous aider. De quoi avez-vous besoin ?", sender: "me", time: "09:16" },
      { id: 3, text: "J'aimerais connaître les délais de livraison", sender: "them", time: "09:20" },
      { id: 4, text: "Les délais sont de 3-5 jours ouvrés", sender: "me", time: "09:22" },
      { id: 5, text: "Bonjour, j'ai reçu la commande, merci !", sender: "them", time: "10:23" }
    ]
  },
  {
    id: 2,
    name: "Pierre Martin",
    lastMessage: "Le devis me convient parfaitement",
    timestamp: "Hier",
    unread: 0,
    avatar: "PM",
    image: P1, 
    status: "offline",
    contactId: "pierre-martin",
    messages: [
      { id: 1, text: "Bonjour, pouvez-vous me faire un devis ?", sender: "them", time: "Hier 14:30" },
      { id: 2, text: "Je vous envoie ça dans la journée", sender: "me", time: "Hier 14:35" },
      { id: 3, text: "Le devis me convient parfaitement", sender: "them", time: "Hier 16:20" }
    ]
  },
  {
    id: 3,
    name: "Sophie Lambert",
    lastMessage: "Quand sera la prochaine livraison ?",
    timestamp: "09:45",
    unread: 1,
    avatar: "SL",
    image: P4, 
    status: "online",
    contactId: "sophie-lambert",
    messages: [
      { id: 1, text: "Bonjour, je voulais suivre ma commande", sender: "them", time: "09:30" },
      { id: 2, text: "Votre commande est en cours de préparation", sender: "me", time: "09:35" },
      { id: 3, text: "Quand sera la prochaine livraison ?", sender: "them", time: "09:45" }
    ]
  },
  {
    id: 4,
    name: "Thomas Bernard",
    lastMessage: "Merci pour votre réactivité",
    timestamp: "Hier",
    unread: 0,
    avatar: "TB",
    image: P4, 
    status: "away",
    contactId: "thomas-bernard",
    messages: [
      { id: 1, text: "J'ai un problème avec le produit reçu", sender: "them", time: "Hier 11:15" },
      { id: 2, text: "Je m'en occupe immédiatement", sender: "me", time: "Hier 11:20" },
      { id: 3, text: "Merci pour votre réactivité", sender: "them", time: "Hier 12:05" }
    ]
  },

  {
    id: 5,
    name: "Carlos Leboney",
    lastMessage: "Merci pour votre réactivité",
    timestamp: "Hier",
    unread: 0,
    avatar: "CL",
    image: P3, 
    status: "away",
    contactId: "carlos-leboney",
    messages: [
      { id: 1, text: "J'ai un problème avec le produit reçu", sender: "them", time: "Hier 11:15" },
      { id: 2, text: "Je m'en occupe immédiatement", sender: "me", time: "Hier 11:20" },
      { id: 3, text: "Merci pour votre réactivité", sender: "them", time: "Hier 12:05" }
    ]
  }
];

// Composant principal Discussion
const Discussion = () => {
  const location = useLocation();
  const messagesEndRef = useRef(null);
  
  // États principaux
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [selectedDiscussion, setSelectedDiscussion] = useState(initialDiscussions[0]);
  const [newMessage, setNewMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false); 
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Refs pour détecter les clics en dehors
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const infoRef = useRef(null);

  // Effet pour détecter les clics en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      if (showInfoModal && infoRef.current && !infoRef.current.contains(event.target)) {
        setShowInfoModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfoModal]);

  // Fonction pour trouver la discussion par contactId
  const getDiscussionFromContact = (contactId) => {
    return discussions.find(discussion => discussion.contactId === contactId) || discussions[0];
  };

  // Effet pour mettre à jour la discussion quand l'URL change
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const contactId = searchParams.get('contact');
    
    if (contactId) {
      const discussion = getDiscussionFromContact(contactId);
      if (discussion && discussion.id !== selectedDiscussion.id) {
        setSelectedDiscussion(discussion);
        setNewMessage("");
      }
    }
  }, [location.search, discussions, selectedDiscussion.id]);

  // Titre de la page
  useEffect(() => {
    document.title = "Discussion | INAWO - Suite de Gestion";
  }, []);

  // Scroll vers le bas des messages
  useEffect(() => {
    scrollToBottom();
  }, [selectedDiscussion]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Envoyer un message
  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const updatedDiscussions = discussions.map(discussion => {
      if (discussion.id === selectedDiscussion.id) {
        const newMsg = {
          id: Date.now(),
          text: newMessage,
          sender: "me",
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...discussion,
          lastMessage: newMessage,
          timestamp: "Maintenant",
          messages: [...discussion.messages, newMsg],
          unread: 0
        };
      }
      return discussion;
    });

    setDiscussions(updatedDiscussions);
    setSelectedDiscussion(updatedDiscussions.find(d => d.id === selectedDiscussion.id));
    setNewMessage("");
    toast.success("Message envoyé !");
  };

  // Gérer la touche Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) setShowSearch(false);
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    if (!showSearch) setDropdownOpen(false);
  };

  const handleInfoClick = () => {
    setShowInfoModal(!showInfoModal);
    if (!showInfoModal) {
      setShowSearch(false);
      setDropdownOpen(false);
    }
  };

  // Fonction pour afficher l'avatar
  const renderAvatar = (discussion, size = '38px', showStatus = true) => {
    // Vérifier si l'image existe et est valide
    if (discussion.image) {
      return (
        <div 
          className="avatar"
          style={{ 
            width: size, 
            height: size, 
            position: 'relative',
            margin: '0 auto'
          }}
        >
          <img 
            src={discussion.image} 
            alt={discussion.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%'
            }}
            onError={(e) => {
              // Si l'image ne charge pas, afficher l'avatar texte
              e.target.style.display = 'none';
              const fallback = e.target.parentElement.querySelector('.avatar-fallback');
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          {/* Avatar de secours (texte) */}
          <div 
            className="avatar-fallback"
            style={{
              display: 'none',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: `hsl(${discussion.id * 60}, 70%, 45%)`,
              color: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: size === '38px' ? '0.9rem' : '1.5rem',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          >
            {discussion.avatar}
          </div>
          {/* Indicateur de statut */}
          {showStatus && (
            <div className={`status-indicator status-${discussion.status}`} />
          )}
        </div>
      );
    } else {
      // Si pas d'image, utiliser l'avatar texte
      return (
        <div 
          className="avatar"
          style={{ 
            width: size, 
            height: size, 
            position: 'relative',
            backgroundColor: `hsl(${discussion.id * 60}, 70%, 45%)`,
            color: 'white',
            margin: '0 auto'
          }}
        >
          <span style={{ 
            fontSize: size === '38px' ? '0.9rem' : '1.5rem',
            fontWeight: 'bold'
          }}>
            {discussion.avatar}
          </span>
          {/* Indicateur de statut */}
          {showStatus && (
            <div className={`status-indicator status-${discussion.status}`} />
          )}
        </div>
      );
    }
  };

  return (
    <React.Fragment>
      <style>
        {`
          .page-content {
            padding: 63px 0 0px 0 !important;
            margin: 0 !important;
            min-height: calc(100vh - 40px);
          }

          .discussion-container {
            height: calc(100vh - 140px) !important;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            background: white;
            display: flex;
            flex-direction: column;
            margin-top: 10px;
            margin-bottom: 15px;
          }

          .chat-header {
            height: 70px;
            flex-shrink: 0;
            border-bottom: 1px solid #e9ecef;
            background: white;
            border-radius: 20px 20px 0 0;
          }

          .messages-area {
            flex: 1;
            overflow-y: auto;
            background-image: url(${messWall});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            padding: 0.75rem;
          }

          .message-input-section {
            height: 75px;
            flex-shrink: 0;
            border-top: 1px solid #e9ecef;
            background: white;
            border-radius: 0 0 20px 20px;
          }

          .message {
            margin-bottom: 0.75rem;
            display: flex;
          }

          .message.me {
            justify-content: flex-end;
          }

          .message.them {
            justify-content: flex-start;
          }

          .message-bubble {
            max-width: 70%;
            padding: 0.6rem 0.9rem;
            border-radius: 1rem;
          }

          .message.me .message-bubble {
            background-color: #007bff;
            color: white;
          }

          .message.them .message-bubble {
            background-color: #f1f3f4;
            color: #333;
          }

          .avatar {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            margin-right: 0.75rem;
            overflow: hidden;
            position: relative;
          }

          .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: absolute;
            bottom: 0;
            right: 0;
            border: 2px solid white;
          }

          .status-online { background-color: #28a745; }
          .status-offline { background-color: #6c757d; }
          .status-away { background-color: #ffc107; }
          
          .act-btn {
            width: 32px !important;
            height: 32px !important;
            background-color: transparent !important;
            border: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .act-btn2 {
            width: 32px !important;
            height: 32px !important;
            background-color: #a3bcd41e !important;
            border: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .act-btn:hover {
            background-color: #007bff11 !important;          
          }
          
          .icon-primary {
            color: #007bff !important;
            font-size: 1rem !important;
          }

          .messages-area::-webkit-scrollbar {
            width: 5px;
          }

          .messages-area::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 8px;
          }

          .messages-area::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 8px;
          }

          .messages-area::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }

          .message-input-container {
            height: 100%;
            padding: 0.6rem;
          }

          @keyframes slideUpFade {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .search-box-animation {
            animation: slideUpFade 0.2s ease-out;
          }

          .dropdown-menu-animation {
            animation: slideUpFade 0.15s ease-out;
          }

          .info-modal-animation {
            animation: slideInRight 0.3s ease-out;
          }
        `}
      </style>

      <div className="page-content">
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>

        {showInfoModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1040,
              transition: 'opacity 0.3s ease'
            }}
          />
        )}

        {/* Modal d'information du contact */}
        {showInfoModal && (
          <div 
            ref={infoRef}
            className="info-modal-animation"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '400px',
              backgroundColor: 'white',
              zIndex: 1050,
              boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ 
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}>
              
              {/* Section image de fond */}
              <div 
                style={{
                  height: '150px', 
                  backgroundImage: `url(${wall})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  position: 'relative',
                  flexShrink: 0
                }}
              >
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(56, 58, 59, 0.42), rgba(85, 85, 160, 0.73))',
                    zIndex: 1
                  }}
                />
                
                {/* En-tête du modal */}
                <div 
                  style={{
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <Button 
                    color="" 
                    className="act-btn p-4" 
                    onClick={() => setShowInfoModal(false)}
                    style={{ 
                      backgroundColor: 'transparent',
                      border: 'none',
                      width: '64px',
                      height: '64px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0'
                    }}
                  >
                    <i className="ri-close-line" style={{ color: "#ffffff", fontSize: "1.5rem" }}></i>
                  </Button>

                  <div ref={dropdownRef} style={{ position: "relative" }}>
                    <Button 
                      color="" 
                      className="act-btn p-4" 
                      onClick={toggleDropdown}
                      style={{ 
                        backgroundColor: 'transparent',
                        border: 'none',
                        width: '64px',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0'
                      }}
                    >
                      <i className="ri-more-2-fill" style={{ color: "#ffffff", fontSize: "1.5rem" }}></i>
                    </Button>
                    {dropdownOpen && (
                      <div 
                        className="dropdown-menu-animation"
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: "0",
                          width: "150px",
                          padding: "5px 0",
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          zIndex: 3,
                          marginTop: "8px"
                        }}
                      >
                        <div 
                          style={{
                            padding: "5px 16px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            transition: "background-color 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          onClick={() => {}}
                        >
                          <i className="ri-archive-line me-2" style={{ color: "#6b7280" }}></i>
                          <span style={{ color: "#000000", fontSize: "10px" }}>Archive</span>
                        </div>
                             
                        <div 
                          style={{
                            padding: "5px 16px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            transition: "background-color 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          onClick={() => {}}
                        >
                          <i className="ri-mic-off-line me-2" style={{ color: "#6b7280" }}></i>
                          <span style={{ color: "#000000", fontSize: "10px" }}>Muet</span>
                        </div>
                             
                        <div 
                          style={{
                            padding: "5px 16px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fef2f2"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          onClick={() => {}}
                        >
                          <i className="ri-delete-bin-line me-2" style={{ color: "#6b7280" }}></i>
                          <span style={{ color: "#000000", fontSize: "10px" }}>Supprimer</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Avatar positionné à cheval - CENTRÉ */}
              <div style={{ 
                textAlign: 'center', 
                marginTop: '-45px',
                position: 'relative',
                zIndex: 3,
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Avatar centré */}
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  {renderAvatar(selectedDiscussion, '90px', true)}
                </div>
                
                <h4 style={{ 
                  marginBottom: '5px', 
                  color: 'rgba(75, 61, 138, 0.96)',
                  textAlign: 'center',
                  width: '100%'
                }}>
                  {selectedDiscussion.name}
                </h4>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  marginBottom: '20px',
                  width: '100%'
                }}>
                  <div 
                    className={`status-${selectedDiscussion.status}`}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: '2px solid white'
                    }}
                  />
                  <span style={{ color: 'rgba(121, 120, 120, 0.9)', fontSize: '0.9rem' }}>
                    {selectedDiscussion.status === 'online' ? 'En ligne' : 
                    selectedDiscussion.status === 'away' ? 'Absent' : 'Hors ligne'}
                  </span>
                </div>

                {/* Actions rapides - CENTRÉES */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '12px', 
                  marginBottom: '20px', 
                  paddingBottom: '20px', 
                  borderBottom: "1px solid #e5e7eb",
                  width: '100%'
                }}>
                  <Button color="" size="lg" className="act-btn2 p-2">
                    <i className="ri-message-2-line" style={{ color: "black" }}></i> 
                  </Button>
                  <Button color="" size="lg" className="act-btn2 p-2">
                    <i className="ri-star-line" style={{ color: "black" }}></i> 
                  </Button>
                  <Button color="" size="lg" className="act-btn2 p-2">
                    <i className="ri-phone-line" style={{ color: "black" }}></i> 
                  </Button>
                  <Button color="" size="lg" className="act-btn2 p-2">
                    <i className="ri-more-line" style={{ color: "black" }}></i> 
                  </Button>
                </div>
              </div>

              {/* Contenu défilant */}
              <div style={{ padding: '0 20px 20px 20px', flex: 1 }}>
                <div style={{ marginBottom: '25px', borderBottom: "silver 1px dotted", paddingBottom: "14px" }}>
                  <h5 style={{ marginBottom: '15px', color: '#374151', fontSize: '1rem' }}>Informations personnelles</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>Numéro de téléphone</div>
                      <div style={{ fontSize: '0.9rem', color: '#374151' }}>
                        {selectedDiscussion.name === 'Marie Dubois' ? '+33 1 23 45 67 89' :
                        selectedDiscussion.name === 'Pierre Martin' ? '+33 1 34 56 78 90' :
                        selectedDiscussion.name === 'Sophie Lambert' ? '+33 1 45 67 89 01' :
                        '+33 1 56 78 90 12'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>Email</div>
                      <div style={{ fontSize: '0.9rem', color: '#374151' }}>
                        {selectedDiscussion.name.toLowerCase().replace(' ', '.')}@entreprise.com
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>Localisation</div>
                      <div style={{ fontSize: '0.9rem', color: '#374151', fontStyle: 'italic' }}>Dallas, USA</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 style={{ marginBottom: '15px', color: '#374151', fontSize: '1rem' }}>Fichier</h5>
                </div>
              </div>
            </div>
          </div>
        )}

        <Container fluid>
          <div className="discussion-container">
            {selectedDiscussion && (
              <>
                {/* En-tête de la discussion */}
                <div className="chat-header p-3 d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    {renderAvatar(selectedDiscussion, '38px', true)}
                    <div style={{marginLeft: "8px"}}>
                      <h5 className="mb-0" style={{ fontSize: '1.1rem' }}>{selectedDiscussion.name}</h5>
                      <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                        {selectedDiscussion.status === 'online' ? 'En ligne' : 'Hors ligne'}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex gap-2" style={{ position: "relative" }}>
                    {/* Boutons d'action */}
                    <div ref={searchRef}>
                      <Button color="" size="sm" className="act-btn p-2" onClick={handleSearchClick}>
                        <i className="ri-search-line icon-primary"></i> 
                      </Button>
                    </div>
                    
                    <Button color="" size="sm" className="act-btn p-2" onClick={handleInfoClick}>
                      <i className="ri-information-line icon-primary"></i>
                    </Button>
                    
                    <div ref={dropdownRef} style={{ position: "relative" }}>
                      <Button color="" size="sm" className="act-btn p-2" onClick={toggleDropdown}>
                        <i className="ri-more-2-fill icon-primary"></i>
                      </Button>
                      
                      {dropdownOpen && (
                        <div 
                          className="dropdown-menu-animation"
                          style={{
                            position: "absolute",
                            top: "100%",
                            right: "0",
                            width: "150px",
                            padding: "5px 0",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                            zIndex: 1000,
                            marginTop: "8px"
                          }}
                        >
                          {/* Menu items */}
                        </div>
                      )}
                    </div>

                    {/* Boite de recherche */}
                    {showSearch && (
                      <div 
                        ref={searchRef}
                        className="search-box search-box-animation" 
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: "80px",
                          width: "300px",
                          padding: "8px",
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          zIndex: 1000,
                          marginTop: "8px"
                        }}
                      >
                        <div className="d-flex align-items-center" 
                          style={{
                            background: "#2283d30e",
                            padding: "4px",
                            borderRadius: "5px",
                          }}
                        >
                          <i className="ri-search-line me-2" style={{ color: "#6b7280", margin: "5px" }}></i>
                          <input
                            type="text"
                            placeholder="Rechercher ..."
                            style={{
                              border: "none",
                              outline: "none",
                              backgroundColor: "transparent",
                              width: "100%",
                              fontSize: "14px",
                              color: "#000000"
                            }}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <Button 
                            color="" 
                            size="sm" 
                            className="p-1" 
                            onClick={() => setShowSearch(false)}
                            style={{ marginLeft: "8px" }}
                          >
                            <i className="ri-close-line" style={{ color: "#6b7280" }}></i>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Zone des messages */}
                <div className="messages-area">
                  {selectedDiscussion.messages.map(message => (
                    <div key={message.id} className={`message ${message.sender}`}>
                      <div className="message-bubble">
                        {message.text}
                        <div className="text-end mt-1">
                          <small className={message.sender === 'me' ? 'text-light' : 'text-muted'} style={{ fontSize: '0.7rem' }}>
                            {message.time}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input pour écrire */}
                <div className="message-input-section">
                  <div className="message-input-container d-flex align-items-center gap-2">
                    <Input
                      type="textarea"
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      rows="1"
                      style={{ borderRadius: '18px', flex: 1, fontSize: '0.9rem' }}
                    />
                    <Button 
                      color="primary" 
                      onClick={sendMessage} 
                      className="px-3"
                      style={{ borderRadius: '18px', minWidth: '45px', height: '42px' }}
                    >
                      <i className="ri-send-plane-fill" style={{ color: 'white', fontSize: '1rem' }}></i>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Discussion;