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
