import { gql } from '@apollo/client'

export const CATEGORY_INDICATOR_QUERY = gql`
  query CategoryIndicator($slug: String!) {
    categoryIndicator(slug: $slug) {
      slug
      name
      indicatorType
      weight
      dataSource
      scriptName
      categoryIndicatorDescription {
        description
      } 
    }
  }
`
