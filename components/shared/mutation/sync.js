import { gql } from '@apollo/client'

export const DELETE_CONTACT = gql`
  mutation DeleteSync($id: ID!) {
    deleteSync(id: $id) {
      sync {
        id
        slug
        name
      }
      errors
    }
  }
`

export const CREATE_CONTACT = gql`
  mutation CreateSync(
    $name: String!
    $slug: String!
    $email: String!
    $title: String!
  ) {
    createSync(
      name: $name
      slug: $slug
      email: $email
      title: $title
    ) {
      sync {
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
