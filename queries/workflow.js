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

export const WORKFLOWS_QUERY = gql`
  query SearchWorkflows(
    $first: Int,
    $after: String,
    $sdgs: [String!],
    $useCases: [String!],
    $search: String!
  ) {
    searchWorkflows(
      first: $first,
      after: $after,
      sdgs: $sdgs,
      useCases: $useCases,
      search: $search
    ) {
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
        id
        name
        slug
        imageFile
        useCaseSteps {
          id
          slug
          name
          useCase {
            id
            slug
            name
            imageFile
          }
        }
        buildingBlocks {
          id
          slug
          name
          imageFile
        }
      }
    }
  }
`
