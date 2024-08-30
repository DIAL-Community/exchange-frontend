import { gql } from '@apollo/client'

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      category {
       id
       slug
       name
      }
      errors
    }
  }
`

export const CREATE_CATEGORY = gql`
  mutation CreateCategory(
    $name: String!
    $slug: String!
    $description: String!
  ) {
    createSector(
      name: $name
      slug: $slug
      description: $description
    ) {
      category {
        id
        name
        slug
        description
      }
      errors
    }
  }
`
