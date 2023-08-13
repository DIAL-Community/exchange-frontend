import { gql } from '@apollo/client'

export const DELETE_COUNTRY = gql`
  mutation DeleteCountry($id: ID!) {
    deleteCountry(id: $id) {
      country {
       id
       slug
       name
      }
      errors
    }
  }
`

export const CREATE_COUNTRY = gql`
  mutation CreateCountry(
    $name: String!
    $slug: String!
  ) {
    createCountry(
      name: $name
      slug: $slug
    ) {
        country {
          id
          name
          slug
          code
          codeLonger
        }
        errors
      }
    }
`
