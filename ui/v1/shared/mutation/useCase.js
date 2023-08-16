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
        name
        slug
        sdgTargets {
          id
          name
          targetNumber
          sdg {
            id
            name
            number
            imageFile
          }
        }
      }
      errors
    }
  }
`

export const UPDATE_USE_CASE_TAGS = gql`
  mutation UpdateUseCaseTags(
    $slug: String!
    $tagNames: [String!]!
  ) {
    updateUseCaseTags(
      slug: $slug
      tagNames: $tagNames
    ) {
      useCase {
        id
        name
        slug
        tags
      }
      errors
    }
  }
`
