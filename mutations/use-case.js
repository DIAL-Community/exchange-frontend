import { gql } from '@apollo/client'

export const UPDATE_USE_CASE_SDG_TARGETS = gql`
  mutation UpdateUseCaseSdgTargets (
    $sdgTargetsIds: [Int!]!
    $slug: String!
  ) {
    updateUseCaseSdgTargets (
      sdgTargetsIds: $sdgTargetsIds
      slug: $slug
    ) {
      useCase {
        slug
        sdgTargets {
          id
          name
          targetNumber
          sustainableDevelopmentGoal {
           slug
          }
        }
      }
      errors
    }
  }
`
