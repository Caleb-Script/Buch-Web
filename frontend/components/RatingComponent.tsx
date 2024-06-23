import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

type PropsRating = {
  stars: number;
  maxValue: number;
};

export function RatingComponent({ stars, maxValue }: PropsRating) {
  return (
    <div className="d-flex">
      {Array.from(Array(maxValue).keys()).map((v, index) => (
        <FontAwesomeIcon
          key={index}
          icon={faStar}
          className={index < stars ? "text-warning" : "text-secondary"}
        />
      ))}
    </div>
  );
}
