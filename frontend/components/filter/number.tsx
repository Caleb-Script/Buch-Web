"use client";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { Suchkriterium } from "../../lib/interfaces.js";

export function RatingButtons({
  anzahl,
  name,
  setSelectedValues,
}: {
  name: string;
  anzahl: number;
  setSelectedValues: React.Dispatch<React.SetStateAction<Suchkriterium[]>>;
}) {
  const enumValues = Array.from({ length: anzahl }, (_, index) => index + 1);

  const handleOptionChange = (value: string) => {
    setSelectedValues((prevValues) => [...prevValues, { key: name, value }]);
  };

  const handleOptionChange2 = (value: string) => {
    setSelectedValues((prevValues) => {
      const isChecked = prevValues.some((item) => item.value.includes(value));
      let updatedValues = [...prevValues];

      if (isChecked) {
        updatedValues = updatedValues
          .map((item) => {
            if (item.key === name) {
              const newValues = item.value
                .split(",")
                .filter((v: string) => v !== value);
              return { key: name, value: newValues.join(",") };
            }
            return item;
          })
          .filter((item) => item.value !== "");
      } else {
        const existingValue = updatedValues.find((v) => v.key === name);
        const newValue = existingValue
          ? `${existingValue.value},${value}`
          : value;
        updatedValues = [
          { key: name, value: newValue },
          ...updatedValues.filter((v) => v.key !== name),
        ];
      }

      return updatedValues;
    });
  };

  const handleResetFilter = () => {
    setSelectedValues((prevValues) =>
      prevValues.filter((val) =>
        typeof val === "string"
          ? JSON.parse(val).key !== name
          : val.key !== name
      )
    );

    enumValues.forEach((value) => {
      const radioButton = document.getElementById(
        `${name}:${value}`
      ) as HTMLInputElement;
        console.log(value);
        console.log("ASDADASDASDASD");
      if (radioButton) {
        radioButton.checked = false;
      }
    });
  };

  return (
    <div className="d-flex flex-wrap gap-2" role="group" aria-label="Rating">
      {enumValues.map((value) => (
        <React.Fragment key={value}>
          <input
            type="radio"
            className="btn-check toggle"
            id={`${name}:${value}`}
            name={name}
            value={`${name}:${value}`}
            autoComplete="off"
            onChange={() => handleOptionChange(value.toString())}
          />
          <label
            className="btn btn-outline-danger"
            htmlFor={`${name}:${value}`}
          >
            {value}
          </label>
        </React.Fragment>
      ))}
      <button
        type="button"
        className="btn btn-outline-danger"
        onClick={handleResetFilter}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  );
}
