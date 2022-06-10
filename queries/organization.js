import { gql } from '@apollo/client'

export const ORGANIZATION_SEARCH_QUERY = gql`
  query Organizations($search: String!) {
    organizations(search: $search) {
      id
      name
      slug
    }
  }
`
