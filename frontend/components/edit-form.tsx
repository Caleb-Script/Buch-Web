"use client";

import Link from "next/link";

import { useFormState } from "react-dom";
import { Button } from "./button";
import { BuchFormular } from "@/lib/formulare";
import { BuchArtEnum, SchlagwortEnum } from "../lib/enum";
import EnumButtons from "@/components/enumButtonGenerator";
import { Form } from "react-bootstrap";
import { updateBuch } from "../api/actions";

export default function UpdateBuchFormular({ buch }: { buch: BuchFormular }) {
  const token = localStorage.getItem("token");
  const initialState = { message: "", errors: {} };
  const updateBuchMitId = updateBuch.bind(null, buch.id, buch.version,token);
  const [state, update] = useFormState(updateBuchMitId, initialState);

  const rabattNumber = parseFloat(buch.rabatt.replace("%", ""));

  const handleSetValid = async (event: any) => {
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      try {
        const token = localStorage.getItem("token");
        form.classList.add("was-validated");
        await update(form);
      } catch (err) {
        console.error(err);
        alert("Nicht Ordnung!");
      }
    }
  };

  return (
    <Form
      action={update}
      id="customerForm"
      className="pt-4 px-2"
      noValidate
      validated={true}
      onSubmit={handleSetValid}
    >
      <div className="rounded bg-body-tertiary px-4 py-1 pt-4">
        <fieldset>
          <legend className="mb-2 d-block text-sm font-sm">
            {buch.titel.titel}
          </legend>

          <div className="form-floating my-3">
            <input
              type="text"
              aria-label="isbn"
              id="isbn"
              name="isbn"
              className="form-control"
              defaultValue={buch.isbn}
              pattern="^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$"
              required
            />
            <label htmlFor="isbn">ISBN</label>
            <div className="invalid-feedback">
              Gib eine gültige ISBN Nummer ein
            </div>
            <div className="valid-feedback">passt!</div>
          </div>

          <div className="input-group form-floating my-3">
            <input
              type="number"
              aria-label="preis"
              id="preis"
              step="0.01"
              name="preis"
              className="form-control"
              defaultValue={buch.preis}
              required
            />
            <span className="input-group-text">€</span>
            <label htmlFor="preis">Preis</label>
            <div className="invalid-feedback">
              Gib eine gültige ISBN Nummer ein
            </div>
            <div className="valid-feedback">passt!</div>
          </div>

          <div className="input-group form-floating my-3">
            <input
              type="number"
              className="form-control"
              id="rabatt"
              aria-label="rabatt"
              name="rabatt"
              step="0.01"
              defaultValue={rabattNumber}
              required
            />
            <span className="input-group-text">%</span>
            <label htmlFor="rabatt">Rabatt</label>
            <div className="invalid-feedback">
              Gib eine gültige ISBN Nummer ein
            </div>
            <div className="valid-feedback">passt!</div>
          </div>

          <div className="form-floating my-3">
            <input
              type="text"
              className="form-control"
              id="homepage"
              aria-label="homepage"
              name="homepage"
              defaultValue={buch.homepage}
              required
            />
            <div className="invalid-feedback">
              Gib eine gültige ISBN Nummer ein
            </div>
            <div className="valid-feedback">passt!</div>
          </div>

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
            defaultValue={buch.rating}
            required
          ></input>

          {/* Select buttons */}
          <div className="input-group d-flex justify-content-between px-4 py-2">
            <div className="mb-4">
              <select
                id="buchart"
                name="buchart"
                className="form-select"
                aria-label="buchart"
                defaultValue={buch.art}
              >
                <option value={BuchArtEnum.KINDLE}>Kindle</option>
                <option value={BuchArtEnum.DRUCKAUSGABE}>Druckausgabe</option>
              </select>
            </div>

            {/* Schlagwörter */}
            <div className="d-flex justify-content-between gap-5">
              <EnumButtons
                enumTyp={SchlagwortEnum}
                name={"schlagwoerter"}
                selectedValues={buch.schlagwoerter}
              />
            </div>

            {/* Hat Newsletter */}
            <div>
              <input
                type="checkbox"
                className="btn-check"
                id="lieferbar"
                name="lieferbar"
                value={buch.lieferbar as unknown as string}
                autoComplete="off"
                defaultChecked={buch.lieferbar}
              />
              <label className="btn btn-outline-danger" htmlFor="lieferbar">
                lieferbar?
              </label>
            </div>
          </div>
        </fieldset>

        {/* Buttons */}
        <div className="mt-6 d-flex justify-content-end gap-4">
          <Link
            href="/buecher"
            className="d-flex align-items-center rounded bg-secondary-subtle px-4 text-sm font-medium text-dark h-10"
          >
            Abbrechen
          </Link>
          <Button type="submit">Speichern</Button>
        </div>
      </div>
    </Form>
  );
}
