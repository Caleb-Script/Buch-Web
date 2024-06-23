"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { GraphQLClient } from "graphql-request";
import { CREATE_BUCH } from "./mutation/create";
import { DELETE_BUCH } from "./mutation/loeschen";
import { getAuth } from "./auth";
import { BuchArtTyp, SchlagwortTyp } from "../lib/typen";
import { UPDATE_BUCH } from "./mutation/update";
import { SchlagwortEnum } from "../lib/enum";
  
const backendServerURL =
  process.env.BACKEND_SERVER_URL || "https://localhost:3000/graphql";
const client = new GraphQLClient(backendServerURL);
// TODO: Header verbessern

const FormSchema = z.object({
  isbn: z
    .string({
      invalid_type_error: "Bitte geben Sie eine gültige ISBN ein.",
    })
    .regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/, {
      message: "ISBN ist ungültig!",
    })
    .refine((val) => val.trim() !== "", {
      message: "ISBN ist erforderlich!",
    }),
  preis: z.string({
    invalid_type_error: "Bitte geben Sie einen Preis ein.",
  }),
  rabatt: z.string(),

  homepage: z.string()
    .regex(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/),
  
  datum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/i, {
    message: "Bitte geben Sie ein gültiges Datum im Format YYYY-MM-DD ein.",
  }),
  lieferbar: z.boolean(),
  buchart: z.enum(["KINDLE", "DRUCKAUSGABE"]),
  schlagwoerter: z.array(
    z.enum(Object.values(SchlagwortEnum) as [string, ...string[]])
  ),
  rating: z.string(),
    titel: z.string().min(1, "Titel ist erforderlich."),
    untertitel: z.string().optional(),
});

const CreateBuch = FormSchema;
const UpdateBuch = FormSchema.omit({ datum: true, titel: true});

export type State = {
  errors?: {
    isbn?: string[];
    preis?: string[];
    rabatt?: string[];
    homepage?: string[];
    datum?: string[];
    lieferbar?: string[];
    buchart?: string[];
    schlagwoerter?: string[];
    titel?: string[];
    untertitel?: string[];
  };
  message?: string | null;
};

export async function createBuch(
  token: string | null,
  prevState: State,
  formData: FormData
) {
  const schlagwoerter: SchlagwortTyp[] = [];
  const schlagwoerterOptions = formData.getAll("schlagwoerter");

  schlagwoerterOptions.forEach((interesse) => {
    schlagwoerter.push(interesse as SchlagwortTyp);
  });

  const validatedFields = CreateBuch.safeParse({
    titel: formData.get("titel"),
    untertitel: formData.get("untertitel"),
    isbn: formData.get("isbn"),
    preis: formData.get("preis"),
    rabatt: formData.get("rabatt"),
    homepage: formData.get("homepage"),
    datum: formData.get("datum"),
    lieferbar: formData.get("lieferbar") === "true",
    buchart: formData.get("buchart") as BuchArtTyp,
    schlagwoerter,
    rating: formData.get("rating"),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        "Fehlende oder ungültige Felder. Buch konnte nicht erstellt werden.",
    };
  }

  const {
    isbn,
    preis,
    rabatt,
    homepage,
    datum,
    lieferbar,
    buchart,
    titel,
    untertitel,
    rating,
  } = validatedFields.data;

  try {
    const abbildungen = [
      {
        beschriftung: "Abb. 1",
        contentType: "img/png",
      },
    ];
    const intPreis = parseFloat(preis);
    const intRabatt = rabatt !== undefined ? parseFloat(rabatt) / 100 : 0;
    const intRating = parseInt(rating);

    const authToken = await getAuth("admin", "p");
    client.setHeader("Authorization", `Bearer ${authToken}`);

    const data = await client.request<{ createBuch: string }>(CREATE_BUCH, {
      isbn,
      preis: intPreis,
      rabatt: intRabatt,
      datum,
      homepage,
      buchart,
      schlagwoerter,
      lieferbar,
      titel,
      untertitel,
      rating: intRating,
      abbildungen,
    });
    console.log("GraphQL-Anfrage erfolgreich abgeschlossen:", data);
  } catch (error) {
    console.error("Fehler beim Ausführen der GraphQL-Anfrage:", error);
    return { message: "Datenbankfehler: Buch konnte nicht erstellt werden." };
  }

  revalidatePath("/buecher");
  redirect("/buecher");
}

export async function updateBuch(
  id: number,
  version: number,
  token:string | null,
  prevState: State | null,
  formData: FormData
) {
  console.log("updateBuch");

  const schlagwoerter: SchlagwortTyp[] = [];
  const schlagwoerterOptions = formData.getAll("schlagwoerter");

  schlagwoerterOptions.forEach((interesse) => {
    schlagwoerter.push(interesse as SchlagwortTyp);
  });

  const validatedFields = UpdateBuch.safeParse({
    isbn: formData.get("isbn"),
    preis: formData.get("preis"),
    rabatt: formData.get("rabatt"),
    homepage: formData.get("homepage"),
    lieferbar: formData.get("lieferbar") === "false",
    buchart: formData.get("buchart") as BuchArtTyp,
    rating: formData.get("rating"),
    schlagwoerter,
  });

  console.log("Validated Fields:", validatedFields.data);

  if (!validatedFields.success) {
    console.error(
      "Validation failed:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        "Fehlende oder ungültige Felder. Buch konnte nicht aktualisiert werden.",
    };
  }

  const { isbn, preis, rabatt, homepage, lieferbar, buchart, rating } =
    validatedFields.data;

  try {
    client.setHeader("Authorization", `Bearer ${token}`);
    const intPreis = parseFloat(preis)
    const intRabatt = rabatt !== undefined ? parseFloat(rabatt) / 100 : 0;
    const intRating = parseInt(rating);
    const data = await client.request<{ updateBuch: number }>(UPDATE_BUCH, {
      id,
      version,
      isbn,
      preis: intPreis,
      rabatt: intRabatt,
      homepage,
      lieferbar,
      buchart,
      schlagwoerter,
      rating: intRating,
    });
    console.log("GraphQL Response:", data);
  } catch (error) {
    console.error("Fehler beim Ausführen der GraphQL-Anfrage:", error);
    return {
      message: "Datenbankfehler: Buch konnte nicht aktualisiert werden.",
    };
  }

  revalidatePath("/buecher");
  redirect("/buecher");
}

export async function deleteBuch(id: number, token:string | null) {
  try {
    client.setHeader("Authorization", `Bearer ${token}`);
    try {
      const data = await client.request<{ delete: boolean }>(DELETE_BUCH, {
        id,
      });
      console.log(data);
      revalidatePath("/buecher");
      return { message: `Buch: ${id} wurde gelöscht` };
    } catch (error) {
      console.error("Fehler beim Löschen des Buches:", error);
      return { message: "Datenbankfehler: Löschen des Buches fehlgeschlagen." };
    }
  } catch (error) {
    console.error("Fehler:", error);
    return { message: "Authentifizierungsfehler." };
  }
}
