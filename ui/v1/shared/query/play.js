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

export const REFRESH_PLAY_QUERY =   gql`
  query Play($slug: String!) {
    play(slug: $slug) {
      id
      name
      slug
      playMoves {
        id
        name
      }
    }
  }
`

export const PLAYBOOK_QUERY = gql`
  query Playbook($playbookSlug: String!) {
    playbook(slug: $playbookSlug) {
      id
      name
      slug
    }
  }
`

export const MOVE_PREVIEW_QUERY = gql`
  query Move($playSlug: String!, $slug: String!) {
    move(playSlug: $playSlug, slug: $slug) {
      id
      slug
      name
      resources
      moveOrder
      moveDescription {
        id
        description
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
        imageFile
      }
      buildingBlocks {
        name
        slug
        imageFile
      }
    }
    playbook(slug: $playbookSlug) {
      id
      name
      slug
    }
  }
`
