import { fetchBuchById } from "../../../api/buch";
import Breadcrumbs from "../../../components/breadcrumbs";
import BuchDetailClient from "../../../components/BuchDetail";

export default async function Home({ params }: { params: { id: string } }) {
  const id: number = parseInt(params.id);
  const { buch } = await fetchBuchById(id);

  // Formatieren des Datums
  const datum = new Date(parseInt(buch.datum)).toLocaleDateString("de-DE");
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Bücher", href: "/buecher" },
          { label: "Detail", href: `/buecher/${buch.id}`, active: true },
        ]}
      />
      <BuchDetailClient buch={buch} datum={datum} />
    </main>
  );
}
