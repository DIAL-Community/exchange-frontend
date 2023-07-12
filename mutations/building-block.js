import { gql } from '@apollo/client'

export const CREATE_BUILDING_BLOCK = gql`
  mutation CreateBuildingBlock(
    $name: String!
    $slug: String!
    $maturity: String!
    $category: String
    $imageFile: Upload
    $description: String!
    $specUrl: String
  ) {
    createBuildingBlock(
      name: $name
      slug: $slug
      maturity: $maturity
      category: $category
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
    $workflowSlugs: [String!]!
  ) {
    updateBuildingBlockWorkflows(
      slug: $slug,
      workflowSlugs: $workflowSlugs
    ) {
      buildingBlock {
        slug
        workflows {
          slug
          imageFile
          name
        }
      }
      errors
    }
  }
`

export const UPDATE_BUILDING_BLOCK_PRODUCTS = gql`
 mutation UpdateBuildingBlockProducts(
    $slug: String!
    $mappingStatus: String!
    $productSlugs: [String!]!
  ) {
    updateBuildingBlockProducts(
      slug: $slug
      mappingStatus: $mappingStatus
      productSlugs: $productSlugs
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
      errors
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
      errors
    }
  }
`
