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
