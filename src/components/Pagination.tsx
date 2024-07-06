import React from "react";

interface PaginationProps {
  totalPages: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
  maxVisibleButtons?: number; // Optional prop to limit visible buttons
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  paginate,
  currentPage,
  maxVisibleButtons = 5,
}) => {
  const pageNumbers = [];

  // Calculate start and end page numbers for pagination
  const halfVisible = Math.floor(maxVisibleButtons / 2);
  let startPage = Math.max(currentPage - halfVisible, 1);
  let endPage = Math.min(currentPage + halfVisible, totalPages);

  if (currentPage <= halfVisible) {
    endPage = Math.min(maxVisibleButtons, totalPages);
  } else if (currentPage + halfVisible >= totalPages) {
    startPage = Math.max(totalPages - maxVisibleButtons + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="d-flex justify-content-center mt-4">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => paginate(1)}>
            First
          </button>
        </li>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => paginate(currentPage - 1)}
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => paginate(currentPage + 1)}
          >
            Next
          </button>
        </li>
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button className="page-link" onClick={() => paginate(totalPages)}>
            Last
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
