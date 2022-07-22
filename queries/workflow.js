import { gql } from '@apollo/client'

export const WORKFLOW_SEARCH_QUERY = gql`
  query Workflows($search: String!) {
    workflows(search: $search) {
      id
      name
      slug
    }
  }
`
