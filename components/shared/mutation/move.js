import { gql } from '@apollo/client'

export const CREATE_MOVE_RESOURCE = gql`
  mutation (
    $playSlug: String!,
    $moveSlug: String!,
    $url: String!,
    $name: String!,
    $description: String!,
    $index: Int!
  ) {
    createMoveResource(
      playSlug: $playSlug,
      moveSlug: $moveSlug,
      url: $url,
      name: $name,
      description: $description,
      index: $index
    ) {
      move {
        id
        name
        slug
      }
      errors
    }
  }
`
const generateMutationText = (mutationFunc) => {
  return `
    mutation (
      $playSlug: String!
      $moveSlug: String!
      $owner: String!
      $name: String!
      $description: String!
      $resources: JSON!
    ) {
      ${mutationFunc} (
        playSlug: $playSlug
        moveSlug: $moveSlug
        owner: $owner
        name: $name
        description: $description
        resources: $resources
      ) {
        move {
          id
          name
          slug
        }
        errors
      }
    }
  `
}

export const CREATE_MOVE = gql(generateMutationText('createMove'))
export const AUTOSAVE_MOVE = gql(generateMutationText('autoSaveMove'))

export const UNASSIGN_PLAY_MOVE = gql`
  mutation DeletePlayMove ($playSlug: String!, $moveSlug: String!) {
    deletePlayMove(playSlug: $playSlug, moveSlug: $moveSlug) {
      play {
        id
      }
      errors
    }
  }
`
