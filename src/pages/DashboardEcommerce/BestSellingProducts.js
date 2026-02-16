// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Card, CardBody, CardHeader, Col } from 'reactstrap';
// import { useProfile } from "../../Components/Hooks/UserHooks";
// import { BaseUrl } from '../APIKey/ApiKey';

// const BestSellingProducts = () => {
//     const [bestProducts, setBestProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [imageErrors, setImageErrors] = useState({});
//     const { userProfile, token } = useProfile();

//     const fetchBestProducts = async () => {
//         if (!token || !userProfile) return;

//         try {
//             setLoading(true);
//             const headers = {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             };

//             const response = await fetch(`${BaseUrl}/facture/dashboard/`, { headers });
            
//             if (response.ok) {
//                 const data = await response.json();
//                 const products = data.top_5_products || [];
//                 setBestProducts(products);
//             }
//         } catch (error) {
//             console.error('Erreur lors du chargement des meilleurs produits:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (token && userProfile) {
//             fetchBestProducts();
//         }
//     }, [token, userProfile]);

//     const formatNumber = (num) => {
//         return new Intl.NumberFormat('fr-FR').format(num);
//     };

//     const getProductImage = (product) => {
//         if (product.image_produit) {
//             return `${BaseUrl}/photos/${product.image_produit}`;
//         }
//         return null;
//     };

//     const handleImageError = (productId) => {
//         setImageErrors(prev => ({
//             ...prev,
//             [productId]: true
//         }));
//     };

//     return (
//         <React.Fragment>
//             <Col xl={6}>
//                 <Card style={{borderRadius: 20}}>
//                     <CardHeader className="align-items-center d-flex" style={{borderRadius:"20px 20px 0 0"}}>
//                         <h4 className="card-title mb-0 flex-grow-1">Meilleurs Produits</h4>
//                     </CardHeader>

//                     <CardBody className="p-0">
//                         {loading ? (
//                             <div className="text-center py-4">
//                                 <div className="spinner-border text-primary" role="status">
//                                     <span className="sr-only">Chargement...</span>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="table-responsive">
//                                 <table className="table table-hover align-middle mb-0">
//                                     <thead>
//                                         <tr>
//                                             <th style={{width: "40%"}}>Produit</th>
//                                             <th style={{width: "20%"}} className="text-center">Prix vente</th>
//                                             <th style={{width: "20%"}} className="text-center">Quantité</th>
//                                             <th style={{width: "20%"}} className="text-center">Valeur totale</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {bestProducts.length > 0 ? (
//                                             bestProducts.map((product, key) => {
//                                                 const productImage = getProductImage(product);
//                                                 const hasImageError = imageErrors[product.nom_produit];
//                                                 const shouldShowImage = productImage && !hasImageError;

//                                                 return (
//                                                     <tr key={key} style={{height: "70px"}}>
//                                                         {/* Colonne Produit */}
//                                                         <td>
//                                                             <div className="d-flex align-items-center">
//                                                                 <div className="flex-shrink-0 me-3">
//                                                                     {shouldShowImage ? (
//                                                                         <img 
//                                                                             src={productImage} 
//                                                                             alt={product.nom_produit}
//                                                                             className="rounded"
//                                                                             style={{
//                                                                                 width: '45px', 
//                                                                                 height: '45px', 
//                                                                                 objectFit: 'cover',
//                                                                                 border: '1px solid #dee2e6'
//                                                                             }}
//                                                                             onError={() => handleImageError(product.nom_produit)}
//                                                                         />
//                                                                     ) : (
//                                                                         <div 
//                                                                             className="avatar-title bg-primary-subtle text-primary rounded d-flex align-items-center justify-content-center"
//                                                                             style={{
//                                                                                 width: '45px', 
//                                                                                 height: '45px'
//                                                                             }}
//                                                                         >
//                                                                             <i className="ri-box-3-line fs-18"></i>
//                                                                         </div>
//                                                                     )}
//                                                                 </div>
//                                                                 <div className="flex-grow-1">
//                                                                     <span 
//                                                                         className="fw-medium d-block"
//                                                                         style={{
//                                                                             whiteSpace: "nowrap",
//                                                                             overflow: "hidden",
//                                                                             textOverflow: "ellipsis",
//                                                                             maxWidth: "200px",
//                                                                             fontSize: "0.9rem"
//                                                                         }}
//                                                                     >
//                                                                         {product.nom_produit}
//                                                                     </span>
//                                                                 </div>
//                                                             </div>
//                                                         </td>
                                                        
//                                                         {/* Colonne Prix de vente */}
//                                                         <td className="text-center">
//                                                             <span className="fw-semibold my-1 text-dark">
//                                                                 {formatNumber(product.prix_vente_produit)}
//                                                             </span>
//                                                             <span className="text-muted">Prix unitaire</span>
//                                                         </td>
                                                        
//                                                         {/* Colonne Quantité vendue */}
//                                                         <td className="text-center">
//                                                             <span className="fw-semibold my-1 text-dark">
//                                                                 {product.quantite_totale_vendue}
//                                                             </span>
//                                                              <span className="text-muted">Quantité</span>
//                                                         </td>
                                                        
//                                                         {/* Colonne Valeur totale */}
//                                                         <td className="text-center">
//                                                             <span className="fw-bold my-1 text-primary">
//                                                                 {formatNumber(product.valeur_totale)}
//                                                             </span>
//                                                             <span className="text-muted">Valeur totale</span>
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan="4" className="text-center text-muted py-4">
//                                                     <div className="d-flex flex-column align-items-center">
//                                                         <i className="ri-box-3-line fs-48 text-muted mb-2"></i>
//                                                         <span>Aucun produit est encore</span>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </CardBody>
//                 </Card>
//             </Col>
//         </React.Fragment>
//     );
// };

// export default BestSellingProducts;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import { useProfile } from "../../Components/Hooks/UserHooks";
import { BaseUrl } from '../APIKey/ApiKey';

const BestSellingProducts = () => {
    const [bestProducts, setBestProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState({});
    const { userProfile, token } = useProfile();

    const fetchBestProducts = async () => {
        if (!token || !userProfile) return;

        try {
            setLoading(true);
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch(`${BaseUrl}/facture/dashboard/`, { headers });
            
            if (response.ok) {
                const data = await response.json();
                const products = data.top_5_products || [];
                setBestProducts(products);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des meilleurs produits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && userProfile) {
            fetchBestProducts();
        }
    }, [token, userProfile]);

    const formatNumber = (num) => {
        return new Intl.NumberFormat('fr-FR').format(num);
    };

    const getProductImage = (product) => {
        if (product.image_produit) {
            return `${BaseUrl}/photos/${product.image_produit}`;
        }
        return null;
    };

    const handleImageError = (productId) => {
        setImageErrors(prev => ({
            ...prev,
            [productId]: true
        }));
    };

    return (
        <React.Fragment>
            <Col xl={6}>
                <Card style={{borderRadius: 20}}>
                    <CardHeader className="align-items-center d-flex" style={{borderRadius:"20px 20px 0 0"}}>
                        <h4 className="card-title mb-0 flex-grow-1">Meilleurs Produits</h4>
                    </CardHeader>

                    <CardBody className="p-0">
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Chargement...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <tbody>
                                        {bestProducts.length > 0 ? (
                                            bestProducts.map((product, key) => {
                                                const productImage = getProductImage(product);
                                                const hasImageError = imageErrors[product.nom_produit];
                                                const shouldShowImage = productImage && !hasImageError;

                                                return (
                                                    <tr key={key} style={{height: "60px", padding:"2px"}}>
                                                        {/* Colonne Produit */}
                                                        <td style={{width: "40%"}}>
                                                            <div className="d-flex align-items-center">
                                                                <div className="flex-shrink-0 me-3">
                                                                    {shouldShowImage ? (
                                                                        <img 
                                                                            src={productImage} 
                                                                            alt={product.nom_produit}
                                                                            className="rounded-circle"
                                                                            style={{
                                                                                width: '45px', 
                                                                                height: '45px', 
                                                                                objectFit: 'cover',
                                                                                border: '1px solid #dee2e6'
                                                                            }}
                                                                            onError={() => handleImageError(product.nom_produit)}
                                                                        />
                                                                    ) : (
                                                                        <div 
                                                                            className="avatar-title bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                                                                            style={{
                                                                                width: '45px', 
                                                                                height: '45px'
                                                                            }}
                                                                        >
                                                                            <i className="ri-box-3-line fs-18"></i>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-grow-1">
                                                                    <span 
                                                                        className="fw-medium d-block"
                                                                        style={{
                                                                            whiteSpace: "nowrap",
                                                                            overflow: "hidden",
                                                                            textOverflow: "ellipsis",
                                                                            maxWidth: "200px",
                                                                            fontSize: "0.9rem"
                                                                        }}
                                                                    >
                                                                        {product.nom_produit}
                                                                    </span>
                                                                    <small className="text-muted">Produit</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        
                                                        {/* Colonne Prix de vente */}
                                                        <td style={{width: "20%"}} className="text-center">
                                                            <div className="d-flex flex-column justify-content-center h-100">
                                                                <span className="fw-semibold text-dark mb-1">
                                                                    {formatNumber(product.prix_vente_produit)}
                                                                </span>
                                                                <small className="text-muted">Prix unitaire</small>
                                                            </div>
                                                        </td>
                                                        
                                                        {/* Colonne Quantité vendue */}
                                                        <td style={{width: "20%"}} className="text-center">
                                                            <div className="d-flex flex-column justify-content-center h-100">
                                                                <span className="fw-semibold text-dark mb-1">
                                                                    {product.quantite_totale_vendue}
                                                                </span>
                                                                <small className="text-muted">Qté.vendue</small>
                                                            </div>
                                                        </td>
                                                        
                                                        {/* Colonne Valeur totale */}
                                                        <td style={{width: "20%"}} className="text-center">
                                                            <div className="d-flex flex-column justify-content-center h-100">
                                                                <span className="fw-bold text-primary mb-1">
                                                                    {formatNumber(product.valeur_totale)}
                                                                </span>
                                                                <small className="text-muted">Valeur totale</small>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted py-4">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <i className="ri-box-3-line fs-48 text-muted mb-2"></i>
                                                        <span>Aucun produit trouvé</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default BestSellingProducts;