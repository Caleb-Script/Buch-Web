import { BuchArtTyp } from "./typen.js";


export type BuchFormular = {
  id: number;
  version: number;
  isbn: string;
  rating: number;
  art: BuchArtTyp;
  preis: number;
  rabatt: string;
  lieferbar: boolean;
  datum: string;
  homepage: string;
  schlagwoerter: string[];
  titel: {
    titel: string;
    untertitel?: string;
  };
};
