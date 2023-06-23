import { gql } from '@apollo/client'

export const TAG_SEARCH_QUERY = gql`
  query Tags($search: String!) {
    tags(search: $search) {
      id
      name
      slug
    }
  }
`
