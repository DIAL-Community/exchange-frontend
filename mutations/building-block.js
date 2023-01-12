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

export const UPDATE_BUILDING_BLOCK_WORKFLOWS = gql`
   mutation UpdateBuildingBlockWorkflows(
    $slug: String!
    $workflowsSlugs: [String!]!
  ) {
    updateBuildingBlockWorkflows(
      slug: $slug,
      workflowsSlugs: $workflowsSlugs
    ) {
      buildingBlock {
        slug
        workflows {
          slug
          imageFile
          name
        }
      }
    }
  }
`

export const UPDATE_BUILDING_BLOCK_PRODUCTS = gql`
 mutation UpdateBuildingBlockProducts(
    $slug: String!
    $mappingStatus: String!
    $productsSlugs: [String!]!
  ) {
    updateBuildingBlockProducts(
      slug: $slug
      mappingStatus: $mappingStatus
      productsSlugs: $productsSlugs
    ) {
      buildingBlock {
        slug
        products {
          slug
          imageFile
          name
          buildingBlocksMappingStatus
        }
      }
    }
  }
`

export const DELETE_BUILDING_BLOCK = gql`
  mutation DeleteBuildingBlock($id: ID!) {
    deleteBuildingBlock(id: $id) {
      buildingBlock {
       id
       slug
       name
      }
    }
  }
`
