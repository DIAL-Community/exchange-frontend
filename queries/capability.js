import { gql } from '@apollo/client'

export const CAPABILITY_SEARCH_QUERY = gql`
  query CapabilityOnly($search: String!) {
    capabilityOnly(search: $search) {
      service
      capability
    }
  }
`
