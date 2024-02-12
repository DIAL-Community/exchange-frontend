import { gql } from '@apollo/client'

export const AUTHOR_SEARCH_QUERY = gql`
  query Authors($search: String) {
    authors(search: $search) {
      id
      name
      slug
      email
    }
  }
`
