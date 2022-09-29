import { gql } from '@apollo/client'

export const CATEGORY_INDICATOR_QUERY = gql`
  query CategoryIndicator($slug: String!) {
    categoryIndicator(slug: $slug) {
      slug
      name
      id
      indicatorType
      weight
      dataSource
      scriptName
      rubricCategoryId
      categoryIndicatorDescription {
        description
      } 
    }
  }
`
