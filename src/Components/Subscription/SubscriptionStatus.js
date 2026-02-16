// src/components/Subscription/SubscriptionStatus.js
import React from 'react';
import { useSubscriptionCheck } from '../../hooks/useSubscriptionCheck';
import { Badge, Alert } from 'reactstrap';

export const SubscriptionStatus = () => {
  const { 
    isPaidSubscription, 
    subscriptionModule, 
    subscriptionCategory,
    hasActiveSubscription 
  } = useSubscriptionCheck();

  if (!hasActiveSubscription) {
    return (
      <Alert color="warning" className="mb-3">
        <i className="ri-alarm-warning-line me-2"></i>
        Aucun abonnement actif
      </Alert>
    );
  }

  return (
    <div className="subscription-status d-flex align-items-center gap-2">
      <span>Abonnement :</span>
      <Badge color={isPaidSubscription ? "success" : "secondary"}>
        {subscriptionModule} - {subscriptionCategory}
      </Badge>
      {!isPaidSubscription && (
        <Badge color="warning" className="ms-2">
          Gratuit
        </Badge>
      )}
    </div>
  );
};