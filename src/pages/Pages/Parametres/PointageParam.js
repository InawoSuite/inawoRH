import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, Table, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
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


const PointageParam = () => {
    const { t } = useTranslation();

    const [online, setOnline] = useState(navigator.onLine);
    // ==================== ÉTATS DE POINTAGE EN TEMPS RÉEL ====================
    const [currentSession, setCurrentSession] = useState(null);
    const [activeSessions, setActiveSessions] = useState([]);
    const [predictions, setPredictions] = useState({});
    const [anomalies, setAnomalies] = useState([]);
    const [notifications, setNotifications] = useState([]);
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


    return (
        <div className="page-content">
            <BreadCrumb
                title={` ${t("Paramètres de Pointage")}`}
                pageTitle={
                    <>
                        <i className="ri-settings-line"></i>
                        &nbsp;&gt;&nbsp;<Link to="/">{t("Tableau de Bord")}</Link>&nbsp;&gt;
                    </>
                }
            />
            <Row>
                <Col md={12}>
                    <Card className="rounded-4 p-4">

                        <h5 className="card-title ms-2 mt-2">{t("Configuration du pointage automatique")}</h5>

                        <Row>
                            <Col md={6}>
                                <h6 className="mb-3 ms-2">{t("Méthodes de détection")}</h6>
                                <div className="mb-3">
                                    <div className="form-check form-switch mb-2">
                                        <Input
                                            type="switch"
                                            id="geoSwitch"
                                            checked={autoMode.method === 'geolocation'}
                                            onChange={() => setAutoMode({ ...autoMode, method: 'geolocation' })}
                                        />
                                        <label className="form-check-label" htmlFor="geoSwitch">
                                            📍 {t("Géolocalisation")}
                                        </label>
                                        <small className="text-muted d-block">
                                            {t("Détection automatique par position GPS")}
                                        </small>
                                    </div>

                                    <div className="form-check form-switch mb-2">
                                        <Input
                                            type="switch"
                                            id="facialSwitch"
                                            checked={autoMode.method === 'facial'}
                                            onChange={() => setAutoMode({ ...autoMode, method: 'facial' })}
                                        />
                                        <label className="form-check-label" htmlFor="facialSwitch">
                                            👤 {t("Reconnaissance faciale")}
                                        </label>
                                        <small className="text-muted d-block">
                                            {t("Utilise la caméra pour identifier l'employé")}
                                        </small>
                                    </div>

                                    <div className="form-check form-switch mb-2">
                                        <Input
                                            type="switch"
                                            id="wifiSwitch"
                                            checked={autoMode.method === 'wifi'}
                                            onChange={() => setAutoMode({ ...autoMode, method: 'wifi' })}
                                        />
                                        <label className="form-check-label" htmlFor="wifiSwitch">
                                            📡 WiFi
                                        </label>
                                        <small className="text-muted d-block">
                                            {t("Détection par réseau WiFi d'entreprise")}
                                        </small>
                                    </div>

                                    <div className="form-check form-switch mb-2">
                                        <Input
                                            type="switch"
                                            id="btSwitch"
                                            checked={autoMode.method === 'bluetooth'}
                                            onChange={() => setAutoMode({ ...autoMode, method: 'bluetooth' })}
                                        />
                                        <label className="form-check-label" htmlFor="btSwitch">
                                            📱 Bluetooth
                                        </label>
                                        <small className="text-muted d-block">
                                            {t("Détection par balises Bluetooth")}
                                        </small>
                                    </div>

                                    <div className="form-check form-switch mb-2">
                                        <Input
                                            type="switch"
                                            id="nfcSwitch"
                                            checked={autoMode.method === 'nfc'}
                                            onChange={() => setAutoMode({ ...autoMode, method: 'nfc' })}
                                        />
                                        <label className="form-check-label" htmlFor="nfcSwitch">
                                            💳 NFC
                                        </label>
                                        <small className="text-muted d-block">
                                            {t("Badge NFC ou smartphone")}
                                        </small>
                                    </div>

                                    <div className="form-check form-switch mb-2">
                                        <Input
                                            type="switch"
                                            id="voiceSwitch"
                                            checked={autoMode.method === 'voice'}
                                            onChange={() => setAutoMode({ ...autoMode, method: 'voice' })}
                                        />
                                        <label className="form-check-label" htmlFor="voiceSwitch">
                                            🎤 {t("Reconnaissance vocale")}
                                        </label>
                                        <small className="text-muted d-block">
                                            {t("Identification par commande vocale")}
                                        </small>
                                    </div>
                                </div>
                            </Col>

                            <Col md={6}>
                                <h6 className="mb-3">{t("Règles d'automatisation")}</h6>
                                <div className="mb-3">
                                    <div className="form-check form-switch mb-2">
                                        <Input
                                            type="switch"
                                            id="continuousScan"
                                            checked={autoMode.continuousScan}
                                            onChange={() => setAutoMode({ ...autoMode, continuousScan: !autoMode.continuousScan })}
                                        />
                                        <label className="form-check-label" htmlFor="continuousScan">
                                            {t("Scan continu")}
                                        </label>
                                        <small className="text-muted d-block">
                                            {t("Détection automatique en arrière-plan")}
                                        </small>
                                    </div>

                                    <div className="form-check form-switch mb-2">
                                        <Input
                                            type="switch"
                                            id="notifications"
                                            checked={autoMode.notifications}
                                            onChange={() => setAutoMode({ ...autoMode, notifications: !autoMode.notifications })}
                                        />
                                        <label className="form-check-label" htmlFor="notifications">
                                            Notifications
                                        </label>
                                        <small className="text-muted d-block">
                                            {t("Alertes pour les pointages automatiques")}
                                        </small>
                                    </div>

                                    <div className="form-check form-switch mb-2">
                                        <Input
                                            type="switch"
                                            id="reminders"
                                            checked={autoMode.reminders}
                                            onChange={() => setAutoMode({ ...autoMode, reminders: !autoMode.reminders })}
                                        />
                                        <label className="form-check-label" htmlFor="reminders">
                                            {t("Rappels intelligents")}
                                        </label>
                                        <small className="text-muted d-block">
                                            {t("Rappels pour les retardataires")}
                                        </small>
                                    </div>

                                    <div className="form-check form-switch mb-2">
                                        <Input
                                            type="switch"
                                            id="autoCheckout"
                                            checked={autoMode.autoCheckout}
                                            onChange={() => setAutoMode({ ...autoMode, autoCheckout: !autoMode.autoCheckout })}
                                        />
                                        <label className="form-check-label" htmlFor="autoCheckout">
                                            {t("Départ automatique")}
                                        </label>
                                        <small className="text-muted d-block">
                                            {t("Check-out automatique à")} {CONFIG.AUTO_CHECKOUT_TIME}
                                        </small>
                                    </div>
                                </div>

                                <h6 className="mb-3 mt-4">{t("Seuils de détection")}</h6>
                                <div className="mb-3">
                                    <label className="form-label">{t("Confiance minimale")}</label>
                                    <Input
                                        type="range"
                                        min="0.5"
                                        max="1"
                                        step="0.05"
                                        className="rounded-2"
                                        value={autoMode.confidence}
                                        onChange={(e) => setAutoMode({ ...autoMode, confidence: parseFloat(e.target.value) })}
                                    />
                                    <div className="d-flex justify-content-between">
                                        <span>50%</span>
                                        <span>{Math.round(autoMode.confidence * 100)}%</span>
                                        <span>100%</span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{t("Rayon de détection (mètres)")}</label>
                                    <Input
                                        type="number"
                                        className="rounded-5"
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
                                        <h6>{t("État actuel du système")}</h6>
                                        <div className="d-flex flex-wrap gap-3">
                                            <div>
                                                <Badge color={geolocation.enabled ? 'success' : 'secondary'} pill>
                                                    📍 GPS: {geolocation.enabled ? t("Actif") : t("Inactif")}
                                                </Badge>
                                            </div>
                                            <div>
                                                <Badge color={biometrics.facialEnabled ? 'success' : 'secondary'} pill>
                                                    👤 Facial: {biometrics.facialEnabled ? t("Actif") : t("Inactif")}
                                                </Badge>
                                            </div>
                                            <div>
                                                <Badge color={online ? 'success' : 'danger'} pill>
                                                    📡 {t("Connecté")}
                                                </Badge>
                                            </div>
                                            <div>
                                                <Badge color={currentSession ? 'success' : 'secondary'} pill>
                                                    🕐 {t("Session active")}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        {/* <ModalFooter>
                                                       <Button color="light" onClick={() => setSettingsModal(false)}>
                                                           Fermer
                                                       </Button>
                                                       <Button color="primary" onClick={() => setSettingsModal(false)}>
                                                           Sauvegarder
                                                       </Button>
                                                   </ModalFooter> */}

                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PointageParam;