import { gql } from '@apollo/client'

export const SECTOR_SEARCH_QUERY = gql`
  query Sectors($search: String!, $locale: String) {
    sectors(search: $search, locale: $locale) {
      id
      name
      slug
    }
  }
`

export const SECTORS_LIST_QUERY = gql`
  query SearchSectors(
    $first: Int
    $after: String
    $search: String!
  ) {
    searchSectors(
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
