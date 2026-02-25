import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { 
    Container, Row, Col, Card, CardBody, Button, 
    Input, Table, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, Nav, NavItem, NavLink,
    TabContent, TabPane, Progress, Spinner, Tooltip, Popover, PopoverHeader, PopoverBody
} from "reactstrap";
import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../../Components/Common/DeleteModal";
import Pagination from "../../../../Components/Common/Pagination";
import Select from "react-select";
import classnames from 'classnames';

// CONSTANTES DE CONFIGURATION
const CONFIG = {
    WORK_START_TIME: "09:00",
    WORK_END_TIME: "18:00",
    LATE_THRESHOLD: 15, // minutes
    OVERTIME_THRESHOLD: 8, // heures
    AUTO_CHECKOUT_TIME: "23:59", // minuit
    GRACE_PERIOD: 5, // minutes de tolérance
    REMINDER_INTERVAL: 30, // minutes
    REFRESH_INTERVAL: 30000, // 30 secondes
    DETECTION_RADIUS: 100, // mètres pour géolocalisation
};


const Pointage = () => {
    const { entreprise } = useParams();
    
    // ==================== RÉFÉRENCES ====================
    const wsRef = useRef(null);
    const refreshIntervalRef = useRef(null);
    const detectionTimerRef = useRef(null);
    const audioRef = useRef(null);
    const videoRef = useRef(null);
    
    // ==================== ÉTATS PRINCIPAUX ====================
    const [viewMode, setViewMode] = useState("calendar");
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 20));
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [activeTab, setActiveTab] = useState("1");
    const [loading, setLoading] = useState(false);
    const [online, setOnline] = useState(navigator.onLine);
    const [tooltipOpen, setTooltipOpen] = useState({});
    
    // États pour les pointages
    const [badgeNumber, setBadgeNumber] = useState("");
    const [scanMessage, setScanMessage] = useState({ show: false, type: '', title: '', message: '' });
    
    // États pour les modals
    const [kioskModal, setKioskModal] = useState(false);
    const [manualModal, setManualModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [settingsModal, setSettingsModal] = useState(false);
    const [reportModal, setReportModal] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState({});
    const [deleteModal, setDeleteModal] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    
    // ==================== ÉTATS D'AUTOMATISATION ====================
    const [autoMode, setAutoMode] = useState({
        enabled: false,
        method: 'geolocation', // 'geolocation', 'wifi', 'bluetooth', 'nfc', 'facial'
        confidence: 0.85,
        lastDetection: null,
        continuousScan: false,
        notifications: true,
        reminders: true,
        autoCheckout: false
    });
    
    const [geolocation, setGeolocation] = useState({
        enabled: false,
        latitude: null,
        longitude: null,
        accuracy: null,
        insideOffice: false,
        officeLocation: { lat: 48.8566, lng: 2.3522 }, // Paris par défaut
        lastUpdate: null
    });
    
    const [biometrics, setBiometrics] = useState({
        facialEnabled: false,
        fingerprintEnabled: false,
        voiceEnabled: false,
        lastAuth: null,
        confidence: 0
    });
    
    const [wifiNetworks, setWifiNetworks] = useState([
        { ssid: "INAWO_OFFICE", bssid: "00:11:22:33:44:55", autoConnect: true },
        { ssid: "INAWO_GUEST", bssid: "66:77:88:99:AA:BB", autoConnect: false }
    ]);
    
    const [bluetoothDevices, setBluetoothDevices] = useState([
        { name: "INAWO_BEACON_1", id: "BEACON001", autoDetect: true },
        { name: "INAWO_BEACON_2", id: "BEACON002", autoDetect: true }
    ]);

      // ==================== FONCTIONS UTILITAIRES ====================
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Rayon terrestre en mètres
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    };

    const calculateDuration = (checkIn) => {
        if (!checkIn) return "0:00";
        const now = new Date();
        const [hour, minute] = checkIn.split(':');
        const checkInTime = new Date(now).setHours(parseInt(hour), parseInt(minute), 0);
        const diff = (now - checkInTime) / (1000 * 60 * 60);
        const hours = Math.floor(diff);
        const minutes = Math.floor((diff - hours) * 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const calculateAverageTime = (times) => {
        if (times.length === 0) return null;
        const totalMinutes = times.reduce((acc, time) => {
            const [h, m] = time.split(':');
            return acc + parseInt(h) * 60 + parseInt(m);
        }, 0);
        const avgMinutes = totalMinutes / times.length;
        const hours = Math.floor(avgMinutes / 60);
        const minutes = Math.floor(avgMinutes % 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const calculateLateProbability = (history) => {
        const lateCount = history.filter(r => r.type === 'retard').length;
        return history.length > 0 ? lateCount / history.length : 0;
    };

    const calculateOvertimeProbability = (history) => {
        const overtimeCount = history.filter(r => r.overtime !== "0:00").length;
        return history.length > 0 ? overtimeCount / history.length : 0;
    };

    const calculateAbsenceProbability = (history) => {
        const absenceCount = history.filter(r => r.status === 'absent').length;
        return history.length > 0 ? absenceCount / history.length : 0;
    };

    const calculateHoursWorked = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return "0:00";
        const [inHour, inMin] = checkIn.split(':');
        const [outHour, outMin] = checkOut.split(':');
        const diff = (parseInt(outHour) + parseInt(outMin)/60) - (parseInt(inHour) + parseInt(inMin)/60);
        const hours = Math.floor(diff);
        const minutes = Math.floor((diff - hours) * 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const calculateOvertime = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return "0:00";
        const [inHour, inMin] = checkIn.split(':');
        const [outHour, outMin] = checkOut.split(':');
        const diff = (parseInt(outHour) + parseInt(outMin)/60) - (parseInt(inHour) + parseInt(inMin)/60);
        if (diff <= CONFIG.OVERTIME_THRESHOLD) return "0:00";
        const overtimeDiff = diff - CONFIG.OVERTIME_THRESHOLD;
        const hours = Math.floor(overtimeDiff);
        const minutes = Math.floor((overtimeDiff - hours) * 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    
    // ==================== ÉTATS DE POINTAGE EN TEMPS RÉEL ====================
    const [currentSession, setCurrentSession] = useState(null);
    const [activeSessions, setActiveSessions] = useState([]);
    const [predictions, setPredictions] = useState({});
    const [anomalies, setAnomalies] = useState([]);
    const [notifications, setNotifications] = useState([]);
    
    // ==================== ÉTATS DE PERFORMANCE ====================
    const [cache, setCache] = useState({
        employees: null,
        attendance: null,
        stats: null,
        lastUpdated: null
    });
    
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        total: 0,
        hasMore: false
    });

    // État pour le pointage manuel
    const [manualEntry, setManualEntry] = useState({
        employee: '',
        date: formatDate(new Date()),
        checkIn: '',
        checkOut: '',
        type: 'normal',
        justification: ''
    });
    
    // ==================== DONNÉES MÉMOISÉES ====================
    const employeesData = useMemo(() => [
        { 
            value: "1", 
            label: "Jean Dupont", 
            department: "Développement",
            badgeNumber: "EMP001",
            photo: null,
            contract: "CDI",
            position: "Développeur Senior",
            email: "jean.dupont@inawo.com",
            phone: "+33 6 12 34 56 78",
            preferences: {
                autoCheckin: true,
                reminderTime: "08:45",
                notificationMethod: "email"
            },
            biometrics: {
                facial: true,
                fingerprint: false,
                voice: false
            }
        },
        { 
            value: "2", 
            label: "Marie Martin", 
            department: "Marketing",
            badgeNumber: "EMP002",
            photo: null,
            contract: "CDI",
            position: "Chef de Produit",
            email: "marie.martin@inawo.com",
            phone: "+33 6 23 45 67 89",
            preferences: {
                autoCheckin: true,
                reminderTime: "08:50",
                notificationMethod: "sms"
            },
            biometrics: {
                facial: true,
                fingerprint: true,
                voice: false
            }
        },
        {
            value: "3",
            label: "Pierre Durant",
            department: "Développement",
            badgeNumber: "EMP003",
            photo: null,
            contract: "CDI",
            position: "Développeur Full-Stack",
            email: "pierre.durant@inawo.com",
            phone: "+33 6 34 56 78 90",
            preferences: {
                autoCheckin: false,
                reminderTime: "09:00",
                notificationMethod: "app"
            },
            biometrics: {
                facial: true,
                fingerprint: true,
                voice: true
            }
        },
        {
            value: "4",
            label: "Sophie Leblanc",
            department: "RH",
            badgeNumber: "EMP004",
            photo: null,
            contract: "CDI",
            position: "Responsable RH",
            email: "sophie.leblanc@inawo.com",
            phone: "+33 6 45 67 89 01",
            preferences: {
                autoCheckin: true,
                reminderTime: "08:55",
                notificationMethod: "email"
            },
            biometrics: {
                facial: true,
                fingerprint: true,
                voice: false
            }
        },
        {
            value: "5",
            label: "Luc Bernard",
            department: "Commercial",
            badgeNumber: "EMP005",
            photo: null,
            contract: "CDD",
            position: "Commercial",
            email: "luc.bernard@inawo.com",
            phone: "+33 6 56 78 90 12",
            preferences: {
                autoCheckin: false,
                reminderTime: "09:00",
                notificationMethod: "sms"
            },
            biometrics: {
                facial: false,
                fingerprint: false,
                voice: false
            }
        },
        {
            value: "6",
            label: "Isabelle Moreau",
            department: "Direction",
            badgeNumber: "EMP006",
            photo: null,
            contract: "CDI",
            position: "Directrice Générale",
            email: "isabelle.moreau@inawo.com",
            phone: "+33 6 67 89 01 23",
            preferences: {
                autoCheckin: true,
                reminderTime: "08:30",
                notificationMethod: "email"
            },
            biometrics: {
                facial: true,
                fingerprint: true,
                voice: true
            }
        },
    ], []);

    // Types de pointage
    const pointageTypes = [
        { value: "normal", label: "Normal", color: "success" },
        { value: "retard", label: "Retard", color: "warning" },
        { value: "absence", label: "Absence", color: "danger" },
        { value: "conges", label: "Congés", color: "info" },
        { value: "mission", label: "Mission", color: "primary" },
        { value: "teletravail", label: "Télétravail", color: "secondary" },
    ];

    // ==================== DONNÉES AVEC PRÉDICTIONS ====================
    const [attendanceData, setAttendanceData] = useState([
        {
            id: 1,
            employee: "Jean Dupont",
            employeeId: "1",
            department: "Développement",
            date: "2026-02-20",
            checkIn: "08:45",
            checkOut: "17:30",
            expectedHours: "8:00",
            hoursWorked: "8:45",
            overtime: "0:45",
            overtimeSupp: "0:00",
            status: "present",
            type: "normal",
            location: { lat: 48.8566, lng: 2.3522, accuracy: 10 },
            device: "Terminal 1 - Reconnaissance faciale",
            validatedBy: null,
            notes: "",
            confidence: 0.98,
            method: "facial",
            predictedCheckout: "18:15",
            anomaly: false
        },
        {
            id: 2,
            employee: "Marie Martin",
            employeeId: "2",
            department: "Marketing",
            date: "2026-02-20",
            checkIn: "09:00",
            checkOut: "18:00",
            expectedHours: "8:00",
            hoursWorked: "9:00",
            overtime: "1:00",
            overtimeSupp: "0:00",
            status: "present",
            type: "normal",
            location: { lat: 48.8566, lng: 2.3522, accuracy: 15 },
            device: "Mobile - Géolocalisation",
            validatedBy: null,
            notes: "",
            confidence: 0.95,
            method: "geolocation",
            predictedCheckout: "18:30",
            anomaly: false
        },
        {
            id: 3,
            employee: "Pierre Durant",
            employeeId: "3",
            department: "Développement",
            date: "2026-02-20",
            checkIn: "08:30",
            checkOut: null,
            expectedHours: "8:00",
            hoursWorked: "En cours",
            overtime: "0:00",
            overtimeSupp: "0:00",
            status: "working",
            type: "normal",
            location: { lat: 48.8566, lng: 2.3522, accuracy: 8 },
            device: "Terminal 2 - Badge NFC",
            validatedBy: null,
            notes: "",
            confidence: 0.99,
            method: "nfc",
            predictedCheckout: "17:45",
            anomaly: false
        },
        {
            id: 4,
            employee: "Sophie Leblanc",
            employeeId: "4",
            department: "RH",
            date: "2026-02-20",
            checkIn: null,
            checkOut: null,
            expectedHours: "8:00",
            hoursWorked: "0:00",
            overtime: "0:00",
            overtimeSupp: "0:00",
            status: "absent",
            type: "absence",
            location: null,
            device: null,
            validatedBy: null,
            notes: "Congé maladie",
            confidence: 1.0,
            method: "manual",
            predictedCheckout: null,
            anomaly: false
        },
        {
            id: 5,
            employee: "Luc Bernard",
            employeeId: "5",
            department: "Commercial",
            date: "2026-02-20",
            checkIn: "09:15",
            checkOut: "17:45",
            expectedHours: "8:00",
            hoursWorked: "8:30",
            overtime: "0:30",
            overtimeSupp: "0:00",
            status: "present",
            type: "retard",
            location: { lat: 48.8566, lng: 2.3522, accuracy: 20 },
            device: "Mobile - Application",
            validatedBy: null,
            notes: "Rendez-vous client",
            confidence: 0.92,
            method: "mobile",
            predictedCheckout: "17:30",
            anomaly: false
        },
        {
            id: 6,
            employee: "Isabelle Moreau",
            employeeId: "6",
            department: "Direction",
            date: "2026-02-20",
            checkIn: "08:15",
            checkOut: "19:00",
            expectedHours: "8:00",
            hoursWorked: "10:45",
            overtime: "2:45",
            overtimeSupp: "0:00",
            status: "present",
            type: "normal",
            location: { lat: 48.8566, lng: 2.3522, accuracy: 5 },
            device: "Terminal 1 - Reconnaissance faciale",
            validatedBy: null,
            notes: "",
            confidence: 0.99,
            method: "facial",
            predictedCheckout: "19:30",
            anomaly: false
        },
    ]);

    // Données historiques pour la semaine
    const weeklyStats = {
        totalHours: "38:30",
        expectedHours: "35:00",
        overtime: "3:30",
        absences: 1,
        lateDays: 2,
        presentDays: 4
    };

    // Statistiques par département
    const departmentStats = {
        "Développement": { present: 2, absent: 0, late: 0, total: 2 },
        "Marketing": { present: 1, absent: 0, late: 0, total: 1 },
        "RH": { present: 0, absent: 1, late: 0, total: 1 },
        "Commercial": { present: 1, absent: 0, late: 1, total: 1 },
        "Direction": { present: 1, absent: 0, late: 0, total: 1 }
    };

    // ==================== HOOKS DE CONNEXION ====================
    useEffect(() => {
        // Gestion de la connexion internet
        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // ==================== AUDIO POUR FEEDBACK ====================
    useEffect(() => {
        // Créer un élément audio pour les feedbacks sonores
        audioRef.current = new Audio();
        audioRef.current.src = 'data:audio/wav;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'; // Bip standard
        audioRef.current.volume = 0.5;
        
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // ==================== WEBSOCKET POUR DONNÉES EN TEMPS RÉEL ====================
    useEffect(() => {
        if (autoMode.enabled) {
            // Simulation WebSocket
            wsRef.current = {
                send: (data) => console.log("WebSocket send:", data),
                close: () => console.log("WebSocket closed")
            };
            
            // Mise à jour en temps réel des sessions actives
            const interval = setInterval(() => {
                setActiveSessions(prev => 
                    prev.map(session => ({
                        ...session,
                        duration: calculateDuration(session.checkIn)
                    }))
                );
            }, 60000); // Mise à jour chaque minute
            
            return () => {
                if (wsRef.current) wsRef.current.close();
                clearInterval(interval);
            };
        }
    }, [autoMode.enabled]);

    // ==================== GÉOLOCALISATION AUTOMATIQUE ====================
    useEffect(() => {
        if (autoMode.enabled && autoMode.method === 'geolocation' && online) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    const distance = calculateDistance(
                        latitude, 
                        longitude, 
                        geolocation.officeLocation.lat, 
                        geolocation.officeLocation.lng
                    );
                    const insideOffice = distance <= CONFIG.DETECTION_RADIUS;
                    
                    setGeolocation({
                        ...geolocation,
                        enabled: true,
                        latitude,
                        longitude,
                        accuracy,
                        insideOffice,
                        lastUpdate: new Date()
                    });
                    
                    // Déclenchement automatique si dans le bureau
                    if (insideOffice && !currentSession && autoMode.continuousScan) {
                        detectAndCheckin();
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    addNotification('error', 'Erreur de géolocalisation', error.message);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
            
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, [autoMode.enabled, autoMode.method, online, currentSession]);

    // ==================== RECONNAISSANCE FACIALE SIMULÉE ====================
    useEffect(() => {
        if (autoMode.enabled && autoMode.method === 'facial' && videoRef.current) {
            // Simulation de reconnaissance faciale
            const interval = setInterval(() => {
                if (Math.random() > 0.7) { // 30% de chance de détection
                    const confidence = 0.7 + Math.random() * 0.3;
                    setBiometrics(prev => ({
                        ...prev,
                        facialEnabled: true,
                        confidence,
                        lastAuth: new Date()
                    }));
                    
                    if (confidence > 0.85) {
                        detectAndCheckin();
                    }
                }
            }, 5000);
            
            return () => clearInterval(interval);
        }
    }, [autoMode.enabled, autoMode.method]);

    // ==================== DÉTECTION RÉSEAUX WIFI ====================
    useEffect(() => {
        if (autoMode.enabled && autoMode.method === 'wifi' && online) {
            // Simulation détection WiFi
            const interval = setInterval(() => {
                const detectedNetwork = wifiNetworks.find(n => n.autoConnect && Math.random() > 0.5);
                if (detectedNetwork) {
                    addNotification('info', 'Réseau détecté', `Connecté à ${detectedNetwork.ssid}`);
                    detectAndCheckin();
                }
            }, 10000);
            
            return () => clearInterval(interval);
        }
    }, [autoMode.enabled, autoMode.method, online]);

    // ==================== RAPPELS INTELLIGENTS ====================
    useEffect(() => {
        if (autoMode.reminders && online) {
            const checkReminders = () => {
                const now = new Date();
                const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                
                // Rappel pour les retardataires
                if (currentTime > CONFIG.WORK_START_TIME) {
                    const lateEmployees = employeesData.filter(emp => {
                        const record = attendanceData.find(r => 
                            r.employeeId === emp.value && 
                            r.date === formatDate(now) &&
                            !r.checkIn
                        );
                        return record;
                    });
                    
                    if (lateEmployees.length > 0 && autoMode.notifications) {
                        addNotification('warning', 'Retardataires', 
                            `${lateEmployees.length} employé(s) non pointé(s) à ${currentTime}`);
                    }
                }
                
                // Rappel pour le départ
                if (currentSession && currentTime > CONFIG.WORK_END_TIME) {
                    addNotification('info', 'Fin de journée', 
                        'Pensez à pointer votre départ');
                }
            };
            
            const interval = setInterval(checkReminders, CONFIG.REMINDER_INTERVAL * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [autoMode.reminders, currentSession, attendanceData]);

    // ==================== DÉTECTION D'ANOMALIES ====================
    useEffect(() => {
        const detectAnomalies = () => {
            const newAnomalies = [];
            const now = new Date();
            
            attendanceData.forEach(record => {
                if (record.checkIn && record.checkOut) {
                    // Détection des heures trop longues
                    const [inHour, inMin] = record.checkIn.split(':');
                    const [outHour, outMin] = record.checkOut.split(':');
                    const hoursWorked = (parseInt(outHour) + parseInt(outMin)/60) - 
                                       (parseInt(inHour) + parseInt(inMin)/60);
                    
                    if (hoursWorked > 14) {
                        newAnomalies.push({
                            id: record.id,
                            type: 'long_hours',
                            severity: 'high',
                            message: `${record.employee} a travaillé ${Math.round(hoursWorked)}h`,
                            date: record.date
                        });
                    }
                    
                    // Détection des pointages hors plage
                    if (parseInt(inHour) < 5) {
                        newAnomalies.push({
                            id: record.id,
                            type: 'night_work',
                            severity: 'medium',
                            message: `${record.employee} a pointé très tôt`,
                            date: record.date
                        });
                    }
                }
            });
            
            setAnomalies(newAnomalies);
        };
        
        detectAnomalies();
    }, [attendanceData]);

    // ==================== PRÉDICTIONS MACHINE LEARNING ====================
    useEffect(() => {
        const generatePredictions = () => {
            const newPredictions = {};
            
            employeesData.forEach(emp => {
                const history = attendanceData.filter(r => r.employeeId === emp.value);
                if (history.length > 0) {
                    // Prédiction de l'heure d'arrivée
                    const avgCheckin = calculateAverageTime(history.map(r => r.checkIn).filter(Boolean));
                    // Prédiction de l'heure de départ
                    const avgCheckout = calculateAverageTime(history.map(r => r.checkOut).filter(Boolean));
                    // Probabilité de retard
                    const lateProbability = calculateLateProbability(history);
                    
                    newPredictions[emp.value] = {
                        predictedCheckin: avgCheckin,
                        predictedCheckout: avgCheckout,
                        lateProbability,
                        overtimeProbability: calculateOvertimeProbability(history),
                        absenceProbability: calculateAbsenceProbability(history)
                    };
                }
            });
            
            setPredictions(newPredictions);
        };
        
        generatePredictions();
    }, [attendanceData]);

    // ==================== FONCTIONS DE POINTAGE ====================
    const simulateBadgeScan = (badgeNumber) => {
        if (!badgeNumber) {
            setScanMessage({
                show: true,
                type: 'warning',
                title: 'Badge manquant',
                message: 'Veuillez saisir ou scanner un numéro de badge'
            });
            return;
        }

        setLoading(true);
        
        // Simuler un délai de lecture
        setTimeout(() => {
            // Chercher l'employé par numéro de badge
            const employee = employeesData.find(emp => 
                emp.badgeNumber === badgeNumber || emp.value === badgeNumber
            );
            
            const now = new Date();
            const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            const today = formatDate(now);
            
            if (employee) {
                // Vérifier si l'employé a déjà pointé aujourd'hui
                const existingRecord = attendanceData.find(
                    record => record.employeeId === employee.value && record.date === today
                );

                if (existingRecord) {
                    if (existingRecord.checkOut === null) {
                        // Cas 1: Déjà pointé à l'arrivée → On enregistre le départ
                        handleCheckOut(employee.value);
                        setScanMessage({
                            show: true,
                            type: 'success',
                            title: 'Départ enregistré',
                            message: `Au revoir ${employee.label} !\nDépart à ${currentTime}`
                        });
                        
                        // Notification vocale
                        if ('speechSynthesis' in window && autoMode.notifications) {
                            const utterance = new SpeechSynthesisUtterance(
                                `Au revoir ${employee.label}, bonne fin de journée`
                            );
                            window.speechSynthesis.speak(utterance);
                        }
                    } else {
                        // Cas 2: Déjà pointé arrivée ET départ
                        setScanMessage({
                            show: true,
                            type: 'warning',
                            title: 'Pointage déjà effectué',
                            message: `${employee.label} a déjà pointé aujourd'hui\nArrivée: ${existingRecord.checkIn} | Départ: ${existingRecord.checkOut}`
                        });
                    }
                } else {
                    // Cas 3: Premier pointage de la journée → Arrivée
                    handleCheckIn(employee.value);
                    
                    // Vérifier si c'est un retard
                    const isLate = currentTime > CONFIG.WORK_START_TIME;
                    
                    setScanMessage({
                        show: true,
                        type: 'success',
                        title: isLate ? 'Arrivée en retard' : 'Arrivée enregistrée',
                        message: `Bonjour ${employee.label} !\nArrivée à ${currentTime}${isLate ? ' (retard)' : ''}`
                    });
                    
                    // Notification vocale
                    if ('speechSynthesis' in window && autoMode.notifications) {
                        const utterance = new SpeechSynthesisUtterance(
                            `Bonjour ${employee.label}, votre arrivée a été enregistrée à ${currentTime}`
                        );
                        window.speechSynthesis.speak(utterance);
                    }
                }
                
                // Rejouer le son de scan
                if (audioRef.current) {
                    audioRef.current.play().catch(e => console.log('Audio play failed:', e));
                }
                
            } else {
                // Badge non reconnu
                setScanMessage({
                    show: true,
                    type: 'danger',
                    title: 'Badge non reconnu',
                    message: `Le badge "${badgeNumber}" n'est pas enregistré dans le système`
                });
                
                // Son d'erreur
                if (audioRef.current) {
                    audioRef.current.src = 'data:audio/wav;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'; // Bip d'erreur
                    audioRef.current.play().catch(e => console.log('Audio play failed:', e));
                }
            }
            
            setBadgeNumber('');
            setLoading(false);
            
            // Auto-fermer après succès si configuré
            if (autoMode.enabled && autoMode.continuousScan && employee) {
                setTimeout(() => {
                    setKioskModal(false);
                }, 2000);
            }
        }, 800); // Délai réaliste de lecture
    };

    const handleCheckIn = (employeeId) => {
        const employee = employeesData.find(emp => emp.value === employeeId);
        const now = new Date();
        const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const today = formatDate(now);
        
        // Vérifier si c'est un retard
        const [currentHour, currentMinute] = currentTime.split(':');
        const [workHour, workMinute] = CONFIG.WORK_START_TIME.split(':');
        const isLate = (parseInt(currentHour) > parseInt(workHour)) || 
                       (parseInt(currentHour) === parseInt(workHour) && 
                        parseInt(currentMinute) > parseInt(workMinute) + CONFIG.GRACE_PERIOD);
        
        const newRecord = {
            id: attendanceData.length + 1,
            employee: employee.label,
            employeeId: employee.value,
            department: employee.department,
            date: today,
            checkIn: currentTime,
            checkOut: null,
            expectedHours: "8:00",
            hoursWorked: "En cours",
            overtime: "0:00",
            overtimeSupp: "0:00",
            status: "working",
            type: isLate ? 'retard' : 'normal',
            location: geolocation.enabled ? {
                lat: geolocation.latitude,
                lng: geolocation.longitude,
                accuracy: geolocation.accuracy
            } : null,
            device: "Kiosque - Badge",
            deviceId: "KIOSK-001",
            validatedBy: null,
            notes: isLate ? `Retard de ${calculateLateTime(currentTime)}` : "",
            confidence: 1.0,
            method: "badge_scan",
            predictedCheckout: predictions[employee.value]?.predictedCheckout || "18:00"
        };

        setAttendanceData(prev => [newRecord, ...prev]);
        setCurrentSession(newRecord);
        
        // Ajouter aux sessions actives
        setActiveSessions(prev => [...prev, newRecord]);
        
        return newRecord;
    };

    const handleCheckOut = (employeeId) => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const today = formatDate(now);
        
        let updatedRecord = null;
        
        setAttendanceData(prev => prev.map(record => {
            if (record.employeeId === employeeId && record.date === today && record.checkOut === null) {
                // Calculer les heures travaillées
                const [inHour, inMin] = record.checkIn.split(':');
                const [outHour, outMin] = currentTime.split(':');
                
                const checkInMinutes = parseInt(inHour) * 60 + parseInt(inMin);
                const checkOutMinutes = parseInt(outHour) * 60 + parseInt(outMin);
                const totalMinutes = checkOutMinutes - checkInMinutes;
                
                const hoursWorked = Math.floor(totalMinutes / 60);
                const minutesWorked = totalMinutes % 60;
                const hoursWorkedStr = `${String(hoursWorked).padStart(2, '0')}:${String(minutesWorked).padStart(2, '0')}`;
                
                // Calculer les heures supplémentaires
                let overtime = "0:00";
                if (totalMinutes > CONFIG.OVERTIME_THRESHOLD * 60) {
                    const overtimeMinutes = totalMinutes - (CONFIG.OVERTIME_THRESHOLD * 60);
                    const overtimeHours = Math.floor(overtimeMinutes / 60);
                    const overtimeMins = overtimeMinutes % 60;
                    overtime = `${String(overtimeHours).padStart(2, '0')}:${String(overtimeMins).padStart(2, '0')}`;
                }
                
                updatedRecord = {
                    ...record,
                    checkOut: currentTime,
                    hoursWorked: hoursWorkedStr,
                    overtime: overtime,
                    status: "present"
                };
                
                return updatedRecord;
            }
            return record;
        }));
        
        // Retirer des sessions actives
        setActiveSessions(prev => prev.filter(s => s.employeeId !== employeeId));
        setCurrentSession(null);
        
        return updatedRecord;
    };

    const handleManualPointage = () => {
        const employee = employeesData.find(emp => emp.value === manualEntry.employee);
        
        const newRecord = {
            id: attendanceData.length + 1,
            employee: employee.label,
            employeeId: employee.value,
            department: employee.department,
            date: manualEntry.date,
            checkIn: manualEntry.checkIn || null,
            checkOut: manualEntry.checkOut || null,
            expectedHours: "8:00",
            hoursWorked: manualEntry.checkIn && manualEntry.checkOut ? 
                calculateHoursWorked(manualEntry.checkIn, manualEntry.checkOut) : 
                (manualEntry.checkIn ? "En cours" : "0:00"),
            overtime: manualEntry.checkIn && manualEntry.checkOut ? 
                calculateOvertime(manualEntry.checkIn, manualEntry.checkOut) : "0:00",
            overtimeSupp: "0:00",
            status: !manualEntry.checkIn ? "absent" : 
                    (manualEntry.checkOut ? "present" : "working"),
            type: manualEntry.type,
            location: null,
            device: "Saisie manuelle",
            deviceId: "MANUAL-001",
            validatedBy: "Admin",
            notes: manualEntry.justification,
            confidence: 1.0,
            method: "manual"
        };

        setAttendanceData(prev => [newRecord, ...prev]);
        setManualModal(false);
        setManualEntry({
            employee: '',
            date: formatDate(new Date()),
            checkIn: '',
            checkOut: '',
            type: 'normal',
            justification: ''
        });
        
        addNotification('success', 'Pointage manuel', `Pointage ajouté pour ${employee.label}`);
    };

    // Fonction pour ouvrir le modal de suppression
    const handleDeleteClick = (record) => {
        setRecordToDelete(record);
        setDeleteModal(true);
    };

    // Fonction pour confirmer la suppression
    const handleDeleteRecord = () => {
        if (recordToDelete) {
            setAttendanceData(prev => prev.filter(r => r.id !== recordToDelete.id));
            setDeleteModal(false);
            setRecordToDelete(null);
            addNotification('success', 'Suppression', `Pointage de ${recordToDelete.employee} supprimé avec succès`);
        }
    };

    const detectAndCheckin = async () => {
        setLoading(true);
        
        try {
            // Simulation d'IA de reconnaissance
            const detectedEmployee = await detectEmployee();
            
            if (detectedEmployee) {
                const existingRecord = attendanceData.find(
                    r => r.employeeId === detectedEmployee.value && 
                    r.date === formatDate(new Date())
                );
                
                if (!existingRecord) {
                    handleAutoCheckIn(detectedEmployee);
                } else if (!existingRecord.checkOut) {
                    handleAutoCheckOut(detectedEmployee);
                }
            }
        } catch (error) {
            addNotification('error', 'Erreur de détection', error.message);
        } finally {
            setLoading(false);
        }
    };

    const detectEmployee = async () => {
        // Simulation d'IA
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simule une détection aléatoire
                const randomIndex = Math.floor(Math.random() * employeesData.length);
                resolve(employeesData[randomIndex]);
            }, 1000);
        });
    };

    const handleAutoCheckIn = (employee) => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        const newRecord = {
            id: attendanceData.length + 1,
            employee: employee.label,
            employeeId: employee.value,
            department: employee.department,
            date: formatDate(now),
            checkIn: currentTime,
            checkOut: null,
            expectedHours: "8:00",
            hoursWorked: "En cours",
            overtime: "0:00",
            status: "working",
            type: currentTime > CONFIG.WORK_START_TIME ? 'retard' : 'normal',
            location: geolocation.enabled ? {
                lat: geolocation.latitude,
                lng: geolocation.longitude,
                accuracy: geolocation.accuracy
            } : null,
            device: `Auto - ${autoMode.method}`,
            confidence: autoMode.confidence,
            method: autoMode.method,
            predictedCheckout: predictions[employee.value]?.predictedCheckout || "18:00"
        };

        setAttendanceData(prev => [newRecord, ...prev]);
        setCurrentSession(newRecord);
        
        addNotification('success', 'Pointage automatique', 
            `Bonjour ${employee.label} ! Arrivée enregistrée à ${currentTime}`);
        
        // Notification vocale si activée
        if ('speechSynthesis' in window && autoMode.notifications) {
            const utterance = new SpeechSynthesisUtterance(
                `Bonjour ${employee.label}, votre arrivée a été enregistrée à ${currentTime}`
            );
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleAutoCheckOut = (employee) => {
        const now = new Date();
        const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        setAttendanceData(prev => prev.map(record => {
            if (record.employeeId === employee.value && record.date === formatDate(now)) {
                const hoursWorked = calculateDuration(record.checkIn);
                const overtime = calculateOvertime(record.checkIn, currentTime);
                
                return {
                    ...record,
                    checkOut: currentTime,
                    hoursWorked,
                    overtime,
                    status: 'present'
                };
            }
            return record;
        }));
        
        setCurrentSession(null);
        
        addNotification('success', 'Pointage automatique', 
            `Au revoir ${employee.label} ! Départ enregistré à ${currentTime}`);
        
        // Notification vocale
        if ('speechSynthesis' in window && autoMode.notifications) {
            const utterance = new SpeechSynthesisUtterance(
                `Au revoir ${employee.label}, bonne fin de journée !`
            );
            window.speechSynthesis.speak(utterance);
        }
    };

  
    const calculateLateTime = (checkInTime) => {
        const [checkHour, checkMin] = checkInTime.split(':');
        const [workHour, workMin] = CONFIG.WORK_START_TIME.split(':');
        
        const checkMinutes = parseInt(checkHour) * 60 + parseInt(checkMin);
        const workMinutes = parseInt(workHour) * 60 + parseInt(workMin);
        const lateMinutes = checkMinutes - workMinutes;
        
        if (lateMinutes <= 0) return "0 minute";
        if (lateMinutes < 60) return `${lateMinutes} minutes`;
        return `${Math.floor(lateMinutes / 60)}h${lateMinutes % 60}`;
    };

    const getStatusBadge = (status) => {
        const badges = {
            present: { color: 'success', label: 'Présent' },
            working: { color: 'info', label: 'En cours' },
            absent: { color: 'danger', label: 'Absent' },
            late: { color: 'warning', label: 'Retard' }
        };
        const badge = badges[status] || badges.present;
        return <Badge color={badge.color} pill>{badge.label}</Badge>;
    };

    const getTypeBadge = (type) => {
        const typeInfo = pointageTypes.find(t => t.value === type) || pointageTypes[0];
        return <Badge color={typeInfo.color} pill>{typeInfo.label}</Badge>;
    };

    const getMethodLabel = (method) => {
        const labels = {
            geolocation: '📍 Géolocalisation',
            facial: '👤 Reconnaissance faciale',
            wifi: '📡 WiFi',
            bluetooth: '📱 Bluetooth',
            nfc: '💳 NFC',
            voice: '🎤 Reconnaissance vocale',
            badge_scan: '💳 Badge',
            manual: '✍️ Manuel',
            mobile: '📱 Mobile'
        };
        return labels[method] || method;
    };

    // ==================== NOTIFICATIONS ====================
    const addNotification = (type, title, message) => {
        const newNotification = {
            id: Date.now(),
            type,
            title,
            message,
            timestamp: new Date(),
            read: false
        };
        
        setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Garder les 50 dernières
        
        // Notification système si autorisée
        if (Notification.permission === 'granted') {
            new Notification(title, { body: message });
        }
    };

    // ==================== EXPORT/RAPPORT ====================
    const generateReport = (format = 'pdf') => {
        setLoading(true);
        
        // Simulation de génération de rapport
        setTimeout(() => {
            const reportData = {
                generatedAt: new Date(),
                period: {
                    start: formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)),
                    end: formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
                },
                summary: {
                    totalEmployees: employeesData.length,
                    presentDays: attendanceData.length,
                    averageHours: "8:30",
                    totalOvertime: "12:30",
                    anomalies: anomalies.length
                },
                details: attendanceData
            };
            
            console.log(`Rapport ${format} généré:`, reportData);
            addNotification('success', 'Rapport généré', 
                `Rapport ${format.toUpperCase()} prêt à être téléchargé`);
            
            setLoading(false);
            setReportModal(false);
        }, 2000);
    };

    // ==================== SYNC OFFLINE ====================
    useEffect(() => {
        if (online) {
            // Sync des données en cache
            const syncOfflineData = async () => {
                const offlineData = localStorage.getItem('offlineAttendance');
                if (offlineData) {
                    const data = JSON.parse(offlineData);
                    // Envoyer au serveur
                    console.log('Syncing offline data:', data);
                    localStorage.removeItem('offlineAttendance');
                }
            };
            
            syncOfflineData();
        }
    }, [online]);

    // ==================== FONCTIONS DE GESTION DU CALENDRIER ====================
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { firstDay, daysInMonth };
    };

    const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    
    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    document.title = "Pointage & Présences | INAWO - Suite de Gestion";

    // ==================== RENDU ====================
    return (

            <div>
                {/* Header avec indicateurs en temps réel */}
                <Row className="mb-3">
                    <Col lg={12}>
                        <Card className={`border-${online ? 'success' : 'danger'} rounded-4`}>
                            <CardBody>
                                <Row className="align-items-center">
                                    <Col md={2}>
                                        <div className="d-flex align-items-center">
                                            <div className={`me-2`}>
                                                <i className={`ri-${online ? 'wifi' : 'cloud-off'}-line fs-4 text-${online ? 'success' : 'danger'}`}></i>
                                            </div>
                                            <div>
                                                <small className="text-muted d-block">Statut</small>
                                                <strong>{online ? 'Connecté' : 'Hors ligne'}</strong>
                                            </div>
                                        </div>
                                    </Col>
                                    
                                    <Col md={2}>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <i className={`ri-${geolocation.insideOffice ? 'home' : 'map-pin'}-line fs-4 text-${geolocation.insideOffice ? 'success' : 'warning'}`}></i>
                                            </div>
                                            <div>
                                                <small className="text-muted d-block">Localisation</small>
                                                <strong>{geolocation.insideOffice ? 'Dans le bureau' : 'Hors bureau'}</strong>
                                            </div>
                                        </div>
                                    </Col>
                                    
                                    <Col md={2}>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <i className={`ri-${currentSession ? 'door-open' : 'door-closed'}-line fs-4 text-${currentSession ? 'success' : 'secondary'}`}></i>
                                            </div>
                                            <div>
                                                <small className="text-muted d-block">Session</small>
                                                <strong>{currentSession ? 'Active' : 'Inactive'}</strong>
                                            </div>
                                        </div>
                                    </Col>
                                    
                                    <Col md={3}>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <i className="ri-timer-line fs-4 text-info"></i>
                                            </div>
                                            <div>
                                                <small className="text-muted d-block">Temps réel</small>
                                                <strong>{activeSessions.length} employé(s) présent(s)</strong>
                                            </div>
                                        </div>
                                    </Col>
                                    
                                    <Col md={3} className="text-end">
                                        <ButtonGroup>
                                            <Button 
                                                color={autoMode.enabled ? "success" : "light"}
                                                onClick={() => setAutoMode({...autoMode, enabled: !autoMode.enabled})}
                                                id="autoMode"
                                            >
                                                <i className={`ri-${autoMode.enabled ? 'stop' : 'play'}-circle-line me-1`}></i>
                                                {autoMode.enabled ? 'Auto actif' : 'Auto inactif'}
                                            </Button>
                                            {/* <Button 
                                                color="info" 
                                                onClick={() => setSettingsModal(true)}
                                            >
                                                <i className="ri-settings-4-line"></i> */}
                                            {/* </Button> */}
                                            <Button 
                                                color="secondary" 
                                                onClick={() => setReportModal(true)}
                                            >
                                                <i className="ri-file-chart-line"></i>
                                            </Button>
                                        </ButtonGroup>
                                        <Tooltip 
                                            placement="bottom" 
                                            isOpen={tooltipOpen.autoMode} 
                                            target="autoMode"
                                            toggle={() => setTooltipOpen({...tooltipOpen, autoMode: !tooltipOpen.autoMode})}
                                        >
                                            {autoMode.enabled ? 'Désactiver' : 'Activer'} le mode automatique
                                        </Tooltip>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* Notifications en temps réel */}
                {notifications.length > 0 && (
                    <Row className="mb-3">
                        <Col lg={12}>
                            <Card className="rounded-4">
                                <CardBody className="py-2">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <i className="ri-notification-3-line me-2 text-warning"></i>
                                            <span className="fw-medium">Notifications en temps réel</span>
                                        </div>
                                        <Button 
                                            color="link" 
                                            size="sm"
                                            onClick={() => setNotifications([])}
                                        >
                                            Tout effacer
                                        </Button>
                                    </div>
                                    <div className="mt-2">
                                        {notifications.slice(0, 3).map(notif => (
                                            <div 
                                                key={notif.id} 
                                                className={`alert alert-${notif.type} alert-dismissible fade show mb-1 py-2`}
                                                role="alert"
                                            >
                                                <strong>{notif.title}</strong> - {notif.message}
                                                <small className="text-muted ms-2">
                                                    {new Date(notif.timestamp).toLocaleTimeString()}
                                                </small>
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Anomalies détectées */}
                {anomalies.length > 0 && (
                    <Row className="mb-3">
                        <Col lg={12}>
                            <Card className="border-warning rounded-4">
                                <CardBody className="py-2">
                                    <div className="d-flex align-items-center">
                                        <i className="ri-alert-line text-warning me-2 fs-5"></i>
                                        <span className="fw-medium">{anomalies.length} anomalie(s) détectée(s)</span>
                                        <Button 
                                            color="link" 
                                            size="sm" 
                                            className="ms-2"
                                            id="anomaliesPopover"
                                        >
                                            Voir détails
                                        </Button>
                                        <Popover 
                                            placement="bottom" 
                                            isOpen={popoverOpen.anomalies} 
                                            target="anomaliesPopover"
                                            toggle={() => setPopoverOpen({...popoverOpen, anomalies: !popoverOpen.anomalies})}
                                        >
                                            <PopoverHeader>Anomalies détectées</PopoverHeader>
                                            <PopoverBody>
                                                {anomalies.map(anomaly => (
                                                    <div key={anomaly.id} className="mb-2">
                                                        <Badge color={anomaly.severity === 'high' ? 'danger' : 'warning'} pill>
                                                            {anomaly.severity}
                                                        </Badge>
                                                        <span className="ms-2">{anomaly.message}</span>
                                                    </div>
                                                ))}
                                            </PopoverBody>
                                        </Popover>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* En-tête avec filtres et boutons */}
                <Row className="mb-3">
                    <Col lg={12}>
                        <Card className="rounded-4">
                            <CardBody>
                                <Row className="align-items-center g-3">
                                    <Col md={3}>
                                        <ButtonGroup>
                                            <Button 
                                                color="primary" 
                                                onClick={() => setKioskModal(true)}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <Spinner size="sm" className="me-2">
                                                        Chargement...
                                                    </Spinner>
                                                ) : (
                                                    <i className="ri-qr-scan-2-line me-1"></i>
                                                )}
                                                Mode Kiosque
                                            </Button>
                                            <Button 
                                                color="info" 
                                                onClick={() => setManualModal(true)}
                                            >
                                                <i className="ri-pencil-line"></i>
                                            </Button>
                                            <Button 
                                                color={autoMode.continuousScan ? "success" : "light"}
                                                onClick={() => setAutoMode({
                                                    ...autoMode, 
                                                    continuousScan: !autoMode.continuousScan
                                                })}
                                            >
                                                <i className="ri-radar-line"></i>
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                    
                                    <Col md={2}>
                                        <Select
                                            options={[
                                                { value: 'geolocation', label: '📍 Géolocalisation' },
                                                { value: 'facial', label: '👤 Reconnaissance faciale' },
                                                { value: 'wifi', label: '📡 WiFi' },
                                                { value: 'bluetooth', label: '📱 Bluetooth' },
                                                { value: 'nfc', label: '💳 NFC' },
                                                { value: 'voice', label: '🎤 Reconnaissance vocale' }
                                            ]}
                                            value={{ value: autoMode.method, label: getMethodLabel(autoMode.method) }}
                                            onChange={(opt) => setAutoMode({...autoMode, method: opt.value})}
                                            placeholder="Méthode auto"
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            isDisabled={!autoMode.enabled}
                                        />
                                    </Col>
                                    
                                    <Col md={2}>
                                        <div className="d-flex align-items-center">
                                            <div className="me-2">
                                                <i className="ri-shield-check-line text-success"></i>
                                            </div>
                                            <div>
                                                <small className="text-muted">Confiance</small>
                                                <div className="d-flex align-items-center">
                                                    <Progress 
                                                        value={autoMode.confidence * 100} 
                                                        color="success" 
                                                        style={{ width: '60px', height: '6px' }}
                                                        className="me-2"
                                                    />
                                                    <span>{Math.round(autoMode.confidence * 100)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                    
                                    <Col md={2}>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="ri-calendar-line"></i>
                                            </span>
                                            <Input 
                                                type="date"
                                                className="rounded-2"
                                                value={formatDate(currentDate)}
                                                onChange={(e) => setCurrentDate(new Date(e.target.value))}
                                            />
                                        </div>
                                    </Col>
                                    
                                    <Col md={3} className="text-end">
                                        <ButtonGroup>
                                            <Button 
                                                color={viewMode === "calendar" ? "primary" : "light"}
                                                onClick={() => setViewMode("calendar")}
                                            >
                                                <i className="ri-calendar-line"></i>
                                            </Button>
                                            <Button 
                                                color={viewMode === "list" ? "primary" : "light"}
                                                onClick={() => setViewMode("list")}
                                            >
                                                <i className="ri-list-check"></i>
                                            </Button>
                                            <Button 
                                                color={viewMode === "stats" ? "primary" : "light"}
                                                onClick={() => setViewMode("stats")}
                                            >
                                                <i className="ri-bar-chart-2-line"></i>
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* Vue Calendrier */}
                {viewMode === "calendar" && (
                    <Row>
                        <Col lg={8}>
                            <Card className="rounded-4">
                                <CardBody>
                                    <Nav tabs className="mb-3">
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === '1' })}
                                                onClick={() => setActiveTab('1')}
                                            >
                                                <i className="ri-calendar-line me-2"></i>
                                                Journalier
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === '2' })}
                                                onClick={() => setActiveTab('2')}
                                            >
                                                <i className="ri-calendar-todo-line me-2"></i>
                                                Hebdomadaire
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === '3' })}
                                                onClick={() => setActiveTab('3')}
                                            >
                                                <i className="ri-group-line me-2"></i>
                                                Par équipe
                                            </NavLink>
                                        </NavItem>
                                    </Nav>

                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <div className="table-responsive">
                                                <Table className="table-nowrap align-middle mb-0">
                                                    <thead className="table-light">
                                                        <tr>
                                                            <th>Employé</th>
                                                            <th>Département</th>
                                                            <th>Arrivée</th>
                                                            <th>Départ</th>
                                                            <th>Heures</th>
                                                            <th>Suppl.</th>
                                                            <th>Statut</th>
                                                            <th>Type</th>
                                                            <th>Méthode</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {attendanceData
                                                            .filter(record => record.date === formatDate(currentDate))
                                                            .map((record) => (
                                                                <tr key={record.id}>
                                                                    <td>
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="avatar-xs me-2">
                                                                                <div className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                                    {record.employee.split(' ').map(n => n[0]).join('')}
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <h6 className="mb-0">{record.employee}</h6>
                                                                                <small className="text-muted">{record.department}</small>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>{record.department}</td>
                                                                    <td>
                                                                        {record.checkIn ? (
                                                                            <span className="fw-medium">{record.checkIn}</span>
                                                                        ) : '-'}
                                                                    </td>
                                                                    <td>
                                                                        {record.checkOut ? (
                                                                            <span className="fw-medium">{record.checkOut}</span>
                                                                        ) : '-'}
                                                                    </td>
                                                                    <td>
                                                                        {record.hoursWorked}
                                                                        {record.overtime !== "0:00" && (
                                                                            <Badge color="warning" pill className="ms-2">
                                                                                +{record.overtime}
                                                                            </Badge>
                                                                        )}
                                                                    </td>
                                                                    <td>{record.overtime !== "0:00" ? record.overtime : '-'}</td>
                                                                    <td>{getStatusBadge(record.status)}</td>
                                                                    <td>{getTypeBadge(record.type)}</td>
                                                                    <td>
                                                                        <small className="text-muted" title={`Confiance: ${Math.round(record.confidence * 100)}%`}>
                                                                            {getMethodLabel(record.method)}
                                                                        </small>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex gap-2">
                                                                            <Link
                                                                                to="#"
                                                                                className="text-info"
                                                                                title="Voir détails"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    setSelectedRecord(record);
                                                                                }}
                                                                            >
                                                                                <i className="ri-eye-fill fs-16"></i>
                                                                            </Link>
                                                                            <Link
                                                                                to="#"
                                                                                className="text-primary"
                                                                                title="Modifier"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                }}
                                                                            >
                                                                                <i className="ri-pencil-fill fs-16"></i>
                                                                            </Link>
                                                                            <Link
                                                                                to="#"
                                                                                className="text-danger"
                                                                                title="Supprimer"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    handleDeleteClick(record);
                                                                                }}
                                                                            >
                                                                                <i className="ri-delete-bin-5-fill fs-16"></i>
                                                                            </Link>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </Table>
                                            </div>

                                            {attendanceData.filter(record => record.date === formatDate(currentDate)).length > 0 && (
                                                <Row className="align-items-center mt-3 pt-3 border-top">
                                                    <Col sm={6}>
                                                        <div className="text-muted">
                                                            {attendanceData.filter(record => record.date === formatDate(currentDate)).length} pointage(s) pour cette date
                                                        </div>
                                                    </Col>
                                                </Row>
                                            )}
                                        </TabPane>

                                        <TabPane tabId="2">
                                            <div className="text-center py-4">
                                                <h5 className="mb-3">Résumé hebdomadaire</h5>
                                                <Row className="g-3">
                                                    <Col md={3}>
                                                        <div className="p-3 bg-soft-primary rounded-3">
                                                            <h6>Heures totales</h6>
                                                            <h3>{weeklyStats.totalHours}</h3>
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="p-3 bg-soft-success rounded-3">
                                                            <h6>Heures prévues</h6>
                                                            <h3>{weeklyStats.expectedHours}</h3>
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="p-3 bg-soft-warning rounded-3">
                                                            <h6>Heures sup.</h6>
                                                            <h3>{weeklyStats.overtime}</h3>
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="p-3 bg-soft-info rounded-3">
                                                            <h6>Présence</h6>
                                                            <h3>{weeklyStats.presentDays}/5</h3>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </TabPane>

                                        <TabPane tabId="3">
                                            <div className="table-responsive">
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th>Département</th>
                                                            <th>Présents</th>
                                                            <th>Absents</th>
                                                            <th>Retards</th>
                                                            <th>Total</th>
                                                            <th>Taux présence</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.entries(departmentStats).map(([dept, stats]) => (
                                                            <tr key={dept}>
                                                                <td>{dept}</td>
                                                                <td>
                                                                    <Badge color="success" pill>{stats.present}</Badge>
                                                                </td>
                                                                <td>
                                                                    <Badge color="danger" pill>{stats.absent}</Badge>
                                                                </td>
                                                                <td>
                                                                    <Badge color="warning" pill>{stats.late}</Badge>
                                                                </td>
                                                                <td>{stats.total}</td>
                                                                <td style={{ width: '200px' }}>
                                                                    <Progress
                                                                        value={(stats.present / stats.total) * 100}
                                                                        color="success"
                                                                        style={{ height: '8px' }}
                                                                    />
                                                                    <small className="text-muted">
                                                                        {Math.round((stats.present / stats.total) * 100)}%
                                                                    </small>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col lg={4}>
                            <Card className="rounded-4">
                                <CardBody>
                                    <h5 className="card-title mb-3">Pointage rapide</h5>
                                    <div className="text-center mb-4">
                                        <div className="bg-light rounded-4 p-4 position-relative">
                                            <i className="ri-qr-scan-2-line" style={{ fontSize: '64px', color: '#3b82f6' }}></i>
                                            <h6 className="mt-3">Scanner un badge</h6>
                                            <p className="text-muted small">
                                                Utilisez le lecteur de badge ou saisissez le numéro
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Numéro de badge</label>
                                        <div className="input-group">
                                            <Input
                                                type="text"
                                                placeholder="Ex: EMP001"
                                                value={badgeNumber}
                                                onChange={(e) => setBadgeNumber(e.target.value.toUpperCase())}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && badgeNumber) {
                                                        simulateBadgeScan(badgeNumber);
                                                        setBadgeNumber('');
                                                    }
                                                }}
                                            />
                                            <Button 
                                                color="primary"
                                                onClick={() => {
                                                    if (badgeNumber) {
                                                        simulateBadgeScan(badgeNumber);
                                                        setBadgeNumber('');
                                                    }
                                                }}
                                                disabled={!badgeNumber}
                                            >
                                                Valider
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h6 className="mb-3">Employés en cours</h6>
                                        {activeSessions.length > 0 ? (
                                            activeSessions.slice(0, 3).map(record => (
                                                <div key={record.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded-3">
                                                    <div>
                                                        <div className="fw-medium">{record.employee}</div>
                                                        <small className="text-muted">Arrivée: {record.checkIn}</small>
                                                    </div>
                                                    <Badge color="info" pill>En cours</Badge>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted text-center py-3">Aucun employé en cours</p>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <h6 className="mb-3">Prédictions aujourd'hui</h6>
                                        {Object.entries(predictions).slice(0, 3).map(([empId, pred]) => {
                                            const emp = employeesData.find(e => e.value === empId);
                                            return (
                                                <div key={empId} className="mb-2 p-2 bg-light rounded-3">
                                                    <div className="d-flex justify-content-between">
                                                        <span>{emp?.label}</span>
                                                        <small className="text-muted">
                                                            {pred.predictedCheckout || 'N/A'}
                                                        </small>
                                                    </div>
                                                    <Progress 
                                                        value={pred.overtimeProbability * 100} 
                                                        color="warning" 
                                                        style={{ height: '4px' }}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Vue Liste */}
                {viewMode === "list" && (
                    <Row>
                        <Col lg={12}>
                            <Card className="rounded-4">
                                <CardBody>
                                    <div className="table-responsive">
                                        <Table className="table-nowrap align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    
                                                    <th>Employé</th>
                                                    <th>Département</th>
                                                    <th>Date</th>
                                                    <th>Arrivée</th>
                                                    <th>Départ</th>
                                                    <th>Heures</th>
                                                    <th>Suppl.</th>
                                                    <th>Statut</th>
                                                    <th>Type</th>
                                                    <th>Méthode</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attendanceData.slice((pagination.page - 1) * 50, pagination.page * 50).map((record) => (
                                                    <tr key={record.id}>
                                                       
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="avatar-xs me-2">
                                                                    <div className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                        {record.employee.split(' ').map(n => n[0]).join('')}
                                                                    </div>
                                                                </div>
                                                                <span>{record.employee}</span>
                                                            </div>
                                                        </td>
                                                        <td>{record.department}</td>
                                                        <td>{record.date}</td>
                                                        <td>{record.checkIn || '-'}</td>
                                                        <td>{record.checkOut || '-'}</td>
                                                        <td>
                                                            {record.hoursWorked}
                                                            {record.overtime !== "0:00" && (
                                                                <Badge color="warning" pill className="ms-2">
                                                                    +{record.overtime}
                                                                </Badge>
                                                            )}
                                                        </td>
                                                        <td>{record.overtime !== "0:00" ? record.overtime : '-'}</td>
                                                        <td>{getStatusBadge(record.status)}</td>
                                                        <td>{getTypeBadge(record.type)}</td>
                                                        <td>
                                                            <small className="text-muted" title={`Confiance: ${Math.round(record.confidence * 100)}%`}>
                                                                {getMethodLabel(record.method)}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <Link
                                                                    to="#"
                                                                    className="text-info"
                                                                    title="Voir détails"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setSelectedRecord(record);
                                                                    }}
                                                                >
                                                                    <i className="ri-eye-fill fs-16"></i>
                                                                </Link>
                                                                <Link
                                                                    to="#"
                                                                    className="text-primary"
                                                                    title="Modifier"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                    }}
                                                                >
                                                                    <i className="ri-pencil-fill fs-16"></i>
                                                                </Link>
                                                                <Link
                                                                    to="#"
                                                                    className="text-danger"
                                                                    title="Supprimer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeleteClick(record);
                                                                    }}
                                                                >
                                                                    <i className="ri-delete-bin-5-fill fs-16"></i>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>

                                    {attendanceData.length === 0 && (
                                        <div className="text-center py-5">
                                            <i className="ri-calendar-todo-line display-4 text-muted"></i>
                                            <p className="text-muted mt-3">Aucune donnée de présence disponible</p>
                                        </div>
                                    )}

                                    <div className="mt-3 pt-3">
                                        <Pagination
                                            data={attendanceData}
                                            currentPage={pagination.page}
                                            setCurrentPage={(page) => setPagination({...pagination, page})}
                                            perPageData={50}
                                            alwaysShow={true}
                                            showInfo={true}
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Vue Statistiques */}
                {viewMode === "stats" && (
                    <Row>
                        <Col lg={4}>
                            <Card className="rounded-4">
                                <CardBody>
                                    <h5 className="card-title mb-4">Taux de présence</h5>
                                    <div className="text-center">
                                        <div className="mb-4">
                                            <h1 className="display-4">87%</h1>
                                            <p className="text-muted">Moyenne sur 30 jours</p>
                                        </div>
                                        <Progress multi style={{ height: '20px' }}>
                                            <Progress bar color="success" value="70">70%</Progress>
                                            <Progress bar color="warning" value="15">15%</Progress>
                                            <Progress bar color="danger" value="15">15%</Progress>
                                        </Progress>
                                        <div className="d-flex justify-content-between mt-2">
                                            <small>Présent</small>
                                            <small>Retard</small>
                                            <small>Absent</small>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                            
                            <Card className="mt-3 rounded-4">
                                <CardBody>
                                    <h5 className="card-title mb-4">Méthodes de pointage</h5>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Reconnaissance faciale</span>
                                            <span className="text-muted">45%</span>
                                        </div>
                                        <Progress value={45} color="primary" style={{ height: '8px' }} />
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Badge NFC</span>
                                            <span className="text-muted">30%</span>
                                        </div>
                                        <Progress value={30} color="success" style={{ height: '8px' }} />
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Mobile</span>
                                            <span className="text-muted">15%</span>
                                        </div>
                                        <Progress value={15} color="info" style={{ height: '8px' }} />
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Manuel</span>
                                            <span className="text-muted">10%</span>
                                        </div>
                                        <Progress value={10} color="warning" style={{ height: '8px' }} />
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col lg={8}>
                            <Card className="rounded-4">
                                <CardBody>
                                    <h5 className="card-title mb-4">Répartition des pointages</h5>
                                    <Row className="g-4">
                                        <Col md={4}>
                                            <div className="text-center p-3 border rounded-3">
                                                <i className="ri-user-star-line fs-1 text-primary"></i>
                                                <h3 className="mt-2">{employeesData.length}</h3>
                                                <p className="text-muted">Employés actifs</p>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className="text-center p-3 border rounded-3">
                                                <i className="ri-time-line fs-1 text-warning"></i>
                                                <h3 className="mt-2">{
                                                    attendanceData.filter(r => r.date === formatDate(new Date()) && r.type === 'retard').length
                                                }</h3>
                                                <p className="text-muted">En retard aujourd'hui</p>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className="text-center p-3 border rounded-3">
                                                <i className="ri-door-open-line fs-1 text-success"></i>
                                                <h3 className="mt-2">{
                                                    attendanceData.filter(r => r.date === formatDate(new Date()) && r.checkIn).length
                                                }</h3>
                                                <p className="text-muted">Déjà pointés</p>
                                            </div>
                                        </Col>
                                    </Row>
                                    
                                    <Row className="mt-4">
                                        <Col md={12}>
                                            <h6 className="mb-3">Tendance des présences (7 derniers jours)</h6>
                                            <div className="d-flex align-items-end justify-content-between" style={{ height: '150px' }}>
                                                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, i) => {
                                                    const height = 40 + Math.random() * 80;
                                                    return (
                                                        <div key={day} className="text-center" style={{ width: '12%' }}>
                                                            <div 
                                                                style={{ 
                                                                    height: `${height}px`, 
                                                                    backgroundColor: '#3b82f6',
                                                                    borderRadius: '4px 4px 0 0'
                                                                }}
                                                            ></div>
                                                            <small className="mt-2 d-block">{day}</small>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            
                            <Card className="mt-3 rounded-4">
                                <CardBody>
                                    <h5 className="card-title mb-3">Anomalies récentes</h5>
                                    {anomalies.length > 0 ? (
                                        anomalies.slice(0, 3).map(anomaly => (
                                            <div key={anomaly.id} className="d-flex align-items-center mb-2 p-2 border rounded-3">
                                                <Badge color={anomaly.severity === 'high' ? 'danger' : 'warning'} pill className="me-2">
                                                    {anomaly.severity}
                                                </Badge>
                                                <div className="flex-grow-1">
                                                    <strong>{anomaly.message}</strong>
                                                    <br />
                                                    <small className="text-muted">{anomaly.date}</small>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted text-center py-3">Aucune anomalie détectée</p>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* ==================== MODAL KIOSQUE CORRIGÉ =================== */}
                <Modal isOpen={kioskModal} toggle={() => setKioskModal(false)} size="lg" className="kiosk-modal">
                    <ModalHeader toggle={() => setKioskModal(false)}>
                        <i className="ri-qr-scan-2-line me-2"></i>
                        Mode Kiosque - Pointage par badge
                    </ModalHeader>
                    <ModalBody className="text-center p-5">
                        {/* Animation de scan */}
                        <div className="mb-4 position-relative">
                            <div className="bg-light rounded p-5 d-inline-block position-relative">
                                <i className="ri-qr-code-line" style={{ fontSize: '120px', color: '#3b82f6' }}></i>
                                {loading && (
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 rounded">
                                        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }}>
                                            Chargement...
                                        </Spinner>
                                    </div>
                                )}
                                {/* Animation de scan */}
                                <div className="scan-animation"></div>
                            </div>
                        </div>
                        
                        <h4 className="mb-3">Scannez votre badge</h4>
                        <p className="text-muted mb-4">
                            Présentez votre badge devant le lecteur ou saisissez votre numéro ci-dessous
                        </p>

                        {/* Liste des badges récents pour test */}
                        <Row className="justify-content-center mb-4">
                            <Col md={10}>
                                <div className="d-flex flex-wrap gap-2 justify-content-center">
                                    {employeesData.map(emp => (
                                        <Badge 
                                            key={emp.value}
                                            color="light" 
                                            pill 
                                            className="p-2 cursor-pointer"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setBadgeNumber(emp.badgeNumber);
                                                simulateBadgeScan(emp.badgeNumber);
                                            }}
                                        >
                                            <i className="ri-id-card-line me-1"></i>
                                            {emp.badgeNumber} - {emp.label}
                                        </Badge>
                                    ))}
                                </div>
                                <small className="text-muted d-block text-center mt-2">
                                    👆 Cliquez sur un badge pour simuler un scan
                                </small>
                            </Col>
                        </Row>

                        {/* Saisie manuelle */}
                        <div className="row justify-content-center">
                            <Col md={8}>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text">
                                        <i className="ri-id-card-line"></i>
                                    </span>
                                    <Input
                                        type="text"
                                        placeholder="Numéro de badge (ex: EMP001)"
                                        value={badgeNumber}
                                        onChange={(e) => setBadgeNumber(e.target.value.toUpperCase())}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && badgeNumber) {
                                                simulateBadgeScan(badgeNumber);
                                            }
                                        }}
                                        autoFocus
                                        disabled={loading}
                                    />
                                    <Button 
                                        color="primary"
                                        onClick={() => {
                                            if (badgeNumber) {
                                                simulateBadgeScan(badgeNumber);
                                            }
                                        }}
                                        disabled={!badgeNumber || loading}
                                    >
                                        {loading ? <Spinner size="sm" /> : 'Valider'}
                                    </Button>
                                </div>
                            </Col>
                        </div>

                        {/* Message de résultat */}
                        {scanMessage.show && (
                            <div className={`alert alert-${scanMessage.type} mt-4 mb-0 d-flex align-items-center`}>
                                {scanMessage.type === 'success' && <i className="ri-checkbox-circle-line me-2 fs-4"></i>}
                                {scanMessage.type === 'warning' && <i className="ri-alert-line me-2 fs-4"></i>}
                                {scanMessage.type === 'danger' && <i className="ri-error-warning-line me-2 fs-4"></i>}
                                {scanMessage.type === 'info' && <i className="ri-information-line me-2 fs-4"></i>}
                                <div className="text-start">
                                    <strong>{scanMessage.title}</strong><br />
                                    {scanMessage.message}
                                </div>
                            </div>
                        )}

                        {/* Derniers pointages */}
                        {attendanceData.filter(r => r.date === formatDate(new Date())).length > 0 && (
                            <div className="mt-4 text-start">
                                <h6 className="mb-3">Derniers pointages aujourd'hui</h6>
                                <div className="table-responsive">
                                    <Table size="sm">
                                        <thead>
                                            <tr>
                                                <th>Employé</th>
                                                <th>Arrivée</th>
                                                <th>Départ</th>
                                                <th>Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceData
                                                .filter(r => r.date === formatDate(new Date()))
                                                .slice(0, 5)
                                                .map(record => (
                                                    <tr key={record.id}>
                                                        <td>{record.employee}</td>
                                                        <td>{record.checkIn || '-'}</td>
                                                        <td>{record.checkOut || '-'}</td>
                                                        <td>
                                                            {record.status === 'working' ? (
                                                                <Badge color="info" pill>En cours</Badge>
                                                            ) : record.status === 'present' ? (
                                                                <Badge color="success" pill>Présent</Badge>
                                                            ) : (
                                                                <Badge color="secondary" pill>-</Badge>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter className="justify-content-center">
                        <Button color="light" onClick={() => setKioskModal(false)}>
                            <i className="ri-close-line me-1"></i>
                            Fermer
                        </Button>
                        <Button color="info" onClick={() => {
                            setBadgeNumber('');
                            setScanMessage({ show: false, type: '', title: '', message: '' });
                        }}>
                            <i className="ri-refresh-line me-1"></i>
                            Nouveau scan
                        </Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Pointage Manuel */}
                <Modal isOpen={manualModal} toggle={() => setManualModal(false)} size="lg">
                    <ModalHeader toggle={() => setManualModal(false)}>
                        <i className="ri-pencil-line me-2"></i>
                        Pointage manuel
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Employé *</label>
                                    <Select
                                        value={employeesData.find(e => e.value === manualEntry.employee)}
                                        onChange={(opt) => setManualEntry({...manualEntry, employee: opt?.value})}
                                        options={employeesData}
                                        placeholder="Sélectionner un employé"
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Date *</label>
                                    <Input
                                        type="date"
                                        value={manualEntry.date}
                                        onChange={(e) => setManualEntry({...manualEntry, date: e.target.value})}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Heure d'arrivée</label>
                                    <Input
                                        type="time"
                                        value={manualEntry.checkIn}
                                        onChange={(e) => setManualEntry({...manualEntry, checkIn: e.target.value})}
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Heure de départ</label>
                                    <Input
                                        type="time"
                                        value={manualEntry.checkOut}
                                        onChange={(e) => setManualEntry({...manualEntry, checkOut: e.target.value})}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Type de pointage</label>
                                    <Select
                                        value={pointageTypes.find(t => t.value === manualEntry.type)}
                                        onChange={(opt) => setManualEntry({...manualEntry, type: opt.value})}
                                        options={pointageTypes}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Justification</label>
                                    <Input
                                        type="text"
                                        placeholder="Ex: Congés, mission, etc."
                                        value={manualEntry.justification}
                                        onChange={(e) => setManualEntry({...manualEntry, justification: e.target.value})}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="light" onClick={() => setManualModal(false)}>
                            Annuler
                        </Button>
                        <Button 
                            color="primary" 
                            onClick={handleManualPointage}
                            disabled={!manualEntry.employee || !manualEntry.date}
                        >
                            Enregistrer le pointage
                        </Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Détails */}
                {selectedRecord && (
                    <Modal isOpen={true} toggle={() => setSelectedRecord(null)} size="lg">
                        <ModalHeader toggle={() => setSelectedRecord(null)}>
                            <i className="ri-information-line me-2"></i>
                            Détails du pointage
                        </ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col md={6}>
                                    <h6 className="text-muted mb-3">Informations employé</h6>
                                    <p><strong>Nom:</strong> {selectedRecord.employee}</p>
                                    <p><strong>Département:</strong> {selectedRecord.department}</p>
                                    <p><strong>Méthode:</strong> {getMethodLabel(selectedRecord.method)}</p>
                                    <p><strong>Confiance:</strong> {Math.round(selectedRecord.confidence * 100)}%</p>
                                </Col>
                                <Col md={6}>
                                    <h6 className="text-muted mb-3">Horaires</h6>
                                    <p><strong>Date:</strong> {selectedRecord.date}</p>
                                    <p><strong>Arrivée:</strong> {selectedRecord.checkIn || 'Non pointé'}</p>
                                    <p><strong>Départ:</strong> {selectedRecord.checkOut || 'Non pointé'}</p>
                                    <p><strong>Heures travaillées:</strong> {selectedRecord.hoursWorked}</p>
                                    <p><strong>Heures supplémentaires:</strong> {selectedRecord.overtime}</p>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={6}>
                                    <h6 className="text-muted mb-3">Statut</h6>
                                    <p>{getStatusBadge(selectedRecord.status)} {getTypeBadge(selectedRecord.type)}</p>
                                </Col>
                                <Col md={6}>
                                    <h6 className="text-muted mb-3">Informations supplémentaires</h6>
                                    <p><strong>Appareil:</strong> {selectedRecord.device || '-'}</p>
                                    <p><strong>Localisation:</strong> {selectedRecord.location ? 
                                        `${selectedRecord.location.lat}, ${selectedRecord.location.lng}` : '-'}</p>
                                    <p><strong>Notes:</strong> {selectedRecord.notes || 'Aucune note'}</p>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={() => setSelectedRecord(null)}>
                                Fermer
                            </Button>
                            <Button color="primary">
                                <i className="ri-printer-line me-2"></i>
                                Imprimer
                            </Button>
                        </ModalFooter>
                    </Modal>
                )}

                {/* Modal Paramètres Automatisation */}
                <Modal isOpen={settingsModal} toggle={() => setSettingsModal(false)} size="lg">
                    <ModalHeader toggle={() => setSettingsModal(false)}>
                        <i className="ri-robot-line me-2"></i>
                        Paramètres d'automatisation
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md={6}>
                                <h6 className="mb-3">Méthodes de détection</h6>
                                <div className="mb-3">
                                    <div className="form-check form-switch mb-2">
                                        <Input 
                                            type="switch" 
                                            id="geoSwitch"
                                            checked={autoMode.method === 'geolocation'}
                                            onChange={() => setAutoMode({...autoMode, method: 'geolocation'})}
                                        />
                                        <label className="form-check-label" htmlFor="geoSwitch">
                                            📍 Géolocalisation
                                        </label>
                                        <small className="text-muted d-block">
                                            Détection automatique par position GPS
                                        </small>
                                    </div>
                                    
                                    <div className="form-check form-switch mb-2">
                                        <Input 
                                            type="switch" 
                                            id="facialSwitch"
                                            checked={autoMode.method === 'facial'}
                                            onChange={() => setAutoMode({...autoMode, method: 'facial'})}
                                        />
                                        <label className="form-check-label" htmlFor="facialSwitch">
                                            👤 Reconnaissance faciale
                                        </label>
                                        <small className="text-muted d-block">
                                            Utilise la caméra pour identifier l'employé
                                        </small>
                                    </div>
                                    
                                    <div className="form-check form-switch mb-2">
                                        <Input 
                                            type="switch" 
                                            id="wifiSwitch"
                                            checked={autoMode.method === 'wifi'}
                                            onChange={() => setAutoMode({...autoMode, method: 'wifi'})}
                                        />
                                        <label className="form-check-label" htmlFor="wifiSwitch">
                                            📡 WiFi
                                        </label>
                                        <small className="text-muted d-block">
                                            Détection par réseau WiFi d'entreprise
                                        </small>
                                    </div>
                                    
                                    <div className="form-check form-switch mb-2">
                                        <Input 
                                            type="switch" 
                                            id="btSwitch"
                                            checked={autoMode.method === 'bluetooth'}
                                            onChange={() => setAutoMode({...autoMode, method: 'bluetooth'})}
                                        />
                                        <label className="form-check-label" htmlFor="btSwitch">
                                            📱 Bluetooth
                                        </label>
                                        <small className="text-muted d-block">
                                            Détection par balises Bluetooth
                                        </small>
                                    </div>
                                    
                                    <div className="form-check form-switch mb-2">
                                        <Input 
                                            type="switch" 
                                            id="nfcSwitch"
                                            checked={autoMode.method === 'nfc'}
                                            onChange={() => setAutoMode({...autoMode, method: 'nfc'})}
                                        />
                                        <label className="form-check-label" htmlFor="nfcSwitch">
                                            💳 NFC
                                        </label>
                                        <small className="text-muted d-block">
                                            Badge NFC ou smartphone
                                        </small>
                                    </div>
                                    
                                    <div className="form-check form-switch mb-2">
                                        <Input 
                                            type="switch" 
                                            id="voiceSwitch"
                                            checked={autoMode.method === 'voice'}
                                            onChange={() => setAutoMode({...autoMode, method: 'voice'})}
                                        />
                                        <label className="form-check-label" htmlFor="voiceSwitch">
                                            🎤 Reconnaissance vocale
                                        </label>
                                        <small className="text-muted d-block">
                                            Identification par commande vocale
                                        </small>
                                    </div>
                                </div>
                            </Col>
                            
                            <Col md={6}>
                                <h6 className="mb-3">Règles d'automatisation</h6>
                                <div className="mb-3">
                                    <div className="form-check form-switch mb-2">
                                        <Input 
                                            type="switch" 
                                            id="continuousScan"
                                            checked={autoMode.continuousScan}
                                            onChange={() => setAutoMode({...autoMode, continuousScan: !autoMode.continuousScan})}
                                        />
                                        <label className="form-check-label" htmlFor="continuousScan">
                                            Scan continu
                                        </label>
                                        <small className="text-muted d-block">
                                            Détection automatique en arrière-plan
                                        </small>
                                    </div>
                                    
                                    <div className="form-check form-switch mb-2">
                                        <Input 
                                            type="switch" 
                                            id="notifications"
                                            checked={autoMode.notifications}
                                            onChange={() => setAutoMode({...autoMode, notifications: !autoMode.notifications})}
                                        />
                                        <label className="form-check-label" htmlFor="notifications">
                                            Notifications
                                        </label>
                                        <small className="text-muted d-block">
                                            Alertes pour les pointages automatiques
                                        </small>
                                    </div>
                                    
                                    <div className="form-check form-switch mb-2">
                                        <Input 
                                            type="switch" 
                                            id="reminders"
                                            checked={autoMode.reminders}
                                            onChange={() => setAutoMode({...autoMode, reminders: !autoMode.reminders})}
                                        />
                                        <label className="form-check-label" htmlFor="reminders">
                                            Rappels intelligents
                                        </label>
                                        <small className="text-muted d-block">
                                            Rappels pour les retardataires
                                        </small>
                                    </div>
                                    
                                    <div className="form-check form-switch mb-2">
                                        <Input 
                                            type="switch" 
                                            id="autoCheckout"
                                            checked={autoMode.autoCheckout}
                                            onChange={() => setAutoMode({...autoMode, autoCheckout: !autoMode.autoCheckout})}
                                        />
                                        <label className="form-check-label" htmlFor="autoCheckout">
                                            Départ automatique
                                        </label>
                                        <small className="text-muted d-block">
                                            Check-out automatique à {CONFIG.AUTO_CHECKOUT_TIME}
                                        </small>
                                    </div>
                                </div>
                                
                                <h6 className="mb-3 mt-4">Seuils de détection</h6>
                                <div className="mb-3">
                                    <label className="form-label">Confiance minimale</label>
                                    <Input 
                                        type="range" 
                                        min="0.5" 
                                        max="1" 
                                        step="0.05"
                                        value={autoMode.confidence}
                                        onChange={(e) => setAutoMode({...autoMode, confidence: parseFloat(e.target.value)})}
                                    />
                                    <div className="d-flex justify-content-between">
                                        <span>50%</span>
                                        <span>{Math.round(autoMode.confidence * 100)}%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Rayon de détection (mètres)</label>
                                    <Input 
                                        type="number" 
                                        value={CONFIG.DETECTION_RADIUS}
                                        onChange={(e) => CONFIG.DETECTION_RADIUS = parseInt(e.target.value)}
                                    />
                                </div>
                            </Col>
                        </Row>
                        
                        <Row className="mt-3">
                            <Col md={12}>
                                <Card className="bg-light">
                                    <CardBody>
                                        <h6>État actuel du système</h6>
                                        <div className="d-flex flex-wrap gap-3">
                                            <div>
                                                <Badge color={geolocation.enabled ? 'success' : 'secondary'} pill>
                                                    📍 GPS: {geolocation.enabled ? 'Actif' : 'Inactif'}
                                                </Badge>
                                            </div>
                                            <div>
                                                <Badge color={biometrics.facialEnabled ? 'success' : 'secondary'} pill>
                                                    👤 Facial: {biometrics.facialEnabled ? 'Actif' : 'Inactif'}
                                                </Badge>
                                            </div>
                                            <div>
                                                <Badge color={online ? 'success' : 'danger'} pill>
                                                    📡 Connecté
                                                </Badge>
                                            </div>
                                            <div>
                                                <Badge color={currentSession ? 'success' : 'secondary'} pill>
                                                    🕐 Session active
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="light" onClick={() => setSettingsModal(false)}>
                            Fermer
                        </Button>
                        <Button color="primary" onClick={() => setSettingsModal(false)}>
                            Sauvegarder
                        </Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Rapport */}
                <Modal isOpen={reportModal} toggle={() => setReportModal(false)}>
                    <ModalHeader toggle={() => setReportModal(false)}>
                        <i className="ri-file-chart-line me-2"></i>
                        Générer un rapport
                    </ModalHeader>
                    <ModalBody>
                        <div className="mb-3">
                            <label className="form-label">Type de rapport</label>
                            <Select
                                options={[
                                    { value: 'daily', label: 'Journalier' },
                                    { value: 'weekly', label: 'Hebdomadaire' },
                                    { value: 'monthly', label: 'Mensuel' },
                                    { value: 'custom', label: 'Personnalisé' }
                                ]}
                                placeholder="Sélectionner"
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Période</label>
                            <Row>
                                <Col md={6}>
                                    <Input type="date" placeholder="Date début" />
                                </Col>
                                <Col md={6}>
                                    <Input type="date" placeholder="Date fin" />
                                </Col>
                            </Row>
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Format</label>
                            <ButtonGroup>
                                <Button color="light">
                                    <i className="ri-file-pdf-line me-1"></i>
                                    PDF
                                </Button>
                                <Button color="light">
                                    <i className="ri-file-excel-line me-1"></i>
                                    Excel
                                </Button>
                                <Button color="light">
                                    <i className="ri-file-text-line me-1"></i>
                                    CSV
                                </Button>
                            </ButtonGroup>
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Inclure</label>
                            <div className="form-check">
                                <Input type="checkbox" id="includeStats" defaultChecked />
                                <label htmlFor="includeStats">Statistiques</label>
                            </div>
                            <div className="form-check">
                                <Input type="checkbox" id="includeDetails" defaultChecked />
                                <label htmlFor="includeDetails">Détails des pointages</label>
                            </div>
                            <div className="form-check">
                                <Input type="checkbox" id="includeAnomalies" defaultChecked />
                                <label htmlFor="includeAnomalies">Anomalies détectées</label>
                            </div>
                            <div className="form-check">
                                <Input type="checkbox" id="includePredictions" />
                                <label htmlFor="includePredictions">Prédictions IA</label>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="light" onClick={() => setReportModal(false)}>
                            Annuler
                        </Button>
                        <Button color="primary" onClick={() => generateReport('pdf')}>
                            {loading ? <Spinner size="sm" className="me-2" /> : null}
                            Générer
                        </Button>
                    </ModalFooter>
                </Modal>

                {/* Modal de suppression */}
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteRecord}
                    onCloseClick={() => {
                        setDeleteModal(false);
                        setRecordToDelete(null);
                    }}
                />

                {/* Styles CSS pour le mode kiosque */}
                <style jsx>{`
                    .kiosk-modal .modal-content {
                        border: none;
                        border-radius: 20px;
                    }
                    
                    .kiosk-modal .modal-header {
                        border-bottom: 2px solid #f0f0f0;
                        padding: 1.5rem;
                    }
                    
                    .kiosk-modal .modal-body {
                        padding: 2rem;
                    }
                    
                    .kiosk-modal .modal-footer {
                        border-top: 2px solid #f0f0f0;
                        padding: 1.5rem;
                    }
                    
                    .scan-animation {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 20px;
                        pointer-events: none;
                        animation: scan 2s infinite;
                    }
                    
                    @keyframes scan {
                        0% {
                            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                        }
                        70% {
                            box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
                        }
                        100% {
                            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                        }
                    }
                    
                    .cursor-pointer {
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }
                    
                    .cursor-pointer:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }
                    
                    .alert {
                        border-radius: 12px;
                        border: none;
                        padding: 1rem 1.5rem;
                    }
                    
                    .alert-success {
                        background-color: #d1fae5;
                        color: #065f46;
                    }
                    
                    .alert-warning {
                        background-color: #fed7aa;
                        color: #92400e;
                    }
                    
                    .alert-danger {
                        background-color: #fee2e2;
                        color: #991b1b;
                    }
                    
                    .alert-info {
                        background-color: #dbeafe;
                        color: #1e40af;
                    }
                `}</style>
        </div>
    );
};

export default Pointage;