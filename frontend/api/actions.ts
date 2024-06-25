import { GraphQLClient } from "graphql-request";
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
  if (
      (error.extensions && error.extensions.code === "BAD_USER_INPUT") ||
      error.extensions.code === "BAD_USER_INPUT"
  ) {
      let stacktrace: string[] | undefined;

      if (Array.isArray(error.extensions.stacktrace)) {
          stacktrace = error.extensions.stacktrace as string[];
      }

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

export async function createBuch(
  token: string | null,
  formData: FormData
) {
  return await createActionBuch(formData, client, token);  
}

export async function updateBuch(
  id: number,
  version: number,
  token: string | null,
  formData: FormData
) {
  return await updateActionBuch(id, version, token, formData, client);
}

export async function deleteBuch(id: number, token: string | null) {
  await deleteActionBuch(id, token, client);
 return;

}
