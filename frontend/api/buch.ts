import { BuchFormular } from "@/lib/formulare";
import { unstable_noStore as noStore } from "next/cache";
import { BUCH, BUCH_FORMULAR } from "./query/query";
import { GraphQLClient } from "graphql-request";
import { Buch } from "@/lib/klassen";
import { redirect } from "next/navigation";


const client = new GraphQLClient(
  process.env.BACKEND_SERVER_URL || "https://localhost:3000/graphql"
);

export async function fetchBuchByIdFormular2(id: string) {
  noStore();

  try {
    console.log("Anfrage wird geschickt... %s", id);
    const data = await client.request<{ buch: BuchFormular }>(
      BUCH_FORMULAR,
      {
        id,
      }
    );
    const buch = data.buch;
    return buch;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Buch ${id} konnte nicht geladen werden`);
  }
}

export async function fetchBuchById(id: number) {
  noStore();

  try {
    const data = await client.request<{ buch: Buch }>(BUCH, {
      id,
    });
    const buch = data.buch;
    return { buch };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`Buch ${id} konnte nicht geladen werden`);
  }
}
