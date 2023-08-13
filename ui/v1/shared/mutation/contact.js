import { gql } from '@apollo/client'

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id) {
      country {
       id
       slug
       name
      }
      errors
    }
  }
`

export const CREATE_CONTACT = gql`
  mutation CreateContact(
    $name: String!
    $slug: String!
  ) {
    createContact(
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
