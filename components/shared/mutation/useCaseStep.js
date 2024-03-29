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

export const UPDATE_USE_CASE_STEP_WORKFLOWS = gql`
  mutation UpdateUseCaseStepWorkflows(
    $slug: String!
    $workflowSlugs: [String!]!
  ) {
    updateUseCaseStepWorkflows(
      slug: $slug
      workflowSlugs: $workflowSlugs
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
    $slug: String!
    $datasetSlugs: [String!]!
  ) {
    updateUseCaseStepDatasets(
      slug: $slug
      datasetSlugs: $datasetSlugs
    ) {
      useCaseStep {
        id
        slug
        datasets {
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

export const UPDATE_USE_CASE_STEP_PRODUCTS = gql`
  mutation UpdateUseCaseStepProducts(
    $slug: String!
    $productSlugs: [String!]!
  ) {
    updateUseCaseStepProducts(
      slug: $slug
      productSlugs: $productSlugs
    ) {
      useCaseStep {
        id
        slug
        products {
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
          maturity
        }
      }
      errors
    }
  }
`
