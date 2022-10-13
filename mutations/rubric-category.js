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
      rubricCategory{
        id
        slug
      }
      errors
    }
  }
`

export const DELETE_RUBRIC_CATEGORY = gql`
  mutation DeleteRubricCategory ($id: ID!) {
    deleteRubricCategory(id: $id) {
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
