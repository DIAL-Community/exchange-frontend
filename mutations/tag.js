import { gql } from '@apollo/client'

export const DELETE_TAG = gql`
  mutation DeleteTag ($id: ID!) {
    deleteTag(id: $id) {
      tag {
        id
      }
      errors
    }
  }
`

export const CREATE_TAG = gql`
  mutation CreateTag(
    $name: String!
    $slug: String!
    $description: String
  ) {
    createTag(
      name: $name
      slug: $slug
      description: $description
    ) {
        tag {
          name
          slug
        }
        errors
      }
    }
`
