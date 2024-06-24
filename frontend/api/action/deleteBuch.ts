import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DELETE_BUCH } from "../mutation/loeschen";


export async function deleteActionBuch (id: number, token: string | null, client) {
  try {
    client.setHeader("Authorization", `Bearer ${token}`);
    try {
      const data = await client.request<{ delete: boolean }>(DELETE_BUCH, {
        id,
      });
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
