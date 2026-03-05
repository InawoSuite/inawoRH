import styles from "./DeleteModal.module.css";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody } from "reactstrap";

const DeleteModal = ({ show, onDeleteClick, onCloseClick }) => {
  const { t } = useTranslation(); 

  return (
  <Modal fade={true} isOpen={show} toggle={onCloseClick} centered={true} contentClassName="custom-rounded-modal">
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center ">
          <lord-icon
            src="https://cdn.lordicon.com/gsqxdxog.json"
            trigger="loop"
            colors="primary:#f7b84b,secondary:#f06548"
            style={{ width: "100px", height: "100px" }}
          ></lord-icon>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>{t('Êtes-vous sûr ?')}</h4>
            <p className="text-muted mx-4 mb-0">
               {t('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')}
            </p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn w-sm btn-light rounded-pill"
            data-bs-dismiss="modal"
            onClick={onCloseClick}
          >
            {t('Fermer')}
          </button>
          <button
            type="button"
            className="btn w-sm btn-danger rounded-pill"
            id="delete-record"
            onClick={onDeleteClick}
          >
            {t('Oui, supprimez-le !!')}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

DeleteModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any,
};

export default DeleteModal;