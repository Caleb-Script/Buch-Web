'use client'
import { Suchkriterium } from "@/lib/interfaces";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { SchlagwortEnum } from "../../lib/enum";

export function EnumButtons({
  enumTyp,
  name,
  setSelectedValues,
}: {
  enumTyp: any;
  name: string;
  setSelectedValues: React.Dispatch<React.SetStateAction<Suchkriterium[]>>;
}) {
  const enumValues = enumTyp ? Object.values(enumTyp) : null;
  const isSchlagwortEnum = enumTyp === SchlagwortEnum;
  
  const handleOptionChange = (value: string) => {
    setSelectedValues((prevValues) => [
      ...prevValues,
      { key: name, value },
    ]);
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
    enumValues?.forEach((value: any) => {
      const radioButton = document.getElementById(
        `${value}`
      ) as HTMLInputElement;
      if (radioButton) radioButton.checked = false;
    });
  };

  return (
    <div
      className={`d-flex flex-wrap gap-2 ${
        isSchlagwortEnum ? "checkbox" : "radio"
      }`}
      role="group"
      aria-label="Basic button toggle group"
    >
      {enumValues &&
        enumValues.map((value: any, index: number) => (
          <React.Fragment key={value}>
            {isSchlagwortEnum ? (
              <>
                <input
                  type="checkbox"
                  className="btn-check"
                  name={name}
                  id={value}
                  autoComplete="off"
                  value={`${name}:${value}`}
                  onChange={() => handleOptionChange2(value)}
                />
                <label className="btn btn-outline-danger" htmlFor={value}>
                  {value}
                </label>
              </>
            ) : (
              <>
                <input
                  type="radio"
                  className="btn-check toggle"
                  id={value}
                  name={name}
                  value={`${name}:${value}`}
                  autoComplete="off"
                  onChange={() => handleOptionChange(value)}
                />
                <label className="btn btn-outline-danger" htmlFor={value}>
                  {value}
                </label>
              </>
            )}
            {index === enumValues.length - 1 && !isSchlagwortEnum && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleResetFilter}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            )}
          </React.Fragment>
        ))}
    </div>
  );
}
