import { gql } from '@apollo/client'

export const CREATE_BUILDING_BLOCK = gql`
  mutation CreateBuildingBlock(
    $name: String!
    $slug: String!
    $maturity: String!
    $imageFile: Upload
    $description: String!
    $specUrl: String
  ) {
    createBuildingBlock(
      name: $name
      slug: $slug
      maturity: $maturity
      imageFile: $imageFile
      description: $description
      specUrl: $specUrl
    ) {
      buildingBlock {
        slug
      }
      errors
    }
  }
`
