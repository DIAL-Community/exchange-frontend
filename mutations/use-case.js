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

export const CREATE_USE_CASE = gql`
  mutation CreateUseCase(
    $name: String!,
    $slug: String!,
    $sectorSlug: String!,
    $maturity: String!,
    $imageFile: Upload,
    $description: String!
  ) {
    createUseCase(
      name: $name
      slug: $slug
      sectorSlug: $sectorSlug
      maturity: $maturity
      imageFile: $imageFile
      description: $description
    ) {
      useCase {
        slug
      },
      errors
    }
  }
`
