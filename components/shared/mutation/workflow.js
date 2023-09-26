import { gql } from '@apollo/client'

export const UPDATE_WORKFLOW_BUILDING_BLOCKS = gql`
  mutation UpdateWorkflowBuildingBlocks (
    $buildingBlockSlugs: [String!]!
    $slug: String!
  ) {
    updateWorkflowBuildingBlocks (
      buildingBlockSlugs: $buildingBlockSlugs
      slug: $slug
    ) {
      workflow {
        id
        name
        slug
        buildingBlocks {
          id
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
        id
        name
        slug
        imageFile
        workflowDescription {
          id
          description
          locale
        }
      }
      errors
    }
  }
`

export const DELETE_WORKFLOW = gql`
  mutation DeleteWorkflow($id: ID!) {
    deleteWorkflow(id: $id) {
      workflow {
       id
       slug
       name
      }
      errors
    }
  }
`

