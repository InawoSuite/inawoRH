// src/components/Common/PageAlerts.js
import React from 'react';
import { Alert } from 'reactstrap';
import { useNotification } from '../../contexts/NotificationContext';

const PageAlerts = () => {
  const { pageAlerts, removePageAlert } = useNotification();

  if (pageAlerts.length === 0) {
    return null;
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  return (
    <div className="page-alerts-container mb-3">
      {pageAlerts.map((alert) => (
        <Alert
          key={alert.id}
          color={getAlertColor(alert.type)}
          className="rounded-4 mb-2 d-flex align-items-center justify-content-between"
          fade={false}
        >
          <div className="flex-grow-1">
            {alert.message}
          </div>
          <button
            type="button"
            className="btn-close ms-2"
            onClick={() => removePageAlert(alert.id)}
            aria-label="Close"
          />
        </Alert>
      ))}
    </div>
  );
};

export default PageAlerts;