import { gql } from '@apollo/client'

export const RUBRIC_CATEGORIES_LIST_QUERY = gql`
  query RubricCategories($search: String!) { 
    rubricCategories(search: $search) {
      nodes {
        name
        slug
        weight
      }
      totalCount
    }
  }
`
