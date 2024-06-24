

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { GraphQLClient } from "graphql-request";
import { BuchArtTyp, SchlagwortTyp } from "../lib/typen";
import { UPDATE_BUCH } from "./mutation/update";
import { SchlagwortEnum } from "../lib/enum";
import { GraphQLError } from "graphql";
import { deleteActionBuch } from "./action/deleteBuch";
import { createActionBuch } from "./action/createBuch";
import { updateActionBuch } from "./action/updateBuch";

const backendServerURL =
  process.env.BACKEND_SERVER_URL || "https://localhost:3000/graphql";
const client = new GraphQLClient(backendServerURL);

export async function extractErrorMessage(
  error: GraphQLError
): Promise<string> {
  if (error.extensions && error.extensions.code === "BAD_USER_INPUT") {
    const stacktrace = error.extensions.stacktrace;

    if (stacktrace && stacktrace.length > 0 && error.message === undefined) {
      const firstEntry = stacktrace[0];
      const errorMessage = firstEntry
        .substring(firstEntry.indexOf(":") + 1)
        .trim();
      console.log("Unexpected BAD_USER_INPUT error:", stacktrace[0]);
      return errorMessage;
    }

    console.log(
      "Unexpected BAD_USER_INPUT error:",
      error.extensions.stacktrace
    );
    console.error(error.message);
    return (
      error.message || "Ungültige Eingabe. Bitte überprüfen Sie Ihre Daten."
    );
  }

  return "Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
}


export const FormSchema = z.object({
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
  homepage: z.string(),
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
  return await createActionBuch(token, prevState, formData, client);
  //revalidatePath("/buecher");
  
}

export async function updateBuch(
  id: number,
  version: number,
  token: string | null,
  prevState: State | null,
  formData: FormData
) {
  return await updateActionBuch(id, version, token, prevState, formData, client);
}

export async function deleteBuch(id: number, token: string | null) {
  await deleteActionBuch(id, token, client);
 return;

}
