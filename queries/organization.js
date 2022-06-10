import { gql } from '@apollo/client'

export const ORGANIZATION_SEARCH_QUERY = gql`
  query Organizations($search: String!, $aggregatorOnly: Boolean) {
    organizations(search: $search, aggregatorOnly: $aggregatorOnly) {
      id
      name
      slug
    }
  }
`
