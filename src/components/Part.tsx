import React from "react";

interface PartProps {
  partNumber: string;
  yearStart: number;
  yearEnd: number;
  make: string;
  model: string;
  imageLinks: string[];
}

const Part: React.FC<PartProps> = ({
  partNumber,
  yearStart,
  yearEnd,
  make,
  model,
  imageLinks,
}) => (
  <div className="card mb-3 shadow-sm">
    <div className="card-body">
      <div className="row">
        <div className="col-md-2">
          <h5 className="card-title">{partNumber}</h5>
        </div>
        <div className="col-md-2">
          <p className="card-text">
            <strong>Year Start:</strong> {yearStart}
          </p>
        </div>
        <div className="col-md-2">
          <p className="card-text">
            <strong>Year End:</strong> {yearEnd}
          </p>
        </div>
        <div className="col-md-2">
          <p className="card-text">
            <strong>Make:</strong> {make}
          </p>
        </div>
        <div className="col-md-2">
          <p className="card-text">
            <strong>Model:</strong> {model}
          </p>
        </div>
      </div>
      <div className="row">
        {imageLinks.map((link: string, index: number) => (
          <div key={index} className="col-md-2">
            <img
              src={link}
              alt={`${partNumber} - ${index}`}
              className="img-thumbnail m-1"
              style={{ width: "100px" }}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Part;
