import { gql } from '@apollo/client'

const generatePlayMutation = (mutationName, pathName) => `
  mutation ${mutationName} (
    $name: String!
    $slug: String!
    $owner: String!
    $draft: Boolean
    $tags: [String!]
    $description: String!
    $playbookSlug: String
    $productSlugs: [String!]
    $buildingBlockSlugs: [String!]
  ) {
    ${pathName} (
      name: $name
      slug: $slug
      tags: $tags
      owner: $owner
      draft: $draft
      description: $description
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

export const UPDATE_PLAY_DESCRIPTION = gql`
  mutation UpdateDescriptionEntity (
    $slug: String!
    $type: String!
    $owner: String!
    $description: String!
  ) {
    updateDescriptionEntity (
      slug: $slug
      type: $type
      owner: $owner
      fieldName: "description"
      parentSlug: null
      description: $description
    ) {
      errors
    }
  }
`
