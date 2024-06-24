import { SchlagwortTyp, BuchArtTyp } from "../../lib/typen";
import { extractErrorMessage, State } from "../actions";
import { UPDATE_BUCH } from "../mutation/update";
import { GraphQLClient } from "graphql-request";

export async function updateActionBuch(
  id: number,
  version: number,
  token: string | null,
  prevState: State | null,
  formData: FormData,
  client: GraphQLClient
) {
  const schlagwoerter: SchlagwortTyp[] = [];
  const schlagwoerterOptions = formData.getAll("schlagwoerter");

  schlagwoerterOptions.forEach((schlagwort) => {
    schlagwoerter.push(schlagwort as SchlagwortTyp);
  });

  // Manual validation
  const errors: Record<string, string[]> = {};

  const isbn = formData.get("isbn")?.toString().trim();
  if (!isbn || !/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(isbn)) {
    errors.isbn = ["Bitte geben Sie eine gültige ISBN ein."];
  }

  const preis = formData.get("preis")?.toString().trim();
  if (!preis || isNaN(parseFloat(preis))) {
    errors.preis = ["Bitte geben Sie einen Preis ein."];
  }

  const rabatt = formData.get("rabatt")?.toString().trim();
  if (rabatt && isNaN(parseFloat(rabatt))) {
    errors.rabatt = ["Bitte geben Sie einen gültigen Rabatt ein."];
  }

  const homepage = formData.get("homepage")?.toString().trim();
  if (!homepage) {
    errors.homepage = ["Bitte geben Sie eine gültige Homepage ein."];
  }

  const lieferbar = formData.get("lieferbar") === "false";
  const buchart = formData.get("buchart") as BuchArtTyp;
  if (!buchart || !["KINDLE", "DRUCKAUSGABE"].includes(buchart)) {
    errors.buchart = ["Bitte wählen Sie eine gültige Buchart."];
  }

  const rating = formData.get("rating")?.toString().trim();
  if (!rating || isNaN(parseInt(rating))) {
    errors.rating = ["Bitte geben Sie eine gültige Bewertung ein."];
  }

  if (Object.keys(errors).length > 0) {
    console.error("Validation failed:", errors);
    return {
      errors,
      message:
        "Fehlende oder ungültige Felder. Buch konnte nicht aktualisiert werden.",
    };
  }

  try {
    client.setHeader("Authorization", `Bearer ${token}`);
    const intPreis = preis? parseFloat(preis): 0;
    const intRabatt = rabatt ? parseFloat(rabatt) / 100 : 0;
    const intRating =rating? parseInt(rating): 1;

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
    return {
      message: "Buch erfolgreich aktualisiert!",
    };
  } catch (error) {
    console.error("Fehler beim Ausführen der GraphQL-Anfrage:", error);
    if (
      error.response &&
      error.response.errors &&
      error.response.errors.length > 0
    ) {
      const errorMessage = await extractErrorMessage(error.response.errors[0]);
      throw new Error(errorMessage);
    }
    console.error(error);
    return {
      message: "Datenbankfehler: Buch konnte nicht aktualisiert werden.",
    };
  }
}
