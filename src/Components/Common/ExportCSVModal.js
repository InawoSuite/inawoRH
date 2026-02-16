// import PropTypes from "prop-types";
// import React from "react";
// import { Modal, ModalBody, ModalHeader } from "reactstrap";
// import { CSVLink } from "react-csv";

// const ExportCSVModal = ({ show, onCloseClick, data }) => {
//   return (
//     <Modal isOpen={show} toggle={onCloseClick} centered={true} classnames="custom-rounded-modal">
//         <ModalHeader toggle={onCloseClick}></ModalHeader>
//           <ModalBody className="py-3 px-5">
//           <div className="mt-2 text-center">
//               <lord-icon
//                   src="https://cdn.lordicon.com/nocovwne.json"
//                   trigger="loop"
//                   colors="primary:#0ab39c,secondary:#f06548"
//                   style={{ width: "100px", height: "100px" }}
//               >
//               </lord-icon>
//               <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
//                   <h4>Etes-vous sûre ?</h4>
//                   <p className="text-muted mx-4 mb-0">
//                       Etes-vous sûre de vouloir exporter ce fichier ?
//                   </p>
//                   </div>
//               </div>
//               <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
//               <button
//                   type="button"
//                   className="btn w-sm btn-light rounded-pill"
//                   data-bs-dismiss="modal"
//                   onClick={onCloseClick}
//               >
//                   Fermer
//               </button>
//               <CSVLink
//                   data={data}
//                   type="button"
//                   onClick={onCloseClick}
//                   className="btn w-sm btn-success rounded-pill"
//                   id="delete-record"
//               >
//                Télécharger
//               </CSVLink>
//               </div>
//       </ModalBody>
//     </Modal>
//   );
// };

// ExportCSVModal.propTypes = {
//   onCloseClick: PropTypes.func,
//   data: PropTypes.any,
//   show: PropTypes.any,
// };

// export default ExportCSVModal;

import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { CSVLink } from "react-csv";

const ExportCSVModal = ({ show, onCloseClick, data }) => {
  return (
    <Modal 
      isOpen={show} 
      toggle={onCloseClick} 
      centered={true}
      className="custom-rounded-modal" // Ajoutez cette classe
      contentClassName="rounded-20" // Ajoutez cette classe pour le contenu
    >
      <ModalHeader 
        toggle={onCloseClick}
        className="rounded-top-20" // Arrondi pour le header
        style={{ borderBottom: 'none' }}
      ></ModalHeader>
      <ModalBody className="py-3 px-5 rounded-bottom-20"> {/* Arrondi pour le body */}
        <div className="mt-2 text-center">
          <lord-icon
            src="https://cdn.lordicon.com/nocovwne.json"
            trigger="loop"
            colors="primary:#0ab39c,secondary:#f06548"
            style={{ width: "100px", height: "100px" }}
          >
          </lord-icon>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>Etes-vous sûre ?</h4>
            <p className="text-muted mx-4 mb-0">
              Etes-vous sûre de vouloir exporter ce fichier ?
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
            Fermer
          </button>
          <CSVLink
            data={data}
            type="button"
            onClick={onCloseClick}
            className="btn w-sm btn-success rounded-pill"
            id="delete-record"
          >
            Télécharger
          </CSVLink>
        </div>
      </ModalBody>
    </Modal>
  );
};

ExportCSVModal.propTypes = {
  onCloseClick: PropTypes.func,
  data: PropTypes.any,
  show: PropTypes.any,
};

export default ExportCSVModal;