import { BuchArtTyp } from "./typen.js";


export interface Suchkriterien {
  readonly isbn?: string;
  readonly rating?: string;
  readonly art?: BuchArtTyp;
  readonly preis?: number;
  readonly rabatt?: number;
  readonly lieferbar?: boolean;
  readonly datum?: string;
  readonly homepage?: string;
  readonly javascript?: string;
  readonly typescript?: string;
  readonly titel?: string;
  key: string;
  value: string;
}