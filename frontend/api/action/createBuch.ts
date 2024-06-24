'use client'

import { GraphQLClient } from "graphql-request";
import { BuchArtTyp, SchlagwortTyp } from "../../lib/typen";
import { extractErrorMessage } from "../actions";
import { getAuth } from "../auth";
import { CREATE_BUCH } from "../mutation/create";
import { SchlagwortEnum } from "../../lib/enum";
import { GraphQLError } from 'graphql';

export const createActionBuch = async (
  formData: FormData,
  client: GraphQLClient,
  token: string | null
) => {
  const schlagwoerter: SchlagwortTyp[] = [];
  const schlagwoerterOptions = formData.getAll("schlagwoerter");

  if (schlagwoerterOptions) {
    schlagwoerterOptions.forEach((schlagwort) => {
      if (Object.values(SchlagwortEnum).includes(schlagwort as SchlagwortEnum)) {
        schlagwoerter.push(schlagwort as SchlagwortTyp);
      }
    });
  }

  const titel = formData.get("titel")?.toString().trim();
  if (!titel) {
    return {
      errors: { titel: ["Titel ist erforderlich."] },
      message: "Titel ist erforderlich.",
    };
  }

  const isbn = formData.get("isbn")?.toString().trim();
  if (!isbn || !/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(isbn)) {
    return {
      errors: { isbn: ["Bitte geben Sie eine gültige ISBN ein."] },
      message: "Bitte geben Sie eine gültige ISBN ein.",
    };
  }

  const preis = formData.get("preis")?.toString().trim();
  if (!preis) {
    return {
      errors: { preis: ["Bitte geben Sie einen Preis ein."] },
      message: "Bitte geben Sie einen Preis ein.",
    };
  }

  const rabatt = formData.get("rabatt")?.toString().trim();
  const homepage = formData.get("homepage")?.toString().trim();
  const datum = formData.get("datum")?.toString().trim();
  const lieferbar = formData.get("lieferbar") === "true";
  const buchart = formData.get("buchart") as BuchArtTyp;
  const rating = formData.get("rating")?.toString().trim();

  const abbildungen = [
    {
      beschriftung: "Abb. 1",
      contentType: "img/png",
    },
  ];

  const intPreis = parseFloat(preis);
  const intRabatt = rabatt ? parseFloat(rabatt) / 100 : 0;
  const intRating = rating ? parseInt(rating) : 0;

  try {
    client.setHeader("Authorization", `Bearer ${token}`);

    const data = await client.request<{ id: string }>(CREATE_BUCH, {
      isbn,
      preis: intPreis,
      rabatt: intRabatt,
      datum,
      homepage,
      buchart,
      schlagwoerter,
      lieferbar,
      titel,
      rating: intRating,
      abbildungen,
    });

    console.log("GraphQL-Anfrage erfolgreich abgeschlossen:", data);
    return { message: `Buch ${titel} erfolgreich erstellt.` };
  } catch (error: any) {
    console.error("Fehler beim Ausführen der GraphQL-Anfrage:", error);
    if (
      error.response &&
      error.response.errors &&
      error.response.errors.length > 0
    ) {
      const errorMessage = await extractErrorMessage(error.response.errors[0]);
      throw new Error(errorMessage);
    }
    console.error(error)
    throw new Error("Unbekannter Fehler beim Erstellen des Buchs.");
  }
};
