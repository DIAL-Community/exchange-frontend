import { gql } from '@apollo/client'

const generatePlayMutation = (mutationName) => `
  mutation (
    $name: String!
    $slug: String!
    $description: String!
    $tags: [String!]
    $playbookSlug: String
    $productSlugs: [String!]
    $buildingBlockSlugs: [String!]
  ) {
    ${mutationName} (
      name: $name
      slug: $slug
      description: $description
      tags: $tags
      playbookSlug: $playbookSlug
      productSlugs: $productSlugs
      buildingBlockSlugs: $buildingBlockSlugs
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

export const UPDATE_PLAY_MOVES = gql`
  mutation UpdatePlayMoves (
    $moveSlugs: [String!]!
    $slug: String!
  ) {
    updatePlayMoves (
      moveSlugs: $moveSlugs
      slug: $slug
    ) {
      play {
        id
        name
        slug
        playMoves {
          id
          name
        }
      }
      errors
    }
  }
`
