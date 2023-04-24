import { gql } from '@apollo/client'

const generatePlayMutation = (mutationName) => `
  mutation (
    $name: String!
    $slug: String!
    $description: String!
    $tags: JSON!
    $moves: JSON!
    $playbookSlug: String
    $productSlugs: [String!]
    $buildingBlockSlugs: [String!]
  ) {
    ${mutationName} (
      name: $name
      slug: $slug
      description: $description
      tags: $tags
      moves: $moves
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
