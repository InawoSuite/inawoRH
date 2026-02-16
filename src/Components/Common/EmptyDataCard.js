import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

const EmptyDataCard = ({
  iconSrc = "https://cdn.lordicon.com/msoeawqm.json",
  iconColors = "primary:#405189,secondary:#0ab39c",
  iconSize = { width: "72px", height: "72px" },
  title,
  description,
  actionButton = null,
  cardStyle = { borderRadius: "20px" },
  className = ""
}) => {
  return (
    <Card style={cardStyle} className={className}>
      <CardBody>
        <div className="py-4 text-center">
          <div>
            <lord-icon
              src={iconSrc}
              trigger="loop"
              colors={iconColors}
              style={iconSize}
            ></lord-icon>
          </div>
          <div className="mt-4">
            <h5>{title}</h5>
            <p className="text-muted">{description}</p>
            {actionButton && actionButton}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default EmptyDataCard;