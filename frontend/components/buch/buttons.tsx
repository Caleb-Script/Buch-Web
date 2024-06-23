"use client";

import Link from "next/link.js";
import { deleteBuch } from "../../api/actions";
import { useState } from "react";

export function DeleteBuchButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      await deleteBuch(id);
      console.log(`Buch mit ID ${id} erfolgreich gelöscht.`);
      window.location.href = "/buecher"; // Weiterleitung per JavaScript
    } catch (error) {
      console.error(`Fehler beim Löschen des Buchs mit ID ${id}:`, error);
        setIsDeleting(false);
        //TODO Fehlermeldung zeigen
      // Hier kannst du eine Fehlermeldung anzeigen oder andere Fehlerbehandlung durchführen
    }
  };

  return (
    <div>
      <form onSubmit={handleDelete}>
        <button
          type="submit"
          className="btn btn-outline-danger w-100"
          disabled={isDeleting}
        >
          {isDeleting ? "Löschen..." : "Löschen"}
        </button>
      </form>
    </div>
  );
}

export function UpdateBuchButton({
  id,
  version,
}: {
  id: number;
  version: number;
}) {
  return (
    <Link
      href={`/buecher/${id}/edit`}
      className="btn btn-outline-secondary rounded p-2 btn-sm"
      style={{ transition: "background-color 0.3s" }}
    >
      Bearbeiten
    </Link>
  );
}
