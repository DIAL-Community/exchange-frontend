import { gql } from '@apollo/client'

export const WORKFLOW_SEARCH_QUERY = gql`
  query Workflows($search: String!) {
    workflows(search: $search) {
      id
      name
      slug
    }
  }
`

export const WORKFLOW_DETAIL_QUERY = gql`
  query Workflow($slug: String!) {
    workflow(slug: $slug) {
      id
      name
      slug
      imageFile
      workflowDescription {
        description
        locale
      }
      useCaseSteps {
        slug
        name
        useCase {
          slug
          name
          maturity
          imageFile
        }
      }
      buildingBlocks {
        name
        slug
        maturity
        imageFile
      }
    }
  }
`
