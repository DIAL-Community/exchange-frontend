import { gql } from '@apollo/client'

const generatePlaybookMutation = (mutationName, mutationPath) =>
  `
    mutation ${mutationName} (
      $name: String!
      $slug: String!
      $owner: String!
      $author: String
      $cover: Upload
      $overview: String!
      $audience: String
      $outcomes: String
      $tags: [String!]
      $draft: Boolean
    ) {
      ${mutationPath}(
        name: $name
        slug: $slug
        owner: $owner
        author: $author
        cover: $cover
        overview: $overview
        audience: $audience
        outcomes: $outcomes
        tags: $tags
        draft: $draft
      ) {
        playbook {
          id
          name
          slug
          tags
          playbookDescription {
            id
            overview
            audience
            outcomes
          }
          plays {
            id
            slug
            name
          }
          draft
        }
        errors
      }
    }
  `

export const CREATE_PLAYBOOK = gql(generatePlaybookMutation('CreatePlaybook', 'createPlaybook'))
export const AUTOSAVE_PLAYBOOK = gql(generatePlaybookMutation('AutoSavePlaybook', 'autoSavePlaybook'))

export const DELETE_PLAYBOOK = gql`
  mutation DeletePlaybook($id: ID!) {
    deletePlaybook(id: $id) {
      playbook {
       id
       slug
       name
      }
      errors
    }
  }
`

export const APPLY_AS_CONTENT_EDITOR = gql`
  mutation ApplyAsContentEditor {
    applyAsContentEditor {
      candidateRole {
        email
        roles
        description
      }
      errors
    }
  }
`

export const UNASSIGN_PLAYBOOK_PLAY = gql`
  mutation DeletePlaybookPlay ($playbookSlug: String!, $playSlug: String!, $owner: String!) {
    deletePlaybookPlay(playbookSlug: $playbookSlug, playSlug: $playSlug, owner: $owner) {
      playbook {
        id
      }
      errors
    }
  }
`

export const UPDATE_PLAYBOOK_PLAYS = gql`
  mutation UpdatePlaybookPlays (
    $playSlugs: [String!]!
    $slug: String!
    $owner: String!
  ) {
    updatePlaybookPlays (
      playSlugs: $playSlugs
      slug: $slug
      owner: $owner
    ) {
      playbook {
        id
        name
        slug
        playbookPlays {
          id
          playSlug
          playName
          playOrder
        }
        plays {
          id
          name
          slug
          playMoves {
            id
            name
          }
          playDescription {
            id
            description
          }
        }
      }
      errors
    }
  }
`
