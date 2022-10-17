import { gql } from '@apollo/client'

const generatePlaybookMutation = (mutationName) =>
  `
    mutation (
      $name: String!,
      $slug: String!,
      $author: String,
      $cover: Upload,
      $overview: String!,
      $audience: String,
      $outcomes: String,
      $tags: JSON!,
      $plays: JSON,
      $draft: Boolean
    ) {
      ${mutationName}(
        name: $name,
        slug: $slug,
        author: $author,
        cover: $cover,
        overview: $overview,
        audience: $audience,
        outcomes: $outcomes,
        tags: $tags,
        plays: $plays,
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

export const CREATE_PLAYBOOK = gql(generatePlaybookMutation('createPlaybook'))

export const AUTOSAVE_PLAYBOOK = gql(generatePlaybookMutation('autoSavePlaybook'))

export const DELETE_PLAYBOOK = gql`
  mutation DeletePlaybook(
    $id: ID!
  ) {
    deletePlaybook(
      id: $id
    ) {
      playbook {
       id
       slug
       name
      }
    }
  }
`
