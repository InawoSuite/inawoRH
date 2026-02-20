import React from 'react';
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
 

const taches = [
    {
        id: 1,
        titre: "Préparer les contrats de travail",
        responsable: "Morgiane",
        echeance: "20/02/2026",
        priorite: "Haute",
        statut: "En cours",
        statutClass: "warning",
    },
    {
        id: 2,
        titre: "Finaliser l'onboarding de Kossi",
        responsable: "Jeanne",
        echeance: "21/02/2026",
        priorite: "Moyenne",
        statut: "Terminé",
        statutClass: "success",
    },
    {
        id: 3,
        titre: "Mettre à jour le planning RH",
        responsable: "Arielle",
        echeance: "22/02/2026",
        priorite: "Basse",
        statut: "En cours",
        statutClass: "warning",
    },
    {
        id: 4,
        titre: "Valider les demandes de congés",
        responsable: "Morgiane",
        echeance: "23/02/2026",
        priorite: "Haute",
        statut: "Terminé",
        statutClass: "success",
    },
    {
        id: 5,
        titre: "Préparer la réunion mensuelle RH",
        responsable: "Jeanne",
        echeance: "24/02/2026",
        priorite: "Moyenne",
        statut: "En cours",
        statutClass: "warning",
    },
];

 const cardStyle = {
		borderRadius: "20px",
		background: "#fff",
		boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
		overflow: "hidden",
	};



const Tache = ({ xxl = 12, xl = 12 }) => {
    return (
        <React.Fragment>
            <Col xxl={xxl} xl={xl}>
                <Card style={cardStyle}>
                    <CardHeader className="align-items-center d-flex" >
                        <h4 className="card-title mb-0 flex-grow-1">Liste des tâches</h4>
                        <div className="flex-shrink-0">
                            <UncontrolledDropdown className="card-header-dropdown">
                                <DropdownToggle tag="a" className="text-reset" role="button">
                                    <span className="fw-semibold text-uppercase fs-12">Filtrer: </span><span className="text-muted">Cette semaine<i className="mdi mdi-chevron-down ms-1"></i></span>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-end">
                                    <DropdownItem>Cette semaine</DropdownItem>
                                    <DropdownItem>Ce mois</DropdownItem>
                                    <DropdownItem>Toutes</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    </CardHeader>

                    <CardBody>
                        <div className="table-responsive table-card">
                            <table className="table table-hover table-centered align-middle table-nowrap mb-0">
                                <thead className="text-muted table-light">
                                    <tr>
                                        <th>Tâche</th>
                                        <th>Responsable</th>
                                        <th>Échéance</th>
                                        <th>Priorité</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(taches || []).map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.titre}</td>
                                            <td>{item.responsable}</td>
                                            <td>{item.echeance}</td>
                                            <td>{item.priorite}</td>
                                            <td>
                                                <span className={`badge bg-${item.statutClass}-subtle text-${item.statutClass}`}>
                                                    {item.statut}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="text-muted mt-3">
                            {taches.length} tâches affichées
                        </div>

                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default Tache;