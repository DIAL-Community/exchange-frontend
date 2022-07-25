import { gql } from '@apollo/client'

export const COUNTRY_SEARCH_QUERY = gql`
  query Countries($search: String!) {
    countries(search: $search) {
      id
      name
      slug
    }
  }
`

export const COUNTRY_CODES_QUERY = gql`
  query Countries($search: String!) {
    countries(search: $search) {
      codeLonger
    }
  }
`
