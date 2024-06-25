import React from "react";
import { InputFieldProps } from "../../../lib/interfaces.js";

export function InputField({
    name,
    label,
    type,
    pattern,
    minLength,
    maxLength,
    step,
    min,
    max,
    required,
    defaultValue,
    handleInputBlur,
}: InputFieldProps) {
    return (
        <div className="col form-floating mb-3">
            <input
                type={type}
                className="form-control"
                placeholder={label}
                aria-label={`${label} Input-Feld`}
                name={name}
                pattern={pattern}
                minLength={minLength}
                maxLength={maxLength}
                step={step as string}
                min={min as string}
                max={max as string}
                required={required}
                defaultValue={defaultValue}
                onBlur={handleInputBlur}
                aria-describedby={name}
            />
            <label htmlFor={name}>{label}</label>
            <div id={name} className="invalid-feedback">
                Gib einen gültigen {label} ein
            </div>
            <div className="valid-feedback">passt!</div>
        </div>
    );
}
