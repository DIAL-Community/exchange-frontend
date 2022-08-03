import { gql } from '@apollo/client'

export const UPDATE_WORKFLOW_BUILDING_BLOCKS = gql`
      mutation UpdateWorkflowBuildingBlocks (
        $buildingBlocksSlugs: [String!]!
        $slug: String!
        ) {
          updateWorkflowBuildingBlocks (
            buildingBlocksSlugs: $buildingBlocksSlugs
            slug: $slug
          ) {
            workflow {
              slug
              buildingBlocks {
                slug
                name
                imageFile
                maturity
              }
            }
            errors
          }
      }
`

export const CREATE_WORKFLOW = gql`
  mutation CreateWorkflow (
    $name: String!
    $slug: String!
    $imageFile: Upload
    $description: String!
  ) {
    createWorkflow (
      name: $name
      slug: $slug
      imageFile: $imageFile
      description: $description
    ) {
      workflow {
        slug
      }
      errors
    }
  }
`
