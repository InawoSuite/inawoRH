import React from "react";
import { Card, CardBody, CardHeader, Col, Table } from "reactstrap";

const agendaItems = [
  {
    id: 1,
    date: "18/02/2026",
    heure: "09:00",
    activite: "Réunion équipe RH",
    responsable: "Jeanne",
    statut: "Planifié",
    statutClass: "info",
  },
  {
    id: 2,
    date: "18/02/2026",
    heure: "11:30",
    activite: "Entretien candidat",
    responsable: "Morgiane",
    statut: "En cours",
    statutClass: "warning",
  },
  {
    id: 3,
    date: "19/02/2026",
    heure: "08:30",
    activite: "Onboarding collaborateur",
    responsable: "Jeanne",
    statut: "Planifié",
    statutClass: "primary",
  },
  {
    id: 4,
    date: "19/02/2026",
    heure: "15:00",
    activite: "Point congés mensuel",
    responsable: "Morgiane",
    statut: "Terminé",
    statutClass: "success",
  },
];

const AgendaTable = () => {
  return (
    <Col xxl={8}>
      <Card className="card-height-100">
        <CardHeader className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Agenda</h4>
        </CardHeader>
        <CardBody>
          <div className="table-responsive table-card">
            <Table className="table table-borderless table-centered align-middle table-nowrap mb-0">
              <thead className="text-muted table-light">
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Heure</th>
                  <th scope="col">Activité</th>
                  <th scope="col">Responsable</th>
                  <th scope="col">Statut</th>
                </tr>
              </thead>
              <tbody>
                {agendaItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.heure}</td>
                    <td>{item.activite}</td>
                    <td>{item.responsable}</td>
                    <td>
                      <span
                        className={`badge bg-${item.statutClass}-subtle text-${item.statutClass}`}
                      >
                        {item.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default AgendaTable;
