import { gql } from '@apollo/client'

export const CREATE_USE_CASE = gql`
  mutation CreateUseCase(
    $name: String!
    $slug: String!
    $sectorSlug: String!
    $maturity: String!
    $imageFile: Upload
    $description: String!
    $markdownUrl: String
  ) {
    createUseCase(
      name: $name
      slug: $slug
      sectorSlug: $sectorSlug
      maturity: $maturity
      imageFile: $imageFile
      description: $description
      markdownUrl: $markdownUrl
    ) {
      useCase {
        id
        slug
        name
        maturity
      }
      errors
    }
  }
`

export const UPDATE_USE_CASE_SDG_TARGETS = gql`
  mutation UpdateUseCaseSdgTargets (
    $sdgTargetIds: [Int!]!
    $slug: String!
  ) {
    updateUseCaseSdgTargets (
      sdgTargetIds: $sdgTargetIds
      slug: $slug
    ) {
      useCase {
        id
        slug
        sdgTargets {
          id
          name
          targetNumber
          sdg {
            id
            name
            number
          }
        }
      }
      errors
    }
  }
`
