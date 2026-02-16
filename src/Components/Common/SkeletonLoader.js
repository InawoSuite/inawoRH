import React, { memo } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';

/**
 * Composant Skeleton pour l'affichage pendant le chargement
 * Améliore l'expérience utilisateur en montrant un placeholder
 */

// Styles d'animation
const skeletonStyles = `
  @keyframes skeleton-loading {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
  
  .skeleton {
    background: linear-gradient(
      90deg,
      #f0f0f0 0px,
      #e0e0e0 40px,
      #f0f0f0 80px
    );
    background-size: 200px 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: 4px;
  }
  
  .skeleton-circle {
    border-radius: 50%;
  }
  
  .skeleton-text {
    height: 12px;
    margin-bottom: 8px;
  }
  
  .skeleton-title {
    height: 16px;
    margin-bottom: 12px;
  }
`;

// Injecter les styles une seule fois
if (typeof document !== 'undefined') {
  const styleId = 'skeleton-styles';
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = skeletonStyles;
    document.head.appendChild(styleElement);
  }
}

/**
 * Skeleton de base
 */
export const Skeleton = memo(({ 
  width = '100%', 
  height = '16px', 
  circle = false,
  className = '',
  style = {},
}) => (
  <div
    className={`skeleton ${circle ? 'skeleton-circle' : ''} ${className}`}
    style={{
      width,
      height: circle ? width : height,
      ...style,
    }}
  />
));

Skeleton.displayName = 'Skeleton';

/**
 * Skeleton pour une carte utilisateur
 */
export const UserCardSkeleton = memo(() => (
  <Col md={6} lg={4} xl={3} className="mb-4">
    <Card className="team-box" style={{ borderRadius: 8 }}>
      {/* Cover image skeleton */}
      <Skeleton height="100px" style={{ borderRadius: '8px 8px 0 0' }} />
      
      <CardBody className="p-4">
        <div className="team-profile-img">
          {/* Avatar skeleton */}
          <div className="avatar-lg mx-auto mb-3">
            <Skeleton circle width="80px" height="80px" />
          </div>
          
          {/* Content skeleton */}
          <div className="team-content text-center">
            <Skeleton height="16px" width="70%" className="mx-auto mb-2" />
            <Skeleton height="12px" width="50%" className="mx-auto mb-2" />
            <Skeleton height="12px" width="60%" className="mx-auto mb-2" />
            <Skeleton height="12px" width="80%" className="mx-auto" />
          </div>
        </div>
      </CardBody>
    </Card>
  </Col>
));

UserCardSkeleton.displayName = 'UserCardSkeleton';

/**
 * Grille de skeletons pour utilisateurs
 */
export const UserGridSkeleton = memo(({ count = 8 }) => (
  <Row className="team-list grid-view-filter">
    {Array.from({ length: count }).map((_, index) => (
      <UserCardSkeleton key={index} />
    ))}
  </Row>
));

UserGridSkeleton.displayName = 'UserGridSkeleton';

/**
 * Skeleton pour une ligne de tableau
 */
export const TableRowSkeleton = memo(({ columns = 5 }) => (
  <tr>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index}>
        <Skeleton height="16px" width={`${70 + Math.random() * 30}%`} />
      </td>
    ))}
  </tr>
));

TableRowSkeleton.displayName = 'TableRowSkeleton';

/**
 * Skeleton pour un tableau
 */
export const TableSkeleton = memo(({ rows = 5, columns = 5 }) => (
  <tbody>
    {Array.from({ length: rows }).map((_, index) => (
      <TableRowSkeleton key={index} columns={columns} />
    ))}
  </tbody>
));

TableSkeleton.displayName = 'TableSkeleton';

/**
 * Skeleton pour un formulaire
 */
export const FormSkeleton = memo(({ fields = 4 }) => (
  <div className="p-3">
    {Array.from({ length: fields }).map((_, index) => (
      <div key={index} className="mb-3">
        <Skeleton height="12px" width="30%" className="mb-2" />
        <Skeleton height="38px" width="100%" />
      </div>
    ))}
    <div className="d-flex justify-content-end gap-2 mt-4">
      <Skeleton height="38px" width="100px" />
      <Skeleton height="38px" width="120px" />
    </div>
  </div>
));

FormSkeleton.displayName = 'FormSkeleton';

/**
 * Skeleton pour une page de dashboard
 */
export const DashboardSkeleton = memo(() => (
  <div>
    {/* Stats cards */}
    <Row className="mb-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Col key={index} md={3}>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <div style={{ width: '70%' }}>
                  <Skeleton height="12px" width="60%" className="mb-2" />
                  <Skeleton height="24px" width="40%" />
                </div>
                <Skeleton circle width="48px" height="48px" />
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
    
    {/* Chart area */}
    <Row>
      <Col md={8}>
        <Card>
          <CardBody>
            <Skeleton height="12px" width="30%" className="mb-3" />
            <Skeleton height="300px" width="100%" />
          </CardBody>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <CardBody>
            <Skeleton height="12px" width="40%" className="mb-3" />
            <Skeleton height="200px" width="100%" />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </div>
));

DashboardSkeleton.displayName = 'DashboardSkeleton';

/**
 * Skeleton pour les détails d'un élément
 */
export const DetailsSkeleton = memo(() => (
  <Card>
    <CardBody>
      <div className="d-flex align-items-center mb-4">
        <Skeleton circle width="64px" height="64px" />
        <div className="ms-3" style={{ flex: 1 }}>
          <Skeleton height="20px" width="40%" className="mb-2" />
          <Skeleton height="14px" width="60%" />
        </div>
      </div>
      
      <Row>
        {Array.from({ length: 6 }).map((_, index) => (
          <Col key={index} md={6} className="mb-3">
            <Skeleton height="12px" width="30%" className="mb-1" />
            <Skeleton height="16px" width="70%" />
          </Col>
        ))}
      </Row>
    </CardBody>
  </Card>
));

DetailsSkeleton.displayName = 'DetailsSkeleton';

export default {
  Skeleton,
  UserCardSkeleton,
  UserGridSkeleton,
  TableRowSkeleton,
  TableSkeleton,
  FormSkeleton,
  DashboardSkeleton,
  DetailsSkeleton,
};
