"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import { BuchFormular } from "@/lib/formulare";
import { BuchArtEnum, SchlagwortEnum } from "../../lib/enum";
import EnumButtons from "@/components/ButtonGenerator/enumButtonGenerator";
import { Form } from "react-bootstrap";
import { updateBuch } from "../../api/actions";
import { useRouter } from "next/navigation.js";
import { ErrorBannerComponent } from "../ErrorBannerComponent";
import { InputField } from "./field/InputField";
import { SelectField } from "./field/SelectField";

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
                    formData,
                );
                if (result.message) {
                    setResponse(result.message);
                    setTimeout(() => {
                        router.push(`/buecher/${buch.id}`);
                        router.refresh();
                    }, 2000);
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

    return (
        <Form
            id="buchForm"
            className="pt-4 px-2"
            noValidate
            onSubmit={handleSetValid}
        >
            <div className="rounded bg-body-tertiary px-4 py-1 pt-4">
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
          
                <fieldset>
                    <legend className="mb-2 d-block text-sm font-sm">
                        {buch.titel.titel}
                    </legend>

                    <InputField
                        name="isbn"
                        label="ISBN"
                        type="text"
                        pattern="^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$"
                        required
                        defaultValue={buch.isbn}
                        handleInputBlur={handleInputBlur}
                    />

                    <InputField
                        name="preis"
                        label="Preis"
                        type="number"
                        step="0.01"
                        required
                        defaultValue={buch.preis}
                        handleInputBlur={handleInputBlur}
                    />

                    <InputField
                        name="rabatt"
                        label="Rabatt"
                        type="number"
                        step="0.01"
                        required
                        defaultValue={rabattNumber}
                        handleInputBlur={handleInputBlur}
                    />

                    <InputField
                        name="homepage"
                        label="Homepage"
                        type="text"
                        required
                        defaultValue={buch.homepage}
                        handleInputBlur={handleInputBlur}
                    />

                    {/* Rating */}
                    <label htmlFor="rating" className="form-label">
                        Rating
                    </label>
                    <input
                        type="range"
                        className="form-range"
                        min="0"
                        max="5"
                        id="rating"
                        name="rating"
                        defaultValue={buch.rating}
                        required
                        onBlur={handleInputBlur}
                    />

                    {/* Select buttons */}
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
                        required={true}
                        defaultValue={buch.art}
                        handleInputBlur={handleInputBlur}
                    />

                    {/* Schlagwörter */}
                    <EnumButtons
                        enumTyp={SchlagwortEnum}
                        name={"schlagwoerter"}
                        selectedValues={buch.schlagwoerter}
                    />

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
                        <label
                            className="btn btn-outline-danger"
                            htmlFor="lieferbar"
                        >
                            Lieferbar?
                        </label>
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
