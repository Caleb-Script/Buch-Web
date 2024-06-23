"use client";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Suchkriterium } from "../../lib/interfaces.js";

export function TextInput({
  name,
  setSelectedValues,
}: {
  name: string;
  setSelectedValues: React.Dispatch<React.SetStateAction<Suchkriterium[]>>;
}) {
  const [textInputValue, setTextInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextInputValue(event.target.value);
  };

  const handleAddFilter = () => {
    setSelectedValues((prevValues) => [
      ...prevValues,
      { key: name, value: textInputValue },
    ]);
    //setTextInputValue("");
  };

  const handleResetFilter = () => {
    setSelectedValues((prevValues) =>
      prevValues.filter((val) => val.key !== name)
    );
    setTextInputValue("");
  };

  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder={`Filter nach ${name}`}
        value={textInputValue}
        onChange={handleInputChange}
      />
      <button
        className="btn btn-outline-danger"
        type="button"
        onClick={handleAddFilter}
      >
        Hinzufügen
      </button>
      <button
        className="btn btn-outline-danger"
        type="button"
        onClick={handleResetFilter}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  );
}
