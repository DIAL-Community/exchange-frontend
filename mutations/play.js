import { gql } from '@apollo/client'

const generatePlayMutation = (mutationName) => `
     mutation (
      $name: String!
      $slug: String!
      $description: String!
      $tags: JSON!
      $playbookSlug: String
    ) {
      ${mutationName} (
        name: $name
        slug: $slug
        description: $description
        tags: $tags
        playbookSlug: $playbookSlug
      ) {
        play {
          id
          name
          slug
        }
        errors
      }
    }
  `

export const CREATE_PLAY = gql(generatePlayMutation('createPlay'))

export const AUTOSAVE_PLAY = gql(generatePlayMutation('autoSavePlay'))
