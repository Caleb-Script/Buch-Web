"use client";

import React, { useState } from "react";

export default function EnumButtons({
  enumTyp,
  name,
  selectedValues = [],
}: {
  enumTyp: any;
  name: string;
  selectedValues: string[];
}) {
  const [values, setValues] = useState<string[]>(selectedValues);

  const handleCheckboxChange = (value: string) => {
    setValues((prevValues) =>
      prevValues.includes(value)
        ? prevValues.filter((v) => v !== value)
        : [...prevValues, value]
    );
  };

  const isChecked = (value: string): boolean => {
    return values.includes(value);
  };

  return (
    <div className="d-flex gap-5">
      {Object.values(enumTyp).map((option, index) => (
        <React.Fragment key={index}>
          <input
            type="checkbox"
            className="btn-check"
            autoComplete="off"
            id={option as string}
            name={name}
            value={option as string}
            checked={isChecked(option as string)}
            onChange={() => handleCheckboxChange(option as string)}
          />
          <label className="btn btn-outline-danger" htmlFor={option as string}>
            {String(option).replaceAll("_", " ")}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
}
