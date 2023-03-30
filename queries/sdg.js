import { gql } from '@apollo/client'

export const SDG_SEARCH_QUERY = gql`
  query SDGs($search: String!) {
    sdgs(search: $search) {
      id
      name
      slug
      number
    }
  }
`

export const SDGS_QUERY = gql`
  query SearchSDGs(
    $first: Int,
    $after: String,
    $sdgs: [String!],
    $search: String!
    ) {
    searchSdgs(
      first: $first,
      after: $after,
      sdgs: $sdgs,
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
        number
        slug
        imageFile
        longTitle
        sdgTargets {
          id
          name
          targetNumber
          useCases {
            id
            slug
            name
            imageFile
          }
        }
      }
    }
  }
`
