
import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const handleValidDate = (date) => {
    const date1 = moment(new Date(date)).format("DD MMM Y");
    return date1;
};

const OrdersId = (cell) => {
    return (
        <Link to="/details-tache" className="fw-medium link-primary">
            {cell.getValue()}
        </Link>
    );
};

const Project = (cell) => {
    return (
        <Link to="/apercu-projet" className="fw-medium link-primary">
            {cell.getValue()}
        </Link>
    );
};

const Tasks = (cell, onEditIconClick, onDeleteIconClick) => {
    return (
        <div className="d-flex">
            <div className="flex-grow-1 tasks_name">{cell.getValue()}</div>
            <div className="flex-shrink-0 ms-4">
                <ul className="list-inline tasks-list-menu mb-0">
                    <li className="list-inline-item">
                        <Link to="/details-tache">
                            <i className="ri-eye-fill align-bottom me-2 text-muted"></i>
                        </Link>
                    </li>
                    <li className="list-inline-item">
                        <Link to="#" onClick={onEditIconClick}>
                            <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>
                        </Link>
                    </li>
                    <li className="list-inline-item">
                        <Link to="#" className="remove-item-btn" onClick={onDeleteIconClick}>
                            <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

const CreateBy = (cell) => {
    return cell.getValue();
};

const AssignedTo = (cell) => {
    return (
        <div className="avatar-group">
            {(cell.getValue() || []).map((item, index) => (
                <Link key={index} to="#" className="avatar-group-item">
                    <img src={item.img} alt="" className="rounded-circle avatar-xxs" />
                </Link>
            ))}
        </div>
    );
};

const DueDate = (cell) => {
    return handleValidDate(cell.getValue());
};

const Status = (cell) => {
    const statusMap = {
        "Inprogress": { class: "secondary", label: "En cours" },
        "New": { class: "info", label: "Nouveau" },
        "Completed": { class: "success", label: "Terminé" },
        "Pending": { class: "warning", label: "En attente" }
    };

    const status = statusMap[cell.getValue()];
    if (!status) return null;

    return (
        <span className={`badge bg-${status.class}-subtle text-${status.class} text-uppercase`}>
            {status.label}
        </span>
    );
};

const Priority = (cell) => {
    const priorityMap = {
        "Medium": { class: "warning", label: "Moyenne" },
        "High": { class: "danger", label: "Haute" },
        "Low": { class: "success", label: "Basse" }
    };

    const priority = priorityMap[cell.getValue()];
    if (!priority) return null;

    return (
        <span className={`badge bg-${priority.class} text-uppercase`}>
            {priority.label}
        </span>
    );
};

export { OrdersId, Project, Tasks, CreateBy, AssignedTo, DueDate, Status, Priority };