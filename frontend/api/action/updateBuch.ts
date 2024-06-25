import { SchlagwortTyp, BuchArtTyp } from "../../lib/typen";
import { extractErrorMessage } from "../graphqlError";
import { UPDATE_BUCH } from "../mutation/update";
import { GraphQLClient } from "graphql-request";

export async function updateActionBuch(
  id: number,
  version: number,
  token: string | null,
  formData: FormData,
  client: GraphQLClient
) {
  const schlagwoerter: SchlagwortTyp[] = [];
  const schlagwoerterOptions = formData.getAll("schlagwoerter");

  schlagwoerterOptions.forEach((schlagwort) => {
    schlagwoerter.push(schlagwort as SchlagwortTyp);
  });


  const isbn = formData.get("isbn")?.toString().trim();
  const preis = formData.get("preis")?.toString().trim();
  const rabatt = formData.get("rabatt")?.toString().trim();
  const homepage = formData.get("homepage")?.toString().trim();
  const lieferbar = formData.get("lieferbar") === "false";
  const buchart = formData.get("buchart") as BuchArtTyp;
  const rating = formData.get("rating")?.toString().trim();

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
    console.error(error);
    return {
      message: "Datenbankfehler: Buch konnte nicht aktualisiert werden.",
    };
  }
}
