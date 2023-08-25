import { gql } from '@apollo/client'

export const RUBRIC_CATEGORY_SEARCH_QUERY = gql`
  query RubricCategories($search: String!) { 
    rubricCategories(search: $search) {
      id
      name
      slug
      weight
      rubricCategoryDescription {
        id
        description
      }
      categoryIndicators {
        id
      }
    }
  }
`

export const RUBRIC_CATEGORY_QUERY = gql`
  query RubricCategory ($slug: String!) {
    rubricCategory (slug: $slug) {
      id
      name
      slug
      weight
      rubricCategoryDescription {
        id
        description
      }
      categoryIndicators {
        id
        name
        slug
      }
    }
  }
`
