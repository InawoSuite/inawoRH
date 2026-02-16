import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Container, Card, CardBody, Spinner } from "reactstrap";
import EcommerceAddProduct from "./EcommerceAddServices";

const EcommerceUpdateProduit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialFormData, setInitialFormData] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://inawoapiv3.inawo.pro/stocks/produits/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Produit non trouvé");
        }

        const data = await response.json();
        setProduct(data);

        // Transformez les données du produit pour les adapter au formulaire
        const transformedData = {
          itemType: data.type_article || "product",
          productName: data.nom || "",
          productCode: data.code || "",
          category: data.categorie?.id || "",
          sellingPrice: data.grilles_tarifaires?.[0]?.prix_vente || "",
          purchasePrice: data.prix_achat || "",
          quantity: data.quantite || "",
          units: data.unite || "",
          discountType: data.remise || "",
          barcode: data.codebare || "",
          alertQuantity: data.seuil || "",
          tax: data.taxe || "",
          description:
            data.description || "<p>Describe the service you offer...</p>",
          productImage: data.image_principale || null,
          groupId: data.groupe?.id || "",
          magasinId: data.magasin?.id || "",
          date_debut: data.date_debut || "",
        };

        setInitialFormData(transformedData);
        console.log("Product data received:", data);
        console.log("Transformed form data:", transformedData);
      } catch (error) {
        toast.error(`Erreur lors du chargement du produit: ${error.message}`);
        navigate("/apps-ecommerce-products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleUpdateProduct = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const apiFormData = new FormData();

      // Mappez les champs du formulaire aux champs de l'API
      apiFormData.append("code", formData.productCode);
      apiFormData.append("nom", formData.productName);
      apiFormData.append("description", formData.description);
      apiFormData.append("codebare", formData.barcode);
      apiFormData.append("prix_achat", formData.purchasePrice);
      apiFormData.append("unite", formData.units);
      apiFormData.append("seuil", formData.alertQuantity);
      apiFormData.append("statut", "disponible");
      apiFormData.append("remise", formData.discountType || "0");
      apiFormData.append("taxe", formData.tax);
      apiFormData.append("categorie", formData.category);

      if (formData.magasinId) {
        apiFormData.append("magasin", formData.magasinId);
      } else if (formData.groupId) {
        apiFormData.append("groupe", formData.groupId);
      }

      apiFormData.append(
        "quantite",
        formData.itemType === "service" ? 0 : formData.quantity
      );
      apiFormData.append("prix_vente", formData.sellingPrice);

      if (formData.date_debut) {
        apiFormData.append("date_debut", formData.date_debut);
      }

      apiFormData.append("date_fin", "2025-12-31");
      apiFormData.append("type_article", formData.itemType);

      if (formData.productImage && typeof formData.productImage !== "string") {
        apiFormData.append("image_principale", formData.productImage);
      }

      const response = await fetch(
        `https://inawoapiv3.inawo.pro/stocks/produits/${id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: apiFormData,
        }
      );

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du produit");
      }

      toast.success("Produit mis à jour avec succès!");
      navigate("/apps-ecommerce-products");
    } catch (error) {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Container fluid className="text-center py-5">
        <Spinner color="primary" />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container fluid>
        <>
          <BreadCrumb
            title="&nbsp;Modifier produit" // &nbsp; avant "Contact"
            pageTitle={
              <>
                <i className="ri-shopping-bag-3-line"></i>
                &nbsp;&gt;&nbsp;<Link to="/">Tableau de Bord</Link>&nbsp;&gt;
              </>
            }
          />
        </>
        <Card>
          <CardBody className="text-center py-5">
            <h4>Produit non trouvé</h4>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <EcommerceAddProduct
      isEditMode={true}
      initialFormData={initialFormData}
      onSubmit={handleUpdateProduct}
    />
  );
};

export default EcommerceUpdateProduit;
