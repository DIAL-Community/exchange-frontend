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
        products {
          name
          slug
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
      products {
        name
        slug
      }
      buildingBlocks {
        name
        slug
      }
    }
    playbook(slug: $playbookSlug) {
      id
      name
      slug
    }
  }
`
