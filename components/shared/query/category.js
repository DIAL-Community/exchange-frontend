import { gql } from '@apollo/client'

export const CATEGORY_SEARCH_QUERY = gql`
  query SoftwareCategories($search: String) {
    softwareCategories(search: $search) {
      id
      name
      slug
      softwareFeatures {
        id
        name
        slug
      }
    }
  }
`

export const FEATURE_SEARCH_QUERY = gql`
  query SoftwareFeatures($category: Integer) {
    softwareCategories(category: $category) {
      id
      name
      slug
    }
  }
`

