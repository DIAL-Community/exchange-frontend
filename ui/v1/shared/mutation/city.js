import { gql } from '@apollo/client'

export const DELETE_CITY = gql`
  mutation DeleteCity($id: ID!) {
    deleteCity(id: $id) {
      country {
       id
       slug
       name
      }
      errors
    }
  }
`

export const CREATE_CITY = gql`
  mutation CreateCity(
    $name: String!
    $slug: String!
  ) {
    createCity(
      name: $name
      slug: $slug
    ) {
      country {
        id
        name
        slug
      }
      errors
    }
  }
`
