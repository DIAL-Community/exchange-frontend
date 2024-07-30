import { gql } from '@apollo/client'

export const SOFTWARE_CATEGORY_SEARCH_QUERY = gql`
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

export const SOFTWARE_FEATURE_SEARCH_QUERY = gql`
query SoftwareFeatures($search: String, $category: Int) {
  softwareFeatures(search: $search, category: $category) {
    id
    name
    slug
  }
}
`
