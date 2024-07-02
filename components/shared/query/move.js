import { gql } from '@apollo/client'

export const MOVE_QUERY = gql`
  query Move($playbookSlug: String!, $playSlug: String!, $moveSlug: String!, $owner: String!) {
    move(playSlug: $playSlug, slug: $moveSlug) {
      id
      name
      slug
      resources {
        id
        name
        slug
        resourceLink
        linkDescription
      }
      inlineResources
      moveDescription {
        id
        description
        locale
      }
      play {
        id
        name
        slug
      }
    }
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

export const PLAY_QUERY = gql`
  query Play($playbookSlug: String!, $playSlug: String!, $owner: String) {
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
      resources {
        id
        name
        slug
        resourceLink
        linkDescription
      }
      inlineResources
      moveDescription {
        id
        description
      }
    }
  }
`
