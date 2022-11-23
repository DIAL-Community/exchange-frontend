import { gql } from '@apollo/client'

export const CREATE_USE_CASE_STEP = gql`
  mutation CreateUseCaseStep(
    $name: String!,
    $slug: String!,
    $stepNumber: Int!,
    $description: String
    $useCaseId: Int!
    $markdownUrl: String
  ) {
    createUseCaseStep(
      name: $name
      slug: $slug
      stepNumber: $stepNumber
      description: $description
      useCaseId: $useCaseId
      markdownUrl: $markdownUrl
    ) {
      useCaseStep {
        slug
        useCase {
          slug
        }
      },
      errors
    }
  }
`

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
    $name: String!
    $slug: String!
    $sectorSlug: String!
    $maturity: String!
    $imageFile: Upload
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
      }
      errors
    }
  }
`

export const UPDATE_USE_CASE_TAGS = gql`
  mutation UpdateUseCaseTags(
    $slug: String!
    $tags: [String!]!
  ) {
    updateUseCaseTags(
      slug: $slug
      tags: $tags
    ) {
      useCase {
        tags
      }
      errors
    }  
  }
`
