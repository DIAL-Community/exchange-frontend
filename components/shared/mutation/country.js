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
    $description: String
  ) {
    createCountry(
      name: $name
      slug: $slug
      description: $description
    ) {
        country {
          id
          name
          slug
          code
          codeLonger
          description
        }
        errors
      }
    }
`
