import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Col, Container, Row, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import Loader from "../../../Components/Common/Loader";
import { toast } from "react-toastify";
import ExportCSVModal from "../../../Components/Common/ExportCSVModal";
import SearchAndActionBar from "../../../Components/Common/SearchAndActionBar";
import EmptyDataCard from "../../../Components/Common/EmptyDataCard";
import Pagination from "../../../Components/Common/Pagination";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { useTranslation } from "react-i18next";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import jsPDF from "jspdf";
import logoDark from "../../../assets/images/logo-dark.png";
import { BaseUrl } from "../../APIKey/ApiKey";

const PaieEtAvances = () => {
    const { entreprise } = useParams();
    const { t } = useTranslation();
    const { userProfile, token } = useProfile();

    // ========== ÉTATS GÉNÉRAUX ==========
    const [isExportCSV, setIsExportCSV] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("1"); // "1" = Fiche de paie, "2" = Avance et Prêt
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 10;

    // ========== ÉTATS POUR LES MODALS ==========
    const [viewModal, setViewModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [entrepriseInfo, setEntrepriseInfo] = useState(null);

    // ========== DONNÉES STATIQUES ==========
    // Données pour Fiche de paie
    const [fichePaieList, setFichePaieList] = useState([
        {
            id: 1,
            nom: "Dupont",
            prenom: "Jean",
            fonction: "Comptable",
            periode: "Mai",
            lot_de_paie: "Lot 1",
            remuneration_totale: "500 000",
            salaire_base: "400 000",
            statut: "actif",
        },
        {
            id: 2,
            nom: "Martin",
            prenom: "Marie",
            fonction: "Responsable RH",
            periode: "Juin",
            lot_de_paie: "Lot 2",
            remuneration_totale: "600 000",
            salaire_base: "500 000",
            statut: "actif",
        },
        {
            id: 3,
            nom: "Durant",
            prenom: "Pierre",
            fonction: "Commercial",
            periode: "Juillet",
            lot_de_paie: "Lot 3",
            remuneration_totale: "550 000",
            salaire_base: "450 000",
            statut: "inactif",
        },
    ]);

    // Données pour Avance et Prêt
    const [avancePretList, setAvancePretList] = useState([
        {
            id: 1,
            numero: "AV-2024-001",
            employe: "Jean Dupont",
            periodeDebut: "2024-01-01",
            periodeFin: "2024-01-31",
            salaireNet: 250000,
            montantPret: 50000,
            dateRemboursement: "2024-02-15",
            montantRembourse: 20000,
            solde: 30000,
            statut: "actif"
        },
        {
            id: 2,
            numero: "PR-2024-002",
            employe: "Marie Martin",
            periodeDebut: "2024-01-01",
            periodeFin: "2024-03-31",
            salaireNet: 320000,
            montantPret: 150000,
            dateRemboursement: "2024-04-30",
            montantRembourse: 50000,
            solde: 100000,
            statut: "actif"
        },
        {
            id: 3,
            numero: "AV-2024-003",
            employe: "Pierre Durand",
            periodeDebut: "2024-02-01",
            periodeFin: "2024-02-29",
            salaireNet: 280000,
            montantPret: 75000,
            dateRemboursement: "2024-03-15",
            montantRembourse: 75000,
            solde: 0,
            statut: "payé"
        },
        {
            id: 4,
            numero: "PR-2024-004",
            employe: "Sophie Bernard",
            periodeDebut: "2024-01-15",
            periodeFin: "2024-04-15",
            salaireNet: 350000,
            montantPret: 200000,
            dateRemboursement: "2024-05-15",
            montantRembourse: 50000,
            solde: 150000,
            statut: "actif"
        },
        {
            id: 5,
            numero: "AV-2024-005",
            employe: "Lucas Petit",
            periodeDebut: "2024-02-15",
            periodeFin: "2024-02-29",
            salaireNet: 220000,
            montantPret: 30000,
            dateRemboursement: "2024-03-01",
            montantRembourse: 30000,
            solde: 0,
            statut: "payé"
        }
    ]);

    // ========== FONCTIONS UTILITAIRES ==========
    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })
            .format(montant)
            .replace(/[\u202F\u00A0]/g, " ");
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatPeriode = (debut, fin) => {
        return `${formatDate(debut)} - ${formatDate(fin)}`;
    };

    const parseAmount = useCallback((value) => {
        if (typeof value === "number") return value;
        if (!value) return 0;
        const normalized = String(value).replace(/\s/g, "").replace(/,/g, ".").replace(/[^\d.\-]/g, "");
        const parsed = parseFloat(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
    }, []);

    const buildFileUrl = useCallback((path) => {
        if (!path) return null;
        if (String(path).startsWith("http")) return path;
        return `${BaseUrl}${String(path).startsWith("/") ? "" : "/"}${path}`;
    }, []);

    useEffect(() => {
        const fetchEntrepriseInfo = async () => {
            if (!userProfile?.id || !token) return;

            try {
                const response = await fetch(`${BaseUrl}/utilisateurs/update-profile/${userProfile.id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) return;

                const data = await response.json();
                setEntrepriseInfo(data?.entreprise || null);
            } catch (error) {
                console.warn("Impossible de récupérer les infos entreprise pour le bulletin:", error);
            }
        };

        fetchEntrepriseInfo();
    }, [token, userProfile?.id]);

    const computeITS = useCallback((baseImposable) => {
        const taxable = Math.max(0, Math.round(baseImposable));
        const brackets = [
            { limit: 60000, rate: 0 },
            { limit: 150000, rate: 0.1 },
            { limit: 250000, rate: 0.15 },
            { limit: 500000, rate: 0.19 },
            { limit: Number.POSITIVE_INFINITY, rate: 0.3 },
        ];

        let previousLimit = 0;
        let total = 0;

        brackets.forEach(({ limit, rate }) => {
            if (taxable <= previousLimit) return;
            const tranche = Math.min(taxable, limit) - previousLimit;
            if (tranche > 0) total += tranche * rate;
            previousLimit = limit;
        });

        return Math.round(total);
    }, []);

    const computeTaxeRadiophonique = useCallback((salaireBrut, periode) => {
        const monthMap = {
            janvier: 1,
            fevrier: 2,
            "février": 2,
            mars: 3,
            avril: 4,
            mai: 5,
            juin: 6,
            juillet: 7,
            aout: 8,
            "août": 8,
            septembre: 9,
            octobre: 10,
            novembre: 11,
            decembre: 12,
            "décembre": 12,
        };

        const month = monthMap[String(periode || "").trim().toLowerCase()] || null;
        if (month === 3) return 1000;
        if (month === 6) return salaireBrut <= 60000 ? 0 : 3000;
        return 0;
    }, []);

    const loadImageAsDataUrl = useCallback((src) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                const context = canvas.getContext("2d");
                if (!context) {
                    reject(new Error("Canvas indisponible"));
                    return;
                }
                context.drawImage(image, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            };
            image.onerror = () => reject(new Error("Impossible de charger le logo"));
            image.src = src;
        });
    }, []);

    const generatePayslipPdf = useCallback(async (collab) => {
        const headerBlue = { r: 14, g: 63, b: 135 };
        const salaireBase = parseAmount(collab?.salaire_base);
        const remunerationTotale = parseAmount(collab?.remuneration_totale);
        const prime = Math.max(remunerationTotale - salaireBase, 0);
        const indemnites = 0;
        const heuresSupplementaires = 0;
        const autresAvantages = 0;

        const salaireBrut = salaireBase + prime + indemnites + heuresSupplementaires + autresAvantages;
        const cnss = Math.round(salaireBrut * 0.036);
        const baseImposable = Math.max(salaireBrut - cnss, 0);
        const its = computeITS(baseImposable);
        const salaireNet = Math.max(0, salaireBrut - cnss - its);
        const taxeRadiophonique = computeTaxeRadiophonique(salaireBrut, collab?.periode);
        const entrepriseNom = entrepriseInfo?.nom || "INAWO";
        const entrepriseAdresse = entrepriseInfo?.adresse || "Kindonou, Cotonou";
        const entrepriseTelephone = entrepriseInfo?.telephone || "+229 01 61 00 00 00";
        const entrepriseIfu = entrepriseInfo?.ifu || entrepriseInfo?.nif || "INW000000000";
        const entrepriseLogo = buildFileUrl(entrepriseInfo?.logo) || logoDark;

        const doc = new jsPDF({ unit: "mm", format: "a4" });

        try {
            const logoDataUrl = await loadImageAsDataUrl(entrepriseLogo);
            doc.addImage(logoDataUrl, "PNG", 14, 9, 34, 14);
        } catch (e) {
            console.warn("Logo Inawo indisponible pour le PDF:", e);
        }

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`${entrepriseNom} - ${entrepriseAdresse}`, 14, 28);
        doc.text(`Téléphone : ${entrepriseTelephone}`, 14, 33);
        doc.text(`IFU : ${entrepriseIfu}`, 14, 38);

        doc.setFillColor(headerBlue.r, headerBlue.g, headerBlue.b);
        doc.rect(110, 20, 86, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("BULLETIN DE PAIE", 153, 27, { align: "center" });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        doc.rect(14, 44, 58, 24);
        doc.setFillColor(headerBlue.r, headerBlue.g, headerBlue.b);
        doc.rect(14, 44, 58, 5, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("Type de contrat", 16, 48);
        doc.text("CDI", 67, 48, { align: "right" });
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text("Ancienneté :", 16, 54);
        doc.text("7 mois", 67, 54, { align: "right" });
        doc.text("Mode de paiement :", 16, 60);
        doc.text("Espèces", 67, 60, { align: "right" });
        doc.text("Date de paiement :", 16, 66);
        doc.text(new Date().toLocaleDateString("fr-FR"), 67, 66, { align: "right" });

        doc.rect(110, 35, 86, 33);
        doc.setFillColor(headerBlue.r, headerBlue.g, headerBlue.b);
        doc.rect(110, 35, 86, 5, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("Nom et prénom(s)", 112, 39);
        doc.text(`${collab?.nom || ""} ${collab?.prenom || ""}`.trim() || "N/A", 194, 39, { align: "right" });
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text("Matricule :", 112, 46);
        doc.text(String(collab?.id || ""), 194, 46, { align: "right" });
        doc.text("N° CNSS :", 112, 52);
        doc.text("-", 194, 52, { align: "right" });
        doc.text("Fonction :", 112, 58);
        doc.text(collab?.fonction || "Employé", 194, 58, { align: "right" });
        doc.text("Période :", 112, 64);
        doc.text(String(collab?.periode || "-"), 194, 64, { align: "right" });

        const tableX = 14;
        const tableY = 78;
        const tableWidth = 182;
        const rowHeight = 7;

        const col1 = tableX;
        const col2 = tableX + 84;
        const col3 = tableX + 126;
        const col4 = tableX + 154;
        const colEnd = tableX + tableWidth;

        doc.setFillColor(headerBlue.r, headerBlue.g, headerBlue.b);
        doc.rect(tableX, tableY, tableWidth, 7, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("LIBELLÉS", col1 + 24, tableY + 4.7, { align: "center" });
        doc.text("Base", col2 + 21, tableY + 4.7, { align: "center" });
        doc.text("Taux", col3 + 14, tableY + 4.7, { align: "center" });
        doc.text("Montant", col4 + 19, tableY + 4.7, { align: "center" });

        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        const rows = [
            { label: "Salaire de base", base: salaireBase, taux: "", montant: salaireBase },
            { label: "Primes", base: "", taux: "", montant: prime },
            { label: "Indemnités", base: "", taux: "", montant: indemnites },
            { label: "Heures supplémentaires", base: "", taux: "", montant: heuresSupplementaires },
            { label: "Autres avantages", base: "", taux: "", montant: autresAvantages },
            { label: "Salaire brut", base: salaireBrut, taux: "", montant: salaireBrut, highlight: true },
            { label: "Cotisation CNSS", base: salaireBrut, taux: "3,6%", montant: cnss },
            { label: "ITS", base: baseImposable, taux: "Progressif", montant: its },
            { label: "Taxe radiophonique", base: "", taux: "", montant: taxeRadiophonique },
            { label: "Salaire net", base: "", taux: "", montant: salaireNet, highlight: true },
        ];

        rows.forEach((row, index) => {
            const y = tableY + 7 + index * rowHeight;
            if (row.highlight) {
                doc.setFillColor(205, 205, 205);
                doc.rect(tableX, y, tableWidth, rowHeight, "F");
            }

            doc.text(row.label, col1 + 1.5, y + 4.5);
            doc.text(row.base === "" ? "" : formatMontant(row.base), col3 - 1.5, y + 4.5, { align: "right" });
            doc.text(String(row.taux || ""), col4 - 1.5, y + 4.5, { align: "right" });
            doc.text(formatMontant(row.montant), colEnd - 1.5, y + 4.5, { align: "right" });
        });

        const tableBottom = tableY + 7 + rows.length * rowHeight;
        [col1, col2, col3, col4, colEnd].forEach((x) => doc.line(x, tableY, x, tableBottom));
        doc.line(tableX, tableY, colEnd, tableY);
        doc.line(tableX, tableBottom, colEnd, tableBottom);
        for (let i = 0; i <= rows.length; i += 1) {
            const y = tableY + 7 + i * rowHeight;
            doc.line(tableX, y, colEnd, y);
        }

        const signatureTitleY = tableBottom + 10;
        const signatureLineY = signatureTitleY + 10;
        const signatureNameY = signatureLineY + 7;

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text("Employeur", 194, signatureTitleY, { align: "right" });
        doc.line(146, signatureLineY, 194, signatureLineY);
        doc.setFontSize(9);
        doc.text(String(entrepriseNom), 194, signatureNameY, { align: "right" });

        doc.save(`bulletin_paie_${(collab?.nom || "employe").toLowerCase()}_${collab?.id || ""}.pdf`);
    }, [buildFileUrl, computeITS, computeTaxeRadiophonique, entrepriseInfo, formatMontant, loadImageAsDataUrl, parseAmount]);

    // ✅ Fonction pour obtenir le label du statut
    const getStatusLabel = useCallback((statusValue) => {
        const statusLabels = {
            'actif': t('Actif'),
            'inactif': t('Inactif'),
            'payé': t('Payé'),
            'dépassé': t('Dépassé')
        };
        return statusLabels[statusValue] || t('Inconnu');
    }, [t]);

    // ✅ Fonction pour obtenir la couleur du statut
    const getStatusColor = useCallback((statusValue) => {
        const statusColors = {
            'actif': 'success',
            'inactif': 'danger',
            'payé': 'primary',
            'dépassé': 'danger'
        };
        return statusColors[statusValue] || 'secondary';
    }, []);

    const getStatutBadge = (statut) => {
        switch (statut) {
            case 'actif':
                return <Badge className="badge bg-success rounded-pill" pill>{t('Actif')}</Badge>;
            case 'payé':
                return <Badge className="badge bg-primary rounded-pill" pill>{t('Payé')}</Badge>;
            case 'dépassé':
                return <Badge className="badge bg-danger rounded-pill" pill>{t('Dépassé')}</Badge>;
            default:
                return <Badge className="badge bg-secondary rounded-pill" pill>{statut}</Badge>;
        }
    };

    // ========== FONCTIONS POUR LES MODALS ==========
    const toggleViewModal = (item = null) => {
        setSelectedItem(item);
        setViewModal(!viewModal);
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (itemToDelete) {
            if (activeTab === "1") {
                setFichePaieList(fichePaieList.filter(i => i.id !== itemToDelete.id));
            } else {
                setAvancePretList(avancePretList.filter(i => i.id !== itemToDelete.id));
            }
            toast.success(t("Suppression effectuée avec succès"));
            setDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const handleDeleteClose = () => {
        setDeleteModal(false);
        setItemToDelete(null);
    };

    // ========== ONGLETS DE NAVIGATION ==========
    const navTabsData = useMemo(
        () => [
            {
                key: "1",
                label: t("Fiche de paie"),
                icon: "ri-money-dollar-circle-line",
            },
            {
                key: "2",
                label: t("Avance et Prêt"),
                icon: "ri-bank-line",
            }
        ],
        [t],
    );

    const handleTabChange = useCallback((tabKey) => {
        setActiveTab(tabKey);
        setCurrentPage(1);
        setSearchTerm("");
    }, []);

    // ========== FILTRAGE DES DONNÉES ==========
    const currentData = useMemo(() => {
        return activeTab === "1" ? fichePaieList : avancePretList;
    }, [activeTab, fichePaieList, avancePretList]);

    const filteredData = useMemo(() => {
        let filtered = currentData;

        if (searchTerm) {
            filtered = filtered.filter((item) =>
                Object.values(item).some(
                    (value) =>
                        value &&
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        return filtered;
    }, [currentData, searchTerm]);

    // Pagination
    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredData.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredData, currentPage, itemsPerPage]);

    // ========== COLONNES DU TABLEAU ==========
    const columns = useMemo(() => {
        if (activeTab === "1") {
            // Colonnes pour Fiche de paie
            return [
                {
                    header: t("N°"),
                    accessorKey: "id",
                    enableColumnFilter: false,
                    cell: (cellProps) => {
                        const index = cellProps.row.index;
                        return (currentPage - 1) * itemsPerPage + index + 1;
                    },
                },
                {
                    header: t("Nom-Prénom"),
                    accessorKey: "nom",
                    enableColumnFilter: false,
                    cell: (cellProps) => {
                        const item = cellProps.row.original;
                        const fullName = [item.prenom, item.nom].filter(Boolean).join(" ");
                        return (
                            <Link
                                to="#"
                                className="d-flex align-items-center gap-2 text-body fw-medium"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleViewModal(item);
                                }}
                            >
                                <i className="ri-user-fill text-primary"></i>
                                {fullName || t("Non défini")}
                            </Link>
                        );
                    },
                },
                {
                    header: t("Période"),
                    accessorKey: "periode",
                    enableColumnFilter: false,
                    cell: (cell) => cell.getValue() || t("Non défini"),
                },
                {
                    header: t("Lot de paie"),
                    accessorKey: "lot_de_paie",
                    enableColumnFilter: false,
                    cell: (cell) => cell.getValue() || t("Non défini"),
                },
                {
                    header: t("Rémunération totale"),
                    accessorKey: "remuneration_totale",
                    enableColumnFilter: false,
                    cell: (cell) => cell.getValue() || t("Non défini"),
                },
                {
                    header: t("Salaire de base"),
                    accessorKey: "salaire_base",
                    enableColumnFilter: false,
                    cell: (cell) => cell.getValue() || t("Non défini"),
                },
                {
                    header: t("Statut"),
                    accessorKey: "statut",
                    enableColumnFilter: false,
                    cell: (cell) => {
                        const statusValue = cell.getValue();
                        return (
                            <Badge
                                color={getStatusColor(statusValue)}
                                className="rounded-pill"
                            >
                                {getStatusLabel(statusValue)}
                            </Badge>
                        );
                    },
                },
                {
                    header: t("Actions"),
                    enableColumnFilter: false,
                    cell: (cellProps) => {
                        const item = cellProps.row.original;
                        return (
                            <div className="gap-1">
                                <Link
                                    to="#"
                                    className="text-info p-2"
                                    title={t("Voir détails")}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleViewModal(item);
                                    }}
                                >
                                    <i className="ri-eye-fill fs-16"></i>
                                </Link>
                                <Link
                                    to={`/${entreprise}/fiche-edit/${item.id}`}
                                    className="text-primary p-2"
                                    title={t("Modifier")}
                                >
                                    <i className="ri-pencil-fill fs-16"></i>
                                </Link>
                                <Link
                                    to="#"
                                    className="text-info p-2"
                                    title={t("Exporter")}
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        try {
                                            await generatePayslipPdf(item);
                                            toast.success(t("Bulletin de paie téléchargé avec succès"));
                                        } catch (error) {
                                            console.error("Erreur génération bulletin:", error);
                                            toast.error(t("Erreur lors de la génération du bulletin de paie"));
                                        }
                                    }}
                                >
                                    <i className="ri-download-2-fill fs-16"></i>
                                </Link>
                                <Link
                                    to="#"
                                    className="text-danger p-2"
                                    title={t("Supprimer")}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteClick(item);
                                    }}
                                >
                                    <i className="ri-delete-bin-5-fill fs-16"></i>
                                </Link>
                            </div>
                        );
                    },
                },
            ];
        } else {
            // Colonnes pour Avance et Prêt
            return [
                {
                    header: t("N°"),
                    accessorKey: "numero",
                    enableColumnFilter: false,
                    cell: (cell) => <span className="fw-medium">{cell.getValue()}</span>,
                },
                {
                    header: t("Nom de l'employé"),
                    accessorKey: "employe",
                    enableColumnFilter: false,
                    cell: (cellProps) => {
                        const item = cellProps.row.original;
                        return (
                            <Link
                                to="#"
                                className="d-flex align-items-center"
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleViewModal(item);
                                }}
                            >
                                <div className="flex-shrink-0">
                                    <i className="ri-user-fill text-primary"></i>
                                </div>
                                <div className="flex-grow-1 ms-2">
                                    <span className="fw-medium">{item.employe}</span>
                                </div>
                            </Link>
                        );
                    },
                },
                {
                    header: t("Période"),
                    accessorKey: "periodeDebut",
                    enableColumnFilter: false,
                    cell: (cellProps) => {
                        const item = cellProps.row.original;
                        return formatPeriode(item.periodeDebut, item.periodeFin);
                    },
                },
                {
                    header: t("Salaire net"),
                    accessorKey: "salaireNet",
                    enableColumnFilter: false,
                    cell: (cell) => (
                        <span className="fw-medium text-success">
                            {formatMontant(cell.getValue())}
                        </span>
                    ),
                },
                {
                    header: t("Montant prêt"),
                    accessorKey: "montantPret",
                    enableColumnFilter: false,
                    cell: (cell) => (
                        <span className="fw-medium text-danger">
                            {formatMontant(cell.getValue())}
                        </span>
                    ),
                },
                {
                    header: t("Statut"),
                    accessorKey: "statut",
                    enableColumnFilter: false,
                    cell: (cell) => getStatutBadge(cell.getValue()),
                },
                {
                    header: t("Actions"),
                    enableColumnFilter: false,
                    cell: (cellProps) => {
                        const item = cellProps.row.original;
                        return (
                            <div className="gap-1">
                                <Link
                                    to="#"
                                    className="text-info p-2"
                                    title={t("Voir détails")}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleViewModal(item);
                                    }}
                                >
                                    <i className="ri-eye-fill fs-16"></i>
                                </Link>
                                <Link
                                    to={`/${entreprise}/avance-et-pret-edit/${item.id}`}
                                    className="text-primary p-2"
                                    title={t("Modifier")}
                                >
                                    <i className="ri-pencil-fill fs-16"></i>
                                </Link>
                                <Link
                                    to="#"
                                    className="text-danger p-2"
                                    title={t("Supprimer")}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteClick(item);
                                    }}
                                >
                                    <i className="ri-delete-bin-5-fill fs-16"></i>
                                </Link>
                            </div>
                        );
                    },
                },
            ];
        }
    }, [activeTab, currentPage, itemsPerPage, entreprise, t, getStatusColor, getStatusLabel, generatePayslipPdf]);

    // ========== RENDU ==========
    document.title = t("Paie et Avances");

    return (
        <div className="page-content">
            <ExportCSVModal
                show={isExportCSV}
                onCloseClick={() => setIsExportCSV(false)}
                data={filteredData}
            />
            <Container fluid>
                <BreadCrumb
                    title={`\u00a0${t("Paie et Avances")}`}
                    pageTitle={
                        <>
                            <i className="ri-money-dollar-circle-line"></i>
                            &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>&nbsp;&gt;
                        </>
                    }
                />
                <Row>
                    <Col lg={12}>
                        <SearchAndActionBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            searchPlaceholder={
                                activeTab === "1"
                                    ? t("Chercher une fiche de paie...")
                                    : t("Chercher une avance ou un prêt...")
                            }
                            showSearch={true}
                            addButtonLink={
                                activeTab === "1"
                                    ? `/${entreprise}/fiche-add`
                                    : `/${entreprise}/avance-et-pret-add`
                            }
                            addButtonText={
                                activeTab === "1"
                                    ? t("Nouvelle fiche de paie")
                                    : t("Faire une demande d'avance ou de prêt")
                            }
                            addButtonIcon="ri-file-add-line"
                            showAddButton={true}
                            onExportClick={() => setIsExportCSV(true)}
                            exportButtonText={t("Exporter")}
                            exportButtonIcon="ri-file-upload-line"
                            showExportButton={true}
                        />
                    </Col>
                    <Col lg={12}>
                        {loading ? (
                            <div className="d-flex justify-content-center my-5">
                                <Loader />
                            </div>
                        ) : filteredData.length > 0 ? (
                            <TableContainer
                                columns={columns}
                                data={currentItems}
                                isGlobalFilter={false}
                                customPageSize={itemsPerPage}
                                showNavTabs={true}
                                navTabs={navTabsData}
                                activeTab={activeTab}
                                onTabChange={handleTabChange}
                                navTabsClass="nav-tabs nav-tabs-custom nav-success py-4 mb-0 rounded-top-20"
                                containerStyle={{
                                    borderRadius: "20px",
                                    overflow: "hidden",
                                    boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
                                }}
                            >
                                <Pagination
                                    data={filteredData}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    perPageData={itemsPerPage}
                                    alwaysShow={true}
                                    showInfo={true}
                                />
                            </TableContainer>
                        ) : (
                            <EmptyDataCard
                                title={
                                    activeTab === "1"
                                        ? t("Aucune fiche de paie trouvée")
                                        : t("Aucune avance ou prêt trouvé")
                                }
                                description={
                                    activeTab === "1"
                                        ? t("Commencez par ajouter une fiche de paie")
                                        : t("Commencez par créer une nouvelle avance ou prêt")
                                }
                                actionButton={
                                    <Link
                                        to={
                                            activeTab === "1"
                                                ? `/${entreprise}/fiche-add`
                                                : `/${entreprise}/avance-et-pret-add`
                                        }
                                        className="btn btn-success add-btn"
                                        style={{ borderRadius: "20px" }}
                                    >
                                        <i className="ri-user-add-line me-1"></i>
                                        {activeTab === "1"
                                            ? t("Ajouter une fiche de paie")
                                            : t("Ajouter une avance ou un prêt")}
                                    </Link>
                                }
                            />
                        )}
                    </Col>
                </Row>

                {/* MODAL DE SUPPRESSION */}
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteConfirm}
                    onCloseClick={handleDeleteClose}
                />

                {/* MODAL VOIR DÉTAILS */}
                <Modal
                    isOpen={viewModal}
                    toggle={() => toggleViewModal()}
                    size="lg"
                    centered
                    className="modal-dialog-centered"
                    contentClassName="rounded-4 border-0"
                >
                    <ModalHeader
                        toggle={() => toggleViewModal()}
                        className="border-0 pt-4 px-4"
                    >
                        <div className="d-flex align-items-center">
                            <div className="avatar-sm me-3">
                                <span className="avatar-title bg-primary bg-opacity-10 text-primary rounded-3 fs-18">
                                    <i className="ri-eye-line"></i>
                                </span>
                            </div>
                            <div>
                                <h5 className="modal-title mb-0">
                                    {activeTab === "1"
                                        ? t("Détails de la fiche de paie")
                                        : t("Détails de l'avance/prêt")}
                                </h5>
                                <p className="text-muted mb-0">
                                    {activeTab === "1" ? t("Fiche #") : `${t("N°")} `}{selectedItem?.numero || selectedItem?.id}
                                </p>
                            </div>
                        </div>
                    </ModalHeader>

                    <ModalBody className="p-4">
                         {selectedItem && activeTab === "1" && (
                            <Row className="g-4">
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Nom complet")}</Label>
                                        <p className="fw-semibold fs-5 mb-0">
                                            {selectedItem.prenom} {selectedItem.nom}
                                        </p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Période")}</Label>
                                        <p className="fw-semibold mb-0">{selectedItem.periode}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Lot de paie")}</Label>
                                        <p className="fw-semibold mb-0">{selectedItem.lot_de_paie}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Rémunération totale")}</Label>
                                        <p className="fw-semibold text-success mb-0">{selectedItem.remuneration_totale}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Salaire de base")}</Label>
                                        <p className="fw-semibold text-primary mb-0">{selectedItem.salaire_base}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Statut")}</Label>
                                        <div>
                                            <Badge
                                                color={getStatusColor(selectedItem.statut)}
                                                className="rounded-pill"
                                            >
                                                {getStatusLabel(selectedItem.statut)}
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}
                        {selectedItem && activeTab === "2" && (
                            <Row className="g-4">
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Nom de l'employé")}</Label>
                                        <p className="fw-semibold fs-5 mb-0">{selectedItem.employe}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Salaire net")}</Label>
                                        <p className="fw-semibold fs-5 text-success mb-0">{formatMontant(selectedItem.salaireNet)}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Période")}</Label>
                                        <p className="fw-semibold mb-0">
                                            <i className="ri-calendar-line me-2 text-primary"></i>
                                            {formatPeriode(selectedItem.periodeDebut, selectedItem.periodeFin)}
                                        </p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Montant du prêt")}</Label>
                                        <p className="fw-semibold fs-5 text-danger mb-0">{formatMontant(selectedItem.montantPret)}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Date de remboursement")}</Label>
                                        <p className="fw-semibold mb-0">
                                            <i className="ri-calendar-event-line me-2 text-warning"></i>
                                            {formatDate(selectedItem.dateRemboursement)}
                                        </p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Montant remboursé")}</Label>
                                        <p className="fw-semibold text-info mb-0">{formatMontant(selectedItem.montantRembourse || 0)}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Solde restant")}</Label>
                                        <p className="fw-semibold text-warning mb-0">{formatMontant(selectedItem.solde || 0)}</p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="bg-light p-3 rounded-3">
                                        <Label className="form-label text-muted small mb-1">{t("Statut")}</Label>
                                        <div>{getStatutBadge(selectedItem.statut)}</div>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </ModalBody>

                    <ModalFooter className="border-0 pt-0 pb-4 px-4">
                        {activeTab === "1" ? (
                            <Link
                                to={`/${entreprise}/fiche-edit/${selectedItem?.id}`}
                                className="btn btn-primary rounded-4 px-4"
                                style={{ borderRadius: "20px" }}
                            >
                                Modifier
                            </Link>
                        ) : (
                            <Link
                                to={`/${entreprise}/avance-et-pret-edit/${selectedItem?.id}`}
                                className="btn btn-primary rounded-4 px-4"
                                style={{ borderRadius: "20px" }}
                            >
                                Modifier
                            </Link>
                        )}
                        <Button
                            color="secondary"
                            onClick={() => toggleViewModal()}
                            className="rounded-4 px-4"
                        >
                            <i className="ri-close-line me-1"></i>
                            {t("Fermer")}
                        </Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>
    );
};

export default PaieEtAvances;