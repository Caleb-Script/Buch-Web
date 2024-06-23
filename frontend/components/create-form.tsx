"use client";

import Link from "next/link";
import { Button } from "@/components/button";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import React from "react";
import { useFormState } from "react-dom";
import EnumButtons from "@/components/enumButtonGenerator";
import { createBuch } from "../api/actions";
import { BuchArtEnum, SchlagwortEnum } from "../lib/enum";

export default function CreateBuchFormular() {
  const token = localStorage.getItem("token");
  const currentDate = new Date().toISOString().split("T")[0];
  const [isValid, setValid] = useState(false);
  const initialState = { errors: {}, message: "" };
  const createBuchState = createBuch.bind(null, token);
  const [state, create] = useFormState(createBuchState, initialState);

  const handleSetValid = async (event: any) => {
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      form.classList.add("was-validated");
      create(form);
    }
  };

  useEffect(() => {
    const form = document.getElementById("buchForm") as HTMLFormElement;
    const handleFormChange = () => {
      if (form && form.checkValidity()) {
        setValid(true);
      } else {
        setValid(false);
      }
    };

    form.addEventListener("change", handleFormChange);

    return () => {
      form.removeEventListener("change", handleFormChange);
    };
  }, [isValid]);

  return (
    <Form
      action={create}
      id="buchForm"
      className="pt-4 px-2"
      noValidate
      validated={true}
      onSubmit={handleSetValid}
    >
      <div className="rounded bg-body-tertiary px-4 py-1 pt-4">
        <fieldset>
          <legend>Buch Anlegen</legend>

          <div className="row">
            <div className="col form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Titel"
                aria-label="Titel Input-Feld"
                name="titel"
                required
                pattern="[A-Za-z]+"
                minLength={3}
                maxLength={20}
              />
              <label htmlFor="titel">Titel</label>
              <div className="invalid-feedback">
                Gib einen gültigen Titel ein
              </div>
              <div className="valid-feedback">passt!</div>
            </div>

            <div className="col form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Untertitel"
                aria-label="Untertitel Input-Feld"
                name="untertitel"
                pattern="[A-Za-z]+"
                minLength={3}
                maxLength={20}
                required
              />
              <label htmlFor="untertitel">Untertitel</label>
              <div className="invalid-feedback">
                Gib einen gültigen Untertitel ein
              </div>
              <div className="valid-feedback">passt!</div>
            </div>
          </div>

          <div className="form-floating my-3">
            <input
              type="text"
              aria-label="isbn"
              id="isbn"
              name="isbn"
              placeholder="ISBN"
              className="form-control"
              pattern="^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$"
              required
            />
            <label htmlFor="isbn">ISBN</label>
            <div className="invalid-feedback">
              Gib eine gültige ISBN Nummer ein z.B: 978-3-16-148410-0
            </div>
            <div className="valid-feedback">passt!</div>
          </div>

          <div className="row">
            {/* Preis */}
            <div className="col form-floating">
              <input
                type="number"
                aria-label="Preis Input-Feld"
                placeholder="Preis"
                name="preis"
                className="form-control"
                step={0.01}
                min={0}
                required
              />
              <label htmlFor="preis">Preis</label>
              <div className="invalid-feedback">
                Gib einen gültigen Preis ein
              </div>
              <div className="valid-feedback">passt!</div>
            </div>

            {/* Rabatt */}
            <div className="col form-floating">
              <input
                type="number"
                className="form-control"
                id="rabatt"
                name="rabatt"
                placeholder="Gib den Rabatt ein..."
                step="0.01"
                min={0}
                max={100}
                required
              />
              <label htmlFor="rabatt">Rabatt</label>
              <div className="invalid-feedback">
                Gib einen gültigen Rabatt ein
              </div>
              <div className="valid-feedback">passt!</div>
            </div>

            {/* Datum */}
            <div className="col-auto form-floating mb-3">
              <input
                type="date"
                aria-label="Erscheinungsdatum Input-Feld"
                className="form-control"
                name="datum"
                required
                max={currentDate}
              />
              <label htmlFor="datum">Erscheinungsdatum</label>
              <div className="invalid-feedback">Gib ein gültiges Datum ein</div>
              <div className="valid-feedback">passt!</div>
            </div>

            <div className="col-auto form-floating mb-3">
              <input
                type="text"
                aria-label="Homepage Input-Feld"
                className="form-control"
                name="homepage"
                placeholder="Homepage"
                pattern="/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/"
                required
              />
              <label htmlFor="homepage">Homepage</label>
              <div className="invalid-feedback">Gib eine gültige URL ein</div>
              <div className="valid-feedback">passt!</div>
            </div>
          </div>
        </fieldset>

        <fieldset className="d-flex gap-5">
          {/* Buchart */}
          <div className="mb-4 w-50">
            <select
              id="buchart"
              name="buchart"
              className="form-select"
              aria-label="buchart Select-feld"
              required
            >
              <option value="" disabled hidden>
                Buchart
              </option>
              <option value={BuchArtEnum.KINDLE}>Kindle</option>
              <option value={BuchArtEnum.DRUCKAUSGABE}>Druckausgabe</option>
            </select>
            <label htmlFor="floatingSelectDisabled">Buchart</label>
            <div className="invalid-feedback">
              Wähle eine gültige Buchart aus
            </div>
            <div className="valid-feedback">passt!</div>
          </div>

          <div className="col-auto">
            <input
              type="checkbox"
              className="btn-check"
              id="lieferbar"
              name="lieferbar"
              value="false"
              autoComplete="off"
            />
            <label className="btn btn-outline-danger" htmlFor="lieferbar">
              Ist es Lieferbar?
            </label>
          </div>
        </fieldset>

        <fieldset className="">
          <legend>Schlagwörter</legend>
          <div className="">
            <div className="form-floating">
              <EnumButtons
                enumTyp={SchlagwortEnum}
                name={"schlagwoerter"}
                selectedValues={[]}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          {/* Rating */}
          <label htmlFor="customRange2" className="form-label">
            Rating
          </label>
          <input
            type="range"
            className="form-range"
            min="0"
            max="5"
            id="rating"
            aria-label="rating"
            name="rating"
            required
          />
        </fieldset>

        <div className="mt-6 d-flex justify-content-end gap-4">
          <Link
            href="/buecher"
            className="d-flex align-items-center rounded bg-secondary-subtle px-4 text-sm font-medium text-dark h-10"
          >
            Cancel
          </Link>
          <Button type="submit" disabled={!isValid}>
            Buch anlegen
          </Button>
        </div>
      </div>
    </Form>
  );
}
