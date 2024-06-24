'use client'

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { EnumButtons } from "./ButtonGenerator/BuchFilterButtonGenerator";
import { BuchArtEnum } from "../lib/enum";
import { BooleanButtons } from "./filter/boolean";
import { RatingButtons } from "./filter/number";
import { TextInput } from "./filter/text";
import { Suchkriterium } from "../lib/interfaces";

export function BuchFilterButton() {
    const [selectedValues, setSelectedValues] = useState<Suchkriterium[]>([]);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // Handler, der aufgerufen wird, wenn der "Speichern"-Button geklickt wird
    const handleSave = () => {
        const params = new URLSearchParams(searchParams);
        if (selectedValues && selectedValues.length > 0) {
            params.set("filter", JSON.stringify(selectedValues));
        } else {
            params.delete("filter");
        }
        console.log("params: %o", params.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    const handleResetAllFilters = () => {
        setSelectedValues([]);
        // Alle Radio Buttons und andere Filterelemente zurücksetzen
        document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
            if (input instanceof HTMLInputElement) {
                input.checked = false;
            }
        });
        document.querySelectorAll('input[type="text"]').forEach(input => {
            if (input instanceof HTMLInputElement) {
                input.value = "";
            }
        });
    };

    return (
        <div>
            <button
                type="button"
                className="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#filterModal"
            >
                filter
            </button>

            <div
                className="modal fade"
                id="filterModal"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex={-1 as any}
                aria-labelledby="filter"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 text-dark" id="filter">
                                Wähle filter aus
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body d-flex flex-column m-3 gap-3">
                            <h2 className="fs-5 text-dark">Art</h2>
                            <EnumButtons
                                enumTyp={BuchArtEnum}
                                name={"art"}
                                setSelectedValues={setSelectedValues}
                            />
                            <hr />
                            <h2 className="fs-5 text-dark">Javascript</h2>
                            <BooleanButtons
                                name={"javascript"}
                                setSelectedValues={setSelectedValues}
                            />
                            <hr />
                            <h2 className="fs-5 text-dark">Typescript</h2>
                            <BooleanButtons
                                name={"typescript"}
                                setSelectedValues={setSelectedValues}
                            />

                            <hr />
                            <h2 className="fs-5 text-dark">Lieferbar</h2>
                            <BooleanButtons
                                name={"lieferbar"}
                                setSelectedValues={setSelectedValues}
                            />

                            <hr />
                            <h2 className="fs-5 text-dark">Rating</h2>
                            <RatingButtons
                                name={"rating"}
                                anzahl={5}
                                setSelectedValues={setSelectedValues}
                            />

                            <hr />
                            <h2 className="fs-5 text-dark">ISBN</h2>
                            <TextInput name="isbn" setSelectedValues={setSelectedValues} />
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                abbrechen
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleSave}
                                data-bs-dismiss="modal"
                            >
                                speichern
                            </button>
                            <button
                                type="button"
                                className="btn btn-warning"
                                onClick={handleResetAllFilters}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}