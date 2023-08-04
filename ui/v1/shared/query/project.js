import { gql } from '@apollo/client'

export const PROJECT_SEARCH_QUERY = gql`
  query Projects($search: String) {
    projects(search: $search) {
      id
      name
      slug
      origin {
        slug
      }
    }
  }
`
