import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import CountUp from "react-countup";

const widgetData = [
    {
        label: "Tâches totales",
        counter: 234,
        icon: "ri-task-line",
        iconClass: "primary",
        growth: "+12.5"
    },
    {
        label: "Tâches en cours",
        counter: 64,
        icon: "ri-time-line",
        iconClass: "warning",
        growth: "+8.1"
    },
    {
        label: "Tâches terminées",
        counter: 148,
        icon: "ri-check-double-line",
        iconClass: "success",
        growth: "+15.2"
    },
    {
        label: "Tâches en attente",
        counter: 22,
        icon: "ri-pause-circle-line",
        iconClass: "info",
        growth: "-2.4"
    }
];

const Widgets = () => {
    return (
        <React.Fragment>

            {/* {widgetData.map((item, key) => (
=======
            {widgetData.map((item, key) => (
>>>>>>> origin/Abike
                <Col xxl={6} sm={6} key={key}>
                    <Card>
                        <CardBody>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="fw-medium mb-0">{item.label}</p>
                                    <h2 className="mt-4 fw-bold">
                                        <CountUp
                                            start={0}
                                            end={item.counter}
                                            duration={2}
                                        />
                                    </h2>
                                    <p className="mb-0">
                                        <span className={`badge ${item.growth.startsWith('+') ? 'bg-success' : 'bg-danger'}`}>
                                            {item.growth}%
                                        </span>
                                        <span className="ms-2">depuis le mois dernier</span>
                                    </p>
                                </div>
                                <div>
                                    <div className="avatar-sm">
                                        <span className={`avatar-title rounded-circle bg-${item.iconClass}-subtle`}>
                                            <i className={`${item.icon} fs-4 text-${item.iconClass}`}></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                
            ))} */}
        </React.Fragment>
    );
};

export default Widgets;