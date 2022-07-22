import { gql } from '@apollo/client'

export const ENDORSER_SEARCH_QUERY = gql`
  query Endorsers($search: String!) {
    endorsers(search: $search) {
      id
      name
      slug
    }
  }
`
