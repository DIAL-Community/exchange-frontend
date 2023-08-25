import { gql } from '@apollo/client'

export const CATEGORY_INDICATOR_QUERY = gql`
  query CategoryIndicator($categorySlug: String!, $indicatorSlug: String!) {
    categoryIndicator(slug: $indicatorSlug) {
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
    rubricCategory(slug: $categorySlug) {
      id
      name
      slug
      categoryIndicators {
        id
        name
        slug
      }
    }
  }
`

export const RUBRIC_CATEGORY_QUERY =  gql`
  query RubricCategory($categorySlug: String!) {
    rubricCategory(slug: $categorySlug) {
      id
      name
      slug
      categoryIndicators {
        id
        name
        slug
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

