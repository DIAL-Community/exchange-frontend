import { gql } from '@apollo/client'

export const ORIGIN_SEARCH_QUERY = gql`
  query Origins($search: String!) {
    origins(search: $search) {
      id
      name
      slug
    }
  }
`
