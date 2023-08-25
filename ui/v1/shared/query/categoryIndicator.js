import { gql } from '@apollo/client'

export const CATEGORY_INDICATOR_QUERY = gql`
  query CategoryIndicator($slug: String!) {
    categoryIndicator(slug: $slug) {
      id
      slug
      name
      weight
      indicatorType
      dataSource
      scriptName
      rubricCategoryId
      categoryIndicatorDescription {
        id
        description
      } 
    }
  }
`

export const CATEGORY_INDICATOR_SEARCH_QUERY = gql`
  query CategoryIndicators($search: String) {
    categoryIndicators(search: $search) {
      id
      slug
      name
      rubricCategoryId
    }
  }
`

