import { gql } from "graphql-request";

export const UPDATE_BUCH = gql`
  mutation Update(
    $id: ID
    $version: Int
    $isbn: String
    $rating: Int
    $art: Art
    $preis: Float
    $lieferbar: Boolean
    $homepage: String
    $schlagwoerter: [String]
    $rabatt: Float
  ) {
    update(
      input: {
        id: $id
        version: $version
        isbn: $isbn
        rating: $rating
        art: $art
        preis: $preis
        lieferbar: $lieferbar
        homepage: $homepage
        schlagwoerter: $schlagwoerter
        rabatt: $rabatt
      }
    ) {
      version
    }
  }
`;
