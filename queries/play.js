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

export const PLAY_QUERY = gql`
  query Play($playbookSlug: String!, $playSlug: String!) {
    play(slug: $playSlug) {
      id
      name
      slug
      tags
      imageFile
      playDescription {
        id
        description
        locale
      }
      playMoves {
        id
        name
        slug
        resources
        moveDescription {
          id
          description
          locale
        }
      }
    }
    playbook(slug: $playbookSlug) {
      id
      name
      slug
    }
  }
`
