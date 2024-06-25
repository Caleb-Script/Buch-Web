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
import { InputField } from "./field/InputField";
import { SelectField } from "./field/SelectField";
import { RatingComponent } from "../RatingComponent";

export default function CreateBuchFormular() {
    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const currentDate = new Date().toISOString().split("T")[0];
    const [isValid, setValid] = useState(false);
    const initialState = { errors: {}, message: "" };
    const [state, setState] = useState(initialState);
    const [response, setResponse] = useState<string>();
    const [error, setError] = useState<string | undefined>(undefined);
    const router = useRouter();
    const [rating, setRating] = useState<number>(0);

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
                }
            } catch (error) {
                setError((error as Error).message);
            }
        }
    };

    const handleInputBlur = (
        event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
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
                    <legend className="text-danger">Buch Anlegen</legend>

                    <div className="row">
                        <InputField
                            name="titel"
                            label="Titel"
                            type="text"
                            pattern="[A-Za-z]+"
                            minLength={3}
                            maxLength={20}
                            required
                            handleInputBlur={handleInputBlur}
                        />

                        <InputField
                            name="untertitel"
                            label="Untertitel"
                            type="text"
                            pattern="[A-Za-z]+"
                            minLength={3}
                            maxLength={20}
                            required
                            handleInputBlur={handleInputBlur}
                        />
                    </div>

                    <InputField
                        name="isbn"
                        label="ISBN"
                        type="text"
                        pattern="^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$"
                        required
                        handleInputBlur={handleInputBlur}
                    />
                    <div className="row">
                        <InputField
                            name="preis"
                            label="Preis"
                            type="number"
                            step={0.01}
                            min={0}
                            required
                            handleInputBlur={handleInputBlur}
                        />

                        <InputField
                            name="rabatt"
                            label="Rabatt"
                            type="number"
                            step="0.01"
                            min={0}
                            max={100}
                            required
                            handleInputBlur={handleInputBlur}
                        />

                        <InputField
                            name="datum"
                            label="Erscheinungsdatum"
                            type="date"
                            max={currentDate}
                            required
                            handleInputBlur={handleInputBlur}
                        />

                        <InputField
                            name="homepage"
                            label="Homepage"
                            type="text"
                            pattern="^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$"
                            required
                            handleInputBlur={handleInputBlur}
                        />
                    </div>
                </fieldset>

                <fieldset className="d-flex gap-5">
                    <SelectField
                        name="buchart"
                        label="Buchart"
                        options={[
                            { value: BuchArtEnum.KINDLE, label: "Kindle" },
                            {
                                value: BuchArtEnum.DRUCKAUSGABE,
                                label: "Druckausgabe",
                            },
                        ]}
                        required
                        handleInputBlur={handleInputBlur}
                    />

                    <div className="col-auto">
                        <input
                            type="checkbox"
                            className="btn-check"
                            id="lieferbar"
                            name="lieferbar"
                            value="true"
                            autoComplete="off"
                        />
                        <label
                            className="btn btn-outline-danger"
                            htmlFor="lieferbar"
                        >
                            Ist es Lieferbar?
                        </label>
                    </div>

                    <fieldset className="d-flex justify-content-center">
                        <legend className="d-flex justify-content-center">
                            Schlagwörter
                        </legend>
                        <EnumButtons
                            enumTyp={SchlagwortEnum}
                            name={"schlagwoerter"}
                            selectedValues={[]}
                        />
                    </fieldset>
                </fieldset>

                <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="5"
                    id="rating"
                    name="rating"
                    required
                    value={rating}
                    onInput={(e) => setRating(Number(e.currentTarget.value))}
                />
                <div className="mt-2">
                    <output
                        className="p-1 align-text-center  d-flex justify-content-center "
                        htmlFor="rating"
                        id="ratingOutput"
                    >
                        <RatingComponent stars={rating} maxValue={5} />
                    </output>
                </div>

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
