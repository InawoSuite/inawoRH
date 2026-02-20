import React, { useEffect, useMemo, useState } from "react";
import { 
    Container, Row, Col, Card, CardBody, Button, 
    Input, Table, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    ButtonGroup
} from "reactstrap";
import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import Select from "react-select";

const Pointage = () => {
    const { entreprise } = useParams();
    
    // États
    const [viewMode, setViewMode] = useState("calendar"); // "calendar" ou "list"
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 20)); // 20 février 2026
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [checkInTime, setCheckInTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState("00:00");
    const [showKiosk, setShowKiosk] = useState(false);
    const [badgeNumber, setBadgeNumber] = useState("");
    
    // Données de démonstration - Employés
    const employeesData = useMemo(() => [
        { value: "all", label: "Tous les employés" },
        { value: "1", label: "Jean Dupont" },
        { value: "2", label: "Marie Martin" },
        { value: "3", label: "Pierre Durant" },
        { value: "4", label: "Sophie Leblanc" },
        { value: "5", label: "Luc Bernard" },
    ], []);
    
    // Données de démonstration - Pointages
    const [attendanceData, setAttendanceData] = useState([
        {
            id: 1,
            employee: "Jean Dupont",
            date: "2026-02-20",
            checkIn: "08:45",
            checkOut: "17:30",
            hoursWorked: "8:45",
            overtime: "0:45",
            overtimeSupp: "0:00",
            status: "present"
        },
        {
            id: 2,
            employee: "Marie Martin",
            date: "2026-02-20",
            checkIn: "09:00",
            checkOut: "18:00",
            hoursWorked: "9:00",
            overtime: "1:00",
            overtimeSupp: "0:00",
            status: "present"
        },
        {
            id: 3,
            employee: "Pierre Durant",
            date: "2026-02-20",
            checkIn: "08:30",
            checkOut: null,
            hoursWorked: "En cours",
            overtime: "0:00",
            overtimeSupp: "0:00",
            status: "working"
        },
        {
            id: 4,
            employee: "Sophie Leblanc",
            date: "2026-02-20",
            checkIn: null,
            checkOut: null,
            hoursWorked: "0:00",
            overtime: "0:00",
            overtimeSupp: "0:00",
            status: "absent"
        },
    ]);

    // Timer pour le temps écoulé
    useEffect(() => {
        let interval;
        if (isCheckedIn && checkInTime) {
            interval = setInterval(() => {
                const now = new Date();
                const diff = now - checkInTime;
                const hours = Math.floor(diff / 3600000);
                const minutes = Math.floor((diff % 3600000) / 60000);
                setElapsedTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCheckedIn, checkInTime]);

    // Fonctions de gestion du calendrier
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

    // Gestion du pointage
    const handleCheckIn = () => {
        setIsCheckedIn(true);
        setCheckInTime(new Date());
    };

    const handleCheckOut = () => {
        setIsCheckedIn(false);
        setCheckInTime(null);
        setElapsedTime("00:00");
    };

    const handleKioskScan = () => {
        if (badgeNumber) {
            // Simulation du scan de badge
            alert(`Badge ${badgeNumber} scanné avec succès!`);
            setBadgeNumber("");
            setShowKiosk(false);
        }
    };

    const handleLoadDemoData = () => {
        // Charger plus de données de démonstration
        const newData = [
            ...attendanceData,
            {
                id: 5,
                employee: "Luc Bernard",
                date: "2026-02-20",
                checkIn: "09:15",
                checkOut: "17:45",
                hoursWorked: "8:30",
                overtime: "0:30",
                overtimeSupp: "0:00",
                status: "present"
            },
        ];
        setAttendanceData(newData);
        alert("Données de démonstration chargées!");
    };

    // Naviguer dans le calendrier
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date(2026, 1, 20));
    };

    document.title = "Pointage & Présences | INAWO - Suite de Gestion";

    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb
                    title="Pointage"
                    pageTitle={
                        <>
                            <i className="ri-calendar-check-line"></i>
                            &nbsp;&gt;&nbsp;<Link to={`/${entreprise}`}>Tableau de Bord</Link>&nbsp;&gt;
                        </>
                    }
                />

                {/* En-tête avec filtres et boutons */}
                <Row className="mb-3">
                    <Col lg={12}>
                        <Card>
                            <CardBody>
                                <Row className="align-items-center">
                                    <Col md={2}>
                                        <Button 
                                            color="primary" 
                                            onClick={() => setViewMode("calendar")}
                                        >
                                            <i className="ri-add-line align-bottom me-1"></i>
                                            Nouveau
                                        </Button>
                                    </Col>
                                    <Col md={3}>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="ri-calendar-line"></i>
                                            </span>
                                            <Input 
                                                type="text" 
                                                value={`Date: ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                                                readOnly
                                            />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <Select
                                            value={selectedEmployee}
                                            onChange={setSelectedEmployee}
                                            options={employeesData}
                                            placeholder="Employé"
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                        />
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
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* Vue Calendrier */}
                {viewMode === "calendar" && (
                    <>
                        <Row className="mb-3">
                            <Col lg={12}>
                                <Card>
                                    <CardBody>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <Button color="light" size="sm" onClick={goToPreviousMonth}>
                                                <i className="ri-arrow-left-s-line"></i>
                                            </Button>
                                            <h5 className="mb-0">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h5>
                                            <div>
                                                <Button color="light" size="sm" onClick={goToToday} className="me-2">
                                                    Aujourd'hui
                                                </Button>
                                                <Button color="light" size="sm" onClick={goToNextMonth}>
                                                    <i className="ri-arrow-right-s-line"></i>
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Grille du calendrier */}
                                        <div className="calendar-grid">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        {dayNames.map((day, idx) => (
                                                            <th key={idx} className="text-center">{day}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) }).map((_, weekIdx) => (
                                                        <tr key={weekIdx}>
                                                            {Array.from({ length: 7 }).map((_, dayIdx) => {
                                                                const dayNumber = weekIdx * 7 + dayIdx - firstDay + 1;
                                                                const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
                                                                const isToday = dayNumber === 20; // 20 février 2026
                                                                
                                                                return (
                                                                    <td 
                                                                        key={dayIdx} 
                                                                        className={`text-center ${isValidDay ? '' : 'text-muted'} ${isToday ? 'bg-soft-primary' : ''}`}
                                                                        style={{ height: '60px', verticalAlign: 'top', padding: '8px' }}
                                                                    >
                                                                        {isValidDay && (
                                                                            <>
                                                                                <div className="fw-bold">{dayNumber}</div>
                                                                                {isToday && (
                                                                                    <Badge color="success" className="mt-1">Aujourd'hui</Badge>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        {/* Section Pointage */}
                        <Row>
                            <Col md={6}>
                                <Card>
                                    <CardBody className="text-center" style={{ padding: '40px' }}>
                                        <div className="border rounded p-4 bg-light" style={{ minHeight: '200px' }}>
                                            <i className="ri-qr-scan-2-line" style={{ fontSize: '48px', color: '#999' }}></i>
                                            <h5 className="mt-3">Scan your badge</h5>
                                            <p className="text-muted">ou saisissez votre numéro de badge</p>
                                        </div>
                                        <Button 
                                            color="secondary" 
                                            className="mt-3"
                                            onClick={() => setShowKiosk(!showKiosk)}
                                        >
                                            {showKiosk ? 'Fermer' : 'Essayer'} le Kiosque'
                                        </Button>
                                        
                                        {showKiosk && (
                                            <div className="mt-3">
                                                <Input 
                                                    type="text" 
                                                    placeholder="Numéro de badge..."
                                                    value={badgeNumber}
                                                    onChange={(e) => setBadgeNumber(e.target.value)}
                                                    className="mb-2"
                                                />
                                                <Button color="primary" onClick={handleKioskScan}>
                                                    Valider
                                                </Button>
                                            </div>
                                        )}
                                    </CardBody>
                                </Card>
                            </Col>

                            <Col md={6}>
                                <Card>
                                    <CardBody className="text-center" style={{ padding: '40px' }}>
                                        <div className="position-relative">
                                            <div 
                                                className="position-absolute top-0 end-0 rounded-circle"
                                                style={{ 
                                                    width: '20px', 
                                                    height: '20px', 
                                                    backgroundColor: isCheckedIn ? '#10b981' : '#ef4444'
                                                }}
                                            ></div>
                                            <h6 className="text-muted mb-2">
                                                {isCheckedIn ? 'Since 2:40 PM' : 'Non pointé'}
                                            </h6>
                                            <h1 className="display-4 mb-3" style={{ color: '#3b82f6' }}>
                                                {elapsedTime}
                                            </h1>
                                            <Button 
                                                color="warning" 
                                                size="lg"
                                                className="w-75"
                                                onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
                                                style={{ borderRadius: '8px', padding: '12px' }}
                                            >
                                                {isCheckedIn ? 'Check out' : 'Check in'}
                                            </Button>
                                        </div>
                                        
                                        <div className="mt-4 pt-3 border-top">
                                            <p className="text-muted mb-2">
                                                Essayer <span className="text-danger">●</span>{' '}
                                                l'icône (par exemple pour le travail à domicile)
                                            </p>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        {/* Section Analytics */}
                        {/* <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardBody className="text-center" style={{ padding: '40px' }}>
                                        <h5 className="mb-3">Essayer le backend et l'analyse :</h5>
                                        <Button 
                                            color="light" 
                                            onClick={handleLoadDemoData}
                                        >
                                            Charger les données démo
                                        </Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row> */}
                    </>
                )}

                {/* Vue Liste */}
                {viewMode === "list" && (
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <div className="table-responsive">
                                        <Table className="table-nowrap align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th scope="col">
                                                        <Input type="checkbox" />
                                                    </th>
                                                    <th scope="col">Employé</th>
                                                    <th scope="col">Arrivée</th>
                                                    <th scope="col">Départ</th>
                                                    <th scope="col">Heures travaillées</th>
                                                    <th scope="col">Heures supplémentaires effectuées</th>
                                                    <th scope="col">Heures supplémentaires</th>
                                                    <th scope="col">Statut</th>
                                                    <th scope="col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {attendanceData.map((record) => (
                                                    <tr key={record.id}>
                                                        <td>
                                                            <Input type="checkbox" />
                                                        </td>
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
                                                        <td>{record.checkIn || '-'}</td>
                                                        <td>{record.checkOut || '-'}</td>
                                                        <td>{record.hoursWorked}</td>
                                                        <td>{record.overtime}</td>
                                                        <td>{record.overtimeSupp}</td>
                                                        <td>
                                                            <Badge 
                                                                color={
                                                                    record.status === 'present' ? 'success' :
                                                                    record.status === 'working' ? 'info' :
                                                                    'danger'
                                                                }
                                                            >
                                                                {
                                                                    record.status === 'present' ? 'Présent' :
                                                                    record.status === 'working' ? 'En cours' :
                                                                    'Absent'
                                                                }
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle
                                                                    href="#"
                                                                    className="btn btn-soft-secondary btn-sm"
                                                                    tag="button"
                                                                >
                                                                    <i className="ri-more-fill" />
                                                                </DropdownToggle>
                                                                <DropdownMenu className="dropdown-menu-end">
                                                                    <DropdownItem href="#">
                                                                        <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
                                                                        Voir
                                                                    </DropdownItem>
                                                                    <DropdownItem href="#">
                                                                        <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                                                                        Modifier
                                                                    </DropdownItem>
                                                                    <DropdownItem divider />
                                                                    <DropdownItem href="#">
                                                                        <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                                                                        Supprimer
                                                                    </DropdownItem>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
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
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default Pointage;
