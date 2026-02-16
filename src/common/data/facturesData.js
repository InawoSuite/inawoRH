// filepath: /home/juste/Work/SuiteInawo/src/common/data/facturesData.js
// Fichier de données fictives pour le module de factures normalisées

// Fonction pour générer un nouvel ID unique
export const newId = (prefix = 'ID') => {
    return `${prefix}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

// Données de l'entreprise
export const entrepriseData = {
    nom: "Inawo.",
    adresse: "Cotonou, Bénin",
    telephone: "+229 65 65 65 65",
    email: "contact@inawo.pro",
    num_enreg_legal1: "3201911104325", // IFU
    num_enreg_legal2: "RCCM BJ COT-01-2019-B13-00001", // RCCM
    pays: "Bénin",
    capitalSocial: 5000000,
    site_web: "www.inawo.pro",
    regime_imposition: "Réel",
    regime_fiscal: "Normal",
    code_nim: "EM01121806", // Numéro d'Identification de la Machine électronique de facturation Certifiée
    devise: "XOF"
};

// Données de contacts/clients
export const contactsData = [
    {
        id: 1,
        category: "Particulier",
        type_contact: "Client",
        nom: "Jean Dupont",
        adresse: "10 Rue des Fleurs, Cotonou",
        telephone: "+229 97 97 97 97",
        email: "jean.dupont@email.com",
        num_enreg_legal1: "", // IFU (vide pour particulier sans IFU)
        pays: "Bénin"
    },
    {
        id: 2,
        category: "Entreprise",
        type_contact: "Client Professionnel",
        nomEntreprise: "AFRIKTEL SARL",
        adresse: "Zone Industrielle, Akpakpa, Cotonou",
        telephone: "+229 21 31 31 31",
        email: "contact@afriktel.bj",
        num_enreg_legal1: "1236547890123", // IFU
        num_enreg_legal2: "RCCM BJ COT-01-2015-B13-00525", // RCCM
        pays: "Bénin"
    },
    {
        id: 3,
        category: "Administration",
        type_contact: "Client Institutionnel",
        nomEntreprise: "Ministère de l'Economie Numérique",
        adresse: "Quartier Ministériel, Cotonou",
        telephone: "+229 21 30 10 20",
        email: "contact@numerique.gouv.bj",
        num_enreg_legal1: "5000123456789", // IFU
        pays: "Bénin"
    },
    {
        id: 4,
        category: "ONG",
        type_contact: "Client",
        nomEntreprise: "ONG Santé Pour Tous",
        adresse: "Quartier Akogbato, Cotonou",
        telephone: "+229 97 12 34 56",
        email: "info@santeptt.org",
        num_enreg_legal1: "9000123456789", // IFU
        pays: "Bénin"
    },
    {
        id: 5,
        category: "Particulier",
        type_contact: "Client",
        nom: "Marie Kodjovi",
        adresse: "Quartier Fidjrossè, Cotonou",
        telephone: "+229 95 87 65 43",
        email: "marie.k@email.com",
        num_enreg_legal1: "1201234567890", // IFU
        pays: "Bénin"
    },
    {
        id: 6,
        category: "Entreprise",
        type_contact: "Client Grand Compte",
        nomEntreprise: "SONACOP SA",
        adresse: "Zone Portuaire, Cotonou",
        telephone: "+229 21 31 22 33",
        email: "commercial@sonacop.bj",
        num_enreg_legal1: "3200123456789", // IFU
        num_enreg_legal2: "RCCM BJ COT-01-1995-B13-00112", // RCCM
        pays: "Bénin"
    },
    {
        id: 7,
        category: "Particulier",
        type_contact: "Client",
        nom: "Client Test",
        adresse: "Cotonou, Bénin",
        telephone: "+229 00 00 00 00",
        email: "clientest@gmail.com",
        num_enreg_legal1: "0202348634231", // IFU (vide pour particulier sans IFU)
        num_enreg_legal2: "RCCM BJ COT-01-1995-B13-00112", // RCCM (vide pour particulier sans RCCM)
        pays: "Bénin"
    }
];

// Données de produits/services
export const productsData = [
    {
        id: 1,
        designationProd: "Développement de site web vitrine",
        description: "Conception et développement de site web vitrine responsive",
        prixProd: 500000,
        categorie: "Service",
        typeProduit: "Standard",
        unite: "Forfait"
    },
    {
        id: 2,
        designationProd: "Développement d'application mobile Android",
        description: "Conception et développement d'application mobile pour Android",
        prixProd: 1500000,
        categorie: "Service",
        typeProduit: "Premium",
        unite: "Forfait"
    },
    {
        id: 3,
        designationProd: "Hébergement web partagé - 1 an",
        description: "Hébergement web partagé avec 10 Go de stockage et 5 adresses email",
        prixProd: 75000,
        categorie: "Service",
        typeProduit: "Standard",
        unite: "An"
    },
    {
        id: 4,
        designationProd: "Formation en développement web - 1 personne",
        description: "Formation en développement web (HTML, CSS, JavaScript) pour une personne",
        prixProd: 250000,
        categorie: "Service",
        typeProduit: "Formation",
        unite: "Personne"
    },
    {
        id: 5,
        designationProd: "Maintenance informatique - Forfait mensuel",
        description: "Service de maintenance informatique pour parc de 10 ordinateurs",
        prixProd: 100000,
        categorie: "Service",
        typeProduit: "Maintenance",
        unite: "Mois"
    },
    {
        id: 6,
        designationProd: "Licence logiciel comptabilité INAWO",
        description: "Licence annuelle du logiciel de comptabilité INAWO",
        prixProd: 300000,
        categorie: "Produit",
        typeProduit: "Licence",
        unite: "Unité"
    },
    {
        id: 7,
        designationProd: "Ordinateur portable Dell Latitude 5520",
        description: "Ordinateur portable professionnel Dell Latitude 5520, i5, 16GB RAM, 512GB SSD",
        prixProd: 750000,
        categorie: "Produit",
        typeProduit: "Matériel",
        unite: "Unité"
    },
    {
        id: 8,
        designationProd: "Imprimante laser HP LaserJet Pro M404dn",
        description: "Imprimante laser monochrome, 38 ppm, réseau, recto verso",
        prixProd: 250000,
        categorie: "Produit",
        typeProduit: "Matériel",
        unite: "Unité"
    }
];

// Données de factures (historique)
export const ventesData = [
    {
        id: "FN-0001",
        date: "2023-01-15",
        clientId: 2,
        montantTotal: 1500000,
        statut: "Terminé",
        methodePaiement: "Virement",
        items: [
            {
                produitId: 1,
                designation: "Développement de site web vitrine",
                quantite: 1,
                prixUnitaire: 500000,
                montant: 500000,
                taxGroup: "B"
            },
            {
                produitId: 3,
                designation: "Hébergement web partagé - 1 an",
                quantite: 1,
                prixUnitaire: 75000,
                montant: 75000,
                taxGroup: "B"
            },
            {
                produitId: 4,
                designation: "Formation en développement web - 1 personne",
                quantite: 3,
                prixUnitaire: 250000,
                montant: 750000,
                taxGroup: "B"
            }
        ],
        signature: "1234-5678-9012-3456-7890-1234",
        nim: "EM01121806",
        aibRate: 1,
        natureOfGoods: 2
    },
    {
        id: "FN-0002",
        date: "2023-02-20",
        clientId: 6,
        montantTotal: 950000,
        statut: "Terminé",
        methodePaiement: "Chèque",
        items: [
            {
                produitId: 7,
                designation: "Ordinateur portable Dell Latitude 5520",
                quantite: 1,
                prixUnitaire: 750000,
                montant: 750000,
                taxGroup: "B"
            },
            {
                produitId: 5,
                designation: "Maintenance informatique - Forfait mensuel",
                quantite: 2,
                prixUnitaire: 100000,
                montant: 200000,
                taxGroup: "B"
            }
        ],
        signature: "2345-6789-0123-4567-8901-2345",
        nim: "EM01121806",
        aibRate: 1,
        natureOfGoods: 1
    },
    {
        id: "FN-0003",
        date: "2023-03-05",
        clientId: 1,
        montantTotal: 300000,
        statut: "Terminé",
        methodePaiement: "Espece",
        items: [
            {
                produitId: 6,
                designation: "Licence logiciel comptabilité INAWO",
                quantite: 1,
                prixUnitaire: 300000,
                montant: 300000,
                taxGroup: "B"
            }
        ],
        signature: "3456-7890-1234-5678-9012-3456",
        nim: "EM01121806",
        aibRate: 5,
        natureOfGoods: 1
    },
    {
        id: "FN-0004",
        date: "2023-04-10",
        clientId: 3,
        montantTotal: 2000000,
        statut: "Terminé",
        methodePaiement: "Virement",
        items: [
            {
                produitId: 2,
                designation: "Développement d'application mobile Android",
                quantite: 1,
                prixUnitaire: 1500000,
                montant: 1500000,
                taxGroup: "B"
            },
            {
                produitId: 4,
                designation: "Formation en développement web - 1 personne",
                quantite: 2,
                prixUnitaire: 250000,
                montant: 500000,
                taxGroup: "B"
            }
        ],
        signature: "4567-8901-2345-6789-0123-4567",
        nim: "EM01121806",
        aibRate: 1,
        natureOfGoods: 2
    },
    {
        id: "FN-0005",
        date: "2023-05-25",
        clientId: 4,
        montantTotal: 250000,
        statut: "Terminé",
        methodePaiement: "Mobile Money",
        items: [
            {
                produitId: 8,
                designation: "Imprimante laser HP LaserJet Pro M404dn",
                quantite: 1,
                prixUnitaire: 250000,
                montant: 250000,
                taxGroup: "B"
            }
        ],
        signature: "5678-9012-3456-7890-1234-5678",
        nim: "EM01121806",
        aibRate: 1,
        natureOfGoods: 1
    }
];