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

export const UPDATE_USE_CASE_STEP_PRODUCTS = gql`
  mutation UpdateUseCaseStepProducts(
    $slug: String!,
    $productsSlugs: [String!]!
  ) {
    updateUseCaseStepProducts(
      slug: $slug,
      productsSlugs: $productsSlugs
    ) {
      useCaseStep {
        slug
        products {
          slug
          imageFile
          name
        }
      }
    }
  }
`
