import { gql } from '@apollo/client'

export const CREATE_USE_CASE_STEP = gql`
  mutation CreateUseCaseStep(
    $name: String!,
    $slug: String!,
    $stepNumber: Int!,
    $description: String
    $useCaseId: Int!
  ) {
    createUseCaseStep(
      name: $name
      slug: $slug
      stepNumber: $stepNumber
      description: $description
      useCaseId: $useCaseId
    ) {
      useCaseStep {
        id
        slug
        useCase {
          id
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
        id
        slug
        sdgTargets {
          id
          name
          targetNumber
          sdgNumber
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
        id
        tags
      }
      errors
    }
  }
`

export const DELETE_USE_CASE = gql`
  mutation DeleteUseCase($id: ID!) {
    deleteUseCase(id: $id) {
      useCase {
       id
       slug
       name
      }
      errors
    }
  }
`
