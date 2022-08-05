import { gql } from '@apollo/client'

export const DELETE_COUNTRY = gql`
  mutation DeleteCountry(
    $id: ID!
  ) {
    deleteCountry(
      id: $id
    ) {
      country {
       id
       slug
       name
      }
    }
  }
`

export const CREATE_COUNTRY = gql`
  mutation CreateCountry(
    $name: String!
    $slug: String!
    $code: String
    $codeLonger: String
  ) {
    createCountry(
      name: $name
      slug: $slug
      code: $code
      codeLonger: $codeLonger
    ) {
        country {
          slug
        }
        errors
      }
    }
`
