import { gql } from '@apollo/client'

export const UPDATE_MOVE_ORDER = gql`
  mutation (
    $playSlug: String!
    $moveSlug: String!
    $operation: String!
    $distance: Int
  ) {
    updateMoveOrder (
      playSlug: $playSlug
      moveSlug: $moveSlug
      operation: $operation
      distance: $distance
    ) {
      move {
        id
        slug
        name
      }
      errors
    }
  }
`
