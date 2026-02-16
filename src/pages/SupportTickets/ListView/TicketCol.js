import React from 'react';
import { Link } from 'react-router-dom';
import moment from "moment";
import { Badge } from 'reactstrap';

const handleValidDate = (date) => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
};

const TicketsId = (cell) => {
    return (
        <React.Fragment>
            <Link to="/apps-tickets-details" className="fw-medium link-primary">{cell.getValue()}</Link>
        </React.Fragment>
    );
};

const Title = (cell) => {
    return (
        <React.Fragment>
            {cell.getValue()}
        </React.Fragment>
    );
};

const Client = (cell) => {
    return (
        <React.Fragment>
            {cell.getValue()}
        </React.Fragment>
    );
};

const AssignedTo = (cell) => {
    return (
        <React.Fragment>
            {cell.getValue()}
        </React.Fragment>
    );
};

const CreateDate = (cell) => {
    return (
        <React.Fragment>
            {handleValidDate(cell.getValue())}
        </React.Fragment>
    );
};

const DueDate = (cell) => {
    return (
        <React.Fragment>
            {cell.getValue()}
        </React.Fragment>
    );
};

const Status = (cell) => {
    return (
        <React.Fragment>
            {cell.getValue() === "En cours" ? <Badge color="warning" className="ms-2" style={{ borderRadius: '20px', fontSize: '0.58rem', padding: '0.25em 0.75em' }}>
                {cell.getValue()}
            </Badge>
                : cell.getValue() === "Nouveau" ? <Badge color="info" className="ms-2" style={{ borderRadius: '20px', fontSize: '0.58rem', padding: '0.25em 0.75em' }}>
                            {cell.getValue()}
                        </Badge>
                    : cell.getValue() === "Ouvert" ? <Badge color="success" className="ms-2" style={{ borderRadius: '20px', fontSize: '0.58rem', padding: '0.25em 0.75em' }}>
                            {cell.getValue()}
                        </Badge>
                        : cell.getValue() === "Fermé" ? <Badge color="danger" className="ms-2" style={{ borderRadius: '20px', fontSize: '0.58rem', padding: '0.25em 0.75em' }}>
                            {cell.getValue()}
                        </Badge>
                            : null
            }
        </React.Fragment>
    );
};

const Priority = (cell) => {
    return (
        <React.Fragment>
            {cell.getValue() === "Medium" ?
                <Badge color="warning" className="ms-2" style={{ borderRadius: '20px', fontSize: '0.58rem', padding: '0.25em 0.75em' }}>
                    {cell.getValue()}
                </Badge>
                :
                cell.getValue() === "High" ?
                    <Badge color="danger" className="ms-2" style={{ borderRadius: '20px', fontSize: '0.58rem', padding: '0.25em 0.75em' }}>
                        {cell.getValue()}
                    </Badge>
                    : cell.getValue() === "Low" ?
                        <Badge color="success" className="ms-2" style={{ borderRadius: '20px', fontSize: '0.58rem', padding: '0.25em 0.75em' }}>
                            {cell.getValue()}
                        </Badge>
                        : null
            }
        </React.Fragment>
    );
};

export { TicketsId, Title, Client, AssignedTo, CreateDate, DueDate, Status, Priority };