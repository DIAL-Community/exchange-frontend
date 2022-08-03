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

export const COUNTRIES_LIST_QUERY = gql`
  query SearchCountries(
    $first: Int
    $after: String
    $search: String
  ) {
    searchCountries(
      first: $first
      after: $after
      search: $search
    ) {
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
        id
        name
        slug
      }
    }
  }
`
