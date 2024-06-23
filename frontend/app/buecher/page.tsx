import BuecherListe from "./table";
import { CreateBuecherButton } from "../../components/buttons";
import { Suspense } from "react";
import SeitenNummerierung from "@/components/pagination";
import { fetchBuecherTabelleSeiten } from "@/api/tabellen";
import Suchleiste from "../../components/Suchleiste";
import { BuchTabelleSkelet } from "../../components/skeletons";
import { FilterBuecherButton } from "../../components/BuchFilter";


export default async function Buecher({
  searchParams,
}: {
  searchParams?: {
    titel?: string;
    page?: string;
    filter?: string;
  };
}) {
  const titel = searchParams?.titel || "";
  const currentPage = Number(searchParams?.page) || 1;
  const filter = JSON.parse(searchParams?.filter || "[]");
  const anzahlSeiten = await fetchBuecherTabelleSeiten(titel, filter);

  return (
    <main>
      <h1 className="text-danger mt-5">Bücher</h1>
      <div className="my-4 d-flex align-items-center justify-content-between gap-2">
        <Suchleiste placeholder="Suche Bücher..." />
        <FilterBuecherButton />
        <CreateBuecherButton />
      </div>
      <Suspense fallback={<BuchTabelleSkelet />} key={titel + currentPage}>
        <BuecherListe titel={titel} filter={filter} page={currentPage} />
      </Suspense>
      <div className="d-flex w-100 justify-content-center">
        <SeitenNummerierung anzahlSeiten={anzahlSeiten} />
      </div>
    </main>
  );
}
