"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import EnumButtons from "@/components/ButtonGenerator/enumButtonGenerator";
import { createBuch } from "../../api/actions";
import { BuchArtEnum, SchlagwortEnum } from "../../lib/enum";
import { ErrorBannerComponent } from "../ErrorBannerComponent";
import { useRouter } from "next/navigation.js";
import { Button } from "../Button";

export default function CreateBuchFormular() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const currentDate = new Date().toISOString().split("T")[0];
  const [isValid, setValid] = useState(false);
  const initialState = { errors: {}, message: "" };
  const [state, setState] = useState(initialState);
  const [response, setResponse] = useState<string>();
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();

  const handleSetValid = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    setResponse(undefined);
    setError(undefined);

    if (!form.checkValidity()) {
      event.stopPropagation();
    } else {
      form.classList.add("was-validated");
      try {
        const formData = new FormData(form);
        const result = await createBuch(token, formData);
        if (result.message) {
          setResponse(result.message);
          setTimeout(() => {
            router.push("/buecher");
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

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const input = event.currentTarget;
    if (!input.checkValidity()) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
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

  return (
    <Form
      id="buchForm"
      className="pt-4 px-2"
      noValidate
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
                onBlur={handleInputBlur}
                aria-describedby="titelFeedback"
              />
              <label htmlFor="titel">Titel</label>
              <div id="titelFeedback" className="invalid-feedback">
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
                onBlur={handleInputBlur}
                aria-describedby="untertitelFeedback"
              />
              <label htmlFor="untertitel">Untertitel</label>
              <div id="untertitelFeedback" className="invalid-feedback">
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
              onBlur={handleInputBlur}
              aria-describedby="isbnFeedback"
            />
            <label htmlFor="isbn">ISBN</label>
            <div id="isbnFeedback" className="invalid-feedback">
              Gib eine gültige ISBN Nummer ein z.B: 978-3-16-148410-0
            </div>
            <div className="valid-feedback">passt!</div>
          </div>

          <div className="row">
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
                onBlur={handleInputBlur}
                aria-describedby="preisFeedback"
              />
              <label htmlFor="preis">Preis</label>
              <div id="preisFeedback" className="invalid-feedback">
                Gib einen gültigen Preis ein
              </div>
              <div className="valid-feedback">passt!</div>
            </div>

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
                onBlur={handleInputBlur}
                aria-describedby="rabattFeedback"
              />
              <label htmlFor="rabatt">Rabatt</label>
              <div id="rabattFeedback" className="invalid-feedback">
                Gib einen gültigen Rabatt ein
              </div>
              <div className="valid-feedback">passt!</div>
            </div>

            <div className="col-auto form-floating mb-3">
              <input
                type="date"
                aria-label="Erscheinungsdatum Input-Feld"
                className="form-control"
                name="datum"
                required
                max={currentDate}
                onBlur={handleInputBlur}
                aria-describedby="datumFeedback"
              />
              <label htmlFor="datum">Erscheinungsdatum</label>
              <div id="datumFeedback" className="invalid-feedback">Gib ein gültiges Datum ein</div>
              <div className="valid-feedback">passt!</div>
            </div>

            <div className="col-auto form-floating mb-3">
              <input
                type="text"
                aria-label="Homepage Input-Feld"
                className="form-control"
                name="homepage"
                placeholder="Homepage"
                pattern="^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$"
                required
                onBlur={handleInputBlur}
                aria-describedby="homepageFeedback"
              />
              <label htmlFor="homepage">Homepage</label>
              <div id="homepageFeedback" className="invalid-feedback">Gib eine gültige URL ein</div>
              <div className="valid-feedback">passt!</div>
            </div>
          </div>
        </fieldset>

        <fieldset className="d-flex gap-5">
          <div className="mb-4 w-50">
            <select
              id="buchart"
              name="buchart"
              className="form-select"
              aria-label="buchart Select-feld"
              required
              onBlur={handleInputBlur}
              aria-describedby="buchartFeedback"
            >
              <option value="" disabled hidden>
                Buchart
              </option>
              <option value={BuchArtEnum.KINDLE}>Kindle</option>
              <option value={BuchArtEnum.DRUCKAUSGABE}>Druckausgabe</option>
            </select>
            <label htmlFor="floatingSelectDisabled">
    Buchart</label>
            <div id="buchartFeedback" className="invalid-feedback">
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
              value="true"
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
              <EnumButtons enumTyp={SchlagwortEnum}
                name={"schlagwoerter"}
                selectedValues={[]}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
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
      {response ? (
        <div className="alert alert-success" role="alert">
          Buch: {response} wurde erfolgreich angelegt!
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