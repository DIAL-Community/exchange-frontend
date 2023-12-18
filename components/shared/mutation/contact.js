import { gql } from '@apollo/client'

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id) {
      contact {
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
    $email: String!
    $title: String!
  ) {
    createContact(
      name: $name
      slug: $slug
      email: $email
      title: $title
    ) {
      contact {
        id
        name
        slug
        email
        title
      }
      errors
    }
  }
`
