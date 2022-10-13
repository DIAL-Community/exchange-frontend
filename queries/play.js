import { gql } from '@apollo/client'

export const PLAYS_QUERY = gql`
  query SearchPlays(
    $first: Int
    $after: String
    $search: String!
  ) {
    searchPlays(
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
        slug
        name
        imageFile
        playDescription {
          id
          description
        }
      }
    }
  }
`
