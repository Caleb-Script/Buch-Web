import { gql } from "graphql-request";

export const BUECHER_TABELLE = gql`
  query Buch(
    $titel: String
    $isbn: String
    $rating: Int
    $art: Art
    $lieferbar: Boolean
    $javascript: Boolean
    $typescript: Boolean
  ) {
    buecher(
      suchkriterien: {
        titel: $titel
        isbn: $isbn
        rating: $rating
        art: $art
        lieferbar: $lieferbar
        javascript: $javascript
        typescript: $typescript
      }
    ) {
      id
      titel {
        titel
      }
      isbn
      art
      preis
      schlagwoerter
      rating
    }
  }
`;

export const BUCH_FORMULAR = gql`
  query Buch($id: ID!) {
    buch(id: $id) {
      id
      version
      isbn
      preis
      rating
      datum
      homepage
      homepage
      art
      lieferbar
      schlagwoerter
      titel {
        titel
        untertitel
      }
    }
  }
`;

export const BUCH = gql`
  query Buch($id: ID!) {
    buch(id: $id) {
      id
      version
      isbn
      rating
      art
      preis
      lieferbar
      datum
      homepage
      schlagwoerter
      rabatt
      titel {
        titel
        untertitel
      }
    }
  }
`;