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
