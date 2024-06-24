"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../button/button";
import { BuchFormular } from "@/lib/formulare";
import { BuchArtEnum, SchlagwortEnum } from "../../lib/enum";
import EnumButtons from "@/components/ButtonGenerator/enumButtonGenerator";
import { Form } from "react-bootstrap";
import { updateBuch } from "../../api/actions";
import { useRouter } from "next/navigation.js";
import { ErrorBannerComponent } from "../ErrorBannerComponent";

export default function UpdateBuchFormular({ buch }: { buch: BuchFormular }) {
  const [state, setState] = useState({ message: "", errors: {} });
  const token = localStorage.getItem("token");
  const router = useRouter();
  const currentDate = new Date().toISOString().split("T")[0];
  const [isValid, setValid] = useState(false);
  const initialState = { errors: {}, message: "" };
  const [response, setResponse] = useState<string>();
  const [error, setError] = useState<string | undefined>(undefined);

  const rabattNumber = parseFloat(buch.rabatt.replace("%", ""));

  const handleSetValid = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    setResponse(undefined);
    setError(undefined);

    if (!form.checkValidity()) {
      event.stopPropagation();
    } else {
      try {
        const formData = new FormData(form);
        const result = await updateBuch(
          buch.id,
          buch.version,
          token,
          formData
        );
        if (result.message) {
          setResponse(result.message);
          setTimeout(() => {
            router.push(`/buecher/${buch.id}`);
            router.refresh();
          }, 2000);
        } else if (result.errors) {
          setState((prevState) => ({
            ...prevState,
            errors: result.errors,
          }));
        }
      } catch (error) {
        setError((error as Error).message);
      }
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
  }, []);

  const handleInputBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const input = event.currentTarget;
    if (!input.checkValidity()) {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    } else {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    }
  };

  return (
    <Form
      id="buchForm"
      className="pt-4 px-2"
      noValidate
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
              onBlur={handleInputBlur}
              aria-describedby="isbnFeedback"
            />
            <label htmlFor="isbn">ISBN</label>
            <div id="isbnFeedback" className="invalid-feedback">
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
              onBlur={handleInputBlur}
              aria-describedby="preisFeedback"
            />
            <span className="input-group-text">€</span>
            <label htmlFor="preis">Preis</label>
            <div id="preisFeedback" className="invalid-feedback">
              Gib einen gültigen Preis ein
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
              onBlur={handleInputBlur}
              aria-describedby="rabattFeedback"
            />
            <span className="input-group-text">%</span>
            <label htmlFor="rabatt">Rabatt</label>
            <div id="rabattFeedback" className="invalid-feedback">
              Gib einen gültigen Rabatt ein
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
              onBlur={handleInputBlur}
              aria-describedby="homepageFeedback"
            />
            <label htmlFor="homepage">Homepage</label>
            <div id="homepageFeedback" className="invalid-feedback">
              Gib eine gültige Homepage-URL ein
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
            onBlur={handleInputBlur}
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
                onBlur={handleInputBlur}
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
                Lieferbar?
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
      {response ? (
        <div className="alert alert-success" role="alert">
          Buch: {response} wurde erfolgreich aktualisiert!
        </div>
      ) : null}
      {error ? (
        <div>
          <ErrorBannerComponent message={error} />
        </div>
      ) : null}
    </Form>
  );
}
