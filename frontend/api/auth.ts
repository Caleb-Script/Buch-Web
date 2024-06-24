import { gql, GraphQLClient } from "graphql-request";
import { unstable_noStore as noStore } from "next/cache";
import dotenv from "dotenv";
import { extractErrorMessage } from "./actions";

dotenv.config();
const client = new GraphQLClient(
  process.env.BACKEND_SERVER_URL || "https://localhost:3000/graphql"
);

const AUTH = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      access_token
    }
  }
`;

const REFRESH_TOKEN = gql`
  mutation Refresh($refresh_token: String!) {
    refresh(refresh_token: $refresh_token) {
      access_token
    }
  }`

export async function getAuth(username: string, password: string) {
noStore()
  try {
    const data = await client.request<{ login: { access_token: string } }>(
      AUTH,
      {
        username,
        password,
      }
    );
    
    return data.login.access_token;
  } catch (error) {
    console.error("Fehler beim Login:", error);

    if (error instanceof Error) {
      if (error.message === "fetch failed") {
        throw new Error(`Netzwerkfehler: ${error.message}`);
      }
      throw new Error(`Fehler beim Login: ${error.message}`);
    } else {
      throw new Error("Unbekannter Fehler beim Login");
    }
  }
}

  export async function refreshToken() {
  const refresh_token = localStorage.getItem("token");
  try {
    const data = await client.request<{ login: { access_token: string } }>(
      REFRESH_TOKEN,
      {
        refresh_token,
      }
    );

    localStorage.setItem("token", data.login.access_token);
    return data.login.access_token;
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