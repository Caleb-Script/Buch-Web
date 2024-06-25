import { gql, GraphQLClient } from "graphql-request";
import { unstable_noStore as noStore } from "next/cache";
import dotenv from "dotenv";
import { Token } from "../lib/interfaces";
import { redirect } from "next/navigation";
import { extractErrorMessage } from "./graphqlError";

dotenv.config();
const client = new GraphQLClient(
    process.env.BACKEND_SERVER_URL || "https://localhost:3000/graphql"
);

const AUTH = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            access_token
            refresh_token
        }
    }
`;

const REFRESH_TOKEN = gql`
    mutation Refresh($refresh_token: String!) {
        refresh(refresh_token: $refresh_token) {
            access_token
            refresh_token
        }
    }
`;

export async function getAuth(username: string, password: string) {
    noStore();
    try {
        const data = await client.request<{ login: Token }>(AUTH, {
            username,
            password,
        });
        return data.login;
    } catch (error: any) {
        console.error("Fehler beim Ausführen der GraphQL-Anfrage:", error);
        if (error.response?.errors?.length > 0) {
            const errorMessage = await extractErrorMessage(
                error.response.errors[0]
            );
            throw new Error(errorMessage);
        }
        throw new Error("Unbekannter Fehler beim Erstellen des Buchs.");
    }
}

export async function refreshToken() {
  const refresh_token = localStorage.getItem("refreshToken");
  console.log(`Refreshing token: ${refresh_token}`);

  if (!refresh_token) {
    console.error("Kein Refresh-Token gefunden");
    alert("Kein Refresh-Token gefunden");
    throw new Error("Kein Refresh-Token gefunden");
  }

  try {
    const data = await client.request<{ refresh: Token }>(REFRESH_TOKEN, { refresh_token });
    if (!data || !data.refresh) {
      console.error("Ungültige Antwortstruktur:", data);
      throw new Error("Ungültige Antwortstruktur");
    }

    console.log(data.refresh);
    localStorage.setItem("token", data.refresh.access_token);
    localStorage.setItem("refreshToken", data.refresh.refresh_token);
    return data.refresh;
  } catch (error: any) {
    console.error("Fehler beim Ausführen der GraphQL-Anfrage:", error);
    if (error.response?.errors?.length > 0) {
      const errorMessage = await extractErrorMessage(error.response.errors[0]);
        alert(errorMessage);
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        redirect("/");
    }
    alert("Unbekannter Fehler beim Aktualisieren des Tokens");
    throw new Error("Unbekannter Fehler beim Aktualisieren des Tokens");
  }
}

