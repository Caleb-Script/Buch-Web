"use client";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export function BooleanButtons({
  name,
  setSelectedValues,
}: {
  name: string;
  setSelectedValues: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const enumValues = [true, false]; // Für Booleans sind die Werte true und false

  const handleOptionChange = (value: boolean) => {
    setSelectedValues((prevValues) => [...prevValues, { key: name, value }]);
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
      if (radioButton) radioButton.checked = false;
    });
  };

  return (
    <div className="d-flex flex-wrap gap-2" role="group" aria-label="Boolean">
      {enumValues.map((value) => (
        <React.Fragment key={String(value)}>
          <input
            type="radio"
            className="btn-check toggle"
            id={`${name}:${value}`}
            name={name}
            value={`${name}:${value}`}
            autoComplete="off"
            onChange={() => handleOptionChange(value)}
          />
          <label
            className="btn btn-outline-danger"
            htmlFor={`${name}:${value}`}
          >
            {value.toString()}
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
