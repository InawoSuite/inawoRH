import React from 'react';

const FactureDetailView = ({ 
  invoiceData, 
  signatureData, 
  enterprise, 
  qrCodeUrl, 
  enrichedArticles = [], 
  enrichedServices, // AJOUT: Nouvelle prop
  allItems, // AJOUT: Tous les items combinés
  saleItems = [], 
  itemsLoading = false 
}) => {
  
  // Debug: Vérifier les données reçues
  React.useEffect(() => {
    console.log('🔧 FactureDetailView - Props reçues:', {
      invoiceData: !!invoiceData,
      signatureData: !!signatureData,
      enterprise: !!enterprise,
      enrichedArticles: enrichedArticles?.length,
      invoiceDataKeys: invoiceData ? Object.keys(invoiceData) : []
    });
  }, [invoiceData, signatureData, enterprise, enrichedArticles]);

  // Vérification des données minimales
  if (!invoiceData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        ❌ Erreur: Données de facture manquantes
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'payee': return '#000';
      case 'impayee': return '#000';
      case 'partiellement_payee': return '#000';
      default: return '#000';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'payee': return 'Payée';
      case 'impayee': return 'Impayée';
      case 'partiellement_payee': return 'Partiellement payée';
      default: return status || 'Statut inconnu';
    }
  };

  return (
 <div style={{
              width: '100%',
              backgroundColor: 'white',
              fontFamily: 'Arial, sans-serif',
              // border: '1px solid #e9ecef'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '20px 40px 0 40px'
              }}>
                {/* Logo agrandi */}
                {enterprise?.logo ? (
                  <div style={{
                    width: "150px",
                    height: "150px",
                    overflow: "hidden"
                  }}>
                    <img
                      src={`https://inawoapiv3.inawo.pro${enterprise.logo}`}
                      alt="Logo entreprise"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: "150px",
                    height: "150px",
                    backgroundColor: "#444",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    borderRadius: "8px"
                  }}>
                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                      LOGO
                    </span>
                  </div>
                )}

                {/* Titre FACTURE */}
                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                  <h1 style={{
                    fontSize: '42px',
                    fontWeight: 'bold',
                    color: '#444',
                    margin: '0',
                    letterSpacing: '3px'
                  }}>
                    FACTURE
                  </h1>
                  <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '16px' }}>
                    {invoiceData?.numero_facture}
                  </p>
                </div>
              </div>

              {/* Trois sections alignées sur la même ligne */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 40px',
                marginTop: '30px',
                gap: '20px'
              }}>
                {/* Informations de l'entreprise (gauche) */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '16px',
                    marginBottom: '15px',
                    color: '#444',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {/* Informations de l'entreprise */}
                  </h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <p style={{ margin: '5px 0', color: '#444', fontWeight: 'bold' }}>
                      {invoiceData?.entreprise_nom}
                    </p>
                    {/* <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Adresse:</strong> {invoiceData?.entreprise_adresse}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Téléphone:</strong> {invoiceData?.entreprise_telephone}
                    </p> */}
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Email:</strong> {invoiceData?.entreprise_email}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>NIF:</strong> {invoiceData?.entreprise_nif}
                    </p>
                  </div>
                </div>

                {/* Informations du client (centre) */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '16px',
                    marginBottom: '15px',
                    color: '#444',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    Client
                  </h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <p style={{ margin: '5px 0', color: '#444', fontWeight: 'bold' }}>
                      {invoiceData?.client_nom}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Adresse:</strong> {invoiceData?.client_adresse}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Téléphone:</strong> {invoiceData?.client_telephone}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>E-mail:</strong> {invoiceData?.client_email}
                    </p>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>IFU:</strong> {invoiceData?.client_ifu  || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Informations de facture (droite) */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '16px',
                    marginBottom: '15px',
                    color: '#444',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {/* Informations */}
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    fontSize: '14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Date d'émission:</span>
                      <span style={{ fontWeight: 'bold', color: '#444' }}>
                        {formatDate(invoiceData?.date_emission)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Mode de paiement:</span>
                      <span style={{ fontWeight: 'bold', color: '#444' }}>
                        {invoiceData?.mode_paiement}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span >Statut:</span>
                      <span style={{ fontWeight: 'bold', color: getStatusColor(invoiceData?.statut) }}>
                        {getStatusLabel(invoiceData?.statut)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666' }}>Référence commande:</span>
                      <span style={{ fontWeight: 'bold', color: '#444' }}>
                        {invoiceData?.reference_commande || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '0 40px' }}>
                {/* Tableau des articles */}
                <div style={{ marginBottom: '30px', marginTop: '30px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    marginBottom: '15px',
                    color: '#444',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {/* Détails des articles */}
                  </h3>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: '#444', color: 'white' }}>
                        <th style={{ padding: '15px 12px', textAlign: 'left', fontWeight: 'bold', width: '8%' }}>
                          #
                        </th>
                        <th style={{ padding: '15px 12px', textAlign: 'left', fontWeight: 'bold', width: '35%' }}>
                          DESIGNATION
                        </th>
                        <th style={{ padding: '15px 12px', textAlign: 'right', fontWeight: 'bold', width: '25%' }}>
                          PRIX UNITAIRE
                        </th>
                        <th style={{ padding: '15px 12px', textAlign: 'center', fontWeight: 'bold', width: '10%' }}>
                          QTÉ
                        </th>
                        <th style={{ padding: '15px 12px', textAlign: 'right', fontWeight: 'bold', width: '22%' }}>
                          MONTANT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsLoading ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                            Chargement des articles...
                          </td>
                        </tr>
                      ) : enrichedArticles.length > 0 ? (
                        // Priorité 1: Articles enrichis de la facture
                        enrichedArticles.map((item, index) => (
                          <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>{index + 1}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                              {item.produit_nom}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>
                              {item.prix_unitaire?.toLocaleString('fr-FR')} 
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>
                              {item.quantite}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>
                              {(item.prix_unitaire * item.quantite)?.toLocaleString('fr-FR')} 
                            </td>
                          </tr>
                        ))
                      ) : invoiceData?.article_facture && invoiceData.article_facture.length > 0 ? (
                        // Priorité 2: Articles de la facture sans enrichissement
                        invoiceData.article_facture.map((item, index) => (
                          <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>{index + 1}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                              Produit ID: {item.produit}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>
                              {item.prix_unitaire?.toLocaleString('fr-FR')} 
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>
                              {item.quantite}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>
                              {(item.prix_unitaire * item.quantite)?.toLocaleString('fr-FR')} 
                            </td>
                          </tr>
                        ))
                      ) : saleItems.length > 0 ? (
                        // Priorité 3: Articles de la vente (fallback)
                        saleItems.map((item, index) => (
                          <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                            <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>{index + 1}</td>
                            <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
                              {item.produit_nom || 'Article sans nom'}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>
                              {item.prix_unitaire?.toLocaleString('fr-FR')} 
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>
                              {item.quantite}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>
                              {(item.prix_unitaire * item.quantite)?.toLocaleString('fr-FR')} 
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{
                            padding: '20px',
                            textAlign: 'center',
                            color: '#666',
                            fontStyle: 'italic'
                          }}>
                            Aucun article trouvé pour cette facture
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Section des totaux */}
                <div style={{ display: 'flex', marginTop: '30px', justifyContent: 'space-between', gap: '30px' }}>
                  {/* Notes */}
                  <div style={{ flex: '1' }}>
                    <h3 style={{
                      fontSize: '16px',
                      marginBottom: '15px',
                      color: '#444',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      Notes
                    </h3>
                    <div style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '5px',
                      padding: '15px',
                      minHeight: '120px'
                    }}>
                      <p style={{
                        margin: '0',
                        color: '#666',
                        fontSize: '13px',
                        lineHeight: '1.6'
                      }}>
                        <strong>Note:</strong> {invoiceData?.note || 'Aucune note'}
                      </p>
                      <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #eee' }} />
                      <p style={{
                        margin: '0',
                        color: '#666',
                        fontSize: '13px',
                        lineHeight: '1.6'
                      }}>
                        <strong>Commentaires:</strong> {invoiceData?.commentaires || 'Aucun commentaire'}
                      </p>
                    </div>
                  </div>
                  <div style={{ width: '350px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid #eee',
                      fontSize: '14px'
                    }}>
                      <span style={{ color: '#666' }}>Montant HT:</span>
                      <span style={{ fontWeight: 'bold', color: '#444' }}>
                        {invoiceData?.montant_ht?.toLocaleString('fr-FR')} 
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid #eee',
                      fontSize: '14px'
                    }}>
                      <span style={{ color: '#666' }}>TVA (18%):</span>
                      <span style={{ fontWeight: 'bold', color: '#444' }}>
                        {invoiceData?.montant_tva?.toLocaleString('fr-FR')} 
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '15px 20px',
                      backgroundColor: '#444',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      marginTop: '10px',
                      borderRadius: '5px'
                    }}>
                      <span>TOTAL À PAYER:</span>
                      <span>{invoiceData?.montant_total?.toLocaleString('fr-FR')} </span>
                    </div>

                    {/* Informations de paiement */}
                    <div style={{ marginTop: '15px', fontSize: '14px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '5px 0',
                        color: '#666'
                      }}>
                        <span>Montant payé:</span>
                        <span style={{ fontWeight: 'bold' }}>
                          {invoiceData?.montant_paye?.toLocaleString('fr-FR')} 
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '5px 0',
                        // color: '#e74c3c',
                        fontWeight: 'bold'
                      }}>
                        <span>Montant restant:</span>
                        <span>{invoiceData?.montant_restant?.toLocaleString('fr-FR')} </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nouvelle section sur une ligne : Adresse entreprise, Conditions générales, Signature */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginTop: '50px',
                  gap: '30px',
                  paddingBottom: '20px' // Ajout de padding en bas pour finir proprement
                }}>
                  {/* Adresse entreprise à gauche */}
                  <div style={{ flex: '1' }}>
                    <h4 style={{
                      fontSize: '14px',
                      color: '#444',
                      marginBottom: '15px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      Adresse de l'entreprise
                    </h4>
                    <div style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      padding: '15px',
                      minHeight: '100px'
                    }}>
                      <p style={{
                        margin: '0',
                        color: '#666',
                        fontSize: '13px',
                        lineHeight: '1.6'
                      }}>
                        <strong>{invoiceData?.entreprise_nom}</strong><br />
                        {invoiceData?.entreprise_adresse}<br />
                        Tél: {invoiceData?.entreprise_telephone}<br />
                        {/* Email: {invoiceData?.entreprise_email} */}
                      </p>
                    </div>
                  </div>

                  {/* Conditions générales au centre */}
                  <div style={{ flex: '1' }}>
                    <h4 style={{
                      fontSize: '14px',
                      color: '#444',
                      marginBottom: '15px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      Conditions générales
                    </h4>
                    <div style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      padding: '15px',
                      minHeight: '100px'
                    }}>
                      <p style={{
                        color: '#666',
                        fontSize: '12px',
                        lineHeight: '1.5',
                        margin: '0'
                      }}>
                        {invoiceData?.condition || 'Paiement à réception'} -
                        Tout retard de paiement entraînera des pénalités de 1,5% par mois.
                        En cas de non-paiement, des frais de recouvrement pourront être appliqués
                        conformément à la législation béninoise en vigueur.
                      </p>
                    </div>
                  </div>

                  {/* Zone signature à droite */}
                  <div style={{ flex: '1' }}>
                    <h4 style={{
                      fontSize: '14px',
                      color: '#444',
                      marginBottom: '15px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      Signature
                    </h4>
                    <div style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      padding: '15px',
                      minHeight: '120px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      {/* Affichage de la signature ou espace vide */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '60px',
                        marginBottom: '10px'
                      }}>
                        {signatureData?.signature ? (
                          <img
                            src={`https://inawoapiv3.inawo.pro${signatureData.signature}`}
                            alt={`Signature de ${signatureData.nom}`}
                            style={{
                              maxWidth: '150px',
                              maxHeight: '50px',
                              objectFit: 'contain'
                            }}
                            onError={(e) => {
                              // En cas d'erreur de chargement, afficher une ligne de signature
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                        ) : null}
                        <div style={{
                          display: signatureData?.signature ? 'none' : 'block',
                          borderBottom: '2px solid #ccc',
                          width: '100%',
                          height: '2px'
                        }}></div>
                      </div>

                      {/* Nom du signataire */}
                      <div style={{ textAlign: 'center' }}>
                        <p style={{
                          margin: '2px 0',
                          color: '#444',
                          fontWeight: 'bold',
                          fontSize: '13px'
                        }}>
                          {/* {signatureData?.nom || enterprise?.nom || 'Nom du signataire'} */}
                        </p>
                        <p style={{
                          margin: '0',
                          color: '#666',
                          fontSize: '12px'
                        }}>
                        {invoiceData?.fonction}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

      {/* Footer de debug */}
      {/* <div style={{
        marginTop: '30px',
        padding: '10px',
        backgroundColor: '#e9ecef',
        fontSize: '10px',
        textAlign: 'center'
      }}>
        PDF généré le {new Date().toLocaleString('fr-FR')} - www.inawo.pro
      </div> */}
    </div>
  );
};

export default FactureDetailView;



// import React from 'react';

// const FactureDetailView = ({ 
//   invoiceData, 
//   signatureData, 
//   enterprise, 
//   qrCodeUrl, 
//   enrichedArticles = [], 
//   enrichedServices = [], // AJOUT: Nouvelle prop pour les services
//   allItems = [], // AJOUT: Tous les items combinés
//   saleItems = [], 
//   itemsLoading = false 
// }) => {
  
//   // Debug: Vérifier les données reçues
//   React.useEffect(() => {
//     console.log('🔧 FactureDetailView - Props reçues:', {
//       invoiceData: !!invoiceData,
//       signatureData: !!signatureData,
//       enterprise: !!enterprise,
//       enrichedArticles: enrichedArticles?.length,
//       enrichedServices: enrichedServices?.length, // AJOUT
//       allItems: allItems?.length, // AJOUT
//       invoiceDataKeys: invoiceData ? Object.keys(invoiceData) : []
//     });
//   }, [invoiceData, signatureData, enterprise, enrichedArticles, enrichedServices, allItems]);

//   // Vérification des données minimales
//   if (!invoiceData) {
//     return (
//       <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
//         ❌ Erreur: Données de facture manquantes
//       </div>
//     );
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date non disponible';
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch (error) {
//       return 'Date invalide';
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'payee': return '#000';
//       case 'impayee': return '#000';
//       case 'partiellement_payee': return '#000';
//       default: return '#000';
//     }
//   };

//   const getStatusLabel = (status) => {
//     switch (status) {
//       case 'payee': return 'Payée';
//       case 'impayee': return 'Impayée';
//       case 'partiellement_payee': return 'Partiellement payée';
//       default: return status || 'Statut inconnu';
//     }
//   };

//   // AJOUT: Fonction pour déterminer quels items afficher
//   const getDisplayItems = () => {
//     // Priorité 1: Tous les items combinés (produits + services)
//     if (allItems && allItems.length > 0) {
//       return allItems;
//     }
    
//     // Priorité 2: Articles et services séparés mais combinés
//     if ((enrichedArticles && enrichedArticles.length > 0) || (enrichedServices && enrichedServices.length > 0)) {
//       const articles = enrichedArticles.map(item => ({
//         ...item,
//         designation: item.produit_nom,
//         type: 'product'
//       }));
      
//       const services = enrichedServices.map(item => ({
//         ...item,
//         designation: item.service_nom,
//         type: 'service'
//       }));
      
//       return [...articles, ...services];
//     }
    
//     // Priorité 3: Articles de la facture sans enrichissement
//     if (invoiceData?.article_facture && invoiceData.article_facture.length > 0) {
//       return invoiceData.article_facture.map(item => ({
//         ...item,
//         designation: `Produit ID: ${item.produit}`,
//         type: 'product'
//       }));
//     }
    
//     // Priorité 4: Services de la facture sans enrichissement
//     if (invoiceData?.service_facture && invoiceData.service_facture.length > 0) {
//       return invoiceData.service_facture.map(item => ({
//         ...item,
//         designation: `Service ID: ${item.service}`,
//         type: 'service'
//       }));
//     }
    
//     // Priorité 5: Articles de la vente (fallback)
//     if (saleItems && saleItems.length > 0) {
//       return saleItems.map(item => ({
//         ...item,
//         designation: item.produit_nom || 'Article sans nom',
//         type: 'product'
//       }));
//     }
    
//     return [];
//   };

//   // AJOUT: Obtenir les items à afficher
//   const displayItems = getDisplayItems();

//   return (
//     <div style={{
//       width: '100%',
//       backgroundColor: 'white',
//       fontFamily: 'Arial, sans-serif',
//     }}>
//       {/* ... (le reste du code d'en-tête reste inchangé) ... */}
//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'flex-start',
//         padding: '20px 40px 0 40px'
//       }}>
//         {/* Logo agrandi */}
//         {enterprise?.logo ? (
//           <div style={{
//             width: "150px",
//             height: "150px",
//             overflow: "hidden"
//           }}>
//             <img
//               src={`https://inawoapiv3.inawo.pro${enterprise.logo}`}
//               alt="Logo entreprise"
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "contain",
//               }}
//             />
//           </div>
//         ) : (
//           <div style={{
//             width: "150px",
//             height: "150px",
//             backgroundColor: "#444",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             color: "white",
//             borderRadius: "8px"
//           }}>
//             <span style={{ fontSize: "18px", fontWeight: "bold" }}>
//               LOGO
//             </span>
//           </div>
//         )}

//         {/* Titre FACTURE */}
//         <div style={{ textAlign: 'right', marginTop: '20px' }}>
//           <h1 style={{
//             fontSize: '42px',
//             fontWeight: 'bold',
//             color: '#444',
//             margin: '0',
//             letterSpacing: '3px'
//           }}>
//             FACTURE
//           </h1>
//           <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '16px' }}>
//             {invoiceData?.numero_facture}
//           </p>
//         </div>
//       </div>

//       {/* Trois sections alignées sur la même ligne */}
//       <div style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         padding: '0 40px',
//         marginTop: '30px',
//         gap: '20px'
//       }}>
//         {/* Informations de l'entreprise (gauche) */}
//         <div style={{ flex: 1 }}>
//           <h3 style={{
//             fontSize: '16px',
//             marginBottom: '15px',
//             color: '#444',
//             fontWeight: 'bold',
//             textTransform: 'uppercase'
//           }}>
//             {/* Informations de l'entreprise */}
//           </h3>
//           <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
//             <p style={{ margin: '5px 0', color: '#444', fontWeight: 'bold' }}>
//               {invoiceData?.entreprise_nom}
//             </p>
//             <p style={{ margin: '5px 0', color: '#666' }}>
//               <strong>Email:</strong> {invoiceData?.entreprise_email}
//             </p>
//             <p style={{ margin: '5px 0', color: '#666' }}>
//               <strong>NIF:</strong> {invoiceData?.entreprise_nif}
//             </p>
//           </div>
//         </div>

//         {/* Informations du client (centre) */}
//         <div style={{ flex: 1 }}>
//           <h3 style={{
//             fontSize: '16px',
//             marginBottom: '15px',
//             color: '#444',
//             fontWeight: 'bold',
//             textTransform: 'uppercase'
//           }}>
//             Client
//           </h3>
//           <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
//             <p style={{ margin: '5px 0', color: '#444', fontWeight: 'bold' }}>
//               {invoiceData?.client_nom}
//             </p>
//             <p style={{ margin: '5px 0', color: '#666' }}>
//               <strong>Adresse:</strong> {invoiceData?.client_adresse}
//             </p>
//             <p style={{ margin: '5px 0', color: '#666' }}>
//               <strong>Téléphone:</strong> {invoiceData?.client_telephone}
//             </p>
//             <p style={{ margin: '5px 0', color: '#666' }}>
//               <strong>E-mail:</strong> {invoiceData?.client_email}
//             </p>
//             <p style={{ margin: '5px 0', color: '#666' }}>
//               <strong>IFU:</strong> {invoiceData?.client_ifu  || 'N/A'}
//             </p>
//           </div>
//         </div>

//         {/* Informations de facture (droite) */}
//         <div style={{ flex: 1 }}>
//           <h3 style={{
//             fontSize: '16px',
//             marginBottom: '15px',
//             color: '#444',
//             fontWeight: 'bold',
//             textTransform: 'uppercase'
//           }}>
//             {/* Informations */}
//           </h3>
//           <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '10px',
//             fontSize: '14px'
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span style={{ color: '#666' }}>Date d'émission:</span>
//               <span style={{ fontWeight: 'bold', color: '#444' }}>
//                 {formatDate(invoiceData?.date_emission)}
//               </span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span style={{ color: '#666' }}>Mode de paiement:</span>
//               <span style={{ fontWeight: 'bold', color: '#444' }}>
//                 {invoiceData?.mode_paiement}
//               </span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span >Statut:</span>
//               <span style={{ fontWeight: 'bold', color: getStatusColor(invoiceData?.statut) }}>
//                 {getStatusLabel(invoiceData?.statut)}
//               </span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span style={{ color: '#666' }}>Référence commande:</span>
//               <span style={{ fontWeight: 'bold', color: '#444' }}>
//                 {invoiceData?.reference_commande || 'N/A'}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div style={{ padding: '0 40px' }}>
//         {/* Tableau des articles */}
//         <div style={{ marginBottom: '30px', marginTop: '30px' }}>
//           <h3 style={{
//             fontSize: '16px',
//             marginBottom: '15px',
//             color: '#444',
//             fontWeight: 'bold',
//             textTransform: 'uppercase'
//           }}>
//             {/* Détails des articles */}
//           </h3>
//           <table style={{
//             width: '100%',
//             borderCollapse: 'collapse',
//             border: '1px solid #e9ecef',
//             borderRadius: '8px',
//             overflow: 'hidden'
//           }}>
//             <thead>
//               <tr style={{ backgroundColor: '#444', color: 'white' }}>
//                 <th style={{ padding: '15px 12px', textAlign: 'left', fontWeight: 'bold', width: '8%' }}>
//                   #
//                 </th>
//                 <th style={{ padding: '15px 12px', textAlign: 'left', fontWeight: 'bold', width: '35%' }}>
//                   DESIGNATION
//                 </th>
//                 <th style={{ padding: '15px 12px', textAlign: 'right', fontWeight: 'bold', width: '25%' }}>
//                   PRIX UNITAIRE
//                 </th>
//                 <th style={{ padding: '15px 12px', textAlign: 'center', fontWeight: 'bold', width: '10%' }}>
//                   QTÉ
//                 </th>
//                 <th style={{ padding: '15px 12px', textAlign: 'right', fontWeight: 'bold', width: '22%' }}>
//                   MONTANT
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {itemsLoading ? (
//                 <tr>
//                   <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
//                     Chargement des articles...
//                   </td>
//                 </tr>
//               ) : displayItems.length > 0 ? (
//                 // NOUVEAU: Affichage unifié des produits et services
//                 displayItems.map((item, index) => (
//                   <tr key={item.id || index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}>
//                     <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>{index + 1}</td>
//                     <td style={{ padding: '12px', borderBottom: '1px solid #e9ecef' }}>
//                       {item.designation}
//                       {/* AJOUT: Indicateur visuel pour les services */}
//                       {item.type === 'service' && (
//                         <span 
//                           className="badge bg-warning ms-2"
//                           style={{
//                             backgroundColor: '#ffc107',
//                             color: '#000',
//                             fontSize: '10px',
//                             padding: '2px 6px',
//                             borderRadius: '4px',
//                             marginLeft: '8px'
//                           }}
//                         >
//                           Service
//                         </span>
//                       )}
//                     </td>
//                     <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>
//                       {item.prix_unitaire?.toLocaleString('fr-FR')} 
//                     </td>
//                     <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>
//                       {item.quantite}
//                     </td>
//                     <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e9ecef' }}>
//                       {/* Calcul du montant selon le type d'item */}
//                       {(() => {
//                         const quantite = parseFloat(item.quantite) || 0;
//                         const prixUnitaire = parseFloat(item.prix_unitaire) || 0;
//                         const montant = quantite * prixUnitaire;
//                         return montant.toLocaleString('fr-FR') + ' ';
//                       })()}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" style={{
//                     padding: '20px',
//                     textAlign: 'center',
//                     color: '#666',
//                     fontStyle: 'italic'
//                   }}>
//                     Aucun article trouvé pour cette facture
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Section des totaux (reste inchangé) */}
//         <div style={{ display: 'flex', marginTop: '30px', justifyContent: 'space-between', gap: '30px' }}>
//           {/* Notes */}
//           <div style={{ flex: '1' }}>
//             <h3 style={{
//               fontSize: '16px',
//               marginBottom: '15px',
//               color: '#444',
//               fontWeight: 'bold',
//               textTransform: 'uppercase'
//             }}>
//               Notes
//             </h3>
//             <div style={{
//               border: '1px solid #e9ecef',
//               borderRadius: '5px',
//               padding: '15px',
//               minHeight: '120px'
//             }}>
//               <p style={{
//                 margin: '0',
//                 color: '#666',
//                 fontSize: '13px',
//                 lineHeight: '1.6'
//               }}>
//                 <strong>Note:</strong> {invoiceData?.note || 'Aucune note'}
//               </p>
//               <hr style={{ margin: '10px 0', border: 'none', borderTop: '1px solid #eee' }} />
//               <p style={{
//                 margin: '0',
//                 color: '#666',
//                 fontSize: '13px',
//                 lineHeight: '1.6'
//               }}>
//                 <strong>Commentaires:</strong> {invoiceData?.commentaires || 'Aucun commentaire'}
//               </p>
//             </div>
//           </div>
//           <div style={{ width: '350px' }}>
//             <div style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               padding: '10px 0',
//               borderBottom: '1px solid #eee',
//               fontSize: '14px'
//             }}>
//               <span style={{ color: '#666' }}>Montant HT:</span>
//               <span style={{ fontWeight: 'bold', color: '#444' }}>
//                 {invoiceData?.montant_ht?.toLocaleString('fr-FR')} 
//               </span>
//             </div>
//             <div style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               padding: '10px 0',
//               borderBottom: '1px solid #eee',
//               fontSize: '14px'
//             }}>
//               <span style={{ color: '#666' }}>TVA (18%):</span>
//               <span style={{ fontWeight: 'bold', color: '#444' }}>
//                 {invoiceData?.montant_tva?.toLocaleString('fr-FR')} 
//               </span>
//             </div>
//             <div style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               padding: '15px 20px',
//               backgroundColor: '#444',
//               color: 'white',
//               fontWeight: 'bold',
//               fontSize: '18px',
//               marginTop: '10px',
//               borderRadius: '5px'
//             }}>
//               <span>TOTAL À PAYER:</span>
//               <span>{invoiceData?.montant_total?.toLocaleString('fr-FR')} </span>
//             </div>

//             {/* Informations de paiement */}
//             <div style={{ marginTop: '15px', fontSize: '14px' }}>
//               <div style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 padding: '5px 0',
//                 color: '#666'
//               }}>
//                 <span>Montant payé:</span>
//                 <span style={{ fontWeight: 'bold' }}>
//                   {invoiceData?.montant_paye?.toLocaleString('fr-FR')} 
//                 </span>
//               </div>
//               <div style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 padding: '5px 0',
//                 fontWeight: 'bold'
//               }}>
//                 <span>Montant restant:</span>
//                 <span>{invoiceData?.montant_restant?.toLocaleString('fr-FR')} </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Nouvelle section sur une ligne : Adresse entreprise, Conditions générales, Signature */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'flex-start',
//           marginTop: '50px',
//           gap: '30px',
//           paddingBottom: '20px'
//         }}>
//           {/* Adresse entreprise à gauche */}
//           <div style={{ flex: '1' }}>
//             <h4 style={{
//               fontSize: '14px',
//               color: '#444',
//               marginBottom: '15px',
//               fontWeight: 'bold',
//               textTransform: 'uppercase'
//             }}>
//               Adresse de l'entreprise
//             </h4>
//             <div style={{
//               border: '1px solid #e9ecef',
//               borderRadius: '8px',
//               padding: '15px',
//               minHeight: '100px'
//             }}>
//               <p style={{
//                 margin: '0',
//                 color: '#666',
//                 fontSize: '13px',
//                 lineHeight: '1.6'
//               }}>
//                 <strong>{invoiceData?.entreprise_nom}</strong><br />
//                 {invoiceData?.entreprise_adresse}<br />
//                 Tél: {invoiceData?.entreprise_telephone}<br />
//               </p>
//             </div>
//           </div>

//           {/* Conditions générales au centre */}
//           <div style={{ flex: '1' }}>
//             <h4 style={{
//               fontSize: '14px',
//               color: '#444',
//               marginBottom: '15px',
//               fontWeight: 'bold',
//               textTransform: 'uppercase'
//             }}>
//               Conditions générales
//             </h4>
//             <div style={{
//               border: '1px solid #e9ecef',
//               borderRadius: '8px',
//               padding: '15px',
//               minHeight: '100px'
//             }}>
//               <p style={{
//                 color: '#666',
//                 fontSize: '12px',
//                 lineHeight: '1.5',
//                 margin: '0'
//               }}>
//                 {invoiceData?.condition || 'Paiement à réception'} -
//                 Tout retard de paiement entraînera des pénalités de 1,5% par mois.
//                 En cas de non-paiement, des frais de recouvrement pourront être appliqués
//                 conformément à la législation béninoise en vigueur.
//               </p>
//             </div>
//           </div>

//           {/* Zone signature à droite */}
//           <div style={{ flex: '1' }}>
//             <h4 style={{
//               fontSize: '14px',
//               color: '#444',
//               marginBottom: '15px',
//               fontWeight: 'bold',
//               textTransform: 'uppercase'
//             }}>
//               Signature
//             </h4>
//             <div style={{
//               border: '1px solid #e9ecef',
//               borderRadius: '8px',
//               padding: '15px',
//               minHeight: '120px',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'space-between'
//             }}>
//               {/* Affichage de la signature ou espace vide */}
//               <div style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: '60px',
//                 marginBottom: '10px'
//               }}>
//                 {signatureData?.signature ? (
//                   <img
//                     src={`https://inawoapiv3.inawo.pro${signatureData.signature}`}
//                     alt={`Signature de ${signatureData.nom}`}
//                     style={{
//                       maxWidth: '150px',
//                       maxHeight: '50px',
//                       objectFit: 'contain'
//                     }}
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                       e.target.nextSibling.style.display = 'block';
//                     }}
//                   />
//                 ) : null}
//                 <div style={{
//                   display: signatureData?.signature ? 'none' : 'block',
//                   borderBottom: '2px solid #ccc',
//                   width: '100%',
//                   height: '2px'
//                 }}></div>
//               </div>

//               {/* Nom du signataire */}
//               <div style={{ textAlign: 'center' }}>
//                 <p style={{
//                   margin: '2px 0',
//                   color: '#444',
//                   fontWeight: 'bold',
//                   fontSize: '13px'
//                 }}>
//                   {/* {signatureData?.nom || enterprise?.nom || 'Nom du signataire'} */}
//                 </p>
//                 <p style={{
//                   margin: '0',
//                   color: '#666',
//                   fontSize: '12px'
//                 }}>
//                 {invoiceData?.fonction}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FactureDetailView;