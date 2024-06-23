import { gql } from "graphql-request";


export const CREATE_BUCH = gql`
  mutation Create(
    $isbn: String
    $rating: Int
    $buchart: Art
    $preis: Float
    $lieferbar: Boolean
    $homepage: String
    $schlagwoerter: [String]
    $rabatt: Float
    $datum: String
    $titel: String!
    $untertitel: String
    $abbildungen: [AbbildungInput!]
  ) {
    create(
      input: {
        isbn: $isbn
        rating: $rating
        art: $buchart
        preis: $preis
        rabatt: $rabatt
        lieferbar: $lieferbar
        datum: $datum
        homepage: $homepage
        schlagwoerter: $schlagwoerter
        titel: { titel: $titel, untertitel: $untertitel }
        abbildungen: $abbildungen
      }
    ) {
      id
    }
  }
`;
