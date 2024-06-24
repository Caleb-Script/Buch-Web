"use client";

import { useEffect, useState } from "react";
import { Buch } from "../../lib/klassen.js";
import { DeleteBuchButton, InspectBuchButton, UpdateBuchButton } from "./Buttons";

function schlagwoerterExist(
  schlagwoerter: string[] | undefined | null
): boolean {
  return (
    schlagwoerter !== null &&
    schlagwoerter !== undefined &&
    schlagwoerter.length > 0
  );
}

export default function BuchListeClient({ buecher }: { buecher: Buch[] }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("user");
    if (userRole === "admin") {
      setIsAdmin(true);
    }
  }, []);

  return (
    <div className="table-responsive">
      {buecher.length > 0 ? (
        <table className="table table-hover table-bordered">
          <thead>
            <tr>
              <th scope="col">Titel</th>
              <th scope="col">Isbn</th>
              <th scope="col">Art</th>
              <th scope="col">Preis</th>
              <th scope="col">Schlagwörter</th>
              <th scope="col">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {buecher.map((buch) => (
              <tr key={buch.id}>
                <td>{buch.titel.titel}</td>
                <td>{buch.isbn}</td>
                <td>{buch.art}</td>
                <td>{`${buch.preis} €`}</td>
                <td style={{ maxWidth: "200px" }}>
                  <div className="d-flex flex-wrap gap-1">
                    {schlagwoerterExist(buch.schlagwoerter) ? (
                      buch.schlagwoerter.map((word: string) => (
                        <div
                          key={word}
                          className="badge badge-light text-danger rounded-pill border border-danger"
                        >
                          {word.toLowerCase()}
                        </div>
                      ))
                    ) : (
                      <p>Kein Schlagwort vorhanden!</p>
                    )}
                  </div>
                </td>
                <td>
                  <div className="d-flex gap-4">
                    <UpdateBuchButton id={buch.id} version={buch.version} />
                    {isAdmin && <DeleteBuchButton id={buch.id} />}
                    <InspectBuchButton id={buch.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div role="alert" className="alert alert-danger">
          Kein Buch gefunden!
        </div>
      )}
    </div>
  );
}
