import { gql } from '@apollo/client'

export const UPDATE_USE_CASE_STEP_WORKFLOWS = gql`
  mutation UpdateUseCaseStepWorkflows(
    $slug: String!,
    $workflowsSlugs: [String!]!
  ) {
    updateUseCaseStepWorkflows(
      slug: $slug,
      workflowsSlugs: $workflowsSlugs
    ) {
      useCaseStep {
        id
        slug
        workflows {
          id
          slug
          imageFile
          name
        }
      }
      errors
    }
  }
`

export const UPDATE_USE_CASE_STEP_DATASETS = gql`
  mutation UpdateUseCaseStepDatasets(
    $slug: String!,
    $datasetsSlugs: [String!]!
  ) {
    updateUseCaseStepDatasets(
      slug: $slug,
      datasetsSlugs: $datasetsSlugs
    ) {
      useCaseStep {
        id
        slug
        datasets {
          id
          slug
          imageFile
          name
        }
      }
      errors
    }
  }
`

export const UPDATE_USE_CASE_STEP_PRODUCTS = gql`
  mutation UpdateUseCaseStepProducts(
    $slug: String!,
    $productSlugs: [String!]!
  ) {
    updateUseCaseStepProducts(
      slug: $slug,
      productSlugs: $productSlugs
    ) {
      useCaseStep {
        id
        slug
        products {
          slug
          imageFile
          name
        }
      }
      errors
    }
  }
`

export const UPDATE_USE_CASE_STEP_BUILDING_BLOCKS = gql`
  mutation UpdateUseCaseStepBuildingBlocks (
    $buildingBlockSlugs: [String!]!
    $slug: String!
  ) {
    updateUseCaseStepBuildingBlocks (
      buildingBlockSlugs: $buildingBlockSlugs
      slug: $slug
    ) {
      useCaseStep {
        id
        slug
        buildingBlocks {
          id
          slug
          name
          imageFile
        }
      }
      errors
    }
  }
`
