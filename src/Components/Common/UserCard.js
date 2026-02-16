import React, { memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Col,
  Badge,
  Spinner,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { ShowIf } from '../Permissions/WithPermission';
import smallImage9 from '../../assets/images/small/img-9.jpg';
import dummyUser from '../../assets/images/users/user-dummy-img.jpg';
import { BaseUrl } from '../../pages/APIKey/ApiKey';

/**
 * Composant de carte utilisateur optimisé avec React.memo
 * Évite les re-renders inutiles quand les props n'ont pas changé
 */
const UserCard = memo(({ 
  user, 
  actionLoading, 
  canManagePermissions, 
  onSuspend, 
  onEditPermissions 
}) => {
  const navigate = useNavigate();

  const handleViewUser = useCallback(() => {
    navigate(`/detail-collaborateur/${user.id}`);
  }, [navigate, user.id]);

  const handleEditPermissions = useCallback(() => {
    onEditPermissions(user);
  }, [onEditPermissions, user]);

  const handleSuspend = useCallback(() => {
    onSuspend(user.id, user.suspendu);
  }, [onSuspend, user.id, user.suspendu]);

  // Gestion de l'erreur d'image avec callback memoized
  const handleImageError = useCallback((e) => {
    e.target.onerror = null;
    e.target.src = dummyUser;
  }, []);

  return (
    <Col md={6} lg={4} xl={3} className="mb-4">
      <Card
        className="team-box h-100"
        style={{
          borderRadius: 8,
          border: user.suspendu ? '2px solid #f06548' : 'none',
          opacity: user.suspendu ? 0.7 : 1,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <div className="team-cover position-relative">
          <img
            src={user.backgroundImg || smallImage9}
            alt=""
            className="img-fluid"
            loading="lazy" // Lazy loading natif
            style={{
              height: '100px',
              objectFit: 'cover',
              width: '100%',
            }}
          />
          
          {user.suspendu && (
            <div className="position-absolute top-0 start-0 p-2">
              <Badge color="danger">Suspendu</Badge>
            </div>
          )}
          
          <div
            className="position-absolute"
            style={{ top: '10px', right: '10px', zIndex: 2 }}
          >
            <UncontrolledDropdown>
              <DropdownToggle
                tag="button"
                className="btn btn-icon btn-sm btn-light rounded-circle"
                role="button"
                disabled={actionLoading}
                style={{
                  border: 'none',
                  width: '32px',
                  height: '32px',
                }}
              >
                {actionLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <i className="ri-more-fill fs-16"></i>
                )}
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem onClick={handleViewUser}>
                  <i className="ri-eye-line me-2 align-middle text-muted"></i>
                  Voir
                </DropdownItem>

                <ShowIf condition={canManagePermissions}>
                  <DropdownItem onClick={handleEditPermissions}>
                    <i className="ri-pencil-line me-2 align-middle text-muted"></i>
                    Modifier permissions
                  </DropdownItem>
                </ShowIf>

                <DropdownItem
                  onClick={handleSuspend}
                  className={user.suspendu ? 'text-success' : 'text-warning'}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Spinner size="sm" className="me-2" />
                  ) : (
                    <i
                      className={`ri-user-${
                        user.suspendu ? 'follow' : 'unfollow'
                      }-line me-2 align-middle`}
                    ></i>
                  )}
                  {user.suspendu ? 'Réactiver' : 'Suspendre'}
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
        
        <CardBody className="p-4">
          <div className="team-profile-img">
            <div className="avatar-lg mx-auto mb-3">
              <img
                src={
                  user.photo && user.id
                    ? `${BaseUrl}/utilisateurs/getuser/${user.id}`
                    : dummyUser
                }
                onError={handleImageError}
                alt={`${user.nom} ${user.prenom}`}
                className="img-thumbnail rounded-circle"
                loading="lazy"
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                }}
              />
            </div>
            
            <div className="team-content text-center">
              <h5 className="fs-16 mb-1">
                <Link
                  to={`/detail-collaborateur/${user.id}`}
                  className="text-decoration-none text-dark user-card-link"
                >
                  {user.nom} {user.prenom}
                </Link>
                {user.suspendu && (
                  <Badge color="danger" className="ms-2">
                    Suspendu
                  </Badge>
                )}
              </h5>
              <p className="text-muted mb-2">
                {user.type_utilisateur || 'Néant'}
              </p>
              <p className="text-muted mb-2">
                {user.fonction || 'Non spécifié'}
              </p>
              <p className="text-muted mb-0 text-truncate" title={user.email}>
                <i className="ri-mail-line me-1"></i>
                {user.email}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
}, (prevProps, nextProps) => {
  // Comparaison personnalisée pour éviter les re-renders inutiles
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.suspendu === nextProps.user.suspendu &&
    prevProps.user.nom === nextProps.user.nom &&
    prevProps.user.prenom === nextProps.user.prenom &&
    prevProps.user.email === nextProps.user.email &&
    prevProps.user.fonction === nextProps.user.fonction &&
    prevProps.user.type_utilisateur === nextProps.user.type_utilisateur &&
    prevProps.actionLoading === nextProps.actionLoading &&
    prevProps.canManagePermissions === nextProps.canManagePermissions
  );
});

UserCard.displayName = 'UserCard';

export default UserCard;
