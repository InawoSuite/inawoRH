import React from "react";
import { Card, CardBody, CardHeader, Col, Table } from "reactstrap";
import { useTranslation } from "react-i18next";

const AgendaTable = () => {
  const { t } = useTranslation();

  const agendaItems = [
    {
      id: 1,
      date: "18/02/2026",
      heure: "09:00",
      activite: t("Réunion équipe RH"),
      responsable: "Jeanne",
      statut: t("Planifié"),
      statutClass: "info",
    },
    {
      id: 2,
      date: "18/02/2026",
      heure: "11:30",
      activite: t("Entretien candidat"),
      responsable: "Morgiane",
      statut: t("En cours"),
      statutClass: "warning",
    },
    {
      id: 3,
      date: "19/02/2026",
      heure: "08:30",
      activite: t("Onboarding collaborateur"),
      responsable: "Jeanne",
      statut: t("Planifié"),
      statutClass: "primary",
    },
    {
      id: 4,
      date: "19/02/2026",
      heure: "15:00",
      activite: t("Point congés mensuel"),
      responsable: "Morgiane",
      statut: t("Terminé"),
      statutClass: "success",
    },
  ];

  return (
    <Col xxl={8}>
      <Card className="card-height-100" style={{ borderRadius: "20px", overflow: "hidden" }}>
        <CardHeader className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">{t("Agenda")}</h4>
        </CardHeader>
        <CardBody>
          <div className="table-responsive table-card">
            <Table className="table table-borderless table-centered align-middle table-nowrap mb-0">
              <thead className="text-muted table-light">
                <tr>
                  <th scope="col">{t("Date")}</th>
                  <th scope="col">{t("Heure")}</th>
                  <th scope="col">{t("Activité")}</th>
                  <th scope="col">{t("Responsable")}</th>
                  <th scope="col">{t("Statut")}</th>
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
