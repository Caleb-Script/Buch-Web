import React from "react";
import { SelectFieldProps } from "../../../lib/interfaces.js";

export function SelectField({
    name,
    label,
    options,
    required,
    defaultValue,
    handleInputBlur,
}: SelectFieldProps) {
    return (
        <div className="mb-4 w-50">
            <select
                id={name}
                name={name}
                className="form-select"
                aria-label={`${label} Select-Feld`}
                required={required}
                defaultValue={defaultValue}
                onBlur={handleInputBlur}
                aria-describedby={name}
            >
                <option value="" disabled hidden>
                    {label}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <label htmlFor={name}>{label}</label>
            <div id={name} className="invalid-feedback">
                Wähle eine gültige {label} aus
            </div>
            <div className="valid-feedback">passt!</div>
        </div>
    );
}
