import { gql } from '@apollo/client'

export const PLAYS_QUERY = gql`
  query Plays($search: String, $owner: String!, $playbookSlug: String) {
    plays(search: $search, owner: $owner, playbookSlug: $playbookSlug) {
      id
      slug
      name
      imageFile
      playDescription {
        id
        description
      }
      playMoves {
        id
        slug
        name
      }
      products {
        id
        name
        slug
        imageFile
      }
      buildingBlocks {
        id
        name
        slug
        imageFile
        maturity
      }
    }
  }
`

export const REFRESH_PLAY_QUERY =   gql`
  query Play($slug: String!, $owner: String!) {
    play(slug: $slug, owner: $owner) {
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

export const PLAYBOOK_DETAIL_QUERY = gql`
  query Playbook($playbookSlug: String!, $owner: String!) {
    playbook(slug: $playbookSlug, owner: $owner) {
      id
      name
      slug
    }
  }
`

export const PLAY_BREADCRUMB_QUERY = gql`
  query Playbook($playbookSlug: String!, $playSlug: String!, $owner: String!) {
    play(slug: $playSlug, owner: $owner) {
      id
      name
      slug
    }
    playbook(slug: $playbookSlug, owner: $owner) {
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
  query Play($playbookSlug: String!, $playSlug: String!, $owner: String!) {
    play(slug: $playSlug, owner: $owner) {
      id
      name
      slug
      tags
      draft
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
    playbook(slug: $playbookSlug, owner: $owner) {
      id
      name
      slug
    }
  }
`
