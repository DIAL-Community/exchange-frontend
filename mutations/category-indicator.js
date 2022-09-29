import { gql } from '@apollo/client'

export const CREATE_CATEGORY_INDICATOR = gql`
  mutation CreateCategoryIndicator (
    $name: String!
    $slug: String!
    $rubricCategorySlug: String
    $indicatorType: String!
    $dataSource: String
    $scriptName: String
    $weight: Float!
    $description: String!
  ) {
    createCategoryIndicator(
      name: $name
      slug: $slug
      rubricCategorySlug: $rubricCategorySlug
      indicatorType: $indicatorType
      dataSource: $dataSource
      scriptName: $scriptName
      weight: $weight
      description: $description
    ) {
      categoryIndicator{
        id
        slug
      }
      errors
    }
  }
`

export const DELETE_CATEGORY_INDICATOR = gql`
  mutation DeleteCategoryIndicator($id: ID!) {
    deleteCategoryIndicator(id: $id) {
      rubricCategorySlug
    }
  }
`
