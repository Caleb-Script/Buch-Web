import { GraphQLClient } from "graphql-request";
import { DELETE_BUCH } from "../mutation/loeschen";
import { extractErrorMessage } from "../graphqlError";


export async function deleteActionBuch (id: number, token: string | null, client: GraphQLClient) {
  try {
    client.setHeader("Authorization", `Bearer ${token}`);
      const data = await client.request<{ delete: boolean }>(DELETE_BUCH, {
        id,
      });
      return { message: `Buch: ${id} wurde gelöscht` };
  } catch (error: any) {
        console.error("Fehler beim Ausführen der GraphQL-Anfrage:", error);
        if (
            error.response &&
            error.response.errors &&
            error.response.errors.length > 0
        ) {
            const errorMessage = await extractErrorMessage(
                error.response.errors[0]
            );
          if (errorMessage == "Unauthorized") {
            alert("Dein Token ist abgelaufen")
          }
            throw new Error(errorMessage);
        }
        console.error(error);
        throw new Error("Unbekannter Fehler beim Erstellen des Buchs.");
    }
};
