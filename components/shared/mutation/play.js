import { gql } from '@apollo/client'

const generatePlayMutation = (mutationName, pathName) => `
  mutation ${mutationName} (
    $name: String!
    $slug: String!
    $owner: String!
    $description: String!
    $tags: [String!]
    $playbookSlug: String
    $productSlugs: [String!]
    $buildingBlockSlugs: [String!]
  ) {
    ${pathName} (
      name: $name
      slug: $slug
      owner: $owner
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

export const CREATE_PLAY = gql(generatePlayMutation('CreatePlay', 'createPlay'))
export const AUTOSAVE_PLAY = gql(generatePlayMutation('AutoSavePlay', 'autoSavePlay'))

export const UPDATE_PLAY_MOVES = gql`
  mutation UpdatePlayMoves (
    $moveSlugs: [String!]!
    $slug: String!
    $owner: String!
  ) {
    updatePlayMoves (
      moveSlugs: $moveSlugs
      slug: $slug
      owner: $owner
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
