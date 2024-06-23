import { gql } from "graphql-request";

export const DELETE_BUCH = gql`
  mutation Delete($id: ID!) {
    delete(id: $id)
  }
`;
