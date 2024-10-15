import { gql } from '@apollo/client'

export const CREATE_RUBRIC_CATEGORY = gql`
  mutation CreateRubricCategory (
    $name: String!
    $slug: String!
    $weight: Float!
    $description: String!
  ) {
    createRubricCategory(
      name: $name
      slug: $slug
      weight: $weight
      description: $description
    ) {
      rubricCategory {
        id
        slug
        name
        weight
        rubricCategoryDescription {
          id
          description
        }
      }
      errors
    }
  }
`

export const DELETE_RUBRIC_CATEGORY = gql`
  mutation DeleteRubricCategory($id: ID!) {
    deleteRubricCategory(id: $id) {
      rubricCategory {
        id
        slug
        name
      }
      errors
    }
  }
`

export const UPDATE_RUBRIC_CATEGORY_INDICATORS = gql`
  mutation UpdateRubricCategoryIndicators (
    $categoryIndicatorSlugs: [String!]!
    $rubricCategorySlug: String!
  ) {
    updateRubricCategoryIndicators (
      categoryIndicatorSlugs: $categoryIndicatorSlugs
      rubricCategorySlug: $rubricCategorySlug
    ) {
      rubricCategory {
        id
        categoryIndicators {
          slug
          name
          rubricCategoryId
        }
      } 
      errors
    }
  }
`
