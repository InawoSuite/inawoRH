import React from 'react';


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="d-flex justify-content-end mt-3">
      <nav>
        <ul className="pagination pagination-rounded">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
              <i className="mdi mdi-chevron-left"></i>
            </button>
          </li>
          
          {[...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
              <i className="mdi mdi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;