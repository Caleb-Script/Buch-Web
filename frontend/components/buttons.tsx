"use client";

import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useCallback, useState } from "react";
import { EnumButtons } from "./filter-button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suchkriterium } from "@/lib/interfaces";
import { BuchArtEnum, SchlagwortEnum } from "../lib/enum";
import { deleteBuch } from "../api/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { RatingButtons } from "./filter/number";
import { BooleanButtons } from "./filter/boolean";
import { TextInput } from "./filter/text";
//import { useDebouncedCallback } from "use-debounce";

export function CreateBuecherButton() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      href="/buecher/create"
      className={`btn btn-danger d-flex align-items-center rounded-lg transition-colors text-white ${
        isHovered ? "bg-success" : ""
      }`}
      style={{ transition: "background-color 0.3s" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="d-none d-md-block">Create Buch</span>
      <PlusIcon className="ms-2" style={{ height: "1.25rem" }} />
    </Link>
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
      className="btn btn-outline-danger rounded p-2 btn-sm"
      style={{ transition: "background-color 0.3s" }}
    >
      <PencilIcon style={{ width: "16px", height: "16px" }} />
    </Link>
  );
}

export function DeleteBuchButton({ id }: { id: number }) {
  const handleDelete = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        const token = localStorage.getItem("token");
        const result = await deleteBuch(id, token);
        console.log(result);
      } catch (error) {
        console.error("Fehler beim Löschen des Buches:", error);
      }
    },
    [id]
  );

  return (
    <form onSubmit={handleDelete}>
      <button
        type="submit"
        className="btn btn-outline-danger rounded p-2 btn-sm"
      >
        <span className="visually-hidden">Löschen</span>
        <TrashIcon style={{ width: "16px", height: "16px" }} />
      </button>
    </form>
  );
}

export function InspectBuchButton({ id }: { id: number }) {
  return (
    <Link href={`/buecher/${id}`} passHref>
      <span className="btn btn-outline-danger rounded p-2 btn-sm">
        <span className="visually-hidden">Detail</span>
        <MagnifyingGlassIcon style={{ width: "16px", height: "16px" }} />
      </span>
    </Link>
  );
}
