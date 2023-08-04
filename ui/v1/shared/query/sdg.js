import { gql } from '@apollo/client'

export const SDG_SEARCH_QUERY = gql`
  query SDGs($search: String) {
    sdgs(search: $search) {
      id
      name
      slug
      number
    }
  }
`
